import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table, Col, Row, Card, Tabs } from "antd";
const { ethers } = require("ethers");
import Image from "next/image";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

import Web3Statistic from "/components/Web3/Statistic";
import VaultDepositForm from "/components/Web3/VaultDepositForm";
import VaultRedeemForm from "/components/Web3/VaultRedeemForm";
import VaultDepositEventList from "/components/Web3/VaultDepositEventList";
import VaultRedeemEventList from "/components/Web3/VaultRedeemEventList";
import demo01 from "/images/demo/cinch_demo_01.png";

function Vault({ web3 }) {
  //console.log("web3", web3);
  const mockERC20Decimals = 6;
  const referralAddress = "0xdfFFAC7E0418A115CFe41d80149C620bD0749628";
  const protocolPayee = "0x683c5FEb93Dfe9f940fF966a264CBD0b59233cd2";
  const { TabPane } = Tabs;
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />

      <div>
        <Container>
          <div class="md:flex md:items-center md:justify-between md:space-x-5">
            <div class="flex items-center space-x-5">
              <div class="flex-shrink-0">

              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Idle Clearpool {1 == 1 ? <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">Active</span>
                    : <span class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">Pending</span>}
                </h1>
              </div>
            </div>

          </div>

          {/* info */}
          <div className="mb-10 lg:grid lg:grid-cols-5 lg:grid-rows-[auto,auto,1fr]">
            <div className="p-6 lg:mr-4 lg:col-span-3 bg-white rounded-2xl shadow">
              <div className="">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Fee sharing partnership proposal</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Review and confirm details</p>
              </div>

              <div className="mb-10 border-t border-gray-200">
                <dl class="pt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Underlying Asset</dt>
                    <dd class="mt-1 text-sm font-medium text-gray-900">
                      <img
                        className="inline-block h-8 w-8 rounded-full"
                        src="https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,c_limit,w_48,q_auto/https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg"
                        alt=""
                      /> USDC
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Revenue shared with platform partner (%)</dt>
                    <dd class="mt-1 text-2xl text-gray-900">50%</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Product contract address</dt>
                    <dd class="mt-1 text-sm text-gray-900">{web3?.writeContracts?.MockProtocol?.address?.substr(0, 6) + "..." + web3?.writeContracts?.MockProtocol?.address?.substr(-4)}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Multi-sig address</dt>
                    <dd class="mt-1 text-sm text-gray-900">{web3?.writeContracts?.MockGnosisSafe?.address?.substr(0, 6) + "..." + web3?.writeContracts?.MockGnosisSafe?.address?.substr(-4)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <>
              <div className="px-6 py-8 lg:col-span-2 bg-white rounded-2xl shadow">
                {/* {vaultData?.status == 0 ? */}
                {0 == 0 ?


                  <div>
                    <Tabs defaultActiveKey="1" centered>
                      <TabPane tab="Deposit" key="1">
                        <div style={{ padding: 10 }}>
                          <Button variant="outline"
                            onClick={() => {
                              web3?.tx(
                                web3?.writeContracts?.MockERC20?.faucet(
                                  web3?.address,
                                  ethers.utils.parseUnits("1000", mockERC20Decimals),
                                ),
                              );
                            }}
                          >
                            1. Get asset from faucet
                          </Button>
                        </div>
                        <VaultDepositForm web3={web3} referralAddress={referralAddress} />
                      </TabPane>

                      <TabPane tab="Simulate revenue" key="2">
                        <div style={{ marginTop: 32 }}>

                          <Web3Statistic
                            web3={web3}
                            contractName="FeeSplitter"
                            getFuncName="getInternalBalance"
                            args={[web3?.readContracts?.MockERC20?.address, referralAddress]}
                            title="Fee Splitter Balance For Referral"
                            dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
                          />

                          <Button className="mt-10 mb-10"
                            onClick={async () => {
                              const feeReleaseAmountA = ethers.utils.parseUnits("100", mockERC20Decimals);

                              await web3?.tx(
                                web3?.writeContracts?.MockProtocol?.gainRevenueAndRelease(
                                  web3?.readContracts?.MockERC20?.address,
                                  feeReleaseAmountA,
                                ),
                              );
                            }}
                          >
                            4. Gain revenue and release to Fee Splitter
                          </Button>



                          <Button
                            onClick={() => {
                              web3?.tx(
                                web3?.writeContracts?.FeeSplitter?.release(
                                  web3?.readContracts?.MockERC20?.address,
                                  referralAddress,
                                ),
                              );
                            }}
                          >
                            5. Release revenue share to Referral account
                          </Button>
                        </div>
                      </TabPane>

                      <TabPane tab="Withdraw" key="3">
                        <div style={{ marginTop: 32 }}>
                          <VaultRedeemForm web3={web3} referralAddress={referralAddress} />
                        </div>
                      </TabPane>
                    </Tabs>


                  </div>

                  :

                  <div>
                    <h3 className="text-xl text-center font-semibold text-gray-900">Action Items</h3>
                    <div>
                      {/* {vaultData?.status == 0 ? <div> */}
                      {1 == 0 ? <div>
                      </div> :

                        <div>
                          <div class="rounded-md bg-yellow-50 p-4">
                            <div class="flex">
                              <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fill-rule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                </svg>
                              </div>
                              <div class="ml-3">
                                <h3 class="text-sm font-medium text-yellow-800">Instructions for Digital Wallet</h3>
                                <div class="mt-2 text-sm text-yellow-700">
                                  <p>Cinch contracts are now deployed.</p>
                                  <p>Please include the following cryptographic as referral input on all transactions from users wallets.</p>
                                  <p>Any transaction not tagged with your referral code will not generate fee revenue for you.</p>
                                  <p>REFERRAL CODE: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>}
                    </div>
                  </div>
                }


              </div>
            </>
          </div>


          {/* {vaultData?.status == 1 ? */}
          {1 == 1 ?
            <div className="mt-14">
              <h3 className="text-2xl font-semibold text-gray-900">
                Revenue-share dashboard
              </h3>
              <div className="p-10 mt-14 bg-white shadow rounded-lg">
                <div>
                  {/* <h3 className="text-lg font-medium leading-6 text-gray-900">Last 30 days</h3> */}
                  <dl className=" grid grid-cols-1 overflow-hidden md:grid-cols-4">
                    <Web3Statistic
                      web3={web3}
                      contractName="MockProtocol"
                      getFuncName="getTotalValueLocked"
                      title="Protocol TVL"
                      dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
                    />

                    <Web3Statistic
                      web3={web3}
                      contractName="Vault"
                      getFuncName="getTotalValueLocked"
                      args={[referralAddress]}
                      title="Vault TVL By Referral"
                      dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
                    />

                    <Web3Statistic
                      web3={web3}
                      contractName="Vault"
                      getFuncName="balanceOf"
                      args={[web3?.address]}
                      title="Your Vault Share Balance"
                      dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
                    />

                    <Web3Statistic
                      web3={web3}
                      contractName="FeeSplitter"
                      getFuncName="getTotalSplittedTo"
                      args={[web3?.readContracts?.MockERC20?.address, referralAddress]}
                      title="Total Splitted To Referral"
                      dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
                    />
                  </dl>
                </div>
              </div>

            </div>
            : <div>
            </div>



          }


          <h3 className="mt-14 text-2xl font-semibold text-gray-900">
            Transactions
          </h3>
          <div className="bg-white shadow">
            <div>
              <VaultDepositEventList web3={web3} mockERC20Decimals={mockERC20Decimals} />
            </div>
            <div style={{ marginTop: 16 }}>
              <VaultRedeemEventList web3={web3} mockERC20Decimals={mockERC20Decimals} />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Web3Consumer(Vault);
