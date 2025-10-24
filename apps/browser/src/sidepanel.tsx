import { useState, useEffect } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import ConvexWithClerkProvider from "~components/ConvexWithClerkProvider";
import SignIn from "~components/SignIn";
import Course from "~components/Course";

import "~style.css";

function CourseDisplay() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [courseSearchSaved, setCourseSearchSaved] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    chrome.storage.local.get(
      ["enrolledCourses", "completedCourses", "courseSearchSaved"],
      (result) => {
        const enrolled = result.enrolledCourses || [];
        const completed = result.completedCourses || [];
        const courseSearchSaved = result.courseSearchSaved || [];
        setEnrolledCourses(enrolled);
        setCompletedCourses(completed);
        setCourseSearchSaved(courseSearchSaved);
        console.log("Enrolled courses:", enrolled);
        console.log("Completed courses:", completed);
        console.log("Course search saved:", courseSearchSaved);
      }
    );
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.enrolledCourses) {
        setEnrolledCourses(changes.enrolledCourses.newValue || []);
      }
      if (changes.completedCourses) {
        setCompletedCourses(changes.completedCourses.newValue || []);
      }
      if (changes.courseSearchSaved) {
        setCourseSearchSaved(changes.courseSearchSaved.newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div className="plasmo-p-4 plasmo-min-w-[350px] plasmo-max-w-[400px]">
      <h1 className="plasmo-text-lg plasmo-font-bold plasmo-mb-4">
        NYU Course Helper
      </h1>

      <div className="plasmo-mb-4">
        <h2 className="plasmo-text-md plasmo-font-semibold plasmo-mb-2">
          Saved Courses
        </h2>
        {courseSearchSaved.length === 0 ? (
          <p className="plasmo-text-gray-500 plasmo-text-sm">
            No course search saved yet.
          </p>
        ) : (
          <div className="plasmo-space-y-2">
            {courseSearchSaved.map((course, index) => (
              <Course
                courseCode={course.courseCode}
                title={course.title}
                timeStart={course.timeStart}
                timeEnd={course.timeEnd}
                instructor={course.instructor}
              />
            ))}
          </div>
        )}
      </div>

      <div className="plasmo-mb-4">
        <h2 className="plasmo-text-md plasmo-font-semibold plasmo-mb-2">
          Enrolled Courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <p className="plasmo-text-gray-500 plasmo-text-sm">
            No enrolled courses yet
          </p>
        ) : (
          <div className="plasmo-space-y-2">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="plasmo-border plasmo-border-gray-200 plasmo-rounded plasmo-p-2 plasmo-bg-gray-50"
              >
                <div className="plasmo-font-medium">
                  {course.title || `Course ${index + 1}`}
                </div>
                {course.courseCode && (
                  <div className="plasmo-text-sm plasmo-text-gray-600">
                    {course.courseCode}
                  </div>
                )}
                {course.instructor && (
                  <div className="plasmo-text-sm plasmo-text-gray-600">
                    Instructor: {course.instructor}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="plasmo-mb-4">
        <h2 className="plasmo-text-md plasmo-font-semibold plasmo-mb-2">
          Completed Courses
        </h2>
        {completedCourses.length === 0 ? (
          <p className="plasmo-text-gray-500 plasmo-text-sm">
            No completed courses yet.
          </p>
        ) : (
          <div className="plasmo-space-y-2">
            {completedCourses.map((course, index) => (
              <div
                key={index}
                className="plasmo-border plasmo-border-gray-200 plasmo-rounded plasmo-p-3 plasmo-bg-white"
              >
                <div className="plasmo-flex plasmo-justify-between plasmo-items-start plasmo-mb-1">
                  <div className="plasmo-font-medium plasmo-text-gray-900">
                    {course.title || `Course ${index + 1}`}
                  </div>
                  <div className="">
                    {course.grade && (
                      <span className="plasmo-font-semibold plasmo-text-gray-700">
                        Grade: {course.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IndexSidePanel() {
  return (
    // <CourseDisplay />
    <ConvexWithClerkProvider>
      <div>
        <Unauthenticated>
          <div className="p-4 min-w-[350px]">
            <h1 className="text-lg font-bold mb-4">NYU Course Helper</h1>
            <SignIn />
          </div>
        </Unauthenticated>
        <Authenticated>
          <CourseDisplay />
        </Authenticated>
      </div>
    </ConvexWithClerkProvider>
  );
}

export default IndexSidePanel;
