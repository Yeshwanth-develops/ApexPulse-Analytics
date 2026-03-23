const axios = require("axios");

exports.getSeasons = async (req, res) => {
  try {
    const source = req.query.source || 'jolpi'; // 'jolpi' or 'openf1'

    let seasons;

    if (source === 'openf1') {
      // OpenF1 doesn't have direct seasons endpoint, so get unique years from meetings
      const meetingsRes = await axios.get(
        `https://api.openf1.org/v1/meetings`
      );
      
      // Extract unique years and create season objects
      const years = [...new Set(meetingsRes.data.map(m => m.year))];
      
      seasons = years
        .sort((a, b) => b - a) // Newest first
        .map(year => ({
          season: year,
          url: `/f1/${year}` // Ergast-style URL
        }));

    } else {
      // Default: Jolpi.ca/Ergast format
      const response = await axios.get(
        `https://api.jolpi.ca/ergast/f1/seasons.json`
      );
      seasons = response.data.MRData.SeasonTable.Seasons;
    }

    res.json({
      source,
      count: seasons.length,
      seasons
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching seasons",
      source: req.query.source || 'jolpi'
    });
  }
};
