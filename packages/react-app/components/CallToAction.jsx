import Image from 'next/image'

import { Button } from '/components/Button'
import { Container } from '/components/Container'
import backgroundImage from '/images/background-call-to-action.jpg'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-gradient-to-r from-green-400 to-blue-500 py-32"
    >
      
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Have any question?
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            It’s time to take control of your currency.
          </p>
          <Button href="/register" color="white" className="mt-10">
            Get in touch
          </Button>
        </div>
      </Container>
    </section>
  )
}
