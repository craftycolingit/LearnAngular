const ticketDoc = new Schema({
    _mongoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
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
    });