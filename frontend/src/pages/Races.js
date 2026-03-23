import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRaces } from "../services/api";
import RaceCard from "../components/RaceCard";

function Races() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState(2026);
  // Generate years from 1950 to current year + future years
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 1950 + 10 },
    (_, i) => 1950 + i
  ).reverse();

  useEffect(() => {
    setLoading(true);
    getRaces(season)
      .then(res => {
        const racesData =
          res?.data?.races ||
          res?.data?.MRData?.RaceTable?.Races ||
          [];
        console.log("Races loaded:", racesData.length);
        setRaces(racesData);
        setError(null);
      })
      .catch(err => {
        console.error("Error loading races:", err);
        setError(err.message || "Failed to load races");
        setRaces([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [season]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="px-6 pb-6 pt-28 lg:pt-32 bg-gray-900 min-h-screen text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Races {season}</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Year
        </label>
        <select
          value={String(season)}
          onChange={(e) => setSeason(parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 hover:border-gray-600"
        >
          {availableYears.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          Error: {error}
        </div>
      )}
      
      {loading && (
        <div className="text-gray-400">
          <p>Loading races...</p>
        </div>
      )}
      
      {!loading && races.length === 0 && !error && (
        <div className="text-gray-400">
          <p>No races found for {season}.</p>
        </div>
      )}
      
      {!loading && races.length > 0 && (
        <>
          <p className="text-gray-400 mb-4">Showing {races.length} races</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {races.map((race, idx) => {
              try {
                return (
                  <RaceCard 
                    key={race.round || idx} 
                    race={race}
                    season={season}
                  />
                );
              } catch (e) {
                console.error("Error rendering race card:", e);
                return (
                  <div key={race.round || idx} className="bg-red-900/50 p-4 rounded text-red-200">
                    Error rendering race: {race.raceName}
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Races;
