import React, { useContext } from "react";
import { CallToAction } from "/components/CallToAction";
import { UseCases } from "/components/UseCases";
import { Features } from "/components/Features";
import { HowItWorks } from "/components/HowItWorks";
import { Hero } from "/components/Hero";
import Head from "next/head";
import { Header } from "/components/Header";
import { Footer } from "/components/Footer";
import { About } from "/components/About";

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Cinch - Go-to-market solution for DeFi</title>
        <meta
          name="description"
          content="Cinch Protocol is b2b fee sharing infrastructure for web3. Non-custodial wallets turn user deposits into new and recurring revenue."
        />
      </Head>
      <Header />
      <main>
        <Hero />
       
        <UseCases />
        <Features />
        <HowItWorks />
       
       
        <CallToAction />
        <About />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
