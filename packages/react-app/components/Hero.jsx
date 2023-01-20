import { Container } from "/components/Container";
import { TextLoop } from "react-text-loop-next";

export function Hero() {
  return (
    <div className="pb-10 bg-slate-50">
      <Container>
        <div className="lg:grid lg:grid-cols-12" data-aos="fade-up">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center lg:col-span-6">
            <div className="lg:py-24">
              <span className="block text-sm font-semibold tracking-wide text-slate-500 sm:text-base lg:text-md">
                REVENUE-SHARE PAYMENT INFRASTRUCTURE
              </span>
              <h1 className="mt-2 text-4xl tracking-tight font-bold sm:text-6xl sm:tracking-tight xl:text-6xl xl:tracking-tight">
                <span className="text-slate-900">Connecting </span>
                <span className="text-blue-500">DeFi </span>
                <span className="text-slate-900">to </span>
                <TextLoop interval={2000} className="text-blue-500">
                  <span>digital wallets</span>
                  <span>investment platforms</span>
                  <span>personal finance apps</span>
                  <span>finTech platforms</span>
                </TextLoop>
              </h1>
              <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Start generating revenue today.
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
          <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative lg:col-span-6">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
              {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
              <img
                className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                src="/hero.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
