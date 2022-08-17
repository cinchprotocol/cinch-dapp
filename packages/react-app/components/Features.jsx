/* This example requires Tailwind CSS v2.0+ */
import { TrendingDownIcon, CurrencyDollarIcon, AdjustmentsIcon, ChartSquareBarIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Access capital with $0 collateral and 0% dilution',
    description:
      'Cinch’s network of buyers and secondary marketplace makes it possible to create custom and transferable revenue-share tokens (royalty tokens). Use royalty tokens instead of native tokens to protect your community from unwanted and unnecessary dilution.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Reduce native token sell pressure',
    description:
      'Some DEX liquidity is useful for price discovery, but constant sell pressure is extremely damaging to the native token price. Reduce excess token emissions that lead to sell pressure by issuing royalty tokens to short-term holders instead.',
    icon: ChartSquareBarIcon,
  },
  {
    name: 'Go-to-market leverage',
    description: 'Attracting customers is critically important to the long-term survival of projects. Custom and transferable royalty tokens give DAOs and projects a complementary tool with which to attract customers, form partnerships, and onboard investors.',
    icon: TrendingDownIcon,
  },

  {
    name: 'Use revenue to grow TVL',
    description:
      'Royalty tokens create a reward mechanism for a totally new set of potential investors and customers. Leverage a powerful new tool to broaden your customer base. Achieve product-market fit and reach critical scale as quickly as possible.',
    icon: AdjustmentsIcon,
  },
  ,
  {
    name: 'Protect your devs. We do all the work.',
    description: 'Your team is hard at work improving your product. We know because ours is too. Creating Value tokens or Royalty tokens can be done by a single team member simply by answering a few simple questions. The longest part of the process will be obtaining governance approval.',
    icon: TrendingDownIcon,
  },

  {
    name: 'The entire process takes 10 minutes.',
    description:
      'Web3 moves fast. Our solution allows DAOs and protocols to set up revenue-share token infrastructure in record time. Easily setup, mint, and manage revenue-share incentives via our dashboard.',
    icon: AdjustmentsIcon,
  },
]

export function Features() {
  return (
    <div className="bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <svg
          className="absolute top-0 left-full transform -translate-x-1/2 -translate-y-3/4 lg:left-auto lg:right-full lg:translate-x-2/3 lg:translate-y-1/4"
          width={404}
          height={784}
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="8b1b5f72-e944-4457-af67-0c6d15a99f38"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={784} fill="url(#8b1b5f72-e944-4457-af67-0c6d15a99f38)" />
        </svg>

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tools for DAOs
            </h2>
          </div>
          <dl className="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-0 lg:col-span-2">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
