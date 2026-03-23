const express = require("express");
const router = express.Router();

const { getRaceResults } = require("../controllers/resultsController");
const cacheMiddleware = require("../middleware/cache");

router.get("/", cacheMiddleware, getRaceResults);

module.exports = router;