const express = require("express");
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const { enrollInCourse, getMyEnrollments } = require("../controllers/enrollmentController");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole("student"),
  [body("courseId").isMongoId().withMessage("Valid courseId is required")],
  validate,
  enrollInCourse
);

router.get("/me", verifyToken, requireRole("student"), getMyEnrollments);

module.exports = router;