// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleProtocol is Ownable {
    address public feesCollector;
    uint256 public fee;

    /**
     * @dev Constructor of the contract.
     */
    constructor() {
        feesCollector = msg.sender;
        fee = 1;
    }

    /**
     * @dev Sets protocol fee
     * @param _fee - fees for the collector
     */
    function setProtocolFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    /**
     * @notice Set the fees collector
     * @param _newFeesCollector - fees collector
     */
    function setFeesCollector(address _newFeesCollector) public onlyOwner {
        require(
            _newFeesCollector != address(0),
            "setFeesCollector: INVALID_FEES_COLLECTOR"
        );

        feesCollector = _newFeesCollector;
    }
}
