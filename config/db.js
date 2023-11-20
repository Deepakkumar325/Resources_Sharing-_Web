const mongoose = require('mongoose');
require('dotenv').config()
const connectionDB = async () => {
  try {
    const uri = "mongodb+srv://deepakkumar13204:Omg2cmRZoj0yqr4a@cluster0.t7cdsno.mongodb.net/User?retryWrites=true&w=majority"; // replace with your actual database connection string

    if (!uri || typeof uri !== 'string') {
      throw new Error('MongoDB connection string is undefined, null, or not a string. Please provide a valid connection string.');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

module.exports = connectionDB;
