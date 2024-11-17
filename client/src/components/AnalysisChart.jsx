import  { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const ChartComponent = () => {
  const [data, setData] = useState(null); // State to hold API response data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isSuccessful, setIsSuccess] = useState(false)
  const [searchParams] = useSearchParams(); // To access query string

  useEffect(() => {
    const fetchData = async () => {
      const policyId = searchParams.get("policy");
      const tokenName = searchParams.get("asset_name_hex");

      if (!policyId || !tokenName) {
        setError("Missing policy or asset_name_hex in query string.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`http://localhost:5000/rest/v1/token-distribution`, {policyId, tokenName});
        console.log(response);
        if (!response.statusText == "OK") {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const responseData = response.data.data;
        console.log(responseData);
        setData(responseData);
        setIsSuccess(true);
      } catch (err) {
        setError(err.message);
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

// Prepare data for charts
const pieChartData = data?.topHolders?.map((holder, index) => ({
  name: `Holder ${index + 1}`,
  value: holder.percentage * 100,
})) || []; // Ensure a default value if data is null

const barChartData = data
  ? [
      {
        name: "Average Transaction Per Holder",
        value: data.averageTransactionPerHolder,
      },
    ]
  : [];

const transactionMetricsData = data
  ? [
      { metric: "Daily Transaction Rate", value: data.dailyTransactionRate },
      { metric: "Transaction Per Second", value: data.transactionPerSecond },
      {
        metric: "Avg. Transactions Per Holder",
        value: data.averageTransactionPerHolder,
      },
    ]
  : [];

  return (
    <>
    {loading && (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="text-black">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    )}
    {error && (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-red-600 text-lg font-bold">{error.message}</p>
      </div>
    )}
    {isSuccessful &&
    <div>
      {/* Pie Chart */}
      <div>
        <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
          Top Holders Distribution (Pie Chart)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Average Transactions */}
      <div>
        <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
          Average Transaction Per Holder (Bar Chart)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barChartData}>
            <Bar dataKey="value" fill="#8884d8" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Transaction Metrics */}
      <div>
        <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
          Transaction Metrics (Bar Chart)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={transactionMetricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>}
    </>
  );
};

export default ChartComponent;
