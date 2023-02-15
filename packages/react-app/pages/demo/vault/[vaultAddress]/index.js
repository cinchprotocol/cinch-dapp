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

function Vault({ web3 }) {
  console.log("web3", web3); //!!!

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <Web3Statistic
        web3={web3}
        contractName="MockERC20"
        getFuncName="balanceOf"
        args={[web3?.address]}
        title="yourAssetBalance"
        dataTransform={data => ethers.utils.formatUnits(data, 6)}
      />
      <Button
        onClick={() => {
          web3?.tx(web3?.writeContracts?.MockERC20?.faucet(web3?.address, ethers.utils.parseUnits("1000", 6)));
        }}
      >
        Get asset from faucet
      </Button>
      <Web3Statistic
        web3={web3}
        contractName="Vault"
        getFuncName="balanceOf"
        args={[web3?.address]}
        title="yourVaultShareBalance"
        dataTransform={data => ethers.utils.formatUnits(data, 18)}
      />
    </>
  );
}

export default Web3Consumer(Vault);
