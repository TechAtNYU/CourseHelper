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
      description: `Students learn how to design algorithms to solve problems and how to translate these algorithms into working computer programs. Experience is acquired through programming projects in a high level programming language. ${code} is intended as a first course for computer science majors, and for students of other scientific disciplines. Programming assignments.`,
      courseUrl: "#",
    };
  },
);
