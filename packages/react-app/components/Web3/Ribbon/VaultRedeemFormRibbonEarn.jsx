import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../../Button";

const VaultRedeemFormRibbonEarn = ({
  web3,
  shareDecimals = 6,
  defaultRedeemAmountStr = "1000",
  vaultContractName = "MockProtocolRibbonEarn",
  cardTitle = "Redeem from Cinch Vault",
}) => {
  const [formValues, setFormValues] = useState(null);

  const redeemAsset = async values => {
    const { redeemAmount } = values;
    if (!web3 || !redeemAmount) return;

    await web3?.tx(
      web3?.writeContracts[vaultContractName]?.redeem(
        ethers.utils.parseUnits(redeemAmount, shareDecimals),
        web3?.address,
        web3?.address,
      ),
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

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card title={cardTitle}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ redeemAmount: defaultRedeemAmountStr }}
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

export default VaultRedeemFormRibbonEarn;
