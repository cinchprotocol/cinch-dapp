// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract FeeSplitterStorage {
    address internal _cinchPxAddress;
    EnumerableSetUpgradeable.AddressSet internal _supportedERC20Set;
    address internal _protocolPayee;
    EnumerableSetUpgradeable.AddressSet internal _cinchPxPayeeSet;

    uint256 internal _lastProtocolTVL;
    mapping(address => uint256) internal _lastCinchPxTVL; // chinchPxPayee => lastCinchPxTVL
    mapping(IERC20Upgradeable => uint256) internal _lastFeeSplitterBalance; // token => lastFeeSplitterBalance
    mapping(IERC20Upgradeable => mapping(address => uint256)) internal _internalBalance; // token => (payee => internalBalance)
    mapping(IERC20Upgradeable => uint256) internal _totalProcessed; // token => totalProcessed
    mapping(IERC20Upgradeable => mapping(address => uint256)) internal _totalSplittedTo; // token => (payee => totalSplittedTo)
    mapping(IERC20Upgradeable => uint256) internal _totalReleased; // token => totalReleased
}
