// Load environment variables from a .env file for local development
require('dotenv').config();
const functions = require("firebase-functions");
const app = require("./index").api; // Your existing express app

exports.api = functions.https.onRequest(app);

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// --- Initializations ---
const app = express();

// --- Firebase Admin SDK Setup ---
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin SDK initialized successfully.");
} catch (error)
{
  console.error("❌ Failed to initialize Firebase Admin SDK. Make sure serviceAccountKey.json exists.", error);
}

// --- Middleware ---
app.use(cors({ origin: true }));
app.use(express.json());

async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).send({ error: 'Unauthorized: No token provided.' });
    }
  
    const idToken = authHeader.split('Bearer ')[1];
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(403).send({ error: 'Unauthorized: Invalid token.' });
    }
}

// --- MongoDB Setup ---
let db;
async function getDb() {
    if (!db) {
        const uri = process.env.DATABASE_URI;
        if (!uri || !uri.startsWith("mongodb")) {
          throw new Error("❌ MongoDB URI is missing or invalid. Check your DATABASE_URI in the .env file.");
        }
    
        const client = new MongoClient(uri, {
          serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
        });
        await client.connect();
        console.log("✅ MongoDB connected successfully!");
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

// // === PHONEPE PAYMENT INTEGRATION ROUTES ===

// // 1. INITIATE PAYMENT
// app.post("/api/phonepe/pay", verifyFirebaseToken, async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const merchantTransactionId = `MUID-${uuidv4()}`;
//         const userId = req.user.uid;

//         const payload = {
//             merchantId: process.env.PHONEPE_MERCHANT_ID,
//             merchantTransactionId: merchantTransactionId,
//             merchantUserId: userId,
//             amount: amount * 100, // Amount in paisa
//             redirectUrl: `${process.env.FRONTEND_URL}/payment-success?merchantTransactionId=${merchantTransactionId}`,
//             redirectMode: 'POST',
//             callbackUrl: `${process.env.BACKEND_URL}/api/phonepe/callback`,
//             mobileNumber: req.user.phone_number || '9999999999', // Fallback mobile number
//             paymentInstrument: {
//                 type: 'PAY_PAGE'
//             }
//         };

//         const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
//         const checksum = crypto.createHash('sha256').update(base64Payload + '/pg/v1/pay' + process.env.PHONEPE_SALT_KEY).digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;

//         const options = {
//             method: 'post',
//             url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum
//             },
//             data: {
//                 request: base64Payload
//             }
//         };

//         const response = await axios.request(options);
//         res.send(response.data);

//     } catch (error) {
//         console.error("PhonePe Error:", error.response ? error.response.data : error.message);
//         res.status(500).send({ error: 'Payment initiation failed' });
//     }
// });

// // 2. HANDLE CALLBACK from PhonePe (Server-to-Server)
// app.post("/api/phonepe/callback", async (req, res) => {
//     try {
//         const base64Response = req.body.response;
//         if (!base64Response) {
//             return res.status(400).send({ error: 'Invalid callback' });
//         }

//         const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf8'));
//         const receivedChecksum = req.headers['x-verify'];
//         const calculatedChecksum = crypto.createHash('sha256').update(base64Response + process.env.PHONEPE_SALT_KEY).digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;

//         if (receivedChecksum !== calculatedChecksum) {
//             console.error("Checksum mismatch on callback");
//             return res.status(400).send({ error: 'Checksum validation failed' });
//         }

//         const { merchantTransactionId, code } = decodedResponse;
        
//         // TODO: Update your order status in MongoDB based on the payment `code`
//         // e.g., if (code === 'PAYMENT_SUCCESS') { ... update order ... }
//         console.log(`Payment status for ${merchantTransactionId} is ${code}`);

//         res.status(200).send({ message: "Callback received" });

//     } catch (error) {
//         console.error("Callback processing error:", error);
//         res.status(500).send({ error: 'Callback processing failed' });
//     }
// });


// // 3. CHECK PAYMENT STATUS (Frontend calls this after redirect)
// app.get("/api/phonepe/status/:merchantTransactionId", verifyFirebaseToken, async (req, res) => {
//     try {
//         const { merchantTransactionId } = req.params;
//         const merchantId = process.env.PHONEPE_MERCHANT_ID;
        
//         const checksum = crypto.createHash('sha256').update(`/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.PHONEPE_SALT_KEY).digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;

//         const options = {
//             method: 'get',
//             url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum,
//                 'X-MERCHANT-ID': merchantId
//             }
//         };

//         const response = await axios.request(options);
//         res.send(response.data);

//     } catch (error) {
//         console.error("Status check error:", error.response ? error.response.data : error.message);
//         res.status(500).send({ error: 'Failed to check payment status' });
//     }
// });


// module.exports = { api: app };