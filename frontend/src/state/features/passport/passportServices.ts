import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cute-gold-bison-tie.cyclic.app/api/passports/"
    : "http://localhost:5000/api/passports/";

//Get All Passports
const getAllPassports = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new Passport
const createPassport = async (passportData: any) => {
  const res = await axios.post(API_URL, passportData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${passportData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//update Passport
const updatePassport = async (passportData: {
  id: string;
  token: string;
  newState: string;
  oldState: string;
}) => {
  const res = await axios.put(API_URL + passportData.id, passportData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${passportData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Passport
const deletePassport = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const passportsLogout = () => {
  return;
};

const passportServices = {
  getAllPassports,
  deletePassport,
  createPassport,
  updatePassport,
  passportsLogout,
};

export default passportServices;
