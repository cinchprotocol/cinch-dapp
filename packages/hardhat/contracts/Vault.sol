// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IGnosisSafe.sol";
import "./MarketPlaceStorage.sol";

interface IBorrowerContract {
    function feeReceiver() external view returns (address);

    function deposit(address tokenAddress, uint256 amount) external;

    function withdraw(address tokenAddress, uint256 amount) external;

    function owner() external view returns (address);

    function convertToAssets(uint256 shares)
        external
        view
        returns (uint256 assets);

    function balanceOf(address _address) external view returns (uint256 assets);
}

//TODO: Update the lender and borrower terms/concept used in this contract. In the Idle case, it would be staking and unstaking. In general, it would be buying and selling. In either case, we should clarify the docs.
/**
 * @title Vault
 * @notice Contract allowing Lender to secure royalty revenue streams
 * @dev Should be deployed per revenue stream.
 */
contract Vault is ERC4626Upgradeable {
    event VaultActivated();
    event VaultRefundInitiated();

    uint256 internal constant ONE_E_18 = 1e18;

    enum Status {
        Pending,
        Active,
        Expired,
        Canceled
    }

    struct ProtocolDetail {
        address feeCollector;
        address multiSig;
        uint256 expAmount;
    }
    ProtocolDetail public protocolDetail;
    address public multisigGuard;

    mapping(address => uint256) internal _totalValueLocked; // token => totalReleased

    // If vault is not active after this timeout period then lender can withdraw the fund
    uint256 public constant TIMEOUT_PERIOD = 1 weeks;

    Status public vaultStatus;
    uint256 public vaultActivationDate;
    uint256 public vaultDeployDate;

    uint256 internal storedTotalAssets;

    /// @notice vault initializer
    /// @param asset vault asset
    /// @param name ERC20 name of the vault shares token
    /// @param symbol ERC20 symbol of the vault shares token
    function initialize(
        address asset,
        string memory name,
        string memory symbol,
        ProtocolDetail memory _protocolDetail,
        address _multisigGuard
    ) public initializer {
        __ERC4626_init(IERC20Upgradeable(asset));
        __ERC20_init(name, symbol);

        protocolDetail.feeCollector = _protocolDetail.feeCollector;
        protocolDetail.multiSig = _protocolDetail.multiSig;
        protocolDetail.expAmount = _protocolDetail.expAmount;
        multisigGuard = _multisigGuard;

        vaultStatus = Status.Pending;
        vaultDeployDate = block.timestamp;
    }

    //TODO: should this function be bounded to be called by the borrower only?
    /**
     * @dev Activates the vault after the required condition has been met and transfer funds to the borrower.
     */
    function activate() external {
        _isValidState(Status.Pending);

        require(isReadyToActivate(), "VAULT_ACTIVATION_TERMS_NOT_MET");

        vaultStatus = Status.Active;
        vaultActivationDate = block.timestamp;

        emit VaultActivated();
    }

    function deposit(uint256 assets, address receiver)
        public
        virtual
        override
        returns (uint256)
    {
        _isValidState(Status.Active);

        uint256 shares = super.deposit(assets, receiver);
        afterDeposit(assets, 0);
        return shares;
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        _isValidState(Status.Active);

        beforeWithdraw(assets, 0);
        uint256 shares = super.withdraw(assets, receiver, owner);
        return shares;
    }

    function depositWithReferral(
        uint256 assets,
        address receiver,
        address referral
    ) public returns (uint256) {
        _isValidState(Status.Active);

        uint256 shares = super.deposit(assets, receiver);
        afterDeposit(assets, 0);
        _totalValueLocked[referral] += assets;
        return shares;
    }

    function withdrawWithReferral(
        uint256 assets,
        address receiver,
        address owner,
        address referral
    ) public returns (uint256) {
        _isValidState(Status.Active);

        beforeWithdraw(assets, 0);
        uint256 shares = super.withdraw(assets, receiver, owner);
        _totalValueLocked[referral] -= assets;
        return shares;
    }

    /*///////////////////////////////////////////////////////////////
                         INTERNAL HOOKS LOGIC
    //////////////////////////////////////////////////////////////*/

    function beforeWithdraw(uint256 amount, uint256) internal {
        storedTotalAssets -= amount;

        IBorrowerContract(protocolDetail.feeCollector).withdraw(
            asset(),
            amount
        );
    }

    function afterDeposit(uint256 amount, uint256) internal {
        IERC20(asset()).approve(protocolDetail.feeCollector, amount);
        IBorrowerContract(protocolDetail.feeCollector).deposit(asset(), amount);

        storedTotalAssets += amount;
    }

    /*//////////////////////////////////////////////////////////////
                            ACCOUNTING LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice Total amount of the underlying asset that
    /// is "managed" by Vault.
    function totalAssets() public view override returns (uint256) {
        return
            (getPriceOfYieldSource() * vaultBalanceAtYieldSource()) / ONE_E_18;
    }

    /**
     * @dev Returns the price of yield source token
     */
    function getPriceOfYieldSource() public view returns (uint256) {
        return
            IBorrowerContract(protocolDetail.feeCollector).convertToAssets(1);
    }

    /**
     * @dev Returns the price of yield source token
     */
    function vaultBalanceAtYieldSource() public view returns (uint256) {
        return
            IBorrowerContract(protocolDetail.feeCollector).balanceOf(
                address(this)
            );
    }

    /**
     * @dev Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal
     * scenario where all the conditions are met.
     */
    function convertToShares(uint256 assets)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return ((assets * ONE_E_18) / getPriceOfYieldSource());
    }

    /**
     * @dev Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal
     * scenario where all the conditions are met.
     */
    function convertToAssets(uint256 shares)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return (shares * getPriceOfYieldSource()) / ONE_E_18;
    }

    /************************/
    /*** Helper Functions ***/
    /************************/

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
        return
            IBorrowerContract(protocolDetail.feeCollector).feeReceiver() ==
            address(this);
    }

    /**
     * @dev Check if the provided multi-sig address is the revenue contract owner
     */
    function isMultisigOwnsTheRevenueContract() public view returns (bool) {
        return
            IBorrowerContract(protocolDetail.feeCollector).owner() ==
            protocolDetail.multiSig;
    }

    /**
     * @dev Check if cinch multi-sig guard is added
     */
    function isMultisigGuardAdded() public view returns (bool) {
        return GnosisSafe(protocolDetail.multiSig).getGuard() == multisigGuard;
    }

    // /**
    //  * @dev getVaultBalance
    //  */
    // function getVaultBalance() external view returns (uint256) {
    //     return IERC20(asset).balanceOf(address(this));
    // }

    /**
        @dev   Checks that the current state of the vault matches the provided state.
        @param _status Enum of desired vault status.
    */
    function _isValidState(Status _status) internal view {
        require(vaultStatus == _status, "INVALID_STATE");
    }

    /**
     * @dev Getter of _totalValueLocked
     */
    function getTotalValueLocked(address referral)
        external
        view
        returns (uint256)
    {
        return _totalValueLocked[referral];
    }
}
