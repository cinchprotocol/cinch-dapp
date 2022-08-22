// import Image from 'next/image'

import { Button } from "/components/Button";
import { Container } from "/components/Container";
import logoLaravel from "/images/logos/laravel.svg";
import logoMirage from "/images/logos/mirage.svg";
import logoStatamic from "/images/logos/statamic.svg";
import logoStaticKit from "/images/logos/statickit.svg";
import logoTransistor from "/images/logos/transistor.svg";
import logoTuple from "/images/logos/tuple.svg";

export function Hero() {
  return (
    <Container className="pt-10 pb-16 text-center">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">

          <div className="lg:py-24">
            <span className="block text-sm font-semibold tracking-wide text-slate-500 sm:text-base lg:text-md">
              FOR PROTOCOLS & DAOs THAT GENERATE REVENUE
            </span>
            <h1 className="mt-4 text-4xl tracking-tight font-bold sm:mt-5 sm:text-6xl sm:tracking-tight lg:mt-6 xl:text-6xl xl:tracking-tight">
              <span className="text-slate-900">Reduce native token emissions, </span>
              <span className="text-blue-500">Grow TVL</span>
            </h1>
            <p className="mt-3 text-base text-slate-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-2xl">
              Leverage the token playbook without incurring native token dilution or sell pressure.
            </p>
            <div className="mt-10 sm:mt-12">
              <a
                href="https://tr61ro2oj6g.typeform.com/to/N5Oam3nb"
                target="blank"
                className="inline-flex items-center px-8 py-2 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
            {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
            <img
              className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
              src="/hero.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
