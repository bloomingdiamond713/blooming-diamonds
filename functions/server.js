// functions/server.js
const apiRoutes = require('./index').api;
const express = require('express');
const cors = require('cors'); // 1. Add this import
const path = require('path');

// 2. Define your CORS options (copied from index.js)
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://bloomingdiamond.com",
    "https://www.bloomingdiamond.com",
    "https://blooming-diamonds-bmbn.onrender.com" // Add your render URL
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const PORT = process.env.PORT || 10000;

// 3. Add CORS and express.json middleware HERE
app.use(cors(corsOptions));
app.use(express.json());

// 4. Mount your API routes (this line is unchanged)
app.use('/api', apiRoutes);

// 5. Serve static files (this line is unchanged)
app.use(express.static(path.join(__dirname, '../dist')));

// 6. The "catchall" handler (this line is unchanged)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});