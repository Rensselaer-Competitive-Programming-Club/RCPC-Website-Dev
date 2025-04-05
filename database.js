require('dotenv').config(); // Load environment variables from a .env file (if you have one)
const { MongoClient } = require('mongodb');
const dbUri = process.env.DB;

function fetchAdminPassword() {
    /*
     * 1. initialize database obj
     * 2. make sql query for admin password
     * 3. return admin password
    */
    console.log("get password called");
    return "password";
}

module.exports = {
    getPassword: fetchAdminPassword
  };