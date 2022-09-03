import React, { useContext } from "react";
import { Web3Consumer } from "../helpers/Web3Context";

import { Contract, Account } from "../components";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

function Home({ web3 }) {
  console.log(`🗄 web3 context:`, web3);

  return (
    <>
      <CommonHead />
      <DAppHeader />
      <main>
        <div className="flex flex-1 justify-between items-center">
          <div className="mr-6">
            <Account {...web3} />
          </div>
        </div>

        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>dApp home page</HeaderText01>
            <br />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(Home);
