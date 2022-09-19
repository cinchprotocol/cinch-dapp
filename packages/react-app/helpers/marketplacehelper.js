export const getAllRevenueStreamForSale = async web3 => {
  const marketPlaceContract = web3?.readContracts["MarketPlace"];
  if (!marketPlaceContract) {
    return [];
  }
  const itemCount = await marketPlaceContract?.getMarketItemCount();
  const outputData = [];
  for (let i = 1; i <= itemCount; i++) {
    const item = await marketPlaceContract?.getMarketItem(i);
    const {
      name,
      price,
      feeCollectorAddress,
      multiSigAddress,
      revenueProportion,
      expiryAmount,
      isActive = true,
    } = item;
    const doc = {
      id: i,
      key: i,
      name,
      price,
      feeCollectorAddress,
      multiSigAddress,
      revenueProportion,
      expiryAmount,
      isActive,
    };
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
  const { name, price, feeCollectorAddress, multiSigAddress, revenueProportion, expiryAmount, isActive = true } = item;
  const doc = {
    id,
    key: id,
    name,
    price,
    feeCollectorAddress,
    multiSigAddress,
    revenueProportion,
    expiryAmount,
    isActive,
  };
  return doc;
};
