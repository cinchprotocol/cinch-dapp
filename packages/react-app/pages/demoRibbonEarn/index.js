import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table, Col, Row, Card } from "antd";
const { ethers } = require("ethers");
import Image from "next/image";

import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

import Web3Statistic from "/components/Web3/Statistic";
import VaultDepositForm from "/components/Web3/VaultDepositForm";
import VaultRedeemFormRibbonEarn from "/components/Web3/Ribbon/VaultRedeemFormRibbonEarn";
import VaultDepositEventList from "/components/Web3/VaultDepositEventList";
import VaultDepositToRevenueShareForm from "/components/Web3/VaultDepositToRevenueShareForm";
import VaultRevenueShareDepositedEventList from "/components/Web3/VaultRevenueShareDepositedEventList";
import VaultAddRevenueShareReferralForm from "/components/Web3/VaultAddRevenueShareReferralForm";
import VaultWithdrawFromRevenueShareForm from "/components/Web3/VaultWithdrawFromRevenueShareForm";

function Vault({ web3 }) {
  //console.log("web3", web3);
  const mockERC20Decimals = 6;
  const referralAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const vaultContractName = "RevenueShareVaultRibbonEarn";
  const protocolContractName = "MockProtocolRibbonEarn";

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <Row justify="center" align="middle">
        <Col justify="center" align="middle" span={24} style={{ textAlign: "center" }}></Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Card title="User" bordered={false}>
            <Web3Statistic
              web3={web3}
              contractName="MockERC20"
              getFuncName="balanceOf"
              args={[web3?.address]}
              title="Your Asset Balance"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <div style={{ textAlign: "center", padding: 32 }}>
              <Button
                onClick={() => {
                  web3?.tx(
                    web3?.writeContracts?.MockERC20?.faucet(
                      web3?.address,
                      ethers.utils.parseUnits("1100", mockERC20Decimals),
                    ),
                  );
                }}
              >
                1. Get asset from faucet
              </Button>
            </div>
            <VaultDepositForm
              web3={web3}
              referralAddress={referralAddress}
              vaultContractName={vaultContractName}
              cardTitle="Deposit into Protocol"
            />
            <div style={{ marginTop: 16 }}>
              <VaultDepositToRevenueShareForm web3={web3} vaultContractName={vaultContractName} />
            </div>
            <div style={{ marginTop: 16 }}>
              <VaultRedeemFormRibbonEarn
                web3={web3}
                vaultContractName={"MockProtocolRibbonEarn"}
                cardTitle="Redeem from Protocol"
              />
            </div>
            {/*
            <div style={{ textAlign: "center", padding: 16 }}>
              <Button
                onClick={async () => {
                  web3?.userSigner?.sendTransaction({
                    from: web3?.address,
                    to: referralAddress,
                    value: ethers.utils.parseEther("0.1"),
                  });
                }}
              >
                8. Send ETH to Referral
              </Button>
            </div>
            */}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Cinch Revenue Share Vault" bordered={false}>
            <VaultAddRevenueShareReferralForm
              web3={web3}
              vaultContractName={vaultContractName}
              defaultReferralAddress={referralAddress}
            />
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="balanceOf"
              args={[web3?.address]}
              title="Your Vault Share Balance"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="totalAssetDepositProcessed"
              title="Total Deposit Processed"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <div style={{ marginTop: 16 }}>
              <VaultDepositEventList
                web3={web3}
                mockERC20Decimals={mockERC20Decimals}
                vaultContractName={vaultContractName}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <VaultRevenueShareDepositedEventList
                web3={web3}
                mockERC20Decimals={mockERC20Decimals}
                vaultContractName={vaultContractName}
              />
            </div>
            <div style={{ textAlign: "center", padding: 16 }}>
              <Button
                onClick={async () => {
                  await web3?.tx(
                    web3?.writeContracts[vaultContractName]?.setTotalSharesInReferralAccordingToYieldSource(),
                  );
                }}
              >
                7. Update Referral Balance (Vault Owner Only)
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Protocol" bordered={false}>
            <Web3Statistic
              web3={web3}
              contractName={protocolContractName}
              getFuncName="totalSupply"
              title="Protocol Total Share Supply"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="totalSharesByReferral"
              args={[referralAddress]}
              title="Total Shares by Referral"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card title={"Referral " + _.truncate(referralAddress, { length: 10 })} bordered={false}>
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="getRevenueShareReferralSet"
              title="# of Registered Referrals"
              dataTransform={data => _.size(data)}
            />
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="totalRevenueShareProcessedByAsset"
              args={[web3?.writeContracts?.MockERC20?.address]}
              title="Revenue Share Processed"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="cinchPerformanceFeePercentage"
              title="Cinch Performance Fee Percentage"
              dataTransform={data => ethers.utils.formatUnits(data, 2)}
            />
            <Web3Statistic
              web3={web3}
              contractName={vaultContractName}
              getFuncName="revenueShareBalanceByAssetReferral"
              args={[web3?.writeContracts?.MockERC20?.address, referralAddress]}
              title="Revenue Share Balance"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
            <div style={{ marginTop: 16 }}>
              <VaultWithdrawFromRevenueShareForm
                web3={web3}
                vaultContractName={vaultContractName}
                defaultWithdrawAmountStr={"90"}
              />
            </div>
            <Web3Statistic
              web3={web3}
              contractName="MockERC20"
              getFuncName="balanceOf"
              args={[referralAddress]}
              title="Referral Asset Balance"
              dataTransform={data => ethers.utils.formatUnits(data, mockERC20Decimals)}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Web3Consumer(Vault);
