import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cute-gold-bison-tie.cyclic.app/api/purchases/"
    : "http://localhost:5000/api/purchases/";

//Get All Purchase
const getAllPurchases = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new Purchase
const createPurchase = async (purchaseData: any) => {
  const res = await axios.post(API_URL, purchaseData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${purchaseData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update Purchase
const updatePurchase = async (purchaseData: any) => {
  const res = await axios.put(API_URL + purchaseData.id, purchaseData, {
    headers: {
      authorization: `Bearer ${purchaseData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Purchase
const deletePurchase = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const purchasesLogout = () => {
  return;
};

const purchaseServices = {
  getAllPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
  purchasesLogout,
};

export default purchaseServices;
