const esClient = require('../../elastic-client');
const Ticket = require('../../models/Ticket');
const ticketHandlers = require('../tickets/ticket.handlers');

// create the index
exports.createTicketIndex = async function(req, res) {

console.log(req.params);

  try {

    // if index already exists return 'already exists'
    const exists = await esClient.indices.exists({
        index: 'tickets_dev'
    });

    if (exists.body) {
        return res.send('Index already exists.');
    }

    await esClient.indices.create({
      index: 'tickets_dev',
      body: {
        mappings: {
          properties: {
            _mongoId: { type: 'keyword' },
            ticketId: { type: 'integer' },
            name: { type: 'text' },
            description: { type: 'text' },
            severity: { type: 'integer' },
            status: { type: 'keyword' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' }
          }
        }
      }
    });

    return res.send('Index created successfully.');

  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to create Index.');
  }
}


// Get all tickets from elastic search
exports.getTickets = async function(req, res) {
  try {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 20;

    const { body } = await esClient.search({
      index: 'tickets_dev',
      from: page * perPage,
      size: perPage,
    });

    res.json({
      items: body.hits.hits.map(hit => hit._source),
      total: body.hits.total.value,
      page: page,
      perPage: perPage,
      totalPages: Math.ceil(body.hits.total.value / perPage)
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get tickets.");
  }
}

// update the index with data from mongodb
exports.updateIndex = async function(_, res) {
    try {
        // Fetch all tickets from the MongoDB database
        const tickets = await Ticket.find();
        
        // Ensure that the tickets array is not empty
        if (!tickets || tickets.length === 0) {
            return res.status(404).send("No tickets found.");
        }

        // Create the operations array for bulk indexing
        const operations = tickets.flatMap(ticket => [
            { index: { _index: 'tickets_dev', _id: ticket._id.toString() } }, // Use MongoDB _id as the document ID in Elasticsearch
            {
                ticketId: ticket.ticketId,
                name: ticket.name,
                description: ticket.description,
                severity: ticket.severity,
                status: ticket.status,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt
            }
        ]);

        // Perform the bulk indexing operation
        const bulkResponse = await esClient.bulk({
            refresh: true,
            body: operations
        });

        // Check if there were errors in the bulk response
        if (bulkResponse.errors) {
            const erroredDocuments = bulkResponse.items.filter(item => item.index && item.index.error);
            console.error('Bulk indexing errors:', erroredDocuments);
            return res.status(500).send('Error updating index.');
        }

        // Respond with a success message
        res.status(200).send('Index updated successfully.');

    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to get tickets.");  
    }
};