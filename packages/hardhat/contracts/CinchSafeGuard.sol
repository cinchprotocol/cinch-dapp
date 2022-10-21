// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol"; //TODO: remove as this is not used ?
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGnosisSafe.sol";

contract CinchSafeGuard is IGuard, Ownable {
    event SetTargetBlocked(address target, bool blocked);
    event SetTargetScoped(address target, bool scoped);
    event SetFallbackBlockedOnTarget(address target, bool blocked);
    event SetValueBlockedOnTarget(address target, bool blocked);
    event SetDelegateCallBlockedOnTarget(address target, bool blocked);
    event SetFunctionBlockedOnTarget(
        address target,
        bytes4 functionSig,
        bool blocked
    );

    bool public overrideGuardChecks;

    struct Target {
        bool blocked;
        bool scoped;
        bool delegateCallBlocked;
        bool fallbackBlocked;
        bool valueBlocked;
        mapping(bytes4 => bool) blockedFunctions;
    }

    mapping(address => Target) public blockedTargets;

    /// @dev Set whether or not calls can be made to an address.
    /// @notice Only callable by owner.
    /// @param target Address to be blocked/disblocked.
    /// @param blocked Bool to blocked (true) or disallow (false) calls to target.
    function setTargetBlocked(address target, bool blocked) external onlyOwner { 
        blockedTargets[target].blocked = blocked;
        emit SetTargetBlocked(target, blockedTargets[target].blocked);
    }

    /// @dev Sets whether or not calls to an address should be scoped to specific function signatures.
    /// @notice Only callable by owner.
    /// @param target Address to be scoped/unscoped.
    /// @param scoped Bool to scope (true) or unscope (false) function calls on target.
    function setScoped(address target, bool scoped) external onlyOwner {
        blockedTargets[target].scoped = scoped;
        emit SetTargetScoped(target, blockedTargets[target].scoped);
    }

    //TODO: implement setDelegateCallBlocked function ?

    /// @dev Sets whether or not a specific function signature should be blocked on a scoped target.
    /// @notice Only callable by owner.
    /// @param target Scoped address on which a function signature should be blocked/disblocked.
    /// @param functionSig Function signature to be blocked/disblocked.
    /// @param blocked Bool to blocked (true) or disallow (false) calls a function signature on target.
    function setBlockedFunction(
        address target,
        bytes4 functionSig,
        bool blocked
    ) external onlyOwner {
        blockedTargets[target].blockedFunctions[functionSig] = blocked;
        emit SetFunctionBlockedOnTarget(
            target,
            functionSig,
            blockedTargets[target].blockedFunctions[functionSig]
        );
    }

    /// @dev Returns bool to indicate if an address is an blocked target.
    /// @param target Address to check.
    function isBlockedTarget(address target) external view returns (bool) {
        return (blockedTargets[target].blocked);
    }

    /// @dev Returns bool to indicate if an address is scoped.
    /// @param target Address to check.
    function isScoped(address target) external view returns (bool) {
        return (blockedTargets[target].scoped);
    }

    /// @dev Returns bool to indicate if a function signature is blocked for a target address.
    /// @param target Address to check.
    /// @param functionSig Signature to check.
    function isBlockedFunction(address target, bytes4 functionSig)
        external
        view
        returns (bool)
    {
        return (blockedTargets[target].blockedFunctions[functionSig]);
    }

    //TODO: add documentation
    function setOverrideGuardChecks(bool _overrideGuardChecks)
        external
        onlyOwner
    {
        overrideGuardChecks = _overrideGuardChecks;
    }

    //TODO: add documentation
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256, /*safeTxGas*/
        uint256, /*baseGas*/
        uint256, /*gasPrice*/
        address, /*gasToken*/
        // solhint-disable-next-line no-unused-vars
        address payable, /*refundReceiver*/
        bytes memory, /*signatures*/
        address /*msgSender*/
    ) external view override {
        if (overrideGuardChecks) return;

        require(
            operation != Enum.Operation.DelegateCall ||
                !blockedTargets[to].delegateCallBlocked,
            "Delegate call is blocked to this address"
        );

        if (value > 0) {
            require(
                !blockedTargets[to].valueBlocked,
                "Cannot send ETH to this target"
            );
        }
        if (data.length >= 4) {
            require(
                !blockedTargets[to].blockedFunctions[bytes4(data)],
                "Target function is blocked"
            );
        } else {
            require(data.length == 0, "Function signature too short");
            require(
                !blockedTargets[to].scoped ||
                    !blockedTargets[to].fallbackBlocked,
                "Fallback is blocked for this address"
            );
        }

        //Note: uncommented this require
        require(!blockedTargets[to].blocked, "Target address is blocked");
    }

    // unused
    function checkAfterExecution(bytes32, bool) external view override {}

    // solhint-disable-next-line payable-fallback
    fallback() external {
        // We don't revert on fallback to avoid issues in case of a Safe upgrade
        // E.g. The expected check method might change and then the Safe would be locked.
    }
}
