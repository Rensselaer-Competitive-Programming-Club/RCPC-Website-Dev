require('dotenv').config(); // Load required sensitive variables from the .env file

// Import Frameworks + Modules
const express = require('express')
const path = require('path')
const { spawn } = require('child_process');

// security imports
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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
app.use(cookieParser());
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

app.get('/api/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({user: null});
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({user: payload});
    } catch(error) {
        res.status(200).json({user: null});
    }
});

app.post('/api/login', async (req, res) => {
    const user = req.body;
    try {
        if (!(await validateLogin(user))) {
            return res.status(400).json({error: 'bad login'});
        }

        const token = jwt.sign(
            {username: user.username, role: 'admin'}, 
            process.env.JWT_SECRET, {expiresIn: '1h'});
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({success: true});
    } catch(error) {
        return res.status(500).json({success: false, error: error});
    }
});

/* /admin/dashboard endpoint:
 * serves the private dashboard directory not served in the public directory
*/
app.get('/admin/dashboard', (req, res) => {

    res.sendFile(path.join(__dirname, 'public/admin/dashboard/', 'index.html'));
});