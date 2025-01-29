import BASEURL from "../constants.js";
import axios from "axios";

// Function to fetch transactions from Adastat API
async function fetchTransactions() {
    const url = `${BASEURL}/transactions.json?rows=true&sort=time&limit=1000`;
    
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      throw error;
    }
  }

export default fetchTransactions