import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using the connection string
 * stored in the `MONGO_URI` environment variable.
 *
 * If the connection fails, it logs an error message and terminates
 * the process with a non-zero exit code.
 */

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
