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
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div class="px-4 py-8 sm:px-0">
            <div class="p-10 rounded-lg bg-slate-50 shadow">
              <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Enter details to implement revenue-share</h1>
              <div className="max-w-lg">
                <Form
                  name="basic"
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
                  layout="verticle"
                  size="large"
                  requiredMark="required"
                >
                  <Form.Item
                    label="Fee_collector contract address"
                    name="feeCollectorContractAddress"
                    extra="Enter the contract address that consolidates fees(The revenue royalty will be implemented by changing
                  the destination wallet address of this contract)"
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


                  <Form.Item
                    label="Multi-sig_address"
                    name="multiSigAddress"
                    extra="Contrat that controls the inputs to the fee_collector contract"
                    rules={[
                      {
                        required: true,
                        message: "Contrat that controls the inputs to the fee_collector contract",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Revenue_proportion"
                    name="revenueProportion"
                    extra="% of revenue traded as a royalty"
                    rules={[
                      {
                        required: true,
                        message: "Enter valid % number",
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


                  <Form.Item
                    label="Expiry_amount"
                    name="expiryAmount"
                    extra="Royalty will end after this amount of revenue"
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


                  <Form.Item
                    label="Contact information (optional)"
                    name="contactInformation"
                    extra="Enter your preferred contact information to receive notifications on the status of your royalty listing,
                its implementation, and its performance"
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


                  <Form.Item

                  >
                    <Button type="primary" htmlType="submit">
                      Review details
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
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueRoyaltyInputs);
