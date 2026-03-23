import { Line } from "react-chartjs-2";
import "./chartSetup";

function RacePositionChart() {

  const data = {

    labels: [
      "Lap1",
      "Lap10",
      "Lap20",
      "Lap30",
      "Lap40"
    ],

    datasets: [

      {
        label: "Driver A",
        data: [3,2,2,1,1],
        borderColor: "yellow",
        tension: 0.4
      },

      {
        label: "Driver B",
        data: [1,1,2,3,2],
        borderColor: "cyan",
        tension: 0.4
      }

    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  return <Line data={data} options={options} />;
}

export default RacePositionChart;