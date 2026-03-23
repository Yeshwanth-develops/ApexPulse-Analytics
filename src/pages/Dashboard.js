import { motion } from "framer-motion";
import AnalyticsCard from "../components/AnalyticsCard";
import ChampionshipChart from "../charts/ChampionshipChart";
import DriverRadarChart from "../charts/DriverRadarChart";
import RacePositionChart from "../charts/RacePositionChart";
import LapTimeChart from "../charts/LapChart";

const pageAnimation = {
  initial: {
    opacity: 0,
    y: 40
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -40
  }
};

function Dashboard() {

  return (

    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="bg-gray-900 min-h-screen text-white overflow-x-hidden"
    >

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          F1 Race Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">

          <AnalyticsCard title="Drivers" value="20" />
          <AnalyticsCard title="Teams" value="10" />
          <AnalyticsCard title="Races" value="24" />
          <AnalyticsCard title="Season" value="2026" />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Championship Trend</h2>
            <div className="h-[300px] md:h-[340px]">
              <ChampionshipChart />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Driver Skill Radar</h2>
            <div className="h-[300px] md:h-[340px]">
              <DriverRadarChart />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Race Position Changes</h2>
            <div className="h-[300px] md:h-[340px]">
              <RacePositionChart />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Lap Time Comparison</h2>
            <div className="h-[300px] md:h-[340px]">
              <LapTimeChart />
            </div>
          </div>

        </div>

      </div>

    </motion.div>

  );
}

export default Dashboard;