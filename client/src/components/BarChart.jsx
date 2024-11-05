/* eslint-disable react/prop-types */
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";

function BarChartGraph({ chartData }) {
    const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.85);

    useEffect(() => {
      const handleResize = () => {
        setChartWidth(window.innerWidth * 0.85);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <div className="w-[95%] ml-6 bg-graphBg pt-6 flex flex-col justify-center">
      <h2 className="text-start font-semibold text-lg mb-4 text-secondaryBg ml-8">
        Transactions in the Past Epochs
      </h2>

      <BarChart width={chartWidth} height={350} data={chartData}>
        <rect x="65" y="0" width={chartWidth - 70} height={290} fill="#3E4758" />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="epoch" name="Epoch" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="block_size" fill="#8884d8" name="Block Size" />
      </BarChart>
    </div>
  );
}

export default BarChartGraph;
