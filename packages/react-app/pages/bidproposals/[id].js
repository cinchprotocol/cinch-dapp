import React, { useState, useEffect } from "react";
import { Web3Consumer } from "../../helpers/Web3Context";
import "antd/dist/antd.css";
import { Select, Modal, Form, Input, message } from "antd";
import { useRouter } from "next/router";
import * as Realm from "realm-web";
import _ from "lodash";
import moment from "moment";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
/*
import {
  getAllRevenueStreamForSaleIds,
  getOneRevenueStreamForSaleWith,
  insertOneWith,
} from "../../helpers/mongodbhelper";
*/
import { getOneRevenueStreamForSaleWith } from "../../helpers/marketplacehelper";

export async function getStaticPaths() {
  // const ids = await getAllRevenueStreamForSaleIds();
  const ids = _.range(1, 1000);
  const paths = ids.map(id => {
    return {
      params: {
        id: id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // const objId = Realm.BSON.ObjectId.createFromHexString(params.id);
  // const data = _.omit(await getOneRevenueStreamForSaleWith({ _id: objId }), ["_id"]);
  const data = {
    id: params.id,
  };
  return {
    props: {
      data,
    },
  };
}

function BidProposal({ web3, data }) {
  //console.log("web3", web3, "data", data);
  //const bidProposalsRoute = `/bidproposals/${data?.id}`;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFromValues] = useState(null);
  const router = useRouter();

  const marketPlaceContract = web3?.writeContracts["MarketPlace"];
  const [data2, setData2] = useState(data);
  const reloadData = async () => {
    const d = await getOneRevenueStreamForSaleWith(web3, data.id);
    setData2(d);
    console.log("data2", d);
  };
  useEffect(() => {
    reloadData();
  }, [web3, data]);

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

  const handleOk = async () => {
    try {
      /*
      const doc = {
        createdBy: web3?.address,
        createdAt: moment().format(),
        updatedBy: web3?.address,
        updatedAt: moment().format(),
        targetRevenueStreamId: data2?.id,
        targetRevenueCreatedBy: data2?.createdBy,
        price: formValues?.price,
        addressToReceiveRevenueShare: formValues?.addressToReceiveRevenueShare,
        isActive: true,
        isAccepted: false,
        contact: formValues?.contact,
        //metadata: {},
      };
      await insertOneWith("bidProposal", doc);
      setIsModalVisible(false);
      router.push("/dashboard");
      */

      //TODO: add UI for duration
      const txRes = await web3?.tx(
        marketPlaceContract?.placeBid(data2?.id, formValues?.price, formValues?.addressToReceiveRevenueShare, 86400, {
          from: web3?.address,
          value: formValues?.price,
        }),
        res => {
          console.log("📡 Transaction placeBid:", res);
          if (res.status == 1) {
            setIsModalVisible(false);
            router.push("/dashboard");
          }
        },
      );
      console.log("txRes", txRes);
    } catch (err) {
      console.log(err);
    }
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
                <Input />
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
                name="contact"
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
