import React from "react";
import { Col, Row, Statistic } from "antd";
import { useContractReader } from "eth-hooks";

const VaultDepositForm = ({ web3 }) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic title={title} value={data ? dataTransform(data) : 0} formatter={formatter} />
      </Col>
    </Row>
  );
};

export default VaultDepositForm;
