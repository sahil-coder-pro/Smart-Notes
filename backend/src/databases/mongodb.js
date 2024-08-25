import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected', conn.connection.host);
  } catch (err) {
    console.log("Some error occurred while connecting to the mongodb")
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;