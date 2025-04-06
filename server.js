// Import Frameworks + Modules
const express = require('express')
const path = require('path')

const app = express() // Creates Express Instance
const port = 3000 // Define the Port

/* database function imports */
const { getPassword, closeMongo, 
    postData, readData, deleteData } = require('./database.js');

/* closes db connection when server.js is closed */
process.on("SIGINT", async () => {
    await closeMongo();
    console.log("Closing program.");
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await closeMongo();
    console.log("Closing program.");
    process.exit(0);
});

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

app.get('/database/:collection', (req, res) => {

    const collection = req.params['collection'];
    const query = req.query;

    // preprocess query to match readData() specs

    return readData(collection, query)
        .then(
            
            // this block executes if the promise successfully resolves *still need to check success for an error*
            (success) => {
                let result = success.result; // result is the data requested by FE
                if (result == null) {
                    // something bad happened earlier, check error args of success
                    // respond to FE with an error message (400), telling them something went wrong
                    res.status(400).json({});
                }

                // preprocess result into a json thats useful for frontend

                // respond to FE with formatted data json
                res.status(200).json({});
        }, 
                
            // this block executes if the promise does not resolve *indicates something wrong with server to db connection?*
            (failure) => {
                console.error("promise to finish database query failed", failure);
                res.status(500).json({
                    message: "There was an error while connecting to the database.",
                    error: failure
                });
            });
});

app.post('/database/:collection', (req, res) => {
    
    const collection = req.params['collection'];
    const query = req.query;

    // preprocess query to match postData() specs

    return postData(collection, query)
        .then(
            
            // this block executes if the promise successfully resolves *still need to check success for an error*
            (success) => {
                let result = success.result;
                if (result == null) {
                    // something bad happened earlier, check error args of success
                    res.status(400).json({});
                }

                res.status(200).json({});
        }, 
        
            // this block executes if the promise does not resolve *indicates something wrong with server to db connection?*
            (failure) => {
                console.error("promise to finish database query failed", failure);
                res.status(500).json({
                    message: "There was an error while connecting to the database.",
                    error: failure
                });
            });
});

app.delete('/database/:collection', (req, res) => {
    
    const collection = req.params['collection'];
    const query = req.query;

        // preprocess query to match deleteData() specs

    return deleteData(collection, query)
        .then(
            
            // this block executes if the promise successfully resolves *still need to check success for an error*
            (success) => {
                let result = success.result; // result is confirmation that the delete operation executed successfully
                if (result == false) {
                    // something bad happened earlier, check error args of success
                    // then respond to the caller with an error message, telling them something went wrong
                    res.status(400).json({});
                }

                // respond to caller that delete op was successful
                res.status(200).json({});
        },
            // this block executes if the promise does not resolve *indicates something wrong with server => db connection?*
            (failure) => {
                console.error("promise to finish database query failed", failure);
                res.status(500).json({
                    message: "There was an error while connecting to the database.",
                    error: failure
                });
            });
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
