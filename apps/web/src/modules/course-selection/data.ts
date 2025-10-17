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
const statuses = ["open", "closed", "waitlist"] as const;
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
  { length: 1000 },
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

export const sampleCourseOfferings: Doc<"courseOfferings">[] = Array.from(
  { length: 200 },
  (_, i) => {
    const course = sampleData[i % sampleData.length];
    const term = terms[i % terms.length];
    const status = statuses[i % statuses.length];
    const { start, end } = timeSlots[i % timeSlots.length];
    const section = sections[i % sections.length];
    const location = `${buildings[i % buildings.length]} ${100 + (i % 50)}`;
    const days = dayPatterns[i % dayPatterns.length];

    return {
      _id: `co_${i + 1}` as Id<"courseOfferings">,
      _creationTime: 0,
      courseCode: course.code,
      title: course.title,
      section,
      year: 2024 + (i % 3),
      term,
      instructor: instructors[i % instructors.length],
      location,
      days: [...days],
      startTime: start,
      endTime: end,
      status,
      waitlistNum: status === "waitlist" ? (i % 20) + 1 : undefined,
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
      courseOfferingId: offering._id,
      alternativeOf,
    };
  });
