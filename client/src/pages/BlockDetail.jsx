import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BLOCK_API } from "../constant";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Table from "../components/Table";
import { FiInfo } from "react-icons/fi";
import Card from "../components/Card";
import { AiOutlinePieChart, AiOutlineBlock, AiOutlineProfile, AiOutlineFieldNumber} from "react-icons/ai";
import { TbTransactionDollar } from "react-icons/tb";
import { IoIosTimer } from "react-icons/io";
import { PiTimerLight } from "react-icons/pi";
import { MdHistory, MdTitle, MdQrCode } from "react-icons/md";
import { GoHash } from "react-icons/go";


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
              <p className="mx-4 lg:mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                Block Details
              </p>
              <hr className="border-b border-black w-[90%] mx-auto" />
              <div className="gap-4 ml-4 lg:ml-6 flex flex-col lg:flex-row items-start lg:items-center pt-6 pb-4">
                <FiInfo size="2.5em" color="#3E4758" />
                <div className="text-lg lg:text-xl text-secondaryBg break-all">
                  Block Hash: {blockData.hash}
                </div>
              </div>

              {/* Card 1: General Info */}
              <div className="flex flex-col lg:flex-row ml-4 lg:ml-8 gap-6 pb-9">
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                      <div className="flex flex-row items-center gap-2">
                          <AiOutlineProfile />
                          General Info
                        </div>
                      </div>
                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                          <AiOutlineBlock size="1.3em"/>
                          Block No ....................... {blockData.no}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                          <MdHistory size="1.3em"/>
                          Epoch .......................... {blockData.epoch_no}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                          <PiTimerLight size="1.3em"/>
                          Slot ............................. {blockData.slot_no}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row gap-2 items-center">
                        <IoIosTimer size="1.3em"/>
                        Time ........................... {new Date(blockData.time * 1000).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row gap-2 items-center">
                          <TbTransactionDollar size="1.3em"/>
                          Transactions ................. {blockData.tx}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row gap-2 items-center">
                          <AiOutlinePieChart size='1.3em' /> 
                          Size ............................ {blockData.size} bytes
                        </div>
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
                        <div className="flex flex-row items-center gap-2">
                          <AiOutlineProfile />
                          Pool Info
                        </div>
                      </div>
                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                        <GoHash size='1.3em'/>
                        Pool Hash ...................... {formatHash(blockData.pool_hash)}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                        <MdTitle size='1.3em'/>
                        Pool Name ..................... {blockData.pool_name || "N/A"}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                        <AiOutlineFieldNumber size='1.3em'/>
                        Pool Ticker .................... {blockData.pool_ticker || "N/A"}
                        </div>
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        <div className="flex flex-row items-center gap-2">
                          <MdQrCode size="1.3em"/>
                          Bech32 ......................... {formatHash(blockData.pool_bech32)}
                        </div>
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
