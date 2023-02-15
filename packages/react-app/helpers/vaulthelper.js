//import externalContracts from "../contracts/external_contracts";
import hardhat_contracts from "../contracts/hardhat_contracts";
//because vault upgradeable proxy was not deployed using hardhat-deploy, so its metadata is not exported to hardhat_contracts.json
//so import from the artifact instead
import vault_json from "../../hardhat/artifacts/contracts/Vault.sol/Vault";
import { Contract } from "@ethersproject/contracts";
const { utils } = require("ethers");
import { displayError } from "./errorhelper";
import { message } from "antd";

export const getVaultContract = ({ web3, address }) => {
  console.log("web3", web3); //!!!
  if (!web3 || !address || !web3.chainId) return;
  const vaultContract = new Contract(address, vault_json.abi, web3?.userSigner);
  return vaultContract;
};

export const fetchVaultData = async ({ web3, address }) => {
  let data;
  try {
    const vaultContract = getVaultContract({ web3, address });

    data = {
      name: await vaultContract?.name(),
      //feeCollector: await vaultContract?.feeCollector(),
      //multiSig: await vaultContract?.multiSig(),
      //revenuePct: _.toNumber(utils.formatEther(await vaultContract?.revenuePct())).toFixed(0),
      //price: utils.formatUnits(await vaultContract?.price(), process.env.PRICE_DECIMALS),
      //expAmount: utils.formatUnits(await vaultContract?.expAmount(), process.env.PRICE_DECIMALS),
      //borrower: await vaultContract?.borrower(),
      //lender: await vaultContract?.lender(),
      vaultStatus: await vaultContract?.vaultStatus(),
      //isFeeCollectorUpdated: await vaultContract?.isFeeCollectorUpdated(),
      isMultisigGuardAdded: await vaultContract?.isMultisigGuardAdded(),
      // isReadyToActivate: isFeeCollectorUpdated && isMultisigGuardAdded,
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
