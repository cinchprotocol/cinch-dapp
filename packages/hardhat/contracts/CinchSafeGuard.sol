// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import './interfaces/IGnosisSafe.sol';

interface ICinchSafeGuard is IGuard {
  error NotAuthorized();
  error ZeroAddress();
  error InvalidExecutor();
  error NotStealthRelayer();
  error NotExecutor();

  function overrideGuardChecks() external view returns (bool _overrideGuardChecks);

  function stealthRelayerCheck() external view returns (bool _stealthRelayerCheck);

  function executors() external view returns (address[] memory _executorsArray);

  function addExecutor(address _executor) external;

  function addExecutors(address[] calldata _executorsList) external;

  function removeExecutor(address _executor) external;

  function setOverrideGuardChecks(bool _overrideGuardChecks) external;

  function setStealthRelayerCheck(bool _stealthRelayerCheck) external;
}

contract CinchSafeGuard is ICinchSafeGuard, Ownable {
  using EnumerableSet for EnumerableSet.AddressSet;

  EnumerableSet.AddressSet internal _executors;

  bool public override overrideGuardChecks;

  constructor(address _manager, address _stealthRelayer) {}

  function executors() external view override returns (address[] memory _executorsArray) {
    return _executors.values();
  }

  function addExecutors(address[] calldata _executorsList) external override onlyOwner {
    for (uint256 i; i < _executorsList.length; i++) {
      if (_executorsList[i] == address(0)) revert ZeroAddress();
      if (!_executors.add(_executorsList[i])) revert InvalidExecutor();
    }
  }

  function addExecutor(address _executor) external override onlyOwner {
    if (_executor == address(0)) revert ZeroAddress();
    if (!_executors.add(_executor)) revert InvalidExecutor();
  }

  function removeExecutor(address _executor) external override onlyOwner {
    if (_executor == address(0)) revert ZeroAddress();
    if (!_executors.remove(_executor)) revert InvalidExecutor();
  }

  function setOverrideGuardChecks(bool _overrideGuardChecks) external override onlyOwner {
    overrideGuardChecks = _overrideGuardChecks;
  } 

  function checkTransaction(
    address, /*to*/
    uint256, /*value*/
    bytes memory, /*data*/
    Enum.Operation, /*operation*/
    uint256, /*safeTxGas*/
    uint256, /*baseGas*/
    uint256, /*gasPrice*/
    address, /*gasToken*/
    // solhint-disable-next-line no-unused-vars
    address payable, /*refundReceiver*/
    bytes memory, /*signatures*/
    address msgSender
  ) external view override {
    if (overrideGuardChecks) return;

    if (stealthRelayerCheck) {
      address _caller = IStealthRelayer(stealthRelayer).caller();

      if (msgSender != stealthRelayer || !_executors.contains(_caller)) {
        revert NotStealthRelayer();
      }
    } else {
      if (!_executors.contains(msgSender)) {
        revert NotExecutor();
      }
    }
  }

  // unused
  function checkAfterExecution(bytes32, bool) external view override {}

  // solhint-disable-next-line payable-fallback
  fallback() external {
    // We don't revert on fallback to avoid issues in case of a Safe upgrade
    // E.g. The expected check method might change and then the Safe would be locked.
  }

 

}