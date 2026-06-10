import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected succesfully Shivam Congurats : ${conn.connection.host}`);
  } catch (error) {
    console.log("Database Error dekh bhai kuch error hai :", error.message);
    process.exit(1);
  }
};

export default connectDB;