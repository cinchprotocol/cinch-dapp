// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ISampleProtocol {
    //for IdleCDO: https://github.com/Idle-Labs/idle-tranches/blob/0c1b29f8446a0ca2a0d0a0321d8d7d60f1e0959d/contracts/IdleCDO.sol#L186
    function getContractValue() external view returns (uint256);
}
