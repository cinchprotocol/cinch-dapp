// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/IGnosisSafe.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MarketPlaceStorage.sol";

//import "@openzeppelin/contracts/access/Ownable.sol";

//TODO - Specific to the idle at the moment but should we make this dyamic to work different protocols?
interface IBorrowerContract {
    function feeReceiver() external view returns (address);

    function deposit(address tokenAddress, uint256 amount) external;
}

//TODO: Update the lender and borrower terms/concept used in this contract. In the Idle case, it would be staking and unstaking. In general, it would be buying and selling. In either case, we should clarify the docs.
/**
 * @title RBFVault
 * @notice Contract allowing Lender to secure royalty revenue streams
 * @dev Should be deployed per revenue stream.
 */
contract RBFVault {
    event RBFVaultActivated();

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

    uint256 public constant REVENUE_PERIOD = 52 weeks; //TODO: remove if it is not being used
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

        //TODO: emit RBFVaultCreated event ?
    }

    /**
     * @dev Check if the terms are satisfied
     */
    function isTermsSatisfied() public view returns (bool) {
        // Todo - check fee collector and multi-sig
    }

    //TODO: Verify the association of the Multi-sig and the feeCollector ?
    /**
     * @dev Check if the vault is ready to be activated
     */
    function isReadyToActivate() public view returns (bool) {
        require(isFeeCollectorUpdated(), "FEE_COLLECTOR_RECEIVER_NOT_UPDATED"); 

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

    //TODO: should this function be bounded to be called by the borrower only?
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

        uint256 amount = price / 10**12;
        IERC20(underlyingToken).approve(feeCollector, amount);
        IBorrowerContract(feeCollector).deposit(underlyingToken, amount);
        emit RBFVaultActivated();
    }

    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
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
            !isTermsSatisfied(),
            "Vault: Collection already owned by the vault" //TODO: clarify revert reason
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

        //TODO: emit Refunded event
    }
}
