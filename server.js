const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB properly
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));