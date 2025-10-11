// functions/server.js

const app = require('./index').api; // Import the Express app from your existing index.js
const port = process.env.PORT || 3001; // Hostinger will provide the PORT

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});