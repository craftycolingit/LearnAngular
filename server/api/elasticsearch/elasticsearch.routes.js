const express = require("express");
const elasticsearchRoutes = express.Router();
//elasticsearchRoutes.use(express.json());

// Import the handlers
const elasticsearchHandlers = require("./elasticsearch.handlers");

// Define the routes and associate them with handler functions
elasticsearchRoutes.get("/fetch-all", elasticsearchHandlers.fetchAllDocuments);
elasticsearchRoutes.get("/search", elasticsearchHandlers.searchDocuments);
// ticketRoutes.get("/:id", ticketHandlers.getTicket);
elasticsearchRoutes.put("/create-index", elasticsearchHandlers.createIndex);
elasticsearchRoutes.put("/update-index", elasticsearchHandlers.updateIndex);
// elasticsearchRoutes.put("/:_id", elasticsearchHandlers.updateTicket);
// elasticsearchRoutes.delete("/:_id", elasticsearchHandlers.deleteTicket);

module.exports = elasticsearchRoutes;