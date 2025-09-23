import axios from "axios";

export async function getBalance(values: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/balance/get",
      values
    );

    return response.data;
  } catch (err) {
    return err;
  }
}
