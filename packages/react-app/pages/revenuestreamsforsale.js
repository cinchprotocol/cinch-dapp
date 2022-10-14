import React, { useState, useEffect } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { Table, Space } from "antd";
import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { getAllRevenueStreamForSale } from "../helpers/marketplacehelper";
import RevenueStreamTable from "../components/RevenueStreamTable";
const { ethers } = require("ethers");

function RevenueStreamsForSale({ web3 }) {
  const [revenueStreamForSale, setRevenueStreamForSale] = useState([]);

  const reloadData = async () => {
    const allRevenueStreamForSale = await getAllRevenueStreamForSale(web3);
    const _revenueStreamForSale = allRevenueStreamForSale.filter(
      s => s.seller !== web3?.address && s.buyer === ethers.constants.AddressZero,
    );
    setRevenueStreamForSale(_revenueStreamForSale);
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <Container>
        <main>
          <div className="mt-10 h-screen">
            <HeaderText01>Explore royalty streams on sale</HeaderText01>
            <div className="bg-slate-50 rounded-lg p-10 min-h-[50%]">
              <div className="text-center">
                <RevenueStreamTable dataSource={revenueStreamForSale} mode="ForSale" />
              </div>
            </div>
          </div>
        </main>
      </Container>
      <Footer />
    </>
  );
}

export default Web3Consumer(RevenueStreamsForSale);
