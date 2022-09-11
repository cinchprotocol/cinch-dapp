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
//import { getAllRevenueStreamForSaleIds, getRevenueStreamData } from "/components/MockData";
import { getAllRevenueStreamForSaleIds, getOneRevenueStreamForSaleWith } from "../../helpers/mongodbhelper";

export async function getStaticPaths() {
  const ids = await getAllRevenueStreamForSaleIds();
  const paths = ids.map(id => {
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
  const data = _.omit(await getOneRevenueStreamForSaleWith({ _id: objId }), ["_id"]);
  return {
    props: {
      data,
    },
  };
}

function RevenueStream({ web3, data }) {
  console.log("web3", web3, "data", data);
  const bidProposalsRoute = `/bidproposals/${data?.id}`;
  const router = useRouter();
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>{data?.name}</HeaderText01>
            <p>{data?.description}</p>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button
              onClick={() => {
                router.push(bidProposalsRoute);
              }}
            >
              Bid
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueStream);
