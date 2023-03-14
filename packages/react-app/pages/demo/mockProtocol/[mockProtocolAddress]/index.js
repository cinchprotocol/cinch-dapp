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

import Web3Statistic from "../../../../components/Web3/Statistic";

function MockProtocol({ web3 }) {
  const mockERC20Decimals = 6;

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <Web3Statistic
        web3={web3}
        contractName="MockProtocol"
        getFuncName="getTotalValueLocked"
        title="Protocol TVL"
        dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
      />
      {/*
      <Web3Statistic
        web3={web3}
        contractName="MockProtocol"
        getFuncName="feeReceiver"
        title="Fee Receiver address"
        dataTransform={data => data}
        formatter={null}
          />
        */}
    </>
  );
}

export default Web3Consumer(MockProtocol);
