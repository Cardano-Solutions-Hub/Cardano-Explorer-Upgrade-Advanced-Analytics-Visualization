import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BLOCK_API } from "../constant";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Table from "../components/Table";
import { FiInfo } from "react-icons/fi";
import Card from "../components/Card";

function formatHash(hash) {
  if (!hash) return "N/A";
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6);
  return `${start}...${end}`;
}

function BlockDetails() {
  const { id } = useParams(); // Get block ID from the URL
  const [blockData, setBlockData] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlockData = async () => {
      setLoading(true);
      setIsSuccessful(false);
      try {
        const response = await axios.get(`${BLOCK_API}/${id}.json?`);
        console.log(response);
        setBlockData(response.data.data);
        setIsSuccessful(true);
      } catch (err) {
        console.error("Error fetching block data:", err);
        setError(err);
        setIsSuccessful(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockData();
  }, [id]);

  const transactionHeaders = [
    "Hash", "Index", "Size", "Amount", "Fee", "Tokens", "Deposite", "Script Size"
  ];

  const transactionBodies = blockData?.transactions?.rows.map((tx) => ({
    content: [
      { value: formatHash(tx.hash) },
      { value: tx.block_index },
      { value: tx.size },
      { value: `₳${(tx.amount / 1e6).toFixed(2)}` },
      { value: `₳${(tx.fee / 1e6).toFixed(2)}` },
      { value: tx.token || "N/A" },
      { value: tx.deposite || "N/A" },
      { value: tx.script_size || "N/A" },
    ],
  })) || [];

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
              <p className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                Block Details
              </p>
              <hr className="border-b border-black w-[90%] mx-auto" />
              <div className="gap-4 ml-6 flex flex-row items-center pt-6 pb-4">
                <FiInfo size="2.5em" color="#3E4758" />
                <div className="text-xl text-secondaryBg">
                  Block Hash: {blockData.hash}
                </div>
              </div>

              {/* Card 1: General Info */}
              <div className="flex flex-row ml-8 gap-6 pb-9">
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        General Info
                      </div>
                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        Block No ....................... {blockData.no}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Epoch .......................... {blockData.epoch_no}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Slot ............................. {blockData.slot_no}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Time ........................... {new Date(blockData.time * 1000).toLocaleString()}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Transactions ................. {blockData.tx}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Size ............................ {blockData.size} bytes
                      </div>
                    </div>
                  }
                  one={true}
                />

                {/* Card 2: Pool Info */}
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        Pool Info
                      </div>
                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        Pool Hash ...................... {formatHash(blockData.pool_hash)}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Pool Name ..................... {blockData.pool_name || "N/A"}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Pool Ticker .................... {blockData.pool_ticker || "N/A"}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Bech32 ......................... {formatHash(blockData.pool_bech32)}
                      </div>
                    </div>
                  }
                  one={true}
                />
              </div>

              {/* Transactions Table */}
              <div className="mx-8">
                <p className="mt-6 mb-4 font-bold text-2xl text-secondaryBg">Transactions</p>
                <Table headers={transactionHeaders} bodies={transactionBodies} />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default BlockDetails;
