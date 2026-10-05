require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");

const SEED_PASSWORD = "password123";

const instructors = [
  { name: "Sarah Chen", email: "sarah.chen@edulearn.dev" },
  { name: "James Patel", email: "james.patel@edulearn.dev" },
  { name: "Maria Rodriguez", email: "maria.rodriguez@edulearn.dev" },
  { name: "David Kim", email: "david.kim@edulearn.dev" },
  { name: "Aisha Williams", email: "aisha.williams@edulearn.dev" },
];

const courseData = [
  // Sarah Chen — Web Development
  {
    instructor: 0,
    title: "Introduction to Web Development",
    description: "A beginner-friendly tour of how the web works, covering HTML, CSS, and the basics of building your first web page.",
    content: "Module 1: How the web works. Module 2: HTML structure and semantics. Module 3: CSS styling and layout. Module 4: Building and publishing your first page.",
  },
  {
    instructor: 0,
    title: "Modern JavaScript Fundamentals",
    description: "Learn core JavaScript — variables, functions, arrays, objects, and async code — the foundation for any web developer.",
    content: "Module 1: Syntax and variables. Module 2: Functions and scope. Module 3: Arrays and objects. Module 4: Promises and async/await.",
  },
  {
    instructor: 0,
    title: "React.js for Beginners",
    description: "Build interactive user interfaces with React — components, props, state, and hooks explained from scratch.",
    content: "Module 1: Components and JSX. Module 2: Props and state. Module 3: Hooks (useState, useEffect). Module 4: Building a small project.",
  },
  {
    instructor: 0,
    title: "Full-Stack Development with Node.js",
    description: "Go from frontend to backend — build REST APIs with Node.js and Express and connect them to a database.",
    content: "Module 1: Node.js and npm basics. Module 2: Building REST APIs with Express. Module 3: Connecting to MongoDB. Module 4: Authentication basics.",
  },

  // James Patel — Data Science
  {
    instructor: 1,
    title: "Python for Data Science",
    description: "Learn Python fundamentals and the data science toolkit: NumPy, pandas, and Jupyter notebooks.",
    content: "Module 1: Python basics. Module 2: NumPy arrays. Module 3: pandas DataFrames. Module 4: Exploratory data analysis.",
  },
  {
    instructor: 1,
    title: "Introduction to Machine Learning",
    description: "Understand core machine learning concepts — regression, classification, and model evaluation — with hands-on examples.",
    content: "Module 1: What is machine learning? Module 2: Linear and logistic regression. Module 3: Classification algorithms. Module 4: Evaluating model performance.",
  },
  {
    instructor: 1,
    title: "Data Visualization with Python",
    description: "Turn raw data into clear, compelling charts using matplotlib and seaborn.",
    content: "Module 1: Visualization principles. Module 2: matplotlib basics. Module 3: seaborn for statistical plots. Module 4: Building a dashboard.",
  },
  {
    instructor: 1,
    title: "SQL for Data Analysis",
    description: "Master SQL querying — joins, aggregations, and window functions — to analyze real datasets.",
    content: "Module 1: SELECT and filtering. Module 2: Joins across tables. Module 3: Aggregations and GROUP BY. Module 4: Window functions.",
  },

  // Maria Rodriguez — Design
  {
    instructor: 2,
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user-centered design, wireframing, and usability testing.",
    content: "Module 1: Design thinking. Module 2: User research and personas. Module 3: Wireframing and prototyping. Module 4: Usability testing.",
  },
  {
    instructor: 2,
    title: "Figma for Product Designers",
    description: "Get hands-on with Figma — components, auto layout, and collaborative design workflows.",
    content: "Module 1: Figma interface basics. Module 2: Components and variants. Module 3: Auto layout. Module 4: Prototyping and handoff.",
  },
  {
    instructor: 2,
    title: "Design Systems 101",
    description: "Learn how to build and maintain a scalable design system — tokens, components, and documentation.",
    content: "Module 1: What is a design system? Module 2: Design tokens. Module 3: Component libraries. Module 4: Documentation and governance.",
  },
  {
    instructor: 2,
    title: "Introduction to Graphic Design",
    description: "Explore the fundamentals of visual design — color, typography, and composition.",
    content: "Module 1: Color theory. Module 2: Typography basics. Module 3: Layout and composition. Module 4: Building a brand identity.",
  },

  // David Kim — Cloud / DevOps
  {
    instructor: 3,
    title: "AWS Cloud Practitioner Essentials",
    description: "A foundational introduction to AWS services, pricing, and core cloud concepts.",
    content: "Module 1: Cloud computing basics. Module 2: Core AWS services (EC2, S3, RDS). Module 3: Pricing and billing. Module 4: Security fundamentals.",
  },
  {
    instructor: 3,
    title: "Docker and Containerization",
    description: "Learn how to package and run applications in containers using Docker.",
    content: "Module 1: What is a container? Module 2: Writing a Dockerfile. Module 3: Docker Compose. Module 4: Container best practices.",
  },
  {
    instructor: 3,
    title: "DevOps Fundamentals",
    description: "Understand CI/CD, infrastructure as code, and the core practices behind modern DevOps teams.",
    content: "Module 1: What is DevOps? Module 2: CI/CD pipelines. Module 3: Infrastructure as code. Module 4: Monitoring and observability.",
  },
  {
    instructor: 3,
    title: "Introduction to Kubernetes",
    description: "Learn how Kubernetes orchestrates containers at scale — pods, deployments, and services.",
    content: "Module 1: Kubernetes architecture. Module 2: Pods and deployments. Module 3: Services and networking. Module 4: Scaling applications.",
  },

  // Aisha Williams — Business
  {
    instructor: 4,
    title: "Digital Marketing Fundamentals",
    description: "Learn the essentials of digital marketing — SEO, social media, and campaign analytics.",
    content: "Module 1: Marketing funnels. Module 2: SEO basics. Module 3: Social media strategy. Module 4: Measuring campaign performance.",
  },
  {
    instructor: 4,
    title: "Product Management Essentials",
    description: "Learn how product managers prioritize, plan, and ship — from discovery to launch.",
    content: "Module 1: The PM role. Module 2: Discovery and user research. Module 3: Roadmapping and prioritization. Module 4: Shipping and measuring impact.",
  },
  {
    instructor: 4,
    title: "Business Analytics for Beginners",
    description: "Use data to make better business decisions — KPIs, dashboards, and basic forecasting.",
    content: "Module 1: What are KPIs? Module 2: Building dashboards. Module 3: Basic forecasting. Module 4: Communicating insights.",
  },
  {
    instructor: 4,
    title: "Agile Project Management",
    description: "Learn Scrum and Kanban fundamentals to plan and run effective agile teams.",
    content: "Module 1: Agile principles. Module 2: Scrum roles and ceremonies. Module 3: Kanban boards. Module 4: Retrospectives and continuous improvement.",
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const instructorIds = [];
  for (const inst of instructors) {
    const user = await User.findOneAndUpdate(
      { email: inst.email },
      { name: inst.name, email: inst.email, passwordHash, role: "instructor" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    instructorIds.push(user._id);
  }
  console.log(`Seeded ${instructors.length} instructors (password: "${SEED_PASSWORD}")`);

  for (const c of courseData) {
    await Course.findOneAndUpdate(
      { instructor: instructorIds[c.instructor], title: c.title },
      {
        title: c.title,
        description: c.description,
        content: c.content,
        instructor: instructorIds[c.instructor],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${courseData.length} courses`);

  await mongoose.disconnect();
  console.log("Done.");
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
