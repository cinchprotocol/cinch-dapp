import React, { useContext } from "react";
import { CallToAction } from "/components/CallToAction";
import { Features } from "/components/Features";
import { Hero } from "/components/Hero";
import Head from "next/head";
import { Header } from "/components/Header";
import { Footer } from "/components/Footer";
import { About } from "/components/About";

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Cinch - Reward community, Grow treasury</title>
        <meta name="description" content="Reduce native token sell pressure by creating custom revenue-share tokens." />
      </Head>
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
        <About/>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
