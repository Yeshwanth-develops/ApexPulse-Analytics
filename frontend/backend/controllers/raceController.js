const axios = require("axios");

exports.getRaces = async (req, res) => {
  try {
    const season = req.query.season || 2026;
    const source = req.query.source || 'jolpi'; // 'jolpi' or 'openf1'

    let races;

    if (source === 'openf1') {
      // OpenF1 API - get all meetings for the season
      const response = await axios.get(
        `https://api.openf1.org/v1/meetings`,
        { 
          params: { 
            year: season,
            country_name: 'all' // Get all races for season
          } 
        }
      );
      
      // Transform OpenF1 meetings to match Ergast race format
      races = response.data.map(meeting => ({
        raceName: `${meeting.location} Grand Prix`,
        round: meeting.round,
        raceDate: meeting.date_start,
        location: {
          locality: meeting.location,
          country: meeting.country_name,
          lat: meeting.latitude,
          long: meeting.longitude
        },
        meeting_key: meeting.meeting_key
      }));
    } else {
      // Default: Jolpi.ca/Ergast format
      const response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${season}`
      );
      races = response.data.MRData.RaceTable.Races;
    }

    res.json({
      source,
      season,
      count: races.length,
      races
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching races",
      source: req.query.source || 'jolpi'
    });
  }
};

exports.getRaceDetails = async (req, res) => {
  try {
    const season = req.params.season || 2026;
    const round = req.params.round;

    if (!round) {
      return res.status(400).json({ message: "Round number is required" });
    }

    // Fetch race circuit info
    const raceUrl = `https://api.jolpi.ca/ergast/f1/${season}/${round}`;
    const raceResponse = await axios.get(raceUrl);
    
    if (!raceResponse.data.MRData.RaceTable.Races[0]) {
      return res.status(404).json({ message: "Race not found" });
    }

    const race = raceResponse.data.MRData.RaceTable.Races[0];
    const circuit = race.Circuit || {};

    // Fetch results/standings for this race if completed
    const resultsUrl = `https://api.jolpi.ca/ergast/f1/${season}/${round}/results`;
    let results = [];
    let standings = [];

    try {
      const resultsResponse = await axios.get(resultsUrl);
      results = resultsResponse.data.MRData.RaceTable.Races[0]?.Results || [];
      
      // Fetch championship standings after this race
      const standingsUrl = `https://api.jolpi.ca/ergast/f1/${season}/driverStandings`;
      const standingsResponse = await axios.get(standingsUrl);
      standings = standingsResponse.data.MRData.StandingsTable?.StandingsList[0]?.DriverStandings || [];
    } catch (e) {
      console.log("Results might not be available yet for future race");
    }

    res.json({
      race,
      circuit,
      results,
      standings,
      hasResults: results.length > 0
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching race details",
      error: error.message
    });
  }
};
