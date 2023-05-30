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
  var pendingWithdrawal = useContractReader(web3.readContracts, vaultContractName, 'withdrawals', [0x5a5a338eb7f5baf9b3ff72ce57424deecf23e154], 500);
  console.log("pendingWithdrawal", pendingWithdrawal);
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
      <div>
        {pendingWithdrawal?.toString()}
      </div>
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
          rules={[{ required: true, message: "Please input the Redeem Amount!" }]}
        >
          <Input onChange={onAmountChange} />
        </Form.Item>

        <Form.Item>
          <Button type="primary"
            onClick={() => {
              initiateWithdraw();
            }} className="w-full">
            Initiate Withdraw
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary"
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
