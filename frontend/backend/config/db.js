const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not set. Running without MongoDB connection.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000
    });

    console.log("MongoDB Connected");
    return true;
  } catch (error) {
    console.error(
      "MongoDB connection failed. Continuing without database connectivity."
    );
    console.error(error.message || error);
    return false;
  }
};

module.exports = connectDB;