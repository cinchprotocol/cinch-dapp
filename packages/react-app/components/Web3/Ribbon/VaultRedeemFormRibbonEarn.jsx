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
  const [withdrawAmountStr, setWithdrawAmountStr] = useState(0);
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
    setWithdrawAmountStr(e.target.value);
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
              initiateWithdraw();
            }} className="mt-10 w-full">
            Initiate Withdraw
          </Button>
        </div>
      }



      {/* <Form
        name="basic"
        style={{ maxWidth: 600 }}
        initialValues={{ redeemAmount: defaultRedeemAmountStr }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        size="large"
        layout="vertical"
      >
        <Form.Item
          label="Redeem Amount"
          name="redeemAmount"
          hidden={pendingWithdrawal > 0}
          rules={[{ required: true, message: "Please input the Redeem Amount!" }]}
        >
          <Input onChange={onAmountChange} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" hidden={pendingWithdrawal > 0}
            onClick={() => {
              initiateWithdraw();
            }} className="w-full">
            Initiate Withdraw
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" hidden={pendingWithdrawal == 0}
            onClick={() => {
              completeWithdraw();
            }} className="w-full">
            Complete Withdraw
          </Button>
        </Form.Item>
      </Form> */}
    </div>
  );
};

export default VaultRedeemFormRibbonEarn;
