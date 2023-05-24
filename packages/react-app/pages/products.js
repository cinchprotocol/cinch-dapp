import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Tabs } from "antd";
const { ethers } = require("ethers");
import Image from "next/image";
import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";

import CopyToClipboard from "/components/CopyToClipboardButton";


function Vault({ web3 }) {

    const { TabPane } = Tabs;

    const stETHSvg = <span><svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" height="100%"><path d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z" fill="#00A3FF" fill-opacity="0.12"></path><path d="M16.5666 25.9769L16.2466 26.4679C12.6375 32.0043 13.4435 39.2549 18.1844 43.9002C20.9735 46.633 24.629 47.9996 28.2844 48C28.2844 48 28.2844 48 16.5666 25.9769Z" fill="#00A3FF"></path><path opacity="0.6" d="M28.282 32.6703L16.5641 25.9769C28.282 48 28.282 48 28.282 48C28.282 43.2036 28.282 37.7074 28.282 32.6703Z" fill="#00A3FF"></path><path opacity="0.6" d="M40.0148 25.9769L40.3348 26.4679C43.9439 32.0043 43.1379 39.2549 38.397 43.9002C35.6079 46.633 31.9525 47.9996 28.297 48C28.297 48 28.297 48 40.0148 25.9769Z" fill="#00A3FF"></path><path opacity="0.2" d="M28.2958 32.6703L40.0137 25.9769C28.2959 48 28.2958 48 28.2958 48C28.2958 43.2036 28.2958 37.7074 28.2958 32.6703Z" fill="#00A3FF"></path><path opacity="0.2" d="M28.3 17.7188V29.263L38.3937 23.4947L28.3 17.7188Z" fill="#00A3FF"></path><path opacity="0.6" d="M28.297 17.7188L18.196 23.4945L28.297 29.263V17.7188Z" fill="#00A3FF"></path><path d="M28.297 8.00839L18.196 23.4964L28.297 17.7045V8.00839Z" fill="#00A3FF"></path><path opacity="0.6" d="M28.3 17.7036L38.4014 23.4957L28.3 8V17.7036Z" fill="#00A3FF"></path></svg></span>;
    const usdcSvg = <span><svg xmlns="http://www.w3.org/2000/svg" data-name="86977684-12db-4850-8f30-233a7c267d11" viewBox="0 0 2000 2000">
        <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775ca" />
        <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#fff" />
        <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#fff" />
    </svg></span>

    const clients = [
        {
            id: 1,
            name: 'Ribbon R-EARN',
            vaultUrl: '/vault/ribbon-r-earn',
            metrics: [{ name: 'Boosted APY', value: '11.26%' }, { name: 'Referral APY', value: '1.56%' }, { name: ' TVL', value: '$2.25M' }],
            token: 'USDC',
            image: '/ribbon_logo_1.png'
        },
        {
            id: 2,
            name: 'Metrix-fund-1',
            vaultUrl: '/vault/metrix-fund-I',
            metrics: [{ name: '3M Returns', value: '9.64%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$51.9K' }],
            token: 'USDC',
            image: '/metrixIcon.png'
        },
        {
            id: 3,
            name: 'Ribbon stETH',
            vaultUrl: '/vault/ribbon-stETH-earn',
            metrics: [{ name: 'Boosted APY', value: '11.26%' }, { name: 'Referral APY', value: '1.56%' }, { name: 'TVL', value: '2.28K', unit: 'stETH' }],
            token: 'stETH',
            image: '/ribbon_logo_1.png'
        },
        {
            id: 4,
            name: 'Toros USD Delta Neutral',
            vaultUrl: '/vault/dHedge-toros',
            metrics: [{ name: '1Y Returns', value: '3.6%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$109.3K' }],
            token: 'USDC',
            image: '/toros.png'
        },
        {
            id: 5,
            name: 'Idle USDC Clearpool',
            vaultUrl: '/vault/dHedge-toros',
            metrics: [{ name: '1Y Returns', value: '3.6%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$109.3K' }],
            token: 'USDC',
            image: '/idle_logo_01.png'
        },
        {
            id: 6,
            name: 'BENQI Staking',
            vaultUrl: '/vault/dHedge-toros',
            metrics: [{ name: '1Y Returns', value: '3.6%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$109.3K' }],
            token: 'USDC',
            image: '/BENQI_logo.webp'
        },
        {
            id: 7,
            name: 'Pendle ETH Pool',
            vaultUrl: '/vault/dHedge-toros',
            metrics: [{ name: 'Boosted APY', value: '18.2%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$5.01 M' }],
            token: 'USDC',
            image: '/Pendle_logo.jpeg'
        },
        {
            id: 8,
            name: 'Sommelier',
            vaultUrl: '/vault/dHedge-toros',
            metrics: [{ name: 'Boosted APY', value: '5%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$7.98M' }],
            token: 'USDC',
            image: '/Sommelier_logo.png'
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
                                        <a href={client.vaultUrl}>
                                            <div className="text-right p-2">
                                                <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                    <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                                                        <circle cx={3} cy={3} r={3} />
                                                    </svg>
                                                    Active
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 px-6 pt-6 pb-14">
                                                {/* <img
                                                src={client.imageUrl}
                                                alt={client.name}
                                                className="h-20 w-20 flex-none rounded-full bg-white object-cover ring-1 ring-gray-900/10"
                                            /> */}
                                                <div>
                                                    {/* {client.token == "USDC" ? usdcSvg : stETHSvg} */}
                                                    <img
                                                        className="inline-block h-16 w-16 rounded-full bg-gray-500"
                                                        src={client?.image}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="text-3xl font-medium leading-6 text-gray-900">{client.name}</div>

                                            </div>


                                            <dl className="-my-3 divide-y divide-gray-100  text-sm leading-6 bg-slate-50 shadow-inner">
                                                <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
                                                    {client.metrics.map((metric) => (
                                                        <div key={metric.name} className="p-4">
                                                            <p className="text-xs font-semibold  text-gray-400 uppercase">{metric.name}</p>
                                                            <p className="mt-2 flex items-baseline gap-x-2">
                                                                <span className="text-lg font-bold tracking-tight text-gray-700">{metric.value}</span>
                                                                {metric.unit ? <span className="text-sm text-gray-400">{metric.unit}</span> : null}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </dl>
                                            {/* <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-slate-50 shadow-inner">
                                            <div className="flex flex-1 justify-between items-end gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <p className="uppercase text-xs font-semibold text-gray-400 leading-4">APY</p>
                                                    <p className="truncate text-lg font-bold text-gray-700 leading-4">9.7%</p>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <p className="uppercase text-xs font-semibold text-gray-400 leading-4">Boosted APY</p>
                                                    <p className="truncate text-lg font-bold text-gray-700 leading-4">11.26%</p>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <p className="uppercase text-xs font-semibold text-gray-400 leading-4">TVL</p>
                                                    <p className="truncate text-lg font-bold text-gray-700 leading-4">2.25M</p>
                                                </div>



                                            </div>
                                        </dl> */}
                                        </a>
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
