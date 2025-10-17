"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { groupBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { CourseCard } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import type { Course, CourseOffering } from "./types";

interface CourseSelectorComponentProps {
  courses: Course[];
  courseOfferings: CourseOffering[];
  onHover: (course: CourseOffering | null) => void;
}

const CourseSelector = ({
  courses,
  courseOfferings,
  onHover,
}: CourseSelectorComponentProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [creditFilter, setCreditFilter] = useState<number | null>(null);
  const [hoveredSection, setHoveredSection] = useState<CourseOffering | null>(
    null,
  );
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(),
  );

  const debouncedSearch = useDebounce(searchInput, 300);

  // Group course offerings by course code
  const coursesWithOfferings = useMemo(() => {
    const offeringsByCode = groupBy(courseOfferings, "courseCode");

    return courses.map((course) => ({
      ...course,
      offerings: offeringsByCode[course.code] || [],
    }));
  }, [courses, courseOfferings]);

  // Get unique credits for filter buttons
  const availableCredits = useMemo(() => {
    const credits = new Set(courses.map((course) => course.credits));
    return Array.from(credits).sort((a, b) => a - b);
  }, [courses]);

  const filteredData = useMemo(() => {
    let filtered = coursesWithOfferings;

    if (debouncedSearch) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          course.code.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    if (creditFilter !== null) {
      filtered = filtered.filter((course) => course.credits === creditFilter);
    }

    return filtered;
  }, [coursesWithOfferings, debouncedSearch, creditFilter]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
    gap: 8,
  });

  useEffect(() => {
    onHover?.(hoveredSection);
  }, [hoveredSection, onHover]);

  const toggleCourseExpansion = (courseCode: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseCode)) {
        newSet.delete(courseCode);
      } else {
        newSet.add(courseCode);
      }
      return newSet;
    });
  };

  const handleSectionSelect = (offering: CourseOffering) => {
    if (offering.status === "closed") {
      // TODO: a toast component
      return;
    }
    // TODO: import addClassToCalendar function
    console.log("Selected offering:", offering);
  };

  return (
    <div className="flex flex-col gap-4 w-full md:max-w-[350px] h-full">
      <div className="flex-shrink-0">
        <CourseFilters
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          creditFilter={creditFilter}
          onCreditFilterChange={setCreditFilter}
          availableCredits={availableCredits}
        />
      </div>

      <div ref={parentRef} className="overflow-auto no-scrollbar w-full flex-1">
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const course = filteredData[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <CourseCard
                  course={course}
                  isExpanded={expandedCourses.has(course.code)}
                  onToggleExpand={toggleCourseExpansion}
                  onSectionSelect={handleSectionSelect}
                  onSectionHover={setHoveredSection}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;
