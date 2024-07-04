const express = require('express');
const router = express.Router();

//Import the routes for '/tickets'
const ticketRoutes = require('./tickets/ticket.routes');
const elasticsearchRoutes = require('./elasticsearch/elasticsearch.routes');

// Wire up the ticket routes to the express router
router.use('/tickets', ticketRoutes);
router.use('/elasticsearch', elasticsearchRoutes);

module.exports = router;