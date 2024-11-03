import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Blocks from "./pages/Blocks";
import Tokens from "./pages/Tokens";
import Transactions from "./pages/Transaction";

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Dashboard />}/>
      <Route path="/blocks" element={<Blocks />} />
      <Route path="/tokens" element={<Tokens />} />
      <Route path="/transactions" element={<Transactions />} />
    </Routes>
  </BrowserRouter>
  )
}
export default App;
