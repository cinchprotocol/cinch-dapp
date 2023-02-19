import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultRedeemForm = ({ web3, mockERC20Decimals = 6, referralAddress }) => {
  const [formValues, setFormValues] = useState(null);
  const mockERC20ApprovalEvents = useEventListener(web3?.readContracts, "MockERC20", "Approval");
  console.log("mockERC20ApprovalEvents", mockERC20ApprovalEvents);

  const redeemAsset = async values => {
    const { redeemAmount, referralEnabled } = values;
    if (!web3 || !redeemAmount || !referralAddress) return;
    if (referralEnabled) {
      await web3?.tx(
        web3?.writeContracts?.Vault?.redeemWithReferral(
          ethers.utils.parseUnits(redeemAmount, mockERC20Decimals),
          web3?.address,
          web3?.address,
          referralAddress,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts?.Vault?.redeem(
          ethers.utils.parseUnits(redeemAmount, mockERC20Decimals),
          web3?.address,
          web3?.address,
        ),
      );
    }
  };

  const onFinish = async values => {
    console.log("onFinish:", values);
    await redeemAsset(values);
    setFormValues(values);
  };

  const onFinishFailed = errorInfo => {
    console.log("onFinishFailed:", errorInfo);
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card title="Redeem from Cinch Vault">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ referralEnabled: true, redeemAmount: "1000" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Redeem Amount"
              name="redeemAmount"
              rules={[{ required: true, message: "Please input the Redeem Amount!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="referralEnabled" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>with Referral</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  6. Redeem
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default VaultRedeemForm;
