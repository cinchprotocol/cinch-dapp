import { CheckIcon as CheckIconSolid, ChevronDownIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { Table, Space, Row, Col } from "antd";

import outletLogo from "/images/logos/outlet_logo_01.png";
import stablecorpLogo from "/images/logos/stablecorp_logo_01.png";

export function UseCases() {
  return (
    <div className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <div className="lg:text-center">
          
          <h2 className="text-lg font-semibold text-blue-600">Who we work with </h2>
           
          <span className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Cinch Protocol powers the best in web3
          </span>
          {/*
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Cinch Protocol is putting DeFi in front of thousands of everyday people.
          </p>
            */}
        </div>
        <div className="mt-10">
          <ul
            role="list"
            className="mx-auto grid max-w-2xl grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:max-w-none lg:grid-cols-2"
          >
            <li key="outlet" className="p-6">
              <div className="flex justify-center">
                <a target="_blank" href="https://outlet.finance/" rel="noreferrer">
                  <Image src={outletLogo} />
                </a>
              </div>
            </li>
            <li key="stablecorp" className="p-6">
              <div className="flex justify-center">
                <a target="_blank" href="https://app.idle.finance/#/tranches/clearpool/USDC" rel="noreferrer">
                  <Image src={stablecorpLogo} />
                </a>
              </div>
            </li>
          </ul>
        </div>
        {/*
        <div className="mt-10">
          <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="absolute h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                  Non-dilutive to native tokens (i.e. equity)
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Issuing revenue tokens does not reduce the entire community’s ownership in the project.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="absolute h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                  Compensation mechanism for people who don’t share the long-term vision.
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                A new way to compensate stakeholders that cause sell pressure.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="absolute h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                  {" "}
                  Make untradable assets tradable (i.e., royalties).
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Turn stranded assets into tradeable tokens used to reduce risk.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                  <svg
                    className="absolute h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                  {" "}
                  Create unique incentives to attract large customers
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                A differentiated set of incentives for institutional capital.
              </dd>
            </div>
          </dl>
        </div>
  */}
      </div>
    </div>
  );
}
