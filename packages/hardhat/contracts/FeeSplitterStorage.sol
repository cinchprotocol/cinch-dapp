// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FeeSplitterStorage {
    using EnumerableSet for EnumerableSet.AddressSet;

    event SupportedERC20Added(address tokenAddress);
    event CinchPxPayeeAdded(address cinchPxPayee);
    event InternalBalanceUpdated(address payee, address tokenAddress, uint256 balance);
    event TotalProcessedUpdated(address tokenAddress, uint256 totalProcessed);
    event FeeSplitProcessed(uint256 protocolTVL);

    address internal _cinchPxAddress;
    address internal _protocolAddress;
    EnumerableSet.AddressSet internal _supportedERC20Set;
    address internal _protocolPayee;
    EnumerableSet.AddressSet internal _cinchPxPayeeSet;

    uint256 internal _lastProtocolTVL;
    mapping(address => uint256) internal _lastCinchPxTVL; // chinchPxPayee => lastCinchPxTVL
    mapping(IERC20 => uint256) internal _lastFeeSplitterBalance; // token => lastFeeSplitterBalance
    mapping(IERC20 => mapping(address => uint256)) internal _lastInternalBalance; // token => (cinchPxPayee => lastInternalBalance)
    mapping(IERC20 => uint256) public totalProcessed; // token => totalProcessed

}
