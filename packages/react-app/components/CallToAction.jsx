// import Image from 'next/image'

import { Button } from "/components/Button";
import { Container } from "/components/Container";
import backgroundImage from "/images/background-call-to-action.jpg";

export function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-600">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Distribution for</span>
          <span className="block">decentralized applications.</span>
        </h2>
        {/*
        <p className="mt-4 text-lg leading-6 text-blue-200">
          We are vetting a short list of early customers to gather feedback. Reach out for more information.
        </p>
        */}
        <a
          href="https://tr61ro2oj6g.typeform.com/to/ZfxuAhXt"
          target="blank"
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
        >
          Join Network
        </a>
      </div>
    </div>
  );
}
