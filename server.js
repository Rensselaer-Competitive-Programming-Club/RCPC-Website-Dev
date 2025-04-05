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
    console.log("Closing connection with mongo.");
    await closeMongo();
    console.log("Closing program.");
    process.exit(0);
});
process.on("SIGTERM", async () => {
    console.log("Closing connection with mongo.");
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
 * used by FE to get/post/delete data
 * request args:
 *  - path arg: the collection
 *  - query args: key/value pairs used for querying the collection
*/ 

app.get('/database/:collection', (req, res) => {

    const collection = req.params['collection'];
    const query = req.query;

    /* some amount of preprocessing query argument
     * to match readData specs needs to happen here */ 

    return readData(collection, query)
        .then(
            
            // this block executes if the promise successfully resolves *still need to check success for an error*
            (success) => {
                let result = success.result; // result is the data requested by FE
                if (result == null) {
                    // something bad happened earlier, check error args of success
                    // respond to FE with an error message (501), telling them something went wrong
                }

                // preprocess result into a json thats useful for frontend

                // respond to FE with formatted data json
            }, 
                
            // this block executes if the promise does not resolve *indicates something wrong with server => db connection?*
            (failure) => {
                console.error("promise to finish database query failed", result);
                // respond to FE with an error message (501)
            })
});

app.post('/database/:collection', (req, res) => {
    
    const collection = req.params['collection'];
    const query = req.query;

    return postData(collection, query)
        .then(
            
            // this block executes if the promise successfully resolves *still need to check success for an error*
            (success) => {
            let result = success.result;
            if (result == null) {
                // something bad happened earlier, check error args of success
            }
        }, (failure) => {
            console.error("promise to finish database query failed", result);
            // respond to FE with an error message (501)
        })
});

app.delete('/database/:collection', (req, res) => {
    
    const collection = req.params['collection'];
    const query = req.query;

    return deleteData(collection, query)
        .then(
            
            // this block executes if the promise successfully resolves *still need to check success for an error*
            (success) => {
                let result = success.result; // result is confirmation that the delete operation executed successfully
                if (result == false) {
                    // something bad happened earlier, check error args of success
                    // then respond to the caller with an error message, telling them something went wrong
                }

                // respond to caller that delete op was successful
            
        },
            // this block executes if the promise does not resolve *indicates something wrong with server => db connection?*
            (failure) => {
                console.error("promise to finish database query failed", result);
                // respond to FE with an error message (501)
            })
})

/* /admin endpoint:
 * lets client verify as admin
 * successful authentication redirects to admin dashboard
 * make sure to add authentication token to user session
*/
app.post('/admin', (req, res) => {
    const userInput = req.body.password;
    getPassword().then(
        (hashedPassword) => {
            if (hashedPassword == userInput) {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/?error=incorrect_password'); // Redirect back to the login page (root in this case)
            }
        },

        (failure) => {
            console.log("could not resolve promise");
            res.redirect('/?error=unresolved_promise');
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
