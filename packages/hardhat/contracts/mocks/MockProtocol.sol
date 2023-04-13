// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMockERC20 {
    function faucet(address to, uint256 amount) external;
}

interface IFeeSplitter {
    function processFeeSplit() external;
}

contract MockProtocol is Ownable {
    event FeeReceiverUpdated(address indexed feeReceiver);
    event Deposited(address indexed token, uint256 amount);
    event Withdrawn(address indexed token, uint256 amount);
    event FeeReleased(address indexed token, uint256 amount);

    address public feeReceiver;
    uint256 public fee;
    uint256 internal _totalValueLocked;
    uint256 public priceAA;
    address public AATranche;
    uint256 public constant ONE_TRANCHE_TOKEN = 10**18;
    address public tokenAddress;

    /**
     * @dev Constructor of the contract.
     */
    constructor(address tokenAddress_) {
        feeReceiver = msg.sender;
        fee = 1;
        priceAA = ONE_TRANCHE_TOKEN;
        tokenAddress = tokenAddress_;
        AATranche = tokenAddress_;
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
     * @notice withdraw tokens
     * @param _amount of the underlying token to deposit
     */
    /* 
    function withdraw(address tokenAddress, uint256 _amount) external {
        IERC20(tokenAddress).transfer(msg.sender, _amount);
        emit Withdrawn(tokenAddress, _amount);
    }
    */

    //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L143
    function depositAARef(uint256 _amount, address _referral) external returns (uint256) {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        _totalValueLocked += _amount;
        emit Deposited(tokenAddress, _amount);
        return _amount;
    }

    /**
     * @param _amount of the underlying token to deposit
     */
    function deposit(uint256 _amount) external returns (uint256) {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        _totalValueLocked += _amount;
        emit Deposited(tokenAddress, _amount);
        return _amount;
    }

    //https://github.com/Idle-Labs/idle-tranches/blob/f542cc2372530ea68ab5eb0ad3bcf805928fd6b2/contracts/IdleCDO.sol#L159
    function withdrawAA(uint256 _amount) external returns (uint256) {
        IERC20(tokenAddress).transfer(msg.sender, _amount);
        _totalValueLocked -= _amount;
        emit Withdrawn(tokenAddress, _amount);
        return _amount;
    }

    /**
     * @dev Getter of _totalValueLocked
     */
    function getTotalShares() external view returns (uint256) {
        return _totalValueLocked;
    }

    /**
     * @dev Getter of _totalValueLocked
     */
    function getContractValue() external view returns (uint256) {
        return _totalValueLocked;
    }

    /**
     * @dev Setter of _totalValueLocked
     */
    function setTotalValueLocked(uint256 tvl) external onlyOwner {
        _totalValueLocked = tvl;
    }

    /**
     * @dev Send the fee to the fee receiver address
     */
    function releaseFee(address tokenAddress_, uint256 amount) public {
        IERC20(tokenAddress_).transfer(feeReceiver, amount);
        emit FeeReleased(tokenAddress, amount);
    }

    function setPriceAA(uint256 price) external {
        priceAA = price;
    }

    function setAATranche(address tranchAddress) external {
        AATranche = tranchAddress;
    }

    function gainRevenueAndRelease(address tokenAddress_, uint256 amount_) external {
        IFeeSplitter(feeReceiver).processFeeSplit();
        IMockERC20(tokenAddress_).faucet(address(this), amount_);
        releaseFee(tokenAddress_, amount_);
        IFeeSplitter(feeReceiver).processFeeSplit();
    }
}
