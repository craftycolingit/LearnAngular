const express = require('express');
const router = express.Router();

//Import the routes for '/tickets'
const ticketRoutes = require('./api/tickets/ticket.routes');

// Wire up the ticket routes to the express router
router.use('/tickets', ticketRoutes);

module.exports = router;