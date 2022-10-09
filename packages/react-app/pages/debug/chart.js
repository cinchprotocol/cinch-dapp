import React from "react";
import { Typography, Col } from "antd";
const { Title } = Typography;

export default function Chart() {
  return (
    <Col style={{ padding: "24px" }}>
      <Title level={2}>Idle Finance stETH senior PYT</Title>
      <iframe
        src="https://dune.com/embeds/1375822/2340950/9a5c59db-56be-4ab6-a761-c98cbc9cdb5f"
        height="512"
        width="1024"
        title="Daily revenue"
      />
      <iframe
        src="https://dune.com/embeds/1375601/2340550/9b55b940-c570-47dc-bf1d-4a1cc0829744"
        height="512"
        width="1024"
        title="Idle Finance cumulative revenue"
      />
      <iframe
        src="https://dune.com/embeds/1375601/2340551/e071bff6-8734-46e7-bb95-47eafbe76e77"
        height="512"
        width="1024"
        title="Idle Finance cumulative revenue"
      />
      <iframe
        src="https://dune.com/embeds/1375810/2340927/c8668e21-7691-4c04-b4b7-a20101b74197"
        height="512"
        width="1024"
        title="TVL rolling average"
      />
    </Col>
  );
}
