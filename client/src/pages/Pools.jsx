import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Card from "../components/Card";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import { POOL_API } from "../constant";
import formatHash from "../lib/utils"; 
import { Link } from "react-router-dom";

function Pools() {
  const [poolData, setPoolData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState({ after: null, next: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorStack, setCursorStack] = useState([]); 
  const [currentCursor, setCurrentCursor] = useState(null); // Store the current cursor

  const fetchData = async (pageCursor = null) => {
    setLoading(true);
    setIsSuccessful(false);
    try {
      let endpoint;

      if (pageCursor == null) {
        endpoint = `${POOL_API}.json?rows=true`;
      }
      else {
        endpoint = `${POOL_API}.json?rows=true&after=${pageCursor}`;
      }

      const response = await axios.get(endpoint);
      const data = response.data;

      setPoolData(data);
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

  const headers = ["Pool Type", "Quantity", "Stake"];
  const poolTypeRows = poolData?.data
    ? [
        { content: [{ value: "Total Pools" }, { value: poolData.data.pool }, { value: poolData.data.stake }] },
        { content: [{ value: "Pools with Stake" }, { value: poolData.data.pool_with_stake }] },
        { content: [{ value: "Pools Retired" }, { value: poolData.data.pool_retired }] },
      ]
    : [];

  const rowheaders = [
    "Hash",
    "Bech32",
    "Name",
    "Ticker",
    "Valid Meta",
    "ITN",
    "Impersonator",
    "Active Stake",
    "Live Stake",
    "Owner Stake",
    "Delegators",
    "Block Epoch",
    "Total Blocks",
    "Block",
    "Margin",
    "Fixed Cost",
    "Pledge",
    "Reward Amount",
    "Pool Fee",
    "Registration Time",
  ];

  const rowsContent = poolData?.rows
    ? poolData.rows.map((row) => ({
        content: [
            {
                value: (
                  <Link
                    to={`/pools/${row.hash}`}
                    className="text-secondaryTableText"
                  >
                    {formatHash(row.hash)}
                  </Link>
                ),
                isDiv: true,
              },
          { value: formatHash(row.bech32) },
          { value: row.name || "N/A" },
          { value: row.ticker || "N/A" },
          { value: row.valid_meta ? "Yes" : "No" },
          { value: row.itn ? "Yes" : "No" },
          { value: row.impersonator ? "Yes" : "No" },
          { value: row.active_stake },
          { value: row.live_stake },
          { value: row.owner_stake },
          { value: row.delegator },
          { value: row.block_epoch },
          { value: row.total_block },
          { value: row.block },
          { value: row.margin },
          { value: row.fixed_cost },
          { value: row.pledge },
          { value: row.reward_amount },
          { value: row.pool_fee },
          { value: new Date(row.reg_time * 1000).toLocaleString() },
        ],
      }))
    : [];

    const handlePreviousPage = () => {
      if (cursorStack.length > 0) {
        const previousCursor = cursorStack[cursorStack.length - 2]; // Get the last cursor
        console.log(previousCursor)
        setCursorStack(prevStack => prevStack.slice(0, -1)); // Remove last cursor from stack
        fetchData(previousCursor);
        setCurrentCursor(previousCursor);
        setCurrentPage(currentPage - 1);
      } else if (currentPage === 2) {
        fetchData(); // Fetch first page data
        setCurrentCursor(null);
        setCurrentPage(1);
      }
      };
    
    const handleNextPage = () => {
      if (cursor.next) {
        setCursorStack(prevStack => [...prevStack, cursor.after]); // Add current cursor to stack
        console.log("CURRENT URSPOR: ", currentCursor)
        fetchData(cursor.after);
        setCurrentPage(currentPage + 1);
      }
    };
  

  return (
    <>
      <NavBar />
      <main className="flex bg-primaryBg overflow-x-hidden">
        <Menu />
        {loading && (
          <div className="flex items-center justify-center w-full h-screen ml-28">
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
        <div className="w-full md:w-auto md:ml-28">
          {isSuccessful && (
            <>
              <div className="ml-4 md:ml-14 md:flex md:flex-wrap md:w-[40%] gap-6">
                <Card
                  left={
                    <div className="px-4 text-center">
                      <div className="text-xl text-white">{poolData.data.pool}</div>
                      <div className="text-white text-sm">TOTAL POOLS</div>
                    </div>
                  }
                  right={
                    <div>
                      <div className="text-lg text-white text-center mb-2">Pool statistics</div>
                      <div className="text-sm text-white text-right">
                        Pools with stake: {poolData.data.pool_with_stake}
                      </div>
                    </div>
                  }
                />

                <Card
                  left={
                    <div className="px-4 text-center">
                      <div className="text-xl text-white">{poolData.data.delegator}</div>
                      <div className="text-white text-sm">DELEGATORS</div>
                    </div>
                  }
                  right={
                    <div className="text-center">
                      <div className="text-lg text-white mb-2">Delegator statistics</div>
                      <div className="text-white text-sm">
                        Delegators with stake: {poolData.data.delegator_with_stake}
                      </div>
                    </div>
                  }
                />

                <Card
                  left={
                    <div className="px-4 text-center">
                      <div className="text-xl text-white">{poolData.data.saturation_point}</div>
                      <div className="text-white text-sm">SATURATION POINT</div>
                    </div>
                  }
                  right={
                    <div className="text-center">
                      <div className="text-lg text-white mb-2">Pool Saturation</div>
                      <div className="text-white text-sm">
                        Total stake: {poolData.data.stake}
                      </div>
                    </div>
                  }
                />
              </div>

              <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">Pool Types</p>

              <div className="overflow-x-auto w-full md:w-[35%]">
                <Table headers={headers} bodies={poolTypeRows} />
              </div>

              <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">Pools</p>

              <div className="overflow-x-auto w-full md:w-[50%]">
                <Table headers={rowheaders} bodies={rowsContent} />
              </div>

              {/* Pagination Controls */}
              <div className="join mt-4 mx-auto md:ml-96 mb-6 flex justify-center">
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

export default Pools;
