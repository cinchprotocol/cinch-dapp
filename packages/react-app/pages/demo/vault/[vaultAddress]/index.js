import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table } from "antd";
const { ethers } = require("ethers");

import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";

import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

import Web3Statistic from "/components/Web3/Statistic";
import VaultDepositForm from "/components/Web3/VaultDepositForm";

function Vault({ web3 }) {
  //console.log("web3", web3);
  const mockERC20Decimals = 6;
  const referralAddress = "0xdfFFAC7E0418A115CFe41d80149C620bD0749628";
  const protocolPayee = "0x683c5FEb93Dfe9f940fF966a264CBD0b59233cd2";

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <Web3Statistic
        web3={web3}
        contractName="Vault"
        getFuncName="getTotalValueLocked"
        args={[referralAddress]}
        title="Vault TVL by Referral"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      <Web3Statistic
        web3={web3}
        contractName="MockERC20"
        getFuncName="balanceOf"
        args={[web3?.address]}
        title="Your Asset Balance"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      <Button
        onClick={() => {
          web3?.tx(
            web3?.writeContracts?.MockERC20?.faucet(web3?.address, ethers.utils.parseUnits("1000", mockERC20Decimals)),
          );
        }}
      >
        Get asset from faucet
      </Button>
      <Web3Statistic
        web3={web3}
        contractName="Vault"
        getFuncName="balanceOf"
        args={[web3?.address]}
        title="Your Vault Share Balance"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      <VaultDepositForm web3={web3} referralAddress={referralAddress} />
      <Web3Statistic
        web3={web3}
        contractName="FeeSplitter"
        getFuncName="getInternalBalance"
        args={[web3?.readContracts?.MockERC20?.address, referralAddress]}
        title="Fee Splitter Balance for Referral"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      <Web3Statistic
        web3={web3}
        contractName="FeeSplitter"
        getFuncName="getInternalBalance"
        args={[web3?.readContracts?.MockERC20?.address, protocolPayee]}
        title="Fee Splitter Balance for Protocol"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      <Web3Statistic
        web3={web3}
        contractName="FeeSplitter"
        getFuncName="getTotalProcessed"
        args={[web3?.readContracts?.MockERC20?.address]}
        title="Fee Splitter total processed"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      <Button
        onClick={() => {
          web3?.tx(web3?.writeContracts?.FeeSplitter?.processFeeSplit());
        }}
      >
        Process Fee Split
      </Button>
    </>
  );
}

export default Web3Consumer(Vault);
