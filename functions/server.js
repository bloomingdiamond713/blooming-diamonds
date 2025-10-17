// server.js (root)
const app = require('./index').api;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 10000; // Render sets PORT automatically

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});