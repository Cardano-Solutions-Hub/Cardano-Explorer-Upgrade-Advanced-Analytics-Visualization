import axios from 'axios';
import BASEURL from '../constants.js';
import fetchTransactions from '../utils/api.js';
import  getTodayDateRange from '../utils/helper.js';

const tokenDistribution = async (req, res, next) => {
  let averageSupply;
  let dailyTransactionRate;
  let transactionPerSecond;
  let averageTransactionPerHolder;

  const topHolders = [];

  const { tokenName, policyId } = req.body;

  if (!tokenName || !policyId)
    return res.status(400).json({
      status: 'failure',
      message: 'Token name and policy id is requred',
    });

  // Do api request to adasat get token
  const tokenId = policyId + tokenName;

  const api = `${BASEURL}/tokens/${tokenId}.json?rows=holders`;

  try {
    const response = await axios.get(api);
    const { data, rows } = response.data;

    // calculate average supply
    const supply = Number(data.supply);

    averageSupply = supply / data.holder;

    // top 10 holders
    const holders = rows;

    for (let i = 0; i < holders.length; i += 1) {
      const structure = {
        holderAddress: holders[i].address,
        holderAddressHash: holders[i].account_hash,
        quantity: holders[i].quantity,
        percentage: holders[i].quantity / data.supply,
      };

      topHolders.push(structure);
    }

    // calclate daily transaction rate
    const firstTxtTime = data.first_tx_time;
    const lastTxtTime = data.last_tx_time;

    const totalDays = (lastTxtTime - firstTxtTime) / (24 * 60 * 60); // Convert seconds to day

    dailyTransactionRate = data.tx / totalDays;

    transactionPerSecond = data.tx / (lastTxtTime - firstTxtTime);

    averageTransactionPerHolder = data.tx / data.holder;
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'failure', message: e });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      averageSupply,
      topHolders,
      dailyTransactionRate,
      transactionPerSecond,
      averageTransactionPerHolder,
    },
  });
};


// Function to calculate daily stats for today
async function calculateTransactionCountPerMinuteForLastHour() {
  const data = await fetchTransactions();
  const transactions = data.rows;

  // Get the current timestamp in seconds
  const currentTime = Math.floor(Date.now() / 1000);  // current time in seconds
  const oneHourAgo = currentTime - 3600;  // 3600 seconds ago (1 hour)

  // Filter transactions that happened in the last hour
  const recentTransactions = transactions.filter(tx => tx.time >= oneHourAgo);

  // Initialize an array to hold the transaction count per minute
  const transactionsPerMinute = Array(60).fill(0);  // Array with 60 slots (one for each minute)

  // Loop through the transactions and increment the correct minute index
  recentTransactions.forEach(tx => {
    const transactionMinute = Math.floor((currentTime - tx.time) / 60);  // Find the minute index
    if (transactionMinute < 60) {  // Ensure it's within the last 60 minutes
      transactionsPerMinute[transactionMinute]++;
    }
  });

  return { transactionsPerMinute };
}

async function getDailyStats(req, res, next) {
  try {
    const stats = await calculateTransactionCountPerMinuteForLastHour();
    return res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    return res.status(500).json({ status: "failure", message: error.message });
  }
}

async function getActiveAccounts(req, res, next) {
  try {
    console.log("Fetching active accounts data from AdaStat API...");
    const limit = 100; // Number of epochs to fetch
    const apiUrl = `https://api.adastat.net/rest/v1/epochs.json?rows=true&sort=account&dir=desc&limit=${limit}`;
    console.log(apiUrl)

    // Fetch epoch data
    const response = await axios.get(apiUrl);
    const epochs = response.data.rows;

    // Prepare data for the graph
    const graphData = epochs.map(epoch => ({
      epoch: epoch.no,
      activeAccounts: epoch.account
    }));

    res.status(200).json({ status: "success", data: graphData });
  } catch (error) {
    console.error("Error fetching data from AdaStat API:", error);
    res.status(500).json({ status: "failure", message: "Server Error" });
  }
}


export {
  tokenDistribution,
  getDailyStats,
  getActiveAccounts
}
