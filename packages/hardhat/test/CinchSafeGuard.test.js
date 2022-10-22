/* eslint-disable no-unused-expressions */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

let accounts;
let cinchSafeGuard;
let blockedTarget;
const functionSig = "0x12345678";
const ownerIndex = 0;
const nonOwnerIndex = 1;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
  blockedTarget = accounts[1].address;
});

describe("CinchSafeGuard", function () {
  it("Should deploy CinchSafeGuard", async function () {
    const CinchSafeGuard = await ethers.getContractFactory("CinchSafeGuard");

    cinchSafeGuard = await CinchSafeGuard.deploy();
    expect(cinchSafeGuard.address).to.not.be.undefined;
    console.log("cinchSafeGuard.address: ", cinchSafeGuard.address);
  });

  describe("new address", function () {
    it("isBlockedTarget should return false", async function () {
      const res = await cinchSafeGuard.isBlockedTarget(blockedTarget);
      expect(res).to.not.be.undefined;
      expect(res).equal(false);
    });
    it("isScoped should return false", async function () {
      const res = await cinchSafeGuard.isScoped(blockedTarget);
      expect(res).to.not.be.undefined;
      expect(res).equal(false);
    });
    it("isBlockedFunction should return false", async function () {
      const res = await cinchSafeGuard.isBlockedFunction(
        blockedTarget,
        functionSig
      );
      expect(res).to.not.be.undefined;
      expect(res).equal(false);
    });
  });

  describe("onlyOwner", function () {
    it("non-owner cannot call setTargetBlocked", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .setTargetBlocked(blockedTarget, false);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("non-owner cannot call setScoped", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .setScoped(blockedTarget, false);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("non-owner cannot call setBlockedFunction", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .setBlockedFunction(blockedTarget, functionSig, false);
      await expect(tx).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("setTargetBlocked", function () {
    it("should block target as expected", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setTargetBlocked(blockedTarget, true);
      await expect(tx).to.emit(cinchSafeGuard, "SetTargetBlocked");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          [],
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      // Note: known ethers issue: https://github.com/ethers-io/ethers.js/discussions/2849
      // hardhat 2.9.3 and ethers 5.6.1 required
      await expect(tx2).to.be.revertedWith("Target address is blocked");
    });
    it("should unblock target as expected", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setTargetBlocked(blockedTarget, false);
      await expect(tx).to.emit(cinchSafeGuard, "SetTargetBlocked");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          [],
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      await expect(tx2).not.to.be.revertedWith("Target address is blocked");
    });
  });

  // TODO: uncomment the following test when the implementation is ready
  /*
  describe("setScoped", function () {
    it("should block target as expected", async () => {
      const txA = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setScoped(blockedTarget, true);
      await expect(txA).to.emit(cinchSafeGuard, "SetTargetScoped");

      const txB = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setFallbackBlocked(blockedTarget, true);
      await expect(txB).to.emit(cinchSafeGuard, "SetFallbackBlockedOnTarget");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          [],
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      await expect(tx2).to.be.revertedWith(
        "Fallback is blocked for this address"
      );
    });
  });
  */

  describe("setBlockedFunction", function () {
    it("should block function as expected", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setBlockedFunction(blockedTarget, functionSig, true);
      await expect(tx).to.emit(cinchSafeGuard, "SetFunctionBlockedOnTarget");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          functionSig,
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      await expect(tx2).to.be.revertedWith("Target function is blocked");
    });
    it("should unblock target as expected", async () => {
      const tx = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setBlockedFunction(blockedTarget, functionSig, false);
      await expect(tx).to.emit(cinchSafeGuard, "SetFunctionBlockedOnTarget");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          functionSig,
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      await expect(tx2).not.to.be.revertedWith("Target function is blocked");
    });
  });

  describe("setOverrideGuardChecks", function () {
    it("should unblock as expected", async () => {
      const txA = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setOverrideGuardChecks(true);
      await expect(txA).not.to.be.revertedWith("");

      const txB = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setBlockedFunction(blockedTarget, functionSig, true);
      await expect(txB).to.emit(cinchSafeGuard, "SetFunctionBlockedOnTarget");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          functionSig,
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      await expect(tx2).not.to.be.revertedWith("Target function is blocked");
    });
    it("should block target as expected", async () => {
      const txA = cinchSafeGuard
        .connect(accounts[ownerIndex])
        .setOverrideGuardChecks(false);
      await expect(txA).not.to.be.revertedWith("");

      const tx2 = cinchSafeGuard
        .connect(accounts[nonOwnerIndex])
        .checkTransaction(
          blockedTarget,
          0,
          functionSig,
          0,
          0,
          0,
          0,
          blockedTarget,
          blockedTarget,
          [],
          accounts[nonOwnerIndex].address
        );
      await expect(tx2).to.be.revertedWith("Target function is blocked");
    });
  });
});
