import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import InfoCard from "../components/InfoCard";
import DollarSign from "../assets/dollar-sing.png";
import UserIcon from "../assets/user.png";
import PoolsIcon from "../assets/pools.png";
import EpochIcon from "../assets/epoch.png";
import CoinIcon from "../assets/coins.png";
import MarketCapIcon from "../assets/market-cap.png";
import { EPOCH_API, BLOCK_API } from "../constant";
import axios from "axios";
import { useEffect, useState } from "react";
import Graph from "../components/Graph";
import Table from "../components/Table";
import millify from "millify";

function formatHash(hash) {
  if (!hash) return "N/A";
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6);
  return `${start}...${end}`;
}

function formatNumber(number) {
  const twoNumber = number[0] + number[1];
  return `${twoNumber}B`;
}

function Dashboard() {
  const [epochData, setEpochData] = useState({});
  const [blockData, setBlockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getEpoch = axios.get(EPOCH_API);
        const getBlocks = axios.get(`${BLOCK_API}.json?rows=true`);
        const responses = await axios.all([getEpoch, getBlocks]);

        const [response1, response2] = responses;
        setEpochData(response1.data);
        setBlockData(response2.data);
        setIsSuccessful(true);
      } catch (err) {
        console.error("Error occurred while making requests:", err);
        setError(err);
        setIsSuccessful(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const headers = [
    "Block",
    "Time",
    "trx",
    "Size",
    "Pool Name",
    "Slot",
    "Epoch Slot",
    "Amount",
    "Output",
    "Fee",
  ];

  const defaultValues = {
    no: "N/A",
    time: "N/A",
    tx: "N/A",
    size: "N/A",
    pool_name: "Unknown",
    slot_no: "N/A",
    epoch_slot_no: "N/A",
    tx_amount: "0",
    tx_out_sum: "0",
    tx_fee: "0",
  };

  const bodies =
    blockData.rows?.map((row) => ({
      content: [
        {
          value: (
            <div>
              <div className="text-secondaryTableText">
                {formatHash(row.hash) ?? "N/A"}
              </div>
              <div className="text-sm text-primaryTableText">
                {row.no ?? defaultValues.no}
              </div>
            </div>
          ),
          isDiv: true,
        },
        {
          value: row.time
            ? new Date(row.time * 1000).toLocaleString()
            : defaultValues.time,
        },
        { value: row.tx ?? defaultValues.tx },
        { value: row.size ?? defaultValues.size },
        {
          value: row.pool_name ?? defaultValues.pool_name,
          style: "text-secondaryTableText",
        },
        { value: row.slot_no ?? defaultValues.slot_no },
        { value: row.epoch_slot_no ?? defaultValues.epoch_slot_no },
        { value: row.tx_amount ?? defaultValues.tx_amount },
        { value: row.tx_out_sum ?? defaultValues.tx_out_sum },
        { value: row.tx_fee ?? defaultValues.tx_fee },
      ],
    })) || [];

  return (
    <>
      <NavBar />
      <main className="flex flex-col md:flex-row bg-primaryBg">
        <Menu />
        {loading && (
          <div className="flex items-center justify-center w-full h-screen md:ml-28">
            <div className="text-black">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center w-full h-screen md:ml-28">
            <p className="text-red-600 text-lg font-bold">{error.message}</p>
          </div>
        )}

        {isSuccessful && (
          <div className="flex-1 md:ml-28 p-4">
            <div className="flex flex-wrap gap-x-4 gap-y-6 items-start pb-6 md:ml-6">
              <InfoCard
                image={DollarSign}
                title="ADA price"
                body={"$" + epochData.rows[1]?.exchange_rate}
              />
              <InfoCard
                image={UserIcon}
                width={50}
                title="Holders"
                body={epochData.rows[0]?.token_holder}
              />
              <InfoCard
                image={PoolsIcon}
                width={50}
                title="Pools with stake"
                body={epochData.rows[0]?.pool_with_stake}
              />
              <InfoCard
                image={EpochIcon}
                width={50}
                title="Epoch"
                body={epochData.rows[0]?.no}
              />
              <InfoCard
                image={CoinIcon}
                width={50}
                title="Circulating supply"
                body={formatNumber(epochData.rows[0]?.circulating_supply)}
              />
              <InfoCard
                image={MarketCapIcon}
                title="Market cap"
                body={millify(
                  (epochData.rows[0]?.circulating_supply / 1000000) *
                    epochData.rows[1].exchange_rate
                )}
              />
            </div>

            <Graph data={epochData.rows} className="mx-2 sm:mx-4" />
            <p className="mx-2 sm:mx-6 mt-6 mb-4 font-bold text-xl sm:text-2xl text-secondaryBg">
              Recent Blocks
            </p>
            <div className="overflow-x-auto mx-2 sm:mx-6">
              <Table headers={headers} bodies={bodies} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;
