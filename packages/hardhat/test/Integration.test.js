/* eslint-disable no-unused-expressions */
const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

let accounts;
let owner;
let user2;
let initAmount0;
let depositAmount2;
let feeReleaseAmountA;
let protocolTVLAmount0;

let mockProtocol;
let mockGnosisSafe;
let cinchSafeGuard;
let vault;
let mockERC20;
let mockERC20Decimals = 6;
let feeSplitter;
let protocolPayee3;
let cinchVaultPayee2;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
  owner = accounts[0];
  user2 = accounts[2];
  initAmount0 = ethers.utils.parseUnits("1000", mockERC20Decimals);
  depositAmount2 = ethers.utils.parseUnits("1000", mockERC20Decimals);
  cinchVaultPayee2 = accounts[2];
  protocolPayee3 = accounts[3];
  feeReleaseAmountA = ethers.utils.parseUnits("1000", mockERC20Decimals);
  protocolTVLAmount0 = ethers.utils.parseUnits("9000", mockERC20Decimals);
});

describe("Integration tests", function () {
  describe("Deploy", function () {
    it("Should deploy MockERC20", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      mockERC20 = await MockERC20.deploy();
      mockERC20Decimals = await mockERC20.decimals();
      expect(mockERC20.address).to.not.be.undefined;
    });

    it("Should deploy mockProtocol", async function () {
      const MockProtocol = await ethers.getContractFactory("MockProtocol");
      mockProtocol = await MockProtocol.deploy(mockERC20.address);
      expect(mockProtocol.address).to.not.be.undefined;
      console.log("mockProtocol.address: ", mockProtocol.address);
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

    it("Should deploy and Initialize Vault", async function () {
      const Vault = await ethers.getContractFactory("Vault", owner);
      vault = await upgrades.deployProxy(Vault, [
        mockERC20.address,
        "CinchPx",
        "CPX",
        mockProtocol.address,
        mockGnosisSafe.address,
        cinchSafeGuard.address,
      ]);
      expect(vault.address).to.not.be.undefined;
      console.log("vault.address: ", vault.address);
    });

    it("Should deploy FeeSplitter", async function () {
      const FeeSplitter = await ethers.getContractFactory("FeeSplitter", owner);
      feeSplitter = await upgrades.deployProxy(FeeSplitter, [
        vault.address,
        [mockERC20.address],
        protocolPayee3.address,
        [cinchVaultPayee2.address],
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

    it("Should update vault feeSplitter", async function () {
      const tx0 = await vault.setFeeSplitter(feeSplitter.address);
      expect(tx0).to.emit(vault, "FeeSplitterUpdated");
    });
  });

  describe("activate", function () {
    it("feeReceiver should be updated", async function () {
      const tx = await mockProtocol.setFeeReceiver(feeSplitter.address);
      expect(tx).to.emit(mockProtocol, "FeeReceiverUpdated");
    });

    it("setGuard should be processed", async function () {
      const tx = await mockGnosisSafe.setGuard(cinchSafeGuard.address);
      expect(tx).to.emit(mockGnosisSafe, "GuardUpdated");
    });

    it("transferOwnership should work", async function () {
      const tx = await mockProtocol
        .connect(owner)
        .transferOwnership(mockGnosisSafe.address);
      expect(tx).to.emit(mockProtocol, "OwnershipTransferred");
    });

    it("should be activated", async function () {
      const tx01 = mockERC20.connect(owner).faucet(vault.address, initAmount0);
      await expect(tx01).not.to.be.revertedWith();
      const tx03 = await vault.activate();
      expect(tx03).to.emit(vault, "VaultActivated");
    });
  });

  describe("Transactions", function () {
    it("should be able to deposit initial TVL into mockProtocol", async function () {
      await mockERC20.faucet(owner.address, protocolTVLAmount0);
      await mockERC20
        .connect(owner)
        .approve(mockProtocol.address, protocolTVLAmount0);
      await mockProtocol.connect(owner).deposit(protocolTVLAmount0);

      expect(await mockProtocol.getTotalValueLocked()).to.equal(
        protocolTVLAmount0
      );
    });

    it("should be able to deposit into vault with referral", async function () {
      console.log(
        "Referral Balance before: " +
          (await vault.getTotalValueLocked(user2.address))
      );

      await mockERC20.faucet(user2.address, depositAmount2);
      await mockERC20.connect(user2).approve(vault.address, depositAmount2);
      await vault
        .connect(user2)
        .depositWithReferral(
          depositAmount2,
          user2.address,
          cinchVaultPayee2.address
        );

      expect(await vault.balanceOf(user2.address)).to.equal(depositAmount2);
      expect(await vault.getTotalValueLocked(user2.address)).to.equal(
        depositAmount2
      );
      expect(await mockProtocol.getTotalValueLocked()).to.equal(
        protocolTVLAmount0.add(depositAmount2)
      );
      const tx0 = await feeSplitter.processFeeSplit(); // to update _lastProtocolTVL before releasing fee
      expect(tx0).to.emit(feeSplitter, "FeeSplitProcessed");

      console.log(await vault.balanceOf(user2.address), "user2 vault balance");
      console.log(
        await vault.getTotalValueLocked(cinchVaultPayee2.address),
        "payee2 vault referral TVL"
      );
      console.log(await mockProtocol.getTotalValueLocked(), "protocolTVL");
      console.log(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          cinchVaultPayee2.address
        ),
        "user2 feeSplitter internal balance"
      );
      console.log(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          protocolPayee3.address
        ),
        "protocol feeSplitter internal balance"
      );
    });

    it("protocol should be able to release fee to the feeSplitter", async function () {
      await mockERC20.faucet(mockProtocol.address, feeReleaseAmountA);
      const tx1 = await mockProtocol.releaseFee(
        mockERC20.address,
        feeReleaseAmountA
      );
      expect(tx1).to.emit(mockProtocol, "FeeReleased");
      expect(await mockERC20.balanceOf(feeSplitter.address)).to.equal(
        feeReleaseAmountA
      );
      console.log("before feeSplitter processFeeSplit");
      console.log(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          cinchVaultPayee2.address
        ),
        "cinchVaultPayee2 feeSplitter internal balance"
      );
      console.log(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          protocolPayee3.address
        ),
        "protocol feeSplitter internal balance"
      );
      console.log(
        await feeSplitter.getTotalProcessed(mockERC20.address),
        "feeSplitter total processed"
      );
    });

    it("feeSpliter should split 10% fee to cinchPxPayee", async () => {
      const protocolTVL = await mockProtocol.getTotalValueLocked();
      const tx = await feeSplitter.processFeeSplit();
      expect(tx).to.emit(feeSplitter, "FeeSplitProcessed");
      expect(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          cinchVaultPayee2.address
        )
      ).to.equal(feeReleaseAmountA.mul(depositAmount2).div(protocolTVL));
      expect(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          protocolPayee3.address
        )
      ).to.equal(
        feeReleaseAmountA
          .mul(protocolTVLAmount0)
          .div(protocolTVLAmount0.add(depositAmount2))
      );
      expect(await feeSplitter.getTotalProcessed(mockERC20.address)).to.equal(
        feeReleaseAmountA
      );

      console.log("after feeSplitter processFeeSplit");
      console.log(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          cinchVaultPayee2.address
        ),
        "cinchVaultPayee2 feeSplitter internal balance"
      );
      console.log(
        await feeSplitter.getInternalBalance(
          mockERC20.address,
          protocolPayee3.address
        ),
        "protocol feeSplitter internal balance"
      );
      console.log(
        await feeSplitter.getTotalProcessed(mockERC20.address),
        "feeSplitter total processed"
      );
    });
  });
});
