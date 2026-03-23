const axios = require("axios");

exports.getDriverStandings = async (req, res) => {
  try {
    const season = req.query.season || 2026;
    const source = req.query.source || 'jolpi'; // 'jolpi' or 'openf1'

    let standings;

    if (source === 'openf1') {
      // OpenF1 doesn't have direct standings endpoint, so calculate from latest race results
      // Get latest meeting for the season
      const meetingsRes = await axios.get(
        `https://api.openf1.org/v1/meetings?year=${season}`
      );
      
      if (meetingsRes.data.length === 0) {
        return res.json({ source, season, message: "No races completed yet" });
      }

      const latestMeeting = meetingsRes.data[meetingsRes.data.length - 1];
      const sessionRes = await axios.get(
        `https://api.openf1.org/v1/session_result?meeting_key=${latestMeeting.meeting_key}`
      );

      // Aggregate driver points from session results
      const driverPoints = {};
      
      sessionRes.data.forEach(result => {
        const driverId = result.driver_number;
        const position = result.position;
        
        // Simple F1 points system
        let points = 0;
        if (position === 1) points = 25;
        else if (position === 2) points = 18;
        else if (position === 3) points = 15;
        else if (position <= 10) points = 11 - position; // 12-10: 10,9,8,7,6,5,4,2,1
        
        if (!driverPoints[driverId]) {
          driverPoints[driverId] = {
            driverId,
            position: position,
            points,
            team: result.team_name,
            firstName: result.firstname,
            lastName: result.lastname,
            nationality: result.nationality
          };
        } else {
          driverPoints[driverId].points += points;
        }
      });

      // Sort by total points
      standings = Object.values(driverPoints)
        .sort((a, b) => b.points - a.points)
        .map((driver, index) => ({
          ...driver,
          position: index + 1
        }));

    } else {
      // Default: Jolpi.ca/Ergast format
      const response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${season}/driverStandings`
      );
      standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    }

    res.json({
      source,
      season,
      count: standings.length,
      standings
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching driver standings",
      source: req.query.source || 'jolpi'
    });
  }
};

exports.getConstructorStandings = async (req, res) => {
  try {
    const season = req.query.season || 2026;
    const source = req.query.source || 'jolpi';

    if (source === 'openf1') {
      return res.status(400).json({
        message: "Constructor standings are not directly available from OpenF1",
        source,
        season,
        supportedSource: 'jolpi'
      });
    }

    const response = await axios.get(
      `https://api.jolpi.ca/ergast/f1/${season}/constructorStandings`
    );

    const standingsList = response.data?.MRData?.StandingsTable?.StandingsLists || [];
    const standings = standingsList.length > 0 ? standingsList[0].ConstructorStandings : [];

    res.json({
      source,
      season,
      count: standings.length,
      standings
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching constructor standings",
      source: req.query.source || 'jolpi'
    });
  }
};
