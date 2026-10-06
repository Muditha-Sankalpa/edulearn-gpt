const express = require("express");
const { body, param } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const { enrollInCourse, getMyEnrollments, updateEnrollmentStatus } = require("../controllers/enrollmentController");

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

router.patch(
  "/:id",
  verifyToken,
  requireRole("student"),
  [
    param("id").isMongoId().withMessage("Invalid enrollment id"),
    body("status").isIn(["enrolled", "in-progress", "completed"]).withMessage("Invalid status"),
  ],
  validate,
  updateEnrollmentStatus
);

module.exports = router;
