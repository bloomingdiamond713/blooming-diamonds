// functions/server.js
const apiRoutes = require('./index').api;
const express = require('express');
const cors = require('cors');
// const path = require('path'); // You can delete this line too

// CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://bloomingdiamond.com",
    "https://www.bloomingdiamond.com",
    "https://blooming-diamonds-bmbn.onrender.com"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors(corsOptions));
app.use(express.json());

// Mount API routes
app.use('/api', cors(corsOptions), apiRoutes);

// You have no other routes. The server is API-ONLY.

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});