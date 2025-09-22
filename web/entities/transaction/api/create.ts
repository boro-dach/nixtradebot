import axios from "axios";

export async function createTransaction(values: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/transaction/create",
      values
    );
  } catch (err) {}
}
