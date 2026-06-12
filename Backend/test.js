import connectDB from "./config/db.js";
import Note from "./models/Note.js";
import dotenv from "dotenv";

dotenv.config();

await connectDB();
const res = await Note.find({ name: { $regex: 'shyam', $options: 'i' } });
console.log("Filtered length Mongoose:", res.length);
process.exit();
