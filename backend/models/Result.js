const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  raceId: String,
  driverId: String,
  position: Number,
  points: Number,
  lapTime: String
});

module.exports = mongoose.model("Result", resultSchema);