// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICinchPx {
    function getTotalValueLocked(address cinchPxPayee) external view returns (uint256);
}
