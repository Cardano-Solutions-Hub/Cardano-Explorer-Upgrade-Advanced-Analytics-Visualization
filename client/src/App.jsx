import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Blocks from "./pages/Blocks";
import Tokens from "./pages/Tokens";
import Transactions from "./pages/Transaction";
import TokenDetails from "./pages/TokenDetail";
import TransactionDetails from "./pages/TransactionDetail";
import BlockDetails from "./pages/BlockDetail";
import Accounts from "./pages/Account";
import Pools from "./pages/Pools";
import PoolDetail from "./pages/PoolDetail";

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Dashboard />}/>
      <Route path="/blocks" element={<Blocks />} />
      <Route path="/blocks/:id" element={<BlockDetails />} />
      <Route path="/tokens" element={<Tokens />} />
      <Route path="/tokens/:id" element={<TokenDetails />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/transactions/:id" element={<TransactionDetails />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/pools" element={<Pools />} />
      <Route path="/pools/:id" element={<PoolDetail />} />
    </Routes>
  </BrowserRouter>
  )
}
export default App;
