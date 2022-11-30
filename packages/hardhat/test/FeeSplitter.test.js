/* eslint-disable no-unused-expressions */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

let accounts;
let testToken;
let sampleProtocol;
let mockCinchPx;
let feeSplitter;
const accountIndexOwner = 0;
const accountIndexProtocolPayee = 1;
const accountIndexCinchPxPayee = 2;
const accountIndexCinchPxPayee02 = 3;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
  console.log("accounts: ", accounts[accountIndexOwner].address);
});

describe("FeeSplitter", function () {
  describe("Deploy", function () {
    it("Should deploy TestToken", async function () {
      const TestToken = await ethers.getContractFactory("TestToken");
      testToken = await TestToken.deploy();
      expect(testToken.address).to.not.be.undefined;
    });

    it("Should deploy SampleProtocol", async function () {
      const SampleProtocol = await ethers.getContractFactory("SampleProtocol");
      sampleProtocol = await SampleProtocol.deploy();
      expect(sampleProtocol.address).to.not.be.undefined;
    });

    it("Should deploy MockCinchPx", async function () {
      const MockCinchPx = await ethers.getContractFactory("MockCinchPx");
      mockCinchPx = await MockCinchPx.deploy();
      expect(mockCinchPx.address).to.not.be.undefined;
    });

    it("Should not initialize FeeSplitter", async function () {
      const FeeSplitter = await ethers.getContractFactory("FeeSplitter");
      feeSplitter = await FeeSplitter.deploy();

      const tx01 = feeSplitter.initialize(
        ethers.constants.AddressZero,
        sampleProtocol.address,
        [testToken.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx01).to.be.revertedWith("cinchPxAddress is zero");

      const tx02 = feeSplitter.initialize(
        mockCinchPx.address,
        ethers.constants.AddressZero,
        [testToken.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx02).to.be.revertedWith("protocolAddress is zero");

      const tx03 = feeSplitter.initialize(
        mockCinchPx.address,
        sampleProtocol.address,
        [ethers.constants.AddressZero],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx03).to.be.revertedWith("tokenAddress is zero");

      const tx04 = feeSplitter.initialize(
        mockCinchPx.address,
        sampleProtocol.address,
        [testToken.address],
        ethers.constants.AddressZero,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx04).to.be.revertedWith("protocolPayee_ is zero");

      const tx05 = feeSplitter.initialize(
        mockCinchPx.address,
        sampleProtocol.address,
        [testToken.address],
        accounts[accountIndexProtocolPayee].address,
        [ethers.constants.AddressZero]
      );
      await expect(tx05).to.be.revertedWith("cinchPxPayee is zero");
    });

    it("Should initialize FeeSplitter", async function () {
      const tx01 = feeSplitter.initialize(
        mockCinchPx.address,
        sampleProtocol.address,
        [testToken.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      expect(feeSplitter.address).to.not.be.undefined;
      console.log("feeSplitter.address: ", feeSplitter.address);
      await expect(tx01).not.to.be.revertedWith("");

      const tx02 = feeSplitter.initialize(
        mockCinchPx.address,
        sampleProtocol.address,
        [testToken.address],
        accounts[accountIndexProtocolPayee].address,
        [accounts[accountIndexCinchPxPayee].address]
      );
      await expect(tx02).to.be.revertedWith(
        "Initializable: contract is already initialized"
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
      expect(res[0]).to.equal(testToken.address);
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
        await sampleProtocol.setTotalValueLocked(1000);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res).to.equal(0);
      });
      it("should split all the fee to protocolPayee", async () => {
        await testToken.faucet(feeSplitter.address, 100);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res).to.equal(100);
        const res02 = await feeSplitter.getTotalProcessed(testToken.address);
        expect(res02).to.equal(100);
      });
      it("should split 25% fee to cinchPxPayee", async () => {
        await mockCinchPx.setTotalValueLocked(
          accounts[accountIndexCinchPxPayee].address,
          500
        );
        await testToken.faucet(feeSplitter.address, 100);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(res).to.equal(25);
        const res02 = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res02).to.equal(175);
        const res03 = await feeSplitter.getTotalProcessed(testToken.address);
        expect(res03).to.equal(200);
      });
      it("should split 50% fee to cinchPxPayee", async () => {
        await testToken.faucet(feeSplitter.address, 100);
        const tx = await feeSplitter.processFeeSplit();
        expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
        const res = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(res).to.equal(75);
        const res02 = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(res02).to.equal(225);
        const res03 = await feeSplitter.getTotalProcessed(testToken.address);
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
          testToken.address,
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
        const tx = feeSplitter.release(
          testToken.address,
          accounts[accountIndexOwner].address
        );
        await expect(tx).to.be.revertedWith("invalid payee");
      });
      it("should not work when internal balance is zero", async () => {
        const tx = feeSplitter.release(
          testToken.address,
          accounts[accountIndexCinchPxPayee02].address
        );
        await expect(tx).to.be.revertedWith("internalBalance is zero");
      });
      it("should release the payment correctly", async () => {
        const b0 = await testToken.balanceOf(
          accounts[accountIndexProtocolPayee].address
        );
        expect(b0).to.equal(0);
        const tx0 = await feeSplitter.release(
          testToken.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(tx0).to.emit(feeSplitter, "ERC20PaymentReleased");
        const b1 = await testToken.balanceOf(
          accounts[accountIndexProtocolPayee].address
        );
        expect(b1).to.equal(225);
        const i1 = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexProtocolPayee].address
        );
        expect(i1).to.equal(0);

        const b2 = await testToken.balanceOf(
          accounts[accountIndexCinchPxPayee].address
        );
        expect(b2).to.equal(0);

        const tx2 = await feeSplitter.release(
          testToken.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(tx2).to.emit(feeSplitter, "ERC20PaymentReleased");
        const b3 = await testToken.balanceOf(
          accounts[accountIndexCinchPxPayee].address
        );
        expect(b3).to.equal(75);
        const i3 = await feeSplitter.getInternalBalance(
          testToken.address,
          accounts[accountIndexCinchPxPayee].address
        );
        expect(i3).to.equal(0);
      });
    }); // end of release
  });
});
