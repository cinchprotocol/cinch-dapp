import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultAddRevenueShareReferralForm = ({
  web3,
  defaultReferralAddress,
  vaultContractName = "RevenueShareVault",
  cardTitle = "Add Referral (Vault Owner Only)",
}) => {
  const [formValues, setFormValues] = useState(null);

  const addReferral = async values => {
    const { referralAddress } = values;
    if (!web3 || !referralAddress) return;
    await web3?.tx(web3?.writeContracts[vaultContractName]?.addRevenueShareReferral(referralAddress));
  };

  const onFinish = async values => {
    console.log("onFinish:", values);
    await addReferral(values);
    setFormValues(values);
  };

  const onFinishFailed = errorInfo => {
    console.log("onFinishFailed:", errorInfo);
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card>
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ referralAddress: defaultReferralAddress }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Address"
              name="referralAddress"
              rules={[{ required: true, message: "Please input the Referral Address!" }]}
            >
              <Input disabled={true} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  0. Add Referral
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default VaultAddRevenueShareReferralForm;
