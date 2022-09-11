import * as Realm from "realm-web";

const app = new Realm.App(process.env.MONGODB_APP_ID);
app.logIn(Realm.Credentials.anonymous());

export const insertOneWith = async (collection, doc, dbName = process.env.MONGODB_DB_NAME) => {
  const header = { caller: "insertOneWith", collection, doc };
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  const mongo = app?.currentUser?.mongoClient("mongodb-atlas");
  const coll = mongo?.db(dbName).collection(collection);
  const res = await coll?.insertOne(doc);
  console.log({ header, state: "done", data: { res } });
  return res;
};

export const findWith = async (collection, query, dbName = process.env.MONGODB_DB_NAME) => {
  const header = { caller: "findWith", collection, query };
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  const mongo = app?.currentUser?.mongoClient("mongodb-atlas");
  const coll = mongo?.db(dbName).collection(collection);
  const res = await coll?.find(query);
  console.log({ header, state: "done", data: { res } });
  return res;
};

export const findOneWith = async (collection, query, dbName = process.env.MONGODB_DB_NAME) => {
  const header = { caller: "findOneWith", collection, query };
  console.log({ header, state: "start" });
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  const mongo = app?.currentUser?.mongoClient("mongodb-atlas");
  const coll = mongo?.db(dbName).collection(collection);
  const res = await coll?.findOne(query);
  console.log({ header, state: "done", data: { res } });
  return res;
};

export const normalizeRevenueStreamData = doc => {
  return {
    ...doc,
    id: doc?._id?.toString(),
    name: doc?.name || "Revenue Royalty",
    description: doc?.description || "Description",
  };
};

export const normalizeBidProposalData = doc => {
  return {
    ...doc,
    id: doc?._id?.toString(),
    name: doc?.name || "Bid Proposal",
    description: doc?.description || "Description",
  };
};

export const getAllRevenueStreamForSale = async () => {
  try {
    const res = await findWith("revenueStreamForSale", { isActive: true });
    return res?.map(d => normalizeRevenueStreamData(d)) || [];
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getOneRevenueStreamForSaleWith = async query => {
  try {
    const res = await findOneWith("revenueStreamForSale", query);
    return res ? normalizeRevenueStreamData(res) : null;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const getAllRevenueStreamForSaleIds = async () => {
  try {
    const res = await getAllRevenueStreamForSale();
    return res?.map(d => d?.id) || [];
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getAllBidProposal = async () => {
  try {
    const res = await findWith("bidProposal", { isActive: true });
    return res?.map(d => normalizeBidProposalData(d)) || [];
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getAllBidProposalIds = async () => {
  try {
    const res = await getAllBidProposal();
    return res?.map(d => d?.id) || [];
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getOneBidProposalWith = async query => {
  try {
    const res = await findOneWith("bidProposal", query);
    return res ? normalizeBidProposalData(res) : null;
  } catch (err) {
    console.log(err);
  }
  return null;
};
