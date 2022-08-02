import Image from 'next/image'

import { Button } from '/components/Button'
import { Container } from '/components/Container'
import backgroundImage from '/images/background-call-to-action.jpg'

export function CallToAction() {
  return (
    <div className="bg-indigo-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to dive in?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Connect with us for a free assessment on how revenue-share tokens can transform how you manage your treasury.
        </p>
        <a
          href="https://tr61ro2oj6g.typeform.com/to/N5Oam3nb"
          target="blank"
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
        >
          Get in touch
        </a>
      </div>
    </div>
  )
}
