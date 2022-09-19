import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { Table, Space } from "antd";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { revenueStreamForSaleDatas } from "/components/MockData";

function RevenueStreamsForSale({ web3 }) {
  const dataSource = revenueStreamForSaleDatas;

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
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { id } = record;
        const targetRoute = `/revenuestreams/${id}`;
        return (
          <Space size="middle">
            <Button href={targetRoute}>Select</Button>
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
            <HeaderText01>Select royalty steam</HeaderText01>
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

export default Web3Consumer(RevenueStreamsForSale);