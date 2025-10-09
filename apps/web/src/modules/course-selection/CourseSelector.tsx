"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CourseSelectorComponent from "@/modules/course-selection/CourseSelectorComponent";
import { sampleData } from "./data";

const queryClient = new QueryClient();

const CourseSelector = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CourseSelectorComponent data={sampleData} />
    </QueryClientProvider>
  );
};

export default CourseSelector;
