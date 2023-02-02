import React, { useContext } from "react";
import { Contract, Account, Header } from "../components";
import { Web3Consumer } from "../helpers/Web3Context";

import { CommonHead } from "/components/CommonHead";
import { DAppHeader } from "/components/DAppHeader";

function DebugPage({ web3 }) {
  console.log(`🗄 web3 context:`, web3);

  return (
    <>
      {/* Page Header start */}
      <CommonHead />
      <DAppHeader web3={web3} />
      {/* Page Header end */}

      {/* Main Page Content start */}
      <div className="flex flex-1 flex-col h-screen w-full items-center">
        <div className="text-center">
          <Contract
            name="MockERC20"
            signer={web3.userSigner}
            provider={web3.localProvider}
            address={web3.address}
            blockExplorer={web3.blockExplorer}
            contractConfig={web3.contractConfig}
          />

          <Contract
            name="Vault"
            signer={web3.userSigner}
            provider={web3.localProvider}
            address={web3.address}
            blockExplorer={web3.blockExplorer}
            contractConfig={web3.contractConfig}
          />

          <Contract
            name="MockProtocol"
            signer={web3.userSigner}
            provider={web3.localProvider}
            address={web3.address}
            blockExplorer={web3.blockExplorer}
            contractConfig={web3.contractConfig}
          />

          <Contract
            name="MockGnosisSafe"
            signer={web3.userSigner}
            provider={web3.localProvider}
            address={web3.address}
            blockExplorer={web3.blockExplorer}
            contractConfig={web3.contractConfig}
          />
        </div>
      </div>
    </>
  );
}

export default Web3Consumer(DebugPage);
