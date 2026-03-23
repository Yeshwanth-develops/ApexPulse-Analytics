const express = require("express");
const router = express.Router();

const { getDrivers } = require("../controllers/driverController");

const cacheMiddleware = require("../middleware/cache");

router.get("/", cacheMiddleware, getDrivers);

module.exports = router;