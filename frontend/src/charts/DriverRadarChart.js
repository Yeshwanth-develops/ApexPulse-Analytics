import { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { getDriverAnalytics } from "../services/api";
import "./chartSetup";

function DriverRadarChart({ driver1, driver2 }) {

  const isSelectionMode = driver1 !== undefined || driver2 !== undefined;
  const selectedDriver1 = isSelectionMode ? driver1 : "max_verstappen";
  const selectedDriver2 = isSelectionMode ? driver2 : "leclerc";

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const formatLabel = (driverId) => {
    if (!driverId) return "";
    return driverId
      .split("_")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  useEffect(() => {

    if (!selectedDriver1 || !selectedDriver2) {
      setData1(null);
      setData2(null);
      setLoadError("");
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadError("");

    Promise.all([
      getDriverAnalytics(selectedDriver1),
      getDriverAnalytics(selectedDriver2)
    ])
      .then(([res1, res2]) => {
        if (!isMounted) return;
        setData1(res1.data);
        setData2(res2.data);
      })
      .catch(() => {
        if (!isMounted) return;
        setData1(null);
        setData2(null);
        setLoadError("Unable to load driver analytics.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };

  }, [selectedDriver1, selectedDriver2]);

  if (!selectedDriver1 || !selectedDriver2) {
    return <p className="text-sm text-gray-300">Select two drivers to display the radar.</p>;
  }

  if (isLoading) {
    return <p className="text-sm text-gray-300">Loading driver analytics...</p>;
  }

  if (loadError) {
    return <p className="text-sm text-red-300">{loadError}</p>;
  }

  if (!data1 || !data2) {
    return <p className="text-sm text-gray-300">No radar data available for the selected drivers.</p>;
  }

  const data = {
    labels: [
      "Qualifying",
      "Race Pace",
      "Consistency",
      "Wins",
      "Points"
    ],
    datasets: [
      {
        label: formatLabel(selectedDriver1),
        data: [
          data1.qualifying,
          data1.racePace,
          data1.consistency,
          data1.wins,
          data1.points
        ],
        backgroundColor: "rgba(255,0,0,0.4)"
      },
      {
        label: formatLabel(selectedDriver2),
        data: [
          data2.qualifying,
          data2.racePace,
          data2.consistency,
          data2.wins,
          data2.points
        ],
        backgroundColor: "rgba(0,255,255,0.4)"
      }
    ]
  };

  return <Radar data={data} />;
}

export default DriverRadarChart;