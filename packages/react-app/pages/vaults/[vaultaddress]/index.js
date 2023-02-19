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
import { fetchVaultData, activateVault, withdraw } from "/helpers/vaulthelper";

function Vault({ web3 }) {
  const [vaultData, setVaultData] = useState(null);

  const router = useRouter();
  const { vaultaddress } = router.query;

  const reloadData = async () => {
    if (vaultaddress) {
      const data = await fetchVaultData({ web3, address: vaultaddress });
      setVaultData(data);
    }
  };

  const handleActivateVault = async () => {
    if (vaultaddress) {
      await activateVault({ web3, address: vaultaddress });
    }
  };

  const handleWithdraw = async () => {
    if (vaultaddress) {
      await withdraw({ web3, address: vaultaddress });
    }
  };

  useEffect(() => {
    if (web3) {
      reloadData();
    }
  }, [web3]);

  let classNameIsFeeCollectorUpdated = vaultData?.isFeeCollectorUpdated ? "bg-green-500" : "bg-gray-400";
  let classNameIsMultisigGuardAdded = vaultData?.isMultisigGuardAdded ? "bg-green-500" : "bg-gray-400";
  let classNameIsReadyToActivate =
    vaultData?.isFeeCollectorUpdated && vaultData?.isMultisigGuardAdded ? "bg-green-500" : "bg-gray-400";

  return (
    <>
      <div className="bg-slate-50">
        <CommonHead />
        <DAppHeader web3={web3} />
        <main>
          <div>
            <Container>
              <div className="md:flex md:items-center md:justify-between md:space-x-5">
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0">
                    {/* <div class="relative">
                      <img class="h-16 w-16 rounded-full" src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80" alt=""/>
                        <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
                    </div> */}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {vaultData?.name}{" "}
                      {vaultData?.status == 1 ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                          Pending
                        </span>
                      )}
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Listing Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Protocol details and terms.</p>
                  </div>

                  <div className="mb-10 border-t border-gray-200">
                    <dl className="pt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Price (USDC)</dt>
                        <dd className="mt-1 text-2xl text-gray-900">${vaultData?.price}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Revenue proportion</dt>
                        <dd className="mt-1 text-2xl text-gray-900">{vaultData?.revenuePct}%</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Expiry amount (USDC)</dt>
                        <dd className="mt-1 text-2xl text-gray-900">${vaultData?.expAmount}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Fee collector address</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {vaultData?.feeCollector?.substr(0, 6) + "..." + vaultData?.feeCollector.substr(-4)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Multi-sig address</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {vaultData?.multiSig?.substr(0, 6) + "..." + vaultData?.multiSig.substr(-4)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Borrower</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {vaultData?.borrower?.substr(0, 6) + "..." + vaultData?.borrower.substr(-4)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Lender</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {vaultData?.lender?.substr(0, 6) + "..." + vaultData?.lender.substr(-4)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Actions */}
                <>
                  <div className="px-6 py-8 bg-white rounded-2xl shadow">
                    {vaultData?.status == 0 ? (
                      <div>
                        <h3 className="text-xl text-center font-semibold text-gray-900">Pending Action Items</h3>
                        <div className="flow-root mt-10">
                          <ul role="list" className="-mb-8">
                            <li>
                              <div className="relative pb-8">
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                ></span>
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span
                                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${classNameIsFeeCollectorUpdated}`}
                                    >
                                      <svg
                                        className="h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="min-w-0 pt-1.5">
                                    <p className="text-sm text-gray-500">Updated the fee receiver Address to </p>
                                    <p>{vaultaddress}</p>
                                  </div>
                                </div>
                              </div>
                            </li>

                            <li>
                              <div className="relative pb-8">
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                ></span>
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span
                                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${classNameIsMultisigGuardAdded}`}
                                    >
                                      <svg
                                        className="h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="min-w-0 pt-1.5">
                                    <p className="text-sm text-gray-500">
                                      Added Cinch multi-sig guard to the Gnosis safe (
                                      <a
                                        href="https://help.gnosis-safe.io/en/articles/5496893-add-a-transaction-guard"
                                        className="no-underline hover:underline ..."
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Instruction
                                      </a>
                                      )
                                    </p>
                                    <p>Guard Address: {vaultData?.multisigGuard}</p>
                                  </div>
                                </div>
                              </div>
                            </li>

                            <li>
                              <div className="relative pb-8">
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span
                                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${classNameIsReadyToActivate}`}
                                    >
                                      <svg
                                        className="h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="min-w-0 pt-1.5">
                                    <p className="text-sm text-gray-500">Ready to deploy the funds.</p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <Button className="w-full mt-12" onClick={handleActivateVault}>
                            Transfer Funds
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl text-center font-semibold text-gray-900">Action Items</h3>
                        <div>
                          <Button className="w-full mt-12" onClick={handleWithdraw}>
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              </div>

              {/* Transaction */}
              <div className="mt-14">
                <h3 className="text-2xl font-semibold text-gray-900">Transaction History</h3>

                <div className="text-center mt-5">{/* <BidTable web3={web3} dataSource={bidDatas} /> */}</div>
              </div>
            </Container>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Web3Consumer(Vault);
