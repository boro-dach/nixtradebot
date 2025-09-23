import axios from "axios";

export async function acceptTransaction(id: string) {
  try {
    const response = await axios.post(
      "http://localhost:5000/transaction/accept",
      { id }
    );

    return response.data;
  } catch (err) {
    return err;
  }
}
