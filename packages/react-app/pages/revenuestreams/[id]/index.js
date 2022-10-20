import React, { useEffect, useState } from "react";
import { Web3Consumer } from "../../../helpers/Web3Context";
import "antd/dist/antd.css";
import { Container } from "/components/Container";
import { useRouter } from "next/router";
import * as Realm from "realm-web";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table } from "antd";
const { ethers, utils } = require("ethers");

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import {
  getOneRevenueStreamForSaleWith,
  getBidByBidderOfRevenueStream,
  fetchBidsOfRevenueStream,
} from "../../../helpers/marketplacehelper";
import BidTable from "/components/BidTable";
import FeeCollectorDashboard from "/components/Dune/FeeCollectorDashboard";
import { Contract } from "@ethersproject/contracts";
//import externalContracts from "~/Contracts/external_contracts";
import { displayError } from "/helpers/errorhelper";


function RevenueStream({ web3 }) {
  const router = useRouter();
  const { id } = router.query;
  const data = { id };
  const marketPlaceContract = web3?.writeContracts["MarketPlace"];
  const [data2, setData2] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFromValues] = useState(null);
  const [bidDatas, setBidDatas] = useState([]);

  const isRevenueStreamOwner = data2?.seller === web3?.address;

  const ERC20ABI = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_from",
          type: "address",
        },
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
        {
          name: "_spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
  ];
  const reloadData = async () => {
    const d = await getOneRevenueStreamForSaleWith(web3, data.id);
    setData2(d);

    let bds;
    bds = await fetchBidsOfRevenueStream(web3, data.id);
    if (isRevenueStreamOwner) {
      setBidDatas(bds?.filter(b => b.price));
    } else {
      setBidDatas(bds?.filter(b => b.price && b.bidder === web3?.address));
    }
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

  const onFormFinish = values => {
    setFromValues(values);
    showModal();
  };

  const onFormFinishFailed = errorInfo => {
    displayError("RevenueStream:onFormFinishFailed:" + errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      //TODO: add UI for duration
      const tx = await web3?.tx(
        marketPlaceContract?.placeBid(
          data2?.id,
          utils.parseEther(formValues?.price),
          formValues?.addressToReceiveRevenueShare,
          86400,
          {
            from: web3?.address,
            value: utils.parseEther(formValues?.price),
          },
        ),
        res => {
          if (res.status == 1) {
            setIsModalVisible(false);
            router.push("/dashboard");
          }
        },
      );
      const txRes = await tx?.wait();
      console.log("txRes", txRes);
    } catch (err) {
      displayError("RevenueStream:handleOk", err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="bg-slate-50">
        <CommonHead />
        <DAppHeader web3={web3} />
        <main>
          <div>
            <Container>
              {/* info */}
              <div className="pt-10 pb-16 px-4 bg-white rounded-lg shadow mb-10 sm:px-6 lg:pt-10 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-4 lg:grid-rows-[auto,auto,1fr]">
                <div className="lg:col-span-2 lg:pr-8">
                  <div className="flex justify-start">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {/* {data?.name} */}
                      Protocol Name
                    </h1>
                  </div>
                  <div>
                    {/* Description and details */}
                    <h3 className="sr-only text-gray-900">Description</h3>

                    <div className="space-y-6">
                      <p className="text-base text-gray-600">
                        {/* {data?.description} */}
                        placeholder for the protocol description
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 mb-10">
                    <div>
                      {/* <h3 className="text-lg text-gray-900">COLLECTION STATS</h3> */}
                      <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                        <div className="py-3 flex justify-between text-sm font-medium">
                          <dt className="text-gray-500">Revenue proportion</dt>
                          <dd className="text-gray-900">{data2.revenuePctStr}%</dd>
                        </div>
                        <div className="py-3 flex justify-between text-sm font-medium">
                          <dt className="text-gray-500">Expiry amount (ETH)</dt>

                          <dd className="text-gray-900">{data2?.expAmountStr}</dd>
                        </div>

                        <div className="py-3 flex justify-between text-sm font-medium">
                          <dt className="text-gray-500">Fee collector address</dt>
                          <dd className="text-gray-900">{data2?.feeCollector}</dd>
                        </div>
                        <div className="py-3 flex justify-between text-sm font-medium">
                          <dt className="text-gray-500">Multi-sig address</dt>
                          <dd className="text-gray-900">{data2?.multiSig}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Place BID */}
                {data2?.buyer && data2?.buyer === ethers.constants.AddressZero && (
                  <>
                    <div className="mx-5 mt-4 lg:mt-0 lg:col-span-2 shadow-2xl p-10 ">
                      <div>
                        <h3 className="text-xl text-center font-semibold text-gray-900">Place Bid</h3>
                        <Form
                          name="basic"
                          wrapperCol={{
                            span: 24,
                          }}
                          initialValues={{
                            remember: true,
                          }}
                          onFinish={onFormFinish}
                          onFinishFailed={onFormFinishFailed}
                          autoComplete="off"
                          labelWrap
                          layout="verticle"
                          requiredMark="required"
                          size="large"
                        >
                          <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                              {
                                required: true,
                                message: "Please input the price",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            label="Address to receive revenue-share"
                            name="addressToReceiveRevenueShare"
                            extra="Fee consolidator contract will forward revenue to this address"
                            rules={[
                              {
                                required: true,
                                message:
                                  "The revenue royalty will be implemented by adding this wallet address to the fee consolidator contract",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            label="Contact information (optional)"
                            name="contact"
                            extra=" Receive notifications on the status of your royalty listing,
                      its implementation, and its performance"
                            rules={[
                              {
                                required: false,
                                message:
                                  "Enter your preferred contact information to receive notifications on the status of your royalty listing, its implementation, and its performance",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item>

                            <button
                              type="button"
                              className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={async () => {
                                //pass in the address for the vault&collection in context below
                                // const ERC20ABI = externalContracts[1].contracts.ERC20ABI;
                                const erc20Contract = new Contract('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', ERC20ABI, web3?.userSigner);
                                const result = await web3?.tx(erc20Contract.approve(web3?.writeContracts["MarketPlace"].address, 10), update => {
                                  console.log({ update });
                                  if (update?.status === "confirmed" || update?.status === 1) {
                                    message.success("Approved successfully");
                                  } else {
                                    message.error(update?.data?.message);
                                  }
                                });
                                console.log({ result });
                              }}
                            >
                              Approve Cinch to use your USDC
                            </button>

                            <Button className="w-full" htmlType="submit">
                              Review Bid
                            </Button>
                          </Form.Item>
                        </Form>
                        <Modal
                          title=""
                          visible={isModalVisible}
                          onOk={handleOk}
                          onCancel={handleCancel}
                          okText="Confirm Bid"
                          width={650}
                        >
                          <div>
                            <div className="px-4 py-5 sm:px-6">
                              <h3 className="text-xl font-medium leading-6 text-gray-900">Review Bid Information</h3>
                              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Please verify details, this helps avoiding any delay.{" "}
                              </p>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                              <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {formValues?.price}
                                  </dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Address to receive revenue-share
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {formValues?.addressToReceiveRevenueShare}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* BIDs Received */}
              <div className="mt-20">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isRevenueStreamOwner ? "Offers Received" : "Bids Placed"}
                </h3>

                <div className="bg-white shadow rounded-lg p-4 text-center mt-5">
                  <BidTable web3={web3} dataSource={bidDatas} />
                </div>
              </div>

              {/* Revenue Analytics */}
              {data2?.feeCollector && data2?.feeCollector !== ethers.constants.AddressZero && (
                <div className="mt-14 bg-white shadow rounded-lg">
                  <FeeCollectorDashboard feeCollectorAddress={data2?.feeCollector} />
                </div>
              )}
            </Container>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Web3Consumer(RevenueStream);
