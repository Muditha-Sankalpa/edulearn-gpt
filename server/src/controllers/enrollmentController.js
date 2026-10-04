const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }
    next(err);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate({
      path: "course",
      populate: { path: "instructor", select: "name email" },
    });
    res.status(200).json(enrollments);
  } catch (err) {
    next(err);
  }
};

exports.getEnrolledStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this course's students" });
    }

    const enrollments = await Enrollment.find({ course: req.params.id }).populate(
      "student",
      "name email"
    );

    res.status(200).json(
      enrollments.map((e) => ({
        studentId: e.student._id,
        name: e.student.name,
        email: e.student.email,
        enrolledAt: e.enrolledAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};