const express = require("express");
const cors = require("cors");
const driverRoutes = require("./routes/driverRoutes");
const raceRoutes = require("./routes/raceRoutes");
const circuitRoutes = require("./routes/circuitRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const standingsRoutes = require("./routes/standingRoutes");
const resultsRoutes = require("./routes/resultsRoutes");
const seasonRoutes = require("./routes/seasonRoutes");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

connectDB();

// ✅ CLEAN ROUTES - NO DUPLICATES
app.use("/api/drivers", driverRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/standings", standingsRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api", circuitRoutes);  // ← Handles /api/circuit-image/:circuitId

app.get("/", (req, res) => {
  res.send("F1 Analytics API Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "F1 Analytics API"
  });
});

app.get("/test", async (req, res) => {
  const axios = require("axios");
  const response = await axios.get("https://ergast.com/api/f1/2023/drivers.json");
  res.json(response.data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
