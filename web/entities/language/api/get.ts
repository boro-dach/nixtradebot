import axios from "axios";

export async function getLanguage(tgid: number) {
  try {
    const response = await axios.post(
      `http://localhost:5000/user/get-language`,
      { tgid: tgid }
    );

    return response.data;
  } catch (err) {
    console.error("Ошибка получения языка:", err);
    throw err;
  }
}
