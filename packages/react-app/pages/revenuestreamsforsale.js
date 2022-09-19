import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { Table, Space } from "antd";
import { Container } from "/components/Container";
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
      render: (name, record) => {
        const { id } = record;
        const targetRoute = `/revenuestreams/${id}`;
        return <a href={targetRoute} class="no-underline hover:underline font-bold text-lg">{name}</a>
      },
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
          <Button className="text-white" href={targetRoute}>Select</Button>
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
