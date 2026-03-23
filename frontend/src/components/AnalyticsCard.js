import { motion } from "framer-motion";

function AnalyticsCard({ title, value }) {

  return (

    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(225,6,0,0.4)" }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-6 rounded-2xl border border-gray-800 hover:border-primary transition duration-300 shadow-lg"
    >

      <h2 className="text-gray-400">{title}</h2>

      <p className="text-2xl font-bold text-red-500">
        {value}
      </p>

    </motion.div>

  );

}

export default AnalyticsCard;