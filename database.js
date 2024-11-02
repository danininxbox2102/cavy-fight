import { MongoClient } from "mongodb";
import { dbUrl } from "./secret.js";
const dbName = "CavyFight";
let client;

export const dbConnect = async () => {
  client = new MongoClient(dbUrl);
  try {
    await client.connect();
  } catch (error) {
    console.log("something went wrong! No connection to DB!");
    return "something went wrong! No connection to DB!";
  }

  console.log("Successfully connected to database");
};

/**
 * Middleware which displays the user init data.
 * @param id - user numerical id
 */
export const getAccount = async (id) => {
  if (!client) {
    console.log("something went wrong! No connection to DB!");
    return "something went wrong! No connection to DB!";
  }
  const db = client.db(dbName);
  const users = db.collection("users");

  const query = { _id: id };
  const options = {};

  const user = await users.findOne(query, options);
  return user;
};

/**
 * Middleware which displays the user init data.
 * @param id - user numerical id
 */
export const createAccount = async (id) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const insertDoc = await users.insertOne({
    _id: id,
    account_created_at: Date.now(),
    level: 0,
    xp_points: 0,
    coins: 0,
  });

  return insertDoc;
};

/**
 * Middleware which displays the user init data.
 * @param id - user numerical id
 * @param newData - new data to set
 */
export const updateAccount = async (id, newData) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const updateDoc = await users.updateOne({ _id: id }, { $set: newData });

  return updateDoc;
};

// export const getAllAccounts = async () => {
//   if (!client) {
//     console.log("something went wrong! No connection to DB!");
//     return "something went wrong! No connection to DB!";
//   }
//   const db = client.db(dbName);
//   const users_collection = db.collection("users");

//   const users = await users_collection
//     .find({}, { projection: { _id: 1, tg_uid: 1, dickSize: 1 } })
//     .toArray();

//   return users;
// };
