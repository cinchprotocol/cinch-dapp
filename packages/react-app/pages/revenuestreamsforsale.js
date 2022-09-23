import React, { useState, useEffect } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { Table, Space } from "antd";
import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
// import { getAllRevenueStreamForSale } from "../helpers/mongodbhelper";
import { getAllRevenueStreamForSale } from "../helpers/marketplacehelper";

function RevenueStreamsForSale({ web3 }) {
  const [dataSource, setDataSource] = useState([]);

  const reloadData = async () => {
    const data = await getAllRevenueStreamForSale(web3);
    console.log("data", data);
    setDataSource(data);
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

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
      <Container>
        <main>
          <div className="mt-10 h-screen">
            <HeaderText01>Explore royalty streams on sale</HeaderText01>
            <div className="bg-slate-50 rounded-lg p-10 min-h-[50%]">
              <div className="text-center">
                <Table dataSource={dataSource} columns={columns} />
              </div>
            </div>
          </div>
        </main>
      </Container>
      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueStreamsForSale);
