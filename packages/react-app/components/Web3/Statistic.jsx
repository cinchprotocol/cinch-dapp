import React from "react";
import { Col, Row, Statistic, Card } from "antd";
import CountUp from "react-countup";
import { useContractReader } from "eth-hooks";
const { ethers } = require("ethers");

const countUpFormatter = value => <CountUp end={value} separator="," />;

const Web3Statistic = ({
  web3,
  contractName,
  getFuncName,
  args = [],
  title = "",
  dataTransform = ethers.utils.formatUnits,
  formatter = countUpFormatter,
  pollTime = 500,
}) => {
  const data = useContractReader(web3.readContracts, contractName, getFuncName, args, pollTime);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title={title} value={data ? dataTransform(data) : 0} formatter={formatter} />
        </Card>
      </Col>
    </Row>
  );
};

export default Web3Statistic;
