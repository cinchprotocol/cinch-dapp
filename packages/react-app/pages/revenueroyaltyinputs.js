import React, { useState } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { InputNumber, Select, Modal, Form, Input } from "antd";
const { Option } = Select;
import { useRouter } from "next/router";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

function RevenueRoyaltyInputs({ web3 }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFromValues] = useState(null);
  const router = useRouter();

  const onFormFinish = values => {
    console.log("Success:", values);
    setFromValues(values);
    showModal();
  };

  const onFormFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push("/dashboard");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 32 }}>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 24,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFormFinish}
              onFinishFailed={onFormFinishFailed}
              autoComplete="off"
              requiredMark={false}
              labelWrap
            >
              <Form.Item
                label="Fee_collector contract address"
                name="feeCollectorContractAddress"
                rules={[
                  {
                    required: true,
                    message:
                      "Enter the contract address that consolidates fees(The revenue royalty will be implemented by changing the destination wallet address of this contract)",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <p>
                Enter the contract address that consolidates fees(The revenue royalty will be implemented by changing
                the destination wallet address of this contract)
              </p>

              <Form.Item
                label="Multi-sig_address"
                name="multiSigAddress"
                rules={[
                  {
                    required: true,
                    message: "Contrat that controls the inputs to the fee_collector contract",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <p>Contrat that controls the inputs to the fee_collector contract</p>

              <Form.Item
                label="Revenue_proportion"
                name="revenueProportion"
                rules={[
                  {
                    required: true,
                    message: "% of revenue traded as a royalty",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="%"
                />
              </Form.Item>
              <p>% of revenue traded as a royalty</p>

              <Form.Item
                label="Expiry_amount"
                name="expiryAmount"
                rules={[
                  {
                    required: true,
                    message: "Royalty will end after this amount of revenue",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  placeholder="Amount"
                />
              </Form.Item>
              <p>Royalty will end after this amount of revenue</p>

              <Form.Item
                label="Contact information (optional)"
                name="contactInformation"
                rules={[
                  {
                    required: false,
                    message:
                      "Enter your preferred contact information to receive notifications on the status of your royalty listing, its implementation, and its performance",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <p>
                Enter your preferred contact information to receive notifications on the status of your royalty listing,
                its implementation, and its performance
              </p>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  View listing
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Modal
            title="Revenue royalty listing"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Confirm list revenue royalty"
          >
            <p>Summary</p>
            <p>feeCollectorContractAddress {formValues?.feeCollectorContractAddress}</p>
            <p>multiSigAddress {formValues?.multiSigAddress}</p>
            <p>revenueProportion {formValues?.revenueProportion}</p>
            <p>expiryAmount {formValues?.expiryAmount}</p>
            <p>contactInformation {formValues?.contactInformation}</p>
          </Modal>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueRoyaltyInputs);
