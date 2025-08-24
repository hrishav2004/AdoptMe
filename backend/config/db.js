const mongoose = require('mongoose')
require('dotenv').config()

const dbURI = process.env.MONGO_URI

const connectDB = async () => {
    try{
        await mongoose.connect(dbURI)
        console.log("Successfully connected to MongoDB")
    }
    catch (err) {
        console.error("Couldn't connect to MongoDB", err)
        process.exit(1)
    }
}

module.exports = connectDB;