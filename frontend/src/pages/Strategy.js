import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TireDegradationChart from "../charts/TireDegradationChart";
const TIRES = ["Soft", "Medium", "Hard", "Inter", "Wet"];

const TIRE_CONFIG = {
  Soft:   { color: "bg-red-500",    text: "text-red-400",    penalty: 0,  deg: "Fast degradation" },
  Medium: { color: "bg-yellow-400", text: "text-yellow-400", penalty: 10, deg: "Balanced" },
  Hard:   { color: "bg-gray-300",   text: "text-gray-300",   penalty: 20, deg: "Long stints" },
  Inter:  { color: "bg-green-400",  text: "text-green-400",  penalty: 5,  deg: "Wet conditions" },
  Wet:    { color: "bg-blue-400",   text: "text-blue-400",   penalty: 15, deg: "Heavy rain" },
};

const TOTAL_LAPS = 57;

function TireSelect({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {TIRES.map(t => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all duration-200
              ${value === t
                ? `${TIRE_CONFIG[t].color} border-transparent text-gray-900 shadow-lg scale-105`
                : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function Strategy() {
  const [strategy, setStrategy] = useState({
    startTire: "Medium",
    pitLap: 20,
    secondTire: "Hard",
  });

  const pitLap = Math.max(1, Math.min(TOTAL_LAPS - 1, strategy.pitLap || 20));
  const cfg1 = TIRE_CONFIG[strategy.startTire];
  const cfg2 = TIRE_CONFIG[strategy.secondTire];

  const baseTime  = 5400;
  const pitStop   = 22;
  const totalSecs = Math.round(baseTime + pitStop + cfg1.penalty + cfg2.penalty + strategy.pitLap * 0.5);

  const stint1Pct = Math.round((pitLap / TOTAL_LAPS) * 100);
  const stint2Pct = 100 - stint1Pct;

  const LAP_BASE = { Soft: 90.0, Medium: 91.5, Hard: 93.0, Inter: 92.5, Wet: 94.0 };
  const LAP_DEG  = { Soft: 0.08, Medium: 0.05, Hard: 0.03, Inter: 0.06, Wet: 0.07 };

  const calculateStrategyTime = (stints) => {
    let total = 0;
    stints.forEach(({ tire, laps }) => {
      const base = LAP_BASE[tire] ?? 92;
      const rate = LAP_DEG[tire]  ?? 0.05;
      for (let lap = 1; lap <= laps; lap++) total += base + lap * rate;
    });
    total += (stints.length - 1) * 22;
    return total;
  };

  const strategyA = [
    { tire: "Medium", laps: 20 },
    { tire: "Hard",   laps: 30 },
  ];

  const strategyB = [
    { tire: "Soft",   laps: 15 },
    { tire: "Medium", laps: 20 },
    { tire: "Hard",   laps: 15 },
  ];

  const recommendStrategy = () => {
    const strategies = [
      [{ tire: "Soft", laps: 15 }, { tire: "Medium", laps: 20 }, { tire: "Hard", laps: 25 }],
      [{ tire: "Medium", laps: 20 }, { tire: "Hard", laps: 40 }],
    ];
    return strategies.reduce((best, s) =>
      calculateStrategyTime(s) < calculateStrategyTime(best) ? s : best
    );
  };

  const pageVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45 }}
      className="bg-gray-900 min-h-screen text-white overflow-x-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-1">Simulator</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Race Strategy</h1>
          <p className="text-sm text-gray-400 mt-1">{TOTAL_LAPS}-lap simulation · Single pit stop</p>
        </div>

        {/* Input Card */}
        <div className="bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <TireSelect
              label="Stint 1 — Start Compound"
              value={strategy.startTire}
              onChange={v => setStrategy(s => ({ ...s, startTire: v }))}
            />

            <TireSelect
              label="Stint 2 — After Pit Compound"
              value={strategy.secondTire}
              onChange={v => setStrategy(s => ({ ...s, secondTire: v }))}
            />

            <div className="md:col-span-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Pit Stop — Lap {pitLap}
                </p>
                <span className="text-sm text-gray-300 font-mono">{pitLap} / {TOTAL_LAPS}</span>
              </div>
              <input
                type="range"
                min={1}
                max={TOTAL_LAPS - 1}
                value={pitLap}
                onChange={e => setStrategy(s => ({ ...s, pitLap: Number(e.target.value) }))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Lap 1</span>
                <span>Lap {TOTAL_LAPS}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stint Bar */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Stint Distribution</p>
          <div className="flex rounded-full overflow-hidden h-5 w-full shadow-inner">
            <motion.div
              layout
              className={`${cfg1.color} h-full flex items-center justify-center text-xs font-bold text-gray-900`}
              style={{ width: `${stint1Pct}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {stint1Pct > 12 ? `${strategy.startTire} · ${pitLap}L` : ""}
            </motion.div>
            <motion.div
              layout
              className={`${cfg2.color} h-full flex items-center justify-center text-xs font-bold text-gray-900`}
              style={{ width: `${stint2Pct}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {stint2Pct > 12 ? `${strategy.secondTire} · ${TOTAL_LAPS - pitLap}L` : ""}
            </motion.div>
          </div>
        </div>

        {/* Result + Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Estimated Time */}
          <AnimatePresence mode="wait">
            <motion.div
              key={totalSecs}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col justify-between"
            >
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Estimated Race Time</p>
              <p className="text-4xl font-extrabold text-red-500 tracking-tight">{formatTime(totalSecs)}</p>
              <p className="text-xs text-gray-500 mt-2">{totalSecs.toLocaleString()} seconds total</p>
            </motion.div>
          </AnimatePresence>

          {/* Breakdown Table */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Strategy Breakdown</p>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-700">
                {[
                  ["Base Race Time",   `${baseTime}s`],
                  ["Pit Stop Loss",    `+${pitStop}s`],
                  [`Stint 1 (${strategy.startTire})`, `+${cfg1.penalty}s penalty`],
                  [`Stint 2 (${strategy.secondTire})`, `+${cfg2.penalty}s penalty`],
                  [`Pit Lap Offset`,   `+${(strategy.pitLap * 0.5).toFixed(1)}s`],
                ].map(([label, val]) => (
                  <tr key={label}>
                    <td className="py-2 text-gray-400">{label}</td>
                    <td className="py-2 text-right font-mono text-gray-200">{val}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-600">
                  <td className="pt-3 font-bold text-white">Total</td>
                  <td className="pt-3 text-right font-mono font-bold text-red-400">{formatTime(totalSecs)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tire Info Strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
          {[
            { label: "Stint 1", tire: strategy.startTire, cfg: cfg1, laps: pitLap },
            { label: "Stint 2", tire: strategy.secondTire, cfg: cfg2, laps: TOTAL_LAPS - pitLap },
          ].map(({ label, tire, cfg, laps }) => (
            <div key={label} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
              <div className={`w-3 h-10 rounded-full ${cfg.color}`} />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`font-bold text-lg ${cfg.text}`}>{tire}</p>
                <p className="text-xs text-gray-500">{laps} laps · {cfg.deg}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Tire Degradation Chart */}
        <div className="mt-6 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Tire Degradation</p>
              <p className="text-sm text-gray-300 mt-0.5">Predicted lap time over race distance</p>
            </div>
            <span className="text-xs text-gray-500 font-mono">Pit @ Lap {pitLap}</span>
          </div>
          <div className="h-64">
            <TireDegradationChart
              tire1={strategy.startTire}
              tire2={strategy.secondTire}
              pitLap={pitLap}
              totalLaps={TOTAL_LAPS}
            />
          </div>
        </div>

        {/* Strategy Comparison */}
        <div className="mt-6 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Strategy Comparison</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Strategy A — Medium 20 / Hard 30</span>
              <span className="font-mono text-gray-200">{formatTime(Math.round(calculateStrategyTime(strategyA)))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Strategy B — Soft 15 / Medium 20 / Hard 15</span>
              <span className="font-mono text-gray-200">{formatTime(Math.round(calculateStrategyTime(strategyB)))}</span>
            </div>
          </div>
        </div>

        {/* AI Recommended Strategy */}
        <div className="mt-6 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">AI Recommended Strategy</p>
          <div className="flex flex-col gap-2">
            {recommendStrategy().map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className={`font-bold ${TIRE_CONFIG[s.tire]?.text ?? "text-gray-300"}`}>{s.tire}</span>
                <span className="text-gray-400">{s.laps} laps</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Strategy;
