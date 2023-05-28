import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultDepositToRevenueShareForm = ({
  web3,
  assetDecimals = 6,
  defaultDepositAmountStr = "100",
  vaultContractName = "RevenueShareVault",
  cardTitle = "Send Revenue Share Payment",
}) => {
  const [formValues, setFormValues] = useState(null);
  const [depositAmountStr, setDepositAmountStr] = useState(defaultDepositAmountStr);

  const approveAsset = async values => {
    const { depositAmount } = values;
    if (!web3 || !depositAmount) return;
    var result = await web3?.tx(
      web3?.writeContracts?.MockERC20?.approve(
        web3?.writeContracts?.[vaultContractName]?.address,
        ethers.utils.parseUnits(depositAmount, assetDecimals),
      ),
      async update => {
        if (update && (update.status === "confirmed" || update.status === 1)) {
          await depositAsset();
        }
      });
  };

  const depositAsset = async values => {
    if (!web3 || !depositAmountStr) return;
    console.log("depositAsset", depositAmountStr);
    await web3?.tx(
      web3?.writeContracts?.[vaultContractName]?.depositToRevenueShare(
        web3?.address,
        web3?.writeContracts?.MockERC20?.address,
        ethers.utils.parseUnits(depositAmountStr, assetDecimals),
      ),
      async update => {
        if (update && (update.status === "confirmed" || update.status === 1)) {
          await web3?.tx(
            web3?.writeContracts[vaultContractName]?.setTotalSharesInReferralAccordingToYieldSource( web3?.address, web3?.address),
          );
        }
      });
  };

  const onFinish = async values => {
    console.log("onFinish:", values);
    await approveAsset(values);
    setFormValues(values);
  };

  const onFinishFailed = errorInfo => {
    console.log("onFinishFailed:", errorInfo);
  };

  const onInputChange = e => {
    console.log(`onInputChange value = ${e.target.value}`);
    setDepositAmountStr(e.target.value);
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card title={cardTitle}>
          <Form
            name="basic"
            labelCol={{ span: 11 }}
            wrapperCol={{ span: 13 }}
            style={{ maxWidth: 600 }}
            initialValues={{ depositAmount: defaultDepositAmountStr }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Amount (USDC)"
              name="depositAmount"
              rules={[{ required: true, message: "Please input the Revenue Share Amount!" }]}
            >
              <Input onChange={onInputChange} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  4. Approve
                </Button>
                <Button
                  type="primary"
                  disabled={formValues == null}
                  onClick={() => {
                    depositAsset(formValues);
                  }}
                >
                  5. Send Payment
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default VaultDepositToRevenueShareForm;
