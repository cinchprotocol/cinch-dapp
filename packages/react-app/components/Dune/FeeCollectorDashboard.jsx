import React, { useState } from "react";
import moment from "moment";
import { Row, Col, Typography, DatePicker, Button } from "antd";
const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function FeeCollectorDashboard({ feeCollectorAddress, title = "Revenue Analytics" }) {
  const _feeCollectorAddress = feeCollectorAddress?.replace("0x", "");
  const [dateRange, setDateRange] = useState(["2020-01-01 00:00:00", "2030-01-01 00:00:00"]);

  if (!_feeCollectorAddress) {
    return null;
  } else {
    return (
      <>
        <Col style={{ padding: "24px" }}>
          {title && <Title level={2}>{title}</Title>}
          <Row>
            <RangePicker
              defaultValue={[moment(dateRange[0]), moment(dateRange[1])]}
              onChange={values => {
                const startDatetimeStr = values[0].format("YYYY-MM-DD HH:mm:ss");
                const endDatetimeStr = values[1].format("YYYY-MM-DD HH:mm:ss");
                setDateRange([startDatetimeStr, endDatetimeStr]);
              }}
              ranges={{
                "30 Days": [moment().subtract(30, "days"), moment().add(1, "days")],
                "60 Days": [moment().subtract(60, "days"), moment().add(1, "days")],
                "90 Days": [moment().subtract(90, "days"), moment().add(1, "days")],
                "180 Days": [moment().subtract(180, "days"), moment().add(1, "days")],
              }}
              allowClear={false}
            />
          </Row>
          <Row align="middle">
            <iframe
              src={`https://dune.com/embeds/1379159/2365292/e8a8a878-0626-429e-a3f4-0a1328356949?fee_collector_address=${_feeCollectorAddress}&start_datetime=${dateRange[0]}&end_datetime=${dateRange[1]}`}
              height="512"
              width="342"
              title="chart 01"
            />
            <iframe
              src={`https://dune.com/embeds/1419944/2409172/ba3d3b76-2301-4477-ac62-0222772b483b?fee_collector_address=${_feeCollectorAddress}&start_datetime=${dateRange[0]}&end_datetime=${dateRange[1]}`}
              height="512"
              width="342"
              title="chart avg per month"
            />
            <iframe
              src={`https://dune.com/embeds/1419964/2409200/c05d9546-c770-48ee-88cf-6ab0e0d1e9db?fee_collector_address=${_feeCollectorAddress}&start_datetime=${dateRange[0]}&end_datetime=${dateRange[1]}`}
              height="512"
              width="342"
              title="chart avg per day"
            />
          </Row>
          <Row>
            <iframe
              src={`https://dune.com/embeds/1378473/2409566/b3c9f7ca-3520-42dd-a9ad-1f3b9426dcb6?fee_collector_address=${_feeCollectorAddress}&start_datetime=${dateRange[0]}&end_datetime=${dateRange[1]}`}
              height="512"
              width="1024"
              title="chart weekly bar"
            />
          </Row>
          <Row>
            <iframe
              src={`https://dune.com/embeds/1379162/2346105/fe6a2928-8375-40ac-90ef-5575ec9e7c92?fee_collector_address=${_feeCollectorAddress}&start_datetime=${dateRange[0]}&end_datetime=${dateRange[1]}`}
              height="512"
              width="1024"
              title="chart Cumulative"
            />
          </Row>
        </Col>
      </>
    );
  }
}
