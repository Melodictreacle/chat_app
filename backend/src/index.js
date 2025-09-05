import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

//created an express app named app
const app = express();

// this helps us read the the req.body to read as a JSON file 
app.use(cookieParser());
app.use(express.json());

app.use(

  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();

//if we visit the /api/auth route it will look into the authRoutes and process accordingly
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)




const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("sever is running on port:" + PORT)
  connectDB()
});