const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
