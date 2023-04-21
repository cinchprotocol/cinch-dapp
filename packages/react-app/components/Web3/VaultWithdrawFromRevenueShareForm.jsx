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
    <Row gutter={16}>
      <Col span={24}>
        <Card title={cardTitle}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ withdrawAmount: defaultWithdrawAmountStr }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Amount"
              name="withdrawAmount"
              rules={[{ required: true, message: "Please input the Withdraw Amount!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Space>
                <Button type="primary" htmlType="submit">

                  8. Withdraw

                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default VaultWithdrawFromRevenueShareForm;
