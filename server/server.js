require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");

const app = express();

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in .env file");
  process.exit(1);
}

// ✅ Allow specific client origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.3:5173",
  "http://192.168.1.7:5173",
  "http://192.168.1.9:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Request Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Make sure PATCH is included
    allowedHeaders: ["Content-Type", "Authorization"], // Add any headers your frontend uses
  })
);

// Middleware
app.use(express.json()); // for parsing application/json

// ✅ Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("✅ Server is live");
});

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
