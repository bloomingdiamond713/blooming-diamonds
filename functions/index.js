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
    "https://www.blooming-diamonds.com"
  ],
  credentials: true,
  optionsSuccessStatus: 200
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
  console.error("❌ Failed to initialize Firebase Admin SDK. Check FIREBASE_SERVICE_ACCOUNT_KEY.", error);
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
      throw new Error("❌ Invalid or missing DATABASE_URI.");
    }

    const client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    });

    await client.connect();
    console.log("✅ MongoDB connected successfully!");
    db = client.db("bloom-db");
  }
  return db;
}

// === Routes ===
app.get("/api", (req, res) => res.status(200).send("UB Jewellers API is running!"));

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

// Route to create a new user in MongoDB
app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;
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
    res.status(500).send({ error: "Failed to create user" });
  }
});

// === Export App for Render ===
module.exports = { api: app };
