// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/IYieldSourceContract.sol";

contract MockCinchPx is Ownable {
    mapping(address => uint256) internal _totalValueLocked; // token => totalReleased
    address public yieldSourceVault;

    /**
     * @dev Constructor of the contract.
     */
    constructor(address yieldSourceVault_) {
        yieldSourceVault = yieldSourceVault_;
    }

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

    /**
     * @dev return the total supply of shares in the yield source vault
     */
    function getYieldSourceVaultTotalShares()
        external
        view
        returns (uint256)
    {
        //return IdleCDOTranche(_tranche).totalSupply() // this should be used for the idle integration
        return IYieldSourceContract(yieldSourceVault).getTotalValueLocked();
    }
}
