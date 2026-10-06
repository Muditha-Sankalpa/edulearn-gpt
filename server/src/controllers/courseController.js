const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, content } = req.body;

    const course = await Course.create({
      title,
      description,
      content,
      instructor: req.user.id,
    });

    res.status(201).json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already have a course with this title" });
    }
    next(err);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("instructor", "name");
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this course" });
    }

    const { title, description, content } = req.body;
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (content !== undefined) course.content = content;

    await course.save();
    res.status(200).json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already have a course with this title" });
    }
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();
    res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};
