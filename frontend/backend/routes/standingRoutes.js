const express = require("express");
const router = express.Router();

const {
 getDriverStandings,
 getConstructorStandings
} = require("../controllers/standingsController");

const cacheMiddleware = require("../middleware/cache");

router.get("/drivers", cacheMiddleware, getDriverStandings);
router.get("/constructors", cacheMiddleware, getConstructorStandings);

module.exports = router;