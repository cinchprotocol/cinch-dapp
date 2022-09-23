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
