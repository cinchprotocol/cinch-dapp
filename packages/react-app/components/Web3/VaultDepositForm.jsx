import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultDepositForm = ({
  web3,
  assetDecimals = 6,
  referralAddress,
  defaultDepositAmountStr = "1000",
  vaultContractName = "Vault"
}) => {
  const [formValues, setFormValues] = useState(null);
  const [referralCode, setReferralCode] = useState(referralAddress);
  const [depositAmountStr, setDepositAmountStr] = useState(defaultDepositAmountStr);

  const approveAsset = async values => {
    const { depositAmount } = values;
    if (!web3 || !depositAmount) return;
    await web3?.tx(
      web3?.writeContracts?.MockERC20?.approve(
        web3?.writeContracts?.[vaultContractName]?.address,
        ethers.utils.parseUnits(depositAmount, assetDecimals),
      ),
    );
  };

  const depositAsset = async values => {
    if (!web3 || !depositAmountStr || !referralCode) return;
    console.log("depositAsset", depositAmountStr, referralCode);
    if (referralCode) {
      await web3?.tx(
        web3?.writeContracts?.[vaultContractName]?.depositWithReferral(
          ethers.utils.parseUnits(depositAmountStr, assetDecimals),
          web3?.address,
          referralCode,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts?.[vaultContractName]?.deposit(
          ethers.utils.parseUnits(depositAmountStr, assetDecimals),
          web3?.address,
        ),
      );
    }
  };

  const onFinish = async values => {
    console.log("onFinish:", values);
    await approveAsset(values);
    setFormValues(values);
  };

  const onFinishFailed = errorInfo => {
    console.log("onFinishFailed:", errorInfo);
  };

  const onReferralChange = e => {
    console.log(`onReferralChange value = ${e.target.value}`);
    setReferralCode(e.target.value);
  };

  const onInputChange = e => {
    console.log(`onInputChange value = ${e.target.value}`);
    setDepositAmountStr(e.target.value);
  };

  return (
    <div className="px-8">

    <Form
      name="basic"    
      style={{ maxWidth: 600 }}
      initialValues={{ referralEnabled: true, depositAmount: defaultDepositAmountStr }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      size="large"
      layout="vertical"
    >
      <Form.Item
        label="Deposit (USDC)"
        name="depositAmount"
        rules={[{ required: true, message: "Please input the Deposit Amount!" }]}
      >
        <Input onChange={onInputChange} />
      </Form.Item>


      <Form.Item label="Referral Code" name="referralCode"  >
        <Input onChange={onReferralChange} value={referralCode}/>
      </Form.Item>

      <Form.Item wrapperCol={{
       
      }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Approve
          </Button>
          <Button
            type="primary"
            disabled={formValues == null}
            onClick={() => {
              depositAsset(formValues);
            }}
          >
            Deposit
          </Button>
        </Space>
      </Form.Item>
    </Form>
    </div>
  );
};

export default VaultDepositForm;
