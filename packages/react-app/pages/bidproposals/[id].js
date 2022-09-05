import React, { useState } from "react";
import { Web3Consumer } from "../../helpers/Web3Context";
import "antd/dist/antd.css";
import { InputNumber, Select, Modal, Form, Input } from "antd";
import { useRouter } from "next/router";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { getAllRevenueStreamForSaleIds, getRevenueStreamData } from "/components/MockData";

export async function getStaticPaths() {
  const paths = getAllRevenueStreamForSaleIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = getRevenueStreamData(params.id);
  return {
    props: {
      data,
    },
  };
}

function BidProposal({ web3, data }) {
  console.log("web3", web3, "data", data);
  const bidProposalsRoute = `/bidproposals/${data?.id}`;
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
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Submit proposal</HeaderText01>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
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
                label="price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input the price",
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
                label="Address to receive revenue-share"
                name="addressToReceiveRevenueShare"
                rules={[
                  {
                    required: true,
                    message:
                      "The revenue royalty will be implemented by adding this wallet address to the fee consolidator contract",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <p>
                The revenue royalty will be implemented by adding this wallet address to the fee consolidator contract
              </p>

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
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Modal
            title="Place bid for revenue stream"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Confirm"
          >
            <p>Price {formValues?.price}</p>
            <p>Address to receive revenue-share {formValues?.addressToReceiveRevenueShare}</p>
          </Modal>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(BidProposal);
