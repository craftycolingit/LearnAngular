const esClient = require('../../elastic-client');
const Ticket = require('../../models/Ticket');

// create the index
exports.createIndex = async function(req, res) {
  try {

    const { indexName, mappings } = req.body;

    // if index already exists return 'already exists'
    const exists = await esClient.indices.exists({
        index: indexName
    });

    if (exists.body) {
        return res.send('Index already exists.');
    }

    await esClient.indices.create({
      index: indexName,
      body: {
        mappings
      }
    });

    return res.send('Index created successfully.');

  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to create Index.');
  }
}

// search documents by query
exports.searchDocuments = async function (req, res) {
  try {
    const { indexName, page = 0, perPage = 20, query } = req.query;

    const searchQuery = {
      index: indexName,
      from: page * perPage,
      size: perPage,
      body: {
        query: {
          multi_match: {
            query: query,
            type: "bool_prefix",
            fields: ["name", "name._2gram", "name._3gram"],
          },
        },
      } 
    }

    const response = await esClient.search(searchQuery);

    return res.status(200).json({
      items: response.hits.hits.map(hit => hit._source),
      total: response.hits.total.value,
      page: page,
      perPage: perPage,
      totalPages: Math.ceil(response.hits.total.value / perPage)
    });   

  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get documents.");
  }
}

// Get all documents from elastic search
exports.fetchAllDocuments = async function(req, res) {
  try {

    const { indexName, page = 0, perPage = 20 } = req.query;

    const response = await esClient.search({
      index: indexName,
      from: page * perPage,
      size: perPage,
      body: {
        sort: [
          { ticketId: { order: "asc" } } // Ensure sorting by ticketId in ascending order
        ],
        query: {
          match_all: {}
        }
      },
      request_cache: false
    });

    return res.status(200).json({
      items: response.hits.hits.map(hit => ({
        ...hit._source,
      _id: hit._id
    })),
      total: response.hits.total.value,
      page: page,
      perPage: perPage,
      totalPages: Math.ceil(response.hits.total.value / perPage)
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get documents.");
  }
}

// update the index with data from mongodb
exports.updateIndex = async function(req, res) {
    try {
       const { indexName } = req.body;

        // Fetch all tickets from the MongoDB database
        const tickets = await Ticket.find();
        
        // Ensure that the tickets array is not empty
        if (!tickets || tickets.length === 0) {
            return res.status(404).send("No tickets found.");
        }

        // Create the operations array for bulk indexing
        const operations = tickets.flatMap(ticket => [
            { index: 
              { 
                _index: indexName, 
                _id: ticket._id.toString() 
              } 
            }, // Use MongoDB _id as the document ID in Elasticsearch
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

        // delete all documents from the index
        await esClient.deleteByQuery({
            index: indexName,
            body: {
                query: {
                    match_all: {}
                }
            }
        });

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

// add a new document to elastic search
exports.addDocument = async function(indexName, newDocument) {
  try {
    const response = await esClient.index({
      index: indexName, 
      id: newDocument._id.toString(),
      body: {
        ticketId: newDocument.ticketId,
        name: newDocument.name,
        description: newDocument.description,
        severity: newDocument.severity,
        status: newDocument.status,
        createdAt: newDocument.createdAt,
        updatedAt: newDocument.updatedAt,
      },
    });
    return response;
  } catch (error) {
    console.error('Error adding document to Elasticsearch:', error);
    throw new Error("Unable to add document."); // Throw error to be caught in the calling function
  }
};

// update a document in elastic search
exports.updateDocument = async function(indexName, updatedDocument) { 
  try {
    const response = await esClient.update({
      index: indexName,
      id: updatedDocument._id.toString(),
      body: { doc: {
        name: updatedDocument.name,
        description: updatedDocument.description,
        severity: updatedDocument.severity,
        status: updatedDocument.status,
        updatedAt: updatedDocument.updatedAt
    }} 
    });

    // Refresh the index
    await esClient.indices.refresh({ index: indexName });

    return response;
  } catch (error) {
    console.error('Error updating document in Elasticsearch:', error);
    throw new Error("Unable to update document."); // Throw error to be caught in the calling function
  }
}

// delete a document from elastic search
exports.deleteDocument = async function(indexName, documentId) {

  try {
    const response = await esClient.delete({
      index: indexName,
      id: documentId
    });

    // Refresh the index
    await esClient.indices.refresh({ index: indexName });

    return response;
  } catch (error) {
    console.error('Error deleting document from Elasticsearch:', error);
    throw new Error("Unable to delete document."); // Throw error to be caught in the calling function
  }
}
