require('dotenv').config(); // Load required sensitive variables from the .env file

// Import Frameworks + Modules
const express = require('express')
const path = require('path')
const { spawn } = require('child_process');

// security imports
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// util imports
const util = require('./utils/utils.js');
console.log('utils.validateLogin =', util.validateLogin);

/*
 * CORS (Cross-Origin Resource Sharing) Middleware
 * This prevents requests from domains not in allowedOrigins
*/
const allowedOrigins = ['http://localhost:3000', 'https://rcpc-9s3f.onrender.com'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

// Initialize MongoDB Client and Connect to it
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { error } = require('console');
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

// indicates if db connection was successful. keep to debug db errors
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

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For parsing the html form in /admin
app.use(express.static(path.join(__dirname, 'public')));

// Serve Static Starting Frontend
app.get('/', (req, res,) => {
    res.send(express.static('index.html'))
});

// enables app to serve endpoints
app.listen(port, () => {
	console.log('Listening on *:3000');
});

// gets info on directors from Mongo (read only)
app.get('/api/directors', async (_, res) => {
    try {
        const db = client.db(dbName);                   // .
        const collection = db.collection('directors');  // this is boilerplate for accessing a mongo entry
        const data = await collection.find().toArray(); // .

        res.status(200).json({ // sends a success response if no error
            ok: true,
            data: data
        });
    } catch(error) { // sends a failure response bc error
        console.log(error);
        res.status(500).json({ok: false, error: 'Internal Server Error'});
    }
});

// verifies a jwt token by returning which role it has
app.get('/api/me', async (req, res) => {
    const token = req.cookies.token;                        // reads a token from the request
    if (!token) return res.status(200).json({user: null});  // if no token then no role
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({user: payload});  // parses the credentials and responds with them
    } catch(error) {
        console.log(error);
        res.status(500).json({user: null});     // sends null credentials if an error occurrs
    }
});

// post route for logging into admin
// if successful, user is granted a jwt to access the dashboard page
app.post('/api/login', async (req, res) => {
    const user = req.body;  // post request always has content in req.body
    try {
        if (!(await util.validateLogin(user))) { // checks that the login info is correct
            return res.status(400).json({error: 'bad login'});
        }

        const token = jwt.sign( // initialize a token
            {username: 'authCookie', role: 'admin'}, 
            process.env.JWT_SECRET, {expiresIn: '1h'});
        
        res.cookie('token', token, {    // store the token inside res.cookie
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });

        res.sendFile(path.join(__dirname, 'public/pages/dashboard/', 'index.html')); // redirect to dashboard with token
    } catch(error) {
        console.log(error);
        return res.status(500).json({success: false, error: 'Internal Server Error'});    // on failure (no token)
    }
});

/*
 * 
 * 
 * 
*/
app.get('/admin/dashboard', (req, res) => {

    res.sendFile(path.join(__dirname, 'public/admin/dashboard/', 'index.html'));
});