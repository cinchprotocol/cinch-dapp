// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockCinchPx is Ownable {
    mapping(address => uint256) internal _totalValueLocked; // token => totalReleased

    /**
     * @dev Getter of _totalValueLocked
     */
    function getTotalValueLocked(address cinchPxPayee) external view returns (uint256) {
        return _totalValueLocked[cinchPxPayee];
    }

    /**
     * @dev Setter of _totalValueLocked
     */
    function setTotalValueLocked(address cinchPxPayee, uint256 tvl) external onlyOwner {
        _totalValueLocked[cinchPxPayee] = tvl;
    }
}
