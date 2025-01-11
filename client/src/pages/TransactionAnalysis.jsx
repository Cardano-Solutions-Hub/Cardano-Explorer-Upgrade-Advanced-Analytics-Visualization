import TransactionHourChart from "../components/TransactionHourChart";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import PoolGraphByEpoch from "../components/PoolGraphByEpoch";

function TransactionAnalysis() {
    return (
        <div>
            <NavBar />
            <main className="flex flex-col lg:flex-row bg-primaryBg">
                <Menu />
                <div className="ml-2 sm:ml-6 lg:ml-28 flex-1">
                    <TransactionHourChart />
                    <PoolGraphByEpoch />
                </div>
            </main>
        </div>
    );
}

export default TransactionAnalysis;