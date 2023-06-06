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
import { formatNumber } from "/helpers/utils";
import CopyToClipboard from "/components/CopyToClipboardButton";
import {
    useBalance,
    useContractLoader,
    useContractReader,
    useGasPrice,
    useOnBlock,
    useUserProviderAndSigner,
} from "eth-hooks";

function Vault({ web3 }) {
    const usdcERC20Decimals = 6;
    const pollTime = 500;
    const { TabPane } = Tabs;
    var ribbonProductTVL = ethers.utils.formatUnits(useContractReader(web3.readContracts, 'MockProtocolRibbonEarn', 'totalBalance', [], pollTime) ?? 0, usdcERC20Decimals);
    ribbonProductTVL = formatNumber(ribbonProductTVL, 2);

    const stETHSvg = <span><svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" height="100%"><path d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z" fill="#00A3FF" fill-opacity="0.12"></path><path d="M16.5666 25.9769L16.2466 26.4679C12.6375 32.0043 13.4435 39.2549 18.1844 43.9002C20.9735 46.633 24.629 47.9996 28.2844 48C28.2844 48 28.2844 48 16.5666 25.9769Z" fill="#00A3FF"></path><path opacity="0.6" d="M28.282 32.6703L16.5641 25.9769C28.282 48 28.282 48 28.282 48C28.282 43.2036 28.282 37.7074 28.282 32.6703Z" fill="#00A3FF"></path><path opacity="0.6" d="M40.0148 25.9769L40.3348 26.4679C43.9439 32.0043 43.1379 39.2549 38.397 43.9002C35.6079 46.633 31.9525 47.9996 28.297 48C28.297 48 28.297 48 40.0148 25.9769Z" fill="#00A3FF"></path><path opacity="0.2" d="M28.2958 32.6703L40.0137 25.9769C28.2959 48 28.2958 48 28.2958 48C28.2958 43.2036 28.2958 37.7074 28.2958 32.6703Z" fill="#00A3FF"></path><path opacity="0.2" d="M28.3 17.7188V29.263L38.3937 23.4947L28.3 17.7188Z" fill="#00A3FF"></path><path opacity="0.6" d="M28.297 17.7188L18.196 23.4945L28.297 29.263V17.7188Z" fill="#00A3FF"></path><path d="M28.297 8.00839L18.196 23.4964L28.297 17.7045V8.00839Z" fill="#00A3FF"></path><path opacity="0.6" d="M28.3 17.7036L38.4014 23.4957L28.3 8V17.7036Z" fill="#00A3FF"></path></svg></span>;
    const usdcSvg = <span><svg xmlns="http://www.w3.org/2000/svg" data-name="86977684-12db-4850-8f30-233a7c267d11" viewBox="0 0 2000 2000">
        <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775ca" />
        <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#fff" />
        <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#fff" />
    </svg></span>
    const ethSvg = <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA" /><g fill="#FFF" fill-rule="nonzero"><path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z" /><path d="M16.498 4L9 16.22l7.498-3.35z" /><path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z" /><path d="M16.498 27.995v-6.028L9 17.616z" /><path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" /><path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z" /></g></g></svg></span>
    const tetherSvg = <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000"><path d="M1000,0c552.26,0,1000,447.74,1000,1000S1552.24,2000,1000,2000,0,1552.38,0,1000,447.68,0,1000,0" fill="#53ae94" /><path d="M1123.42,866.76V718H1463.6V491.34H537.28V718H877.5V866.64C601,879.34,393.1,934.1,393.1,999.7s208,120.36,484.4,133.14v476.5h246V1132.8c276-12.74,483.48-67.46,483.48-133s-207.48-120.26-483.48-133m0,225.64v-0.12c-6.94.44-42.6,2.58-122,2.58-63.48,0-108.14-1.8-123.88-2.62v0.2C633.34,1081.66,451,1039.12,451,988.22S633.36,894.84,877.62,884V1050.1c16,1.1,61.76,3.8,124.92,3.8,75.86,0,114-3.16,121-3.8V884c243.8,10.86,425.72,53.44,425.72,104.16s-182,93.32-425.72,104.18" fill="#fff" /></svg></span>

    const tokenSvgMap = {
        USDC: usdcSvg,
        ETH: ethSvg,
        stETH: stETHSvg,
        USDT: tetherSvg,
    };

    const badgeComingSoon = <span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        <svg className="h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
        </svg>
        Coming soon
    </span>

    const badgeActive = <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
        </svg>
        Active
    </span>

    const vaultList = [
        {
            id: 1,
            name: 'Ribbon R-EARN',
            vaultUrl: '/vault/ribbon-r-earn',
            metrics: [{ name: 'Boosted APY', value: '11.3%' }, { name: 'Referral APY', value: '1.6%' }, { name: ' TVL', value: ribbonProductTVL, unit: 'USDC' }],
            token: 'USDC',
            image: '/ribbon_logo_1.png',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Metrix Fund 1',
            vaultUrl: '#',
            metrics: [{ name: '3M Returns', value: '9.6%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$51.9K' }],
            token: 'USDC',
            image: '/metrixIcon.png',
            status: 'Comingsoon'
        },
        {
            id: 3,
            name: 'Ribbon stETH',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '11.3%' }, { name: 'Referral APY', value: '1.6%' }, { name: 'TVL', value: '2.28K', unit: 'stETH' }],
            token: 'stETH',
            image: '/ribbon_logo_1.png',
            status: 'Comingsoon'
        },
        {
            id: 4,
            name: 'Toros USD Delta Neutral',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '11.1%' }, { name: 'Referral APY', value: '0.3%' }, { name: 'TVL', value: '$1.7M' }],
            token: 'USDC',
            image: '/toroslogo.png',
            status: 'Comingsoon'
        },
        {
            id: 4,
            name: 'Toros Ethereum Yield',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '14.6%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$1.6M' }],
            token: 'ETH',
            image: '/toroslogo.png',
            status: 'Comingsoon'
        },
        {
            id: 5,
            name: 'Idle USDT Clearpool Fasanara',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '7.6%' }, { name: 'Referral APY', value: '0.7%' }, { name: 'TVL', value: '$1.95M' }],
            token: 'USDT',
            image: '/idle_logo_01.png',
            status: 'Comingsoon'
        },
        {
            id: 6,
            name: 'BENQI AVAX Liquid Staking',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '7.2%' }, { name: 'Referral APY', value: '1.0%' }, { name: 'TVL', value: '$94.3M' }],
            token: 'USDC',
            image: '/Benqi_logo.png',
            status: 'Comingsoon'
        },
        {
            id: 7,
            name: 'Pendle PT USDT Pool',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '13.5%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$2.6M' }],
            token: 'USDT',
            image: '/Pendle_logo.jpeg',
            status: 'Comingsoon'
        },
        {
            id: 8,
            name: 'Sommelier Real Yield ETH',
            vaultUrl: '#',
            metrics: [{ name: 'Boosted APY', value: '13.3%' }, { name: 'Referral APY', value: '1.5%' }, { name: 'TVL', value: '$8.0M' }],
            token: 'ETH',
            image: '/Sommelier_logo.png',
            status: 'Comingsoon'
        },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="bg-slate-50 pb-10">
            <>
                <CommonHead />
                <DAppHeader web3={web3} />

                <div>
                    <Container className="min-h-screen">
                        <div className="md:flex md:items-center md:justify-between border-b border-gray-200">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Explore products</h1>
                        </div>

                        <div className="mt-10">
                            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
                                {vaultList.map((vault) => (
                                    <li key={vault.id} className="overflow-hidden rounded-xl shadow-xl bg-white">
                                        <a href={vault.vaultUrl}>
                                            <div className="flex flex-row-reverse text-right p-2">

                                                <div>
                                                    {vault.status == "Active" ? badgeActive : badgeComingSoon}
                                                </div>
                                                <div className="inline-block h-7 w-7 rounded-full mr-4">
                                                    {tokenSvgMap[vault.token]}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 px-6 pt-6 pb-14">
                                                <img
                                                    className="h-16 w-16 rounded-full bg-gray-100"
                                                    src={vault?.image}
                                                    alt=""
                                                />
                                                <div className="text-2xl font-medium leading-6 text-gray-900">{vault.name}</div>

                                            </div>


                                            <dl className="-my-3 divide-y divide-gray-100  text-sm leading-6 bg-slate-50 shadow-inner">
                                                <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
                                                    {vault.metrics.map((metric) => (
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
