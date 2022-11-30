import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_CORS_DOMAINS + "/api/banks/"
    : "http://localhost:5000/api/banks/";

//Get All bank
const getAllBanks = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new bank
const createBank = async (bankData: any) => {
  const res = await axios.post(API_URL, bankData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${bankData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete bank
const deleteBank = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update bank
const updateBank = async (bankData: any) => {
  const res = await axios.put(API_URL + bankData.id, bankData, {
    headers: {
      authorization: `Bearer ${bankData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const BanksLogout = () => {
  return;
};

const bankServices = {
  getAllBanks,
  createBank,
  updateBank,
  deleteBank,
  BanksLogout,
};

export default bankServices;
