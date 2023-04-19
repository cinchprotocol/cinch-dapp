/* This example requires Tailwind CSS v2.0+ */
import { TrendingDownIcon, CurrencyDollarIcon, AdjustmentsIcon, ChartSquareBarIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { Disclosure } from '@headlessui/react'
import { Tabs } from "antd";

const valTokenHowItWorks = [
    {
        question: "1. Choose redeemable value",
        answer:
            "Each ERC-20 IOU Token represents a fixed redeemable dollar value (example: $1.25/token). IOU Token entitles the holder to receive the fixed redeemable dollar value from the issuing protocol.",
    },
    {
        question: "2. Setup recurring DEX purchases",
        answer:
            "A Uniswap v3 liquidity pair will be created between the IOU Token and a liquid stablecoin. The DAO or protocol commits to using a fixed proportion of revenue to perform automatic repurchases from the Liquidity Pool on a weekly or monthly basis. The DAO or protocol cannot stop the automatic purchases from the liquidity pool until all IOU Tokens are repurchased and burned.",
    },
    {
        question: "3. Trade for liquidity or hold for yield",
        answer:
            "Holders of the IOU Token that want immediate liquidity can sell into the liquidity pool, thus making the IOU Token more affordable for repurchase. IOU Token owners that hold until all liquidity in the pool is repurchased will receive the fixed redeemable dollar value.",
    },
    {
        question: "Use case",
        answer:
            "Replace native token emission.",
    },
]

const royaltyTokenHowItWorks = [
    {
        question: "1. Choose Royalty Token inputs",
        answer:
            "Each Royalty Token represents a portion of revenue-share.",
    },
    {
        question: "2. Specify expiration criteria",
        answer:
            "Holders of Royalty Tokens will receive a fixed proportion of DAO or protocol revenue on a recurring basis (weekly or monthly), until a maximum amount. After which the Royalty Tokens get burned.",
    },
    {
        question: "3. Create value for your customers",
        answer:
            "Increase in DAO or protocol revenue generation creates faster repayment. Decrease in revenue generation results in slower repayment.",
    },
    {
        question: "Use case",
        answer:
            "Grow TVL and onboard investors.",
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function HowItWorks() {
    const { TabPane } = Tabs;
    function callback(key) {
        console.log(key);
    }

    return (
        <div className="py-16 xl:py-36 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden" data-aos="fade-up">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-base font-semibold leading-7 text-blue-600 text-center">How it works</h2>
                <Tabs defaultActiveKey="1" onChange={callback} centered size="large">
                    <TabPane tab="Protocols" key="1">
                        <div className="p-4 mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Accelerate growth in 3 easy steps</p>
                                <p className="mt-6 text-base leading-7 text-gray-600">
                                    to get listed on Cinch's referral network.
                                </p>
                            </div>
                            <div>
                                <div className='bg-slate-100 font-semibold text-lg p-6 rounded-xl shadow-lg'>
                                    1. Request to Join Network
                                </div>
                                <div className='mt-8 bg-slate-100 font-semibold text-lg p-6 rounded-xl shadow-lg'>
                                    2. Select referral amounts
                                </div>
                                <div className='mt-8 bg-slate-100 font-semibold text-lg p-6 rounded-xl shadow-lg'>
                                    3.  Choose implementation method
                                </div>
                            </div>

                        </div>
                    </TabPane>
                    <TabPane tab="Platforms" key="2">
                        <div className="p-4 mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Monetize DeFi in 3 easy steps</p>
                                <p className="mt-6 text-base leading-7 text-gray-600">
                                    to get listed on Cinch's referral network.
                                </p>
                            </div>
                            <div>
                                <div className='bg-slate-100 font-semibold text-lg p-6 rounded-xl shadow-lg'>
                                    1.  Select your favorite DeFi partnership opportunity
                                </div>
                                <div className='mt-8 bg-slate-100 font-semibold text-lg p-6 rounded-xl shadow-lg'>
                                    2. Easy integrations thanks to purpose-built infrastructure (standardized for all products in Cinch’s marketplace)

                                </div>
                                <div className='mt-8 bg-slate-100 font-semibold text-lg p-6 rounded-xl shadow-lg'>
                                    3.  Track referral revenue and manage all affiliate partnerships from the Cinch dashboard

                                </div>
                            </div>

                        </div>
                    </TabPane>
                </Tabs>


            </div>
        </div>
    )
}
