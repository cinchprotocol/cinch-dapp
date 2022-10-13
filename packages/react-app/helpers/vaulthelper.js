import externalContracts from "../contracts/external_contracts";
import { Contract } from "@ethersproject/contracts";

const RBFVAULTABI = externalContracts[31337]?.contracts?.RBFVAULT?.abi;

export const getVaultContract = ({ web3, address }) => {
  const vaultContract = new Contract(address, RBFVAULTABI, web3?.localProvider);
  return vaultContract;
};

export const fetchVaultData = async ({ web3, address }) => {
  const vaultContract = getVaultContract({ web3, address });
  //const status = await vaultContract?.status();
  //return { status };
  return {};
};
