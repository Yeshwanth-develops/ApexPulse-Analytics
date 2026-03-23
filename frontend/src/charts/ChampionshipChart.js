import {
  Line
} from "react-chartjs-2";
import "./chartSetup";

function ChampionshipChart() {

  const data = {

    labels: [
      "Race 1",
      "Race 2",
      "Race 3",
      "Race 4"
    ],

    datasets: [

      {
        label: "Driver A",
        data: [25, 43, 61, 86],
        borderColor: "red",
        tension: 0.4
      },

      {
        label: "Driver B",
        data: [18, 36, 52, 70],
        borderColor: "cyan",
        tension: 0.4
      }

    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500
    },
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  return <Line data={data} options={options} />;
}

export default ChampionshipChart;