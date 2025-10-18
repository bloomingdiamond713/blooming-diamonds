// === Load Environment Variables ===
require("dotenv").config();

// === Imports ===
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// === Express App ===
const app = express();

// === CORS Setup (IMPORTANT) ===
const corsOptions = {
  origin: [
    "https://bloomingdiamond.com",
    "https://www.blooming-diamonds.com",
    "http://localhost:5173", // Added for local development
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// === Health Check Route ===
app.get("/", (req, res) => {
  res.status(200).send("✅ Blooming Diamonds Backend is alive!");
});

// === Firebase Admin SDK Setup ===
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error(
    "❌ Failed to initialize Firebase Admin SDK. Check FIREBASE_SERVICE_ACCOUNT_KEY.",
    error
  );
}

// === Firebase Token Verification Middleware ===
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).send({ error: "Unauthorized: No token provided." });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).send({ error: "Unauthorized: Invalid token." });
  }
}

// === MongoDB Setup ===
let db;
async function getDb() {
  if (!db) {
    const uri = process.env.DATABASE_URI;
    if (!uri || !uri.startsWith("mongodb")) {
      console.error(
        "❌ Invalid or missing DATABASE_URI in environment variables."
      );
      throw new Error("❌ Invalid or missing DATABASE_URI.");
    }

    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    try {
      // Attempt to connect to the cluster
      await client.connect();
      console.log("✅ MongoDB client connected successfully!");

      // Specify the database to use
      db = client.db("bloomingDiamondsDB"); // Using a new, more descriptive name
      console.log(`✅ Successfully connected to database: ${db.databaseName}`);
    } catch (error) {
      // If connection fails, log the detailed error
      console.error("❌ MongoDB connection failed. Error:", error);
      throw error; // Rethrow the error to stop the process if the DB is essential
    }
  }
  return db;
}

// === Routes ===
app.get("/api", (req, res) =>
  res.status(200).send("UB Jewellers API is running!")
);

app.post("/api/jwt", (req, res) => {
  try {
    const user = req.body;
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(user, secret, { expiresIn: "1h" });
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: "JWT generation failed" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const database = await getDb();
    const products = await database.collection("products").find().toArray();
    res.send(products);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// NEW: Database Health Check Route
app.get("/api/db-status", async (req, res) => {
  try {
    // Attempt to get a database connection
    const database = await getDb();
    // Ping the database to confirm the connection is live and authenticated
    await database.command({ ping: 1 });
    res.status(200).send({
      status: "success",
      message: "MongoDB connected successfully!",
      databaseName: database.databaseName,
    });
  } catch (err) {
    // If getDb() or the ping fails, send back the specific error
    res.status(500).send({
      status: "error",
      message: "MongoDB connection failed.",
      errorName: err.name,
      errorMessage: err.message,
    });
  }
});

// Route to create a new user in MongoDB
app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;
    // This is the step where the connection will be attempted
    const database = await getDb();
    const usersCollection = database.collection("users");

    // Check if the user already exists to avoid duplicates
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(200).send({ message: "User already exists." });
    }

    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (err) {
    // This block will catch the error from getDb() if the connection fails
    console.error("--- ERROR IN /api/users ROUTE ---", err.message); // Log on server

    // IMPORTANT: Send the detailed error message back to the frontend
    res.status(500).send({
      message: "An error occurred on the server.",
      errorDetails: err.message, // The specific error from MongoDB
      errorName: err.name,
    });
  }
});

// NEW: Route to get a single user by email
app.get("/api/user", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).send({ error: "Email query parameter is required." });
    }

    const database = await getDb();
    const usersCollection = database.collection("users");

    // Find the user in the database
    const user = await usersCollection.findOne({ email: email });
    
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    // Send the user data back
    res.status(200).send(user);

  } catch (err) {
    console.error("--- ERROR IN /api/user ROUTE ---", err.message);
    res.status(500).send({
      message: "An error occurred on the server.",
      errorDetails: err.message,
    });
  }
});


// === Export App for Render ===
module.exports = { api: app };
