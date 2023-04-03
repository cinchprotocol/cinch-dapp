// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./Vault.sol";

interface IYieldSourceIdleFinance {
    function depositAARef(uint256 _amount, address _referral) external returns (uint256); //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L143
    function withdrawAA(uint256 _amount) external returns (uint256); //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L159
    function priceAA() external view returns (uint256);
    function AATranche() external view returns (address);
    function ONE_TRANCHE_TOKEN() external view returns (uint256);
}

contract VaultIdleFinance is Vault {
    using MathUpgradeable for uint256;

    /*//////////////////////////////////////////////////////////////
                            YIELD SOURCE ADAPTER
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Deposit assets to yield source vault
     * @dev overridden
     * @param asset_ The addres of the ERC20 asset contract
     * @param assets_ The amount of assets to deposit
     * @return shares amount of shares received
     */
    function _depositToYieldSourceVault(address asset_, uint256 assets_) internal override returns (uint256) {
        IERC20Upgradeable(asset_).approve(yieldSourceVault, assets_);
        return IYieldSourceIdleFinance(yieldSourceVault).depositAARef(assets_, address(this));
    }

    /**
     * @dev Redeem assets with vault shares from yield source vault
     * @dev overridden
     * @param shares amount of shares to burn and redeem assets
     * @return assets amount of assets received
     */
    function _redeemFromYieldSourceVault(uint256 shares) internal override returns (uint256) {
        return IYieldSourceIdleFinance(yieldSourceVault).withdrawAA(shares);
    }

    /**
     * @dev overridden
     * @return price share price of yield source vault
     */
    function sharePriceOfYieldSource() public override view returns (uint256) {
        return IYieldSourceIdleFinance(yieldSourceVault).priceAA();
    }

    /**
     * @notice Returns the amount of shares that the yield source vault would exchange for the amount of assets provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @dev overridden
     * @param assets amount of assets to be converted to shares
     * @param rounding rounding mode
     * @return shares amount of shares that would be converted from assets
     */     
    function _convertAssetsToYieldSourceShares(uint256 assets, MathUpgradeable.Rounding rounding)
        internal
        override
        view
        returns (uint256)
    {
        return assets.mulDiv(IYieldSourceIdleFinance(yieldSourceVault).ONE_TRANCHE_TOKEN(), sharePriceOfYieldSource(), rounding);
    }

    /**
     * @notice Returns the amount of assets that the yield source vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @dev overridden
     * @param shares amount of shares to be converted to assets
     * @param rounding rounding mode
     * @return assets amount of assets that would be converted from shares
     */     
    function _convertYieldSourceSharesToAssets(uint256 shares, MathUpgradeable.Rounding rounding)
        internal
        override
        view
        returns (uint256)
    {
        return shares.mulDiv(sharePriceOfYieldSource(), IYieldSourceIdleFinance(yieldSourceVault).ONE_TRANCHE_TOKEN(), rounding);
    }

    /**
     * @dev overridden
     * @return shares yield source share balance of this vault
     */
    function shareBalanceAtYieldSource() public override view returns (uint256) {
        return
            IERC20Upgradeable(IYieldSourceIdleFinance(yieldSourceVault).AATranche())
                .balanceOf(address(this));
    }

    /**
     * @dev overridden
     * @return assets yield source asset balance of this vault
     */
    function assetBalanceAtYieldSource() public override view returns (uint256) {
        uint256 shares = shareBalanceAtYieldSource();
        return _convertYieldSourceSharesToAssets(shares, MathUpgradeable.Rounding.Down);
    }

    /**
     * @dev to be used for calculating the revenue share ratio
     * @return yieldSourceTotalShares total yield source shares supply
     */        
    function getYieldSourceVaultTotalShares() external override view returns (uint256)
    {
        return IERC20Upgradeable(IYieldSourceIdleFinance(yieldSourceVault).AATranche()).totalSupply();
    }
}