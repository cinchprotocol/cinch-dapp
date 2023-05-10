import React from "react";
import { Col, Row, Statistic, Card, List, Space } from "antd";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");
import { useEventListener } from "eth-hooks/events/useEventListener";

import Address from "../Address";

const VaultEventsList = ({ web3, assetDecimals = 6, shareDecimals = 6, vaultContractName = "Vault" }) => {
  var vaultDepositEvents = useEventListener(web3?.readContracts, vaultContractName, "DepositWithReferral");
  var vaultWithdrawEvents = useEventListener(web3?.readContracts, vaultContractName, "RedeemWithReferral");

  vaultDepositEvents = vaultDepositEvents.map(obj => {
    return { ...obj, Type: 'Deposit' };
  });

  vaultWithdrawEvents = vaultWithdrawEvents.map(obj => {
    return { ...obj, Type: 'Withdrawal' };
  });

  const vaultEvents = vaultDepositEvents.concat(vaultWithdrawEvents);

  return (
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 rounded-2xl shadow bg-white ring-1 ring-gray-300 mb-20">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:pl-0"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Address
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Assets
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Shares
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {vaultEvents.map((item) => (
            <tr key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_"}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {item.Type}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><Address address={item.args[0]} ensProvider={web3?.mainnetProvider} fontSize={16} /></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ethers.utils.formatUnits(item?.args[2], assetDecimals)}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ethers.utils.formatUnits(item?.args[3], shareDecimals)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultEventsList;
