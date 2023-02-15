import React from "react";
import { Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");

const formatter = value => <CountUp end={value} separator="," />;

const Web3Statistic = ({
  web3,
  contractName,
  getFuncName,
  args = [],
  title = "",
  dataTransform = ethers.utils.formatUnits,
}) => {
  const data = useContractReader(web3?.readContracts, contractName, getFuncName, args);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic title={title} value={data ? dataTransform(data) : 0} formatter={formatter} />
      </Col>
    </Row>
  );
};

export default Web3Statistic;
