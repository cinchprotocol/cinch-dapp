/* eslint-disable no-unused-expressions */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const sellerAccountIndex = 1;
const buyerAccountIndex = 2;

let accounts;
let mockFeeCollector;
let mockGnosisSafe;
let cinchSafeGuard;
let rbfVault;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
});

describe("RBFVault tests", function () {
  describe("Deploy", function () {
    it("Should deploy MockFeeCollector", async function () {
      const MockFeeCollector = await ethers.getContractFactory(
        "MockFeeCollector"
      );

      mockFeeCollector = await MockFeeCollector.deploy();
      expect(mockFeeCollector.address).to.not.be.undefined;
      console.log("mockFeeCollector.address: ", mockFeeCollector.address);
    });
    it("Should deploy MockGnosisSafe", async function () {
      const MockGnosisSafe = await ethers.getContractFactory("MockGnosisSafe");

      mockGnosisSafe = await MockGnosisSafe.deploy();
      expect(mockGnosisSafe.address).to.not.be.undefined;
      console.log("mockGnosisSafe.address: ", mockGnosisSafe.address);
    });
    it("Should deploy CinchSafeGuard", async function () {
      const CinchSafeGuard = await ethers.getContractFactory("CinchSafeGuard");

      cinchSafeGuard = await CinchSafeGuard.deploy();
      expect(cinchSafeGuard.address).to.not.be.undefined;
      console.log("cinchSafeGuard.address: ", cinchSafeGuard.address);
    });
    it("Should deploy RBFVault", async function () {
      const RBFVault = await ethers.getContractFactory("RBFVault");

      rbfVault = await RBFVault.deploy(
        "rbfVault01",
        mockFeeCollector.address,
        mockGnosisSafe.address,
        100,
        1000,
        10000,
        accounts[sellerAccountIndex].address,
        accounts[buyerAccountIndex].address,
        cinchSafeGuard.address
      );
      expect(rbfVault.address).to.not.be.undefined;
      console.log("rbfVault.address: ", rbfVault.address);
    });
  });
  describe("activate", function () {
    it("should revet if FEE_COLLECTOR_RECEIVER_NOT_UPDATED", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith("FEE_COLLECTOR_RECEIVER_NOT_UPDATED");
    });
    it("feeReceiver should be updated", async function () {
      const tx = await mockFeeCollector.setFeeReceiver(rbfVault.address);
      expect(tx).to.emit(mockFeeCollector, "FeeReceiverUpdated");
    });
    it("should revet if MULTISIG_GUARD_NOT_IN_PLACE", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith("MULTISIG_GUARD_NOT_IN_PLACE");
    });
    it("setGuard should be processed", async function () {
      const tx = await mockGnosisSafe.setGuard(cinchSafeGuard.address);
      expect(tx).to.emit(mockGnosisSafe, "GuardUpdated");
    });
    it("should be activated", async function () {
      const tx = await rbfVault.activate();
      expect(tx).to.emit(rbfVault, "RBFVaultActivated");
    });
  });
});
