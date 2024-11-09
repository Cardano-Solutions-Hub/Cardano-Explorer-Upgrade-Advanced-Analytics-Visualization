import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { POOL_API } from "../constant";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Table from "../components/Table";
import { FiInfo } from "react-icons/fi";
import Card from "../components/Card";
import formatHash from "../lib/utils";
import { FaPercent } from "react-icons/fa";
import { BiMoney, BiCoinStack } from "react-icons/bi";
import { MdStackedLineChart, MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import { CiCircleInfo } from "react-icons/ci";

function PoolDetail() {
  const { id } = useParams(); // Get pool ID from the URL
  const [poolData, setPoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoolData = async () => {
      setLoading(true);
      setIsSuccessful(false);
      try {
        const response = await axios.get(`${POOL_API}/${id}.json?`);
        setPoolData(response.data.data);
        setIsSuccessful(true);
      } catch (err) {
        console.error("Error fetching pool data:", err);
        setError(err);
        setIsSuccessful(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPoolData();
  }, [id]);

  const ownerHeaders = ["Owner Hash", "Bech32", "Live Stake", "Active Stake"];
  const ownerBodies =
    poolData?.owners.map((owner) => ({
      content: [
        { value: formatHash(owner.hash) },
        { value: formatHash(owner.bech32) },
        { value: `₳${(owner.live_stake / 1e6).toFixed(2)}` },
        { value: `₳${(owner.active_stake / 1e6).toFixed(2)}` },
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
                Pool Details
              </p>
              <hr className="border-b border-black w-[90%] mx-auto" />
              <div className="gap-4 ml-6 flex flex-row items-center pt-6 pb-4">
                <FiInfo size="2.5em" color="#3E4758" />
                <div className="text-xl text-secondaryBg">
                  Pool Hash: {poolData.hash}
                </div>
              </div>

              {/* Card: General Pool Info */}
              <div className="flex flex-row ml-8 gap-6 pb-9">
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        General Info
                      </div>
                      <hr />
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                      <CiCircleInfo />
                        Pool Name ......................{" "}
                        {poolData.name || "N/A"}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <BiCoinStack size="1.3em" />
                        Ticker ...........................{" "}
                        {poolData.ticker || "N/A"}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <FaPercent size="1.3em" />
                        Margin .......................... {poolData.margin}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdOutlineAttachMoney size="1.3em" />
                        Fixed Cost ....................... ₳
                        {(poolData.fixed_cost / 1e6).toFixed(2)}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <BiMoney size="1.3em" />
                        Pledge ........................... ₳
                        {(poolData.pledge / 1e6).toFixed(2)}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdStackedLineChart size="1.3em" />
                        Active Stake .................... ₳
                        {(poolData.active_stake / 1e6).toFixed(2)}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <AiOutlineLineChart size="1.3em" />
                        Live Stake ........................ ₳
                        {(poolData.live_stake / 1e6).toFixed(2)}
                      </div>
                    </div>
                  }
                  one={true}
                />
              </div>

              {/* Table: Owner Details */}
              <div className="mx-8">
                <p className="mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                  Pool Owners
                </p>
                <Table headers={ownerHeaders} bodies={ownerBodies} />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default PoolDetail;
