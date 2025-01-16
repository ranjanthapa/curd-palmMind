const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Databse connect successfull")
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;