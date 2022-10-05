import React, { useState, useEffect } from "react";
import { Button } from "antd";
const { utils } = require("ethers");

import { Web3Consumer } from "/helpers/Web3Context";
import { fetchPendingWithdrawal } from "/helpers/marketplacehelper";

function WithdrawButton({ web3 }) {
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);

  const reloadData = async () => {
    const wd = await fetchPendingWithdrawal(web3, web3?.address);
    setPendingWithdrawal(wd);
  };

  useEffect(() => {
    reloadData();
  }, [web3]);

  const handleClick = async () => {
    const txRes = await web3?.tx(marketPlaceContract?.withdraw(), res => {
      console.log("📡 Transaction withdraw:", res);
    });
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
