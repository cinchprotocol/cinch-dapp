// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/IGnosisSafe.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

//TODO - Specific to the idle at the moment but should we make this dyamic to work different protocols?
interface IBorrowerContract {
    function feeReceiver() external view returns (address);
    function deposit(address tokenAddress, uint256 amount) external;
}

/**
 * @title RBFVault
 * @notice Contract allowing Lender to secure royalty revenue streams
 * @dev Should be deployed per revenue stream.
 */
contract RBFVault {
    enum Status {
        Pending,
        Active,
        Expired,
        Canceled
    }

    string public name;
    address public feeCollector;
    address public multiSig;
    uint256 public revenuePct;
    uint256 public price;
    uint256 public expAmount;
    address public borrower;
    address public lender;
    address public underlyingToken;
    address public multisigGuard;

    uint256 public constant REVENUE_PERIOD = 52 weeks;
    uint256 public constant TIMEOUT_PERIOD = 1 weeks;
    Status public status;
    uint256 public vaultActivationDate;
    uint256 public vaultDeployDate;

    /**
     *
     * @dev Configure data for revenue shares
     *
     */
    constructor(
        string memory _name,
        address _feeCollector,
        address _multiSig,
        uint256 _revenuePct,
        uint256 _price,
        uint256 _expAmount,
        address _borrower,
        address _lender,
        address _multisigGuard
        
    ) payable {
        name = _name;
        feeCollector = _feeCollector;
        multiSig = _multiSig;
        revenuePct = _revenuePct;
        price = _price;
        expAmount = _expAmount;
        borrower = _borrower;
        lender = _lender;

        underlyingToken = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
        multisigGuard = _multisigGuard;

        status = Status.Pending;
        vaultDeployDate = block.timestamp;
    }

    /**
     * @dev Check if the terms are satisfied
     */
    function isTermsSatisfied() public view returns (bool) {
        // Todo - check fee collector and multi-sig
    }

    /**
     * @dev Check if the vault is ready to be activated
     */
    function isReadyToActivate() public view returns (bool) {
        require(isFeeCollectorUpdated(), "FEE_COLLECTOR_NOT_IN_PLACE");

        require(isMultisigGuardAdded(), "MULTISIG_GUARD_NOT_IN_PLACE");

        return true;
    }

    /**
     * @dev Check if the fee collector is updated
     */
    function isFeeCollectorUpdated() public view returns (bool) {
        return IBorrowerContract(feeCollector).feeReceiver() == address(this);
    }

    /**
     * @dev Check if cinch multi-sig guard is added
     */
    function isMultisigGuardAdded() public view returns (bool) {
        // TODO- Remove
        //return GnosisSafe(multiSig).getGuard() == multisigGuard;
        return true;
    }

    /**
     * @dev Activates the vault after the onwership has been transferred to this vault. Also sends the agreed payment to the collection owner.
     After this any royalty recieved by this collection will be shared between both the party according to agreement
     */
    function activate() external {
        require(
            status == Status.Pending,
            "Vault: Only vault with'Pending' can be activated"
        );

        require(isReadyToActivate());

        status = Status.Active;
        vaultActivationDate = block.timestamp;

        IERC20(underlyingToken).approve(feeCollector, price);
        IBorrowerContract(feeCollector).deposit(underlyingToken, price);
    }

    function getVaultBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @return The current state of the vault.
     */
    function vaultStatus() public view returns (Status) {
        return status;
    }

    /**
     * @dev Allows the lender to withdrawn deposited money if vault doesn't get activated on agreed upon time
     */
    function refundTheLender() external {
        require(
            !isTermsSatisfied(),
            "Vault: Collection already owned by the vault"
        );

        require(
            status == Status.Pending,
            "Refund only available when vault is in 'Pending' status"
        );

        require(
            block.timestamp > (vaultDeployDate + TIMEOUT_PERIOD),
            "Refund only available after the timeout period"
        );

        status = Status.Canceled;
        Address.sendValue(payable(lender), address(this).balance);
    }
}
