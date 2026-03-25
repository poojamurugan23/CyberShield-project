import { API } from "../../utils/api";

export const createCase = async (desc) => {
  const token = localStorage.getItem("token");
  return API.createCase({ description: desc }, token);
};