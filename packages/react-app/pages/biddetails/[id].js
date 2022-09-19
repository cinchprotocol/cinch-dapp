import React, { useState } from "react";
import { Web3Consumer } from "../../helpers/Web3Context";
import "antd/dist/antd.css";
import { useRouter } from "next/router";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { getAllBidIds, getBidData } from "/components/MockData";

export async function getStaticPaths() {
  const paths = getAllBidIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = getBidData(params.id);
  return {
    props: {
      data,
    },
  };
}

function BidDetail({ web3, data }) {
  console.log("web3", web3, "data", data);
  const acceptBidsRoute = `/acceptbids/${data?.id}`;
  const denyBidsRoute = `/denybids/${data?.id}`;
  const router = useRouter();
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Offer summary</HeaderText01>
            <p>{data?.name}</p>
            <p>{data?.description}</p>
            <p>{data?.id}</p>
            <p>{data?.price}</p>
            <p>{data?.addressToReceiveRevenueShare}</p>
            <p>{data?.contactInfo}</p>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button
              onClick={() => {
                router.push(acceptBidsRoute);
              }}
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                router.push(denyBidsRoute);
              }}
            >
              Deny
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(BidDetail);