require('dotenv').config(); // Load required sensitive variables from the .env file

// Import Frameworks + Modules
const express = require('express')
const path = require('path')
const { spawn } = require('child_process');

// Import Custom Functions
const { getPassword, postData, readData, deleteData } = require('./database.js');

// Initialize MongoDB Client and Connect to it
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { error } = require('console');
const uri = process.env.DB;
const dbName = "rcpc-website-database";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    },
    tlsAllowInvalidCertificates: true,
    tls: true // Important for Atlas
});
(async () => {
    try {
        await client.connect();
        console.log("Connected to client!");
    } catch (err) {
        console.error("Failed to connect to client:", err);
    }
})();


const app = express() // Creates Express Instance
const port = 3000 // Define the Port

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing the html form in /admin
app.use(express.static(path.join(__dirname, 'public')));

// Serve Static Starting Frontend
app.get('/', (req, res,) => {
    res.send(express.static('index.html'))
})

app.listen(port, () => {
	console.log('Listening on *:3000');

    init();
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

    if (query.isActive === "true") {
        query.isActive = true;
    } else {
        query.isActive = false;
    }

    console.log(`for collection ${collectionName} with query args ${JSON.stringify(query)}`);

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
        console.log("Error: GET at /database/:collection", error);   
        return res.status(500).json({
            ok: false,
            error: error
        });

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
            data = await collection.insertOne(query);
        }

        if (!data || !data.acknowledged) {
            return res.status(400).json({ ok: false, error: "Insert failed" });
        }

        result = {
            ok: true,
            data: data
        }
        
        return res.status(200).json(result);

    } catch(error) {
        console.log("Error: POST at /database/:collection", error);
        return res.status(500).json({
            ok: false,
            error: error
        });
    }
    
});

app.delete('/database/:collection', async (req, res) => {
    
    const collectionName = req.params.collection;
    const deleteMany = req.query.deleteMany;

    delete req.query.deleteMany;
    const query = req.query;

    console.log("delete request to database recieved from", req.ip);
    console.log(`for collection ${collectionName} with query args ${JSON.stringify(query)}`);

    try {
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        let data;
        let result;

        if (deleteMany === "true") {
            data = await collection.deleteMany(query);
        } else {
            data = await collection.deleteOne(query);
        }

        result = {
            ok: true,
            data: data
        }

        return res.status(200).json(result);

    } catch(error) {
        console.log("Error: DELETE at /database/:collection", error);
        return res.status(500).json({
            ok: false,
            error: error
        });
    }
    
});

// FE calls this to get leaderboard data
app.get('/api/leaderboard/', async (_, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('leaderboard');
        const result = await collection.find().toArray();
        return res.status(200).json({data: result});
    } catch(error) {
        return res.status(500).json({error: 'Internal server error'});
    }
});

// can get 1 user instead of all; not very useful but why not
app.get('/api/leaderboard/:id', async (req, res) => {
    try {
        if (req.params.id == undefined) {
            return res.status(400).json({error: 'id parameter was not supplied'});
        }
        const query = { _id: new ObjectId(req.params.id)}
        const db = client.db(dbName);
        const collection = db.collection('leaderboard');
        const result = await collection.findOne(query).toArray();
        return res.status(200).json({data: result});
    } catch(error) {
        return res.status(500).json({error: 'Internal server error'});
    }
});

// adds someone's stats to the leaderboard collection
app.post('/api/leaderboard', async (req, res) => {
    try {
        if(!validateLeaderboardPost(req.body)) {
            return res.status(400).json({error: 'Form content did not validate'});
        }

        const db = client.db(dbName);
        const collection = db.collection('leaderboard');
        const result = collection.insert(req.body);
        return res.status(200).json(result);

    } catch(error) {
        return res.status(500).json({error: 'Internal server error'})
    }
});

import * as codeforces from './codeforces.js';
app.get('/api/leaderboard/update', async (_, res) => {
    try {
        /* steps for updating the leaderboard
         * 1. get the current challenge from mongo/website
         * 2. get the list of leaderboard users from mongo/leaderboard
         * 3. api call to codeforces for each user; need their global ranking and a list of all problems solved
         * 4. api call to codeforces for each problem solved per user.
         * 5. user data includes ranking info; can build global leaderboard stats directly
         * 6. problem data per user is filtered by the current challenge via tags
         * 7. construct challenge leaderboard stats with filtered problem data
        */

        const db = client.db(dbName);
        let collection = db.collection('website');
        const currentChallenge = collection.find().toArray();
        collection = db.collection('leaderboard');
        const members = await collection.find().toArray();
        const cfProfiles = await codeforces.getProfiles(members);
        const userToProblemArray = await codeforces.getProblems(cfProfiles, filter=currentChallenge);

        const statUpdates = members.map(member => {
            const profile = cfProfiles.find(profile => profile.handle == member.handle);
            const problems = userToProblemArray.find(user => user.handle == member.handle);
            
            const filter = {_id: member._id};
            const query = {set: {
                    globalRank: profile.rank,
                    globalRating: profile.rating,
                    challengeScore: codeforces.getTotalChallengeScore(problems)
                }
            };
            return {
                updateOne: {
                    filter, query
                }
            };
        });

        collection = db.collection('leaderboard');
        await collection.bulkWrite(statUpdates);
        return res.status(200).json({success: true});
    } catch(error) {
        return res.status(500).json({success: false, error: error});
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
                res.send(`
                    <script>
                        alert("Incorrect password.");
                    </script>
                `);
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

    res.sendFile(path.join(__dirname, 'public/admin/dashboard/', 'index.html'));
});

/* /backend endpoint:
 * used to python functions in the backend
*/

app.get('/backend/:fileName/:functionName', async (req, res) => {
    const {fileName, functionName } = req.params;
    const { args = [] } = req.query;

    // check for null
    if(!fileName || !functionName) {
        return res.status(400).json({ error: "Missing file name or function name in request" });
    }

    // check for invalid file name
    if (!/^[\w\-]+$/.test(fileName)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const scriptPath = path.join(__dirname, 'backend', `${fileName}.py`);

    try {
        // Call runPythonScript with the script path and function name as arguments
        const { ok, result, error } = await runPythonScript(scriptPath, functionName, args);

        if (ok) {
            return res.json({ result });
        } else {
            return res.status(500).json({ error });
        }
    } catch (err) {
        // Catch any unexpected errors
        return res.status(500).json({ error: err.error || 'Unknown error occurred' });
    }
});

/*
    Other Functions
*/
function runPythonScript(scriptPath, functionName, args = []) {
    return new Promise((resolve, reject) => {

        const serializedArgs = args.map(arg => {
            // If arg is an object, serialize it to a JSON string
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            // If arg is not an object, keep it as it is (no serialization needed)
            return arg;
        });

        const python = spawn('python', [scriptPath, functionName, ...args]);

        let result = '';
        let error = '';

        // get output
        python.stdout.on('data', (data) => {
            result += data.toString().trim();
        });

        // get errors
        python.stderr.on('data', (data) => {
            error += data.toString().trim();
        });

        // check that program exited properly
        python.on('close', (code) => {
            if (code !== 0 || error) {
                return reject({
                    ok: false,
                    error: error || `Python script exited with code ${code}`,
                });
            }
            resolve({ ok: true, result: result });
        });
    });
}

function init() {
    fetchSubmissions();
}

/* Codeforces API
    makes api calls to update our member data on the database
*/

// this function continues to run while the server is live
async function fetchSubmissions() {
    // TODO: change this to get a list of user handles from the members collection in the db
    // TODO: make this function take in a problem id as input
    

    /*
        fetch all submissions and store them in a list [{handle, submissions}]
        call a python function which takes the list, and a problem number to go through each user and get the earliest time they solved the problem
        python function prints to console in order of who solved problem first
            1st handle
            2nd handle
            etc

    */

    // runPythonScript("backend/leaderboard.py", "getOKSubmissions", [ "2A", handles ]).then(response => {
    //     // Handle the success response
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     // Handle the error response
    //     console.error("Error running the Python script:", error);
    //   });
};