// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICinchPx {
    function totalSharesByReferral(address cinchPxPayee) external view returns (uint256);
    function getYieldSourceVaultTotalShares() external view returns (uint256);
}
