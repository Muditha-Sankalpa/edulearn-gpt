const OpenAI = require("openai");

let client = null;
const getClient = () => {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

const MOCK_RESPONSE = {
  message: "Based on your interest, here are some recommended courses to get started.",
  recommendedCourses: [
    "Introduction to Programming",
    "Data Structures and Algorithms",
    "Web Development Fundamentals",
  ],
};

const SYSTEM_PROMPT = `You are a course advisor for an online learning platform. You will be given a list of available courses and a student's request. Recommend the most relevant courses from the list only — never invent course titles that aren't in the list. Respond ONLY with valid JSON in this exact shape: {"message": "<one short sentence of advice>", "recommendedCourses": ["<course title>", "..."]}. If none of the available courses are relevant, return an empty recommendedCourses array and say so in the message.`;

const buildCourseListMessage = (courses) => {
  const courseList = courses.map((c) => `- ${c.title}: ${c.description}`).join("\n");
  return `Available courses:\n${courseList || "(no courses available yet)"}`;
};

const getCourseRecommendations = async (userPrompt, courses = []) => {
  if (process.env.USE_REAL_GPT !== "true") {
    return MOCK_RESPONSE;
  }

  let completion;
  try {
    completion = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: buildCourseListMessage(courses) },
        // user input kept in its own message rather than interpolated into the
        // instructions, so it can't be used to override the system prompt
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    });
  } catch (err) {
    const error = new Error("The recommendation service is temporarily unavailable. Please try again shortly.");
    error.status = 502;
    error.expose = true;
    throw error;
  }

  const raw = completion.choices[0].message.content;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    parsed = { message: "Here are some suggestions.", recommendedCourses: [] };
  }

  // Never trust model output blindly — only keep titles that actually exist
  const validTitles = new Set(courses.map((c) => c.title));
  const recommendedCourses = Array.isArray(parsed.recommendedCourses)
    ? parsed.recommendedCourses.filter((title) => validTitles.has(title))
    : [];

  return {
    message: typeof parsed.message === "string" ? parsed.message : "Here are some suggestions.",
    recommendedCourses,
  };
};

module.exports = { getCourseRecommendations };
