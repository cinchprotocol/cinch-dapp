import React, { useContext } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import Head from "next/head";

import { Contract, Account } from "../components";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";

function Dashboard({ web3 }) {
  console.log(`🗄 web3 context:`, web3);

  return (
    <>
      <Head>
        <title>Cinch - Reward community, Grow treasury</title>
        <meta name="description" content="Reduce native token sell pressure by creating custom revenue-share tokens." />
      </Head>
      <DAppHeader />
      <main>
        <div className="flex flex-1 justify-between items-center">
          <div className="mr-6">
            <Account {...web3} />
          </div>
        </div>

        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <span>Dashboard</span>
            <br />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(Dashboard);
