const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// mounted as each module is built:
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/courses", require("./routes/courseRoutes"));
// app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
// app.use("/api/recommendations", require("./routes/recommendationRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(require("./middleware/errorHandler"));

module.exports = app;