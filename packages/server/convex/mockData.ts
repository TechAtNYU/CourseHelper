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

/**
 * Categories for course requirements (similar to NYU CS curriculum):
 * - Computer Science: All CS courses including core, theory, systems, and electives
 * - Mathematics: Pure math courses
 * - Natural Science: Physics, Chemistry, Biology
 * - General Education: Non-CS/Math/Science requirements
 */

export const mockRequirementsData = [
  // Computer Science Requirements
  {
    type: "required" as const,
    isMajor: true,
    category: "Computer Science",
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
    category: "Mathematics",
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
    category: "Mathematics",
    courses: [
      "MATH-UA 140", // Linear Algebra
      "MATH-UA 325", // Analysis
    ],
  },

  // Advanced CS Electives (options - choose courses to fulfill credit requirements)
  {
    type: "options" as const,
    isMajor: true,
    category: "Computer Science",
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
    category: "Natural Science",
    courses: [
      "PHYS-UA 11", // General Physics I
      "CHEM-UA 125", // General Chemistry I
    ],
  },

  // Science Lab Alternative
  {
    type: "alternative" as const,
    isMajor: false,
    category: "Natural Science",
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
    category: "General Education",
    courses: [
      "EXPOS-UA 1", // Writing the Essay
    ],
  },

  // General Education - Humanities Electives
  {
    type: "options" as const,
    isMajor: false,
    category: "General Education",
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
    programUrl: "https://www.stern.nyu.edu/programs-admissions/undergraduate/academics/minors",
  },
];

/**
 * Course categories breakdown for charts:
 * This can be used to visualize distribution of requirements
 */
export const categoryStats = {
  "Computer Science": 10, // 6 required + 4 electives (average)
  "Mathematics": 4, // 3 required + 1 alternative
  "Natural Science": 3,
  "General Education": 3,
};
