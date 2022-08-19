/* This example requires Tailwind CSS v2.0+ */
import { ClockIcon, AdjustmentsIcon, TrendingUpIcon, CurrencyDollarIcon, ViewGridAddIcon, ChartSquareBarIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Access capital with $0 collateral and 0% dilution',
    description:
      'Cinch’s network of buyers and secondary marketplace makes it possible to create custom and transferable revenue-share tokens. Use revenue-share tokens instead of native tokens to protect your community from unwanted and unnecessary dilution.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Reduce native token sell pressure',
    description:
      'Some DEX liquidity is useful for price discovery, but constant sell pressure is extremely damaging to the native token price. Reduce excess token emissions that lead to sell pressure by issuing revenue-share tokens to short-term holders instead.',
    icon: ChartSquareBarIcon,
  },
  {
    name: 'Go-to-market leverage',
    description: 'Attracting customers is critically important to the long-term survival of projects. Custom and transferable revenue-share tokens give DAOs and projects a complementary tool with which to attract customers, form partnerships, and onboard investors.',
    icon: AdjustmentsIcon,
  },

  {
    name: 'Use revenue to grow TVL',
    description:
      'Revenue-share tokens create a reward mechanism for a totally new set of potential investors and customers. Leverage a powerful new tool to broaden your customer base. Achieve product-market fit and reach critical scale as quickly as possible.',
    icon: TrendingUpIcon,
  },
  ,
  {
    name: 'Save developer bandwidth',
    description: 'Web3 moves fast and your team is hard at work improving your product. We know because ours is too. Creating Value Tokens or Royalty Tokens can be done by a single team member thanks to Cinch\'s integrated infrastructure. The longest part of the process will be obtaining governance approval.',
    icon: ClockIcon,
  },

  {
    name: 'Seamless onboarding',
    description:
      'Our solution allows DAOs and protocols to set up revenue-share token infrastructure in record time simply by answering a few simple questions. Easily setup, mint, and manage revenue-share tokens via our dashboard.',
    icon: ViewGridAddIcon,
  },
]

export function Features() {
  return (
    <div className="py-12 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-lg text-blue-600 font-semibold">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
            Customizable and transferrable ERC-20 revenue-share tokens.
          </p>
          {/* <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in
          accusamus quisquam.
        </p> */}
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
