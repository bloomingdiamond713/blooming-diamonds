// Load environment variables from a .env file for local development
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const admin = require('firebase-admin');

// --- Initializations ---

// Initialize Stripe with the secret key from your environment variables
// IMPORTANT: Make sure you have STRIPE_SECRET_KEY in your .env file
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// --- Firebase Admin SDK Setup ---
// This is for verifying user tokens from your frontend
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK. Make sure serviceAccountKey.json exists.", error);
}

// --- Middleware ---

app.use(cors({ origin: true }));
app.use(express.json());

// Middleware to verify Firebase ID token sent from the client
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send({ error: 'Unauthorized: No token provided.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add user info to the request object for other routes to use
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).send({ error: 'Unauthorized: Invalid token.' });
  }
}


// --- MongoDB Setup ---
let client;
let db;

async function getDb() {
  if (!db) {
    // This now correctly uses the full URI from your .env file
    const uri = process.env.DATABASE_URI;
    
    if (!uri || !uri.startsWith("mongodb")) {
      throw new Error("❌ MongoDB URI is missing or invalid. Check your DATABASE_URI in the .env file.");
    }

    if (!client) {
      client = new MongoClient(uri, {
        serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
      });
      await client.connect();
      console.log("✅ MongoDB connected successfully!");
    }
    db = client.db("ubJewellersDB");
  }
  return db;
}

// --- API Routes ---

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
    res.send(await database.collection("products").find().toArray());
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const database = await getDb();
    res.send(await database.collection("products").findOne({ _id: new ObjectId(req.params.id) }));
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch product" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const database = await getDb();
    res.send(await database.collection("categories").find().toArray());
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch categories" });
  }
});

// PROTECTED ROUTE: Only authenticated users can add items to the cart.
app.post("/api/cart", verifyFirebaseToken, async (req, res) => {
  try {
    const database = await getDb();
    // You can now access the verified user's ID via req.user.uid
    const cartItem = { ...req.body, userId: req.user.uid };
    const result = await database.collection("cart").insertOne(cartItem);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to add to cart" });
  }
});

// PROTECTED ROUTE: Only authenticated users can create a payment intent.
app.post("/create-payment-intent", verifyFirebaseToken, async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send({ error: "Invalid price value." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// This exports the app so server.js can use it.
module.exports = { api: app };

