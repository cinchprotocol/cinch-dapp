// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
//import "@openzeppelin/contracts/utils/Address.sol";

import "./FeeSplitterStorage.sol";

/**
 * @title FeeSplitter
 * @dev This contract allows to split ERC20 payments among a group of accounts. The sender does not need to be aware
 * that the tokens will be split in this way, since it is handled transparently by the contract.
 *
 * The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each
 * account to a number of shares. Of all the Ether that this contract receives, each account will then be able to claim
 * an amount proportional to the percentage of total shares they were assigned. The distribution of shares is set when 
 * the updateShares function is being called, which is expected periodically on a daily basis.
 *
 * `FeeSplitter` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
 * accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
 * function.
 *
 * NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and
 * tokens that apply fees during transfers, are likely to not be supported as expected.
 */
contract FeeSplitter is FeeSplitterStorage, Context, Ownable, Pausable, ReentrancyGuard {

    event PayeeAdded(address account);

    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    uint256 private _totalShares;
    uint256 private _totalReleased;

    mapping(address => uint256) private _shares;
    mapping(address => uint256) private _released;
    
    mapping(IERC20 => uint256) private _erc20TotalReleased;
    mapping(IERC20 => mapping(address => uint256)) private _erc20Released;


    //======

    using EnumerableSet for EnumerableSet.AddressSet;

    /**
     * @dev Creates an instance of `FeeSplitter` where each account in `payees` is assigned the number of shares at
     * the matching position in the `shares` array.
     *
     * All addresses in `payees` must be non-zero. Both arrays must have the same non-zero length, and there must be no
     * duplicates in `payees`.
     */
    constructor(address cinchPxAddress, address protocolAddress, address[] memory supportedERC20Addresses, address protocolPayee, address[] memory cinchPxPayees) payable {
        require(cinchPxAddress != address(0), "cinchPxAddress is zero");
        require(protocolAddress != address(0), "protocolAddress is zero");
        require(supportedERC20Addresses.length > 0, "supportedERC20Addresses is empty");
        require(protocolPayee != address(0), "protocolPayee_ is zero");
        require(cinchPxPayees.length > 0, "cinchPxPayees is empty");

        _cinchPxAddress = cinchPxAddress;
        _protocolAddress = protocolAddress;
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

        IERC20 token = IERC20(tokenAddress);
        _lastFeeSplitterBalance[token] = token.balanceOf(address(this));

        emit SupportedERC20Added(tokenAddress);
    }

    /**
     * @dev Add a new cinchPxPayee to the contract.
     * @param cinchPxPayee The address of the cinchPxPayee to add.
     */
    function addCinchPxPayee(address cinchPxPayee) public onlyOwner whenNotPaused {
        require(cinchPxPayee != address(0), "cinchPxPayee is zero");
        require(_cinchPxPayeeSet.add(cinchPxPayee), "cinchPxPayee already exists");

        _lastCinchPxTVL[cinchPxPayee] = _getCinchPxTVL(cinchPxPayee);

        /*
        //fill the lastERC20Balance mapping
        address[] memory supportedERC20Addresses = _supportedERC20Set.values();
        for (uint256 i = 0; i < supportedERC20Addresses.length; i++) {
            IERC20 token = IERC20(supportedERC20Addresses[i]);
            _lastInternalBalance[token][cinchPxPayee] = 0;
        }
        */

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
    function getSupportedERC20Set() external view returns (address[] memory erc20s)
    {
        erc20s = _supportedERC20Set.values();
    }

    /**
     * @dev Getter for the cinchPxPayeeSet.
     */
    function getCinchPxPayeeSet() external view returns (address[] memory payees)
    {
        payees = _cinchPxPayeeSet.values();
    }

    /**
     * @dev Pause the contract from updating rev-share and withdrawing.
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

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     */
    receive() external payable virtual {
        emit PaymentReceived(_msgSender(), msg.value);
    }

    function _processFeeSplitOfERC20(IERC20 token, uint256 lastProtocolTVL, uint256 protocolTVL) private whenNotPaused {
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

                //uint256 lastInternalBalance = _lastInternalBalance[token][payee];
                uint256 balanceToAdd = (unProcessedBalance * lastCinchPxTVL / (lastProtocolTVL + lastProtocolTVL)) + (unProcessedBalance * cinchPxTVL / (protocolTVL + protocolTVL));
                _lastInternalBalance[token][payee] = _lastInternalBalance[token][payee] + balanceToAdd;
                totalCinchPxBalanceAdded += balanceToAdd;

                emit InternalBalanceUpdated(payee, address(token), _lastInternalBalance[token][payee]);
            }

            //update the internal balance of the protocolPayee
            uint256 protocolBalanceToAdd = unProcessedBalance - totalCinchPxBalanceAdded;
            _lastInternalBalance[token][_protocolPayee] = _lastInternalBalance[token][_protocolPayee] + protocolBalanceToAdd;
            emit InternalBalanceUpdated(_protocolPayee, address(token), _lastInternalBalance[token][_protocolPayee]);

            //update totalProcessed
            totalProcessed[token] += unProcessedBalance;
            emit TotalProcessedUpdated(address(token), totalProcessed[token]);
        }
    }

    function _getProtocolTVL() private view returns (uint256) {
        //return IProtocol(_protocolAddress).getTotalValueLocked();
        return 0;
    }

    function _getCinchPxTVL(address cinchPxPayee) private view returns (uint256) {
        //return ICinchPx(_cinchPxAddress).getTotalValueLocked();
        return 0;
    }

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
            _processFeeSplitOfERC20(IERC20(supportedERC20s[i]), lastProtocolTVL, protocolTVL);
        }

        emit FeeSplitProcessed(protocolTVL);
    }

    //======




    /**
     * @dev Getter for the total shares held by payees.
     */
    function totalShares() public view returns (uint256) {
        return _totalShares;
    }

    /**
     * @dev Getter for the total amount of Ether already released.
     */
    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }

    /**
     * @dev Getter for the total amount of `token` already released. `token` should be the address of an IERC20
     * contract.
     */
    function totalReleased(IERC20 token) public view returns (uint256) {
        return _erc20TotalReleased[token];
    }

    /**
     * @dev Getter for the amount of shares held by an account.
     */
    function shares(address account) public view returns (uint256) {
        return _shares[account];
    }

    /**
     * @dev Getter for the amount of Ether already released to a payee.
     */
    function released(address account) public view returns (uint256) {
        return _released[account];
    }

    /**
     * @dev Getter for the amount of `token` tokens already released to a payee. `token` should be the address of an
     * IERC20 contract.
     */
    function released(IERC20 token, address account) public view returns (uint256) {
        return _erc20Released[token][account];
    }

    /**
     * @dev Getter for the amount of payee's releasable Ether.
     */
    function releasable(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased();
        return _pendingPayment(account, totalReceived, released(account));
    }

    /**
     * @dev Getter for the amount of payee's releasable `token` tokens. `token` should be the address of an
     * IERC20 contract.
     */
    function releasable(IERC20 token, address account) public view returns (uint256) {
        uint256 totalReceived = token.balanceOf(address(this)) + totalReleased(token);
        return _pendingPayment(account, totalReceived, released(token, account));
    }

    /**
     * @dev Triggers a transfer to `account` of the amount of Ether they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    /*
    function release(address payable account) public virtual {
        require(_shares[account] > 0, "FeeSplitter: account has no shares");

        uint256 payment = releasable(account);

        require(payment != 0, "FeeSplitter: account is not due payment");

        // _totalReleased is the sum of all values in _released.
        // If "_totalReleased += payment" does not overflow, then "_released[account] += payment" cannot overflow.
        _totalReleased += payment;
        unchecked {
            _released[account] += payment;
        }

        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }
    */

    /**
     * @dev Triggers a transfer to `account` of the amount of `token` tokens they are owed, according to their
     * percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20
     * contract.
     */
    function release(IERC20 token, address account) public virtual {
        require(_shares[account] > 0, "FeeSplitter: account has no shares");

        uint256 payment = releasable(token, account);

        require(payment != 0, "FeeSplitter: account is not due payment");

        // _erc20TotalReleased[token] is the sum of all values in _erc20Released[token].
        // If "_erc20TotalReleased[token] += payment" does not overflow, then "_erc20Released[token][account] += payment"
        // cannot overflow.
        _erc20TotalReleased[token] += payment;
        unchecked {
            _erc20Released[token][account] += payment;
        }

        SafeERC20.safeTransfer(token, account, payment);
        emit ERC20PaymentReleased(token, account, payment);
    }

    /**
     * @dev internal logic for computing the pending payment of an `account` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(
        address account,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return (totalReceived * _shares[account]) / _totalShares - alreadyReleased;
    }
}
