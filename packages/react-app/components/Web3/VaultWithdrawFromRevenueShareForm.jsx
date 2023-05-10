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
  const [formValues, setFormValues] = useState(null);

  const withdrawRevenueShare = async values => {
    const { withdrawAmount } = values;
    if (!web3 || !withdrawAmount) return;

    await web3?.tx(
      web3?.writeContracts[vaultContractName]?.withdrawFromRevenueShare(
        web3?.writeContracts?.MockERC20?.address,
        ethers.utils.parseUnits(withdrawAmount, assetDecimals),
        web3?.address,
      ),
    );
  };

  const onFinish = async values => {
    console.log("onFinish:", values);
    await withdrawRevenueShare(values);
    setFormValues(values);
  };

  const onFinishFailed = errorInfo => {
    console.log("onFinishFailed:", errorInfo);
  };

  return (
    <div className="px-8">

      <Form
        name="basic"
        style={{ maxWidth: 600 }}
        initialValues={{ withdrawAmount: defaultWithdrawAmountStr }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Amount"
          name="withdrawAmount"
          rules={[{ required: true, message: "Please input the Withdraw Amount!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">

            Withdraw

          </Button>
        </Form.Item>
      </Form>

    </div>
  );
};

export default VaultWithdrawFromRevenueShareForm;
