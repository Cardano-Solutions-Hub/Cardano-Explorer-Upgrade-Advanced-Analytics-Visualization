import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Card from "../components/Card";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import { TRANSACTION_API } from "../constant";
import byteSize from "byte-size";
import toPercent from 'decimal-to-percent';
import { Link } from "react-router-dom";

function formatHash(hash) {
  if (!hash) return "N/A";
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6);
  return `${start}...${end}`;
}

function Transactions() {
  const [transactionData, setTransactionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState({ after: null, next: false });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (pageCursor = null) => {
    setLoading(true);
    setIsSuccessful(false);
    try {
      let endpoint;
      
      if (pageCursor == null) {
        endpoint = `${TRANSACTION_API}.json?rows=true`
      } else {
        endpoint = `${TRANSACTION_API}.json?rows=true&after=${pageCursor}`
      }
      const response = await axios.get(endpoint);

      const data = response.data;

      console.log("Response (Tokens):", data);

      setTransactionData(data);
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
    "Transaction",
    "Time",
    "Amount",
    "Output",
    "Fee",
    "Deposit",
    "Tokens",
    "Size",
    "Script Size",
    "Slot",
    "Epoch Slot",
    "Block Index",
  ];

  const defaultValues = {
    hash: "N/A",
    time: "N/A",
    amount: "N/A",
    output: "N/A",
    fee: "N/A",
    deposit: "0",
    decimals: "0",
    token: "N/A",
    size: "0",
    script_size: "0",
    slot: "0",
    block_index: "N/A"
  };

  const bodies =
    transactionData?.rows?.map((row) => {
        const size = byteSize(row.size)
        const scriptSize = byteSize(row.script_size)
        
        return {
      content: [
        {
          value: (
            <Link className="text-secondaryTableText" to={`/transactions/${row.hash}`}>
              {formatHash(row.hash) ?? "N/A"}
            </Link>
          ),
          isDiv: true,
        },
        {
          value: row.time
            ? new Date(row.time * 1000).toLocaleString()
            : defaultValues.time,
        },
        { value: row.amount == null ? defaultValues.amount : `₳${row.amount}` },
        { value: row.out_sum ? defaultValues.output : `₳${row.out_sum}` },
        { value: row.fee ?? defaultValues.fee },
        { value: row.deposit ?? defaultValues.deposit },
        { value: row.token ?? defaultValues.token },
        { value: `${size.value}${size.unit}` },
        { value: `${scriptSize.value}${scriptSize.unit}` },
        { value: row.slot_no ?? defaultValues.slot },
        { value: `${row.epoch_no}/${row.epoch_slot_no}`},
        { value: row.block_index ?? defaultValues.block_index},
      ],
    }}) || [];

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
      <main className="flex flex-col lg:flex-row bg-primaryBg">
        <Menu />
        {loading && (
          <div className="flex items-center justify-center w-full h-screen absolute left-0 top-0 lg:ml-28 bg-primaryBg">
            <div className="text-black">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center w-full h-screen lg:ml-28">
            <p className="text-red-600 text-lg font-bold">{error.message}</p>
          </div>
        )}
        <div className="lg:ml-28 w-full px-4 sm:px-8">
          {isSuccessful && (
            <>
              <div className="lg:ml-14 flex flex-col sm:flex-row flex-wrap gap-6">
                <Card
                  left={
                    <div className="px-4 text-center">
                      <div className="text-xl text-white">
                        {transactionData.data.tx}
                      </div>
                      <div className="text-white text-sm">Total transactions</div>
                    </div>
                  }
                  right={
                    <div>
                      <div className="text-lg text-white text-center mb-2">
                        Transaction statistics
                      </div>
                      <div className="text-sm text-white text-right">
                        Live tip {transactionData.data.live_tps}
                      </div>
                      <div className="text-sm text-white text-right">
                        Live load {toPercent(transactionData.data.live_load)}
                      </div>
                    </div>
                  }
                />

                <Card
                  right={
                    <div className="text-center">
                      <div className="text-lg text-white mb-2">
                        Avg per epoch {transactionData.data.avg_tx}
                      </div>
                      <div className="text-white text-sm">
                        Min (epoch347) {transactionData.data.min_tx_epoch}
                      </div>
                      <div className="text-white text-sm">
                        Max (epoch267) {transactionData.data.max_tx_epoch}
                      </div>
                    </div>
                  }
                  one={true}
                />
              </div>

              <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg text-center sm:text-left">
                Transaction
              </p>

              <div className="overflow-x-auto sm:w-[95%]">
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

export default Transactions;
