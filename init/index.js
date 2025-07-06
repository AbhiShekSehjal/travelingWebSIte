const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../model/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/traveling');
}

async function initDB() {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "67fba5f8d39f086605a7dd9f" }));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
        return initDB();
    })
    .then(() => {
        console.log("Closing DB connection");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
