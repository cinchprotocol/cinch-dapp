import React, { useEffect, useState } from "react";
import { Web3Consumer } from "../../../helpers/Web3Context";
import "antd/dist/antd.css";
import { Container } from "/components/Container";
import { useRouter } from "next/router";
import * as Realm from "realm-web";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table, Tabs } from "antd";
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
import VaultDashboard from "/components/Dune/VaultDashboard";
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
          //formValues?.price,
          formValues?.addressToReceiveRevenueShare,
          86400,
          {
            from: web3?.address,
            //value: utils.parseEther(formValues?.price),
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

  const handleApprove = async () => {
    const erc20Contract = new Contract(process.env.USDC_ADDRESS, ERC20ABI, web3?.userSigner);
    const result = await web3?.tx(erc20Contract.approve(web3?.writeContracts["MarketPlace"].address, utils.parseUnits("1500", 6)), update => {
      console.log({ update });
      if (update?.status === "confirmed" || update?.status === 1) {
        message.success("Approved successfully");
      } else {
        message.error(update?.data?.message);
      }
    });
    console.log({ result });
  }

  return (
    <>
      <div className="bg-slate-50">
        <CommonHead />
        <DAppHeader web3={web3} />
        <main>
          <div>
            <Container>
              <div class="md:flex md:items-center md:justify-between md:space-x-5">
                <div class="flex items-center space-x-5">
                  <div class="flex-shrink-0">
                    {/* <div class="relative">
                      <img class="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80" alt=""/>
                        <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
                    </div> */}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {data2?.name}
                    </h1>
                    {/* <p class="text-sm font-medium text-gray-500">Vault created on <time datetime="2020-08-25">August 25, 2020</time></p> */}
                  </div>
                </div>
                {/* <div class="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                  <button type="button" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">Disqualify</button>
                  <button type="button" class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">Advance to offer</button>
                </div> */}
              </div>

              {/* info */}
              <div className="mb-10 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr]">
                <div className="p-6 lg:mr-4 lg:col-span-2 bg-white rounded-2xl shadow">
                  <div className="">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Listing Information</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Protocol details and terms.</p>
                  </div>

                  <div className="mb-10 border-t border-gray-200">
                    <dl class="pt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Price (USDC)</dt>
                        <dd class="mt-1 text-sm text-gray-900">${data2?.priceStr}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Revenue proportion</dt>
                        <dd class="mt-1 text-sm text-gray-900">{data2.revenuePctStr}%</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Expiry amount (USDC)</dt>
                        <dd class="mt-1 text-sm text-gray-900">${data2?.expAmountStr}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Fee collector address</dt>
                        <dd class="mt-1 text-sm text-gray-900">{data2?.feeCollector?.substr(0, 6) + "..." + data2?.feeCollector?.substr(-4)}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Multi-sig address</dt>
                        <dd class="mt-1 text-sm text-gray-900">{data2?.multiSig?.substr(0, 6) + "..." + data2?.multiSig?.substr(-4)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Place BID */}
                {data2?.buyer && data2?.buyer === ethers.constants.AddressZero && (
                  <>
                    <div className="px-6 py-8 lg:col-span-1 bg-white rounded-2xl shadow">
                      <div>
                        <h3 className="text-xl text-center font-semibold text-gray-900">Place Bid</h3>
                        <div>
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
                                    "Enter Address to receive revenue-share",
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
                              <Button className="w-full" htmlType="button"
                                onClick={handleApprove}
                              >
                                Approve Cinch to use your USDC
                              </Button>
                            </Form.Item>

                            <Form.Item>
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
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Fee collector" key="1">
                  {data2?.feeCollector && data2?.feeCollector !== ethers.constants.AddressZero && (
                    <div className="mt-14 bg-white shadow rounded-lg">
                      <FeeCollectorDashboard
                        feeCollectorAddress={data2?.feeCollector}
                        title={"Protocol revenue stream"}
                      />
                    </div>
                  )}
                </Tabs.TabPane>
                {data2?.vaultAddress && data2?.vaultAddress !== ethers.constants.AddressZero && (
                  <Tabs.TabPane tab="Received by vault" key="2">
                    <div className="mt-14 bg-white shadow rounded-lg">
                      <VaultDashboard targetAddress={data2?.vaultAddress} title={"Revenue received"} />
                    </div>
                  </Tabs.TabPane>
                )}
              </Tabs>
            </Container>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Web3Consumer(RevenueStream);
