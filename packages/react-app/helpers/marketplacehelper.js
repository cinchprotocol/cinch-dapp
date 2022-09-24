const { utils } = require("ethers");

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
  const doc = {
    ...item,
    id,
    key: id,
    name: item?.name,
    price: utils.formatEther(item?.price),
    feeCollectorAddress: item?.feeCollector,
    multiSigAddress: item?.multiSig,
    revenueProportion: utils.formatEther(item?.revenuePct),
    expiryAmount: utils.formatEther(item?.expAmount),
    isActive: true,
  };
  return doc;
};

export const getBidByBidderOfRevenueStream = async (web3, revenueStreamId, bidderAddress) => {
  try {
    const marketPlaceContract = web3?.readContracts["MarketPlace"];
    if (!marketPlaceContract || !revenueStreamId || !bidderAddress) {
      return null;
    }
    const bid = await marketPlaceContract?.getBidByBidder(revenueStreamId, bidderAddress);
    const data = {
      ...bid,
      price: utils.formatEther(bid?.price),
    };
    return data;
  } catch (err) {
    console.log("getBidByBidderOfRevenueStream err", err);
    return [];
  }
};

export const fetchBidsOfRevenueStream = async (web3, revenueStreamId) => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract || !revenueStreamId) {
    return [];
  }
  const bids = await marketPlaceContract?.fetchBidsOfItem(revenueStreamId);
  const datas = bids ? bids.map(bid => ({ ...bid, price: utils.formatEther(bid?.price) })) : [];
  return datas;
};

export const fetchBidOf = async (web3, revenueStreamId, bidId) => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract || !revenueStreamId || !bidId) {
    return null;
  }
  const bid = await marketPlaceContract?.getBidByItem(revenueStreamId, bidId);
  const data = {
    ...bid,
    price: utils.formatEther(bid?.price),
  };
  return data;
};
