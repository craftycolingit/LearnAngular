const express = require("express");
const elasticsearchRoutes = express.Router();

// Import the handlers
const elasticsearchHandlers = require("./elasticsearch.handlers");

// Define the routes and associate them with handler functions
elasticsearchRoutes.get("/search", elasticsearchHandlers.getTickets);
// ticketRoutes.get("/:id", ticketHandlers.getTicket);
elasticsearchRoutes.put("/create-index", elasticsearchHandlers.createTicketIndex);
elasticsearchRoutes.put("/update-index", elasticsearchHandlers.updateIndex);
// elasticsearchRoutes.put("/:_id", elasticsearchHandlers.updateTicket);
// elasticsearchRoutes.delete("/:_id", elasticsearchHandlers.deleteTicket);

module.exports = elasticsearchRoutes;