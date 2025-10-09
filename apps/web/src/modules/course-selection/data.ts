import type {
  Doc,
  Id,
} from "@dev-team-fall-25/server/convex/_generated/dataModel";

const departments = ["CSCI", "MATH", "ECON", "ENGW", "PHIL"];
const titles = [
  "Introduction to Computer Science",
  "Discrete Mathematics",
  "Linear Algebra",
  "Data Structures",
  "Microeconomics",
  "Writing the Essay",
  "Philosophy of Mind",
  "Web Development",
];

export const sampleData: Doc<"courses">[] = Array.from(
  { length: 10000 },
  (_, i) => {
    const dept = departments[i % departments.length];
    const credits = [0, 2, 3, 4][i % 4];
    const level = 1000 + ((i * 100) % 4000);
    const title = titles[i % titles.length];
    const code = `${dept}-${level}`;

    return {
      _id: `${i + 1}` as Id<"courses">,
      _creationTime: 0,
      code,
      program: dept,
      level,
      title: `${title} ${i + 1}`,
      credits,
      description: `${dept} course worth ${credits} credits.`,
      courseUrl: "#",
    };
  },
);
