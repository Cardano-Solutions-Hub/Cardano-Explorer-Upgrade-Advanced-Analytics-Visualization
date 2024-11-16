import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { TRANSACTION_API } from "../constant";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import Table from "../components/Table";
import { FiInfo } from "react-icons/fi";
import Card from "../components/Card";
import { PiTimerLight } from "react-icons/pi";
import {
  MdInput,
  MdOutput,
  MdAccountBalanceWallet,
  MdAttachMoney,
  MdReceipt,
} from "react-icons/md";
import {
  AiOutlineBarcode,
  AiOutlineNumber,
  AiOutlineClockCircle,
  AiOutlineTag,
} from "react-icons/ai";
import { BiTransfer, BiBlock } from "react-icons/bi";
import { FaCertificate } from "react-icons/fa";

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

  const headers = ["Input/Output", "Amount", "Address", "Token", "Fingerprint"];

  const bodies = [
    ...(transaction?.data.inputs?.rows.map((input) => ({
      content: [
        { value: "Input" },
        { value: input.amount },
        { value: formatHash(input.address) },
        { value: input.tokens.map((token) => token.name).join(", ") || "N/A" },
        {
          value:
            formatHash(
              input.tokens.map((token) => token.fingerprint).join(", ")
            ) || "N/A",
        },
      ],
    })) || []),
  ];

  return (
    <>
      <NavBar />
      <main className="flex flex-col lg:flex-row bg-primaryBg">
        <Menu />
        {loading && (
          <div className="flex items-center justify-center w-full h-screen md:ml-28">
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
        <div className="lg:ml-28 w-full">
          {isSuccessful && (
            <>
              <p className="mx-4 lg:mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
                Transaction
              </p>
              <hr className="border-b border-black w-[90%] mx-auto" />
              <div className="gap-4 ml-4 lg:ml-6 flex flex-col lg:flex-row items-start lg:items-center pt-6 pb-4">
                <FiInfo size="2.5em" color="#3E4758" />
                <div className="text-lg lg:text-xl text-secondaryBg break-all">
                  {transaction.data.hash}
                </div>
              </div>

              {/* Card 1: General Info */}
              <div className="flex flex-col lg:flex-row ml-4 lg:ml-8 gap-6 pb-9">
                <Card
                  right={
                    <div>
                      <div className="text-lg text-white text-start mb-2 leading-9">
                        General Info
                      </div>
                      <hr />
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdInput size="1.3em" />
                        Total Input ..................{" "}
                        {transaction.data.inputs.rows.length}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <BiTransfer size="1.3em" />
                        Total Withdrawal ............{" "}
                        {transaction.data.withdrawals.rows.length}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdOutput size="1.3em" />
                        Total Output .................{" "}
                        {transaction.data.outputs.rows.length}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdAccountBalanceWallet size="1.3em" />
                        Amount ....................... ₳
                        {transaction.data.amount}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdAttachMoney size="1.3em" />
                        Fee ........................... ₳{transaction.data.fee}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdReceipt size="1.3em" />
                        Deposit ...................... ₳
                        {transaction.data.deposit}
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
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdInput size="1.3em" />
                        Inputs .......................{" "}
                        {transaction.data.inputs.rows.length}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <MdOutput size="1.3em" />
                        Outputs ......................{" "}
                        {transaction.data.outputs.rows.length}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <AiOutlineTag size="1.3em" />
                        Tokens ....................... {transaction.data.token}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <FaCertificate size="1.3em" />
                        Certificates ..................{" "}
                        {transaction.data.certificate}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <AiOutlineBarcode size="1.3em" />
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
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <BiBlock size="1.3em" />
                        Block .........................{" "}
                        {transaction.data.block_no}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <AiOutlineNumber size="1.3em" />
                        Epoch / Slot .................{" "}
                        {transaction.data.epoch_no} / {transaction.data.slot_no}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <PiTimerLight size="1.3em" />
                        Slot Number ..................{" "}
                        {transaction.data.slot_no}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <AiOutlineClockCircle size="1.3em" />
                        Time ..........................{" "}
                        {new Date(
                          transaction.data.time * 1000
                        ).toLocaleString()}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-sm text-white text-start leading-9">
                        <BiTransfer size="1.3em" />
                        Confirmations ................{" "}
                        {transaction.data.confirmation}
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
