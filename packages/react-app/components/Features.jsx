/* This example requires Tailwind CSS v2.0+ */
import { GlobeAltIcon, LightningBoltIcon, MailIcon, ScaleIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Access capital with $0 collateral and 0% dilution',
    description:
      'Cinch’s marketplace makes it possible to trade future revenue for capital today. No collateral required.',
    icon: LightningBoltIcon,
  },
  {
    name: 'Reduce native token sell pressure',
    description:
      'Some DEX liquidity is useful for price discovery, but constant sell pressure is extremely damaging to the token price. Reduce excess token emissions that lead to sell pressure.',
    icon: ScaleIcon,
  },
  {
    name: 'Preserve native tokens during a bear market',
    description: 'Your treasury has a finite amount of tokens. Force selling tokens at all-time lows is painful. Preserve tokens and minimize dilution with Cinch by minting and issuing revenue tokens instead.',
    icon: GlobeAltIcon,
  },

  {
    name: 'Flexibility & control',
    description:
      'Choose how much future revenue to tokenize. Choose how the tokens get distributed. Track & view token analytics.',
    icon: MailIcon,
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
              A better way to manage your treasury.
            </h2>
          </div>
          <dl className="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-0 lg:col-span-2">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
