"use client";
import { api } from "@albert-plus/server/convex/_generated/api";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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

  const currentOfferings = useQuery(
    api.userCourseOfferings.getUserCourseOfferings,
  );
  const addCourseOffering = useMutation(
    api.userCourseOfferings.addUserCourseOffering,
  );

  const removeCourseOffering = useMutation(
    api.userCourseOfferings.removeUserCourseOffering,
  );

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
    if (
      !currentOfferings?.some(
        (o) => o.classNumber === hoveredSection?.classNumber,
      )
    ) {
      onHover?.(hoveredSection);
    }
  }, [hoveredSection, onHover, currentOfferings]);

  const handleSectionSelect = async (offering: CourseOffering) => {
    if (offering.status === "closed") {
      toast.error("This section is closed.");
      return;
    }
    setHoveredSection(null);
    try {
      const id = await addCourseOffering({ classNumber: offering.classNumber });
      toast.success(`${offering.courseCode} ${offering.section} added`, {
        action: {
          label: "Undo",
          onClick: () => removeCourseOffering({ id }),
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : "Unexpected error occurred";
      toast.error(errorMessage);
    }
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
