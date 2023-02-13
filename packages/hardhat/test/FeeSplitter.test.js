/* eslint-disable no-unused-expressions */
const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

let accounts;
let mockERC20;
let mockProtocol;
let mockCinchPx;
let feeSplitter;
let accountOwner;
const accountIndexProtocolPayee = 1;
const accountIndexCinchPxPayee = 2;
const accountIndexCinchPxPayee02 = 3;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
  accountOwner = accounts[0];
  console.log("accounts: ", accountOwner.address);
});

describe("FeeSplitter", function () {
  describe("Deploy", function () {
    it("Should deploy MockERC20", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      mockERC20 = await MockERC20.deploy();
      expect(mockERC20.address).to.not.be.undefined;
    });

    it("Should deploy SampleProtocol", async function () {
      const MockProtocol = await ethers.getContractFactory("MockProtocol");
      mockProtocol = await MockProtocol.deploy(mockERC20.address);
      expect(mockProtocol.address).to.not.be.undefined;
    });

    it("Should deploy MockCinchPx", async function () {
      const MockCinchPx = await ethers.getContractFactory("MockCinchPx");
      mockCinchPx = await MockCinchPx.deploy();
      expect(mockCinchPx.address).to.not.be.undefined;
    });

    it("Should not initialize FeeSplitter", async function () {
      const FeeSplitter = await ethers.getContractFactory("FeeSplitter");
      const feeSplitterX = await FeeSplitter.deploy();

      const tx01 = feeSplitterX.initialize(
        ethers.constants.AddressZero,
        mockProtocol.address,
        [mockERC20.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx01).to.be.revertedWith("cinchPxAddress is zero");

      const tx02 = feeSplitterX.initialize(
        mockCinchPx.address,
        ethers.constants.AddressZero,
        [mockERC20.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx02).to.be.revertedWith("protocolAddress is zero");

      const tx03 = feeSplitterX.initialize(
        mockCinchPx.address,
        mockProtocol.address,
        [ethers.constants.AddressZero],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx03).to.be.revertedWith("tokenAddress is zero");

      const tx04 = feeSplitterX.initialize(
        mockCinchPx.address,
        mockProtocol.address,
        [mockERC20.address],
        ethers.constants.AddressZero,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx04).to.be.revertedWith("protocolPayee_ is zero");

      const tx05 = feeSplitterX.initialize(
        mockCinchPx.address,
        mockProtocol.address,
        [mockERC20.address],
        accounts[accountIndexProtocolPayee].address,
        [ethers.constants.AddressZero]
      );
      await expect(tx05).to.be.revertedWith("cinchPxPayee is zero");
    });

    it("Should deploy FeeSplitter", async function () {
      const FeeSplitter = await ethers.getContractFactory(
        "FeeSplitter",
        accountOwner
      );
      feeSplitter = await upgrades.deployProxy(FeeSplitter, [
        mockCinchPx.address,
        mockProtocol.address,
        [mockERC20.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address],
      ]);
      const contractReceipt = await feeSplitter.deployed();
      expect(feeSplitter.address).to.not.be.undefined;
      console.log(
        "feeSplitter.address: ",
        feeSplitter.address,
        ", tx: ",
        contractReceipt.transactionHash
      );
    });
  });

  describe("FeeSplitter", function () {
    it("getProtocolPayee should work", async () => {
      const res = await feeSplitter.getProtocolPayee();
      expect(res).to.equal(accounts[accountIndexProtocolPayee].address);
    });
    it("getSupportedERC20Set should work", async () => {
      const res = await feeSplitter.getSupportedERC20Set();
      expect(res.length).to.equal(1);
      expect(res[0]).to.equal(mockERC20.address);
    });
    it("getCinchPxPayeeSet should work", async () => {
      const res = await feeSplitter.getCinchPxPayeeSet();
      expect(res.length).to.equal(1);
      expect(res[0]).to.equal(accounts[accountIndexCinchPxPayee].address);
    });
    it("addCinchPxPayee should not work", async () => {
      const tx = feeSplitter.addCinchPxPayee(
        accounts[accountIndexCinchPxPayee].address
      );
      await expect(tx).to.be.revertedWith("cinchPxPayee already exists");
    });
    it("addCinchPxPayee should work", async () => {
      const tx = await feeSplitter.addCinchPxPayee(
        accounts[accountIndexCinchPxPayee02].address
      );
      expect(tx).to.emit(feeSplitter, "CinchPxPayeeAdded");

      const res = await feeSplitter.getCinchPxPayeeSet();
      expect(res.length).to.equal(2);
    });
    describe("processFeeSplit", async () => {
      it("should not work when protocolTVL is zero", async () => {
        const tx = feeSplitter.processFeeSplit();
        await expect(tx).to.be.revertedWith("protocolTVL is zero");
      });
      it("should not work when protocolTVL is positive", async () => {
        await mockProtocol.setTotalValueLocked(1000);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res).to.equal(0);
      });
      it("should split all the fee to protocolPayee", async () => {
        await mockERC20.faucet(feeSplitter.address, 100);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res).to.equal(100);
        const res02 = await feeSplitter.getTotalProcessed(mockERC20.address);
        expect(res02).to.equal(100);
      });
      it("should split 25% fee to cinchPxPayee", async () => {
        await mockCinchPx.setTotalValueLocked(
          accounts[accountIndexCinchPxPayee].address,
          500
        );
        await mockERC20.faucet(feeSplitter.address, 100);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(res).to.equal(25);
        const res02 = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res02).to.equal(175);
        const res03 = await feeSplitter.getTotalProcessed(mockERC20.address);
        expect(res03).to.equal(200);
      });
      it("should split 50% fee to cinchPxPayee", async () => {
        await mockERC20.faucet(feeSplitter.address, 100);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(res).to.equal(75);
        const res02 = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res02).to.equal(225);
        const res03 = await feeSplitter.getTotalProcessed(mockERC20.address);
        expect(res03).to.equal(300);
      });
    }); // end of processFeeSplit
    describe("release", async () => {
      it("should not work when tokenAddress is zero", async () => {
        const tx = feeSplitter.release(
          ethers.constants.AddressZero,
          accounts[accountIndexProtocolPayee].address
        );
        await expect(tx).to.be.revertedWith("tokenAddress is zero address");
      });
      it("should not work when payee is zero", async () => {
        const tx = feeSplitter.release(
          mockERC20.address,
          ethers.constants.AddressZero
        );
        await expect(tx).to.be.revertedWith("payee is zero address");
      });
      it("should not work when token is not supported", async () => {
        const tx = feeSplitter.release(
          accounts[accountIndexProtocolPayee].address,
          accounts[accountIndexProtocolPayee].address
        );
        await expect(tx).to.be.revertedWith("token is not supported");
      });
      it("should not work when payee is invalid", async () => {
        const tx = feeSplitter.release(mockERC20.address, accountOwner.address);
        await expect(tx).to.be.revertedWith("invalid payee");
      });
      it("should not work when internal balance is zero", async () => {
        const tx = feeSplitter.release(
          mockERC20.address,
          accounts[accountIndexCinchPxPayee02].address
        );
        await expect(tx).to.be.revertedWith("internalBalance is zero");
      });
      it("should release the payment correctly", async () => {
        const b0 = await mockERC20.balanceOf(
          accounts[accountIndexProtocolPayee].address
        );
        expect(b0).to.equal(0);
        const tx0 = await feeSplitter.release(
          mockERC20.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(tx0).to.emit(feeSplitter, "ERC20PaymentReleased");
        const b1 = await mockERC20.balanceOf(
          accounts[accountIndexProtocolPayee].address
        );
        expect(b1).to.equal(225);
        const i1 = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(i1).to.equal(0);

        const b2 = await mockERC20.balanceOf(
          accounts[accountIndexCinchPxPayee].address
        );
        expect(b2).to.equal(0);

        const tx2 = await feeSplitter.release(
          mockERC20.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(tx2).to.emit(feeSplitter, "ERC20PaymentReleased");
        const b3 = await mockERC20.balanceOf(
          accounts[accountIndexCinchPxPayee].address
        );
        expect(b3).to.equal(75);
        const i3 = await feeSplitter.getInternalBalance(
          mockERC20.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(i3).to.equal(0);
      });
    }); // end of release
  });
});
