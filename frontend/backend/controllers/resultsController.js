const axios = require("axios");

exports.getRaceResults = async (req, res) => {
  try {
    const season = req.query.season || 2026;
    const round = req.query.round || 1;
    const source = req.query.source || 'jolpi'; // 'jolpi' or 'openf1'

    let results;

    if (source === 'openf1') {
      // Step 1: Get meeting key for season/round
      const meetingsRes = await axios.get(
        `https://api.openf1.org/v1/meetings`,
        { params: { year: season } }
      );
      
      const meeting = meetingsRes.data.find(m => m.round === round);
      if (!meeting) {
        return res.status(404).json({ 
          source, season, round, 
          message: `Round ${round} not found in ${season}` 
        });
      }

      // Step 2: Get race session key (RACE session)
      const sessionsRes = await axios.get(
        `https://api.openf1.org/v1/sessions`,
        { params: { meeting_key: meeting.meeting_key, session_name: 'RACE' } }
      );
      
      const raceSession = sessionsRes.data[0];
      if (!raceSession) {
        return res.status(404).json({ 
          source, season, round, 
          message: `No race session found for round ${round}` 
        });
      }

      // Step 3: Get session results
      const sessionRes = await axios.get(
        `https://api.openf1.org/v1/session_result`,
        { params: { session_key: raceSession.session_key } }
      );

      // Transform to Ergast format
      results = sessionRes.data.map(result => ({
        number: result.driver_number,
        position: result.position,
        positionText: result.position,
        points: result.classification_points || 0,
        Driver: {
          driverId: result.driver_number.toString(),
          permanentNumber: result.permanent_number || result.driver_number,
          code: result.code,
          givenName: result.firstname,
          familyName: result.lastname,
          nationality: result.nationality
        },
        Constructor: {
          constructorId: result.team_id,
          name: result.team_name,
          nationality: result.team_nationality
        },
        grid: result.grid_position,
        laps: result.laps,
        status: result.status,
        time: result.time,
        fastestLap: result.fastest_lap_time,
        fastestLapRank: result.fastest_lap_position
      }));

    } else {
      // Default: Jolpi.ca/Ergast format
      const response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`
      );
      results = response.data.MRData.RaceTable.Races[0].Results;
    }

    res.json({
      source,
      season,
      round,
      count: results.length,
      results
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching race results",
      source: req.query.source || 'jolpi'
    });
  }
};
