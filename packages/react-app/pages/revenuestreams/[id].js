import React, { useEffect, useState } from "react";
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
// import { getAllRevenueStreamForSaleIds, getOneRevenueStreamForSaleWith } from "../../helpers/mongodbhelper";
import { getOneRevenueStreamForSaleWith } from "../../helpers/marketplacehelper";

export async function getStaticPaths() {
  //const ids = await getAllRevenueStreamForSaleIds();
  const ids = _.range(1, 1000);
  const paths = ids.map(id => {
    return {
      params: {
        id: id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  //const objId = Realm.BSON.ObjectId.createFromHexString(params.id);
  //const data = _.omit(await getOneRevenueStreamForSaleWith({ _id: objId }), ["_id"]);
  const data = {
    id: params.id,
  };
  return {
    props: {
      data,
    },
  };
}

function RevenueStream({ web3, data }) {
  //console.log("web3", web3, "data", data);
  const [data2, setData2] = useState(data);

  const reloadData = async () => {
    const d = await getOneRevenueStreamForSaleWith(web3, data.id);
    setData2(d);
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

  const bidProposalsRoute = `/bidproposals/${data2?.id}`;
  const router = useRouter();
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>{data2?.name}</HeaderText01>
            <p>{data2?.description}</p>
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
