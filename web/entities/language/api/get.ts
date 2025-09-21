import axios from "axios";

export async function getLanguage(values: any) {
  try {
    const response = await axios.get("localhost:5000/user/language");
  } catch (err) {}
}
