import React from "react";
import { Web3Consumer } from "../helpers/Web3Context";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

function RevenueStreamsForSale({ web3 }) {
  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Select revenue steam</HeaderText01>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button href="/investidlefinance" color="blue">
              <div>
                <span>Idle Finance</span>
              </div>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueStreamsForSale);
