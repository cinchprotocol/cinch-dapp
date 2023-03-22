/* eslint-disable no-unused-expressions */
const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

let accounts;
let owner;
let user1;
let user2;
let user3;
let initAmount0;
let depositAmount1;
let depositAmount1Plus;
let depositAmount2;
let depositAmount1Half;
let depositAmount2Half;
let depositAmount3;
let revenueShareAmount3;

let mockProtocol;
let mockGnosisSafe;
let cinchSafeGuard;
let vault;
let mockERC20;
let mockERC20Decimals = 6;
let feeSplitterAddress;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
  owner = accounts[0];
  user1 = accounts[1];
  user2 = accounts[2];
  user3 = accounts[3];
  initAmount0 = ethers.utils.parseUnits("1000", mockERC20Decimals);
  depositAmount1 = ethers.utils.parseUnits("500", mockERC20Decimals);
  depositAmount1Plus = ethers.utils.parseUnits("501", mockERC20Decimals);
  depositAmount1Half = depositAmount1.div(2);
  depositAmount2 = ethers.utils.parseUnits("1000", mockERC20Decimals);
  depositAmount2Half = depositAmount2.div(2);
  depositAmount3 = ethers.utils.parseUnits("1000", mockERC20Decimals);
  revenueShareAmount3 = ethers.utils.parseUnits("150", mockERC20Decimals);
});

describe("Vault tests", function () {
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

    it("Should update vault feeSplitter", async function () {
      feeSplitterAddress = vault.address;
      const tx0 = await vault.setFeeSplitter(feeSplitterAddress);
      expect(tx0).to.emit(vault, "FeeSplitterUpdated");
    });
  });

  describe("activate", function () {
    it("should revert if FEE_COLLECTOR_RECEIVER_NOT_UPDATED", async function () {
      const tx = vault.activate();
      await expect(tx).to.be.revertedWith("FEE_COLLECTOR_RECEIVER_NOT_UPDATED");
    });

    it("feeReceiver should be updated", async function () {
      const tx = await mockProtocol.setFeeReceiver(feeSplitterAddress);
      expect(tx).to.emit(mockProtocol, "FeeReceiverUpdated");
    });

    it("should revert if MULTISIG_GUARD_NOT_IN_PLACE", async function () {
      const tx = vault.activate();
      await expect(tx).to.be.revertedWith("MULTISIG_GUARD_NOT_IN_PLACE");
    });

    it("setGuard should be processed", async function () {
      const tx = await mockGnosisSafe.setGuard(cinchSafeGuard.address);
      expect(tx).to.emit(mockGnosisSafe, "GuardUpdated");
    });

    it("should revert if REVENUE_CONTRACT_NOT_OWNED_BY_PROVIDED_MULTISIG", async function () {
      const tx = vault.activate();
      await expect(tx).to.be.revertedWith(
        "REVENUE_CONTRACT_NOT_OWNED_BY_PROVIDED_MULTISIG"
      );
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

    it("should not be activated twice", async function () {
      const tx = vault.activate();
      await expect(tx).to.be.revertedWith("INVALID_STATE");
    });
  });

  describe("Transactions", function () {
    it("can't deposit before approval", async function () {
      const tx = vault
        .connect(user1)
        .depositWithReferral(depositAmount1, user1.address, user1.address);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail if sender doesn't have enough funds", async function () {
      await mockERC20.faucet(user1.address, depositAmount1);
      await mockERC20.connect(user1).approve(vault.address, depositAmount1);
      const tx = vault
        .connect(user1)
        .depositWithReferral(depositAmount1Plus, user1.address, user1.address);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should be able to deposit", async function () {
      await vault.connect(user1).deposit(depositAmount1, user1.address);

      expect(await vault.balanceOf(user1.address)).to.equal(depositAmount1);
      expect(await vault.totalSharesByReferral(user1.address)).to.equal(
        depositAmount1
      );
      expect(
        await vault.assetBalanceAtYieldSourceOf(user1.address, user1.address)
      ).to.equal(depositAmount1);

      console.log("User Balance: " + (await vault.balanceOf(user1.address)));
      console.log("Max withdraw: " + (await vault.maxWithdraw(user1.address)));
      console.log(
        "Protocol Balance: " + (await mockERC20.balanceOf(mockProtocol.address))
      );
    });

    it("should be able to deposit with referral", async function () {
      console.log(
        "Referral Balance before: " +
          (await vault.totalSharesByReferral(user2.address))
      );

      await mockERC20.faucet(user2.address, depositAmount2);
      await mockERC20.connect(user2).approve(vault.address, depositAmount2);
      await vault
        .connect(user2)
        .depositWithReferral(depositAmount2, user2.address, user2.address);

      expect(await vault.balanceOf(user2.address)).to.equal(depositAmount2);
      expect(await vault.totalSharesByReferral(user2.address)).to.equal(
        depositAmount2
      );

      console.log("User Balance: " + (await vault.balanceOf(user2.address)));
      console.log("Max withdraw: " + (await vault.maxWithdraw(user2.address)));
      console.log(
        "Protocol Balance: " + (await mockERC20.balanceOf(mockProtocol.address))
      );
      console.log(
        "Referral Balance: " +
          (await vault.totalSharesByReferral(user2.address))
      );
    });

    it("should be able to redeem partial", async function () {
      await vault
        .connect(user1)
        .redeem(depositAmount1Half, user1.address, user1.address);

      expect(await vault.balanceOf(user1.address)).to.equal(
        depositAmount1.sub(depositAmount1Half)
      );
      console.log(
        "Protocol Balance: " + (await mockERC20.balanceOf(mockProtocol.address))
      );
    });

    it("should be able to redeem remaining", async function () {
      await vault
        .connect(user1)
        .redeem(depositAmount1Half, user1.address, user1.address);

      expect(await vault.balanceOf(user1.address)).to.equal(0);
      console.log(
        "Protocol Balance: " + (await mockERC20.balanceOf(mockProtocol.address))
      );
    });

    it("should be able to withdraw partial with referral", async function () {
      console.log(
        "Referral Balance before: " +
          (await vault.totalSharesByReferral(user2.address))
      );
      await vault
        .connect(user2)
        .withdrawWithReferral(depositAmount2Half, user2.address, user2.address);

      expect(await vault.balanceOf(user2.address)).to.equal(depositAmount2Half);
      expect(await vault.totalSharesByReferral(user2.address)).to.equal(
        depositAmount2Half
      );

      console.log(
        "Protocol Balance: " + (await mockERC20.balanceOf(mockProtocol.address))
      );
      console.log(
        "Referral Balance: " +
          (await vault.totalSharesByReferral(user2.address))
      );
    });
  });

  describe("GeneralRevenueShare", function () {
    it("should be able to addRevenueShareReferral", async function () {
      const tx01 = await vault.addRevenueShareReferral(user1.address);
      expect(tx01)
        .to.emit(vault, "RevenueShareReferralAdded")
        .withArgs(user1.address);
      const tx02 = await vault.addRevenueShareReferral(user2.address);
      expect(tx02)
        .to.emit(vault, "RevenueShareReferralAdded")
        .withArgs(user2.address);
      const tx03 = await vault.addRevenueShareReferral(user3.address);
      expect(tx03)
        .to.emit(vault, "RevenueShareReferralAdded")
        .withArgs(user3.address);
      expect((await vault.getRevenueShareReferralSet()).length).equal(3);
    });

    it("should be able to deposit with referral", async function () {
      await mockERC20.faucet(user3.address, depositAmount3);
      await mockERC20.connect(user3).approve(vault.address, depositAmount3);
      await vault
        .connect(user3)
        .depositWithReferral(depositAmount3, user3.address, user3.address);

      expect(await vault.balanceOf(user3.address)).to.equal(depositAmount3);
      expect(await vault.totalSharesByReferral(user3.address)).to.equal(
        depositAmount3
      );
    });

    it("should be able to deposit to revenue share", async function () {
      await mockERC20.faucet(user3.address, revenueShareAmount3);
      await mockERC20
        .connect(user3)
        .approve(vault.address, revenueShareAmount3);
      const tx01 = await vault
        .connect(user3)
        .depositToRevenueShare(
          user3.address,
          mockERC20.address,
          revenueShareAmount3
        );
      expect(tx01)
        .to.emit(vault, "RevenueShareDeposited")
        .withArgs(user3.address, mockERC20.address, revenueShareAmount3);

      const totalSharesInReferral = await vault.totalSharesInReferral();
      const totalSharesByReferral = await vault.totalSharesByReferral(
        user3.address
      );
      const revenueShareBalanceByAssetReferral =
        await vault.revenueShareBalanceByAssetReferral(
          mockERC20.address,
          user3.address
        );
      expect(revenueShareBalanceByAssetReferral).equal(
        revenueShareAmount3
          .mul(totalSharesByReferral)
          .div(totalSharesInReferral)
      );
    });

    it("should be able to withdraw from revenue share", async function () {
      const user3assets0 = await mockERC20.balanceOf(user3.address);
      const revenueShareBalanceByAssetReferral01 =
        await vault.revenueShareBalanceByAssetReferral(
          mockERC20.address,
          user3.address
        );
      const tx01 = await vault
        .connect(user3)
        .withdrawFromRevenueShare(
          mockERC20.address,
          revenueShareBalanceByAssetReferral01,
          user3.address
        );
      expect(tx01)
        .to.emit(vault, "RevenueShareWithdrawn")
        .withArgs(
          mockERC20.address,
          revenueShareBalanceByAssetReferral01,
          user3.address,
          user3.address
        );
      expect(
        await vault.revenueShareBalanceByAssetReferral(
          mockERC20.address,
          user3.address
        )
      ).equal(0);
      const user3assets1 = await mockERC20.balanceOf(user3.address);
      expect(user3assets1.sub(user3assets0)).equal(
        revenueShareBalanceByAssetReferral01
      );
      expect(
        await vault.totalRevenueShareProcessedByAsset(mockERC20.address)
      ).equal(revenueShareAmount3);
    });

    it("should be able to removeRevenueShareReferral", async function () {
      const tx01 = await vault.removeRevenueShareReferral(user1.address);
      expect(tx01)
        .to.emit(vault, "RevenueShareReferralRemoved")
        .withArgs(user1.address);
    });
  });
});
