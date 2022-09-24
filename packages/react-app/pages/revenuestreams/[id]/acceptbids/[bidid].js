import React, { useEffect, useState } from "react";
import { Web3Consumer } from "../../../../helpers/Web3Context";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table } from "antd";
const { utils } = require("ethers");

import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { getOneRevenueStreamForSaleWith, fetchBidOf } from "../../../../helpers/marketplacehelper";

function AcceptBid({ web3 }) {
  const marketPlaceContract = web3?.writeContracts["MarketPlace"];
  const [streamData, setStreamData] = useState(null);
  const [bidData, setBidData] = useState(null);

  const router = useRouter();
  const { id, bidid } = router.query;

  const reloadData = async () => {
    const sd = await getOneRevenueStreamForSaleWith(web3, id);
    setStreamData(sd);

    const bd = await fetchBidOf(web3, id, bidid);
    if (bd) {
      setBidData(bd);
    }
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

  const acceptBid = async () => {
    const tx = await marketPlaceContract?.acceptBid(id, bidid);
    await tx?.wait();
    message.success("Bid accepted");
    router.push("/dashboard");
  };

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Implementation Confirmation</HeaderText01>
            <p>{streamData?.name}</p>
            <p>{streamData?.description}</p>
            <p>{streamData?.id}</p>
            <p>{streamData?.price}</p>
            <p>{streamData?.addressToReceiveRevenueShare}</p>
            <p>{streamData?.contact}</p>
            <p>{bidData?.price}</p>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button
              onClick={() => {
                acceptBid();
              }}
            >
              Confirm Accept Bid
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(AcceptBid);
