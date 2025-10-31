import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

console.log("[CRXJS] Hello world from content script!");

// Helper function to parse day abbreviations into day enums
function parseDays(dayString: string | null): string[] {
  if (!dayString) return [];

  const dayMap: Record<string, string> = {
    M: "monday",
    T: "tuesday",
    W: "wednesday",
    R: "thursday",
    F: "friday",
    S: "saturday",
    U: "sunday",
  };

  const days: string[] = [];
  for (const char of dayString.toUpperCase()) {
    if (dayMap[char]) {
      days.push(dayMap[char]);
    }
  }
  return days;
}

// Helper function to determine current academic year and term
function getCurrentAcademicTerm(): { year: number; term: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

  // Academic year starts in September, so if it's before September, it's the previous year
  const academicYear = currentMonth >= 9 ? currentYear : currentYear - 1;

  // Determine term based on month
  let term: string;
  if (currentMonth >= 9 || currentMonth <= 1) {
    term = "fall";
  } else if (currentMonth >= 2 && currentMonth <= 5) {
    term = "spring";
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    term = "summer";
  } else {
    term = "j-term"; // January term
  }

  return { year: academicYear, term };
}

function parseCourse(row: HTMLTableRowElement) {
  let name, code, section, instructor, location, timeStart, timeEnd, day;

  // Name, Code, Section, Credits
  let regex1 = /\s*([\w\s]+)\s+([A-Z]+-\w+\s*\d+)\s+(\d+)\s+\((\d+)\)/;
  const match1 = row.cells[0].textContent?.match(regex1);
  if (match1) {
    const [, nameMatch, codeMatch, sectionMatch] = match1;
    name = nameMatch;
    code = codeMatch;
    section = sectionMatch;
  } else {
    return null;
  }

  // Instructor
  instructor = row.cells[1].textContent;

  // Mode, Location, Campus
  const [, locationPart] = row.cells[2].textContent?.split(":") ?? [];
  if (locationPart) {
    location = locationPart.replace("Loc", "").trim();
  }

  // Time
  const [timeStartPart, timeEndPart] =
    row.cells[3].textContent?.split("-\n") ?? [];
  if (timeStartPart && timeEndPart) {
    timeStart = timeStartPart.trim();
    timeEnd = timeEndPart.trim();
  }

  // Day
  day = row.cells[4].textContent;

  const { year, term } = getCurrentAcademicTerm();

  // Parse days into array format matching Convex schema
  const days = parseDays(day);

  // Create course offering object matching Convex courseOfferings schema
  let courseOffering = {
    courseCode: code,
    title: name,
    section: section,
    year: year,
    term: term as "spring" | "summer" | "fall" | "j-term",
    instructor: instructor || "",
    location: location || "",
    days: days,
    startTime: timeStart || "",
    endTime: timeEnd || "",
    status: "open" as const,
    // waitlistNum is optional and not applicable for enrolled courses
  };

  return courseOffering;
}

// Helper function to parse term string like "Spring 2025" into year and term
function parseTermString(
  termString: string
): { year: number; term: string } | null {
  const termMatch = termString.match(/^(\w+)\s+(\d{4})$/);
  if (!termMatch) return null;

  const [, termName, yearStr] = termMatch;
  const year = parseInt(yearStr);

  // Map term names to schema values
  const termMap: Record<string, string> = {
    Spring: "spring",
    Summer: "summer",
    Fall: "fall",
    Winter: "j-term",
    "J-term": "j-term",
  };

  const term = termMap[termName];
  if (!term) return null;

  return { year, term: term as "spring" | "summer" | "fall" | "j-term" };
}

function parseGradesTranscript(gradesContainer: Element) {
  const completedCourses: any[] = [];

  // Find all term sections (divs with h3 elements)
  const termSections = gradesContainer.querySelectorAll("div > h3");

  termSections.forEach((termHeader) => {
    const termString = termHeader.textContent?.trim();
    if (!termString) return;

    const termInfo = parseTermString(termString);
    if (!termInfo) return;

    // Find the table for this term (look for table in the same container as the h3)
    const termContainer = termHeader.parentElement;
    const table = termContainer?.querySelector("table.accordion-table");

    if (table && !table.querySelector('[id*="TEST"]')) {
      // Skip test credits tables
      // Parse course rows from the table
      const rows = table.querySelectorAll("tbody tr.accordion-row");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        if (cells.length >= 6) {
          const courseCode = cells[0]?.textContent?.trim() || "";
          const title = cells[1]?.textContent?.trim() || "";
          const instructor = cells[2]?.textContent?.trim() || "";
          const credits = cells[3]?.textContent?.trim() || "";
          const grade = cells[5]?.textContent?.trim() || "";

          if (courseCode && title) {
            // Parse course code to extract program and number
            const codeMatch = courseCode.match(
              /^([A-Z]+-[A-Z]+)\s*-\s*(\d+|[A-Z]+)$/
            );
            let program = "";
            let catalogNumber = "";

            if (codeMatch) {
              program = codeMatch[1];
              catalogNumber = codeMatch[2];
            }

            const course = {
              courseCode: courseCode,
              program: program,
              catalogNumber: catalogNumber,
              title: title,
              instructor: instructor,
              credits: credits,
              grade: grade,
              year: termInfo.year,
              term: termInfo.term,
              // Additional metadata that might be useful
              type: "completed" as const,
            };

            if (grade) {
              completedCourses.push(course);
            }
          }
        }
      });
    }
  });

  return completedCourses;
}

function waitForTable(
  selector: string,
  callback: (table: HTMLTableElement) => void
) {
  const observer = new MutationObserver(() => {
    const table = document.querySelector<HTMLTableElement>(selector);
    if (table) {
      observer.disconnect();
      callback(table);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForTable("#isSSS_ShCtSchTable", (table) => {
  let enrolledCourses = [];
  for (let index = 1; index < table.rows.length; index++) {
    let courseOffering = parseCourse(table.rows[index]);
    if (courseOffering) {
      enrolledCourses.push(courseOffering);
    }
  }
  chrome.runtime.sendMessage({
    type: "SAVE_ENROLLED_COURSES",
    payload: enrolledCourses,
  });
});

// Also monitor for grades/transcript sections
function checkForGradesContainers() {
  const gradesContainers = document.querySelectorAll(".isSSS_GradesTwrp");
  console.log(gradesContainers.length);
  if (gradesContainers.length > 0) {
    const allCompletedCourses: any[] = [];

    gradesContainers.forEach((container) => {
      const completedCourses = parseGradesTranscript(container);
      allCompletedCourses.push(...completedCourses);
    });

    console.log("Completed courses:", allCompletedCourses);
    if (allCompletedCourses.length > 0) {
      chrome.runtime.sendMessage({
        type: "SAVE_COMPLETED_COURSES",
        payload: allCompletedCourses,
      });
    }
  }
}

// Check immediately and also set up monitoring
checkForGradesContainers();

// Monitor for new grades containers appearing
const gradesObserver = new MutationObserver(() => {
  checkForGradesContainers();
});

gradesObserver.observe(document.body, { childList: true, subtree: true });

const container = document.createElement("div");
container.id = "crxjs-app";
document.body.appendChild(container);
createRoot(container).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>
);
