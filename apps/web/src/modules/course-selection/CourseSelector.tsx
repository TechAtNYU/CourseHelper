"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CourseCard, CourseFilters } from "./components";
import { useCourseExpansion, useCourseFiltering } from "./hooks";
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
  const { filterState, dispatch, filteredData, availableCredits } =
    useCourseFiltering(courses, courseOfferings);
  const { searchInput, creditFilter, selectedDays } = filterState;

  const { toggleCourseExpansion, isExpanded } = useCourseExpansion();

  const [hoveredSection, setHoveredSection] = useState<CourseOffering | null>(
    null,
  );

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
          onSearchChange={(value) =>
            dispatch({ type: "SET_SEARCH", payload: value })
          }
          creditFilter={creditFilter}
          onCreditFilterChange={(credit) =>
            dispatch({ type: "SET_CREDIT", payload: credit })
          }
          selectedDays={selectedDays}
          onSelectedDaysChange={(days) =>
            dispatch({ type: "SET_DAYS", payload: days })
          }
          availableCredits={availableCredits}
        />
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col space-y-4 items-center justify-center h-full">
          <p className="text-gray-500">No courses found.</p>
          <Button
            variant="outline"
            onClick={() => {
              dispatch({ type: "RESET_FILTERS" });
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

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
                  isExpanded={isExpanded(course.code)}
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
