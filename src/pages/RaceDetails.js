import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRaceDetails, getCircuitImage } from "../services/api";

function RaceDetails() {
  const { season, round } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [circuitImageUrl, setCircuitImageUrl] = useState("/circuits/generic.svg");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  setLoading(true);
  setError(null);
  setCircuitImageUrl("/circuits/generic.svg");
  
  getRaceDetails(season, round)
    .then((res) => {
      setData(res.data);
      setError(null);
      
      console.log("[RaceDetails] Race data:", res.data);
      console.log("[RaceDetails] Circuit:", res.data?.circuit);
      console.log("[RaceDetails] Circuit ID:", res.data?.circuit?.circuitId);
      
      // ✅ FIXED: Fetch circuit image if available
      if (res.data?.circuit?.circuitId) {
        console.log("[RaceDetails] Requesting circuit image for:", res.data.circuit.circuitId);
        
        getCircuitImage(res.data.circuit.circuitId)
          .then((imageData) => {  // ← DIRECT DATA, NOT imgRes.data!
            console.log("[RaceDetails] Received FULL image response:", imageData);
            
            const resolvedUrl = imageData?.imageUrl || imageData?.fallback || "/circuits/generic.svg";
            console.log("[RaceDetails] Setting image URL to:", resolvedUrl);
            setCircuitImageUrl(resolvedUrl);
          })
          .catch((err) => {
            console.error("[RaceDetails] Circuit image error:", err);
            setCircuitImageUrl("/circuits/generic.svg");
          });
      }
    })
    .catch((err) => {
      console.error("Error loading race details:", err);
      setError(err.message || "Failed to load race details");
    })
    .finally(() => setLoading(false));
}, [season, round]);


  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 pb-6 pt-28 lg:pt-32 bg-gray-900 min-h-screen text-white flex items-center justify-center"
      >
        <p className="text-gray-400">Loading race details...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 pb-6 pt-28 lg:pt-32 bg-gray-900 min-h-screen text-white"
      >
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          Error: {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
        >
          ← Go Back
        </button>
      </motion.div>
    );
  }

  if (!data || !data.race) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 pb-6 pt-28 lg:pt-32 bg-gray-900 min-h-screen text-white"
      >
        <p className="text-gray-400">No race data found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white mt-4"
        >
          ← Go Back
        </button>
      </motion.div>
    );
  }

  const race = data.race;
  const circuit = data.circuit || {};
  const results = data.results || [];
  const standings = data.standings || [];
  const hasResults = data.hasResults;

  const raceDate = new Date(race.date);
  const isCompleted = raceDate < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="px-6 pb-6 pt-28 lg:pt-32 bg-gray-900 min-h-screen text-white"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition-colors"
      >
        ← Back to Races
      </button>

      {/* Race Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-3xl p-8 mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl font-black">
            R{race.round}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{race.raceName}</h1>
            <p className="text-gray-300">
              {raceDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-2 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCompleted && hasResults
                    ? "bg-green-500/90 text-green-900"
                    : "bg-orange-500/90 text-orange-900"
                }`}
              >
                {isCompleted && hasResults ? "COMPLETED" : "UPCOMING"}
              </span>
            </div>
          </div>
        </div>

        {/* SINGLE Circuit Image - Clean & Fixed */}
        {circuitImageUrl !== "/circuits/generic.svg" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-6 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/30 border-4 border-red-500/40 bg-gradient-to-br from-black/50"
          >
            <div className="relative">
              <img
                key={circuitImageUrl} // Force re-render on new image
                src={circuitImageUrl}
                alt={`${circuit.circuitName || 'Circuit'} layout`}
                className="w-full h-80 object-cover brightness-90 hover:brightness-100 transition-all duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  setCircuitImageUrl("/circuits/generic.svg");
                }}
              />
              {circuit.circuitName && (
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xl font-bold bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white drop-shadow-2xl">
                    🏁 {circuit.circuitName}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Circuit Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold mb-6">Circuit Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Circuit Name</p>
            <p className="text-lg font-semibold">{circuit.circuitName || "N/A"}</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Location</p>
            <p className="text-lg font-semibold">{circuit.Location?.locality || "N/A"}</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Country</p>
            <p className="text-lg font-semibold">{circuit.Location?.country || "N/A"}</p>
          </div>
          {circuit.circuitId && (
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Circuit ID</p>
              <p className="text-lg font-semibold">{circuit.circuitId}</p>
            </div>
          )}
          {circuit.Location?.lat && (
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Latitude</p>
              <p className="text-lg font-semibold">{circuit.Location.lat}</p>
            </div>
          )}
          {circuit.Location?.long && (
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Longitude</p>
              <p className="text-lg font-semibold">{circuit.Location.long}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Race Results */}
      {hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Race Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 text-gray-400">Position</th>
                  <th className="px-4 py-2 text-gray-400">Driver</th>
                  <th className="px-4 py-2 text-gray-400">Constructor</th>
                  <th className="px-4 py-2 text-gray-400">Points</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-4 py-2 font-bold text-red-400">
                      {result.position || "DNF"}
                    </td>
                    <td className="px-4 py-2">
                      {result.Driver?.givenName} {result.Driver?.familyName}
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {result.Constructor?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 font-semibold text-yellow-400">
                      {result.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Championship Standings */}
      {standings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            Championship Standings {season}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 text-gray-400">Position</th>
                  <th className="px-4 py-2 text-gray-400">Driver</th>
                  <th className="px-4 py-2 text-gray-400">Constructor</th>
                  <th className="px-4 py-2 text-gray-400">Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.slice(0, 10).map((standing, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-4 py-2 font-bold text-red-400">
                      {standing.position}
                    </td>
                    <td className="px-4 py-2">
                      {standing.Driver?.givenName} {standing.Driver?.familyName}
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {standing.Constructors?.[0]?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 font-semibold text-yellow-400">
                      {standing.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {standings.length > 10 && (
            <p className="text-gray-400 text-sm mt-4">
              Showing top 10 of {standings.length} drivers
            </p>
          )}
        </motion.div>
      )}

      {/* No results for upcoming races */}
      {!hasResults && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 text-gray-400 text-center"
        >
          <p className="text-lg">
            Results will be available after the race is completed.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default RaceDetails;
