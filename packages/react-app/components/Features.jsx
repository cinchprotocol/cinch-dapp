/* This example requires Tailwind CSS v2.0+ */
import {
  ClockIcon,
  UserGroupIcon,
  LightningBoltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/outline";
import { Tabs } from "antd";

const protocolFeatures = [
  {
    name: "Acquire customers",
    description: "Cinch is a one-stop go-to-market partner to reach thousands of users.",
    icon: UserGroupIcon,
  },

  {
    name: "Grow TVL",
    description: "Getting access to platform users means more total-value-locked.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Get to market faster",
    description: "Access thousands of users with a single integration.",
    icon: LightningBoltIcon,
  },

  {
    name: "Sustainable growth",
    description: "Native token sell pressure and dilution are not required.",
    icon: KeyIcon,
  },
  ,
  {
    name: "Access everyday people",
    description: "Wallets are onboarding ordinary people, not just CT. Give them access to your products.",
    icon: ClockIcon,
  },

  {
    name: "Secure & efficient",
    description: "Cinch uses EIP-4626 to standardize onboarding and integrations.",
    icon: ShieldCheckIcon,
  },
];

const walletFeatures = [
  {
    name: "Monetize userbase",
    description: "Generate more revenue on existing users starting today.",
    icon: UserGroupIcon,
  },

  {
    name: "Recurring revenue",
    description: "Performance fees are annually recurring. This increases your customer lifetime value.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Higher profitability",
    description: "Sharing a protocol’s performance fees is more profitable than taking swap fees.",
    icon: LightningBoltIcon,
  },

  {
    name: "Easy and quick to implement",
    description: "Our guided approach makes integrations a breeze.",
    icon: KeyIcon,
  },
  ,
  {
    name: "No cost",
    description: "Cinch handles everything related to onboarding and integrating new protocols.",
    icon: ClockIcon,
  },

  {
    name: "Minimal risk",
    description: "Cinch contracts never hold user funds and we use EIP-4626.",
    icon: ShieldCheckIcon,
  },
];

export function Features() {
  const { TabPane } = Tabs;
  function callback(key) {
    console.log(key);
  }
  return (
    <div className="py-12 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <div className="text-center">
          <h2 className="text-lg text-blue-600 font-semibold">Payment infrastructure for smart contract integrations</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
            Incentivizing DeFi adoption.
          </p>
          {/* <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in
          accusamus quisquam.
        </p> */}
        </div>

        <div className="mt-10">
          <Tabs defaultActiveKey="1" onChange={callback} centered>
            <TabPane tab="Protocols" key="1">
              <ul
                role="list"
                className="mx-auto grid max-w-2xl grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
              >
                {protocolFeatures.map(feature => (
                  <li key={feature.name} className="p-6">
                    <div className="flex justify-center">
                      <feature.icon className="h-14 w-14 text-blue-500" />
                    </div>

                    <h3 className="mt-5 text-2xl text-center font-semibold text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-center text-gray-500">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </TabPane>
            <TabPane tab="Platforms" key="2">
              <ul
                role="list"
                className="mx-auto grid max-w-2xl grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:max-w-none lg:grid-cols-3"
              >
                {walletFeatures.map(feature => (
                  <li key={feature.name} className="p-6">
                    <div className="flex justify-center">
                      <feature.icon className="h-14 w-14 text-blue-500" />
                    </div>

                    <h3 className="mt-5 text-2xl text-center font-semibold text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-center text-gray-500">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </TabPane>
          </Tabs>

        </div>
      </div>
    </div>
  );
}
