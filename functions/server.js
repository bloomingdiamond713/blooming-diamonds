// server.js (root)
const apiRoutes = require('./index').api; // 1. Import your API routes from index.js
const express = require('express');
const path = require('path');

const app = express(); // 2. Create a new main app
const PORT = process.env.PORT || 10000;

// 3. Mount your API routes to live under the /api path
app.use('/api', apiRoutes);

// 4. Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// 5. The "catchall" handler for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});