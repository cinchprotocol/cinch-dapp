import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultWithdrawFromRevenueShareForm = ({
  web3,
  assetDecimals = 6,
  defaultWithdrawAmountStr = "100",
  vaultContractName = "Vault",
  cardTitle = "Withdraw From Revenue Share (Referral Account Only)",
}) => {
  const [withdrawAmountStr, setWithdrawAmountStr] = useState(0);

  const withdrawRevenueShare = async values => {
    const { withdrawAmount } = values;
    if (!web3 || !withdrawAmountStr) return;

    await web3?.tx(
      web3?.writeContracts[vaultContractName]?.withdrawFromRevenueShare(
        web3?.writeContracts?.MockERC20?.address,
        ethers.utils.parseUnits(withdrawAmountStr, assetDecimals),
        web3?.address,
      ),
    );
  };

  const onAmountChange = e => {
    console.log(`onAmountChange value = ${e.target.value}`);
    setWithdrawAmountStr(e.target.value);
  };

  return (
    <div className="px-8">
      <div>
        <div className="bg-slate-50 rounded-2xl p-4 text-3xl  border hover:border-slate-300 flex justify-between">
          <input
            type='text'
            className="bg-transparent placeholder:text-[#B2B9D2] border-transparent focus:border-transparent focus:ring-0 text-2xl"
            placeholder='0.0'
            pattern='^[0-9]*[.,]?[0-9]*$'
            onChange={onAmountChange}
          />

          <div className="inline-flex items-center gap-x-2 bg-slate-200 rounded-2xl text-base font-medium px-3.5 py-1 shadow my-auto">
            <img
              className="inline-block h-6 w-6 rounded-full"
              src="/usdc_logo.jpeg"
              alt=""
            />
            USDC
          </div>
        </div>

        <Button type="primary" disabled={withdrawAmountStr == '0'}
          onClick={() => {
            withdrawRevenueShare();
          }} className="mt-10 w-full">
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default VaultWithdrawFromRevenueShareForm;
