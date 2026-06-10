import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import connectDB from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Allow all local ports in development (so Vite on 5173, 5174 etc won't fail)
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json()); // parse JSON bodies
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
app.get("/", (req, res) => {
  res.send("Backend Running ");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});