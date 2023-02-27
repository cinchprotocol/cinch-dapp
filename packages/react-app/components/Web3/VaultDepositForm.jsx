import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultDepositForm = ({ web3, mockERC20Decimals = 6, referralAddress }) => {
  const [formValues, setFormValues] = useState(null);
  const [isReferralEnabled, setIsReferralEnabled] = useState(true);
  const [depositAmountStr, setDepositAmountStr] = useState("1000");
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
    if (!web3 || !depositAmountStr || !referralAddress) return;
    console.log("depositAsset", depositAmountStr, isReferralEnabled);
    if (isReferralEnabled) {
      await web3?.tx(
        web3?.writeContracts?.Vault?.depositWithReferral(
          ethers.utils.parseUnits(depositAmountStr, mockERC20Decimals),
          web3?.address,
          referralAddress,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts?.Vault?.deposit(
          ethers.utils.parseUnits(depositAmountStr, mockERC20Decimals),
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

  const onCheckBoxChange = e => {
    //console.log(`onCheckBoxChange checked = ${e.target.checked}`);
    setIsReferralEnabled(!isReferralEnabled);
  };

  const onInputChange = e => {
    console.log(`onInputChange value = ${e.target.value}`);
    setDepositAmountStr(e.target.value);
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card title="Deposit into Idle Clearpool">
          <Form
            name="basic"
            labelCol={{ span: 11 }}
            wrapperCol={{ span: 13 }}
            style={{ maxWidth: 600 }}
            initialValues={{ referralEnabled: true, depositAmount: "1000" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Deposit Amount (USDC)"
              name="depositAmount"
              rules={[{ required: true, message: "Please input the Deposit Amount!" }]}
            >
              <Input onChange={onInputChange} />
            </Form.Item>

            <Form.Item name="referralEnabled" valuePropName="checked" wrapperCol={{ span: 16 }}>
              <Checkbox checked={isReferralEnabled} onChange={onCheckBoxChange}>
                Include platform referral code
              </Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8,}}>
              <Space>
                <Button type="primary" htmlType="submit">
                  2. Approve
                </Button>
                <Button
                  type="primary"
                  disabled={formValues == null}
                  onClick={() => {
                    depositAsset(formValues);
                  }}
                >
                  3. Deposit
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default VaultDepositForm;
