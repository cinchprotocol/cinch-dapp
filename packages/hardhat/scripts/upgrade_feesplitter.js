// npx hardhat run --network localhost scripts/upgrade_feesplitter.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const feeSplitterProxy = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  const FeeSplitter = await ethers.getContractFactory("FeeSplitter");
  console.log("Upgrading FeeSplitter...");
  await upgrades.upgradeProxy(feeSplitterProxy, FeeSplitter);
  console.log("FeeSplitter upgraded");
}

main();
