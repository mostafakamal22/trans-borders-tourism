import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cute-gold-bison-tie.cyclic.app/api/tickets/"
    : "http://localhost:5000/api/tickets/";

//Get All Tickest
const getAllTickests = async (adminData: { token: string }) => {
  const res = await axios.get(API_URL, {
    headers: {
      authorization: `Bearer ${adminData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//create new Ticket
const createTicket = async (ticketData: any) => {
  const res = await axios.post(API_URL, ticketData, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${ticketData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Update Ticket
const updateTicket = async (ticketData: any) => {
  const res = await axios.put(API_URL + ticketData.id, ticketData, {
    headers: {
      authorization: `Bearer ${ticketData.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Delete Ticket
const deleteTicket = async (payload: { id: string; token: string }) => {
  const res = await axios.delete(API_URL + payload.id, {
    headers: {
      authorization: `Bearer ${payload.token}`,
    },
  });
  const data = res.data;

  return data;
};

//Logout
const ticketsLogout = () => {
  return;
};

const ticketServices = {
  getAllTickests,
  createTicket,
  updateTicket,
  deleteTicket,
  ticketsLogout,
};

export default ticketServices;
