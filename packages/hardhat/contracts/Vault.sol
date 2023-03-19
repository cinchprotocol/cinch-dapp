// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

import "./interfaces/IGnosisSafe.sol";
import "./interfaces/IYieldSourceContract.sol";
import "./yieldsourceadapters/GeneralYieldSourceAdapter.sol";

/**
 * @title Vault
 * @notice Contract allows deposits and Withdrawals to Yield source product
 * @dev Should be deployed per yield source pool/vault
 * @dev ERC4626 based vault
 */
contract Vault is ERC4626Upgradeable, GeneralYieldSourceAdapter, OwnableUpgradeable, PausableUpgradeable {
    using MathUpgradeable for uint256;

    // Event when the feeSplitter address is updated
    event FeeSplitterUpdated(address feeSplitter_);
    // Event when the vault is activated
    event VaultActivated();

    // Vault status enum
    enum Status {
        Pending,
        Active,
        Expired,
        Canceled
    }

    // Address of Gnosis multi-sig which is the owner of yield soure vault
    address public multiSig;
    // Adderss of multisigGuard contract
    address public multisigGuard;
    // Target feeSplitter address that the protocol should be forwarding its revenue to
    address public feeSplitter;
    // Partner referral address -> isEnabled
    //mapping(address => bool) internal _isEnabledByReferral;
    // Partner referral address -> Total shares
    mapping(address => uint256) internal _totalSharesByReferral;
    // User address -> Partner referral address -> Total shares
    mapping(address => mapping(address => uint256)) internal _totalSharesByUserReferral;
    // Total asset deposit processed
    uint256 public totalAssetDepositProcessed;

    // Vault status tracking if it is activated or not
    Status public vaultStatus;
    // Vault activation date, for off-chain revenue chain calculation
    uint256 public vaultActivationDate;
    // Vault deploy date, for off-chain revenue chain calculation
    uint256 public vaultDeployDate;

    /**
     * @notice vault initializer
     * @param asset underneath asset, which should match the asset of the yield source vault
     * @param name ERC20 name of the vault shares token
     * @param symbol ERC20 symbol of the vault shares token
     * @param _yieldSourceVault vault address of yield source
     * @param _multiSig Address of Gnosis multi-sig which is the owner of yield soure vault
     */
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

        __GeneralYieldSourceAdapter_init(_yieldSourceVault);
        multiSig = _multiSig;
        multisigGuard = _multisigGuard;

        vaultStatus = Status.Pending;
        vaultDeployDate = block.timestamp;
    }

    /**
     * @notice setter of FeeSplitter
     * @dev onlyOwner
     * @dev emit FeeSplitterUpdated
     * @param feeSplitter_ address of feeSplitter to be updated to
     */
    function setFeeSplitter(address feeSplitter_) external onlyOwner {
        feeSplitter = feeSplitter_;
        emit FeeSplitterUpdated(feeSplitter);
    }

    /**
     * @notice setter of yieldSourceVault
     * @dev onlyOwner
     * @dev emit YieldSourceVaultUpdated
     * @param yieldSourceVault_ address of yieldSourceVault to be updated to
     */
    function setYieldSourceVault(address yieldSourceVault_) external onlyOwner {
        yieldSourceVault = yieldSourceVault_;
        emit YieldSourceVaultUpdated(yieldSourceVault);
    }

    /**
     * @notice Validate conditions for vault activation, and activate the vault if all requirements were passed
     * @dev whenNotPaused
     * @dev emit VaultActivated
     */
    function activate() external whenNotPaused {
        _isValidState(Status.Pending);
        require(isReadyToActivate(), "VAULT_ACTIVATION_TERMS_NOT_MET");

        vaultStatus = Status.Active;
        vaultActivationDate = block.timestamp;
        emit VaultActivated();
    }

    /**
     * @notice Force vault activation by owner, in case the on-chain feeSplitter integration is not in place
     * @dev whenNotPaused onlyOwner
     * @dev emit VaultActivated
     */
    function activateBypass() external whenNotPaused onlyOwner {
        _isValidState(Status.Pending);
        vaultStatus = Status.Active;
        vaultActivationDate = block.timestamp;
        emit VaultActivated();
    }

    /**
     * @notice Deposit assets to the vault
     * @dev See {IERC4626-deposit}
     * @dev whenNotPaused
     * @dev depositWithReferral(assets, receiver, receiver)
     * @param assets amount of assets to deposit
     * @param receiver address to receive the shares
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override whenNotPaused returns (uint256) {
        return depositWithReferral(assets, receiver, receiver);
    }

    /**
     * @notice Deposit assets to the vault with referral
     * @dev Transfer assets to this contract, then deposit into yield source vault, and mint shares to receiver
     * @dev See {IERC4626-deposit}
     * @dev whenNotPaused
     * @dev emit Deposit
     * @param assets amount of assets to deposit
     * @param receiver address to receive the shares
     * @param referral address of the partner referral
     * @return shares amount of shares received
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
        uint256 shares = _depositToYieldSourceVault(asset(), assets);

        // Mint the shares from this vault according to the number of shares received from yield source vault
        _mint(receiver, shares);
        _totalSharesByReferral[referral] += shares;
        _totalSharesByUserReferral[receiver][referral] += shares;
        totalAssetDepositProcessed += assets;
        emit Deposit(_msgSender(), receiver, assets, shares);

        return shares;
    }

    /**
     * @notice Redeem assets with vault shares
     * @dev See {IERC4626-redeem}
     * @dev whenNotPaused
     * @dev redeemWithReferral
     * @param shares amount of shares to burn and redeem assets
     * @param receiver address to receive the assets
     * @param owner address of the owner of the shares to be consumed
     * @return assets amount of assets received
     */
    function redeem(
        uint256 shares, 
        address receiver, 
        address owner
    ) public virtual override whenNotPaused returns (uint256) {
        return redeemWithReferral(shares, receiver, owner, owner);
    }

    /**
     * @notice Redeem assets with vault shares and referral
     * @dev See {IERC4626-redeem}
     * @dev whenNotPaused
     * @param shares amount of shares to burn and redeem assets
     * @param receiver address to receive the assets
     * @param owner address of the owner of the shares to be consumed
     * @param referral address of the partner referral
     * @return assets amount of assets received
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
        require(shares <= _totalSharesByUserReferral[owner][referral], "INSUFFICIENT_SHARES_BY_REFERRAL");

        //take out the shares from the user first to avoid reentrancy hack
        _totalSharesByUserReferral[owner][referral] -= shares;
        _totalSharesByReferral[referral] -= shares;

        uint256 assets = _redeemFromYieldSourceVault(shares);
        _withdraw(_msgSender(), receiver, owner, assets, shares);
        return assets;
    }

    /**
     * @notice Withdraw a specific amount of assets to be redeemed with vault shares
     * @dev See {IERC4626-withdraw}
     * @dev whenNotPaused
     * @dev redeem
     * @param assets target amount of assets to be withdrawn
     * @param receiver address to receive the assets
     * @param owner address of the owner of the shares to be consumed
     * @return assets amount of assets received
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override whenNotPaused returns (uint256) {
        uint256 shares = convertToShares(assets);
        return redeem(shares, receiver, owner);
    }

    /**
     * @notice Withdraw a specific amount of assets to be redeemed with vault shares and referral
     * @dev See {IERC4626-withdraw}
     * @dev whenNotPaused
     * @param assets target amount of assets to be withdrawn 
     * @param receiver address to receive the assets
     * @param owner address of the owner of the shares to be consumed
     * @param referral address of the partner referral
     * @return assets amount of assets received
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

    //TODO: is this part of 4626, if not and not used, we can remove it
    /**
     * @return assets total amount of the underlying asset managed by this vault
     */
    function totalAssets() public view override returns (uint256) {
        return _totalAssetsOfYieldSourceVault();
    }

    /**
     * @return assets maximum asset amounts that can be deposited
     */
    function maxDeposit(address)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return type(uint256).max;
    }

    /**
     * @return assets maximum asset amounts that can be withdrawn
     */
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
     * @notice Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @param assets amount of assets to be converted to shares
     * @param rounding rounding mode
     * @return shares amount of shares that would be converted from assets
     */     
    function _convertToShares(uint256 assets, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        override
        returns (uint256)
    {
        return _convertAssetsToYieldSourceShares(assets, rounding);
    }

    /**
     * @notice Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @param shares amount of shares to be converted to assets
     * @param rounding rounding mode
     * @return assets amount of assets that would be converted from shares
     */     
    function _convertToAssets(uint256 shares, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        override
        returns (uint256)
    {
        return _convertYieldSourceSharesToAssets(shares, rounding);
    }

    /*//////////////////////////////////////////////////////////////
                            YIELD SOURCE ADAPTER
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            REVENUE SHARE LOGIC
    //////////////////////////////////////////////////////////////*/

/*
    function setReferralEnabled(address referral, bool enabled) external onlyOwner {
        _isEnabledByReferral[referral] = enabled;
    }
*/
    /**
     * @notice Deposit assets to the revenue share balance, which will be made claimable to referrals
     * @param assets amount of assets to be deposited
     * @return assets amount of assets that would be converted from shares
     */     
/*
    function depositToRevenueShare(
        uint256 assets
    ) external whenNotPaused returns (uint256) {
        require(assets > 0, "ZERO_ASSETS");

        return depositToRevenueShareWithReferral(amount, receiver, owner, owner);
    }
*/

    /*//////////////////////////////////////////////////////////////
                            HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @return isReadyToActivate true if all requirements met and vault is ready to be activated
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
     * @return isFeeCollectorUpdated true if the yield source feeReceiver address is set to the target feeSplitter address
     */        
    function isFeeCollectorUpdated() public view returns (bool) {
        require(feeSplitter != address(0), "FEE_SPLITTER_NOT_SET");
        return getYieldSourceVaultFeeReceiver() == feeSplitter;
    }

    /**
     * @return isMultisigOwnsTheRevenueContract true if the yield source owner address is set to the multiSig address
     */        
    function isMultisigOwnsTheRevenueContract() public view returns (bool) {
        return getYieldSourceVaultOwner() == multiSig;
    }

    /**
     * @return isMultisigGuardAdded true if the multiSig's guard is set to the target multisigGuard address
     */        
    function isMultisigGuardAdded() public view returns (bool) {
        return GnosisSafe(multiSig).getGuard() == multisigGuard;
    }

    /**
     * @dev check if vault status matches the provided state
     * @param _status target vault status to check against
     */        
    function _isValidState(Status _status) internal view {
        require(vaultStatus == _status, "INVALID_STATE");
    }

    /**
     * @param referral target referral address
     * @return totalValueLocked total value locked in this vault by the target referral
     */        
    function getTotalValueLocked(address referral) //TODO: rename
        external
        view
        returns (uint256)
    {
        return _totalSharesByReferral[referral];
    }

    /**
     * @notice Pause the contract.
     * @dev onlyOwner
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract.
     * @dev onlyOwner
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
