const express = require("express");
const ticketRoutes = express.Router();

// Import the handlers
const ticketHandlers = require("./ticket.handlers");

// Define the routes and associate them with handler functions
ticketRoutes.get("/", ticketHandlers.getTickets);
// ticketRoutes.get("/:id", ticketHandlers.getTicket);
ticketRoutes.post("/", ticketHandlers.addTicket);
ticketRoutes.put("/:_id", ticketHandlers.updateTicket);
ticketRoutes.delete("/:_id", ticketHandlers.deleteTicket);

module.exports = ticketRoutes;