import React, { useState, useEffect } from "react";
import { Table, Space, message } from "antd";
import _ from "lodash";
import { Button } from "/components/Button";
import { useRouter } from "next/router";

function BidTable({ web3, dataSource, mode }) {
  const router = useRouter();
  const marketPlaceContract = web3?.writeContracts["MarketPlace"];

  const handleCancelBid = async record => {
    if (record && record.itemId) {
      const tx = await marketPlaceContract?.cancelBid(record.itemId);
      const txRes = await tx?.wait();
      console.log("txRes", txRes);
    }
  };

  const handleAcceptBid = async record => {
    if (record && record.itemId) {
      const tx = await marketPlaceContract?.acceptBid(record.itemId, record.id);
      const txRes = await tx?.wait();
      console.log("txRes", txRes);

      if (txRes?.events?.find(e => e?.event === "BidAccepted")) {
        message.success("Bid accepted");
      } else if (txRes?.events?.find(e => e?.event === "BidRejected")) {
        message.error("Bid rejected");
      }

      const vaultCreatedEvent = txRes?.events?.find(e => e?.event === "RBFVaultCreated");
      if (vaultCreatedEvent && vaultCreatedEvent.args?.vaultAddress) {
        router.push(`/vaults/${vaultCreatedEvent?.args?.vaultAddress}`);
      } else {
        router.push("/dashboard");
      }
    }
  };

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
              <Button
                onClick={() => {
                  handleAcceptBid(record);
                }}
              >
                Accept
              </Button>
            </Space>
          );
        } else if (isBidder) {
          return (
            <Space size="middle">
              <Button
                onClick={() => {
                  handleCancelBid(record);
                }}
              >
                Cancel
              </Button>
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
