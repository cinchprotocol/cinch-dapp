import React, { useState } from "react";
import { Col, Row, Statistic, Form, Input, Space, Checkbox, Card } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
const { ethers } = require("ethers");
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { Button } from "../Button";

// export const isReferralRegistered = async (web3, vaultContractName, address) => {
//   const contract = web3?.readContracts[{ vaultContractName }];
//   if (!contract) {
//     return {};
//   }
//   const isReferralRegistered = await contract?.isReferralRegistered(address);
//   return isReferralRegistered;
// };

const VaultDepositForm = ({
  web3,
  assetDecimals = 6,
  referralAddress = null,
  defaultDepositAmountStr = "0",
  vaultContractName = "Vault"
}) => {
  const [referralCode, setReferralCode] = useState(referralAddress);
  const [depositAmountStr, setDepositAmountStr] = useState('');
  const [isReferralValid, setIsReferralValid] = useState(false);

  const approveAsset = async values => {
    if (!web3 || !depositAmountStr) return;
    await web3?.tx(
      web3?.writeContracts?.MockERC20?.approve(
        web3?.writeContracts?.[vaultContractName]?.address,
        ethers.utils.parseUnits(depositAmountStr, assetDecimals),
      ),
    );
  };

  const depositAsset = async values => {
    if (!web3 || !depositAmountStr || !referralCode) return;

    if (referralCode) {
      await web3?.tx(
        web3?.writeContracts?.[vaultContractName]?.depositWithReferral(
          ethers.utils.parseUnits(depositAmountStr, assetDecimals),
          web3?.address,
          referralCode,
        ),
      );
    } else {
      await web3?.tx(
        web3?.writeContracts?.[vaultContractName]?.deposit(
          ethers.utils.parseUnits(depositAmountStr, assetDecimals),
          web3?.address,
        ),
      );
    }
  };

  const onReferralChange = async e => {
    setReferralCode(e.target.value);
    var isValid = false;
    if (e.target.value !== "") {
      // isValid = await web3?.tx(
      //   web3?.readContracts?.[vaultContractName]?.isReferralRegistered(
      //     e.target.value
      //   ),
      // );
      isValid = await web3?.readContracts[vaultContractName].isReferralRegistered(e.target.value);
    }
    setIsReferralValid(isValid);
  };

  const onInputChange = e => {
    const { value } = e.target;
    var sanitizedValue = value.replace(/[^0-9.]/g, '');
    const decimalIndex = sanitizedValue.indexOf('.');
    if (decimalIndex !== -1) {
      const decimalPart = sanitizedValue.substring(decimalIndex + 1);
      if (decimalPart.length > 6) {
        const truncatedDecimal = decimalPart.substring(0, 6);
        sanitizedValue = sanitizedValue.substring(0, decimalIndex + 1) + truncatedDecimal;
      }
    }
    setDepositAmountStr(sanitizedValue);
  };

  return (
    <div className="">
      <div className="bg-slate-50 m-6 rounded-2xl p-4 text-3xl  border hover:border-slate-300 flex justify-between">
        <input
          type='text'
          className="bg-transparent placeholder:text-[#B2B9D2] border-transparent focus:border-transparent focus:ring-0 text-2xl"
          placeholder={defaultDepositAmountStr}
          value={depositAmountStr}
          onChange={onInputChange}
        />

        <div className="inline-flex items-center gap-x-2 bg-slate-200 rounded-2xl text-base font-medium px-3.5 py-1 shadow my-auto">
          <img
            className="inline-block h-6 w-6 rounded-full"
            src="/usdc_logo.jpeg"
            alt=""
          />
          USDC
        </div>
      </div>

      <div className="bg-slate-50 m-6 p-1 rounded-2xl text-2xl  border hover:border-slate-300">
        <input
          type='text'
          className="bg-transparent placeholder:text-[#B2B9D2] border-transparent focus:border-transparent focus:ring-0 w-full"
          placeholder='Referral Address (0x... )'
          onChange={onReferralChange}
        />


      </div>
      {referralCode && (
        <div>
          {isReferralValid ? <div className="rounded-md bg-green-50 m-6 p-3 align-middle">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-green-700">Referral address verified.</h3>
              </div>
            </div>
          </div>
            :
            <div className="rounded-md bg-red-50 m-6 p-3 align-middle">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-red-700">Address not registered with Referral program.</h3>
                </div>
              </div>
            </div>
          }
        </div>
      )}


      <Button type="primary" className="ml-6 mb-6" disabled={depositAmountStr == '0'}
        onClick={() => {
          approveAsset();
        }}>
        Approve
      </Button>
      <Button type="primary" className="ml-3 mb-6" disabled={depositAmountStr == '0'}
        onClick={() => {
          depositAsset();
        }}
      >
        Deposit
      </Button>

    </div>
  );
};

export default VaultDepositForm;
