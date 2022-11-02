// SPDX-License-Identifier: MIT
// Mock ERC20 for testing purposes
pragma solidity ^0.8.6;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    // Define the supply of MockERC20: 1,000,000 
    uint256 constant initialSupply = 1000000 * (10**18);

    // Constructor will be called on contract creation
    constructor() ERC20("MockERC20", "MockERC20") {
        _mint(msg.sender, initialSupply);
    }
}