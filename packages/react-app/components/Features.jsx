/* This example requires Tailwind CSS v2.0+ */
import {
  ClockIcon,
  UserGroupIcon,
  LightningBoltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/outline";

const features = [
  {
    name: "Acquire customers",
    description:
      "Share protocol fees to gain customers. FinTech companies need to monetize their non-custodial wallets.",
    icon: UserGroupIcon,
  },

  {
    name: "Grow TVL",
    description: "More users means more TVL.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Get to market faster",
    description: "Access thousands of users with a single integration.",
    icon: LightningBoltIcon,
  },

  {
    name: "Sustainability is key",
    description: "Native tokens and dilution are not required.",
    icon: KeyIcon,
  },
  ,
  {
    name: "Access everyday users",
    description:
      "FinTech platforms are already onboarding ordinary people, not just the crowd from CT. Give them access to your products.",
    icon: ClockIcon,
  },

  {
    name: "Secure & efficient",
    description: "We use EIP-4626 to standardize onboarding of protocols and FinTech partners.",
    icon: ShieldCheckIcon,
  },
];

export function Features() {
  return (
    <div className="py-12 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <div className="text-center">
          <h2 className="text-lg text-blue-600 font-semibold">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
            Cinch Protocol puts amazing DeFi products in front of everyday people.
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
            {features.map(feature => (
              <li key={feature.name} className="p-6">
                <div className="flex justify-center">
                  <feature.icon className="h-14 w-14 text-blue-500" />
                </div>

                <h3 className="mt-5 text-2xl text-center font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-center text-gray-500">{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
