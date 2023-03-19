// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

import "../interfaces/IYieldSourceContract.sol";

contract GeneralYieldSourceAdapter is Initializable {
     using MathUpgradeable for uint256;

    // Event when the yieldSourceVault address is updated
    event YieldSourceVaultUpdated(address yieldSourceVault_);

    // Yield source vault address
    address public yieldSourceVault;

    /**
     * @notice GeneralYieldSourceAdapter initializer
     * @param _yieldSourceVault vault address of yield source
     */
    function __GeneralYieldSourceAdapter_init(
        address _yieldSourceVault
    ) internal virtual initializer {
        yieldSourceVault = _yieldSourceVault;
    }

    /**
     * @dev Deposit assets to yield source vault
     * @dev virtual, expected to be overridden with specific yield source vault
     * @param asset_ The addres of the ERC20 asset contract
     * @param assets_ The amount of assets to deposit
     * @return shares amount of shares received
     */
    function _depositToYieldSourceVault(address asset_, uint256 assets_) internal virtual returns (uint256) {
        IERC20Upgradeable(asset_).approve(yieldSourceVault, assets_);
        return IYieldSourceContract(yieldSourceVault).depositAARef(assets_, address(this));
    }

    /**
     * @dev Redeem assets with vault shares from yield source vault
     * @dev virtual, expected to be overridden with specific yield source vault
     * @param shares amount of shares to burn and redeem assets
     * @return assets amount of assets received
     */
    function _redeemFromYieldSourceVault(uint256 shares) internal virtual returns (uint256) {
        return IYieldSourceContract(yieldSourceVault).withdrawAA(shares);
    }

    //TODO: can be removed if not used
    /**
     * @return assets total amount of the underlying asset managed by this vault
     */
    function _totalAssetsOfYieldSourceVault() internal virtual view returns (uint256) {
        return vaultBalanceAtYieldSource().mulDiv(getPriceOfYieldSource(), IYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN());
    }

    //TODO: can be removed if not used
    /**
     * @return price price of yield source shares
     */
    function getPriceOfYieldSource() public virtual view returns (uint256) {
        return IYieldSourceContract(yieldSourceVault).priceAA();
    }

    /**
     * @return shares yield source share balance of this vault
     */
    function vaultBalanceAtYieldSource() public virtual view returns (uint256) {
        return
            IERC20Upgradeable(IYieldSourceContract(yieldSourceVault).AATranche())
                .balanceOf(address(this));
    }

    /**
     * @notice Returns the amount of shares that the yield source vault would exchange for the amount of assets provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @param assets amount of assets to be converted to shares
     * @param rounding rounding mode
     * @return shares amount of shares that would be converted from assets
     */     
    function _convertAssetsToYieldSourceShares(uint256 assets, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        returns (uint256)
    {
        return assets.mulDiv(IYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN(), getPriceOfYieldSource(), rounding);
    }

    /**
     * @notice Returns the amount of assets that the yield source vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met
     * @dev See {@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol}
     * @param shares amount of shares to be converted to assets
     * @param rounding rounding mode
     * @return assets amount of assets that would be converted from shares
     */     
    function _convertYieldSourceSharesToAssets(uint256 shares, MathUpgradeable.Rounding rounding)
        internal
        view
        virtual
        returns (uint256)
    {
        return shares.mulDiv(getPriceOfYieldSource(), IYieldSourceContract(yieldSourceVault).ONE_TRANCHE_TOKEN(), rounding);
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
        return IYieldSourceContract(yieldSourceVault).getTotalValueLocked();
    }

    /**
     * @return feeReceiver address of the yield source vault
     */        
    function getYieldSourceVaultFeeReceiver() public view returns (address) {
        return IYieldSourceContract(yieldSourceVault).feeReceiver();
    }

    /**
     * @return owner address of the yield source vault
     */        
    function getYieldSourceVaultOwner() public view returns (address) {
        return IYieldSourceContract(yieldSourceVault).owner();
    }
}