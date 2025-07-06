require('dotenv').config(); // Load required sensitive variables from the .env file

// Import Frameworks + Modules
const express = require('express')
const path = require('path')
const { spawn } = require('child_process');
const cors = require('cors');

const allowedOrigins = ['https://rcpc-9s3f.onrender.com'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

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
app.use(cors(corsOptions));
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

app.get('/api/directors', async (_, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('directors');
        const data = await collection.find().toArray();
        res.status(200).json({
            ok: true,
            data: data
        });
    } catch(error) {
        res.status(500).json({
            ok: false,
            error: error
        });
    }
});

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