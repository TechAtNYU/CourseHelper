export type Course = {
  code: string;
  codeType: string;
  title: string;
  credits: number;
  description: string;
  prerequisites?: string[];
  courseUrl: string;
  createdAt: string;
};

export type TermCourses = {
  term: "Fall" | "Spring" | "Summer" | "J-Term";
  courses: Course[];
};

export type YearPlan = {
  year: "Freshman" | "Sophomore" | "Junior" | "Senior";
  terms: TermCourses[];
};
