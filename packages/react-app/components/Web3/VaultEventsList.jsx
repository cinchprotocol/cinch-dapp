import React from "react";
import { Col, Row, Statistic, Card, List, Space } from "antd";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");
import { useEventListener } from "eth-hooks/events/useEventListener";

import Address from "../Address";
const assetDecimals = 6;
const shareDecimals = 6
const VaultEventsList = ({ graphData }) => {
  var vaultDepositEvents = graphData?.depositWithReferrals;
  var vaultWithdrawEvents = graphData?.withdraws;
  var vaultRevenueShareWithdrawEvents = graphData?.revenueShareWithdrawns;

  vaultDepositEvents = vaultDepositEvents?.map(obj => {
    return { ...obj, Type: 'Deposit' };
  });

  vaultWithdrawEvents = vaultWithdrawEvents?.map(obj => {
    return { ...obj, Type: 'Withdrawal' };
  });

  vaultRevenueShareWithdrawEvents = vaultRevenueShareWithdrawEvents?.map(obj => {
    return { ...obj, Type: 'Referral Withdrawal', assets: obj.amount };
  });

  const vaultEvents = vaultDepositEvents?.concat(vaultWithdrawEvents).concat(vaultRevenueShareWithdrawEvents);

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
              Assets (USDC)
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
          {vaultEvents?.map((item) => (
            <tr key={item.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {item.Type}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><Address address={item?.receiver} ensProvider={web3?.mainnetProvider} fontSize={16} /></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ethers.utils.formatUnits(item?.assets ?? 0, assetDecimals)}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ethers.utils.formatUnits(item?.shares ?? 0, shareDecimals)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultEventsList;
