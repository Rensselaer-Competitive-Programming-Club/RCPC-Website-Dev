// Import Frameworks + Modules
const express = require('express')
const path = require('path')

// instantiate mongo db obj
require('dotenv').config(); // Load environment variables from a .env file (if you have one)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { error } = require('console');
const uri = process.env.DB;
const dbName = "rcpc-website-database";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const app = express() // Creates Express Instance
const port = 3000 // Define the Port

/* database function imports */
const { getPassword, closeMongo, 
    postData, readData, deleteData } = require('./database.js');

// /* closes db connection when server.js is closed */
// process.on("SIGINT", async () => {
//     await closeMongo();
//     console.log("Closing program.");
//     process.exit(0);
// });
// process.on("SIGTERM", async () => {
//     await closeMongo();
//     console.log("Closing program.");
//     process.exit(0);
// });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing the html form in /admin
app.use(express.static(path.join(__dirname, 'public')));

// Serve Static Starting Frontend
app.get('/', (req, res,) => {
    res.send(express.static('index.html'))
})

/* /database endpoints:
 *  - get endpoint for read operations
 *  - post endpoint for insert operations
 *  - delete endpoint for remove operations
 * 
 * endpoints are used by FE to get/post/delete data
 * request arguments:
 *  - path arg: the collection
 *  - query args: key/value pairs used for querying the collection
*/ 

app.get('/database/:collection', async (req, res) => {

    const collectionName = req.params.collection;
    let query = req.query;

    console.log("read request to database recieved from", req.ip);
    console.log(`for collection ${collectionName} with query args ${JSON.stringify(query)}`);

    // convert all datatypes in query
    // from str to their proper form

    if (query.isActive === 'true') {
        query.isActive = true;
    } else {
        query.isActive = false;
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        const data = await collection.find(query).toArray();
        const result = {
            ok: true,
            data: data
        }

        return res.status(200).json(result);

    } catch(error) {

        console.log("there was an error with read request to database", error);
        const result = {
            ok: false,
            error: error
        }

        return res.status(500).json(result);

    }
});

app.post('/database/:collection', async (req, res) => {
    
    const collectionName = req.params.collection;
    const query = req.query;


    console.log("post request to database recieved from", req.ip);
    console.log(`for collection ${collectionName} with query args ${JSON.stringify(query)}`);

    // convert all datatypes in query
    // from str to their proper form

    try {

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        let data;
        let result;

        if (Array.isArray(query)) {
            data = await collection.insertMany(query);
        } else {
            collection.insert(query);
        }

        result = {
            ok: true,
            data: data
        }

        return res.status(200).json(result);

    } catch(error) {

        console.log("there was an error with post request to database", error);
        const result = {
            ok: false,
            error: error
        }

        return res.status(500).json(result);
    }
    
});

app.delete('/database/:collection', async (req, res) => {
    
    const collectionName = req.params.collection;
    const deleteMany = req.query.deleteMany;

    delete req.query.deleteMany;
    const query = req.query;

    console.log("delete request to database recieved from", req.ip);
    console.log(`for collection ${collection} with query args ${JSON.stringify(query)}`);

    try {
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        let data;
        let result;

        if (deleteMany === true) {
            data = await collection.deleteMany(query);
        } else {
            collection.deleteOne(query);
        }

        result = {
            ok: true,
            data: data
        }

        return res.status(200).json(result);

    } catch(error) {

        console.log("there was an error with delete request to database", error);
        const result = {
            ok: false,
            error: error
        }

        return res.status(500).json(result);
    }
    
});

/* /admin endpoint:
 * lets client verify as admin
 * successful authentication redirects to admin dashboard
 * make sure to add authentication token to user session
*/
app.post('/admin', (req, res) => {
    
    const userInput = req.body.password; // gets user input
    getPassword().then(

        (hashedPassword) => {
            if (hashedPassword == userInput) {
                res.redirect('/admin/dashboard');
            } else {
                res.status(401).json({              // Redirect back to the login page NEEDS TO BE IMPLEMENTED
                    message: "Incorrect Password"
                });
            }
        },

        (failure) => {
            console.log("could not resolve promise", failure);
            res.status(500).json({
                message: "An error occurred while connecting to the database.",
                error: failure
            });
        }
    )
});

/* /admin/dashboard endpoint:
 * serves the private dashboard directory not served in the public directory
*/
app.get('/admin/dashboard', (req, res) => {

    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

app.listen(port, () => {
	console.log('Listening on *:3000');
})
