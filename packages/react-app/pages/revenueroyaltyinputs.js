import React, { useState, useEffect } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { Select, Modal, Form, Input, message } from "antd";
const { Option } = Select;
import { useRouter } from "next/router";
import moment from "moment";
const { utils } = require("ethers");
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { insertOneWith } from "../helpers/mongodbhelper";
import { displayError } from "../helpers/errorhelper";

function RevenueRoyaltyInputs({ web3 }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFromValues] = useState(null);
  const router = useRouter();
  const marketPlaceContract = web3?.writeContracts["MarketPlace"];

  const onFormFinish = values => {
    setFromValues(values);
    showModal();
  };

  const onFormFinishFailed = errorInfo => {
    displayError("revenueroyaltyinputs:onFormFinishFailed:" + errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const txRes = await web3?.tx(
        marketPlaceContract?.createMarketItem(
          formValues?.name || "Revenue Royalty",
          formValues?.feeCollectorContractAddress,
          formValues?.multiSigAddress,
          utils.parseEther(formValues?.revenueProportion),
          utils.parseEther(formValues?.price),
          utils.parseEther(formValues?.expiryAmount),
          {},
        ),
        res => {
          if (res.status == 1) {
            setIsModalVisible(false);
            router.push("/dashboard");
          }
        },
      );
    } catch (err) {
      displayError("revenueroyaltyinputs:handleOk", err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="bg-slate-50">
        <CommonHead />
        <DAppHeader web3={web3} />
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"></div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="p-10 rounded-lg bg-white shadow">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Enter details to implement revenue-share
                </h1>
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
                    layout="verticle"
                    size="large"
                    requiredMark="required"
                  >
                    <Form.Item
                      label="Fee collector contract address"
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
                      label="Multi-sig address"
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
                      label="Revenue proportion"
                      name="revenueProportion"
                      extra="% of revenue traded as a royalty"
                      rules={[
                        {
                          required: true,
                          message: "Enter valid % number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Minimum price"
                      name="price"
                      extra="minimum price to place a bid"
                      rules={[
                        {
                          required: true,
                          message: "Enter the minimum price",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Expiry amount (ETH)"
                      name="expiryAmount"
                      extra="Royalty will end after this amount of revenue"
                      rules={[
                        {
                          required: true,
                          message: "Royalty will end after this amount of revenue",
                        },
                      ]}
                    >
                      <Input />
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

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Review details
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                <Modal
                  title=""
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText="Confirm list revenue royalty"
                  width={800}
                >
                  <div>
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-xl font-medium leading-6 text-gray-900">Review listing Information</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Please verify details, this helps avoiding any delay.{" "}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Fee Collector Contract Address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formValues?.feeCollectorContractAddress}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Multi-Sig Address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formValues?.multiSigAddress}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Revenue Proportion</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formValues?.revenueProportion}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Minimum Price</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{formValues?.price}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Expiry Amount</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formValues?.expiryAmount}
                          </dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Contact Information</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {formValues?.contactInformation}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default Web3Consumer(RevenueRoyaltyInputs);
