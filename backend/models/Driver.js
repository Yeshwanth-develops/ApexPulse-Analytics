const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  driverId: String,
  name: String,
  nationality: String,
  team: String,
  wins: Number,
  podiums: Number,
  points: Number
});

module.exports = mongoose.model("Driver", driverSchema);