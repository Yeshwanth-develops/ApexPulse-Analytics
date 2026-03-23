const axios = require("axios");

const TEAM_LOGO_BY_CONSTRUCTOR_ID = {
  red_bull: "https://upload.wikimedia.org/wikipedia/en/5/56/Red_Bull_Racing_logo.svg",
  ferrari: "https://upload.wikimedia.org/wikipedia/en/d/d4/Scuderia_Ferrari_Logo.svg",
  mercedes: "https://upload.wikimedia.org/wikipedia/commons/4/44/Mercedes-Benz_Star.svg",
  mclaren: "https://upload.wikimedia.org/wikipedia/commons/2/20/McLaren_Racing_logo.svg",
  alpine: "https://upload.wikimedia.org/wikipedia/commons/7/78/Alpine_F1_Team_Logo.svg",
  aston_martin: "https://upload.wikimedia.org/wikipedia/commons/1/15/Aston_Martin_Aramco_F1_Team_logo.svg",
  williams: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Williams_Grand_Prix_Engineering_logo.svg",
  haas: "https://upload.wikimedia.org/wikipedia/en/e/e3/Haas_F1_Team_logo.svg",
  audi: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi_logo_detail.svg",
  sauber: "https://upload.wikimedia.org/wikipedia/commons/4/44/Kick_Sauber_F1_Team_logo.svg",
  rb: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Racing_Bulls_logo.svg",
  alphatauri: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Scuderia_AlphaTauri_logo.svg",
  toro_rosso: "https://upload.wikimedia.org/wikipedia/en/5/56/Scuderia_Toro_Rosso_logo.png",
  renault: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Logo_Renault_Sport_F1_Team_2017.png",
  alfa: "https://upload.wikimedia.org/wikipedia/commons/2/23/Alfa_Romeo_F1_Team_Orlen_logo.svg",
  force_india: "https://upload.wikimedia.org/wikipedia/en/a/ac/Force_India_logo.svg"
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  const status = error?.response?.status;
  return !status || status === 429 || status >= 500;
};

const fetchWithRetry = async (url, config = {}, attempts = 3) => {
  let lastError;

  for (let i = 0; i < attempts; i += 1) {
    try {
      return await axios.get(url, config);
    } catch (error) {
      lastError = error;
      if (!shouldRetry(error) || i === attempts - 1) break;
      await sleep(250 * (i + 1));
    }
  }

  throw lastError;
};

const toTeamPayload = (constructor) => ({
  team: constructor.name,
  constructorId: constructor.constructorId,
  constructorUrl: constructor.url,
  teamLogo: TEAM_LOGO_BY_CONSTRUCTOR_ID[constructor.constructorId] || null
});

const getAllDriversForSeason = async (season) => {
  const response = await fetchWithRetry(
    `https://api.jolpi.ca/ergast/f1/${season}/drivers`,
    { params: { limit: 2000, offset: 0 }, timeout: 20000 }
  );

  return response?.data?.MRData?.DriverTable?.Drivers || [];
};

const getTeamMapFromSeasonResults = async (season) => {
  const teamByDriverId = new Map();

  const response = await fetchWithRetry(
    `https://api.jolpi.ca/ergast/f1/${season}/results`,
    { params: { limit: 5000, offset: 0 }, timeout: 20000 }
  );

  const races = response?.data?.MRData?.RaceTable?.Races || [];
  races.forEach((race) => {
    const results = race?.Results || [];
    results.forEach((result) => {
      const driverId = result?.Driver?.driverId;
      const constructor = result?.Constructor;
      if (!driverId || !constructor) return;

      // Iterate by race order; latest assignment wins for late-season team changes.
      teamByDriverId.set(driverId, toTeamPayload(constructor));
    });
  });

  return teamByDriverId;
};



exports.getDrivers = async (req, res) => {
  try {
    const season = req.query.season || 2026;
    const source = req.query.source || 'jolpi'; // 'jolpi' or 'openf1'

    let drivers;

    if (source === 'openf1') {
      // OpenF1 API - gets drivers from latest session or specific meeting
      const response = await fetchWithRetry(
        `https://api.openf1.org/v1/drivers`,
        { params: { meeting_key: season * 1000 + 1 }, timeout: 20000 } // Approximate meeting key
      );
      drivers = response.data.map(driver => ({
        driverId: driver.driver_number,
        permanentNumber: driver.permanent_number || driver.driver_number,
        code: driver.code,
        givenName: driver.firstname,
        familyName: driver.lastname,
        nationality: String(driver.nationality || '').trim() || 'Unknown Nationality',
        dateOfBirth: driver.date_of_birth,
        team: String(driver.team_name || '').trim() || 'Unknown Team',
        teamLogo: null
      }));
    } else {
      // Default: Jolpi.ca/Ergast format
      const [baseDrivers, standingsResponse] = await Promise.all([
        getAllDriversForSeason(season),
        fetchWithRetry(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings`, { timeout: 20000 }).catch(() => null)
      ]);

      const standingsList = standingsResponse?.data?.MRData?.StandingsTable?.StandingsLists || [];
      const driverStandings = standingsList.length > 0 ? standingsList[0].DriverStandings : [];

      const teamByDriverId = new Map();
      driverStandings.forEach((standing) => {
        const constructor = standing?.Constructors?.[0];
        const standingDriverId = standing?.Driver?.driverId;
        if (!constructor || !standingDriverId) return;

        teamByDriverId.set(standingDriverId, toTeamPayload(constructor));
      });

      let teamByResultsDriverId = new Map();
      const hasMissingTeamInStandings = baseDrivers.some((driver) => !teamByDriverId.has(driver.driverId));
      if (hasMissingTeamInStandings) {
        try {
          teamByResultsDriverId = await getTeamMapFromSeasonResults(season);
        } catch (_error) {
          teamByResultsDriverId = new Map();
        }
      }

      drivers = baseDrivers.map((driver) => {
        const merged = {
          ...driver,
          ...(
            teamByDriverId.get(driver.driverId) ||
            teamByResultsDriverId.get(driver.driverId) ||
            {}
          )
        };

        return {
          ...merged,
          team: String(merged.team || merged.teamName || '').trim() || 'Unknown Team',
          nationality: String(merged.nationality || merged.country || '').trim() || 'Unknown Nationality'
        };
      });
    }

    res.json({
      source,
      season,
      count: drivers.length,
      drivers
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching drivers",
      source: req.query.source || 'jolpi'
    });
  }
};
