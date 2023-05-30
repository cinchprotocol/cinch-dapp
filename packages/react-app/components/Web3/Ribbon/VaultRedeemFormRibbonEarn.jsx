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
    if (!web3 || !withdrawAmountStr) return;

    await web3?.tx(
      web3?.writeContracts[vaultContractName]?.completeWithdraw(),
    );
  };

  const onFinish = async values => {
    console.log("onFinish:", values);
    await redeemAsset(values);
    setFormValues(values);
  };

  const onFinishFailed = errorInfo => {
    console.log("onFinishFailed:", errorInfo);
  };

  const onAmountChange = e => {
    console.log(`onAmountChange value = ${e.target.value}`);
    setWithdrawAmountStr(e.target.value);
  };

  return (
    <div className="px-8">
      {pendingWithdrawal > 0 ?
        <div>
          <dt class="text-sm font-medium text-gray-500">Pending Withdrawal Balance </dt>
          <dd class="mt-1 text-2xl  text-gray-900">{pendingWithdrawal?.toString()}</dd>
        </div> : ""
      }
      <Form
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
      </Form>
    </div>
  );
};

export default VaultRedeemFormRibbonEarn;
