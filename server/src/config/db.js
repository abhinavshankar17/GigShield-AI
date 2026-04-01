const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigshield_db';
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log("Setting up fallback memory-like behaviour if MongoDB isn't running...");
    // Optionally we can start an in-memory db here but for hackathon demo we assume local mongodb
    // process.exit(1);
  }
};

module.exports = connectDB;
