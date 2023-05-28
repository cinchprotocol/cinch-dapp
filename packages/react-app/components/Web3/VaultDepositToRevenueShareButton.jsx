import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");

import { Button } from "../Button";

const VaultDepositToRevenueShareButton = ({
  web3,
  assetDecimals = 6,
  defaultDepositAmountStr = "100",
  vaultContractName = "RevenueShareVault",
  cardTitle = "Send Revenue Share Payment",
}) => {
  const [formValues, setFormValues] = useState(null);
  const [depositAmountStr, setDepositAmountStr] = useState(defaultDepositAmountStr);

  const approveAndDepositAsset = async values => {
    if (!web3 || !depositAmountStr) return;
    var result = await web3?.tx(
      web3?.writeContracts?.MockERC20?.approve(
        web3?.writeContracts?.[vaultContractName]?.address,
        ethers.utils.parseUnits(depositAmountStr, assetDecimals),
      ),
      async update => {
        if (update && (update.status === "confirmed" || update.status === 1)) {
          await depositAsset();
        }
      });
  };

  const depositAsset = async values => {
    if (!web3 || !depositAmountStr) return;
    console.log("depositAsset", depositAmountStr);
    await web3?.tx(
      web3?.writeContracts?.[vaultContractName]?.depositToRevenueShare(
        web3?.writeContracts?.MockERC20?.address,
        ethers.utils.parseUnits(depositAmountStr, assetDecimals),
      ),
      async update => {
        if (update && (update.status === "confirmed" || update.status === 1)) {
          await web3?.tx(
            web3?.writeContracts[vaultContractName]?.setTotalSharesInReferralAccordingToYieldSource( web3?.address, web3?.address),
          );
        }
      });
  };

 

  return (
    <Button
    type="primary"
    onClick={() => {
      approveAndDepositAsset();
    }}
  >
    4. Simulate Referral Balance Increase (100 USDC)
  </Button>
  );
};

export default VaultDepositToRevenueShareButton;
