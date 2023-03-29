import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultDepositForm = ({ web3, assetDecimals = 6, referralAddress, defaultDepositAmountStr = "1000" }) => {
  const [formValues, setFormValues] = useState(null);
  const [isReferralEnabled, setIsReferralEnabled] = useState(true);
  const [depositAmountStr, setDepositAmountStr] = useState(defaultDepositAmountStr);
  const mockERC20ApprovalEvents = useEventListener(web3?.readContracts, "MockERC20", "Approval");
  console.log("mockERC20ApprovalEvents", mockERC20ApprovalEvents);

  const approveAsset = async values => {
    const { depositAmount } = values;
    if (!web3 || !depositAmount) return;
    await web3?.tx(
      web3?.writeContracts?.MockERC20?.approve(
        web3?.writeContracts?.Vault?.address,
        ethers.utils.parseUnits(depositAmount, assetDecimals),
      ),
    );
  };

  const depositAsset = async values => {
    if (!web3 || !depositAmountStr || !referralAddress) return;
    console.log("depositAsset", depositAmountStr, isReferralEnabled);
    if (isReferralEnabled) {
      await web3?.tx(
        web3?.writeContracts?.Vault?.depositWithReferral(
          ethers.utils.parseUnits(depositAmountStr, assetDecimals),
          web3?.address,
          referralAddress,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts?.Vault?.deposit(ethers.utils.parseUnits(depositAmountStr, assetDecimals), web3?.address),
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

  const onCheckBoxChange = e => {
    //console.log(`onCheckBoxChange checked = ${e.target.checked}`);
    setIsReferralEnabled(!isReferralEnabled);
  };

  const onInputChange = e => {
    console.log(`onInputChange value = ${e.target.value}`);
    setDepositAmountStr(e.target.value);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ referralEnabled: true, depositAmount: defaultDepositAmountStr }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      size="large"
    >
      <Form.Item
        label="Deposit (USDC)"
        name="depositAmount"
        rules={[{ required: true, message: "Please input the Deposit Amount!" }]}
      >
        <Input onChange={onInputChange} />
      </Form.Item>

      <Form.Item name="referralEnabled" valuePropName="checked"    wrapperCol={{
        offset: 8,
        span: 16,
      }}>
        <Checkbox checked={isReferralEnabled} onChange={onCheckBoxChange}>
          Include platform referral code
        </Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{
        offset: 8,
        span: 16,
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
  );
};

export default VaultDepositForm;
