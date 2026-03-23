import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDrivers } from "../services/api";
import DriverRadarChart from "../charts/DriverRadarChart";

function Comparison() {

  const [drivers, setDrivers] = useState([]);
  const [driver1, setDriver1] = useState("");
  const [driver2, setDriver2] = useState("");

  useEffect(() => {
    getDrivers().then(res => {
      setDrivers(res.data.drivers || []);
    }).catch(() => {
      setDrivers([]);
    });
  }, []);

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-gray-900 min-h-screen text-white"
    >

      <h1 className="text-3xl font-bold mb-6">
        Driver Comparison
      </h1>

      {/* 🔽 Step 2: Driver Selectors */}
      <div className="flex gap-6 mb-6">

        <select
          className="p-2 bg-gray-800"
          onChange={(e) => setDriver1(e.target.value)}
        >
          <option>Select Driver 1</option>
          {drivers.map(d => (
            <option key={d.driverId} value={d.driverId}>
              {d.givenName} {d.familyName}
            </option>
          ))}
        </select>

        <select
          className="p-2 bg-gray-800"
          onChange={(e) => setDriver2(e.target.value)}
        >
          <option>Select Driver 2</option>
          {drivers.map(d => (
            <option key={d.driverId} value={d.driverId}>
              {d.givenName} {d.familyName}
            </option>
          ))}
        </select>

      </div>

      {/* 🔽 Step 7: Animation Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* 🔽 Step 4: Radar Chart */}
        <DriverRadarChart driver1={driver1} driver2={driver2} />

      </motion.div>

      {/* 🔽 Step 5: Stats Comparison Table */}
      {driver1 && driver2 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <table className="w-full text-white">

            <thead>
              <tr>
                <th>Metric</th>
                <th>{driver1}</th>
                <th>{driver2}</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Average Lap Time</td>
                <td>1:32.1</td>
                <td>1:32.5</td>
              </tr>

              <tr>
                <td>Overtakes</td>
                <td>8</td>
                <td>5</td>
              </tr>

              <tr>
                <td>Wins</td>
                <td>12</td>
                <td>8</td>
              </tr>

            </tbody>

          </table>

        </motion.div>
      )}

      {/* 🔽 Step 6: AI Insights Panel */}
      {driver1 && driver2 && (
        <motion.div
          className="mt-8 bg-gray-800 p-6 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <h2 className="text-xl font-bold mb-2">
            AI Insights
          </h2>

          <p>
            {driver1} shows stronger race pace, while {driver2} excels in overtaking.
          </p>

        </motion.div>
      )}

    </motion.div>
  );
}

export default Comparison;