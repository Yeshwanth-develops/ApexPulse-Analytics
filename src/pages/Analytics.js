import { motion } from "framer-motion";

function Analytics() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="px-6 pb-6 pt-28 lg:pt-32 bg-gray-900 min-h-screen text-white"
		>
			<h1 className="text-3xl font-bold mb-4">Analytics</h1>
			<p className="text-gray-300">Advanced race and driver analytics will appear here.</p>
		</motion.div>
	);
}

export default Analytics;
