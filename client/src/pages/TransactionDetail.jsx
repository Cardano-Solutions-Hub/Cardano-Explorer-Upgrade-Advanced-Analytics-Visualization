import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { TRANSACTION_API } from "../constant";
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

function TransactionDetails() {
  const { id } = useParams(); // Get transaction ID from the URL
  const [transaction, setTransaction] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      setIsSuccessful(false);
      try {
        const response = await axios.get(`${TRANSACTION_API}/${id}.json?`);
        console.log(response);
        setTransaction(response.data);
        setIsSuccessful(true);
      } catch (err) {
        console.error("Error fetching transaction data:", err);
        setError(err);
        setIsSuccessful(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [id]);

  const headers = [
    "Input/Output",
    "Amount",
    "Address",
    "Token",
    "Fingerprint",
  ];

  const bodies = [
    ...transaction?.data.inputs?.rows.map((input) => ({
      content: [
        { value: "Input" },
        { value: input.amount },
        { value: formatHash(input.address) },
        { value: input.tokens.map(token => token.name).join(", ") || "N/A" },
        { value: formatHash(input.tokens.map(token => token.fingerprint).join(", ")) || "N/A" },
      ],
    })) || []
  ];

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
                Transaction
              </p>
              <hr className="border-b border-black w-[90%] mx-auto" />
              <div className="gap-4 ml-6 flex flex-row items-center pt-6 pb-4">
                <FiInfo size="2.5em" color="#3E4758" />
                <div className="text-xl text-secondaryBg">
                  {transaction.data.hash}
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
                        Total Input .................. {transaction.data.inputs.rows.length}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Total Withdrawal ............ {transaction.data.withdrawals.rows.length}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Total Output ................. {transaction.data.inputs.rows.length}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Amount ....................... ₳{transaction.data.amount}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Fee ........................... ₳{transaction.data.fee}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Deposit ...................... ₳{transaction.data.deposit}
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
                        Inputs ....................... {transaction.data.inputs.rows.length}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Outputs ...................... {transaction.data.outputs.rows.length}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Tokens ....................... {transaction.data.token}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Certificates .................. {transaction.data.certificate}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Size .......................... {transaction.data.size}
                      </div>
                    </div>
                  }
                  one={true}
                />

                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        Block Info
                      </div>
                      <hr />
                      <div className="text-sm text-white text-start leading-9">
                        Block ......................... {transaction.data.block_no}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Epoch / Slot ................. {transaction.data.epoch_no} / {transaction.data.slot_no}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Slot Number .................. {transaction.data.slot_no}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Time .......................... {new Date(transaction.data.time * 1000).toLocaleString()}
                      </div>
                      <div className="text-sm text-white text-start leading-9">
                        Confirmations ................ {transaction.data.confirmation}
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

export default TransactionDetails;
