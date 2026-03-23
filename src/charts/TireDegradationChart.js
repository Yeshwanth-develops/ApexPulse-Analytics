import { Line } from "react-chartjs-2";
import "./chartSetup";

const TIRE_COLOR = {
  Soft:   "#ef4444",
  Medium: "#facc15",
  Hard:   "#d1d5db",
  Inter:  "#4ade80",
  Wet:    "#60a5fa",
};

const DEG_RATE = {
  Soft:   0.08,
  Medium: 0.05,
  Hard:   0.03,
  Inter:  0.06,
  Wet:    0.07,
};

const BASE_TIME = {
  Soft:   90.0,
  Medium: 91.5,
  Hard:   93.0,
  Inter:  92.5,
  Wet:    94.0,
};

function lapTime(tire, lapInStint) {
  const base = BASE_TIME[tire] ?? 92;
  const rate = DEG_RATE[tire] ?? 0.05;
  return +(base + lapInStint * rate).toFixed(3);
}

function TireDegradationChart({ tire1 = "Medium", tire2 = "Hard", pitLap = 20, totalLaps = 57 }) {
  const labels = Array.from({ length: totalLaps }, (_, i) => `L${i + 1}`);

  const stint1Data = labels.map((_, i) =>
    i < pitLap ? lapTime(tire1, i + 1) : null
  );

  const stint2Data = labels.map((_, i) =>
    i >= pitLap ? lapTime(tire2, i - pitLap + 1) : null
  );

  const data = {
    labels,
    datasets: [
      {
        label: `Stint 1 — ${tire1}`,
        data: stint1Data,
        borderColor: TIRE_COLOR[tire1] ?? "#ef4444",
        backgroundColor: (TIRE_COLOR[tire1] ?? "#ef4444") + "22",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        spanGaps: false,
      },
      {
        label: `Stint 2 — ${tire2}`,
        data: stint2Data,
        borderColor: TIRE_COLOR[tire2] ?? "#d1d5db",
        backgroundColor: (TIRE_COLOR[tire2] ?? "#d1d5db") + "22",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        spanGaps: false,
      },
      {
        label: "Pit Stop",
        data: labels.map((_, i) => (i === pitLap - 1 ? lapTime(tire1, pitLap) + 0.5 : null)),
        borderColor: "#6b7280",
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: labels.map((_, i) => (i === pitLap - 1 ? 4 : 0)),
        pointBackgroundColor: "#6b7280",
        tension: 0,
        fill: false,
        spanGaps: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        labels: {
          color: "#9ca3af",
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f3f4f6",
        bodyColor: "#9ca3af",
        borderColor: "#374151",
        borderWidth: 1,
        callbacks: {
          label: ctx => ctx.parsed.y != null ? ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}s` : null,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280", maxTicksLimit: 12, font: { size: 10 } },
        grid: { color: "#374151" },
      },
      y: {
        ticks: { color: "#6b7280", font: { size: 10 }, callback: v => `${v}s` },
        grid: { color: "#374151" },
        title: { display: true, text: "Lap Time (s)", color: "#6b7280", font: { size: 11 } },
      },
    },
  };

  

  return <Line data={data} options={options} />;
}

export default TireDegradationChart;