// Import Frameworks + Modules
const express = require('express')
const path = require('path')
const { spawn } = require('child_process');

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
const { getPassword, postData, readData, deleteData } = require('./database.js');

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

function init() {
    fetchSubmissions();
}

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

app.listen(port, () => {
	console.log('Listening on *:3000');

    init();
})

/* /backend endpoint:
 * used to python functions in the backend
*/

app.get('/backend/:fileName/:functionName', async (req, res) => {
    const {fileName, functionName } = req.params;

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
        const { ok, result, error } = await runPythonScript(scriptPath, functionName);

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
// makes sure args is a json in the form JSON.stringify([arg1, arg2, arg3])
function runPythonScript(scriptPath, functionName, args = []) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', [scriptPath, functionName, args]);

        let result = '';
        let error = '';

        // get output
        python.stdout.on('data', (data) => {
            result += data.toString().trim();
        });

        // get errors
        python.stderr.on('data', (data) => {
            error += data.toString();
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


/* Codeforces API
    makes api calls to update our member data on the database
*/
/*
    Member Fields:
    handle
*/
// this function continues to run while the server is live
async function fetchSubmissions() {
    // TODO: change this to get a list of user handles from the members collection in the db
    const handles = [
        "MPartridge",
        "jacob528",
        "CJMarino",
        "togoya6259",
        "sideoftomatoes"
    ]

    for(const handle of handles) {
        try {
            const response = await fetch(
                `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`
            );
            const data = await response.json();

            if (data.status !== 'OK') {
                throw new Error("Codeforces user.status API call failed");
            }
            const jsonData = JSON.stringify({ data: data });
            const result = await runPythonScript("backend/database.py", "test", jsonData);

            if(result.ok) {
                console.log("resultsssss", result);
            } else {
                throw new Error("result not ok on api call");
            }

        } catch (error) {
            console.log("Error while fetching submissions", error);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    fetchSubmissions();
};