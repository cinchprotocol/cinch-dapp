import React, { useState, useEffect } from "react";
import { Button } from "antd";
const { utils } = require("ethers");

import { Web3Consumer } from "/helpers/Web3Context";
import { fetchPendingWithdrawal } from "/helpers/marketplacehelper";

function WithdrawButton({ web3 }) {
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);

  const reloadData = async () => {
    const wd = await fetchPendingWithdrawal({ web3, address: web3?.address });
    setPendingWithdrawal(wd);
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

  const handleClick = async () => {
    const marketPlaceContract = web3?.writeContracts["MarketPlace"];
    const tx = await web3?.tx(marketPlaceContract?.withdraw(), res => {
      console.log("📡 Transaction withdraw:", res);
    });
    const txRes = await tx?.wait();
    console.log("txRes", txRes);
  };

  if (pendingWithdrawal && !pendingWithdrawal?.isZero()) {
    return (
      <Button type="primary" onClick={handleClick}>
        Withdraw {utils.formatEther(pendingWithdrawal)}
      </Button>
    );
  } else {
    return null;
  }
}

export default Web3Consumer(WithdrawButton);
