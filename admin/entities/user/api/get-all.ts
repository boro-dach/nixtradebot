import axios from "axios";
import { IUser } from "../model/types";

export async function getAllUsers(): Promise<IUser[]> {
  const response = await axios.get("http://localhost:5000/user/get-all");
  return response.data;
}
