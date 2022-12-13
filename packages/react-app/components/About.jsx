export function About() {
  return (
    <div id="about" className="relative py-16 bg-white overflow-hidden">
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
        <div className="relative h-full max-w-prose mx-auto" aria-hidden="true">
          <svg
            className="absolute top-12 left-full transform translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
          </svg>
          <svg
            className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
        </div>
      </div>
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-lg max-w-prose mx-auto">
          <h1>
            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What we’re building
            </span>
          </h1>
        </div>
        <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
          <h2>DeFi-as-a-service</h2>
          <p>
            Our mission is to put DeFi projects in front of millions of users. Cinch Protocol is the primary
            go-to-market tool for protocols and non-custodial investment platforms.
          </p>
          <p>
            Apps and platforms need ways to monetize user deposits. They are incentivized to put protocols that are
            willing to share revenue in front of their users. Cinch’s dApp provides smart contracts to implement fee
            sharing on chain.
          </p>
          <p>
            Protocol that uses Cinch Protocol will be able to quickly and easily get access to millions of users via the
            investment platforms that use our fee sharing infrastructure.
          </p>
          <p>
            Cinch will be the one stop go-to-market tool for FinTechs and protocols, like banking-as-a-service but for
            DeFi.
          </p>
          <div className="mt-10 sm:mt-12">
            <a
              href="https://tr61ro2oj6g.typeform.com/to/N5Oam3nb"
              target="blank"
              className="inline-flex items-center px-8 py-2 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Request Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
