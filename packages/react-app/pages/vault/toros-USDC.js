import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { formatNumber } from "/helpers/utils";
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
import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";

import CopyToClipboard from "/components/CopyToClipboardButton";
import VaultDepositForm from "/components/Web3/VaultDepositForm";
import VaultRedeemForm from "/components/Web3/VaultRedeemForm";
import VaultEventsList from "/components/Web3/VaultEventsList";
import VaultRedeemFormDHedge from "/components/Web3/DHedge/VaultRedeemFormDHedge";
import VaultWithdrawFromRevenueShareForm from "/components/Web3/VaultWithdrawFromRevenueShareForm";
import VaultAddRevenueShareReferralForm from "/components/Web3/VaultAddRevenueShareReferralForm";
import VaultDepositToRevenueShareButton from "/components/Web3/VaultDepositToRevenueShareButton";
import { XCircleIcon } from '@heroicons/react/outline';
import { createClient } from 'urql'
import { NETWORK, NETWORKS } from "/constants";

function getGraphQuery(address) {
  const query = `
    query {     
      depositWithReferrals(
        where: {caller: "${address}"}
        orderDirection: desc
      ) {
        assets
        caller
        receiver
        referral
        shares
        blockTimestamp
        transactionHash
        id
      }
      revenueShareWithdrawns(where: {receiver: "${address}"}, orderDirection: desc) {
        amount
        asset
        blockTimestamp
        receiver
        referral
      }
      initiateWithdraws(
        orderBy: blockTimestamp
        orderDirection: desc
        where: {account: "${address}"}
      ) {
        account
        shares
        round
        blockTimestamp
      }
      withdraws(
        first: 2
        orderBy: blockTimestamp
        orderDirection: desc
        where: {account: "${address}"}
      ) {
        account
        amount
        blockTimestamp
        shares
      }
    }
  `;

  return query;
}

const client = createClient({
  url: process.env.GRAPH_API_URL
})

function Vault({ web3 }) {

  const usdcERC20Decimals = 6;
  const protocolContractAddress = "0x84c2b16fa6877a8ff4f3271db7ea837233dfd6f0";
  const vaultContractName = "RevenueShareVaultDHedge";
  const protocolContractName = "TorosUSDCABI";
  const pollTime = 500;

  var pendingReferralBalance = ethers.utils.formatUnits(useContractReader(web3.readContracts, vaultContractName, 'revenueShareBalanceByAssetReferral', [web3?.writeContracts?.MockERC20?.address, web3?.address], pollTime) ?? 0, usdcERC20Decimals);
  var isReferralRegistered = useContractReader(web3.readContracts, vaultContractName, 'isReferralRegistered', [web3?.address], pollTime)
  //var underlyingProductTVL = ethers.utils.formatUnits(2269745893477 ?? 0, usdcERC20Decimals); //TODO read from underlying contract instead below
  var underlyingProductTVL = ethers.utils.formatUnits(useContractReader(web3.readContracts, protocolContractName, 'totalFundValue', [], pollTime) ?? 0, usdcERC20Decimals);
  var vaultDepositProcessed = ethers.utils.formatUnits(useContractReader(web3.readContracts, vaultContractName, 'totalAssetDepositProcessed', [], pollTime) ?? 0, usdcERC20Decimals);

  const { TabPane } = Tabs;

  const [netBalance, setNetBalance] = useState(0);
  const [cumulativeReferralBalance, setCumulativeReferralBalance] = useState(0);
  const [graphData, setGraphData] = useState(null); // Initialize graphData as null
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (address === '') return; // Skip fetching if the address is empty

      const response = await client.query(getGraphQuery(address)).toPromise();
      //console.log('GRAPH:', response.data);
      setGraphData(response.data);
    };

    fetchData();
  }, [address]);

  useEffect(() => {
    if (graphData) {
      calculateNetBalance();
      calculateCumulativeReferralWithdrwals();
    }
  }, [graphData]);

  useEffect(() => {
    const web3Address = web3?.address?.toString();
    setAddress(web3Address || '');
  }, [web3]);


  function calculateNetBalance() {
    let balance = 0;
    graphData.depositWithReferrals?.forEach((deposit) => {
      balance += parseInt(ethers.utils.formatUnits(deposit.assets ?? 0, 6));
    });

    graphData.withdraws?.forEach((withdrawal) => {
      balance -= parseInt(ethers.utils.formatUnits(withdrawal.amount ?? 0, 6));
    });

    setNetBalance(balance);
  }

  function calculateCumulativeReferralWithdrwals() {
    let balance = 0;
    graphData.revenueShareWithdrawns?.forEach((withdrawal) => {
      balance += parseInt(ethers.utils.formatUnits(withdrawal.amount ?? 0, 6));
    });

    setCumulativeReferralBalance(balance);
  }


  const { NETWORKCHECK, localChainId, selectedChainId } = web3;
  const targetNetwork = NETWORK(10); //optimism
  const targetNetworkName = targetNetwork.name == 'mainnet' ? 'Ethereum' : targetNetwork.name;
  let networkDisplay = null;

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
              Please switch your wallet network to {targetNetworkName} to interact with the vault.
              <Button style={{ marginLeft: 14 }}
                onClick={async () => {
                  const ethereum = window.ethereum;
                  const data = [
                    {
                      chainId: "0x" + targetNetwork.chainId.toString(16),
                      chainName: targetNetworkName,
                      nativeCurrency: targetNetwork.nativeCurrency,
                      rpcUrls: [targetNetwork.rpcUrl],
                      blockExplorerUrls: [targetNetwork.blockExplorer],
                    },
                  ];


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
                Switch to {targetNetworkName}
              </Button>
            </div>
          }
          type="warning"
          closable={false}
        />
      </div>
    );
  }

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
                          className="inline-block h-16 w-16 rounded-full"
                          src="/toroslogo.png"
                          alt=""
                        />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                          Toros USD Delta Neutral Yield
                        </h1>
                        <CopyToClipboard textToCopy={web3?.writeContracts?.[vaultContractName]?.address} />
                      </div>
                    </div>
                    <div className="px-8 py-2 ">
                      <dt className="text-sm font-normal text-gray-900">APY</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-xl font-semibold text-gray-600">
                          2-12%

                        </div>
                      </dd>
                    </div>
                    <div className="px-8 py-2">
                      <dt className="text-sm font-normal text-gray-900">TVL</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-xl font-semibold text-gray-600">
                          {formatNumber(underlyingProductTVL, 2)}
                          <span className="ml-2 text-sm font-medium text-gray-500">USDC</span>
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
              <div className="py-4 px-6 lg:mr-4 lg:col-span-3 rounded-2xl shadow bg-white">

                <Tabs defaultActiveKey="1">
                  <TabPane tab="Holdings" key="1">
                    <div>

                      <div>
                        <dl class="pt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Balance </dt>
                            <dd class="mt-1 text-2xl  text-gray-900">{formatNumber(netBalance)}<span className="ml-2 text-sm font-medium text-gray-500">USDC</span></dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Total cumulative referral payments</dt>
                            <dd class="mt-1 text-2xl  text-gray-900">{formatNumber(cumulativeReferralBalance)}<span className="ml-2 text-sm font-medium text-gray-500">USDC</span></dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">TVL via Cinch</dt>
                            <dd class="mt-1 text-2xl text-gray-900">{formatNumber(vaultDepositProcessed)}<span className="ml-2 text-sm font-medium text-gray-500">USDC</span></dd>
                          </div>

                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Referral Payment APY</dt>
                            <dd class="mt-1 text-2xl text-gray-900">1.56%</dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Boosted APY </dt>
                            <dd class="mt-1 text-2xl text-gray-900">2.3-13.8%</dd>
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


                          {/* <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Your referral code </dt>
                            <dd class="mt-1 text-xl text-gray-900"> <CopyToClipboard textToCopy='0xEdfdb5f2f02432F1E3271582056ECd0f884126aC' /></dd>
                          </div> */}
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Revenue shared on platform users (%)</dt>
                            <dd class="mt-1 text-xl text-gray-900">100%</dd>
                          </div>
                          <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Product contract address</dt>
                            <dd class="mt-1 text-xl text-gray-900"><CopyToClipboard textToCopy={web3?.writeContracts?.[vaultContractName]?.address} /></dd>
                          </div>

                        </dl>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="About" key="3">
                    <div className="">
                      <h3 class="text-lg font-medium leading-6 text-gray-600">Description</h3>
                      <p class="mt-1 max-w-2xl text-sm text-gray-500"><a href="https://toros.finance/pool/0xc4c6333afdd510066786e0d257eb91095fd729e3"> The Toros USD Delta Neutral Yield </a> vault earns yield on crypto assets while hedging against to be market neutral, making interest on USD while uninfluenced by crypto price volatility. <a href="https://docs.toros.finance/dynamic-vaults/market-neutral-yield" target="_blank">Learn more.</a></p>
                      <div className="flex">
                        <span className="text-green-600" >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                        </span>
                        <p>
                          <span className="ml-2">This vault has been audited by Hacken. <a target="_blank" href="https://2144113251-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FEUGrGQMszyzwnqSJcQhi%2Fuploads%2FPhxht08pRErhrpoguGLO%2FCinch_Protocol_Hacken%20OU_Audit%20Report_12052023.pdf?alt=media&token=271737c0-8966-475e-a378-0858e2ca2998">Audit report.</a></span></p>
                      </div>

                    </div>
                  </TabPane>
                </Tabs>

              </div>

              {/* Actions */}
              <>
                <div className="p-1 lg:col-span-2 bg-white rounded-2xl shadow">
                  <div>
                    <Tabs defaultActiveKey="1" centered size='large' tabBarStyle={{ display: "flex", justifyContent: "space-between" }}>
                      {selectedChainId !== 1 ?
                        <TabPane tab="Simulation" key="0">
                          <div className="p-5">

                            <Button
                              onClick={async () => {
                                await web3?.tx(
                                  web3?.writeContracts[vaultContractName]?.addRevenueShareReferral(web3?.address),
                                );
                              }}
                            >
                              1. Register your address with referral program
                            </Button>

                            <Button className="my-10"
                              onClick={() => {
                                web3?.tx(
                                  web3?.writeContracts?.MockERC20?.faucet(
                                    web3?.address,
                                    ethers.utils.parseUnits("1100", usdcERC20Decimals),
                                  ),
                                );
                              }}
                            >
                              2. Get test USDC
                            </Button>
                            <div>
                              <Button className="mb-10" variant="outline">
                                3. Go to deposit tab and do deposit
                              </Button>
                            </div>


                            <VaultDepositToRevenueShareButton web3={web3} vaultContractName={vaultContractName} />

                          </div>
                        </TabPane> : ""
                      }
                      <TabPane tab="Deposit" key="1">
                        <div className="mt-5">
                          <VaultDepositForm web3={web3} vaultContractName={vaultContractName} referralAddress={address} />
                        </div>
                      </TabPane>

                      <TabPane tab="Withdraw" key="2">
                        <div className="mt-5">
                          <VaultRedeemFormDHedge
                            web3={web3}
                            vaultContractName={protocolContractName}
                            cardTitle="Redeem from Protocol"
                          />
                        </div>
                      </TabPane>
                      <TabPane tab="Claim Referral" key="3">
                        {

                          !isReferralRegistered ?
                            <div className="rounded-md bg-red-50 m-10 p-6 align-middle">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="font-medium text-red-700">Address not registered with Referral program.</h3>
                                </div>
                              </div>
                            </div> :
                            <div>
                              <div class="sm:col-span-1 m-8">
                                <dt class="text-sm font-medium text-gray-500">Available Referral Balance </dt>
                                <dd class="mt-1 text-2xl  text-gray-900">{pendingReferralBalance.toString()}</dd>
                              </div>
                              <div className="mt-5">
                                <VaultWithdrawFromRevenueShareForm
                                  web3={web3}
                                  vaultContractName={vaultContractName}
                                  defaultWithdrawAmountStr={"90"}
                                />
                              </div>
                            </div>
                        }
                      </TabPane>
                    </Tabs>


                  </div>

                </div>
              </>
            </div>



            <h3 className="mt-14 text-2xl font-semibold text-gray-900">
              Transactions
            </h3>
            <div>
              <VaultEventsList
                graphData={graphData}
              />
            </div>

          </Container>
        </div>
      </>
    </div>
  );
}

export default Web3Consumer(Vault);
