import React from "react";
import { Col, Row, Statistic, Card, List, Space } from "antd";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");
import { useEventListener } from "eth-hooks/events/useEventListener";

import Address from "../Address";

const VaultDepositEventList = ({ web3, mockERC20Decimals = 6 }) => {
  const vaultDepositEvents = useEventListener(web3?.readContracts, "Vault", "Deposit");

  return (
    <List
      header={<div>Vault Deposit Events</div>}
      bordered
      dataSource={vaultDepositEvents}
      renderItem={item => {
        return (
          <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item.args[2].toNumber()}>
            <Address address={item.args[0]} ensProvider={web3?.mainnetProvider} fontSize={16} />
            <span style={{ fontSize: 16, marginRight: 8 }}>
              {"Assets:" + ethers.utils.formatUnits(item?.args[2], mockERC20Decimals)}
            </span>
            <span style={{ fontSize: 16, marginRight: 8 }}>
              {"Shares:" + ethers.utils.formatUnits(item?.args[3], mockERC20Decimals)}
            </span>
          </List.Item>
        );
      }}
    />
  );
};

export default VaultDepositEventList;
