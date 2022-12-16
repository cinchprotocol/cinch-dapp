// npx hardhat run --network localhost scripts/upgrade_feesplitter.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const cinchPxProxy = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  const cinchPxUpdated = await ethers.getContractFactory("Vault");
  console.log("Upgrading Vault...");
  await upgrades.upgradeProxy(cinchPxProxy, cinchPxUpdated);
  console.log("Vault upgraded");
}

main();
