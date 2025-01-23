// Import Frameworks + Modules
const express = require('express')
const path = require('path')

const app = express() // Creates Express Instance
const port = 3000 // Define the Port

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve Static Starting Frontend
app.get('/', (req, res,) => {
    res.send(express.static('index.html'))
})

app.listen(port, () => {
	console.log('Listening on *:3000')
})
