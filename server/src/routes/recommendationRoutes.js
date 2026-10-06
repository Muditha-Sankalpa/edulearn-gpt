const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const { getRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

const recommendationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // per user per day
  keyGenerator: (req) => req.user.id,
  message: { message: "Daily recommendation limit reached. Try again tomorrow." },
});

router.post(
  "/",
  verifyToken,
  requireRole("student"),
  recommendationLimiter,
  [
    body("prompt")
      .trim()
      .notEmpty()
      .withMessage("Prompt is required")
      .isLength({ max: 500 })
      .withMessage("Prompt must be 500 characters or fewer"),
  ],
  validate,
  getRecommendations
);

module.exports = router;