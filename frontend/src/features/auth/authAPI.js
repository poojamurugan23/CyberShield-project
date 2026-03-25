import { API } from "../../utils/api";

export const loginUser = async (data) => {
  await API.login(data);
};