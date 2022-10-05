/* This example requires Tailwind CSS v2.0+ */
import { TrendingDownIcon, CurrencyDollarIcon, AdjustmentsIcon, ChartSquareBarIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { Disclosure } from '@headlessui/react'

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
    return (
        <div className="py-16 xl:py-36 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden" data-aos="fade-up">
            <div className="max-w-max lg:max-w-7xl mx-auto">
                <div className="relative z-10 mb-8 md:mb-2 md:px-6">
                    <div className="text-base max-w-prose lg:max-w-none">
                        <h2 className="text-lg text-blue-600 font-semibold">How it Works</h2>
                        <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
                            Tools for DAOs & Protocols to reach their full potential.
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <svg
                        className="hidden md:block absolute top-0 right-0 -mt-20 -mr-20"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="95e8f2de-6d30-4b7e-8159-f791729db21b"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width={404} height={384} fill="url(#95e8f2de-6d30-4b7e-8159-f791729db21b)" />
                    </svg>
                    <svg
                        className="hidden md:block absolute bottom-0 left-0 -mb-20 -ml-20"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="7a00fe67-0343-4a3c-8e81-c145097a3ce0"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width={404} height={384} fill="url(#7a00fe67-0343-4a3c-8e81-c145097a3ce0)" />
                    </svg>
                    <div className="relative md:bg-white md:p-6">
                        <p className='text-base text-gray-500'>
                            Cinch allows DAOs and projects to create ERC-20 tokens that represent the right to receive future revenue. Owners of these tokens will receive a fixed percentage of revenue until a maximum revenue is forwarded. The revenue-share will be implemented according to your preferred method, based on the use case.
                        </p>
                        <div className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10">
                            <div className="text-gray-500 lg:max-w-none bg-slate-50 p-10 rounded-2xl shadow-md">
                                <h2 className="text-2xl leading-6 text-blue-600 font-semibold">IOU Token</h2>
                                <p className='mt-5 text-base'>
                                    A promise to pay that has instant liquidity.
                                </p>
                                <dl className="space-y-6 divide-y divide-gray-200">
                                    {valTokenHowItWorks.map((faq) => (
                                        <Disclosure as="div" key={faq.question} className="pt-6">
                                            {({ open }) => (
                                                <>
                                                    <dt className="text-lg">
                                                        <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                                            <span className="font-medium text-gray-900">{faq.question}</span>
                                                            <span className="ml-6 h-7 flex items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </dt>
                                                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                                        <p className="text-base text-gray-500">{faq.answer}</p>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </dl>
                            </div>
                            <div className="text-gray-500 lg:mt-0 bg-slate-50 p-10 rounded-2xl shadow-md">
                                <h2 className="text-2xl leading-6 text-blue-600 font-semibold">Royalty Token</h2>
                                <p className='mt-5 text-base'>
                                    Recurring revenue-share payments.
                                </p>
                                <dl className="space-y-6 divide-y divide-gray-200">
                                    {royaltyTokenHowItWorks.map((faq) => (
                                        <Disclosure as="div" key={faq.question} className="pt-6">
                                            {({ open }) => (
                                                <>
                                                    <dt className="text-lg">
                                                        <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                                            <span className="font-medium text-gray-900">{faq.question}</span>
                                                            <span className="ml-6 h-7 flex items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </dt>
                                                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                                        <p className="text-base text-gray-500">{faq.answer}</p>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
