import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { TOKEN_API } from "../constant";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Table from "../components/Table";
import { FiInfo } from "react-icons/fi";
import { IoKeyOutline } from "react-icons/io5";
import { LiaFileContractSolid } from "react-icons/lia";
import { PiLadderSimple } from "react-icons/pi";
import Card from "../components/Card";

function formatHash(hash) {
  if (!hash) return "N/A";
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 6);
  return `${start}...${end}`;
}

function TokenDetails() {
  const { id } = useParams(); // Get token ID from the URL
  const [token, setToken] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true);
      setIsSuccessful(false);
      try {
        const response = await axios.get(
          `${TOKEN_API}/${id}.json?rows=transactions`
        );
        console.log(response);
        setToken(response.data);
        setIsSuccessful(true);
      } catch (err) {
        console.error("Error fetching token data:", err);
        setError(err);
        setIsSuccessful(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [id]);

  const headers = [
    "Transaction",
    "Time",
    "Quantity",
    "Slot",
    "Epoch Slot",
    "Block Number",
    "Block Index",
  ];

  const defaultValues = {
    tx_hash: "N/A",
    time: "N/A",
    qunatity: "0",
    slot_no: "N/A",
    epoch_no: "N/A",
    block_no: "0",
    block_index: "0",
  };

  const bodies =
    token?.rows?.map((row) => ({
      content: [
        {
          value:
            row.tx_hash == "" ? defaultValues.tx_hash : formatHash(row.tx_hash),
        },
        {
          value: row.time
            ? new Date(row.time * 1000).toLocaleString()
            : defaultValues.time,
        },
        { value: row.qunatity ?? defaultValues.qunatity },
        { value: row.slot_no ?? defaultValues.slot_no },
        { value: `${row.epoch_no}/${row.epoch_slot_no}` },
        { value: row.block_no ?? defaultValues.block_no },
        { value: row.block_index ?? defaultValues.block_index },
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
                Token
              </p>
              <hr className="border-b border-black w-[90%] mx-auto" />
              <div className="gap-4 ml-4 flex flex-row items-center pt-6 pb-4">
                <FiInfo size="2.5em" color="#3E4758" />
                <div className="text-xl text-secondaryBg">
                  {token.data.name}
                </div>
              </div>

              <div className="flex flex-row gap-24 ml-4 justify-center pb-6">
                <div>
                  <div className="flex flex-row gap-2 items-center">
                    <IoKeyOutline size="2em" color="#3E4758" />
                    <p className="text-white">Fingerprint</p>
                  </div>
                  <div>
                    <p className="text-white">
                      {formatHash(token.data.fingerprint)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex flex-row gap-2 items-center">
                    <LiaFileContractSolid size="2em" color="#3E4758" />
                    <p className="text-white">Policy</p>
                  </div>

                  <div>
                    <p className="text-secondaryTableText">
                      {formatHash(token.data.policy)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex flex-row gap-2 items-center">
                    <PiLadderSimple size="2em" color="#3E4758" />
                    <p className="text-white">Hex Name</p>
                  </div>

                  <div>
                    <p className="text-white">{token.data.asset_name_hex}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row ml-8 gap-6 pb-9">
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        General Info
                      </div>

                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        Total Supply ................... {token.data.supply}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        Holders ................... {token.data.holder}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        Transactions ................... {token.data.tx}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        First Activity ...................{" "}
                        {new Date(
                          token.data.first_tx_time * 1000
                        ).toLocaleString()}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        Last Activity ...................{" "}
                        {new Date(
                          token.data.last_tx_time * 1000
                        ).toLocaleString()}
                      </div>
                    </div>
                  }
                  one={true}
                />

                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        Transaction Content
                      </div>

                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        Policy Token ...................{" "}
                        {token.data.policy_token}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        Policy Holders ...................{" "}
                        {token.data.policy_holder}
                      </div>
                    </div>
                  }
                  one={true}
                />

                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        Token Info
                      </div>

                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        Asset name ................... {token.data.name}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        Decimals ................... {token.data.decimals}
                      </div>

                      <div className="text-sm text-white text-start leading-9">
                        Token type ...................{" "}
                        {token.data.nft ? "NFT" : "Fungible Token"}
                      </div>
                    </div>
                  }
                  one={true}
                />
              </div>

              <div
                className={`overflow-x-auto w-[90vw] flex flex-col justify-center`}
              >
                <div>
                  <Table headers={headers} bodies={bodies} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default TokenDetails;
