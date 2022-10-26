import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cute-gold-bison-tie.cyclic.app/api/payments/"
    : "http://localhost:5000/api/payments/";

//Get All Payment
const getAllPayments = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new Payment
const createPayment = async (paymentData: any) => {
  const res = await axios.post(API_URL, paymentData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${paymentData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update Payment
const updatePayment = async (paymentData: any) => {
  const res = await axios.put(API_URL + paymentData.id, paymentData, {
    headers: {
      authorization: `Bearer ${paymentData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Payment
const deletePayment = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const paymentsLogout = () => {
  return;
};

const paymentServices = {
  getAllPayments,
  createPayment,
  deletePayment,
  paymentsLogout,
  updatePayment,
};

export default paymentServices;
