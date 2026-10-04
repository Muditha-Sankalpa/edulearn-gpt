const express = require("express");
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const validate = require("../middleware/validate");
const {
  createCourse,
  getCourses,
  getCourseById,
  getMyCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

const courseValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

// public
router.get("/", getCourses);

// instructor-only — must come before "/:id" so "mine" isn't treated as an id param
router.get("/mine", verifyToken, requireRole("instructor"), getMyCourses);

router.get("/:id", getCourseById);

router.post("/", verifyToken, requireRole("instructor"), courseValidation, validate, createCourse);
router.put("/:id", verifyToken, requireRole("instructor"), courseValidation, validate, updateCourse);
router.delete("/:id", verifyToken, requireRole("instructor"), deleteCourse);

module.exports = router;