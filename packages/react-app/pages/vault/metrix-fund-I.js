import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Tabs, Alert } from "antd";
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

import CopyToClipboard from "/components/CopyToClipboardButton";

import Web3Statistic from "/components/Web3/Statistic";
import VaultDepositForm from "/components/Web3/VaultDepositForm";
import VaultRedeemForm from "/components/Web3/VaultRedeemForm";
import VaultDepositEventList from "/components/Web3/VaultDepositEventList";
import VaultRedeemEventList from "/components/Web3/VaultRedeemEventList";
import demo01 from "/images/demo/cinch_demo_01.png";
import { NETWORK, NETWORKS } from "/constants";

function Vault({ web3 }) {
  const { NETWORKCHECK, localChainId, selectedChainId } = web3;
  const targetNetwork = NETWORK(10); //optimism
  let networkDisplay = null;
  console.log(targetNetwork.chainId);
  console.log(selectedChainId);
  if (NETWORKCHECK && selectedChainId && selectedChainId !== targetNetwork.chainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);

    networkDisplay = (
      <div className="mb-10">
        <Alert
          showIcon
          message="Wrong Network"
          description={
            <div>
              Please switch your wallet network to {targetNetwork.name} to interact with the vault.
              <Button style={{ marginLeft: 14 }}
                onClick={async () => {
                  const ethereum = window.ethereum;
                  const data = [
                    {
                      chainId: "0x" + targetNetwork.chainId.toString(16),
                      chainName: targetNetwork.name,
                      nativeCurrency: targetNetwork.nativeCurrency,
                      rpcUrls: [targetNetwork.rpcUrl],
                      blockExplorerUrls: [targetNetwork.blockExplorer],
                    },
                  ];
                  console.log("data", data);

                  let switchTx;
                  // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                  try {
                    switchTx = await ethereum.request({
                      method: "wallet_switchEthereumChain",
                      params: [{ chainId: data[0].chainId }],
                    });
                  } catch (switchError) {
                    // not checking specific error code, because maybe we're not using MetaMask
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: data,
                      });
                    } catch (addError) {
                      // handle "add" error
                    }
                  }

                  if (switchTx) {
                    console.log(switchTx);
                  }
                }}
              >
                Switch to {targetNetwork && targetNetwork.name}
              </Button>
            </div>
          }
          type="warning"
          closable={false}
        />
      </div>
    );
  }

  const mockERC20Decimals = 6;
  const referralAddress = "0xdfFFAC7E0418A115CFe41d80149C620bD0749628";
  const protocolPayee = "0x683c5FEb93Dfe9f940fF966a264CBD0b59233cd2";
  const { TabPane } = Tabs;
  return (
    <div className="bg-slate-50">
      <>
        <CommonHead />
        <DAppHeader web3={web3} />

        <div>
          <Container>
            <div class="mb-5">
              {networkDisplay}
              <div>
                <div>
                  <dl className="mt-5 flex justify-start divide-y divide-gray-200 overflow-hidden rounded-lg  md:divide-x md:divide-y-0 ">

                    <div class="flex items-center space-x-5 pr-8">
                      <div class="flex-shrink-0 ">

                        <img
                          className="inline-block h-24 w-24 rounded-full"
                          src="/metrixIcon.png"
                          alt=""
                        />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                          Metrix Liquid Token Fund I
                        </h1>
                        <CopyToClipboard textToCopy={web3?.writeContracts?.MockProtocol?.address} />
                      </div>
                    </div>
                    <div className="px-8 py-2 ">
                      <dt className="text-sm font-normal text-gray-900">APY</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-xl font-semibold text-gray-600">
                          9.7%

                        </div>
                      </dd>
                    </div>
                    <div className="px-8 py-2">
                      <dt className="text-sm font-normal text-gray-900">TVL</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-xl font-semibold text-gray-600">
                          $2.25 M

                        </div>
                      </dd>
                    </div>
                    <div className="px-6 py-2">
                      <dt className="text-sm font-normal text-gray-900 text-center">Status</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-xl font-semibold text-gray-600">
                          {1 == 1 ? <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                              <circle cx={3} cy={3} r={3} />
                            </svg>
                            Active
                          </span>
                            : <span class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">Pending</span>}

                        </div>
                      </dd>
                    </div>
                  </dl>

                </div>
              </div>

            </div>

            {/* info */}
            <div className="mb-10 lg:grid lg:grid-cols-5 lg:grid-rows-[auto,auto,1fr]">
              <div className="p-6 lg:mr-4 lg:col-span-3 rounded-2xl shadow">

                <Tabs defaultActiveKey="1">
                  <TabPane tab="Holdings" key="1">
                    <div>
                      <div>
                        <dl class="pt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div class="sm:col-span-1 bg-white shadow rounded-xl  p-5">
                            <dt class="text-sm font-medium text-gray-500">Balance </dt>
                            <dd class="mt-1 text-2xl  text-gray-900">$15,000</dd>
                          </div>
                          <div class="sm:col-span-1 bg-white shadow rounded-xl p-5">
                            <dt class="text-sm font-medium text-gray-500">Total cumulative referral payments</dt>
                            <dd class="mt-1 text-2xl  text-gray-900">$6,500</dd>
                          </div>


                          <div class="sm:col-span-1 bg-white shadow rounded-xl p-5">
                            <dt class="text-sm font-medium text-gray-500">Referral Payment APY</dt>
                            <dd class="mt-1 text-2xl text-gray-900">1.5%</dd>
                          </div>
                          <div class="sm:col-span-1 bg-white shadow rounded-xl p-5">
                            <dt class="text-sm font-medium text-gray-500">3M Returns</dt>
                            <dd class="mt-1 text-2xl text-gray-900">9.64%</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </TabPane>

                  <TabPane tab="Referral" key="2">
                    <div>
                      <div>
                        <dl class="pt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Underlying Asset</dt>
                            <dd class="mt-1 text-xl font-medium text-gray-900">
                              <img
                                className="inline-block h-8 w-8 rounded-full"
                                src="https://res.cloudinary.com/sushi-cdn/image/fetch/f_auto,c_limit,w_48,q_auto/https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.jpg"
                                alt=""
                              /> USDC
                            </dd>
                          </div>


                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Your referral code </dt>
                            <dd class="mt-1 text-xl text-gray-900"> <CopyToClipboard textToCopy='0xEdfdb5f2f02432F1E3271582056ECd0f884126aC' /></dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Revenue shared on platform users (%)</dt>
                            <dd class="mt-1 text-xl text-gray-900">100%</dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Product contract address</dt>
                            <dd class="mt-1 text-xl text-gray-900"><CopyToClipboard textToCopy={web3?.writeContracts?.MockProtocol?.address} /></dd>
                          </div>

                        </dl>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="About" key="3">
                    <div className="">
                      <h3 class="text-lg font-medium leading-6 text-gray-600">Description</h3>
                      <p class="mt-1 max-w-2xl text-sm text-gray-500"><a href="https://app.dhedge.org/vault/0xe31282190735e7bb599bd9d55e74d6bb437b13ac"> Metrix Liquid Token Fund I </a> is a smart fund made by dHedge that utilizes blockchain-powered automation in token analysis to invest in digital assets. The fund strategy was tested with Apollo Partners, a testing fund, and will be closing in a few months. All investors must hold a Connectivity NFT Collection in order to enter the new fund.<a href="https://app.dhedge.org/vault/0xe31282190735e7bb599bd9d55e74d6bb437b13ac" target="_blank">Learn more.</a></p>
                      <div className="flex">
                        <span className="text-green-600" >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                        </span>
                        <p>
                          <span className="ml-2">This vault has been audited by Hacken. <a target="_blank">Audit report.</a></span></p>
                      </div>

                    </div>
                  </TabPane>
                </Tabs>

              </div>

              {/* Actions */}
              <>
                <div className="p-2 lg:col-span-2 bg-white rounded-2xl shadow">
                  <div>
                    <Tabs defaultActiveKey="1" centered size='large' tabBarStyle={{ display: "flex", justifyContent: "space-between" }}>
                      <TabPane tab="Deposit" key="1">
                        <div className="mt-5">
                          <VaultDepositForm web3={web3} referralAddress={referralAddress} />
                        </div>
                      </TabPane>

                      <TabPane tab="Withdraw" key="3">
                        <div className="mt-5">
                          <VaultRedeemForm web3={web3} referralAddress={referralAddress} />
                        </div>
                      </TabPane>
                    </Tabs>


                  </div>

                </div>
              </>
            </div>



            <h3 className="mt-14 text-2xl font-semibold text-gray-900">
              Transactions
            </h3>
            <div className="bg-white ">
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
    </div>
  );
}

export default Web3Consumer(Vault);
