import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AnimatedBackground from "./components/AnimatedBackground";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Races from "./pages/Races";
import RaceDetails from "./pages/RaceDetails";
import Comparison from "./pages/Comparison";
import Analytics from "./pages/Analytics";
import Strategy from "./pages/Strategy";


function AnimatedRoutes() {

  const location = useLocation();

  return (
    <AnimatePresence mode="wait">

      <Routes location={location} key={location.pathname}>

        <Route path="/" element={<Dashboard />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/races" element={<Races />} />
        <Route path="/races/:season/:round" element={<RaceDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/strategy" element={<Strategy />} />
      </Routes>

    </AnimatePresence>
  );
}

function App() {

  return (
    <BrowserRouter>
     <AnimatedBackground />
      <Navbar />
       <AnimatedBackground />
      <AnimatedRoutes />

    </BrowserRouter>
  );
}

export default App;