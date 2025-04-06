require('dotenv').config(); // Load environment variables from a .env file (if you have one)
const { MongoClient } = require('mongodb');
const dbUri = process.env.DB;
const dbName = "rcpc-website-database";

/* caches vars for less getMongo() calls */
let cachedClient = null;
let cachedDB = null;

/* makeMongoClient()
 * initializes a new instance of a mongo client
 * call this every time you want to do a db query
 * is async, so needs proper handling
*/
async function getMongo() {
    try {

        // checks if cache already exists
        if(cachedDB) {
            return cachedDB;

        // else make the var and initialize cache
        } else {
            const client = new MongoClient(dbUri);
            await client.connect();
            cachedClient = client;
            cachedDB = client.db(dbName);
            console.log("Successfully opened mongo connection");
        }

    // if an error happens when connecting to the DB,
    // it gets routed here
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        cachedClient = null;
        cachedDB = null;
        throw error; // re-throw error for the calling function to handle
    }
}

/* closeMongo()
 * checks if cached objs are active
 * if so, closes their connections
 * called by server.js when the program is interrupted/closed
*/ 
async function closeMongo() {

    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDB = null;
    }

    console.log("Successfully closed mongo connection.");

}

/* insertData(collectionName, data)
 * collectionName and data are query args
 * insertData initializes a mongo db, and 
 * inserts data into the specified collection
*/ 
async function insertData(collectionName, data) {

    try {

        // verifies correctness of the program
        if (collectionName == null || data == null) {
            throw new Error("One or more arguments of insertData is null");
        }

        let db = cachedDB;
        if (db == null) {
            await getMongo();
            db = cachedDB;
        }

        var collection = db.collection(collectionName);
        let result;
        
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

/* findData(collection, data)
 * 
 * 
*/
async function findData(collectionName, query) {

    try {
        
        // verifies correctness of the program
        if (collectionName == null || query == null) {
            throw new Error("One or more arguments of insertData is null");
        }
    

        let db = cachedDB;
        if (db == null) {
            await getMongo();
            db = cachedDB;
        }

        const collection = db.collection(collectionName);

        // might be a good idea to send a special message if nothing is found
        // or if an error is caused by the query, like an invalidKey argument
        //          ^^^^ this is possible with a schema ^^^^


        // preprocess query fields here

        if (query.isActive == "true") {
            query.isActive = true;
        } else {
            query.isActive = false;
        }

        var cursor = await collection.find(query);
        var result = await cursor.toArray();

        return {
            ok: true,
            data: result
        };


    } catch(error) {
        console.error(`Error finding data for collection "${collectionName}":`, error);
        return {
            ok: false,
            error: error
        };
    }
}

/* updateData(collection, data)
 *
 * 
*/
async function updateData(collection, data) {

}

/* deleteData(collection, data)
 *
 *
*/
async function deleteData(collection, data) {

} 



async function fetchAdminPassword() {
    
    /*
     * 1. initialize database obj
     * 2. make sql query for admin password
     * 3. return admin password
    */

    try {
        let db = cachedDB;
        if (db == null) {
            await getMongo();
        }

        console.log("get password called");
        return "password";

    } catch(error) {
        console.log("error in fetchAdmin");
        return false;
    }
}

module.exports = {
    getPassword: fetchAdminPassword,
    closeMongo: closeMongo,
    readData: findData,
    postData: insertData,
    deleteData: deleteData 
  };