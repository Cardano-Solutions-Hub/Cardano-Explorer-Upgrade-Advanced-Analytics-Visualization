import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Card from "../components/Card";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import { TOKEN_API } from "../constant";
import { Link } from "react-router-dom";

function formatHash(hash) {
  if (!hash) return "N/A";
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6);
  return `${start}...${end}`;
}

function Tokens() {
  const [tokenData, setTokenData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState({ after: null, next: false });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (pageCursor = null) => {
    setLoading(true);
    setIsSuccessful(false);
    try {
      const response = await axios.get(
        `${TOKEN_API}.json?rows=true&cursor=${pageCursor || ""}`
      );
      const data = response.data;

      console.log("Response (Tokens):", data);

      console.log(data.rows[7].policy);
      console.log(data.rows[7].asset_name_hex);

      setTokenData(data);
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
    "Image",
    "Policy",
    "Name",
    "Fingerprint",
    "Ticker",
    "Supply",
    "Decimals",
    "First Transaction",
    "Last Transaction",
    "Transactions",
    "Holders",
    "Analysis",
  ];

  const defaultValues = {
    image: "N/A",
    policy: "N/A",
    name: "N/A",
    fingerprint: "N/A",
    ticker: "N/A",
    supply: "0",
    decimals: "0",
    first_tx: "N/A",
    last_tx: "N/A",
    tx: "0",
    holder: "0",
  };

  const bodies =
    tokenData?.rows?.map((row) => ({
      content: [
        {
          value: (
            <div>
              {row.image === "" ? (
                <div>{defaultValues.image}</div>
              ) : (
                <img
                  src={`https://ipfs.io/ipfs/${row.image.replace(
                    "ipfs://",
                    ""
                  )}`}
                  width={50}
                  alt="Token Image"
                />
              )}
            </div>
          ),
          isDiv: true,
        },
        {
          value: (
            <Link
              to={`/tokens/${row.policy}${row.asset_name_hex}`}
              className="text-secondaryTableText"
            >
              {formatHash(row.policy)}
            </Link>
          ),
          isDiv: true,
        },
        { value: row.name == "" ? defaultValues.name : row.name },
        { value: formatHash(row.fingerprint) ?? defaultValues.fingerprint },
        { value: row.ticker ?? defaultValues.ticker },
        { value: row.supply ?? defaultValues.supply },
        { value: row.decimals ?? defaultValues.decimals },
        {
          value: row.first_tx_time
            ? new Date(row.first_tx_time * 1000).toLocaleString()
            : defaultValues.first_tx,
        },
        {
          value: row.last_tx_time
            ? new Date(row.last_tx_time * 1000).toLocaleString()
            : defaultValues.last_tx,
        },
        { value: row.tx ?? defaultValues.tx },
        { value: row.holder ?? defaultValues.holder },
        {
          value: (
            <Link
              to={`/analysis?policy=${row.policy}&asset_name_hex=${row.asset_name_hex}`}
              className="text-blue-500 underline"
            >
              Analyze
            </Link>
          ),
          isDiv: true,
        },
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
              <div className="ml-14 flex flex-row gap-6">
                <Card
                  left={
                    <div className="px-4 text-center">
                      <div className="text-xl text-white">
                        {tokenData.data.token}
                      </div>
                      <div className="text-white text-sm">TOTAL TOKEN</div>
                    </div>
                  }
                  right={
                    <div>
                      <div className="text-lg text-white text-center mb-2">
                        Token statistics
                      </div>
                      <div className="text-sm text-white text-right">
                        Total blocks {tokenData.data.policy}
                      </div>
                    </div>
                  }
                />
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-center mb-2">
                        Holder statistics
                      </div>
                      <div className="text-sm text-white text-right">
                        Token holder {tokenData.data.holder}
                      </div>
                    </div>
                  }
                  one={true}
                />

                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-center mb-2">
                        Transaction statistics
                      </div>
                      <div className="text-sm text-white text-right">
                        Total transactions {tokenData.data.tx}
                      </div>
                    </div>
                  }
                  one={true}
                />
              </div>

              <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                Tokens
              </p>

              <div className="overflow-x-auto w-[95%]">
                <Table headers={headers} bodies={bodies} />
              </div>

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

export default Tokens;
