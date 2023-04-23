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
            name: 'Ribbon R-EARN',
            imageUrl: '/ribbon_logo_1.png',
            lastInvoice: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'Overdue' },
        },
        {
            id: 2,
            name: 'Metrix-fund-1',
            imageUrl: '/metrixIcon.png',
            lastInvoice: { date: 'January 22, 2023', dateTime: '2023-01-22', amount: '$14,000.00', status: 'Paid' },
        },
        {
            id: 3,
            name: 'Ribbon stETH',
            imageUrl: '/ribbon_logo_1.png',
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
                    <Container className="h-screen">
                        <div className="md:flex md:items-center md:justify-between border-b border-gray-200">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Explore products</h1>
                        </div>

                        <div className="mt-10">
                            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
                                {clients.map((client) => (
                                    <li key={client.id} className="overflow-hidden rounded-xl shadow-xl bg-white">

                                        <div className="flex items-center gap-x-4 border-b border-gray-900/5 px-6 py-12">
                                            <img
                                                src={client.imageUrl}
                                                alt={client.name}
                                                className="h-20 w-20 flex-none rounded-full bg-white object-cover ring-1 ring-gray-900/10"
                                            />
                                            <div className="text-2xl font-medium leading-6 text-gray-900">{client.name}</div>
                                            <span className="inline-flex text-right items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                                                    <circle cx={3} cy={3} r={3} />
                                                </svg>
                                                Active
                                            </span>
                                        </div>
                                        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-slate-50 shadow-inner">
                                            <div className="flex flex-1 justify-between items-end gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <p className="uppercase text-xs font-semibold text-gray-400 leading-4">APR</p>
                                                    <p className="truncate text-lg font-bold text-gray-700 leading-4">9.7%</p>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <p className="uppercase text-xs font-semibold text-gray-400 leading-4">Boosted APR</p>
                                                    <p className="truncate text-lg font-bold text-gray-700 leading-4">11.26%</p>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <p className="uppercase text-xs font-semibold text-gray-400 leading-4">TVL</p>
                                                    <p className="truncate text-lg font-bold text-gray-700 leading-4">2.25M</p>
                                                </div>

                                            </div>
                                        </dl>

                                    </li>
                                ))}
                            </ul>


                        </div>

                    </Container>
                </div>
            </>
        </div>
    );
}

export default Web3Consumer(Vault);
