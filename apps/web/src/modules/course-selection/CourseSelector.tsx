"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { groupBy } from "lodash";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { CourseCard } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import { type DayOptionValue, DEFAULT_SELECTED_DAYS } from "./DaysOfWeek";
import type { Course, CourseOffering } from "./types";

interface CourseSelectorComponentProps {
  courses: Course[];
  courseOfferings: CourseOffering[];
  onHover: (course: CourseOffering | null) => void;
}

// Filter state and reducer
interface FilterState {
  searchInput: string;
  creditFilter: number | null;
  selectedDays: DayOptionValue[];
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CREDIT"; payload: number | null }
  | { type: "SET_DAYS"; payload: DayOptionValue[] }
  | { type: "RESET_FILTERS" };

const initialFilterState: FilterState = {
  searchInput: "",
  creditFilter: null,
  selectedDays: DEFAULT_SELECTED_DAYS,
};

const filterReducer = (
  state: FilterState,
  action: FilterAction,
): FilterState => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchInput: action.payload };
    case "SET_CREDIT":
      return { ...state, creditFilter: action.payload };
    case "SET_DAYS":
      return { ...state, selectedDays: action.payload };
    case "RESET_FILTERS":
      return initialFilterState;
    default:
      return state;
  }
};

const CourseSelector = ({
  courses,
  courseOfferings,
  onHover,
}: CourseSelectorComponentProps) => {
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const { searchInput, creditFilter, selectedDays } = filterState;

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

    const selectedDaySet = new Set(
      selectedDays.map((day) => day.toLowerCase()),
    );

    if (selectedDaySet.size === 0) {
      return [];
    }

    filtered = filtered
      .map((course) => {
        const offerings = course.offerings.filter((offering) =>
          offering.days.some((day) => selectedDaySet.has(day.toLowerCase())),
        );

        return {
          ...course,
          offerings,
        };
      })
      .filter((course) => course.offerings.length > 0);

    return filtered;
  }, [coursesWithOfferings, debouncedSearch, creditFilter, selectedDays]);

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
