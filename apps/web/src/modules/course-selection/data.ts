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
const terms = ["spring", "summer", "fall", "j-term"] as const;
const statuses = ["open", "closed", "waitlist", "enrolled"] as const;
const sections = ["001", "002", "003", "004", "005", "006"];
const instructors = [
  "Dr. Alice Johnson",
  "Prof. Benjamin Lee",
  "Dr. Carla Mendoza",
  "Prof. Daniel Smith",
  "Dr. Evelyn Zhang",
  "Prof. Farah Khan",
];
const buildings = [
  "251 Mercer St",
  "181 Mercer St",
  "Bobst Library",
  "31 Washington Pl",
];
const dayPatterns = [
  ["monday", "wednesday", "friday"],
  ["tuesday", "thursday"],
  ["monday", "wednesday"],
  ["tuesday", "friday"],
  ["wednesday", "saturday"],
] as const;
const timeSlots = [
  { start: "08:30", end: "09:45" },
  { start: "10:00", end: "11:15" },
  { start: "11:30", end: "12:45" },
  { start: "13:00", end: "14:15" },
  { start: "14:30", end: "15:45" },
  { start: "16:00", end: "17:15" },
] as const;

export const sampleData: Doc<"courses">[] = Array.from(
  { length: 200 },
  (_, i) => {
    const deptIndex = Math.floor(i / 40); // Each dept gets 40 courses
    const dept = departments[deptIndex % departments.length];
    const credits = [0, 2, 3, 4][i % 4];
    // Create unique levels: 1000, 1100, 1200, ..., 4900
    const levelOffset = (i % 40) * 100;
    const level = 1000 + levelOffset;
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

export const sampleCourseOfferings: Doc<"courseOfferings">[] = Array.from(
  { length: 600 },
  (_, i) => {
    // Each course gets 3 sections on average (600 offerings / 200 courses)
    const courseIndex = Math.floor(i / 3);
    const course = sampleData[courseIndex % sampleData.length];
    const sectionIndex = i % sections.length;
    const term = terms[Math.floor(i / 150) % terms.length]; // Group by term
    const status = statuses[i % statuses.length];
    const { start, end } = timeSlots[i % timeSlots.length];
    const section = sections[sectionIndex];
    const location = `${buildings[i % buildings.length]} ${100 + (i % 50)}`;
    const days = dayPatterns[i % dayPatterns.length];
    const classNumber = 10000 + i; // Generate unique class numbers starting from 10000
    const isCorequisite = i % 10 === 0; // Every 10th offering is a corequisite
    const corequisiteOf = isCorequisite && i > 0 ? classNumber - 1 : undefined;

    return {
      _id: `co_${i + 1}` as Id<"courseOfferings">,
      _creationTime: 0,
      courseCode: course.code,
      classNumber,
      title: course.title,
      section,
      year: 2024 + (Math.floor(i / 200) % 3),
      term,
      instructor: instructors[i % instructors.length],
      location,
      days: [...days],
      startTime: start,
      endTime: end,
      status,
      waitlistNum: status === "waitlist" ? (i % 20) + 1 : undefined,
      isCorequisite,
      corequisiteOf,
    };
  },
);

export const sampleUserCourseOfferings: Doc<"userCourseOfferings">[] =
  sampleCourseOfferings.slice(0, 60).map((offering, index) => {
    const id = `uco_${index + 1}` as Id<"userCourseOfferings">;
    const alternativeOf =
      index >= 3 && index % 5 === 4
        ? (`uco_${index - 1}` as Id<"userCourseOfferings">)
        : undefined;

    return {
      _id: id,
      _creationTime: 0,
      userId: `user_${(index % 8) + 1}`,
      classNumber: offering.classNumber.toString(),
      alternativeOf,
    };
  });
