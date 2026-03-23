import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function StandingsChart({ drivers }) {

  const data = {
    labels: drivers.map(d => d.Driver.familyName),

    datasets: [
      {
        label: "Points",
        data: drivers.map(d => d.points),
        backgroundColor: "red"
      }
    ]
  };

  const options = {
    animation: {
      duration: 1500
    },

    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },

    scales: {
      x: {
        ticks: { color: "white" }
      },
      y: {
        ticks: { color: "white" }
      }
    }
  };

  return <Bar data={data} options={options} />;
}

export default StandingsChart;