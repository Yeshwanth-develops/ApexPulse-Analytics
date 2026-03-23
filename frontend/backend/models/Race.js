const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  season: Number,
  round: Number,
  raceName: String,
  circuit: String,
  date: String
});

module.exports = mongoose.model("Race", raceSchema);