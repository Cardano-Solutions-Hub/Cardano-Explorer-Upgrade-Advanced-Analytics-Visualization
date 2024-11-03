/* eslint-disable react/prop-types */
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { useEffect, useState } from "react";

function Graph({ data }) {
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
      <LineChart
        width={chartWidth}
        height={200}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <rect x="82" y="0" width={chartWidth - 110} height={140} fill="#3E4758" />
        <CartesianGrid strokeDasharray="6, 6" />
        <XAxis 
          dataKey="no" 
          label={{ position: "insideBottom", offset: -5 }}
          tick={{ fill: "#000000" }} 
        />
        <YAxis 
          yAxisId="left"
          label={{ angle: -90, position: "insideLeft" }}
          tick={false} // Hide left Y-axis labels
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tick={false} // Hide right Y-axis labels
        />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="tx" 
          stroke="#18A0FB" 
          strokeWidth={2} 
          name="Transactions" 
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="tx_amount" 
          stroke="#5c7101" 
          strokeWidth={3} 
          name="Transaction Amount" 
        />
      </LineChart>
    </div>
  );
}

export default Graph;
