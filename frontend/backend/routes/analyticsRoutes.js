const express = require("express");
const router = express.Router();

const { getDriverAnalytics } = require("../controllers/analyticsController");
const cacheMiddleware = require("../middleware/cache");

router.get("/", cacheMiddleware, getDriverAnalytics);


module.exports = router;