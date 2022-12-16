// npx hardhat run --network localhost scripts/deploy_upgradeable_feesplitter.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const mockCinchPx = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const mockProtocol = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const mockERC20 = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const accounts = await ethers.getSigners();
  const accountProtocolPayee = accounts[1];
  const accountCinchPxPayee = accounts[2];

  const FeeSplitter = await ethers.getContractFactory("FeeSplitter");
  console.log("Deploying FeeSplitter...");
  const feeSplitter = await upgrades.deployProxy(FeeSplitter, [
    mockCinchPx,
    mockProtocol,
    [mockERC20],
    accountProtocolPayee.address,
    [accountCinchPxPayee.address],
  ]);
  await feeSplitter.deployed();
  console.log("FeeSplitter deployed to:", feeSplitter.address);
}

main();
