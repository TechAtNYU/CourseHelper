import { useState, useEffect } from "react";

export default function App() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);

  useEffect(() => {
    chrome.storage.local.get(
      ["enrolledCourses", "completedCourses"],
      (result) => {
        const enrolled = result.enrolledCourses || [];
        const completed = result.completedCourses || [];
        setEnrolledCourses(enrolled);
        setCompletedCourses(completed);
        console.log("Enrolled courses:", enrolled);
        console.log("Completed courses:", completed);
      }
    );
  }, []);

  return (
    <div className="p-4 min-w-[300px]">
      <h1 className="text-lg font-bold mb-4">NYU Course Helper</h1>

      <div className="mb-4">
        <h2 className="text-md font-semibold mb-2">Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p className="text-gray-500 text-sm">No enrolled courses yet</p>
        ) : (
          <div className="space-y-2">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded p-2 bg-gray-50"
              >
                <div className="font-medium">
                  {course.title || `Course ${index + 1}`}
                </div>
                {course.courseCode && (
                  <div className="text-sm text-gray-600">
                    {course.courseCode}
                  </div>
                )}
                {course.instructor && (
                  <div className="text-sm text-gray-600">
                    Instructor: {course.instructor}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-md font-semibold mb-2">Completed Courses</h2>
        {completedCourses.length === 0 ? (
          <p className="text-gray-500 text-sm">No completed courses yet.</p>
        ) : (
          <div className="space-y-2">
            {completedCourses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded p-3 bg-white"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-gray-900">
                    {course.title || `Course ${index + 1}`}
                  </div>
                  <div className="">
                    {course.grade && (
                      <span className="font-semibold text-gray-700">
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
