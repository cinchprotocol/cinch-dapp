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
import DashboardStats from "/components/DashboardStats";
const { constants } = require("ethers");
import WithdrawButton from "/components/WithdrawButton";

function Dashboard({ web3 }) {
  const address = web3?.address;
  const [allRevenueStream, setAllRevenueStream] = useState([]);
  const [revenueStreamsForSale, setRevenueStreamsForSale] = useState([]);
  const [revenueStreamsSold, setrevenueStreamsSold] = useState([]);
  const [revenueStreamsBought, setRevenueStreamsBought] = useState([]);

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
      <div className="bg-slate-50">
        <CommonHead />
        <DAppHeader web3={web3} />
        <Container>
          <main>
            <div className="mt-10 h-screen">
              <HeaderText01>Dashboard</HeaderText01>
              <DashboardStats />
              <div className="bg-white rounded-2xl mt-10 p-4 shadow min-h-[50%]">
                {address ? (
                  <div>
                    <RevenueStreamTable dataSource={revenueStreamsForSale} mode="ForSale" />
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
      </div>
    </>
  );
}

export default Web3Consumer(Dashboard);
