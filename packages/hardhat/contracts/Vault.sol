// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

import "./interfaces/IGnosisSafe.sol";
import "./interfaces/IYieldSourceContract.sol";

/**
 * @title Vault
 * @notice Contract allows deposits and Withdrawals to Yield source product
 * @dev Should be deployed per yield source pool/vault.
 */
contract Vault is ERC4626Upgradeable, OwnableUpgradeable, PausableUpgradeable {
    using MathUpgradeable for uint256;

    event FeeSplitterUpdated(address feeSplitter_);
    event VaultActivated();

    enum Status {
        Pending,
        Active,
        Expired,
        Canceled
    }

    // ERC4626 vault address of yield source
    address public yieldSourceVault;
    // Address of Gnosis multi-sig which is the owner of yield soure vault
    address public multiSig;
    address public multisigGuard;
    // Target feeSplitter address that the protocol should be updated to
    address public feeSplitter;
    // Partner referral -> Total value locked
    mapping(address => uint256) internal _totalValueLocked;
    // User -> Partner referral -> Total value locked
    mapping(address => mapping(address => uint256)) internal _totalValueLockedByUserReferral;
    uint256 public totalAssetDepositProcessed;

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
        string calldata name,
        string calldata symbol,
        address _yieldSourceVault,
        address _multiSig,
        address _multisigGuard
    ) public initializer {
        __Ownable_init();
        __Pausable_init();
        __ERC4626_init(IERC20Upgradeable(asset));
        __ERC20_init(name, symbol);

        yieldSourceVault = _yieldSourceVault;
        multiSig = _multiSig;
        multisigGuard = _multisigGuard;

        vaultStatus = Status.Active; //TODO: change to Pending after Idle test
        vaultDeployDate = block.timestamp;
        vaultActivationDate = block.timestamp; //TODO: remove this line after Idle test
    }

    function setFeeSplitter(address feeSplitter_) external onlyOwner {
        feeSplitter = feeSplitter_;
        emit FeeSplitterUpdated(feeSplitter);
    }

    /**
     * @dev Activates the vault after the required condition has been met and transfer funds to the borrower.
     */
    function activate() external whenNotPaused {
        _isValidState(Status.Pending);

        require(isReadyToActivate(), "VAULT_ACTIVATION_TERMS_NOT_MET");

        vaultStatus = Status.Active;
        vaultActivationDate = block.timestamp;

        emit VaultActivated();
    }

    //TODO: remove activateBypass
    /**
     * @dev Activates the vault for testing.
     * onlyOwner
     */
    /*
    function activateBypass() external whenNotPaused onlyOwner {
        _isValidState(Status.Pending);
        vaultStatus = Status.Active;
        vaultActivationDate = block.timestamp;
        emit VaultActivated();
    }
    */

    /** @dev See {IERC4626-deposit}. */
    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override whenNotPaused returns (uint256) {
        return depositWithReferral(assets, receiver, receiver);
    }

    /**
     * @dev openzeppelin ERC4626 deposit with referral tag
     */
    function depositWithReferral(
        uint256 assets,
        address receiver,
        address referral
    ) public whenNotPaused returns (uint256) {
        _isValidState(Status.Active);
        require(assets > 0, "ZERO_ASSETS");
        require(receiver != address(0) && referral != address(0), "ZERO_ADDRESS");
        require(assets <= maxDeposit(receiver), "MAX_DEPOSIT_EXCEEDED");

        // Transfer assets to this vault first, assuming it was approved by the sender
        SafeERC20Upgradeable.safeTransferFrom(IERC20Upgradeable(asset()), _msgSender(), address(this), assets);

        // Deposit assets to yield source vault
        IERC20Upgradeable(asset()).approve(yieldSourceVault, assets);
        uint256 shares = IYieldSourceContract(yieldSourceVault).depositAARef(assets, address(this));

        // Mint the shares from this vault according to the number of shares received from yield source vault
        _mint(receiver, shares);
        _totalValueLocked[referral] += shares;
        _totalValueLockedByUserReferral[receiver][referral] += shares;
        totalAssetDepositProcessed += assets;
        emit Deposit(_msgSender(), receiver, assets, shares);

        return shares;
    }

    /** @dev See {IERC4626-redeem}. */
    function redeem(
        uint256 shares, 
        address receiver, 
        address owner
    ) public virtual override whenNotPaused returns (uint256) {
        return redeemWithReferral(shares, receiver, owner, owner);
    }

    /**
     * @dev openzeppelin ERC4626 redeem with referral tag
     */
    function redeemWithReferral(
        uint256 shares, 
        address receiver, 
        address owner,
        address referral
    ) public whenNotPaused returns (uint256) {
        _isValidState(Status.Active);
        require(shares > 0, "ZERO_SHARES");
        require(receiver != address(0) && owner != address(0) && referral != address(0), "ZERO_ADDRESS");
        require(shares <= maxRedeem(owner), "MAX_REDEEM_EXCEEDED");
        require(shares <= balanceOf(owner), "INSUFFICIENT_SHARES");
        require(shares <= _totalValueLockedByUserReferral[owner][referral], "INSUFFICIENT_SHARES_BY_REFERRAL");

        uint256 assets = IYieldSourceContract(yieldSourceVault).withdrawAA(shares);
        _withdraw(_msgSender(), receiver, owner, assets, shares);
        _totalValueLocked[referral] -= shares;
        _totalValueLockedByUserReferral[owner][referral] -= shares;
        return assets;
    }

    /** @dev See {IERC4626-withdraw}. */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override whenNotPaused returns (uint256) {
        uint256 shares = convertToShares(assets);
        return redeem(shares, receiver, owner);
    }

    /**
     * @dev openzeppelin ERC4626 withdraw with referral tag
     */
    function withdrawWithReferral(
        uint256 assets,
        address receiver,
        address owner,
        address referral
    ) public whenNotPaused returns (uint256) {
        uint256 shares = convertToShares(assets);
        return redeemWithReferral(shares, receiver, owner, referral);
    }

    /*//////////////////////////////////////////////////////////////
                            ACCOUNTING LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice Total amount of the underlying asset that
    /// is "managed" by Vault.
    function totalAssets() public view override returns (uint256) {
        return vaultBalanceAtYieldSource().mulDiv(getPriceOfYieldSource(), IYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN());
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
            IERC20Upgradeable(IYieldSourceContract(yieldSourceVault).AATranche())
                .balanceOf(address(this));
    }

    function maxDeposit(address)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return type(uint256).max;
    }

    function maxWithdraw(address _owner)
        public
        view
        virtual
        override
        returns (uint256)
    {
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
        return assets.mulDiv(IYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN(), getPriceOfYieldSource(), rounding);
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
        return shares.mulDiv(getPriceOfYieldSource(), IYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN(), rounding);
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
        require(feeSplitter != address(0), "FEE_SPLITTER_NOT_SET");
        return
            IYieldSourceContract(yieldSourceVault).feeReceiver() == feeSplitter;
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

    /**
     * @dev return the total supply of shares in the yield source vault
     */
    function getYieldSourceVaultTotalShares()
        external
        view
        returns (uint256)
    {
        return IERC20Upgradeable(IYieldSourceContract(yieldSourceVault).AATranche()).totalSupply(); //idle integration
        //return IYieldSourceContract(yieldSourceVault).getTotalValueLocked();
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
