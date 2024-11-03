import axios from 'axios';
import BASEURL from '../constants.js';

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

export default tokenDistribution;
