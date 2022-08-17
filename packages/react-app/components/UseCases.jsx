/* This example requires Tailwind CSS v2.0+ */
import { TrendingDownIcon, CurrencyDollarIcon, AdjustmentsIcon, ChartSquareBarIcon } from '@heroicons/react/outline'
import { CheckIcon as CheckIconSolid, ChevronDownIcon } from '@heroicons/react/solid'
const tiers = [

    {
        name: 'Grow TVL [royalty tokens]',
        href: '#',
        description: 'All the basics for starting a new business',
        features: [
            'Issue royalty tokens to potential institutional customers',
            'Temporary fee reimbursements for new users',
            'Time-bound revenue-share for next 100 customers',
            'Issue revenue-share tokens as a reward for referrals',
            'Reward integration partners with revenue-share tokens'
        ],
    },
    {
        name: 'Replace emissions [value tokens]',
        href: '#',
        description: 'All the basics for starting a new business',
        features: [
            'Issue value tokens to liquidity providers',
            'Issue value tokens as bounty rewards',
            'Issue value tokens to part-time contributors',
            'Issue value tokens to DAO contributors',
            'Issue value tokens to governance participants and voters'
        ],
    }
]
export function UseCases() {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50 pb-20">
            <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:flex-col sm:align-center">
                    <h1 className="text-5xl tracking-tight font-bold text-gray-900 sm:text-center">Use Cases</h1>
                    <p className="mt-5 text-xl text-gray-500 sm:text-center">
                        Start building for free, then add a site plan to go live. Account plans unlock additional features.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10">
                    {tiers.map((tier) => (
                        <div key={tier.name} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                            <div className="p-6">
                                <h2 className="text-2xl leading-6 font-medium text-gray-900">{tier.name}</h2>
                                {/* <p className="mt-4 text-sm text-gray-500">{tier.description}</p> */}
                                <ul role="list" className="mt-6 space-y-4">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex space-x-3">
                                            <CheckIconSolid className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                                            <span className="text-sm text-gray-500">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
