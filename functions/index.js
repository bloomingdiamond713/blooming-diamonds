// functions/index.js
require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import ObjectId
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const router = express.Router();

// === Firebase Admin SDK Setup ===
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK.", error);
  // Consider exiting if Firebase Admin is critical: process.exit(1);
}

// === MongoDB Setup ===
let db;
let usersCollection;
let productsCollection;
let cartCollection;
let ordersCollection;

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
    db = client.db("bloomingDiamondsDB"); // Make sure this matches your DB name
    usersCollection = db.collection("users");
    productsCollection = db.collection("products");
    cartCollection = db.collection("cart");
    ordersCollection = db.collection("orders");
    console.log(`✅ Successfully connected to database: ${db.databaseName}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed. Error:", error);
    throw error; // Rethrow to be caught by the middleware
  }
}

// Middleware to ensure DB connection before handling requests
router.use(async (req, res, next) => {
    try {
        await connectToDb();
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle DB connection error
        res.status(500).send({ message: "Database connection error.", errorDetails: error.message });
    }
});

// ===================================================
// === MIDDLEWARE ===
// ===================================================

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ error: true, message: "Unauthorized: No token provided." });
  }
  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
     console.error("JWT_SECRET is not set in environment variables.");
     return res.status(500).send({ error: true, message: "Server configuration error."});
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      // Differentiate between expired and invalid tokens if needed
      if (err.name === 'TokenExpiredError') {
         return res.status(401).send({ error: true, message: "Unauthorized: Token expired." });
      }
      return res.status(401).send({ error: true, message: "Unauthorized: Invalid token." });
    }
    req.decoded = decoded; // Attach decoded payload (e.g., email) to request
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  // Ensure verifyJWT ran first and attached decoded info
  if (!req.decoded || !req.decoded.email) {
     return res.status(401).send({ error: true, message: "Unauthorized: Decoded token data missing." });
  }

  const email = req.decoded.email;
  const query = { email: email };
  try {
    const user = await usersCollection.findOne(query);
    if (user && user.admin === true) { // Check if user exists and admin field is explicitly true
      next(); // User is an admin, proceed
    } else {
      // User found but not admin, or user not found
      return res.status(403).send({ error: true, message: "Forbidden: Admin access required." });
    }
  } catch (error) {
    console.error("Error during admin verification:", error);
    return res.status(500).send({ error: true, message: "Server error during admin check." });
  }
};

// ===================================================
// === ROUTES ===
// ===================================================

// --- Health Check ---
router.get("/", (req, res) => {
  res.status(200).send("✅ Blooming Diamonds API is alive!");
});

// --- Authentication ---
router.post("/jwt", (req, res) => {
  try {
    const user = req.body;
    const secret = process.env.JWT_SECRET;
     if (!secret) {
       throw new Error("JWT_SECRET is not configured.");
     }
    // Basic validation: ensure user object has email
    if (!user || !user.email) {
       return res.status(400).send({ error: "Email is required for JWT generation."});
    }
    const token = jwt.sign(user, secret, { expiresIn: "1h" }); // Consider longer expiry for real apps
    res.send({ token });
  } catch (err) {
     console.error("JWT generation failed:", err);
     res.status(500).send({ error: "JWT generation failed due to server error." });
  }
});

// --- Public Routes ---
router.get("/products", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.send(products);
  } catch (err) {
     console.error("Failed to fetch products:", err);
     res.status(500).send({ error: "Failed to fetch products" });
  }
});

// --- User Routes ---
router.post("/users", async (req, res) => {
  try {
    const user = req.body;
    // Basic validation
    if (!user || !user.email || !user.name) {
       return res.status(400).send({ message: "User name and email are required." });
    }
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(200).send({ message: "User already exists." }); // Use 200 or 409 (Conflict)
    }
    // Set default fields if needed (e.g., admin status)
    const newUser = {
       name: user.name,
       email: user.email,
       photoURL: user.photoURL || null, // Allow optional photoURL
       admin: false, // Default new users to non-admin
       createdAt: new Date() // Add timestamp
    };
    const result = await usersCollection.insertOne(newUser);
    res.status(201).send(result); // Send back MongoDB result
  } catch (err) {
     console.error("Error creating user:", err);
     res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});

// Get single user info (protected)
router.get("/user", verifyJWT, async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
       return res.status(400).send({ error: "Email query parameter is required." });
    }
    // Ensure the token email matches the requested email
    if (req.decoded.email !== email) {
        return res.status(403).send({ error: "Forbidden: You can only request your own user data." });
    }
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }
    // Optionally remove sensitive fields before sending
    // delete user.passwordHash; // Example if you stored hashes
    res.status(200).send(user);
  } catch (err) {
     console.error("Error fetching user:", err);
     res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});


// --- Cart Routes (Protected) ---
router.get("/cart", verifyJWT, async (req, res) => {
    const email = req.query.email;
    if (!email) {
       return res.status(400).send({ error: "Email query parameter is required." });
    }
    if (req.decoded.email !== email) {
        return res.status(403).send({ error: "Forbidden: You can only access your own cart." });
    }
    try {
       const result = await cartCollection.find({ email: email }).toArray();
       res.send(result);
    } catch (err) {
       console.error("Error fetching cart:", err);
       res.status(500).send({ message: "Failed to fetch cart." });
    }
});

router.get("/cart/subtotal", verifyJWT, async(req, res) => {
    const email = req.query.email;
     if (!email) {
       return res.status(400).send({ error: "Email query parameter is required." });
    }
    if (req.decoded.email !== email) {
        return res.status(403).send({ error: "Forbidden: You can only access your own cart subtotal." });
    }
    try {
       const userCart = await cartCollection.find({ email: email }).toArray();
       // Ensure price and quantity are numbers before calculation
       const subtotal = userCart.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return sum + (price * quantity);
       }, 0);
       res.send({ subtotal });
    } catch (err) {
       console.error("Error calculating cart subtotal:", err);
       res.status(500).send({ message: "Failed to calculate subtotal." });
    }
});

// --- ADMIN ROUTES (Protected by verifyJWT and verifyAdmin) ---

// Get Dashboard Stats
router.get("/admin-dashboard/all-stats", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await usersCollection.countDocuments();
    const totalProducts = await productsCollection.countDocuments();
    const totalOrders = await ordersCollection.countDocuments();
    // Aggregate revenue: ensure 'price' field exists and is numeric in orders
    const revenueResult = await ordersCollection.aggregate([
      { $match: { price: { $exists: true, $type: "number" } } }, // Filter documents where price is a number
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
    ]).toArray();
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).send({ totalUsers, totalProducts, totalOrders, totalRevenue });
  } catch (err) {
     console.error("Error fetching admin stats:", err);
     res.status(500).send({ message: "Failed to fetch admin stats.", errorDetails: err.message });
  }
});

// Add a Product
router.post("/admin/add-product", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const newProduct = req.body;
    // Basic validation
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      return res.status(400).send({ message: "Required product fields (name, price, category, stock) are missing." });
    }
    // Add server-side timestamp
    newProduct.createdAt = new Date();
    newProduct.updatedAt = new Date(); // Set initial updatedAt

    const result = await productsCollection.insertOne(newProduct);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send({ message: "An error occurred while adding the product.", errorDetails: err.message });
  }
});

// Update a Product
router.put("/admin/update-product/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProductData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid product ID format." });
    }
     // Remove potentially harmful or immutable fields from update data
     delete updatedProductData._id; // Prevent changing the _id
     delete updatedProductData.createdAt; // Prevent changing createdAt
    
    // Add server-side timestamp for update
    updatedProductData.updatedAt = new Date();

    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updatedProductData }; // Use $set to update fields

    const result = await productsCollection.updateOne(filter, updateDoc);

     if (result.matchedCount === 0) {
       return res.status(404).send({ error: "Product not found." });
     }

    res.status(200).send(result); // Send back MongoDB update result
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send({ message: "An error occurred while updating the product.", errorDetails: err.message });
  }
});

// Get All Users
router.get("/admin/users", verifyJWT, verifyAdmin, async (req, res) => {
  try {
        const users = await usersCollection.find().toArray();
        res.status(200).send(users);
    } catch(err) {
       console.error("Failed to fetch users:", err);
       res.status(500).send({ message: "Failed to fetch users.", errorDetails: err.message });
    }
});

// --- NEW ROUTE: Make a User Admin ---
router.patch("/admin/users/make-admin/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid user ID format." });
    }

    const filter = { _id: new ObjectId(id) };
    // Check if user exists before updating
    const user = await usersCollection.findOne(filter);
    if (!user) {
       return res.status(404).send({ error: "User not found." });
    }

    // Prevent making the currently logged-in admin a non-admin (or redundant update)
    // You might want a more robust check, e.g., prevent changing the last admin
    if (user.email === req.decoded.email) {
       return res.status(400).send({ error: "Cannot change your own admin status." });
    }

    const updateDoc = {
      $set: { admin: true }, // Set the admin field to true
    };

    const result = await usersCollection.updateOne(filter, updateDoc);
     if (result.matchedCount === 0) { // Double check if somehow user disappeared
       return res.status(404).send({ error: "User not found during update." });
     }
    res.status(200).send(result); // Send back MongoDB update result
  } catch (err) {
    console.error("Error making user admin:", err);
    res.status(500).send({ message: "Failed to update user role.", errorDetails: err.message });
  }
});

// --- NEW ROUTE: Delete a User ---
router.delete("/admin/users/delete/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid user ID format." });
    }

    const filter = { _id: new ObjectId(id) };
     // Check if user exists before deleting
    const userToDelete = await usersCollection.findOne(filter);
    if (!userToDelete) {
       return res.status(404).send({ error: "User not found." });
    }

    // Prevent an admin from deleting themselves
    if (userToDelete.email === req.decoded.email) {
        return res.status(400).send({ error: "Cannot delete your own admin account." });
    }

    const result = await usersCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
       // Should not happen if findOne worked, but good safety check
       console.warn(`User ${id} found but not deleted.`);
       return res.status(404).send({ error: "User found but could not be deleted." });
    }
    res.status(200).send(result); // Send back MongoDB delete result (contains deletedCount)
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send({ message: "An error occurred while deleting the user.", errorDetails: err.message });
  }
});


// Get All Orders
router.get("/admin/orders", verifyJWT, verifyAdmin, async (req, res) => {
  try {
        // Sort by date descending (newest first)
        const orders = await ordersCollection.find().sort({ date: -1 }).toArray();
        res.status(200).send(orders);
    } catch(err) {
       console.error("Failed to fetch orders:", err);
       res.status(500).send({ message: "Failed to fetch orders.", errorDetails: err.message });
    }
});

// Get Total Spent per User (Example of aggregation)
router.get("/admin/total-spent", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const totalSpentArray = await ordersCollection.aggregate([
      // Ensure only orders with valid price are included
      { $match: { price: { $exists: true, $type: "number" }, email: { $exists: true } }},
      { $group: { _id: "$email", totalSpent: { $sum: "$price" } } },
      { $project: { email: "$_id", totalSpent: 1, _id: 0 } }, // Reshape the output
      { $sort: { totalSpent: -1 }} // Optional: sort by highest spending
    ]).toArray();
    res.status(200).send(totalSpentArray);
  } catch (err) {
     console.error("Failed to fetch total spent data:", err);
     res.status(500).send({ message: "Failed to fetch total spent data.", errorDetails: err.message });
  }
});

// Delete a Product
router.delete("/admin/delete-product/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid product ID format." });
    }
    const filter = { _id: new ObjectId(id) };
    const result = await productsCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found." });
    }
    res.status(200).send(result); // Send back MongoDB delete result
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send({ message: "An error occurred on the server.", errorDetails: err.message });
  }
});

// === Export Router ===
module.exports = { api: router }; // Export the configured router