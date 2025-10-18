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
      console.log(`✅ Successfully connected to database: ${db.databaseName}`);
    } catch (error) {
      console.error("❌ MongoDB connection failed. Error:", error);
      throw error;
    }
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

// Database Health Check Route
app.get("/api/db-status", async (req, res) => {
  try {
    const database = await getDb();
    await database.command({ ping: 1 });
    res.status(200).send({
      status: "success",
      message: "MongoDB connected successfully!",
      databaseName: database.databaseName,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "MongoDB connection failed.",
      errorName: err.name,
      errorMessage: err.message,
    });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;
    const database = await getDb();
    const usersCollection = database.collection("users");
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(200).send({ message: "User already exists." });
    }
    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (err) {
    console.error("--- ERROR IN /api/users ROUTE ---", err.message);
    res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).send({ error: "Email query parameter is required." });
    }
    const database = await getDb();
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    res.status(200).send(user);
  } catch (err) {
    console.error("--- ERROR IN /api/user ROUTE ---", err.message);
    res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});

// --- ADMIN ROUTES ---

// Route to get overall admin statistics
app.get("/api/admin-stats", async (req, res) => {
    try {
        const database = await getDb();
        const usersCollection = database.collection("users");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders"); 

        const totalUsers = await usersCollection.countDocuments();
        const totalProducts = await productsCollection.countDocuments();
        const totalOrders = await ordersCollection.countDocuments();

        const revenueResult = await ordersCollection.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$price" } 
                }
            }
        ]).toArray();

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.status(200).send({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        });

    } catch (err) {
        console.error("--- ERROR IN /api/admin-stats ROUTE ---", err.message);
        res.status(500).send({ message: "Failed to fetch admin stats." });
    }
});

// Route to get total spent by each user
app.get("/api/admin/total-spent", async (req, res) => {
    try {
        const database = await getDb();
        const ordersCollection = database.collection("orders");

        const totalSpentArray = await ordersCollection.aggregate([
            {
                $group: {
                    _id: "$email", 
                    totalSpent: { $sum: "$price" } 
                }
            },
            {
                $project: { 
                    email: "$_id",
                    totalSpent: 1,
                    _id: 0
                }
            }
        ]).toArray();

        res.status(200).send(totalSpentArray);

    } catch (err) {
        console.error("--- ERROR IN /api/admin/total-spent ROUTE ---", err.message);
        res.status(500).send({ message: "Failed to fetch total spent data." });
    }
});

// NEW: Route to delete a product by ID (Admin)
app.delete("/api/admin/delete-product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid product ID format." });
    }

    const database = await getDb();
    const productsCollection = database.collection("products");

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found." });
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("--- ERROR IN /api/admin/delete-product ROUTE ---", err.message);
    res.status(500).send({
      message: "An error occurred on the server.",
      errorDetails: err.message,
    });
  }
});


// === Export App for Render ===
module.exports = { api: app };

