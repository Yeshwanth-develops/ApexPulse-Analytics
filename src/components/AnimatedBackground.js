import { motion } from "framer-motion";

function AnimatedBackground() {

  return (

    <motion.div
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{
        duration: 6,
        repeat: Infinity
      }}

      className="
      fixed
      inset-0
      bg-gradient-to-r
      from-red-900
      to-black
      -z-10
      "
    />

  );

}

export default AnimatedBackground;