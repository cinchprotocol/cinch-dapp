import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table, Col, Row, Card } from "antd";
const { ethers } = require("ethers");
import Image from "next/image";
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
import VaultRedeemForm from "/components/Web3/VaultRedeemForm";
import VaultDepositEventList from "/components/Web3/VaultDepositEventList";
import VaultRedeemEventList from "/components/Web3/VaultRedeemEventList";
import demo01 from "/images/demo/cinch_demo_01.png";

function CinchVaultForIdle({ web3 }) {
  const mockERC20Decimals = 6;
  const vaultShareDecimals = 18;
  const referralAddress = "0x15bc81b35a8498cee37E2C7B857538B006CeCAa5"; //dev02
  const protocolPayee = "0x683c5FEb93Dfe9f940fF966a264CBD0b59233cd2";

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <Row justify="center" align="middle">
        <Col justify="center" align="middle" span={24} style={{ textAlign: "center" }}>
          <Image src={demo01} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="User" bordered={false}>
            <Web3Statistic
              web3={web3}
              contractName="MockERC20"
              getFuncName="balanceOf"
              args={[web3?.address]}
              title="Your USDC Balance"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <div style={{ marginTop: 32 }}>
              <VaultDepositForm
                web3={web3}
                referralAddress={referralAddress}
                defaultDepositAmountStr={"10"}
                assetDecimals={mockERC20Decimals}
              />
            </div>
            <div style={{ marginTop: 32 }}>
              <VaultRedeemForm
                web3={web3}
                referralAddress={referralAddress}
                defaultRedeemAmountStr={"9.89"}
                shareDecimals={vaultShareDecimals}
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Cinch Vault" bordered={false}>
            <Web3Statistic
              web3={web3}
              contractName="Vault"
              getFuncName="getTotalValueLocked"
              args={[referralAddress]}
              title="Vault TVL By Referral"
              dataTransform={data => ethers.utils.formatUnits(data, vaultShareDecimals)}
            />
            <Web3Statistic
              web3={web3}
              contractName="Vault"
              getFuncName="balanceOf"
              args={[web3?.address]}
              title="Your Vault Share Balance"
              dataTransform={data => {
                const vaultShareBalance = ethers.utils.formatUnits(data, vaultShareDecimals);
                console.log("vaultShareBalance", vaultShareBalance);
                return vaultShareBalance;
              }}
            />
            <Web3Statistic
              web3={web3}
              contractName="Vault"
              getFuncName="totalAssetDepositProcessed"
              title="Total Deposit Processed"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <div style={{ marginTop: 16 }}>
              <VaultDepositEventList web3={web3} assetDecimals={mockERC20Decimals} shareDecimals={vaultShareDecimals} />
            </div>
            <div style={{ marginTop: 16 }}>
              <VaultRedeemEventList web3={web3} assetDecimals={mockERC20Decimals} shareDecimals={vaultShareDecimals} />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Protocol" bordered={false}>
            <Web3Statistic
              web3={web3}
              contractName="Vault"
              getFuncName="getYieldSourceVaultTotalShares"
              title="Protocol Total Shares"
              dataTransform={data => ethers.utils.formatUnits(data, vaultShareDecimals)}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Web3Consumer(CinchVaultForIdle);
