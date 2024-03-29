import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultRedeemForm = ({
  web3,
  shareDecimals = 6,
  referralAddress,
  defaultRedeemAmountStr = "1000",
  vaultContractName = "Vault",
  cardTitle = "Redeem from Cinch Vault",
}) => {
  const [formValues, setFormValues] = useState(null);

  const redeemAsset = async values => {
    const { redeemAmount, referralCode } = values;
    if (!web3 || !redeemAmount || !referralAddress) return;
    console.log(referralCode);
    if (referralCode) {
      await web3?.tx(
        web3?.writeContracts[vaultContractName]?.redeemWithReferral(
          ethers.utils.parseUnits(redeemAmount, shareDecimals),
          web3?.address,
          web3?.address,
          referralCode,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts[vaultContractName]?.redeem(
          ethers.utils.parseUnits(redeemAmount, shareDecimals),
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
    <div className="px-8">
      <Form
        name="basic"
        style={{ maxWidth: 600 }}
        initialValues={{ referralEnabled: true, redeemAmount: defaultRedeemAmountStr }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        size="large"
        layout="vertical"
      >
        <Form.Item
          label="Redeem (USDC)"
          name="redeemAmount"
          rules={[{ required: true, message: "Please input the Redeem Amount!" }]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item label="Referral Code" name="referralCode"  >
        <Input />
      </Form.Item> */}

        <Form.Item>         
            <Button type="primary" htmlType="submit" className="w-full">
              Redeem
            </Button>          
        </Form.Item>
      </Form>
    </div>
  );
};

export default VaultRedeemForm;
