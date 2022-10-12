import React, { useState } from "react";
import { Row, Col, Typography, DatePicker } from "antd";
const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function FeeCollectorDashboard({ feeCollectorAddress, title = "Revenue Analytics" }) {
  const _feeCollectorAddress = feeCollectorAddress?.replace("0x", "");
  const [dateRange, setDateRange] = useState([null, null]);

  if (!_feeCollectorAddress) {
    return null;
  } else {
    return (
      <>
        <Col style={{ padding: "24px" }}>
          {title && <Title level={2}>{title}</Title>}
          {/*
          <RangePicker
            onChange={values => {
              setDateRange(values);
            }}
                />
        */}
          <Row align="middle">
            <iframe
              src={`https://dune.com/embeds/1379159/2365292/e8a8a878-0626-429e-a3f4-0a1328356949?fee_collector_address=${_feeCollectorAddress}`}
              height="512"
              width="512"
              title="chart 01"
            />
            <iframe
              src={`https://dune.com/embeds/1378782/2345411/27a0ca0b-7d2c-4cf7-9dc4-477618c91e52?fee_collector_address=${_feeCollectorAddress}`}
              height="512"
              width="512"
              title="chart 02"
            />
          </Row>
          <Row>
            <iframe
              src={`https://dune.com/embeds/1379162/2346105/fe6a2928-8375-40ac-90ef-5575ec9e7c92?fee_collector_address=${_feeCollectorAddress}`}
              height="512"
              width="1024"
              title="chart 03"
            />
          </Row>
          <Row>
            <iframe
              src={`https://dune.com/embeds/1378473/2345265/bfd2234e-1e10-4259-ae46-eb61167eec89?fee_collector_address=${_feeCollectorAddress}`}
              height="512"
              width="1024"
              title="chart 04"
            />
          </Row>
        </Col>
      </>
    );
  }
}
