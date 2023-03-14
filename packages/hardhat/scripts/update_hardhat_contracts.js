const { writeFileSync } = require("fs");
const hardhatContracts = require("../../react-app/contracts/hardhat_contracts.json");
const vaultContract = require("../artifacts/contracts/Vault.sol/Vault.json");
const feeSplitterContract = require("../artifacts/contracts/FeeSplitter.sol/FeeSplitter.json");

// console.log("hardhatContracts", hardhatContracts);

const chainId = process.env.DEFAULT_WEB3_PROVIDER === "goerli" ? "5" : "31337";
const vaultAddress = process.argv[2];
const feeSplitterAddress = process.argv[3];

console.log(
  "chainId",
  chainId,
  "vaultAddress",
  vaultAddress,
  "feeSplitterAddress",
  feeSplitterAddress
);

hardhatContracts[chainId][process.env.DEFAULT_WEB3_PROVIDER].contracts.Vault = {
  address: vaultAddress,
  abi: vaultContract.abi,
};

hardhatContracts[chainId][
  process.env.DEFAULT_WEB3_PROVIDER
].contracts.FeeSplitter = {
  address: feeSplitterAddress,
  abi: feeSplitterContract.abi,
};

/*
console.log(
  "hardhatContracts Vault",
  hardhatContracts[chainId][process.env.DEFAULT_WEB3_PROVIDER].contracts.Vault
);
*/

const outputPath = "packages/react-app/contracts/hardhat_contracts.json";
try {
  writeFileSync(outputPath, JSON.stringify(hardhatContracts, null, 2), "utf8");
  console.log("Data successfully saved to disk");
} catch (error) {
  console.log("An error has occurred ", error);
}
