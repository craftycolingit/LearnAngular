const esClient = require('../../elastic-client');

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
            subject: { type: 'text' },
            description: { type: 'text' },
            status: { type: 'keyword' },
            priority: { type: 'keyword' },
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
      index: 'tickets',
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