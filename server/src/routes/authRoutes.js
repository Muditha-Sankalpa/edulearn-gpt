const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { register, login, getMe } = require("../controllers/authController");
const validate = require("../middleware/validate");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8, max: 72 })
      .withMessage("Password must be between 8 and 72 characters"),
    body("role").isIn(["student", "instructor"]).withMessage("Role must be student or instructor"),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", verifyToken, getMe);

module.exports = router;
