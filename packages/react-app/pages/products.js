import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Tabs } from "antd";
const { ethers } = require("ethers");
import Image from "next/image";

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

function Vault({ web3 }) {
    //console.log("web3", web3);
    const mockERC20Decimals = 6;
    const referralAddress = "0xdfFFAC7E0418A115CFe41d80149C620bD0749628";
    const protocolPayee = "0x683c5FEb93Dfe9f940fF966a264CBD0b59233cd2";
    const { TabPane } = Tabs;


    const statuses = {
        Paid: 'text-green-700 bg-green-50 ring-green-600/20',
        Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
        Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
    }
    const clients = [
        {
            id: 1,
            name: 'Tuple',
            imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
            lastInvoice: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'Overdue' },
        },
        {
            id: 2,
            name: 'SavvyCal',
            imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
            lastInvoice: { date: 'January 22, 2023', dateTime: '2023-01-22', amount: '$14,000.00', status: 'Paid' },
        },
        {
            id: 3,
            name: 'Reform',
            imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
            lastInvoice: { date: 'January 23, 2023', dateTime: '2023-01-23', amount: '$7,600.00', status: 'Paid' },
        },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="bg-slate-50">
            <>
                <CommonHead />
                <DAppHeader web3={web3} />

                <div>
                    <Container>
                        <div className="md:flex md:items-center md:justify-between border-b border-gray-200">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Explore products</h1>
                        </div>

                        <div className="mt-10">
                            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
                                {clients.map((client) => (
                                    <li key={client.id} className="overflow-hidden rounded-xl shadow-xl bg-white">
                                        <div className="flex items-center gap-x-4 border-b border-gray-900/5 p-6 ">
                                            <img
                                                src={client.imageUrl}
                                                alt={client.name}
                                                className="h-16 w-16 flex-none rounded-full bg-white object-cover ring-1 ring-gray-900/10"
                                            />
                                            <div className="text-2xl font-medium leading-6 text-gray-900">{client.name}</div>

                                        </div>
                                        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-slate-50">
                                            <div className="flex justify-between gap-x-4 py-3">
                                                <dt className="text-gray-500">Last invoice</dt>
                                                <dd className="text-gray-700">
                                                    <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
                                                </dd>
                                            </div>
                                            <div className="flex justify-between gap-x-4 py-3">
                                                <dt className="text-gray-500">Amount</dt>
                                                <dd className="flex items-start gap-x-2">
                                                    <div className="font-medium text-gray-900">{client.lastInvoice.amount}</div>
                                                    <div
                                                        className={classNames(
                                                            statuses[client.lastInvoice.status],
                                                            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                                                        )}
                                                    >
                                                        {client.lastInvoice.status}
                                                    </div>
                                                </dd>
                                            </div>

                                        </dl>

                                    </li>
                                ))}
                            </ul>


                        </div>
                        <div class="mb-5">
                            <div>
                                <div>
                                    <dl className="mt-5 flex justify-start divide-y divide-gray-200 overflow-hidden rounded-lg  md:divide-x md:divide-y-0 ">

                                        <div class="flex items-center space-x-5 pr-8">
                                            <div class="flex-shrink-0 ">

                                                <img
                                                    className="inline-block h-24 w-24 rounded-full"
                                                    src="/ribbon_logo_1.png"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                                    Ribbon R-EARN
                                                </h1>
                                                <CopyToClipboard textToCopy={web3?.writeContracts?.MockProtocol?.address} />
                                            </div>
                                        </div>
                                        <div className="px-8 py-2 ">
                                            <dt className="text-sm font-normal text-gray-900">APR</dt>
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
                                                    {1 == 1 ? <span class="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">Active</span>
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
                                                        <dt class="text-sm font-medium text-gray-500">Total cumulative refferal payments</dt>
                                                        <dd class="mt-1 text-2xl  text-gray-900">$6,500</dd>
                                                    </div>


                                                    <div class="sm:col-span-1 bg-white shadow rounded-xl p-5">
                                                        <dt class="text-sm font-medium text-gray-500">Referral Payment APY</dt>
                                                        <dd class="mt-1 text-2xl text-gray-900">1.56%</dd>
                                                    </div>
                                                    <div class="sm:col-span-1 bg-white shadow rounded-xl p-5">
                                                        <dt class="text-sm font-medium text-gray-500">Boosted APY </dt>
                                                        <dd class="mt-1 text-2xl text-gray-900">11.26%</dd>
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
                                            <p class="mt-1 max-w-2xl text-sm text-gray-500"><a href="https://app.ribbon.finance/earn/R-EARN"> The R-Earn vault </a> employs a fully funded twin win strategy through which depositors can capitalise on the intra-week ETH movements in either direction while also ensuring their capital is protected. The vault earns interest by lending capital to our counterparties and uses part of it to generate a base APY and the remaining funding to purchase weekly at-the-money knock-out barrier options. <a href="https://docs.ribbon.finance/ribbon-earn/ribbon-earn-usdc" target="_blank">Learn more.</a></p>
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
