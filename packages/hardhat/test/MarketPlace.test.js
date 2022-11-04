/* eslint-disable no-unused-expressions */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const feesCollectorCutPerMillion = 20000;
const sellerAccountIndex = 0;
const buyerAccountIndex = 1;

let accounts;
let feeCollectorAddress;
let multiSigAddress;
let marketPlace;
let mockFeeCollector;
let mockERC20;

before(async function () {
  // get accounts from hardhat
  accounts = await ethers.getSigners();
  multiSigAddress = accounts[0].address;
});

describe("MarketPlace tests", function () {
  describe("MarketPlace", function () {
    it("Should deploy MockERC20", async function () {
      const MockERC20 = await ethers.getContractFactory("TestToken");
      mockERC20 = await MockERC20.deploy();
      expect(mockERC20.address).to.not.be.undefined;
    });

    it("Should deploy MockFeeCollector", async function () {
      const MockFeeCollector = await ethers.getContractFactory(
        "SampleProtocol"
      );
      mockFeeCollector = await MockFeeCollector.deploy();
      expect(mockFeeCollector.address).to.not.be.undefined;
      feeCollectorAddress = mockFeeCollector.address;
      console.log("mockFeeCollector.address: ", mockFeeCollector.address);
    });

    it("Should deploy MarketPlace", async function () {
      const MarketPlace = await ethers.getContractFactory("MarketPlace");
      marketPlace = await MarketPlace.deploy(
        feeCollectorAddress,
        feesCollectorCutPerMillion,
        mockERC20.address
      );
      expect(marketPlace.address).to.not.be.undefined;
      console.log("marketPlace.address: ", marketPlace.address);
    });

    describe("fetchVaultAddressOfItem", function () {
      it("Should return 0 before item was sold", async function () {
        const res = await marketPlace.fetchVaultAddressOfItem(1);
        expect(res).equal(ethers.constants.AddressZero);
      });
    });

    describe("createMarketItem", function () {
      it("Should not be able to createMarketItem with 0 price", async function () {
        const tx = marketPlace.createMarketItem(
          "itemNameErr01",
          feeCollectorAddress,
          multiSigAddress,
          100,
          0,
          10000
        );
        await expect(tx).to.be.revertedWith("PRICE_MUST_BE_GT_0");
      });
      it("Should be able to createMarketItem", async function () {
        const tx = await marketPlace.createMarketItem(
          "itemName01",
          feeCollectorAddress,
          multiSigAddress,
          100,
          1000,
          10000
        );
        expect(tx).to.emit(marketPlace, "MarketItemCreated");
      });
    });

    describe("getMarketItem", function () {
      it("Should be able to getMarketItem", async function () {
        const res = await marketPlace.connect(accounts[0]).getMarketItem(1);
        expect(res).to.not.be.undefined;
        expect(res.name).equal("itemName01");
      });
    });

    describe("placeBid", function () {
      it("Should not be able to placeBid with 0 price", async function () {
        const tx = marketPlace
          .connect(accounts[buyerAccountIndex])
          .placeBid(1, 0, accounts[buyerAccountIndex].address, 1000000, {
            value: 1000,
          });
        await expect(tx).to.be.revertedWith(
          "Bid#_placeBid: PRICE_MUST_BE_GT_0"
        );
      });
      /*
      it("Should not be able to placeBid with incorrect tx value", async function () {
        const tx = marketPlace
          .connect(accounts[buyerAccountIndex])
          .placeBid(1, 1000, accounts[buyerAccountIndex].address, 1000000, {
            value: 1001,
          });
        await expect(tx).to.be.revertedWith(
          "Bid#placeBid: TX_VALUE_SHOULD_BE_SAME_AS_PRICE"
        );
      });
      */
      it("Seller should not be able to placeBid", async function () {
        const tx = marketPlace
          .connect(accounts[sellerAccountIndex])
          .placeBid(1, 1000, accounts[buyerAccountIndex].address, 1000000, {
            value: 1000,
          });
        await expect(tx).to.be.revertedWith(
          "Bid#_placeBid: SELLER_CANT_PLACE_BID"
        );
      });

      it("Should be able to placeBid", async function () {
        const tx = await marketPlace
          .connect(accounts[buyerAccountIndex])
          .placeBid(1, 1000, accounts[buyerAccountIndex].address, 1000000, {
            value: 1000,
          });
        expect(tx).to.emit(marketPlace, "BidCreated");
      });
    });

    describe("fetchBidsOfItem", function () {
      it("Should be able to fetchBidsOfItem", async function () {
        const res = await marketPlace.fetchBidsOfItem(1);
        expect(res).to.not.be.undefined;
        expect(res.length).equal(1);
        expect(res[0].bidder).equal(accounts[buyerAccountIndex].address);
      });
    });

    describe("cancelBid", function () {
      it("ONLY_BIDDER_CAN_CANCEL", async function () {
        const tx = marketPlace.connect(accounts[2]).cancelBid(1);
        await expect(tx).to.be.revertedWith(
          "Bid#getBidByBidder: BIDDER_HAS_NO_ACTIVE_BID_FOR_ITEM"
        );
      });
      it("Should be able to cancelBid", async function () {
        const tx = marketPlace
          .connect(accounts[buyerAccountIndex])
          .cancelBid(1);
        await expect(tx).to.emit(marketPlace, "BidCancelled");
        const res = await marketPlace.fetchBidsOfItem(1);
        expect(res).to.not.be.undefined;
        expect(res.length).equal(0);
      });
      it("Should be able to placeBid again", async function () {
        const tx = await marketPlace
          .connect(accounts[buyerAccountIndex])
          .placeBid(1, 1000, accounts[buyerAccountIndex].address, 1000000, {
            value: 1000,
          });
        expect(tx).to.emit(marketPlace, "BidCreated");
        const res = await marketPlace.fetchBidsOfItem(1);
        expect(res).to.not.be.undefined;
        expect(res.length).equal(1);
      });
    });

    describe("acceptBid", function () {
      it("Only seller can acceptBid", async function () {
        const tx = marketPlace
          .connect(accounts[buyerAccountIndex])
          .acceptBid(1, 0);
        await expect(tx).to.be.revertedWith(
          "Bid#acceptBid: ONLY_SELLER_CAN_ACCEPT"
        );
      });
      it("Should be able to acceptBid", async function () {
        const tx = await marketPlace
          .connect(accounts[sellerAccountIndex])
          .acceptBid(1, 0);
        expect(tx).to.emit(marketPlace, "BidAccepted");
      });
      it("Should not be able to placeBid on sold item", async function () {
        const tx = marketPlace
          .connect(accounts[buyerAccountIndex])
          .placeBid(1, 1000, accounts[buyerAccountIndex].address, 1000000, {
            value: 1000,
          });
        await expect(tx).to.be.revertedWith("Bid#placeBid: ITEM_ALREADY_SOLD");
      });
    });
  });
});
