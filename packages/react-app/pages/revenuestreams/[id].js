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
  }, [web3, data]);

  const bidProposalsRoute = `/bidproposals/${data2?.id}`;
  const router = useRouter();
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div>
          <div>
            {/* info */}
            <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 bg-slate-50 rounded-lg shadow mb-10 sm:px-6 lg:max-w-7xl lg:pt-10 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr]">
              <div className="lg:col-span-2 lg:pr-8">
                <div className="flex justify-start">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {/* {data?.name} */}
                    Protocol Name
                  </h1>

                </div>
                <div>
                  {/* Description and details */}
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {/* {data?.description} */}
                      placeholder for the protocol description
                    </p>
                  </div>
                </div>

                <div className="mt-10 mb-10">
                  <div>
                    <h3 className="text-lg text-gray-900">COLLECTION STATS</h3>
                    <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Ratings</dt>
                        <dd className="text-gray-900">A+</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Prior Period Revnue (ETH)</dt>

                        <dd className="text-gray-900">
                          1,00,000
                        </dd>
                      </div>


                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Coef. of Variation</dt>
                        <dd className="text-gray-900">
                          {0.8}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* BID */}
              <div className="ml-5 mt-4 lg:mt-0 lg:row-span-3 shadow-2xl p-10 ">
                <div>
                  <h3 className="text-lg text-gray-900">BID</h3>
                  <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">BID Duration (Days)</dt>
                      <dd className="text-gray-900">{7}</dd>
                    </div>

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Revenue Receiver</dt>
                      <dd className="text-lg text-gray-900">Oxfdfdfdfdfdf</dd>
                    </div>

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Implied Purchase Discount</dt>
                      <dd className="text-lg text-gray-900">{50}</dd>
                    </div>

                    <div className="py-3 flex justify-between text-sm font-medium">
                      <dt className="text-gray-500">Bid Price</dt>
                      <dd className="text-lg text-gray-900">
                        {"$" + 100 + " USD"}
                      </dd>
                    </div>
                  </dl>
                  <div class="grid place-items-center">
                    <div class="mt-5 w-full">
                      {/* <PercentageSlider defaultValue={50} onChange={onSliderValueChange} />
                      <p className="font-bold text-lg">{bidAmount.toFixed(2) + " ETH"}</p>
                    </div>
                    <button
                      className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        onBidClick();
                      }}
                      children={"BID " + getFormatedCurrencyValue(bidAmount) + " ETH"}
                    /> */}

                      <Button
                        onClick={() => {
                          router.push(bidProposalsRoute);
                        }}
                      >
                        Bid
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueStream);
