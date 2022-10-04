import React, { useState, useEffect } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import { Container } from "/components/Container";
import { Contract } from "../components";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { Tabs } from "antd";
import { getAllRevenueStreamForSale, getAllBids } from "../helpers/marketplacehelper";
import RevenueStreamTable from "/components/RevenueStreamTable";
import BidTable from "/components/BidTable";
const { constants } = require("ethers");

function Dashboard({ web3 }) {
  const address = web3?.address;
  const [allRevenueStream, setAllRevenueStream] = useState([]);
  const [revenueStreamsForSale, setRevenueStreamsForSale] = useState([]);
  const [revenueStreamsSold, setrevenueStreamsSold] = useState([]);
  const [revenueStreamsBought, setRevenueStreamsBought] = useState([]);
  const [bids, setBids] = useState([]);

  const reloadData = async () => {
    const allRevenueStreamsForSale = await getAllRevenueStreamForSale(web3);
    setAllRevenueStream(allRevenueStreamsForSale);
    const _revenueStreamsForSale = allRevenueStreamsForSale?.filter(
      s => s?.seller === address && s?.buyer === constants.AddressZero,
    );
    setRevenueStreamsForSale(_revenueStreamsForSale);
    const _revenueStreamsSold = allRevenueStreamsForSale?.filter(
      s => s?.seller === address && s?.buyer !== constants.AddressZero,
    );
    setrevenueStreamsSold(_revenueStreamsSold);
    const _revenueStreamsBought = allRevenueStreamsForSale?.filter(s => s?.buyer === address);
    setRevenueStreamsBought(_revenueStreamsBought);

    const allBidsPlaced = await getAllBids(web3);
    const _bidsPlaced = allBidsPlaced?.filter(b => b?.bidder === address && b?.stream?.buyer === constants.AddressZero);
    const _bidsReceived = allBidsPlaced?.filter(
      b => b?.stream?.seller === address && b?.stream?.buyer === constants.AddressZero,
    );
    setBids([..._bidsPlaced, ..._bidsReceived]);
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

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
                      <RevenueStreamTable dataSource={revenueStreamsForSale} mode="ForSale" />
                    </TabPane>
                    <TabPane tab="Sold" key="2">
                      <RevenueStreamTable dataSource={revenueStreamsSold} mode="Sold" />
                    </TabPane>
                    <TabPane tab="Bids" key="3">
                      <BidTable web3={web3} dataSource={bids} mode="Bids" />
                    </TabPane>
                    <TabPane tab="Bought" key="4">
                      <RevenueStreamTable dataSource={revenueStreamsBought} mode="Bought" />
                    </TabPane>
                  </Tabs>
                </div>
              ) : (
                <div className="grid place-items-center h-[70vh]">
                  <h2>Please connect wallet with owner account</h2>
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
