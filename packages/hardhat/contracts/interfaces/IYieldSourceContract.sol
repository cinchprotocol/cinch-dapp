// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IYieldSourceContract {
    function feeReceiver() external view returns (address);
    function owner() external view returns (address);

    function deposit(uint256 assets, address receiver) external returns (uint256); //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/1575cc6908f0f38bfb36d459c4ce7295f0f89c49/contracts/token/ERC20/extensions/ERC4626.sol#L132
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256); //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/740ce2d440766e5013640f0e47640fae57f5d1d5/contracts/token/ERC20/extensions/ERC4626.sol#L166

    function getTotalShares() external view returns (uint256);

    //Idle.finance
    function depositAARef(uint256 _amount, address _referral) external returns (uint256); //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L143
    function withdrawAA(uint256 _amount) external returns (uint256); //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L159
    function priceAA() external view returns (uint256);
    function AATranche() external view returns (address);
    function ONE_TRANCHE_TOKEN() external view returns (uint256);
}