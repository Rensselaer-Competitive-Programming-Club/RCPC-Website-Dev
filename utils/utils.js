const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DB;
const dbName = "rcpc-website-database";

// MongoDB client object
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    },
    tlsAllowInvalidCertificates: true,
    tls: true // Important for Atlas
});

/*
 * function that verifies a login
 *  -> fetches the hashed password from the database
 *  -> hashes the attempt
 *  -> returns the comparison
 */
const bcrypt = require('bcrypt');   // hashing package
async function validateLogin(user) {
    console.log(user);
    const db = client.db(dbName);                   // .
    const collection = db.collection('website');    // this is boilerplate for accessing a mongo entry
    const data = await collection.findOne(); // .
    console.log(data.password);
    return bcrypt.compare(user.password, data.password);
}

module.exports = {
    validateLogin
};