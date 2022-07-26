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
//import { getAllBidIds, getBidData } from "/components/MockData";
import { getAllBidProposalIds, getOneBidProposalWith } from "../../helpers/mongodbhelper";

function BidDetail({ web3 }) {
  const acceptBidsRoute = `/wip`;
  const denyBidsRoute = `/wip`;
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState({ id });

  const reloadData = async () => {
    const objId = Realm.BSON.ObjectId.createFromHexString(id);
    const _data = _.omit(await getOneBidProposalWith({ _id: objId }), ["_id"]);
    setData(_data);
  };

  useEffect(() => {
    if (id) {
      reloadData();
    }
  }, [web3]);

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
            <p>{data?.contact}</p>
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
