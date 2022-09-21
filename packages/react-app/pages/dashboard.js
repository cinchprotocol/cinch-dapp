import React, { useContext } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import { Container } from "/components/Container";
import { Contract } from "../components";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { Tabs } from "antd";

function Dashboard({ web3 }) {
  const address = "Ox";

  const { TabPane } = Tabs;
  function callback(key) {
    console.log(key);
  }

  return (
    <>

      <CommonHead />
      <DAppHeader web3={web3} />
      <Container>
        <main>

          <div className="mt-10 h-screen">
            <HeaderText01>Dashboard</HeaderText01>
            <div className="bg-slate-50 rounded-lg p-10 min-h-[50%]">
              {address ? (
                <div>
                  <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="For Sale" key="1">

                    </TabPane>
                    <TabPane tab="Sold" key="2">

                    </TabPane>
                    <TabPane tab="Bids" key="3">

                    </TabPane>
                    <TabPane tab="Bought" key="4">

                    </TabPane>
                  </Tabs>
                </div>
              ) : (
                <div class="grid place-items-center h-[70vh]">
                  <h2>"Please connect wallet with owner account"</h2>
                </div>
              )}
            </div>
          </div>
        </main>
      </Container>
      <Footer />

    </>
  );
}

export default Web3Consumer(Dashboard);