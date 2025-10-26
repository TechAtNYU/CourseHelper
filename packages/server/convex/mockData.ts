/**
 * Mock data for NYU CS curriculum
 * This file contains sample program requirements categorized similar to cs.nyu.edu
 */

export const mockProgramsData = {
  program: {
    name: "Computer Science (BA)",
    level: "undergraduate" as const,
    programUrl: "https://cs.nyu.edu/home/undergrad/major_programs.html",
  },
};

export const mockRequirementsData = [
  // Computer Science Requirements
  {
    type: "required" as const,
    isMajor: true,
    courses: [
      "CSCI-UA 101", // Intro to Computer Science
      "CSCI-UA 102", // Data Structures
      "CSCI-UA 201", // Computer Systems Organization
      "CSCI-UA 310", // Basic Algorithms
      "CSCI-UA 202", // Operating Systems
      "CSCI-UA 480", // Parallel Computing (Special Topics)
    ],
  },

  // Mathematics Requirements
  {
    type: "required" as const,
    isMajor: true,
    courses: [
      "MATH-UA 120", // Discrete Mathematics
      "MATH-UA 121", // Calculus I
      "MATH-UA 122", // Calculus II
    ],
  },

  // Math Alternative (students can choose one)
  {
    type: "alternative" as const,
    isMajor: true,
    courses: [
      "MATH-UA 140", // Linear Algebra
      "MATH-UA 325", // Analysis
    ],
  },

  // Advanced CS Electives (options - choose courses to fulfill credit requirements)
  {
    type: "options" as const,
    isMajor: true,
    courses: [
      "CSCI-UA 467", // Intro to Machine Learning
      "CSCI-UA 473", // Fundamentals of AI
      "CSCI-UA 479", // Data Management & Analysis
      "CSCI-UA 421", // Computer Graphics
      "CSCI-UA 453", // Theory of Computation
      "CSCI-UA 480-009", // Computer Security
      "CSCI-UA 480-010", // Agile Software Development
    ],
    courseLevels: [
      {
        program: "CSCI-UA",
        level: 300,
      },
      {
        program: "CSCI-UA",
        level: 400,
      },
    ],
    creditsRequired: 12, // 12 credits of electives
  },

  // Science Requirements
  {
    type: "required" as const,
    isMajor: false,
    courses: [
      "PHYS-UA 11", // General Physics I
      "CHEM-UA 125", // General Chemistry I
    ],
  },

  // Science Lab Alternative
  {
    type: "alternative" as const,
    isMajor: false,
    courses: [
      "PHYS-UA 91", // Physics Lab
      "CHEM-UA 127", // Chemistry Lab
      "BIOL-UA 11", // Biology Lab
    ],
  },

  // General Education - Writing Requirements
  {
    type: "required" as const,
    isMajor: false,
    courses: [
      "EXPOS-UA 1", // Writing the Essay
    ],
  },

  // General Education - Humanities Electives
  {
    type: "options" as const,
    isMajor: false,
    courses: [
      "PHIL-UA 101", // Introduction to Philosophy
      "HIST-UA 101", // World History
      "ENGL-UA 201", // Literature Survey
    ],
    courseLevels: [
      {
        program: "PHIL-UA",
        level: 100,
      },
      {
        program: "HIST-UA",
        level: 100,
      },
      {
        program: "ENGL-UA",
        level: 100,
      },
    ],
    creditsRequired: 6, // 6 credits of humanities
  },
];

/**
 * Additional sample programs for testing charts
 */
export const additionalMockPrograms = [
  {
    name: "Computer Science (BS)",
    level: "undergraduate" as const,
    programUrl: "https://cs.nyu.edu/home/undergrad/major_programs.html",
  },
  {
    name: "Mathematics (BA)",
    level: "undergraduate" as const,
    programUrl: "https://math.nyu.edu/undergraduate/major.html",
  },
  {
    name: "Data Science (MS)",
    level: "graduate" as const,
    programUrl: "https://cds.nyu.edu/academics/ms-in-data-science/",
  },
  {
    name: "Economics Minor",
    level: "undergraduate" as const,
    programUrl: "https://as.nyu.edu/economics/undergrad/minors.html",
  },
  {
    name: "Business Studies Minor",
    level: "undergraduate" as const,
    programUrl:
      "https://www.stern.nyu.edu/programs-admissions/undergraduate/academics/minors",
  },
];

/**
 * Mock courses data
 */
export const mockCoursesData = [
  {
    code: "CSCI-UA 101",
    program: "CSCI-UA",
    level: 100,
    title: "Intro to Computer Science",
    credits: 4,
    description: "Introduction to computer science and programming",
    courseUrl: "https://cs.nyu.edu/courses/spring25/CSCI-UA.0101-001/",
  },
  {
    code: "CSCI-UA 102",
    program: "CSCI-UA",
    level: 100,
    title: "Data Structures",
    credits: 4,
    description: "Fundamental data structures and algorithms",
    courseUrl: "https://cs.nyu.edu/courses/spring25/CSCI-UA.0102-001/",
  },
  {
    code: "CSCI-UA 201",
    program: "CSCI-UA",
    level: 200,
    title: "Computer Systems Organization",
    credits: 4,
    description: "Computer architecture and systems programming",
    courseUrl: "https://cs.nyu.edu/courses/spring25/CSCI-UA.0201-001/",
  },
  {
    code: "CSCI-UA 310",
    program: "CSCI-UA",
    level: 300,
    title: "Basic Algorithms",
    credits: 4,
    description: "Algorithm design and analysis",
    courseUrl: "https://cs.nyu.edu/courses/spring25/CSCI-UA.0310-001/",
  },
  {
    code: "MATH-UA 120",
    program: "MATH-UA",
    level: 100,
    title: "Discrete Mathematics",
    credits: 4,
    description: "Mathematical foundations for computer science",
    courseUrl: "https://math.nyu.edu/courses/spring25/MATH-UA.0120-001/",
  },
  {
    code: "MATH-UA 121",
    program: "MATH-UA",
    level: 100,
    title: "Calculus I",
    credits: 4,
    description: "Differential calculus",
    courseUrl: "https://math.nyu.edu/courses/spring25/MATH-UA.0121-001/",
  },
];

/**
 * Mock user courses data
 * Note: Pass in a userId when calling the seed function
 */
export const mockUserCoursesData = [
  {
    courseCode: "CSCI-UA 101",
    title: "Intro to Computer Science",
    year: 2024,
    term: "fall" as const,
    grade: "a" as const,
  },
  {
    courseCode: "MATH-UA 120",
    title: "Discrete Mathematics",
    year: 2024,
    term: "fall" as const,
    grade: "a-" as const,
  },
  {
    courseCode: "CSCI-UA 102",
    title: "Data Structures",
    year: 2025,
    term: "spring" as const,
    grade: "b+" as const,
  },
  {
    courseCode: "MATH-UA 121",
    title: "Calculus I",
    year: 2025,
    term: "spring" as const,
    grade: "a" as const,
  },
  {
    courseCode: "CSCI-UA 201",
    title: "Computer Systems Organization",
    year: 2025,
    term: "fall" as const,
  },
  {
    courseCode: "CSCI-UA 310",
    title: "Basic Algorithms",
    year: 2025,
    term: "fall" as const,
  },
];
