const express = require("express");
const router = express.Router();

const { getRaces, getRaceDetails } = require("../controllers/raceController");
const cacheMiddleware = require("../middleware/cache");

router.get("/", cacheMiddleware, getRaces);
router.get("/:season/:round", getRaceDetails);

module.exports = router;