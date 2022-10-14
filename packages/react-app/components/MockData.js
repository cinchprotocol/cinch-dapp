export const revenueStreamForSaleDatas = [
  {
    key: "1",
    name: "Idle Finance 01",
    description: "Perpetual Yield Tranches Junior",
    id: "631d6b5842314bf4f040a219",
  },
  {
    key: "2",
    name: "Idle Finance 02",
    description: "Perpetual Yield Tranches Junior",
    id: "631e133ff6be0c92bcff13fe",
  },
  {
    key: "3",
    name: "Idle Finance 03",
    description: "Perpetual Yield Tranches Junior",
    id: "631e18caf6be0c92bcfff68b",
  },
];

export function getAllRevenueStreamForSaleIds() {
  return revenueStreamForSaleDatas.map(data => {
    return {
      params: {
        id: data?.id,
      },
    };
  });
}

export function getRevenueStreamData(id) {
  return revenueStreamForSaleDatas.find(data => data.id === id);
}

export const revenueStreamBidDatas = [
  {
    key: "1",
    name: "Idle Finance 01",
    description: "Perpetual Yield Tranches Junior",
    id: "0x1234567890",
    price: 1000000,
    addressToReceiveRevenueShare: "0x6789012345",
    contact: "buyer@cinchprotocol.io",
  },
];

export function getAllBidIds() {
  return revenueStreamBidDatas.map(data => {
    return {
      params: {
        id: data?.id,
      },
    };
  });
}

export function getBidData(id) {
  return revenueStreamBidDatas.find(data => data.id === id);
}
