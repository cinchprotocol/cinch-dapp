import React from "react";
import { Alert, Button } from "antd";
import { NETWORK } from "../constants";
import { Web3Consumer } from "../helpers/Web3Context";

function NetworkDisplay({ web3 }) {
  const { NETWORKCHECK, selectedChainId } = web3;

  let networkDisplay = null;

  if (NETWORKCHECK, selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);

    networkDisplay = (
      <div className="bg-slate-50 px-3 py-1 border rounded-xl font-semibold">
        {networkSelected.name}
      </div>
    );
  }

  return networkDisplay;
}

export default Web3Consumer(NetworkDisplay);
