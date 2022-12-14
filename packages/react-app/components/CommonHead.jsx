import React from "react";
import Head from "next/head";

export const CommonHead = () => {
  return (
    <Head>
      <title>Cinch - Go-to-market solution for DeFi</title>
      <meta
        name="description"
        content="Cinch Protocol is b2b fee sharing infrastructure for web3. Non-custodial wallets turn user deposits into new and recurring revenue."
      />
      <link rel="icon" type="image/x-icon" href="cinch_logo.png"></link>
    </Head>
  );
};
