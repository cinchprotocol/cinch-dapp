import React, { useState, createRef } from "react";
import { Web3Consumer } from "../../helpers/Web3Context";
import "antd/dist/antd.css";
import { Select, Form, Input } from "antd";
import { useRouter } from "next/router";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { getAllBidIds, getBidData } from "/components/MockData";

export async function getStaticPaths() {
  const paths = getAllBidIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = getBidData(params.id);
  return {
    props: {
      data,
    },
  };
}

function DenyBid({ web3, data }) {
  console.log("web3", web3, "data", data);
  const router = useRouter();
  const { Option } = Select;

  let formRef = createRef();
  const onReasonChange = value => {
    formRef.current.setFieldsValue({
      reason: value,
    });
  };
  const [formValues, setFromValues] = useState(null);
  const onFormFinish = values => {
    console.log("Success:", values);
    setFromValues(values);
    router.push("/dashboard");
  };
  const onFormFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Deny bid</HeaderText01>
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
              ref={formRef}
            >
              <Form.Item
                label="Feedback"
                name="feedback"
                rules={[
                  {
                    required: true,
                    message:
                      "Please elaborate on why you chose not to accept the offer. This may incite the buyers to improve their offer.",
                  },
                ]}
              >
                <Select placeholder="reason" allowClear onChange={onReasonChange}>
                  <Option value="price">Price</Option>
                  <Option value="counterpartyIdentity">Counterparty identity</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              <p>
                Please elaborate on why you chose not to accept the offer. This may incite the buyers to improve their
                offer.
              </p>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Send feedback
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(DenyBid);
