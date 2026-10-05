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

const buildPrompt = (userPrompt, courses) => {
  const courseList = courses.map((c) => `- ${c.title}: ${c.description}`).join("\n");

  return `You are a course advisor for an online learning platform.
Available courses:
${courseList || "(no courses available yet)"}

A student asked: "${userPrompt}"

Recommend the most relevant courses from the list above. Respond ONLY with valid JSON in this exact shape:
{"message": "<one short sentence of advice>", "recommendedCourses": ["<course title>", "..."]}
If none of the available courses are relevant, return an empty recommendedCourses array and say so in the message.`;
};

const getCourseRecommendations = async (userPrompt, courses = []) => {
  if (process.env.USE_REAL_GPT !== "true") {
    return MOCK_RESPONSE;
  }

  const completion = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: buildPrompt(userPrompt, courses) }],
    temperature: 0.3,
  });

  const raw = completion.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch (err) {
    return { message: raw, recommendedCourses: [] };
  }
};

module.exports = { getCourseRecommendations };