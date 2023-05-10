import React from "react";
import { Col, Row, Statistic, Card, List, Space } from "antd";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");
import { useEventListener } from "eth-hooks/events/useEventListener";

import Address from "../Address";

const VaultEventsList = ({ web3, assetDecimals = 6, shareDecimals = 6, vaultContractName = "Vault" }) => {
  const vaultDepositEvents = useEventListener(web3?.readContracts, vaultContractName, "DepositWithReferral");
  const vaultWithdrawEvents = useEventListener(web3?.readContracts, vaultContractName, "RedeemWithReferral");
console.log(vaultDepositEvents);
  return (
    <List
      bordered
      dataSource={vaultDepositEvents}
      renderItem={item => {
        return (
          <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_"}>
            <Address address={item.args[0]} ensProvider={web3?.mainnetProvider} fontSize={16} />
            <span style={{ fontSize: 16, marginRight: 8 }}>
              {"Assets:" + ethers.utils.formatUnits(item?.args[2], assetDecimals)}
            </span>
            <span style={{ fontSize: 16, marginRight: 8 }}>
              {"Shares:" + ethers.utils.formatUnits(item?.args[3], shareDecimals)}
            </span>
          </List.Item>
        );
      }}
    />
  );
};

export default VaultEventsList;
