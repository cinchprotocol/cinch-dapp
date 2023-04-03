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
          <h2 className="text-lg text-blue-600 font-semibold">What we’re building</h2>
        </div>
        <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
          <h2>The referral payment network for decentralized applications</h2>
          <p>
            The financial products most widely adopted in the world have one key ingredient: distribution.
          </p>
          <p>
            Distribution is a major problem for decentralized applications. dApps have literally no distribution channels. As a result, too few people have access to decentralized applications.

          </p>
          <p>
            FinTech apps and investment platforms are the perfect distribution partners. The problem is, they will only offer products to their users that they can monetize properly.


          </p>
          <p>
            Cinch uses smart contracts to automate and standardize referral payments between decentralized applications and distribution partners. This creates a powerful incentive for potential distribution partners and greatly simplifies the integration process.

          </p>
          <p>
            <p>
              Joining Cinch’s network of distribution partners requires no integration or developer resources.

            </p>
          </p>
          <div className="mt-10 sm:mt-12">
            <a
              href="https://tr61ro2oj6g.typeform.com/to/ZfxuAhXt"
              target="blank"
              className="inline-flex items-center px-8 py-2 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Join Network
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
