const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
