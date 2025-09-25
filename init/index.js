//for initilasing the in databse by this program

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); //this is where the module of data is stored in which format the data is define

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); //this will delete all data from chats in database
  await Listing.insertMany(initData.data); //this will store all data to chats in database
  console.log("data was initialise");
};

initDB();
