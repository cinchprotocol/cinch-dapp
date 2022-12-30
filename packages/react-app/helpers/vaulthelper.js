import externalContracts from "../contracts/external_contracts";
import { Contract } from "@ethersproject/contracts";
const { utils } = require("ethers");
import { displayError } from "./errorhelper";
import { message } from "antd";

const VAULTABI = externalContracts[31337]?.contracts?.VAULT?.abi;

export const getVaultContract = ({ web3, address }) => {
  const vaultContract = new Contract(address, VAULTABI, web3?.userSigner);
  return vaultContract;
};

export const fetchVaultData = async ({ web3, address }) => {
  let data;
  try {
    const vaultContract = getVaultContract({ web3, address });

    data = {
      name: await vaultContract?.name(),
      feeCollector: await vaultContract?.yieldSourceVault(),
      multiSig: await vaultContract?.multiSig(),
      revenuePct: "3",
      expAmount: "50000",
      status: await vaultContract?.vaultStatus(),
      isFeeCollectorUpdated: await vaultContract?.isFeeCollectorUpdated(),
      isMultisigGuardAdded: await vaultContract?.isMultisigGuardAdded(),
      //isReadyToActivate: isFeeCollectorUpdated && isMultisigGuardAdded,
      multisigGuard: await vaultContract?.multisigGuard(),
    };
  } catch (err) {
    displayError("fetchVaultData", err);
  } finally {
    return data;
  }
};

export const activateVault = async ({ web3, address }) => {
  const vaultContract = getVaultContract({ web3, address });

  try {
    const tx = await web3?.tx(
      vaultContract?.activate({
        from: web3?.address,
      }),
      res => {
        if (res.status == 1) {
        }
      },
    );
    const txRes = await tx?.wait();
    console.log("txRes", txRes);
  } catch (err) {
    displayError("Vault:Activate", err);
  }
};

export const withdraw = async ({ web3, address }) => {
  const vaultContract = getVaultContract({ web3, address });

  try {
    const tx = await web3?.tx(
      vaultContract?.withdraw({
        from: web3?.address,
      }),
    );
    const txRes = await tx?.wait();
    console.log("txRes", txRes);

    if (txRes?.events?.find(e => e?.event === "BalanceWithdrawn")) {
      message.success("Withdraw successful");
    }
  } catch (err) {
    message.error(err);
  }
};
