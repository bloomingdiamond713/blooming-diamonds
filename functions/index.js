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
    "http://localhost:5173",
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
  console.error("❌ Failed to initialize Firebase Admin SDK.", error);
}

// === MongoDB Setup ===
let db;
let usersCollection; // Define collections at a higher scope
async function connectToDb() {
  if (db) {
    return;
  }
  const uri = process.env.DATABASE_URI;
  if (!uri || !uri.startsWith("mongodb")) {
    console.error("❌ Invalid or missing DATABASE_URI.");
    throw new Error("❌ Invalid or missing DATABASE_URI.");
  }
  const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  try {
    await client.connect();
    console.log("✅ MongoDB client connected successfully!");
    db = client.db("bloomingDiamondsDB");
    usersCollection = db.collection("users"); // Initialize collection here
    console.log(`✅ Successfully connected to database: ${db.databaseName}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed. Error:", error);
    throw error;
  }
}

// Ensure DB is connected before starting
app.use(async (req, res, next) => {
    try {
        await connectToDb();
        next();
    } catch (error) {
        res.status(500).send({ message: "Database connection error."});
    }
});


// ===================================================
// === NEW & CORRECTED MIDDLEWARE ===
// ===================================================

// 1. Middleware to verify the custom JWT
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ error: true, message: "Unauthorized: No token provided." });
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: "Unauthorized: Invalid token." });
    }
    req.decoded = decoded; // Attach decoded payload (which includes email)
    next();
  });
};

// 2. Middleware to verify if the user is an admin (runs AFTER verifyJWT)
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  try {
    const user = await usersCollection.findOne(query);
    if (user && user.admin === true) {
      next(); // User is an admin, proceed
    } else {
      return res.status(403).send({ error: true, message: "Forbidden: Admin access required." });
    }
  } catch (error) {
    console.error("Error during admin verification:", error);
    return res.status(500).send({ error: true, message: "Server error during admin check." });
  }
};


// === ROUTES ===

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
    const products = await db.collection("products").find().toArray();
    res.send(products);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// Database Health Check Route
app.get("/api/db-status", async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.status(200).send({ status: "success", message: "MongoDB connected successfully!" });
  } catch (err) {
    res.status(500).send({ status: "error", message: "MongoDB connection failed." });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(200).send({ message: "User already exists." });
    }
    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});

// SECURED: This route now requires a valid login token
app.get("/api/user", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    // Security check: Ensure the email in the query matches the one in the token
    if (req.decoded.email !== email) {
        return res.status(403).send({ error: "Forbidden: You can only request your own user data." });
    }

    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});


// --- ADMIN ROUTES (NOW SECURED) ---

// SECURED: All admin routes now use both verifyJWT and verifyAdmin middleware
app.get("/api/admin-stats", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");

    const totalUsers = await usersCollection.countDocuments();
    const totalProducts = await productsCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments();

    const revenueResult = await ordersCollection.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
    ]).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).send({ totalUsers, totalProducts, totalOrders, totalRevenue });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch admin stats." });
  }
});

app.get("/api/admin/total-spent", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const ordersCollection = db.collection("orders");
    const totalSpentArray = await ordersCollection.aggregate([
      { $group: { _id: "$email", totalSpent: { $sum: "$price" } } },
      { $project: { email: "$_id", totalSpent: 1, _id: 0 } }
    ]).toArray();
    res.status(200).send(totalSpentArray);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch total spent data." });
  }
});

app.delete("/api/admin/delete-product/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid product ID format." });
    }
    const productsCollection = db.collection("products");
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found." });
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});

// === Export App for Render ===
module.exports = { api: app };
y