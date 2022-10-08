// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGnosisSafe.sol";

interface ICinchSafeGuard is IGuard {
    // error NotAuthorized();
    // error ZeroAddress();
    // error InvalidExecutor();
    // error NotStealthRelayer();
    // error NotExecutor();
    // function overrideGuardChecks() external view returns (bool _overrideGuardChecks);
    // function stealthRelayerCheck() external view returns (bool _stealthRelayerCheck);
    // function executors() external view returns (address[] memory _executorsArray);
    // function addExecutor(address _executor) external;
    // function addExecutors(address[] calldata _executorsList) external;
    // function removeExecutor(address _executor) external;
    // function setOverrideGuardChecks(bool _overrideGuardChecks) external;
    // function setStealthRelayerCheck(bool _stealthRelayerCheck) external;
}

contract CinchSafeGuard is ICinchSafeGuard, Ownable {
    struct Target {
        bool allowed;
        bool scoped;
        bool delegateCallAllowed;
        bool fallbackAllowed;
        bool valueAllowed;
        mapping(bytes4 => bool) allowedFunctions;
    }

    mapping(address => Target) public allowedTargets;

    /// @dev Set whether or not calls can be made to an address.
    /// @notice Only callable by owner.
    /// @param target Address to be allowed/disallowed.
    /// @param allow Bool to allow (true) or disallow (false) calls to target.
    function setTargetAllowed(address target, bool allow) public onlyOwner {
        allowedTargets[target].allowed = allow;
        emit SetTargetAllowed(target, allowedTargets[target].allowed);
    }

    /// @dev Sets whether or not calls to an address should be scoped to specific function signatures.
    /// @notice Only callable by owner.
    /// @param target Address to be scoped/unscoped.
    /// @param scoped Bool to scope (true) or unscope (false) function calls on target.
    function setScoped(address target, bool scoped) public onlyOwner {
        allowedTargets[target].scoped = scoped;
        emit SetTargetScoped(target, allowedTargets[target].scoped);
    }

    /// @dev Returns bool to indicate if an address is an allowed target.
    /// @param target Address to check.
    function isAllowedTarget(address target) public view returns (bool) {
        return (allowedTargets[target].allowed);
    }

    /// @dev Returns bool to indicate if an address is scoped.
    /// @param target Address to check.
    function isScoped(address target) public view returns (bool) {
        return (allowedTargets[target].scoped);
    }

    /// @dev Returns bool to indicate if a function signature is allowed for a target address.
    /// @param target Address to check.
    /// @param functionSig Signature to check.
    function isAllowedFunction(address target, bytes4 functionSig)
        public
        view
        returns (bool)
    {
        return (allowedTargets[target].allowedFunctions[functionSig]);
    }

    /// @dev Sets whether or not a specific function signature should be allowed on a scoped target.
    /// @notice Only callable by owner.
    /// @param target Scoped address on which a function signature should be allowed/disallowed.
    /// @param functionSig Function signature to be allowed/disallowed.
    /// @param allow Bool to allow (true) or disallow (false) calls a function signature on target.
    function setAllowedFunction(
        address target,
        bytes4 functionSig,
        bool allow
    ) public onlyOwner {
        allowedTargets[target].allowedFunctions[functionSig] = allow;
        emit SetFunctionAllowedOnTarget(
            target,
            functionSig,
            allowedTargets[target].allowedFunctions[functionSig]
        );
    }

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256,
        uint256,
        uint256,
        address,
        // solhint-disallow-next-line no-unused-vars
        address payable,
        bytes memory,
        address
    ) external view override {
        require(
            operation != Enum.Operation.DelegateCall ||
                allowedTargets[to].delegateCallAllowed,
            "Delegate call not allowed to this address"
        );
        require(allowedTargets[to].allowed, "Target address is not allowed");
        if (value > 0) {
            require(
                allowedTargets[to].valueAllowed,
                "Cannot send ETH to this target"
            );
        }
        if (data.length >= 4) {
            require(
                !allowedTargets[to].scoped ||
                    allowedTargets[to].allowedFunctions[bytes4(data)],
                "Target function is not allowed"
            );
        } else {
            require(data.length == 0, "Function signature too short");
            require(
                !allowedTargets[to].scoped ||
                    allowedTargets[to].fallbackAllowed,
                "Fallback not allowed for this address"
            );
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
