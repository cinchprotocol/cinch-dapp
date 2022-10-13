import React, { useEffect, useState } from "react";
import { Web3Consumer } from "/helpers/Web3Context";
import { useRouter } from "next/router";
import _ from "lodash";
import { Select, Modal, Form, Input, message, Space, Table } from "antd";
const { utils } = require("ethers");

import { Container } from "/components/Container";
import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";
import { Button } from "/components/Button";
import { Footer } from "/components/Footer";
import { HeaderText01 } from "/components/HeaderText";
import { fetchVaultData } from "/helpers/vaulthelper";

function Vault({ web3 }) {
  const [vaultData, setVaultData] = useState(null);

  const router = useRouter();
  const { vaultaddress } = router.query;

  const reloadData = async () => {
    if (vaultaddress) {
      console.log("vaultaddress", vaultaddress);
      const data = await fetchVaultData({ web3, address: vaultaddress });
      setVaultData(data);
      console.log("vaultData", data);
    }
  };

  useEffect(() => {
    if (web3) {
      reloadData();
    }
  }, [web3, vaultaddress]);

  return (
    <>
      <CommonHead />
      <DAppHeader web3={web3} />
      <main>
        <div className="flex flex-1 flex-col h-screen w-full items-center">
          <div className="text-center" style={{ margin: 64 }}>
            <HeaderText01>Vault</HeaderText01>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Web3Consumer(Vault);
