const Course = require("../models/Course");
const { getCourseRecommendations } = require("../services/gptService");

exports.getRecommendations = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    const courses = await Course.find().select("title description");
    const recommendations = await getCourseRecommendations(prompt, courses);

    res.status(200).json(recommendations);
  } catch (err) {
    next(err);
  }
};