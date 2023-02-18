import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";
import VaultDepositEventList from "./VaultDepositEventList";

const VaultDepositForm = ({ web3, mockERC20Decimals = 6, referralAddress }) => {
  const [formValues, setFormValues] = useState(null);
  const mockERC20ApprovalEvents = useEventListener(web3?.readContracts, "MockERC20", "Approval");
  console.log("mockERC20ApprovalEvents", mockERC20ApprovalEvents);

  const approveAsset = async values => {
    const { depositAmount } = values;
    if (!web3 || !depositAmount) return;
    await web3?.tx(
      web3?.writeContracts?.MockERC20?.approve(
        web3?.writeContracts?.Vault?.address,
        ethers.utils.parseUnits(depositAmount, mockERC20Decimals),
      ),
    );
  };

  const depositAsset = async values => {
    const { depositAmount, referralEnabled } = values;
    if (!web3 || !depositAmount || !referralAddress) return;
    if (referralEnabled) {
      await web3?.tx(
        web3?.writeContracts?.Vault?.depositWithReferral(
          ethers.utils.parseUnits(depositAmount, mockERC20Decimals),
          web3?.address,
          referralAddress,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts?.Vault?.deposit(ethers.utils.parseUnits(depositAmount, mockERC20Decimals), web3?.address),
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

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ referralEnabled: true, depositAmount: "1000" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Deposit Amount"
            name="depositAmount"
            rules={[{ required: true, message: "Please input the Deposit Amount!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="referralEnabled" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>with Referral</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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

          <VaultDepositEventList web3={web3} mockERC20Decimals={mockERC20Decimals} />
        </Form>
      </Col>
    </Row>
  );
};

export default VaultDepositForm;
