export const revenueStreamForSaleDatas = [
  {
    key: "1",
    name: "Idle Finance 01",
    description: "Perpetual Yield Tranches Junior",
    id: "0x1234567890",
  },
];

export function getAllIds() {
  return revenueStreamForSaleDatas.map(data => {
    return {
      params: {
        id: data?.id,
      },
    };
  });
}

export function getData(id) {
  return revenueStreamForSaleDatas.find(data => data.id === id);
}
