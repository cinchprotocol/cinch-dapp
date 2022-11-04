// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockFeeCollector is Ownable {
    event FeeReceiverUpdated(address indexed feeReceiver);
    event Deposited(address indexed token, uint256 amount);
    event Withdrawn(address indexed token, uint256 amount);

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

    /**
     * @dev deposit tokens to the fee collector. Mock function, did nothing for now
     * @param tokenAddress - address of the token contract
     * @param amount - amount of tokens to deposit
     */
    function deposit(address tokenAddress, uint256 amount) external {
        emit Deposited(tokenAddress, amount);
    }

    /**
     * @dev withdraw tokens from the fee collector. Mock function, did nothing for now
     * @param tokenAddress - address of the token contract
     * @param amount - amount of tokens to deposit
     */
    function withdraw(address tokenAddress, uint256 amount) external {
        emit Withdrawn(tokenAddress, amount);
    }
}
