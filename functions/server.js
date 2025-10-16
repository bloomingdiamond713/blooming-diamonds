// server.js (root)
const app = require('./index').api;
const PORT = process.env.PORT || 10000; // Render sets PORT automatically

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
