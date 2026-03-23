import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDrivers } from "../services/api";
import DriverCard from "../components/DriverCard";

const getTeamName = (driver) =>
  driver?.team ||
  driver?.teamName ||
  driver?.constructorName ||
  driver?.Constructor?.name ||
  driver?.constructor?.name ||
  driver?.Constructors?.[0]?.name ||
  "Unknown Team";

const getDriverSortName = (driver) =>
  `${driver?.familyName || driver?.lastName || ""} ${driver?.givenName || driver?.firstName || ""}`.trim();

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2026"); // Default current year
  const [yearLoading, setYearLoading] = useState(false);

  const years = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => (2026 - i).toString()); // 1950-2026

  const fetchDrivers = async (year) => {
    setYearLoading(true);
    try {
      const res = await getDrivers(year); // Assumes getDrivers(year) e.g., /drivers?season=${year}
      const driverList = Array.isArray(res.data.drivers) ? [...res.data.drivers] : [];

      driverList.sort((a, b) => {
        const teamCompare = getTeamName(a).localeCompare(getTeamName(b), undefined, { sensitivity: "base" });
        if (teamCompare !== 0) return teamCompare;

        return getDriverSortName(a).localeCompare(getDriverSortName(b), undefined, { sensitivity: "base" });
      });

      setDrivers(driverList);
    } catch {
      setDrivers([]);
    } finally {
      setYearLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers(selectedYear);
  }, [selectedYear]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="px-6 pb-6 pt-28 lg:pt-32 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white"
    >
      <div className="mb-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
          F1 Drivers {selectedYear}
        </h1>
        
        {/* Year Dropdown */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={yearLoading}
            className="bg-gray-800/50 border border-gray-600 hover:border-pink-500 focus:border-pink-400 focus:outline-none rounded-xl px-6 py-3 text-lg font-semibold text-white shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-pink-500/25 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year} Season
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Loading/Error States */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.p
            key="initial-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl text-gray-400 text-center py-20"
          >
            Loading {selectedYear} drivers...
          </motion.p>
        ) : drivers.length === 0 ? (
          <motion.p
            key="no-drivers"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-xl text-gray-400 text-center py-20"
          >
            No drivers found for {selectedYear}. Try another season.
          </motion.p>
        ) : (
          <motion.div
            key="drivers-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {drivers.map((d) => (
              <DriverCard key={d.driverId} driver={d} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {yearLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-pink-500/50">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-center">Fetching {selectedYear} drivers...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Drivers;
