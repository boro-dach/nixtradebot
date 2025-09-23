import axios from "axios";

export async function getAllTransactions() {
  const response = await axios.get("http://localhost:5000/transaction/all");
  return response.data;
}
