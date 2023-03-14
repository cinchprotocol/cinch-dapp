// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "./FeeSplitterStorage.sol";
import "./interfaces/ICinchPx.sol";

/**
 * @title FeeSplitter
 * @dev This contract allows to split ERC20 payments among a group of payees, according to their corresponding TVL.
 * The sender does not need to be aware that the tokens will be split in this way, since it is handled transparently by the contract.
 *
 * Upon calling processFeeSplit, updated TVL values are fetched from CinchPx and SampleProtocol.
 * Then the internal balances of each payee are updated and the funds are pending to be claimed.
 * This fee splitter is not tracking the changes in TVL in real time.
 * It simply takes the average value between the TVL in previous processFeeSplit call, and the current TVL.
 * Where processFeeSplit is expected to be executed daily.
 *
 * `FeeSplitter` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
 * accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
 * function.
 *
 * NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and
 * tokens that apply fees during transfers, are likely to not be supported as expected.
 */
contract FeeSplitter is FeeSplitterStorage, Initializable, ContextUpgradeable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    event SupportedERC20Added(address tokenAddress);
    event CinchPxPayeeAdded(address cinchPxPayee);
    event InternalBalanceUpdated(IERC20Upgradeable indexed token, address payee, uint256 balance);
    event TotalProcessedUpdated(IERC20Upgradeable indexed token, uint256 totalProcessed);
    event FeeSplitProcessed(uint256 protocolTVL);
    event ERC20PaymentReleased(IERC20Upgradeable indexed token, address to, uint256 amount);
    event ETHPaymentReceived(address from, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        //_disableInitializers();
    }

    /**
     * @dev Initialize an instance of `FeeSplitter`
     * @param cinchPxAddress The address of the target CinchPx contract.
     * @param supportedERC20Addresses Array of ERC20 token address to be supported.
     * @param protocolPayee The wallet address of the target protocol where funds will be splitted to.
     * @param cinchPxPayees Array of wallet addresses of the target payee (besides protocolPayee) where funds will be splitted to. Can be updated with addCinchPxPayee by contract owner.
     */
    function initialize(address cinchPxAddress, address[] memory supportedERC20Addresses, address protocolPayee, address[] memory cinchPxPayees) public initializer {
        __Context_init();
        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        require(cinchPxAddress != address(0), "cinchPxAddress is zero");
        require(supportedERC20Addresses.length > 0, "supportedERC20Addresses is empty");
        require(protocolPayee != address(0), "protocolPayee_ is zero");
        require(cinchPxPayees.length > 0, "cinchPxPayees is empty");

        _cinchPxAddress = cinchPxAddress;
        _lastProtocolTVL = _getProtocolTVL();
        for (uint256 i = 0; i < supportedERC20Addresses.length; i++) {
            _addSupportedERC20(supportedERC20Addresses[i]);
        }
        _protocolPayee = protocolPayee;
        for (uint256 j = 0; j < cinchPxPayees.length; j++) {
            addCinchPxPayee(cinchPxPayees[j]);
        }
    }

    /**
     * @dev Add a new supported ECR20 to the contract.
     * @param tokenAddress The address of the ERC20 to add.
     */
    function _addSupportedERC20(address tokenAddress) private {
        require(tokenAddress != address(0), "tokenAddress is zero");
        require(_supportedERC20Set.add(tokenAddress), "tokenAddress already exists");

        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        _lastFeeSplitterBalance[token] = token.balanceOf(address(this));

        emit SupportedERC20Added(tokenAddress);
    }

    /**
     * @dev Add a new cinchPxPayee to the contract.
     * @param cinchPxPayee The address of the cinchPxPayee to add.
     * onlyOwner
     */
    function addCinchPxPayee(address cinchPxPayee) public whenNotPaused onlyOwner {
        require(cinchPxPayee != address(0), "cinchPxPayee is zero");
        require(_cinchPxPayeeSet.add(cinchPxPayee), "cinchPxPayee already exists");

        _lastCinchPxTVL[cinchPxPayee] = _getCinchPxTVL(cinchPxPayee);

        emit CinchPxPayeeAdded(cinchPxPayee);
    }

    /**
     * @dev Getter for the protocolPayee.
     */
    function getProtocolPayee() external view returns (address) {
        return _protocolPayee;
    }

    /**
     * @dev Getter for the supportedERC20Set.
     */
    function getSupportedERC20Set() external view returns (address[] memory tokenAddresses)
    {
        tokenAddresses = _supportedERC20Set.values();
    }

    /**
     * @dev Getter for the cinchPxPayeeSet.
     */
    function getCinchPxPayeeSet() external view returns (address[] memory payees)
    {
        payees = _cinchPxPayeeSet.values();
    }

    /**
     * @dev Private function for processing the fee split on the target token.
     * @param token The address of the target ERC20 token.
     * @param lastProtocolTVL last protocol TVL from previous processFeeSplit call.
     * @param protocolTVL current protocol TVL.
     * This constract is simply taking the average of the TVL between the last processFeeSplit call and the current processFeeSplit call.
     */
    function _processFeeSplitOfERC20(IERC20Upgradeable token, uint256 lastProtocolTVL, uint256 protocolTVL) private whenNotPaused {
        //calculate the unprocessed balance of the target token
        uint256 currentBalance = token.balanceOf(address(this));
        bool shouldProcess = (currentBalance > _lastFeeSplitterBalance[token]);
        uint256 unProcessedBalance = currentBalance - _lastFeeSplitterBalance[token];
        _lastFeeSplitterBalance[token] = currentBalance; //update the _lastFeeSplitterBalance ASAP to prevent reentrancy

        if (shouldProcess) {
            uint256 totalCinchPxBalanceAdded = 0;
            //update the internal balance of each cinchPxPayee
            address[] memory cinchPxPayees = _cinchPxPayeeSet.values();
            for (uint256 i = 0; i < cinchPxPayees.length; i++) {
                address payee = cinchPxPayees[i];

                uint256 lastCinchPxTVL = _lastCinchPxTVL[payee];
                uint256 cinchPxTVL = _getCinchPxTVL(payee);
                _lastCinchPxTVL[payee] = cinchPxTVL; //update the _lastCinchPxTVL ASAP to prevent reentrancy

                uint256 balanceToAdd = (unProcessedBalance * lastCinchPxTVL / (lastProtocolTVL + lastProtocolTVL)) + (unProcessedBalance * cinchPxTVL / (protocolTVL + protocolTVL));
                _internalBalance[token][payee] = _internalBalance[token][payee] + balanceToAdd;
                totalCinchPxBalanceAdded += balanceToAdd;
                _totalSplittedTo[token][payee] += balanceToAdd;
            }

            //update the internal balance of the protocolPayee
            uint256 protocolBalanceToAdd = unProcessedBalance - totalCinchPxBalanceAdded;
            _internalBalance[token][_protocolPayee] = _internalBalance[token][_protocolPayee] + protocolBalanceToAdd;
            _totalSplittedTo[token][_protocolPayee] += protocolBalanceToAdd;
            emit InternalBalanceUpdated(token, _protocolPayee, _internalBalance[token][_protocolPayee]);

            //update _totalProcessed
            _totalProcessed[token] += unProcessedBalance;
            emit TotalProcessedUpdated(token, _totalProcessed[token]);
        } else {
            //update the _lastCinchPxTVL of each cinchPxPayee
            address[] memory cinchPxPayees = _cinchPxPayeeSet.values();
            for (uint256 i = 0; i < cinchPxPayees.length; i++) {
                address payee = cinchPxPayees[i];
                _lastCinchPxTVL[payee] = _getCinchPxTVL(payee);
            }
        }
    }

    /**
     * @dev Get the updated protocol TVL from the target protocol contract address.
     */
    function _getProtocolTVL() private view returns (uint256) {
        return ICinchPx(_cinchPxAddress).getYieldSourceVaultTotalShares();
    }

    /**
     * @dev Get the updated CinchPx TVL from the target CinchPx contract address.
     * @param cinchPxPayee The address of the CinchPx payee.
     * For now, this contract is using the cinchPxPayee address as the hash key to get the TVL from CinchPx. 
     */
    function _getCinchPxTVL(address cinchPxPayee) private view returns (uint256) {
        return ICinchPx(_cinchPxAddress).getTotalValueLocked(cinchPxPayee);
    }

    /**
     * @dev The major function for processing the split of any unprocessed funds since last call.
     * Expected to be executed daily.
     * It will also be executed upon any release call (funds withdrawal).
     */
    function processFeeSplit() public whenNotPaused nonReentrant {
        //get the updated protocolTVL
        uint256 protocolTVL = _getProtocolTVL();
        require(protocolTVL > 0, "protocolTVL is zero");
        uint256 lastProtocolTVL = _lastProtocolTVL;
        _lastProtocolTVL = protocolTVL;
        if (lastProtocolTVL == 0) {
            lastProtocolTVL = protocolTVL; //both lastProtocolTVL and protocolTVL are required to be larger than 0
        }

        //For each supported ERC20, process the fee split
        address[] memory supportedERC20s = _supportedERC20Set.values();
        for (uint256 i = 0; i < supportedERC20s.length; i++) {
            _processFeeSplitOfERC20(IERC20Upgradeable(supportedERC20s[i]), lastProtocolTVL, protocolTVL);
        }

        emit FeeSplitProcessed(protocolTVL);
    }

    /**
     * @dev Getter for the internalBalance of token available to a payee. 
     * @param tokenAddress ERC20 token address.
     * @param payee The address of the payee.
     */
    function getInternalBalance(address tokenAddress, address payee) external view returns (uint256) {
        return _internalBalance[IERC20Upgradeable(tokenAddress)][payee];
    }

    /**
     * @dev Getter for the totalProcessed. 
     * @param tokenAddress ERC20 token address.
     */
    function getTotalProcessed(address tokenAddress) external view returns (uint256) {
        return _totalProcessed[IERC20Upgradeable(tokenAddress)];
    }

    /**
     * @dev Getter for the totalSplittedTo. 
     * @param tokenAddress ERC20 token address.
     * @param payee The address of the payee.
     */
    function getTotalSplittedTo(address tokenAddress, address payee) external view returns (uint256) {
        return _totalSplittedTo[IERC20Upgradeable(tokenAddress)][payee];
    }

    /**
     * @dev Getter for the totalReleased. 
     * @param tokenAddress ERC20 token address.
     */
    function getTotalReleased(address tokenAddress) external view returns (uint256) {
        return _totalReleased[IERC20Upgradeable(tokenAddress)];
    }

    /**
     * @dev Process the fee split, then triggers a transfer of the target balance of tokenAddress 
     * from this FeeSplitter contract to the target payee.
     * @param tokenAddress target ERC20 token address.
     * @param payee target payee.
     */
    function release(address tokenAddress, address payee) external whenNotPaused {
        require(tokenAddress != address(0), "tokenAddress is zero address");
        IERC20Upgradeable token = IERC20Upgradeable(tokenAddress);
        require(payee != address(0), "payee is zero address");
        require(_supportedERC20Set.contains(address(token)), "token is not supported");
        require((_protocolPayee == payee) || _cinchPxPayeeSet.contains(payee), "invalid payee");

        processFeeSplit();

        uint256 payment = _internalBalance[token][payee];
        require(payment > 0, "internalBalance is zero");
        _internalBalance[token][payee] = 0;
        _lastFeeSplitterBalance[token] = _lastFeeSplitterBalance[token] - payment;
        SafeERC20Upgradeable.safeTransfer(token, payee, payment);

        _totalReleased[token] += payment;

        emit ERC20PaymentReleased(token, payee, payment);
    }

    /**
     * @dev The Ether received will be logged with {ETHPaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     *
     * For now, this contract does not support splitting and releaseing ETH.
     */
    receive() external payable virtual {
        emit ETHPaymentReceived(_msgSender(), msg.value);
    }

    /**
     * @dev Pause the contract.
     * onlyOwner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract.
     * onlyOwner
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
