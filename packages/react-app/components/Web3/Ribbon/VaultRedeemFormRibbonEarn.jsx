import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../../Button";

const VaultRedeemFormRibbonEarn = ({
  web3,
  shareDecimals = 6,
  defaultRedeemAmountStr = "0",
  vaultContractName = "MockProtocolRibbonEarn",
  cardTitle = "Redeem from Cinch Vault",
}) => {
  const [withdrawAmountStr, setWithdrawAmountStr] = useState('');
  var pendingWithdrawal = ethers.utils.formatUnits(useContractReader(web3.readContracts, vaultContractName, 'withdrawals', [web3?.address], 500)?.[1] ?? 0, shareDecimals);

  const initiateWithdraw = async values => {
    if (!web3 || !withdrawAmountStr) return;

    await web3?.tx(
      web3?.writeContracts[vaultContractName]?.initiateWithdraw(
        withdrawAmountStr
      ),
    );
  };

  const completeWithdraw = async values => {
    if (!web3) return;

    await web3?.tx(
      web3?.writeContracts[vaultContractName]?.completeWithdraw(),
    );
  };

  const onAmountChange = e => {
    const { value } = e.target;
    var sanitizedValue = value.replace(/[^0-9.]/g, '');
    const decimalIndex = sanitizedValue.indexOf('.');
    if (decimalIndex !== -1) {
      const decimalPart = sanitizedValue.substring(decimalIndex + 1);
      if (decimalPart.length > 6) {
        const truncatedDecimal = decimalPart.substring(0, 6);
        sanitizedValue = sanitizedValue.substring(0, decimalIndex + 1) + truncatedDecimal;
      }
    }
    setWithdrawAmountStr(sanitizedValue);
  };

  return (
    <div className="m-6">
      {pendingWithdrawal > 0 ?
        <div>
          <dt class="text-sm font-medium text-gray-500">Pending Withdrawal Balance </dt>
          <dd class="mt-1 text-2xl  text-gray-900">{pendingWithdrawal?.toString()}</dd>

          <Button type="primary"
            onClick={() => {
              completeWithdraw();
            }} className="mt-10 w-full">
            Complete Withdraw
          </Button>
        </div>
        :

        <div>
          <div className="bg-slate-50 rounded-2xl p-4 text-3xl  border hover:border-slate-300 flex justify-between">
            <input
              type='text'
              className="bg-transparent placeholder:text-[#B2B9D2] border-transparent focus:border-transparent focus:ring-0 text-2xl"
              placeholder='0'
              value={withdrawAmountStr}
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
              initiateWithdraw();
            }} className="mt-10 w-full">
            Initiate Withdraw
          </Button>
        </div>
      }
    
    </div>
  );
};

export default VaultRedeemFormRibbonEarn;
