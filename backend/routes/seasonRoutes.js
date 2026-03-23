const express = require("express");
const router = express.Router();

const { getSeasons } = require("../controllers/seasonController");
const cacheMiddleware = require("../middleware/cache");

router.get("/", cacheMiddleware, getSeasons);

module.exports = router;