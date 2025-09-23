import axios from "axios";

export async function verifyUser(tgid: string) {
  try {
    const response = await axios.post("http://localhost:5000/user/verify", {
      tgid,
    });

    return response.data;
  } catch (err) {
    return err;
  }
}
