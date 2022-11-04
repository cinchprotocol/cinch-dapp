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
let mockERC20;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
});

describe("RBFVault tests", function () {
  describe("Deploy", function () {
    it("Should deploy MockFeeCollector", async function () {
      const MockFeeCollector = await ethers.getContractFactory(
        "SampleProtocol"
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
    it("Should deploy MockERC20", async function () {
      const MockERC20 = await ethers.getContractFactory("TestToken");
      mockERC20 = await MockERC20.deploy();
      expect(mockERC20.address).to.not.be.undefined;
    });
    it("Should deploy CinchSafeGuard", async function () {
      const CinchSafeGuard = await ethers.getContractFactory("CinchSafeGuard");

      cinchSafeGuard = await CinchSafeGuard.deploy();
      expect(cinchSafeGuard.address).to.not.be.undefined;
      console.log("cinchSafeGuard.address: ", cinchSafeGuard.address);
    });
    it("Should deploy RBFVault", async function () {
      const RBFVault = await ethers.getContractFactory("RBFVault");
      const price = 100 * 10 ** 12;
      const marketPlaceItem01 = {
        itemId: 1,
        name: "testItem01",
        feeCollector: mockFeeCollector.address,
        multiSig: mockGnosisSafe.address,
        revenuePct: 100,
        seller: accounts[sellerAccountIndex].address,
        buyer: accounts[buyerAccountIndex].address,
        price,
        soldPrice: price,
        expAmount: price * 10,
      };

      rbfVault = await RBFVault.deploy(
        marketPlaceItem01,
        cinchSafeGuard.address,
        mockERC20.address
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

    // TODO: uncomment the following test
    /*
    it("should revet if MULTISIG_GUARD_NOT_IN_PLACE", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith("MULTISIG_GUARD_NOT_IN_PLACE");
    });
    */

    it("setGuard should be processed", async function () {
      const tx = await mockGnosisSafe.setGuard(cinchSafeGuard.address);
      expect(tx).to.emit(mockGnosisSafe, "GuardUpdated");
    });
    it("should be activated", async function () {
      const tx01 = mockERC20
        .connect(accounts[0])
        .faucet(rbfVault.address, 1000 * 10 ** 12);
      await expect(tx01).not.to.be.revertedWith();
      const tx03 = await rbfVault.activate();
      expect(tx03).to.emit(rbfVault, "RBFVaultActivated");
    });
  });
});
