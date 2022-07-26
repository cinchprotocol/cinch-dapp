const { utils } = require("ethers");
import { displayError } from "./errorhelper";

export const getAllRevenueStreamForSale = async web3 => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract) {
    return [];
  }
  const itemCount = await marketPlaceContract?.getMarketItemCount();
  const outputData = [];
  for (let i = 1; i <= itemCount; i++) {
    const doc = await getOneRevenueStreamForSaleWith(web3, i);
    outputData.push(doc);
  }
  return outputData;
};

export const getOneRevenueStreamForSaleWith = async (web3, id) => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract) {
    return {};
  }
  const item = await marketPlaceContract?.getMarketItem(id);
  const vaultAddress = await marketPlaceContract?.fetchVaultAddressOfItem(id);
  const doc = {
    ...item,
    id,
    key: id,
    name: item?.name,
    priceStr: utils.formatUnits(item?.price, process.env.PRICE_DECIMALS),
    revenuePctStr: _.toNumber(utils.formatEther(item?.revenuePct)).toFixed(0),
    expAmountStr: utils.formatUnits(item?.expAmount, process.env.PRICE_DECIMALS),
    isActive: true,
    vaultAddress,
  };
  return doc;
};

export const formatBid = bid => {
  return {
    ...bid,
    itemIdStr: utils.formatUnits(bid?.itemId, 0),
    priceStr: utils.formatUnits(bid?.price, process.env.PRICE_DECIMALS),
  };
};

export const getBidByBidderOfRevenueStream = async (web3, revenueStreamId, bidderAddress) => {
  try {
    const marketPlaceContract = web3?.readContracts["MarketPlace"];
    if (!marketPlaceContract || !revenueStreamId || !bidderAddress) {
      return null;
    }
    const bid = await marketPlaceContract?.getBidByBidder(revenueStreamId, bidderAddress);
    bid.stream = await getOneRevenueStreamForSaleWith(web3, revenueStreamId);
    return formatBid(bid);
  } catch (err) {
    //displayError("getBidByBidderOfRevenueStream", err);
    console.log("getBidByBidderOfRevenueStream", err);
    return [];
  }
};

export const fetchBidsOfRevenueStream = async (web3, revenueStreamId) => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract || !revenueStreamId) {
    return [];
  }
  const datas = [];
  const bids = await marketPlaceContract?.fetchBidsOfItem(revenueStreamId);
  const stream = await getOneRevenueStreamForSaleWith(web3, revenueStreamId);
  for (const bid of bids) {
    const data = formatBid(bid);
    data.stream = stream;
    datas.push(data);
  }
  return datas;
};

export const fetchBidOf = async (web3, revenueStreamId, bidId) => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract || !revenueStreamId || !bidId) {
    return null;
  }
  const bid = await marketPlaceContract?.getBidByItem(revenueStreamId, bidId);
  const data = formatBid(bid);
  data.stream = await getOneRevenueStreamForSaleWith(web3, revenueStreamId);
  return data;
};

export const getAllBids = async web3 => {
  const streams = await getAllRevenueStreamForSale(web3);
  const allBids = [];
  for (const stream of streams) {
    const bids = await fetchBidsOfRevenueStream(web3, stream?.id);
    bids.forEach(b => {
      b.stream = stream;
      allBids.push(formatBid(b));
    });
  }
  return allBids;
};

export const fetchPendingWithdrawal = async ({ web3, address }) => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract || !address) {
    return 0;
  }
  const pendingWithdrawal = await marketPlaceContract?.pendingWithdrawal(address);
  return pendingWithdrawal;
};
