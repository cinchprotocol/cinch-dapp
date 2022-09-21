/* This example requires Tailwind CSS v2.0+ */
import { ClockIcon, UserGroupIcon, LightningBoltIcon, CurrencyDollarIcon, ShieldCheckIcon, BanIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Acquire customers',
    description: 'Incentivize customers with rewards that do not cause sell pressure or dilution.',
    icon: UserGroupIcon,
  },

  {
    name: 'Reward stakeholders',
    description:
      'Issue a token that derives its value from your revenue, not from your future equity value.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'End native token sell pressure',
    description:
      'Revenue tokens can replace native token emissions across every single use case.',
    icon: BanIcon,
  },

  {
    name: 'Instant liquidity',
    description:
      'We create a Uniswap v3 liquidity pool for your revenue tokens.',
    icon: LightningBoltIcon,
  },
  ,
  {
    name: 'Save developer bandwidth',
    description: 'Our guided approach will make issuing revenue token a breeze.',
    icon: ClockIcon,
  },

  {
    name: 'Safeguard treasury assets',
    description:
      'You may very well never have to spend treasury funds or issue native tokens again.',
    icon: ShieldCheckIcon,
  },
]

export function Features() {
  return (
    <div className="py-12 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <div className="text-center">
          <h2 className="text-lg text-blue-600 font-semibold">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
            Cinch Protocol is a trustless way to create and trade revenue tokens.
          </p>
          {/* <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in
          accusamus quisquam.
        </p> */}
        </div>

        <div className="mt-10">
          <ul
            role="list"
            className="mx-auto grid max-w-2xl grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
          >
            {features.map((feature) => (
              <li
                key={feature.name}
                className="p-6"
              >
                <div className='flex justify-center'>
                  <feature.icon className="h-14 w-14 text-blue-500" />
                </div>

                <h3 className="mt-5 text-2xl text-center font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-center text-gray-500">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
