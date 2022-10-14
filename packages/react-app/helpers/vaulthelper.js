import externalContracts from "../contracts/external_contracts";
import { Contract } from "@ethersproject/contracts";
const { utils } = require("ethers");

const RBFVAULTABI = externalContracts[31337]?.contracts?.RBFVAULT?.abi;

export const getVaultContract = ({ web3, address }) => {
  const vaultContract = new Contract(address, RBFVAULTABI, web3?.localProvider);
  return vaultContract;
};

export const fetchVaultData = async ({ web3, address }) => {
  const vaultContract = getVaultContract({ web3, address });

  const data = {
    name: await vaultContract?.name(),
    feeCollector: await vaultContract?.feeCollector(),
    multiSig: await vaultContract?.multiSig(),
    revenuePct: _.toNumber(utils.formatEther(await vaultContract?.revenuePct())).toFixed(0),
    price: utils.formatEther(await vaultContract?.price()),
    expAmount: utils.formatEther(await vaultContract?.expAmount()),
    borrower: await vaultContract?.borrower(),
    lender: await vaultContract?.lender(),
    status: await vaultContract?.status(),
    isFeeCollectorUpdated: await vaultContract?.isFeeCollectorUpdated(),
    isMultisigGuardAdded: await vaultContract?.isMultisigGuardAdded(),
    isReadyToActivate: isFeeCollectorUpdated && isMultisigGuardAdded
  }
  return data;
};
