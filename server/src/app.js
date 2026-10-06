require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy. Without this, every
// request appears to come from the proxy's IP, so IP-based rate limiting would
// apply to all users collectively instead of per-client.
app.set("trust proxy", 1);

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean);

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const err = new Error("Not allowed by CORS");
      err.status = 403;
      err.expose = true;
      callback(err);
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// mounted as each module is built:
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/recommendations", require("./routes/recommendationRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(require("./middleware/errorHandler"));

module.exports = app;
