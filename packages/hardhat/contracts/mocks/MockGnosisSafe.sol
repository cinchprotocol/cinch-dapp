// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockGnosisSafe is Ownable {
    event GuardUpdated(address indexed guard);

    address public _guard;

    /**
     * @dev return _guard
     */
    function getGuard() external view returns (address) {
        return _guard;
    }

    /**
     * @dev Sets _guard
     * @param newGuard - address of the new guard
     */
    function setGuard(address newGuard) external onlyOwner {
        require(
            newGuard != address(0),
            "setGuard: INVALID_GUARD"
        );
        _guard = newGuard;
        emit GuardUpdated(newGuard);
    }
}
