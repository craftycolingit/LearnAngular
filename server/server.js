require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

// Import routes
const routes = require('./api/routes');

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(',');

// Middleware to allow CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowed origins array or if there's no origin (for non-CORS requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

// Choose the MongoDB URI based on the environment
const mongoURI = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI_PROD
  : process.env.MONGODB_URI_DEV;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error', err));

// Debugging the connection
const db = mongoose.connection;

// Use express.json() middleware to parse JSON bodies of requests
app.use(express.json());

// Use the imported routes
app.use('/api', routes);


app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening at ${process.env.SERVER_PORT}`);
});
