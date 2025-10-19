// functions/server.js
const apiRoutes = require('./index').api;
const express = require('express');
const cors = require('cors');
const path = require('path');

// CORS options (keep as is)
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

// Mount API routes (keep as is)
app.use('/api', apiRoutes);

// === FIX: Correct the static file paths ===
// Serve static files from the 'dist' directory in the project root
app.use(express.static(path.join(__dirname, '../../dist'))); // Go up two levels from 'functions' to root, then 'dist'

// The "catchall" handler: Serve index.html from the root 'dist' directory
app.get('*', (req, res) => {
  // Check if the file exists before sending to avoid errors for API routes etc.
  const indexPath = path.join(__dirname, '../../dist/index.html'); // Go up two levels
  res.sendFile(indexPath, (err) => {
     if (err) {
       // If index.html isn't found (e.g., during API calls), send a 404
       // Important: Avoid sending index.html for non-existent API routes
       if (!res.headersSent) { // Check if headers were already sent (e.g., by API)
          res.status(404).send("Resource not found.");
       }
     }
  });
});
// === END FIX ===

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});