import {MongoClient} from "mongodb";

export class CavyBackDatabase {

    constructor(dbUrl, dbName) {
        this.dbUrl = dbUrl;
        this.dbName = dbName;
    }

    async connect() {
        this.client = new MongoClient(this.dbUrl);
        try {
            await this.client.connect();
        } catch (error) {
            console.log("something went wrong! No connection to DB!");
            return "something went wrong! No connection to DB!";
        }

        console.log("Successfully connected to database");
    }

    /**
     * @param id - user numerical id
     */
    async getAccount(id) {
        if (!this.client) {
            console.log("something went wrong! No connection to DB!");
            return "something went wrong! No connection to DB!";
        }
        const db = this.client.db(this.dbName);
        const users = db.collection("users");

        const query = {_id: id};
        const options = {};

        return await users.findOne(query, options);
    };

    /**
     * @param id - user numerical id
     */
    async createAccount(id) {
        const db = this.client.db(this.dbName);
        const users = db.collection("users");
        return await users.insertOne({
            _id: id,
            account_created_at: Date.now(),
            level: 0,
            xp_points: 0,
            coins: 0,
        });
    };

    /**
     * @param id - user numerical id
     * @param newData - new data to set
     */
    async updateAccount(id, newData) {
        const db = this.client.db(this.dbName);
        const users = db.collection("users");
        return await users.updateOne({_id: id}, {$set: newData});
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

}
