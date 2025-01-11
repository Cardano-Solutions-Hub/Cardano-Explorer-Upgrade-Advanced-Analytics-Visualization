import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const TransactionChart = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [activeAccountsData, setActiveAccountsData] = useState([]);

  useEffect(() => {
    // Fetch transaction stats from the backend API
    axios
      .get('http://localhost:5000/rest/v1/daily-stats') // Your endpoint
      .then((response) => {
        const data = response.data.data.transactionsPerMinute;

        // Prepare data in a format compatible with Recharts
        const chartData = data.map((count, index) => ({
          minute: index + 1,
          transactionCount: count,
        }));

        setTransactionData(chartData);
      })
      .catch((error) => {
        console.error('Error fetching transaction stats:', error);
      });

    // Fetch active accounts data from the AdaStat API
    axios
      .get('http://localhost:5000/rest/v1/active-accounts') // Your active accounts endpoint
      .then((response) => {
        const data = response.data.data;

        // Prepare active accounts data for the graph
        const chartData = data.map((epoch) => ({
          epoch: epoch.epoch,
          activeAccounts: epoch.activeAccounts,
        }));

        setActiveAccountsData(chartData);
      })
      .catch((error) => {
        console.error('Error fetching active accounts data:', error);
      });
  }, []);

  if (transactionData.length === 0 || activeAccountsData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
        Transaction Count per Minute (Last Hour)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={transactionData}
          style={{ backgroundColor: '#3E4758', borderRadius: '8px' }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
          <XAxis dataKey="minute" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#3E4758' }} />
          <Line type="monotone" dataKey="transactionCount" stroke="#87CEEB" />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
        Active Accounts per Epoch
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={activeAccountsData}
          style={{ backgroundColor: '#3E4758', borderRadius: '8px' }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
          <XAxis dataKey="epoch" stroke="#ffffff" />
          <YAxis stroke="#ffffff" tick={false} /> {/* Hide numbers on Y-axis */}
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#3E4758' }} />
          <Line type="monotone" dataKey="activeAccounts" stroke="#87CEEB" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
