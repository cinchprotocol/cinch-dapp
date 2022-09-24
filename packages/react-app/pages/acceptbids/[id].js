import React, { useState } from "react";
import { Web3Consumer } from "../../helpers/Web3Context";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import * as Realm from "realm-web";
import _ from "lodash";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { getAllBidProposalIds, getOneBidProposalWith } from "../../helpers/mongodbhelper";

export async function getStaticPaths() {
  const ids = await getAllBidProposalIds();
  const paths = ids?.map(id => {
    return {
      params: {
        id: id,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const objId = Realm.BSON.ObjectId.createFromHexString(params.id);
  const data = _.omit(await getOneBidProposalWith({ _id: objId }), ["_id"]);
  return {
    props: {
      data,
    },
  };
}

function AcceptBid({ web3, data }) {
  console.log("web3", web3, "data", data);
  const router = useRouter();
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Implementation Confirmation</HeaderText01>
            <p>{data?.name}</p>
            <p>{data?.description}</p>
            <p>{data?.id}</p>
            <p>{data?.price}</p>
            <p>{data?.addressToReceiveRevenueShare}</p>
            <p>{data?.contact}</p>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Verify changes
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(AcceptBid);
