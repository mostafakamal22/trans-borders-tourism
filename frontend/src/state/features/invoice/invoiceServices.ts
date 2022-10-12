import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cute-gold-bison-tie.cyclic.app/api/users/"
    : "http://localhost:5000/api/invoices/";

//Get All Invoices
const getAllInvoices = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new invoice
const createInvoice = async (invoiceDate: any) => {
  const res = await axios.post(API_URL, invoiceDate, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${invoiceDate.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Invoice
const deleteInvoice = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const adminsLogout = () => {
  return;
};

const invoiceServices = {
  getAllInvoices,
  deleteInvoice,
  createInvoice,
  adminsLogout,
};

export default invoiceServices;
