import React, { useState, useEffect } from "react";
import { Table, Space, Row, Col } from "antd";
import Image from "next/image";
import _ from "lodash";
import { useRouter } from "next/router";
import { Button } from "/components/Button";
import idleLogo from "/images/logos/idle_logo_01.png";

function RevenueStreamTable({ dataSource, mode }) {
  const router = useRouter();
  const defaultColumns = [
    {
      title: "Underlying Assets",
      key: "name",
      render: (_, record) => {
        const { id } = record;
        const targetRoute = `/revenuestreams/${id}`;
        return (
          <>
            <Row>
              <Col span={8}>
                <Image src={idleLogo} layout="fill" objectFit="contain" />
              </Col>
              <Col span={16}>
                <a target="_blank" href="https://app.idle.finance/#/tranches/clearpool/USDC" rel="noreferrer">
                  Idle Finance Clearpool PYT
                </a>
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: "Base Yield",
      key: "baseYield",
      render: (_, record) => {
        return (
          <>
            <Row>
              <Col span={24}>
                <span>20%</span>
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: "Product Revenue",
      key: "productRevenue",
      render: (_, record) => {
        const _feeCollectorAddress = record?.feeCollector?.replace("0x", "");
        return (
          <>
            <Row align="middle">
              <iframe
                src={`https://dune.com/embeds/1379159/2365292/e8a8a878-0626-429e-a3f4-0a1328356949?fee_collector_address=${_feeCollectorAddress}`}
                height="128"
                width="128"
                title="stat total"
              />
            </Row>
          </>
        );
      },
    },
    {
      title: "Max. Yield",
      key: "maxYield",
      render: (_, record) => {
        return (
          <>
            <Row>
              <Col span={24}>
                <span>23%</span>
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: "Revenue Share",
      dataIndex: "revenuePctStr",
      key: "revenuePctStr",
      render: (_, record) => {
        return (
          <>
            <Row>
              <Col span={24}>
                <span>{record?.revenuePctStr}%</span>
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: "Expiry Amount",
      dataIndex: "expAmountStr",
      key: "expAmountStr",
    },
    {
      title: "Price",
      dataIndex: "priceStr",
      key: "priceStr",
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
            <Button
              onClick={() => {
                router.push(targetRoute);
              }}
            >
              Details
            </Button>
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
