import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import _ from "lodash";
import { Button } from "/components/Button";

function RevenueStreamTable({ dataSource, mode }) {
  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "priceStr",
      key: "priceStr",
    },
    {
      title: "Revenue %",
      dataIndex: "revenuePctStr",
      key: "revenuePctStr",
    },
    {
      title: "Expire Amount",
      dataIndex: "expAmountStr",
      key: "expAmountStr",
    },
    {
      title: "Fee Collector",
      dataIndex: "feeCollector",
      key: "feeCollector",
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const { id } = record;
        const targetRoute = `/revenuestreams/${id}`;
        return (
          <Space size="middle">
            <Button href={targetRoute}>Details</Button>
          </Space>
        );
      },
    },
  ];

  const columns = defaultColumns.filter(c => {
    if (mode === "ForSale") {
      return c.dataIndex !== "buyer" && c.dataIndex !== "seller";
    } else if (mode === "Sold") {
      return c.dataIndex !== "seller" && c.dataIndex !== "feeCollector";
    } else if (mode === "Bought") {
      return c.dataIndex !== "buyer";
    }
    return true;
  });

  return <Table dataSource={dataSource} columns={columns} />;
}

export default RevenueStreamTable;
