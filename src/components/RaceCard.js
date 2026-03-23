import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCircuitImage } from "../services/api";

function RaceCard({ race, season }) {
  let isCompleted = false;
  let raceDate = "";
  
  // States
  const [circuitImage, setCircuitImage] = useState({ imageUrl: '/circuits/generic.svg' });
  const [circuitImageUrl, setCircuitImageUrl] = useState('/circuits/generic.svg');

  const circuitId =
    race?.circuit?.circuitId ||
    race?.Circuit?.circuitId ||
    race?.circuitId ||
    null;

  // ✅ FIXED useEffect
  useEffect(() => {
    const fetchCircuitImage = async () => {
      if (circuitId) {
        try {
          console.log(`[RaceCard] Fetching image for circuitId: ${circuitId}`);
          const imageData = await getCircuitImage(circuitId);
          console.log('[RaceCard] FULL response:', imageData);
          
          const resolvedUrl = imageData?.imageUrl || imageData?.fallback || '/circuits/generic.svg';
          if (resolvedUrl) {
            setCircuitImage({ imageUrl: resolvedUrl });
            setCircuitImageUrl(resolvedUrl);
          } else {
            console.log('[RaceCard] No valid image, using fallback');
            setCircuitImage({ imageUrl: '/circuits/generic.svg' });
            setCircuitImageUrl('/circuits/generic.svg');
          }
        } catch (error) {
          console.error('Circuit image failed:', error);
          setCircuitImage({ imageUrl: '/circuits/generic.svg' });
          setCircuitImageUrl('/circuits/generic.svg');
        }
      } else {
        console.log('[RaceCard] circuitId missing; using generic image');
        setCircuitImage({ imageUrl: '/circuits/generic.svg' });
        setCircuitImageUrl('/circuits/generic.svg');
      }
    };
    fetchCircuitImage();
  }, [circuitId]);

  // Date parsing
  try {
    if (race && race.date) {
      const raceTime = new Date(race.date);
      isCompleted = raceTime < new Date();
      raceDate = raceTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      console.warn("RaceCard: Missing race.date", race);
      raceDate = "Date unknown";
    }
  } catch (error) {
    console.error("RaceCard: Error parsing date", race, error);
    raceDate = "Date error";
  }

  return (
    <Link to={`/races/${season}/${race.round}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-gradient-to-br from-gray-900/50 to-black/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-700/50 hover:border-red-500/50 hover:shadow-red-500/20 hover:shadow-2xl cursor-pointer overflow-hidden min-h-[280px]"
      >
        {/* Circuit Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 group-hover:opacity-80 transition-all duration-700"
          style={{ backgroundImage: `url(${circuitImageUrl})` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Race Status Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
            isCompleted
              ? "bg-green-500/90 text-green-900 border border-green-400/50"
              : "bg-orange-500/90 text-orange-900 border border-orange-400/50"
          }`}
        >
          {isCompleted ? "COMPLETED" : "UPCOMING"}
        </div>

        {/* Round Badge */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-xl shadow-red-500/30 flex items-center justify-center text-xl font-black text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          R{race.round}
        </div>

        {/* Race Info */}
        <div className="relative z-10 pt-6">
          <h3 className="text-xl font-black text-white mb-2">
            {race.raceName}
          </h3>
          <p className="text-sm text-gray-300 mb-3 flex items-center gap-2">
            <span className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg" />
            {race.Circuit?.Location?.locality}, {race.Circuit?.Location?.country}
          </p>
          <p className="text-xs text-gray-400 bg-black/30 px-3 py-1 rounded-full w-fit font-mono">
            {raceDate}
          </p>
        </div>

        {/* Hover Arrow */}
        <motion.div
          className="absolute bottom-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1.2, rotate: 90 }}
          animate={{ rotate: 0 }}
        >
          →
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default RaceCard;
