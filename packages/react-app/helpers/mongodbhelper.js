import * as Realm from "realm-web";

const app = new Realm.App(process.env.MONGODB_APP_ID);
app.logIn(Realm.Credentials.anonymous());

export const insertOneWith = async (collection, doc) => {
  const header = { caller: "insertOneWith", collection, doc };
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  const mongo = app?.currentUser?.mongoClient("mongodb-atlas");
  const coll = mongo?.db(process.env.MONGODB_DB_NAME).collection(collection);
  const res = await coll?.insertOne(doc);
  console.log({ header, state: "done", data: { res } });
  return res;
};
