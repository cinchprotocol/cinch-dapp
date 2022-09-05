import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { Table, Space } from "antd";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { revenueStreamBidDatas } from "/components/MockData";

function ListRevenueStreamBids({ web3 }) {
  const dataSource = revenueStreamBidDatas;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Address",
      dataIndex: "addressToReceiveRevenueShare",
      key: "addressToReceiveRevenueShare",
    },
    {
      title: "Contact Info",
      dataIndex: "contactInfo",
      key: "contactInfo",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { id } = record;
        const targetRoute = `/biddetails/${id}`;
        return (
          <Space size="middle">
            <Button href={targetRoute}>Review</Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>List of offers received</HeaderText01>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Table dataSource={dataSource} columns={columns} />;
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(ListRevenueStreamBids);
