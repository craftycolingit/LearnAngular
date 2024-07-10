const Ticket = require('../../models/Ticket');

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
    // get the last ticketId
    const lastTicket = await Ticket.findOne().sort({ ticketId: -1 });

    // increment the ticketId
    req.body.ticketId = lastTicket ? lastTicket.ticketId + 1 : 1;

    const newTicket = new Ticket(req.body);

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Edit a ticket
exports.updateTicket = async function(req, res) {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.body._id, req.body, { new: true });
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