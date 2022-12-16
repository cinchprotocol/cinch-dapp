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

interface IYieldSourceContract {
    function feeReceiver() external view returns (address);

    function deposit(address tokenAddress, uint256 amount) external;

    function withdraw(address tokenAddress, uint256 amount) external;

    function owner() external view returns (address);

    function priceAA() external view returns (uint256);

    function AATranche() external view returns (address);
}

/**
 * @title Vault
 * @notice Contract allows deposits and Withdrawals to Yield source product
 * @dev Should be deployed per yield source pool/vault.
 */
contract Vault is ERC4626Upgradeable, OwnableUpgradeable {
    event VaultActivated();

    enum Status {
        Pending,
        Active,
        Expired,
        Canceled
    }

    uint256 internal constant ONE_E_6 = 1e6;
    // ERC4626 vault address of yield source
    address public yieldSourceVault;
    // Address of Gnosis multi-sig which is the owner of yield soure vault
    address public multiSig;
    address public multisigGuard;
    // Partner referral -> Total value locked
    mapping(address => uint256) internal _totalValueLocked;

    Status public vaultStatus;
    uint256 public vaultActivationDate;
    uint256 public vaultDeployDate;

    uint256 internal storedTotalAssets;

    /// @notice vault initializer
    /// @param asset vault asset
    /// @param name ERC20 name of the vault shares token
    /// @param symbol ERC20 symbol of the vault shares token
    /// @param _yieldSourceVault vault address of yield source
    /// @param _multiSig Address of Gnosis multi-sig which is the owner of yield soure vault
    function initialize(
        address asset,
        string memory name,
        string memory symbol,
        address _yieldSourceVault,
        address _multiSig,
        address _multisigGuard
    ) public initializer {
        __ERC4626_init(IERC20Upgradeable(asset));
        __ERC20_init(name, symbol);

        yieldSourceVault = _yieldSourceVault;
        multiSig = _multiSig;
        multisigGuard = _multisigGuard;

        vaultStatus = Status.Pending;
        vaultDeployDate = block.timestamp;
    }

    /**
     * @dev Activates the vault after the required condition has been met and transfer funds to the borrower.
     */
    function activate() external 
    {
        _isValidState(Status.Pending);

        require(isReadyToActivate(), "VAULT_ACTIVATION_TERMS_NOT_MET");

        vaultStatus = Status.Active;
        vaultActivationDate = block.timestamp;

        emit VaultActivated();
    }

    /**
     * @dev openzeppelin ERC4626 deposit to include after Deposit hook
     */
    function deposit(uint256 assets, address receiver)
        public
        virtual
        override
        returns (uint256)
    {
        _isValidState(Status.Active);

        uint256 shares = super.deposit(assets, receiver);
        afterDeposit(assets);
        return shares;
    }

    /**
     * @dev openzeppelin ERC4626 withdraw to include before withdraw hook
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override returns (uint256) {
        _isValidState(Status.Active);

        beforeWithdraw(assets);
        uint256 shares = super.withdraw(assets, receiver, owner);
        return shares;
    }

    /**
     * @dev openzeppelin ERC4626 deposit to include after Deposit hook and referral tag
     */
    function depositWithReferral(
        uint256 assets,
        address receiver,
        address referral
    ) public returns (uint256) {
        _isValidState(Status.Active);
        require(referral != address(0), "ZERO_ADDRESS");

        uint256 shares = super.deposit(assets, receiver);
        afterDeposit(assets);
        _totalValueLocked[referral] += assets;
        return shares;
    }

    /**
     * @dev openzeppelin ERC4626 withdraw to include before withdraw hook and referral tag
     */
    function withdrawWithReferral(
        uint256 assets,
        address receiver,
        address owner,
        address referral
    ) public returns (uint256) {
        _isValidState(Status.Active);
        require(referral != address(0), "ZERO_ADDRESS");

        beforeWithdraw(assets);
        uint256 shares = super.withdraw(assets, receiver, owner);
        _totalValueLocked[referral] -= assets;
        return shares;
    }

    /*///////////////////////////////////////////////////////////////
                         INTERNAL HOOKS LOGIC
    //////////////////////////////////////////////////////////////*/

    function beforeWithdraw(uint256 amount) internal {
       // storedTotalAssets -= amount;

        IYieldSourceContract(yieldSourceVault).withdraw(asset(), amount);
    }

    function afterDeposit(uint256 amount) internal {
        IERC20(asset()).approve(yieldSourceVault, amount);
        IYieldSourceContract(yieldSourceVault).deposit(asset(), amount);

        //storedTotalAssets += amount;
    }

    /*//////////////////////////////////////////////////////////////
                            ACCOUNTING LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice Total amount of the underlying asset that
    /// is "managed" by Vault.
    function totalAssets() public view override returns (uint256) {
        return
            (getPriceOfYieldSource() * vaultBalanceAtYieldSource()) / ONE_E_6;
    }

    /**
     * @dev Returns the price of yield source token in underlyings
     */
    function getPriceOfYieldSource() public view returns (uint256) {
        return IYieldSourceContract(yieldSourceVault).priceAA();
    }

    /**
     * @dev Returns the vault balance at yield source
     */
    function vaultBalanceAtYieldSource() public view returns (uint256) {
        return
            IERC20(IYieldSourceContract(yieldSourceVault).AATranche())
                .balanceOf(address(this));
    }

    function maxDeposit(address) public view virtual override returns (uint256) {
        return type(uint256).max;
    }

     function maxWithdraw(address _owner) public view virtual override returns (uint256) {
        return convertToAssets(balanceOf(_owner));
    }

    /**
     * @dev Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal
     * scenario where all the conditions are met.
     */
    function _convertToShares(uint256 assets, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        override
        returns (uint256)
    {
        return ((assets * ONE_E_6) / getPriceOfYieldSource());
        //return assets.mulDiv(ONE_E_6, getPriceOfYieldSource(), rounding);
    }

    /**
     * @dev Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal
     * scenario where all the conditions are met.
     */
    function _convertToAssets(uint256 shares, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        override
        returns (uint256)
    {
        return (shares * getPriceOfYieldSource()) / ONE_E_6;
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
            IYieldSourceContract(yieldSourceVault).feeReceiver() ==
            address(this);
    }

    /**
     * @dev Check if the provided multi-sig address is the revenue contract owner
     */
    function isMultisigOwnsTheRevenueContract() public view returns (bool) {
        return IYieldSourceContract(yieldSourceVault).owner() == multiSig;
    }

    /**
     * @dev Check if cinch multi-sig guard is added
     */
    function isMultisigGuardAdded() public view returns (bool) {
        return GnosisSafe(multiSig).getGuard() == multisigGuard;
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
