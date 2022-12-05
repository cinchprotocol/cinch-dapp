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
let mockERC20Decimals;

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
      mockERC20Decimals = await mockERC20.decimals();
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
      const protocolDetail = {
        feeCollector: mockFeeCollector.address,
        multiSig: mockGnosisSafe.address,
        expAmount: 1000000,
      };

      rbfVault = await RBFVault.deploy(
        mockERC20.address,
        "CinchPx",
        "CPX",
        protocolDetail,
        cinchSafeGuard.address
      );
      expect(rbfVault.address).to.not.be.undefined;
      console.log("rbfVault.address: ", rbfVault.address);
    });

  });
  describe("activate", function () {
    it("should revert if FEE_COLLECTOR_RECEIVER_NOT_UPDATED", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith("FEE_COLLECTOR_RECEIVER_NOT_UPDATED");
    });

    it("feeReceiver should be updated", async function () {
      const tx = await mockFeeCollector.setFeeReceiver(rbfVault.address);
      expect(tx).to.emit(mockFeeCollector, "FeeReceiverUpdated");
    });


    it("should revert if MULTISIG_GUARD_NOT_IN_PLACE", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith("MULTISIG_GUARD_NOT_IN_PLACE");
    });

    it("setGuard should be processed", async function () {
      const tx = await mockGnosisSafe.setGuard(cinchSafeGuard.address);
      expect(tx).to.emit(mockGnosisSafe, "GuardUpdated");
    });

    it("should revert if REVENUE_CONTRACT_NOT_OWNED_BY_PROVIDED_MULTISIG", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith(
        "REVENUE_CONTRACT_NOT_OWNED_BY_PROVIDED_MULTISIG"
      );
    });
    it("transferOwnership should work", async function () {
      const tx = await mockFeeCollector
        .connect(accounts[0])
        .transferOwnership(mockGnosisSafe.address);
      expect(tx).to.emit(mockFeeCollector, "OwnershipTransferred");
    });

    it("should be activated", async function () {
      const tx01 = mockERC20
        .connect(accounts[0])
        .faucet(rbfVault.address, 1000 * 10 ** 12);
      await expect(tx01).not.to.be.revertedWith();
      const tx03 = await rbfVault.activate();
      expect(tx03).to.emit(rbfVault, "RBFVaultActivated");
    });

    it("should not be activated twice", async function () {
      const tx = rbfVault.activate();
      await expect(tx).to.be.revertedWith("INVALID_STATE");
    });
  });

  describe("Transactions", function () {

    it("can't deposit before approval", async function () {
      const tx = rbfVault.connect(accounts[1]).deposit(500 * mockERC20Decimals, accounts[1].address);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail if sender doesn't have enough funds", async function () {
      await mockERC20.faucet(accounts[1].address, 1000 * mockERC20Decimals);
      await mockERC20.connect(accounts[1]).approve(rbfVault.address, 1000 * mockERC20Decimals);
      const tx = rbfVault.connect(accounts[1]).deposit(1001 * mockERC20Decimals, accounts[1].address);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should be able to deposit", async function () {
      const tx = rbfVault.connect(accounts[1]).deposit(1000 * 1000000, accounts[1].address);
      //await expect(tx).to.equal(1000*(10**6));
      expect(await rbfVault.balanceOf(accounts[1].address)).to.equal(1000 * (10 ** 6));
    });

    it("should be able to withdraw", async function () {
      const tx = rbfVault.connect(accounts[1]).withdraw(1000 * 1000000, accounts[1].address, accounts[1].address);
      expect(await rbfVault.balanceOf(accounts[1].address)).to.equal(0);
    });

  });



});
