import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDriverStandings } from "../services/api";

function StandingsTable() {

  const [drivers, setDrivers] = useState([]);

  useEffect(() => {

    getDriverStandings().then(res => {
      setDrivers(res.data.standings || []);
    }).catch(() => {
      setDrivers([]);
    });

  }, []);

  return (

    <table className="w-full text-white">

      <thead>
        <tr>
          <th>Position</th>
          <th>Driver</th>
          <th>Points</th>
          <th>Wins</th>
        </tr>
      </thead>

      <tbody>

        {drivers.map((d, index) => (
<motion.tr
       key={d.Driver?.driverId || index}
 initial={{ opacity: 0, x: -30 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 0.05 }}
>

<td>{d.position}</td>

<td>
{d.Driver?.givenName} {d.Driver?.familyName}
</td>

<td>{d.points}</td>

<td>{d.wins}</td>

</motion.tr>

        ))}

      </tbody>

    </table>
  );

}

export default StandingsTable;