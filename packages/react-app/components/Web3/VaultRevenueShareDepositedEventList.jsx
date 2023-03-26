import React from "react";
import { Col, Row, Statistic, Card, List, Space } from "antd";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");
import { useEventListener } from "eth-hooks/events/useEventListener";

import Address from "../Address";

const VaultRevenueShareDepositedEventList = ({
  web3,
  assetDecimals = 6,
  shareDecimals = 6,
  vaultContractName = "RevenueShareVault",
}) => {
  const vaultRevenueShareDepositedEvents = useEventListener(
    web3?.readContracts,
    vaultContractName,
    "RevenueShareDeposited",
  );

  return (
    <List
      header={<div>Revenue share received</div>}
      bordered
      dataSource={vaultRevenueShareDepositedEvents}
      renderItem={item => {
        return (
          <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber}>
            <Address address={item.args[0]} ensProvider={web3?.mainnetProvider} fontSize={16} />
            <span style={{ fontSize: 16, marginRight: 8 }}>
              {"Assets:" + ethers.utils.formatUnits(item?.args[2], assetDecimals)}
            </span>
          </List.Item>
        );
      }}
    />
  );
};

export default VaultRevenueShareDepositedEventList;
