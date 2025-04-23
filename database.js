const { MongoClient } = require("mongodb");

const dbName = "rcpc-website-database";

/**
 * Attempts to insert the given data to the database collection
 * 
 * @param {MongoClient} client - The MongoDB Client
 * @param {string} collectionName - The name of the collection to insert into 
 * @param {Object|Object[]} data - The data to insert into the collection. Can be one document or multiple 
 * @returns {Promise<Boolean>} - Resolves to "true" if data was succesfully inserted into collection
 * @throws {Error} - Throws an error if any argument is null, if data is of invalid type, or if inserting fails
 */
async function insertData (client, collectionName, data) {
    // try to insert
    try {
        // make sure arguments are not null
        if (!collectionName || !data || !client) {
            throw new Error("One or more arguments of insertData is null");
        }

        // load collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // { data is an array } => use insert many
        if (Array.isArray(data)) { 
            result = await collection.insertMany(data);
            console.log(`Inserted ${result.insertedCount} documents.`);
            return result;
        
        // { data is a single document } => use insert one
        } else if (typeof data == 'object') {
            result = await collection.insertOne(data);
            console.log("Data inserted with ID:", result.insertedId);
            return result;
        
        // { data is neither } => something went wrong bc you can't use data as an argument anymore
        } else {
            throw new Error("Data argument of insertData is of invalid type (not Array or Object)");
        }

    // handle thrown errors here 
    } catch(error) {
        console.error(`Error inserting data into collection "${collectionName}":`, error);
        return false;
    }
}

/**
 * Attempts to find data in the given collection with the given query
 * 
 * @param {MongoClient} client - The MongoDB Client 
 * @param {string} collectionName - The name of the collection to find data in
 * @param {Object} query - query to filter data with
 * @returns {Promise<{ ok: true, data: any[] } | { ok: false, error: any }>} - Resolves to json object with field
 * "ok". If "ok" is true then there is another field "data" which contains the data found in the collection, if "ok" is "false"
 * there is another field "error" which is the error that occured
 * @throws {Error} - Throws an error if any arguments are null, or if finding the collection was unsuccessful
 */
async function findData(client, collectionName, query) {
    // try to find
    try {
        // make sure args are not null
        if (!client || !collectionName || !query) {
            throw new Error("One or more arguments of insertData is null");
        }

        // load collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // preprocess query fields here

        if('isActive' in query) {
            if (query.isActive == "true") {
                query.isActive = true;
            } else {
                query.isActive = false;
            }
        }

        // get data from the collection
        const data = await collection.find(query).toArray();

        // return data
        return {
            ok: true,
            data: data
        };

    } catch(error) {
        console.error(`Error finding data for collection "${collectionName}":`, error);
        return {
            ok: false,
            error: error
        };
    }
}

/**
 * Attempts to update data in the given collection with the given data, query, and options
 * 
 * @param {MongoClient} client - The MongoDB client
 * @param {string} collection - The collection to update
 * @param {Object} query - The query to filter with
 * @param {Object} data - The update to make to filtered items 
 * @param {Object} [options] - Optional MongoDB options
 * @returns {Promise<{ ok: boolean, result?: any, error?: any }>} - Resolves to object with field "ok" which is true if any
 * data was updated, and false if not. "result" is an optional field which is the entries which were updated. "error" is an
 * optional field with any errors that were thrown
 * @throws {Error} - 
 */
async function updateData(client, collection, query, data, options = {}) {
    // TODO
    try {

    } catch(error) {

    }
}

/**
 * Attempts to delete data from the collection with the given query
 * 
 * @param {MongoClient} client - The MongoDB Client 
 * @param {string} collection - The collection to delete from
 * @param {Object} query - the query to filter with
 * @returns {Promise<{ ok: boolean, result?: any[], error?: any }>} - Resolves to object with field "ok" which is true if
 * any amount of data was deleted. "result" is all entries that were deleted, "error" is any errors that occurred
 * @throws {Error} - 
 */
async function deleteData(client, collection, query) {
    // TODO
} 

/**
 * Returns the admin login password
 * 
 * @returns {Promise<string>} - Resolves to a string which is the admin login password
 */
async function fetchAdminPassword() {
    
    /* TODO
     * 1. initialize database obj
     * 2. make sql query for admin password
     * 3. return admin password
    */

    try {
        console.log("get password called");
        return "password";
    } catch(error) {
        console.log("error in fetchAdmin");
        return false;
    }
}

module.exports = {
    getPassword: fetchAdminPassword,
    readData: findData,
    postData: insertData,
    deleteData: deleteData 
  };