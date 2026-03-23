const axios = require("axios");

exports.getDriverAnalytics = async (req, res) => {

  try {

    const { driverId, season = 2026 } = req.query;

    // Get driver standings
    const standingsRes = await axios.get(
      `https://api.jolpi.ca/ergast/f1/${season}/driverstandings`
    );

    const standings =
      standingsRes.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const driver = standings.find(
      d => d.Driver.driverId === driverId
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Convert into metrics (normalized)
    const analytics = {
      wins: Number(driver.wins) * 5,
      points: Number(driver.points) / 5,
      consistency: 80 + Math.random() * 20, // temp logic
      racePace: 70 + Math.random() * 30,
      qualifying: 75 + Math.random() * 25
    };

    res.json(analytics);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Error fetching driver analytics"
    });

  }

};