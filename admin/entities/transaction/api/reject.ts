import axios from "axios";

export async function rejectTransaction(id: string) {
  try {
    const response = await axios.post(
      "http://localhost:5000/transaction/reject",
      { id }
    );

    return response.data;
  } catch (err) {
    return err;
  }
}
