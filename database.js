const dbName = "rcpc-website-database";

/* insertData(collectionName, data)
 * collectionName and data are query args
 * insertData initializes a mongo db, and 
 * inserts data into the specified collection
*/
/**
 * 
 * @param {MongoClient} client - The MongoDB Client
 * @param {string} collectionName -  
 * @param {*} data 
 * @returns 
 */
async function insertData(client, collectionName, data) {
    
    // verifies correctness of the program
    if (collectionName == null || data == null) {
        throw new Error("One or more arguments of insertData is null");
    }

    try {
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

/* findData(collection, data)
 * 
 * 
*/
async function findData(client, collectionName, query) {

    // verifies correctness of the program
    if (collectionName == null || query == null) {
        throw new Error("One or more arguments of insertData is null");
    }
    
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find(query).toArray();

        // might be a good idea to send a special message if nothing is found
        // or if an error is caused by the query, like an invalidKey argument
        //          ^^^^ this is possible with a schema ^^^^


        // preprocess query fields here

        if('isActive' in query) {
            if (query.isActive == "true") {
                query.isActive = true;
            } else {
                query.isActive = false;
            }
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
async function updateData(client, collection, data) {

}

/* deleteData(collection, data)
 *
 *
*/
async function deleteData(client, collection, data) {

} 



async function fetchAdminPassword() {
    
    /*
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