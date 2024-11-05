import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Card from "../components/Card";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import { ACCOUNT_API } from "../constant";
import formatHash from "../lib/utils";

function Accounts() {
  const [accountData, setAccountData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState({ after: null, next: false });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setIsSuccessful(false);
    try {
      const response = await axios.get(`${ACCOUNT_API}.json?rows=true`);
      const data = response.data;

      console.log("Response (Accounts):", data);

      setAccountData(data);
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

  const headers = ["Account Type", "Quantity", "Stake"];
  const accountTypeRows = accountData?.data?.account_types
    ? Object.entries(accountData.data.account_types).map(([type, info]) => ({
        content: [{ value: type }, { value: info.qty }, { value: info.stake }],
      }))
    : [];

  const rowheaders = [
    "Hash",
    "Bech32",
    "Balance",
    "Tokens",
    "Total Reward Amount",
    "First Transaction Hash",
    "First Transaction Time",
    "Last Transaction Hash",
    "Last Transaction Time",
    "Transaction Count",
    "Pool Name",
    "Pool Ticker",
  ];

  const rowsContent = accountData?.rows
    ? accountData.rows.map((row) => ({
        content: [
          { value: formatHash(row.hash) },
          { value: formatHash(row.bech32) },
          { value: row.balance },
          { value: row.token },
          { value: row.total_reward_amount },
          { value: formatHash(row.first_tx_hash) },
          { value: new Date(row.first_tx_time * 1000).toLocaleString() },
          { value: row.last_tx_hash },
          { value: new Date(row.last_tx_time * 1000).toLocaleString() },
          { value: row.tx },
          { value: row.pool_name || "N/A" },
          { value: row.pool_ticker || "N/A" },
        ],
      }))
    : [];

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
              <div className="flex items-center justify-center w-full h-screen ml-28">
                <p className="text-red-600 text-lg font-bold">{error.message}</p>
              </div>
            )}
            <div className="ml-28">
              {isSuccessful && (
                <>
                  <div className="ml-14 flex flex-row flex-wrap w-[40%] gap-6">
                    <Card
                      left={
                        <div className="px-4 text-center">
                          <div className="text-xl text-white">
                            {accountData.data.account}
                          </div>
                          <div className="text-white text-sm">
                            TOTAL ACCOUNTS
                          </div>
                        </div>
                      }
                      right={
                        <div>
                          <div className="text-lg text-white text-center mb-2">
                          Account statistics
                          </div>
                          <div className="text-sm text-white text-right">
                            Accounts with amount:{" "}
                            {accountData.data.account_with_amount}
                          </div>
                        </div>
                      }
                    />
    
                    <Card
                    left={
                        <div className="px-4 text-center">
                          <div className="text-xl text-white">
                          {accountData.data.delegator}
                          </div>
                          <div className="text-white text-sm">
                          DELEGATORS
                          </div>
                        </div>
                      }
                      right={
                        <div className="text-center">
                          <div className="text-lg text-white mb-2">
                          Delegator statistics
                          </div>
                          <div className="text-white text-sm">
                          Delegators with stake:{" "}
                          {accountData.data.delegator_with_stake}
                          </div>
                        </div>
                      }
                    />

                  <Card
                    left={
                        <div className="px-4 text-center">
                          <div className="text-xl text-white">
                          {accountData.data.shelley_amount}
                          </div>
                          <div className="text-white text-sm">
                          SHELLEY AMOUNT
                          </div>
                        </div>
                      }
                      right={
                        <div className="text-center">
                          <div className="text-lg text-white mb-2">
                          Stake statistics
                          </div>
                          <div className="text-white text-sm">
                          Total stake: {accountData.data.stake}
                          </div>
                        </div>
                      }
                    />
                  </div>
    
                  <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                    Account Types
                  </p>
    
                  <div className="overflow-x-auto w-[55%]">
                    <Table headers={headers} bodies={accountTypeRows} />
                  </div>

                  <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                    Accounts
                  </p>

                  <div className="overflow-x-auto w-[55%]">
                    <Table headers={rowheaders} bodies={rowsContent} />
                  </div>
    
                  {/* Pagination Controls */}
                  <div className="join mt-4 ml-96 mb-6">
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

export default Accounts;
