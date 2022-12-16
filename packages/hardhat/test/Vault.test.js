/* eslint-disable no-unused-expressions */
const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const sellerAccountIndex = 1;
const buyerAccountIndex = 2;

let accounts;
let mockProtocol;
let mockGnosisSafe;
let cinchSafeGuard;
let vault;
let mockERC20;
let mockERC20Decimals;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
});

describe("Vault tests", function () {
  describe("Deploy", function () {

    it("Should deploy MockFeeCollector", async function () {
      const MockFeeCollector = await ethers.getContractFactory(
        "MockProtocol"
      );

      mockProtocol = await MockFeeCollector.deploy();
      expect(mockProtocol.address).to.not.be.undefined;
      console.log("mockFeeCollector.address: ", mockProtocol.address);
    });

    it("Should deploy MockGnosisSafe", async function () {
      const MockGnosisSafe = await ethers.getContractFactory("MockGnosisSafe");

      mockGnosisSafe = await MockGnosisSafe.deploy();
      expect(mockGnosisSafe.address).to.not.be.undefined;
      console.log("mockGnosisSafe.address: ", mockGnosisSafe.address);
    });

    it("Should deploy MockERC20", async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
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

    it("Should deploy and Initialize Vault", async function () {
      const Vault = await ethers.getContractFactory("Vault", accounts[0]);

      vault = await upgrades.deployProxy(Vault, [
        mockERC20.address,
        "CinchPx",
        "CPX",
        mockProtocol.address,
        mockGnosisSafe.address,
        cinchSafeGuard.address
      ]);

      expect(vault.address).to.not.be.undefined;
      console.log("vault.address: ", vault.address);
    });

  });

  describe("activate", function () {
    it("should revert if FEE_COLLECTOR_RECEIVER_NOT_UPDATED", async function () {
      const tx = vault.activate();
      await expect(tx).to.be.revertedWith("FEE_COLLECTOR_RECEIVER_NOT_UPDATED");
    });

    it("feeReceiver should be updated", async function () {
      const tx = await mockProtocol.setFeeReceiver(vault.address);
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
        .connect(accounts[0])
        .transferOwnership(mockGnosisSafe.address);
      expect(tx).to.emit(mockProtocol, "OwnershipTransferred");
    });

    it("should be activated", async function () {
      const tx01 = mockERC20
        .connect(accounts[0])
        .faucet(vault.address, 1000 * (10 ** mockERC20Decimals));
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
      const tx = vault.connect(accounts[1]).deposit(500 * (10 ** mockERC20Decimals), accounts[1].address);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail if sender doesn't have enough funds", async function () {
      await mockERC20.faucet(accounts[1].address, 1000 * (10 ** mockERC20Decimals));
      await mockERC20.connect(accounts[1]).approve(vault.address, 1000 * (10 ** mockERC20Decimals));
      const tx = vault.connect(accounts[1]).deposit(1001 * (10 ** mockERC20Decimals), accounts[1].address);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should be able to deposit", async function () {
      const tx = await vault.connect(accounts[1]).deposit(750 * (10 ** mockERC20Decimals), accounts[1].address);

      expect(await vault.balanceOf(accounts[1].address)).to.equal(750 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(0);

      console.log("User Balance: " + await vault.balanceOf(accounts[1].address));
      console.log("Max withdraw: " + await vault.maxWithdraw(accounts[1].address));
      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
    });

    it("should be able to deposit with referral", async function () {
      console.log("Referral Balance before: " + await vault.getTotalValueLocked(accounts[9].address));

      await mockERC20.faucet(accounts[2].address, 1100 * (10 ** mockERC20Decimals));
      await mockERC20.connect(accounts[2]).approve(vault.address, 1100 * (10 ** mockERC20Decimals));
      const tx = await vault.connect(accounts[2]).depositWithReferral(1100 * (10 ** mockERC20Decimals), accounts[2].address, accounts[9].address);

      expect(await vault.balanceOf(accounts[2].address)).to.equal(1100 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(1100 * (10 ** mockERC20Decimals));

      console.log("User Balance: " + await vault.balanceOf(accounts[2].address));
      console.log("Max withdraw: " + await vault.maxWithdraw(accounts[2].address));
      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
      console.log("Referral Balance: " + await vault.getTotalValueLocked(accounts[9].address));
    });

    it("should be able to withdraw partial", async function () {
      const tx = await vault.connect(accounts[1]).withdraw(500 * (10 ** mockERC20Decimals), accounts[1].address, accounts[1].address);
      expect(await vault.balanceOf(accounts[1].address)).to.equal(250 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(1100 * (10 ** mockERC20Decimals));
      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
    });

    it("should be able to deposit with 2nd referral", async function () {
      console.log("Referral Balance before: " + await vault.getTotalValueLocked(accounts[8].address));

      await mockERC20.faucet(accounts[3].address, 1000 * (10 ** mockERC20Decimals));
      await mockERC20.connect(accounts[3]).approve(vault.address, 1000 * (10 ** mockERC20Decimals));
      const tx = await vault.connect(accounts[3]).depositWithReferral(1000 * (10 ** mockERC20Decimals), accounts[3].address, accounts[8].address);

      expect(await vault.balanceOf(accounts[3].address)).to.equal(1000 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(1100 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[8].address)).to.equal(1000 * (10 ** mockERC20Decimals));

      console.log("User Balance: " + await vault.balanceOf(accounts[3].address));
      console.log("Max withdraw: " + await vault.maxWithdraw(accounts[3].address));
      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
      console.log("Referral Balance: " + await vault.getTotalValueLocked(accounts[8].address));
    });

    it("should be able to withdraw remaining", async function () {
      const tx = await vault.connect(accounts[1]).withdraw(250 * (10 ** mockERC20Decimals), accounts[1].address, accounts[1].address);

      expect(await vault.balanceOf(accounts[1].address)).to.equal(0);
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(1100 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[8].address)).to.equal(1000 * (10 ** mockERC20Decimals));

      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
    });

    it("should be able to withdraw partial with referral", async function () {
      console.log("Referral Balance before: " + await vault.getTotalValueLocked(accounts[9].address));
      const tx = await vault.connect(accounts[2]).withdrawWithReferral(600 * (10 ** mockERC20Decimals), accounts[2].address, accounts[2].address, accounts[9].address);

      expect(await vault.balanceOf(accounts[2].address)).to.equal(500 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(500 * (10 ** mockERC20Decimals));
      expect(await vault.getTotalValueLocked(accounts[8].address)).to.equal(1000 * (10 ** mockERC20Decimals));

      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
      console.log("Referral Balance: " + await vault.getTotalValueLocked(accounts[9].address));
    });

    it("should be able to withdraw remaining balance with referral", async function () {
      const tx = await vault.connect(accounts[2]).withdrawWithReferral(500 * (10 ** mockERC20Decimals), accounts[2].address, accounts[2].address, accounts[9].address);

      expect(await vault.balanceOf(accounts[2].address)).to.equal(0);
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(0);
      expect(await vault.getTotalValueLocked(accounts[8].address)).to.equal(1000 * (10 ** mockERC20Decimals));

      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
      console.log("Referral Balance: " + await vault.getTotalValueLocked(accounts[9].address));
    });

    it("should be able to withdraw remaining balance with 2nd referral", async function () {
      const tx = await vault.connect(accounts[3]).withdrawWithReferral(1000 * (10 ** mockERC20Decimals), accounts[3].address, accounts[3].address, accounts[8].address);

      expect(await vault.balanceOf(accounts[3].address)).to.equal(0);
      expect(await vault.getTotalValueLocked(accounts[9].address)).to.equal(0);
      expect(await vault.getTotalValueLocked(accounts[8].address)).to.equal(0);

      console.log("Protocol Balance: " + await mockERC20.balanceOf(mockProtocol.address));
      console.log("Referral Balance: " + await vault.getTotalValueLocked(accounts[9].address));
    });


  });

});
