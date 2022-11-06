// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/IGnosisSafe.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MarketPlaceStorage.sol";

interface IBorrowerContract {
    function feeReceiver() external view returns (address);

    function deposit(address tokenAddress, uint256 amount) external;

    function withdraw(address tokenAddress, uint256 amount) external;

    function owner() external view returns (address);
}

//TODO: Update the lender and borrower terms/concept used in this contract. In the Idle case, it would be staking and unstaking. In general, it would be buying and selling. In either case, we should clarify the docs.
/**
 * @title RBFVault
 * @notice Contract allowing Lender to secure royalty revenue streams
 * @dev Should be deployed per revenue stream.
 */
contract RBFVault {
    event RBFVaultActivated();
    event BalanceWithdrawn();
    event RBFVaultRefundInitiated();

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

    // If vault is not active after this timeout period then lender can withdraw the fund
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
        MarketPlaceStorage.MarketItem memory item,
        address _multisigGuard,
        address _underlyingToken
    ) payable {
        //TODO: Add require statements for invalid inputs
        name = item.name;
        feeCollector = item.feeCollector;
        multiSig = item.multiSig;
        revenuePct = item.revenuePct;
        price = item.soldPrice;
        expAmount = item.expAmount;
        borrower = item.seller;
        lender = item.buyer;

        underlyingToken = _underlyingToken;
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
        require(isFeeCollectorUpdated(), "FEE_COLLECTOR_RECEIVER_NOT_UPDATED");

        require(isMultisigGuardAdded(), "MULTISIG_GUARD_NOT_IN_PLACE");

        require(
            isMultisigOwnsTheRevenueContract(),
            "REVENUE_CONTRACT_NOT_OWNED_BY_PROVIDED_MULTISIG"
        );

        return true;
    }

    /**
     * @dev Check if the fee collector is updated
     */
    function isFeeCollectorUpdated() public view returns (bool) {
        return IBorrowerContract(feeCollector).feeReceiver() == address(this);
    }

    /**
     * @dev Check if the provided multi-sig address is the revenue contract owner
     */
    function isMultisigOwnsTheRevenueContract() public view returns (bool) {
        return IBorrowerContract(feeCollector).owner() == multiSig;
    }

    /**
     * @dev Check if cinch multi-sig guard is added
     */
    function isMultisigGuardAdded() public view returns (bool) {
        // TODO- Uncomment the line below ?
        //return GnosisSafe(multiSig).getGuard() == multisigGuard;
        return true;
    }

    //TODO: should this function be bounded to be called by the borrower only?
    /**
     * @dev Activates the vault after the required condition has been met and transfer funds to the borrower.
     */
    function activate() external {
        require(status == Status.Pending, "VAULT_STATUS_NEED_TO_BE_'PENDING'");

        require(isReadyToActivate(), "VAULT_ACTIVATION_TERMS_NOT_MET");

        status = Status.Active;
        vaultActivationDate = block.timestamp;

        deposit();

        emit RBFVaultActivated();
    }

    /**
     * @dev Deposit the agreed amount to the feeCollector
     */
    function deposit() private {
        IERC20(underlyingToken).approve(feeCollector, price);
        IBorrowerContract(feeCollector).deposit(underlyingToken, price);
    }

    //TODO: bound this function to be called by the lender only?
    //TODO: add condition to block un-authorized withdraws
    //TODO: is withdraw expected to be a one time function ?
    //TODO: how about withdrawing the revenue share ?
    /**
     * @dev Withdraw the agreed amount from the feeCollector
     */
    function withdraw() external {
        IBorrowerContract(feeCollector).withdraw(underlyingToken, price);
        IERC20(underlyingToken).transfer(lender, price);
        emit BalanceWithdrawn();
    }

    /**
     * @dev getVaultBalance
     */
    function getVaultBalance() external view returns (uint256) {
        return IERC20(underlyingToken).balanceOf(address(this));
    }

    /**
     * @return The current state of the vault.
     */
    function vaultStatus() external view returns (Status) {
        return status;
    }

    //TODO: should this function be bounded to be called by the lender only ?
    /**
     * @dev Allows the lender to withdrawn deposited money if vault doesn't get activated on agreed upon time
     */
    function refundTheLender() external {
        require(
            status == Status.Pending,
            "CAN_REFUND_ONLY_WHEN_STATUS_IS_'PENDING'"
        );

        require(
            block.timestamp > (vaultDeployDate + TIMEOUT_PERIOD),
            "TIMEOUT_PERIOD_NOT_REACHED"
        );

        status = Status.Canceled;
        IERC20(underlyingToken).transfer(lender, price);

        emit RBFVaultRefundInitiated();
    }
}
