import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

export const getDrivers = (season = 2026, source = "jolpi") =>
  API.get("/drivers", { params: { season, source } });

export const getRaces = async (season = 2026, source = "jolpi") => {
  try {
    return await API.get("/races", { params: { season, source } });
  } catch (error) {
    // Fallback to direct Jolpi call when local backend is unavailable.
    const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}`);
    const races = response?.data?.MRData?.RaceTable?.Races || [];

    return {
      data: {
        source: "jolpi-direct",
        season,
        count: races.length,
        races,
      },
    };
  }
};

export const getRaceDetails = (season, round) =>
  API.get(`/races/${season}/${round}`);

// ✅ FIXED: Use API instance (no leading /api)
export const getCircuitImage = async (circuitId) => {
  try {
    const response = await API.get(`/circuit-image/${circuitId}`); // ← Just /circuit-image
    return response.data;
  } catch (error) {
    console.error('Circuit image fetch failed:', error);
    return { imageUrl: '/circuits/generic.svg', source: 'local' };
  }
};

export const getAllCircuitImages = () =>
  API.get(`/circuits`);

export const getDriverStandings = () => API.get("/standings/drivers");
export const getDriverAnalytics = (driverId, season = 2026) =>
  API.get(`/analytics?driverId=${encodeURIComponent(driverId)}&season=${season}`);
export default API;
