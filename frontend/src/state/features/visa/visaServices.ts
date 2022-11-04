import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cute-gold-bison-tie.cyclic.app/api/visas/"
    : "http://localhost:5000/api/visas/";

//Get All Visa
const getAllVisas = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new Visa
const createVisa = async (visaData: any) => {
  const res = await axios.post(API_URL, visaData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${visaData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Visa
const deleteVisa = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update Visa
const updateVisa = async (visaData: any) => {
  const res = await axios.put(API_URL + visaData.id, visaData, {
    headers: {
      authorization: `Bearer ${visaData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const visasLogout = () => {
  return;
};

const visaServices = {
  getAllVisas,
  createVisa,
  updateVisa,
  deleteVisa,
  visasLogout,
};

export default visaServices;
