import { Line } from "react-chartjs-2";
import "./chartSetup";

function LapTimeChart() {

  const data = {

    labels: [
      "Lap1",
      "Lap2",
      "Lap3",
      "Lap4",
      "Lap5"
    ],

    datasets: [

      {
        label: "Driver A",
        data: [92, 91, 91.3, 90.9, 90.7],
        borderColor: "red"
      },

      {
        label: "Driver B",
        data: [92.5, 91.8, 91.4, 91.2, 91],
        borderColor: "blue"
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

export default LapTimeChart;