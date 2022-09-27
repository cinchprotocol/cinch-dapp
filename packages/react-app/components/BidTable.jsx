import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import _ from "lodash";
import { Button } from "/components/Button";

function BidTable({ web3, dataSource, mode }) {
  const defaultColumns = [
    {
      title: "Target stream ID",
      dataIndex: "itemIdStr",
      key: "itemIdStr",
    },
    {
      title: "Bidder",
      dataIndex: "bidder",
      key: "bidder",
    },
    {
      title: "Price",
      dataIndex: "priceStr",
      key: "priceStr",
    },
    {
      title: "Revenue Receiver",
      dataIndex: "revenueReceiver",
      key: "revenueReceiver",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { id, itemId, bidder, stream } = record;
        const isRevenueStreamSeller = web3 && stream && stream.seller === web3.address;
        const isBidder = web3 && bidder === web3.address;

        if (isRevenueStreamSeller) {
          return (
            <Space size="middle">
              <Button href={`/revenuestreams/${itemId}/acceptbids/${id}`}>Accept</Button>
            </Space>
          );
        } else if (isBidder) {
          return (
            <Space size="middle">
              <Button href="/wip">Cancel</Button>
            </Space>
          );
        } else {
          return null;
        }
      },
    },
  ];

  const columns = defaultColumns.filter(c => {
    /*
    if (mode === "ForSale") {
      return c.dataIndex !== "buyer" && c.dataIndex !== "seller";
    } else if (mode === "Sold") {
      return c.dataIndex !== "seller" && c.dataIndex !== "feeCollector";
    }
    */
    return true;
  });

  return <Table dataSource={dataSource} columns={columns} />;
}

export default BidTable;
