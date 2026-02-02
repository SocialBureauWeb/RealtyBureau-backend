require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

connectDB()

const allowedOrigins = [
  "https://www.realtybureau.in",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Vercel previews and local/production domains
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, origin || true);
      } else {
        console.log(origin);
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser())

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
)

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RealtyBureau Backend API is running',
    timestamp: new Date().toISOString()
  });
});


app.use('/', router);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/google", require("./routes/googleAuthRoutes"));
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

// Only start server if not in serverless environment (Vercel)
// Render sets NODE_ENV=production, so we need to ensure we still listen if we are not on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;