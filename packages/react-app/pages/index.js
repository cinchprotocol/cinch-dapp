import React, { useContext } from "react";
import { CallToAction } from "/components/CallToAction";
import { Features } from "/components/Features";
import { Hero } from "/components/Hero";
import Head from "next/head";
import { Header } from "/components/Header";
import { Footer } from "/components/Footer";
const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Cinch - Non-dilutive currency for web3</title>
        <meta name="description" content="Cinch turns revenue-sharing agreements into transferable ERC-20 tokens." />
      </Head>
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
