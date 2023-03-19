// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

interface IDHedgeYieldSourceContract {
    function depositAARef(uint256 _amount, address _referral) external returns (uint256); //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L143

    function feeReceiver() external view returns (address);
    function owner() external view returns (address);

    function deposit(uint256 assets, address receiver) external returns (uint256); //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/1575cc6908f0f38bfb36d459c4ce7295f0f89c49/contracts/token/ERC20/extensions/ERC4626.sol#L132
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256); //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/740ce2d440766e5013640f0e47640fae57f5d1d5/contracts/token/ERC20/extensions/ERC4626.sol#L166

    //Idle.finance
    function withdrawAA(uint256 _amount) external returns (uint256); //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L159
    function priceAA() external view returns (uint256);
    function AATranche() external view returns (address);
    function ONE_TRANCHE_TOKEN() external view returns (uint256);

    //MockProtocol
    function getTotalValueLocked() external view returns (uint256);
}

contract YieldSourceAdapter is Initializable {
     using MathUpgradeable for uint256;

    // Event when the yieldSourceVault address is updated
    event YieldSourceVaultUpdated(address yieldSourceVault_);

    // ERC4626 vault address of yield source
    address public yieldSourceVault;

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    function __YieldSourceAdapter_init(address yieldSourceVault_) internal onlyInitializing {
        yieldSourceVault = yieldSourceVault_;
    }

    /**
     * @dev Deposit assets to yield source vault
     * @param asset_ The addres of the ERC20 asset contract
     * @param assets_ The amount of assets to deposit
     * @return shares amount of shares received
     */
    function __deposit(address asset_, uint256 assets_) internal returns (uint256) {
        IERC20Upgradeable(asset_).approve(yieldSourceVault, assets_);
        return IDHedgeYieldSourceContract(yieldSourceVault).depositAARef(assets_, address(this));
    }

    /**
     * @dev Redeem assets with vault shares
     * @param shares amount of shares to burn and redeem assets
     * @return assets amount of assets received
     */
    function __redeem(uint256 shares) public returns (uint256) {
        return IDHedgeYieldSourceContract(yieldSourceVault).withdrawAA(shares);
    }

    /**
     * @return shares yield source share balance of this vault
     */
    function vaultBalanceAtYieldSource() public view returns (uint256) {
        return
            IERC20Upgradeable(IDHedgeYieldSourceContract(yieldSourceVault).AATranche())
                .balanceOf(address(this));
    }

    /**
     * @return price price of yield source shares
     */
    function getPriceOfYieldSource() public view returns (uint256) {
        return IDHedgeYieldSourceContract(yieldSourceVault).priceAA();
    }

    /**
     * @return assets total amount of the underlying asset managed by this vault
     */
    function __totalAssets() internal view returns (uint256) {
        return vaultBalanceAtYieldSource().mulDiv(getPriceOfYieldSource(), IDHedgeYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN());
    }

    /**
     * @notice Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @param assets amount of assets to be converted to shares
     * @param rounding rounding mode
     * @return shares amount of shares that would be converted from assets
     */     
    function __convertToShares(uint256 assets, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        returns (uint256)
    {
        return assets.mulDiv(IDHedgeYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN(), getPriceOfYieldSource(), rounding);
    }

    /**
     * @notice Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @param shares amount of shares to be converted to assets
     * @param rounding rounding mode
     * @return assets amount of assets that would be converted from shares
     */     
    function __convertToAssets(uint256 shares, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        returns (uint256)
    {
        return shares.mulDiv(getPriceOfYieldSource(), IDHedgeYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN(), rounding);
    }

    /**
     * @dev to be used for calculating the revenue share ratio
     * @return yieldSourceTotalShares total yield source shares supply
     */        
    function getYieldSourceVaultTotalShares()
        external
        view
        returns (uint256)
    {
        //IERC20Upgradeable(IYieldSourceContract(yieldSourceVault).AATranche()).totalSupply(); //for idle integration
        return IDHedgeYieldSourceContract(yieldSourceVault).getTotalValueLocked();
    }

    /**
     * @return feeReceiver address of the yield source vault
     */        
    function getYieldSourceVaultFeeReceiver() public view returns (address) {
        return IDHedgeYieldSourceContract(yieldSourceVault).feeReceiver();
    }

    /**
     * @return owner address of the yield source vault
     */        
    function getYieldSourceVaultOwner() public view returns (address) {
        return IDHedgeYieldSourceContract(yieldSourceVault).owner();
    }
}