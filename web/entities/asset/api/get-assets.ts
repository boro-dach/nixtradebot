import axios from "axios";

export async function getAssets() {
  const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        headers: {
          "x-cg-demo-api-key": apiKey,
        },
        params: {
          vs_currency: "usd",
        },
      }
    );

    console.log("Assets fetched:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error fetching assets:", err.message);
    throw err;
  }
}
