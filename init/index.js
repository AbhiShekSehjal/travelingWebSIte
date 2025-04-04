const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../model/listing.js");

main().then(() => {
    console.log("connected to mongoDB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/traveling');
}

async function initDB() {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();