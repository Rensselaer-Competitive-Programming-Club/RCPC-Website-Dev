// Import Frameworks + Modules
const express = require('express')
const path = require('path')

const app = express() // Creates Express Instance
const port = 3000 // Define the Port

const { getPassword } = require('./database.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing the html form in /admin
app.use(express.static(path.join(__dirname, 'public')));

// Serve Static Starting Frontend
app.get('/', (req, res,) => {
    res.send(express.static('index.html'))
})

app.get('/database', (req, res) => {

})

/* /admin endpoint:
 * lets client verify as admin
 * successful authentication redirects to admin dashboard
 * make sure to add authentication token to user session
*/
app.post('/admin', (req, res) => {
    const userInput = req.body.password;
    const hashedPassword = getPassword(); // in practice, getPassword is async so need .then()

    if (userInput == hashedPassword) {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/?error=incorrect_password'); // Redirect back to the login page (root in this case)
    }
    
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
