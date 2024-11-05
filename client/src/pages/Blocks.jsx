import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Card from "../components/Card";
import Table from "../components/Table";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BLOCK_API } from "../constant";
import byteSize from "byte-size";
import BarChartGraph from "../components/BarChart";

function formatHash(hash) {
  if (!hash) return "N/A";
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6);
  return `${start}...${end}`;
}

function Blocks() {

  const [blockData, setBlockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState({ after: null, next: false });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (pageCursor = null) => {
    setLoading(true);
    setIsSuccessful(false);
    try {
      const response = await axios.get(`${BLOCK_API}.json?rows=true&cursor=${pageCursor || ''}`);
      const data = response.data;

      console.log("Response (Blocks):", data);

      setBlockData(data);
      setCursor({ after: data.cursor.after, next: data.cursor.next });
      setIsSuccessful(true);
    } catch (err) {
      console.error("Error occurred while making requests:", err);
      setError(err);
      setIsSuccessful(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    blockData?.rows?.map((row) => ({
      content: [
        {
          value: (
            <div>
              <Link className="text-secondaryTableText" to={`/blocks/${row.hash}`}>
                {formatHash(row.hash) ?? "N/A"}
              </Link>
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchData(cursor.after);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (cursor.next) {
      fetchData(cursor.after);
      setCurrentPage(currentPage + 1);
    }
  };  

// Transform block data for the chart
const blockSizesByEpoch = blockData?.rows?.map(row => ({
  epoch: row.epoch_no,
  block_size: row.size,
})) || [];

  const sumBlockSize = blockData.data ? byteSize(blockData.data.sum_block_size) : null;
  const minBlockSize = blockData.data ? byteSize(blockData.data.min_block_size) : null;
  const maxBlockSize = blockData.data ? byteSize(blockData.data.max_block_size) : null;
  return (
    <>
      <NavBar />
      <main className="flex bg-primaryBg">
        <Menu />
        {loading && (
          <div className="flex items-center justify-center w-full h-screen ml-28">
            <div className="text-black">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center w-full h-screen ml-28">
            <p className="text-red-600 text-lg font-bold">{error.message}</p>
          </div>
        )}
        <div className="ml-28">
          {isSuccessful && (
            <>
              <div className="ml-14 flex flex-row gap-4">
                <Card
                  left={
                    <div className="px-4 text-center">
                      <div className="text-xl text-white">{blockData.data.block_height}</div>
                      <div className="text-white text-sm">BLOCK HEIGHT</div>
                    </div>
                  }
                  right={
                    <div className="pl-12">
                      <div className="text-lg text-white text-center mb-2">
                        Block Statistics
                      </div>
                      <div className="text-sm text-white text-right">
                        Total blocks {blockData.data.block_height}
                      </div>
                      <div className="text-sm text-white">
                        With transactions {blockData.data.block_with_tx}
                      </div>
                    </div>
                  }
                />
                <Card
                  left={
                    <div className="text-center">
                      <div className="text-lg text-white mb-2">
                        Avg per epoch {blockData.data.avg_block}
                      </div>
                      <div className="text-white text-sm">
                        Min (epoch347) {blockData.data.min_block_epoch}
                      </div>
                      <div className="text-white text-sm">
                        Max (epoch267) {blockData.data.max_block_epoch}
                      </div>
                    </div>
                  }
                  right={
                    <div className="pl-12">
                      <div className="text-lg text-white text-center mb-2">
                        Block size {`${sumBlockSize.value} ${sumBlockSize.unit}`}
                      </div>
                      <div className="text-sm text-white text-right">
                        Minimum block size {`${minBlockSize.value} ${minBlockSize.unit}`}
                      </div>
                      <div className="text-sm text-white">
                        Maximum block size {`${maxBlockSize.value} ${maxBlockSize.unit}`}
                      </div>
                    </div>
                  }
                  leftStyle="bg-secondaryBg"
                />
              </div>

              <div className="mt-8">
                <BarChartGraph chartData={blockSizesByEpoch} />
              </div>

              <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                Blocks
              </p>

              <Table headers={headers} bodies={bodies} />

              {/* Pagination Controls */}
              <div className="join mt-4 flex justify-center mb-6">
                <button
                  className="join-item btn"
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                >
                  « Previous
                </button>
                <span className="join-item btn">Page {currentPage}</span>
                <button
                  className="join-item btn"
                  disabled={!cursor.next}
                  onClick={handleNextPage}
                >
                  Next »
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Blocks;
