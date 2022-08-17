/* This example requires Tailwind CSS v2.0+ */
import { TrendingDownIcon, CurrencyDollarIcon, AdjustmentsIcon, ChartSquareBarIcon } from '@heroicons/react/outline'



export function HowItWorks() {
    return (
        <div className="py-16 xl:py-36 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
            <div className="max-w-max lg:max-w-7xl mx-auto">
                <div className="relative z-10 mb-8 md:mb-2 md:px-6">
                    <div className="text-base max-w-prose lg:max-w-none">
                        <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
                            How it works
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
                            We give DAOs and protocols the tools to reach their full potential.
                        </p>
                        <p className='text-base text-gray-500'>
                            Cinch allows DAOs and projects to create ERC-20 tokens that represent the right to receive future revenue. Owners of these tokens will receive a fixed percentage of revenue until a maximum revenue is forwarded. The revenu-share will be implemented according to your preferred method, based on the use case
                        </p>
                        <div className="mt-10 lg:grid lg:grid-cols-2 lg:gap-6">
                            <div className="prose prose-blue prose-lg text-gray-500 lg:max-w-none">
                                <h2 className="text-lg leading-6 text-blue-600 font-semibold">Value Token</h2>
                                <ol role="list">
                                    <li>Each ERC-20 Value Token (VT) represents a fixed redeemable dollar value (example: $1.25/token)</li>
                                    <li>Each Value Token entitles the holder to receive the fixed redeemable dollar value</li>
                                    <li>A Uniswap v3 liquidity pair will be created between the Value Token and a liquid stablecoin</li>
                                    <li>The DAO or protocol commits to allocating a fixed proportion of revenue to repurchasing the Value Token from the liquidity pool on a weekly or monthly basis</li>
                                    <li>Holders of the VT that want immediate liquidity can sell into the liquidity pool, thus making the VT more affordable for repurchase for the DAO or protocol</li>
                                    <li>Holders of the VT that hold until all liquidity in the pool is purchase will receive the fixed redeemable dollar value directory from the DAO or protocol</li>
                                    <li>The DAO or protocol cannot alter the revenue allocation until all VTs are repurchased and burned.</li>
                                </ol>
                                <p>
                                    Use case: replace native token emission to minimize dilution and sell pressure
                                </p>
                            </div>
                            <div className="mt-6 prose prose-blue prose-lg text-gray-500 lg:mt-0">
                                <h2 className="text-lg leading-6 text-blue-600 font-semibold">Rotalty Token</h2>
                                <ol role="list">
                                    <li>  Each Royalty Token (RT)  represents a portion of revenue-share</li>
                                    <li>Holders of Royalty Tokens will receive a fixed proportion of DAO or protocol revenue on a recurring basis (weekly or monthly), until a maximum amount.</li>
                                    <li>When the maximum amount of revenue will have been forwarded, the revenue-share will end and the RTs will get burned.</li>
                                </ol>
                                <p>
                                    Use case: TVL growth via customer incentives and investor onboarding
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
