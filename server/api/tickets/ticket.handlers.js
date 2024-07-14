const Ticket = require('../../models/Ticket');
const { addDocument, updateDocument } = require('../elasticsearch/elasticsearch.handlers');

// Get tickets by page and perPage
exports.getTickets = async function(req, res) {
  try {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 20;

    const totalRecords = await Ticket.countDocuments();
    const totalPages = Math.ceil(totalRecords / perPage);

    const tickets = await Ticket.find().skip(page * perPage).limit(perPage);

    res.json({
      items: tickets,
      total: totalRecords,
      page: page,
      perPage: perPage,
      totalPages: totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get tickets.");
  }
}

// Get a Ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Add a new ticket
exports.addTicket = async function (req, res) {
  try {
    const {indexName, ticket} = req.body;

    // get the last ticketId
    const lastTicket = await Ticket.findOne().sort({ ticketId: -1 });    

    // increment the ticketId
    ticket.ticketId = lastTicket ? lastTicket.ticketId + 1 : 1;

    const newTicket = new Ticket({
      name: ticket.name,
      description: ticket.description,
      ticketId: ticket.ticketId,
      severity: ticket.severity,
      status: ticket.status,
    });

    await newTicket.save();

    // if successful then update elastic search
    if (res.status(201)) {
      // get the recently created ticket from the database (because we need the new _id)
      const newDocument = await Ticket.findOne({ ticketId: ticket.ticketId });      

      await addDocument(indexName, newDocument);
    }

    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Edit a ticket
exports.updateTicket = async function(req, res) {

  const { indexName, ticket } = req.body;

  try {
    // check if the ticket exists
    const ticketExists = await Ticket.findById(req.params._id);
    if (!ticketExists) {
      return res.status(404).send('Ticket not found');
    }

    const updatedTicket = await Ticket.updateOne({ _id: req.params._id }, ticket);

    if (updatedTicket.acknowledged && updatedTicket.modifiedCount > 0) { 
       await updateDocument(indexName, ticket);
    }
    res.status(200).json(ticket);
  }
  catch (err) {
    res.status(500).send(err);
  }
}

// Delete a product
exports.deleteTicket = async function(req, res) {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params._id);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
    res.send(ticket);
  } catch (err) {
    res.status(500).send(err);
  }
    
}