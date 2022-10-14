import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
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
import { fetchVaultData } from "/helpers/vaulthelper";

function Vault({ web3 }) {
  const [vaultData, setVaultData] = useState(null);

  const router = useRouter();
  const { vaultaddress } = router.query;

  const reloadData = async () => {
    if (vaultaddress) {
      console.log("vaultaddress", vaultaddress);
      const data = await fetchVaultData({ web3, address: vaultaddress });
      setVaultData(data);
      console.log("vaultData", data);
    }
  };

  useEffect(() => {
    if (web3) {
      reloadData();
    }
  }, [web3, vaultaddress]);

  let classNameIsFeeCollectorUpdated = vaultData?.isFeeCollectorUpdated ? "bg-green-500" : "bg-gray-400";
  let classNameIsMultisigGuardAdded = vaultData?.isMultisigGuardAdded ? "bg-green-500" : "bg-gray-400";
  let classNameIsReadyToActivate = vaultData?.isFeeCollectorUpdated && vaultData?.isMultisigGuardAdded ? "bg-green-500" : "bg-gray-400";

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div>
          <Container>
            {/* info */}
            <div className="pt-10 pb-16 px-4 bg-slate-50 rounded-lg shadow mb-10 sm:px-6 lg:pt-10 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-4 lg:grid-rows-[auto,auto,1fr]">
              <div className="lg:col-span-2 lg:pr-8">
                <div className="flex justify-start">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {vaultData?.name} -  {vaultData?.status}
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
                        <dt className="text-gray-500">Price (ETH)</dt>
                        <dd className="text-gray-900"> {vaultData?.price}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Borrower</dt>
                        <dd className="text-gray-900">  {vaultData?.borrower}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Lender</dt>
                        <dd className="text-gray-900"> {vaultData?.lender}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Revenue proportion</dt>
                        <dd className="text-gray-900">{vaultData?.revenuePct}%</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Expiry amount (ETH)</dt>
                        <dd className="text-gray-900">{vaultData?.expAmount}</dd>
                      </div>

                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Fee collector address</dt>
                        <dd className="text-gray-900">{vaultData?.feeCollector}</dd>
                      </div>
                      <div className="py-3 flex justify-between text-sm font-medium">
                        <dt className="text-gray-500">Multi-sig address</dt>
                        <dd className="text-gray-900">{vaultData?.multiSig}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <>
                <div className="mx-5 mt-4 lg:mt-0 lg:col-span-2 shadow-2xl p-10 ">
                  <div>
                    <h3 className="text-xl text-center font-semibold text-gray-900">Pending Items</h3>
                    <div class="flow-root mt-10">
                      <ul role="list" class="-mb-8">

                        <li>
                          <div class="relative pb-8">
                            <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            <div class="relative flex space-x-3">
                              <div>

                                <span class={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${classNameIsFeeCollectorUpdated}`}>
                                  <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                  </svg>
                                </span>
                              </div>
                              <div className="min-w-0 pt-1.5">
                                <p class="text-sm text-gray-500">Updated the fee receiver Address</p>
                              </div>
                            </div>
                          </div>
                        </li>



                        <li>
                          <div class="relative pb-8">
                            <div class="relative flex space-x-3">
                              <div>
                                <span class={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${classNameIsMultisigGuardAdded}`}>
                                  <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                  </svg>
                                </span>
                              </div>
                              <div className="min-w-0 pt-1.5">
                                <p class="text-sm text-gray-500">Added Cinch multi-Sig guard</p>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div class="relative pb-8">
                            <div class="relative flex space-x-3">
                              <div>
                                <span class={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${classNameIsReadyToActivate}`}>
                                  <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                  </svg>
                                </span>
                              </div>
                              <div className="min-w-0 pt-1.5">
                                <p class="text-sm text-gray-500">All done. Ready to deploy the fund.</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* <Modal
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
                                <dt className="text-sm font-medium text-gray-500">Address to receive revenue-share</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  {formValues?.addressToReceiveRevenueShare}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </Modal> */}
                  </div>
                </div>
              </>


              {/* Transaction */}
              <div className="mt-20 lg:col-span-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Transaction History
                </h3>

                <div className="text-center mt-5">
                  {/* <BidTable web3={web3} dataSource={bidDatas} /> */}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(Vault);
