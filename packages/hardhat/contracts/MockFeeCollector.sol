// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockFeeCollector is Ownable {
    event FeeReceiverUpdated(address indexed feeReceiver);

    address public _feeReceiver;

    /**
     * @dev return _feeReceiver
     */
    function feeReceiver() external view returns (address) {
        return _feeReceiver;
    }

    /**
     * @dev Sets _feeReceiver
     * @param newFeeReceiver - address of the new fee receiver
     */
    function setFeeReceiver(address newFeeReceiver) external onlyOwner {
        require(
            newFeeReceiver != address(0),
            "setFeeReceiver: INVALID_FEES_COLLECTOR"
        );
        _feeReceiver = newFeeReceiver;
        emit FeeReceiverUpdated(newFeeReceiver);
    }
}
