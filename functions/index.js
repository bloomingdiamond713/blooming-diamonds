const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// --- Database Connection ---
// IMPORTANT: Set your MongoDB URI and JWT Secret in Firebase config using the CLI:
// firebase functions:config:set database.uri="YOUR_MONGODB_URI"
// firebase functions:config:set secrets.jwt="YOUR_JWT_SECRET"
const uri = functions.config().database.uri;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // It's often better to connect once your function is invoked if you have low traffic.
    // For simplicity in this template, we connect once.
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // --- Database Collections ---
    const productsCollection = client.db("ubJewellersDB").collection("products");
    const categoriesCollection = client.db("ubJewellersDB").collection("categories");
    const usersCollection = client.db("ubJewellersDB").collection("users");
    const cartCollection = client.db("ubJewellersDB").collection("cart");
    const wishlistCollection = client.db("ubJewellersDB").collection("wishlist");
    const ordersCollection = client.db("ubJewellersDB").collection("orders");
    const reviewsCollection = client.db("ubJewellersDB").collection("reviews");


    // --- API Routes ---

    // JWT Generation
    app.post("/api/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, functions.config().secrets.jwt, { expiresIn: '1h' });
      res.send({ token });
    });

    // Products Routes
    app.get("/api/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.get("/api/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
        res.send(result);
    });
    
    // Categories Routes
    app.get("/api/categories", async (req, res) => {
        const result = await categoriesCollection.find().toArray();
        res.send(result);
    });

    // User Routes
    app.post("/api/users", async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
            return res.send({ message: 'user already exists' });
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });
    
    app.get("/api/user", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const result = await usersCollection.findOne(query);
        res.send(result);
    });

    // Cart Routes
    app.get("/api/cart", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
    });

    app.post("/api/cart", async (req, res) => {
        const item = req.body;
        const result = await cartCollection.insertOne(item);
        res.send(result);
    });

    app.delete("/api/cart/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
    });

    // Wishlist Routes
     app.get("/api/wishlist", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const result = await wishlistCollection.find(query).toArray();
        res.send(result);
    });
    
    app.post("/api/wishlist", async (req, res) => {
        const item = req.body;
        const result = await wishlistCollection.insertOne(item);
        res.send(result);
    });
    
    app.delete("/api/wishlist/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await wishlistCollection.deleteOne(query);
        res.send(result);
    });

    // A simple health check
    app.get("/api", (req, res) => {
      res.status(200).send("UB Jewellers API is running!");
    });


  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

run().catch(console.dir);

// Expose Express API as a single Cloud Function
exports.api = functions.https.onRequest(app);