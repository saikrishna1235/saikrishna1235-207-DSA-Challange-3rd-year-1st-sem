import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';

import User from '../src/models/User.js';
import Problem from '../src/models/Problem.js';

const data = JSON.parse(
  fs.readFileSync(new URL('./curriculum.json', import.meta.url))
);

await mongoose.connect(process.env.MONGODB_URI);

if (!process.env.ADMIN_EMAIL) {
  throw new Error('Set ADMIN_EMAIL first');
}

if (
  !process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD === 'change-me-before-seeding'
) {
  throw new Error('Set ADMIN_PASSWORD first');
}

// --------------------------------------------------
// Create / update admin user
// --------------------------------------------------

await User.findOneAndUpdate(
  { email: process.env.ADMIN_EMAIL.toLowerCase() },
  {
    email: process.env.ADMIN_EMAIL.toLowerCase(),
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
    role: 'admin'
  },
  {
    upsert: true,
    new: true
  }
);

// --------------------------------------------------
// Convert curriculum.json into Problem documents
// --------------------------------------------------

const sessionCounters = {};

const problems = data.map((item, index) => {

  // Session number
  // Handles values such as:
  // 1
  // "1"
  // "Session 1"
  const sessionMatch = String(item.session ?? '').match(/\d+/);

  const sessionNumber = sessionMatch
    ? Number(sessionMatch[0])
    : null;

  if (!sessionNumber) {
    throw new Error(
      `Invalid session at curriculum index ${index}: ${JSON.stringify(item.session)}`
    );
  }

  // Keep track of problem number within each session
  sessionCounters[sessionNumber] =
    (sessionCounters[sessionNumber] || 0) + 1;

  // Problem number from original curriculum
  const problemNumber = Number(item.problemNo);

  if (!Number.isFinite(problemNumber)) {
    throw new Error(
      `Invalid problemNo at curriculum index ${index}: ${JSON.stringify(item.problemNo)}`
    );
  }

  // LeetCode number
  let lcNumber = null;

  if (item.lc !== undefined && item.lc !== null && item.lc !== '') {
    const lcMatch = String(item.lc).match(/\d+/);

    if (lcMatch) {
      lcNumber = Number(lcMatch[0]);
    }
  }

  return {
    problemNumber,

    sessionNumber,

    sessionProblemNumber: sessionCounters[sessionNumber],

    sessionTopic: item.topic ?? '',

    difficulty: item.difficulty ?? '',

    lcNumber,

    problemName: item.name ?? '',

    plannedDate: item.date ?? ''
  };
});

// --------------------------------------------------
// Validate before writing to MongoDB
// --------------------------------------------------

if (problems.length !== 207) {
  console.warn(
    `Warning: expected 207 curriculum entries, found ${problems.length}`
  );
}

const invalidProblems = problems.filter(
  p =>
    !Number.isFinite(p.problemNumber) ||
    !Number.isFinite(p.sessionNumber) ||
    !Number.isFinite(p.sessionProblemNumber)
);

if (invalidProblems.length > 0) {
  console.error('Invalid problems:', invalidProblems);
  throw new Error('Curriculum validation failed');
}

// --------------------------------------------------
// Replace curriculum
// --------------------------------------------------

await Problem.deleteMany({});

await Problem.insertMany(problems);

console.log(
  `Seeded admin and ${problems.length} curriculum entries`
);

await mongoose.disconnect();