import * as dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import jobRouter from "./routes/jobRouter.js";

const app = express();

dotenv.config();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// jobs route
app.use("/api/v1/jobs", jobRouter);

// not found handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "not found!" });
});

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong!";
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB!");
  app.listen(PORT, () => console.log(`Sever running on Port ${PORT}`));
} catch (error) {
  console.log(error);
  process.exit(1);
}
