import axios from "axios";

export async function subtractBalance(values: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/balance/subtract",
      values
    );

    return response.data;
  } catch (err) {
    return err;
  }
}
