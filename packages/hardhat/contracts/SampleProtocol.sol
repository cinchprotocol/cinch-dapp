// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SampleProtocol is Ownable {
    event FeeReceiverUpdated(address indexed feeReceiver);
    event Deposited(address indexed token, uint256 amount);
    event Withdrawn(address indexed token, uint256 amount);

    address public feeReceiver;
    uint256 public fee;

    /**
     * @dev Constructor of the contract.
     */
    constructor() {
        feeReceiver = msg.sender;
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
     * @param _newFeeReceiver - fees collector
     */
    function setFeeReceiver(address _newFeeReceiver) public {
        require(
            _newFeeReceiver != address(0),
            "setFeesCollector: INVALID_FEES_COLLECTOR"
        );

        feeReceiver = _newFeeReceiver;
        emit FeeReceiverUpdated(_newFeeReceiver);
    }

    /**
     * @notice deposit tokens
     * @param _amount of the underlying token to deposit
     */
    function deposit(address tokenAddress, uint256 _amount) external {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        emit Deposited(tokenAddress, _amount);
    }

     /**
     * @notice withdraw tokens
     * @param _amount of the underlying token to deposit
     */
    function withdraw(address tokenAddress, uint256 _amount) external {
        IERC20(tokenAddress).transfer(msg.sender, _amount);
        emit Withdrawn(tokenAddress, _amount);
    }
}
