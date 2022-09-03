import React, { useState } from "react";
import { Web3Consumer } from "../helpers/Web3Context";
import "antd/dist/antd.css";
import { InputNumber, Select, Modal } from "antd";
const { Option } = Select;

import { CommonHead } from "/components/CommonHead";
import { Account } from "../components";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";

function InvestIdleFinance({ web3 }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [investmentValue, setInvestmentValue] = useState(0);

  const showModal = productName => {
    setSelectedProduct(productName);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const selectAfter = (
    <Select
      defaultValue="ETH"
      style={{
        width: 100,
      }}
    >
      <Option value="ETH">ETH</Option>
    </Select>
  );

  return (
    <>
      <CommonHead />
      <DAppHeader />
      <main>
        <div className="flex flex-1 justify-between items-center">
          <div className="mr-6">
            <Account {...web3} />
          </div>
        </div>

        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Invest in Idle Finance</HeaderText01>
            <InputNumber
              addonAfter={selectAfter}
              placeholder="Amount"
              onChange={v => {
                setInvestmentValue(v);
              }}
            />
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button
              color="blue"
              onClick={() => {
                showModal("Perpetual Yield Tranches Junior");
              }}
            >
              <div>
                <span>Invest in Perpetual Yield Tranches Junior</span>
              </div>
            </Button>
          </div>
          <div className="text-center" style={{ margin: 64 }}>
            <Button
              color="blue"
              onClick={() => {
                showModal("Perpetual Yield Tranches Senior");
              }}
            >
              <div>
                <span>Invest in Perpetual Yield Tranches Senior</span>
              </div>
            </Button>
          </div>
          <Modal title="Confirmation" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Invest</p>
            <p>{investmentValue} ETH</p>
            <p>in {selectedProduct} ?</p>
          </Modal>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(InvestIdleFinance);
