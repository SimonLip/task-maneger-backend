import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import boardRoutes from "./routes/boardRoutes";

const MONGO_URL = "mongodb+srv://simonlip:stas1234@cluster0.sbiqbgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const PORT = 5000;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api", boardRoutes);

app.get("/", (req, res) => {
  res.send("Backend is OK!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
