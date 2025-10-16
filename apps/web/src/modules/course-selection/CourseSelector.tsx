"use client";
import type { Doc } from "@dev-team-fall-25/server/convex/_generated/dataModel";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";

type Course = Doc<"courses">;

interface CourseSelectorComponentProps {
  data: Course[];
  onHover: (course: Course | null) => void;
}

// example from https://tanstack.com/virtual/latest/docs/framework/react/examples/infinite-scroll
// may need to update later
async function fetchServerPage(
  limit: number,
  offset: number,
  allData: Course[],
): Promise<{ rows: Course[]; nextOffset: number }> {
  const start = offset * limit;
  const end = start + limit;
  const rows = allData.slice(start, end);

  await new Promise((r) => setTimeout(r, 500));

  return { rows, nextOffset: offset + 1 };
}

const CourseSelector = ({ data, onHover }: CourseSelectorComponentProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [creditFilter, setCreditFilter] = useState<number | null>(null);
  const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Get unique credits for filter buttons
  const availableCredits = useMemo(() => {
    const credits = new Set(data.map((course) => course.credits));
    return Array.from(credits).sort((a, b) => a - b);
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;

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
  }, [data, debouncedSearch, creditFilter]);

  const {
    status,
    data: queryData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["courses", debouncedSearch, creditFilter],
    queryFn: (ctx) => fetchServerPage(50, ctx.pageParam, filteredData),
    getNextPageParam: (lastGroup, allGroups) => {
      const totalFetched = allGroups.length * 50;
      return totalFetched < filteredData.length
        ? lastGroup.nextOffset
        : undefined;
    },
    initialPageParam: 0,
  });

  const allRows = queryData ? queryData.pages.flatMap((d) => d.rows) : [];

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
    gap: 8,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer,
  ]);

  useEffect(() => {
    onHover?.(hoveredCourse);
  }, [hoveredCourse, onHover]);

  return (
    <div className="flex flex-col gap-4 w-full md:max-w-[350px]">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="course-search">Search Courses</Label>
        <Input
          id="course-search"
          placeholder="Search by course name or code..."
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Credit Filter Buttons */}
      <div className="flex flex-col space-y-2">
        <Label>Credits</Label>
        <div className="flex flex-row gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setCreditFilter(null)}
            className={clsx(
              "px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
              creditFilter === null
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted",
            )}
          >
            All
          </button>
          {availableCredits.map((credit) => (
            <button
              type="button"
              key={credit}
              onClick={() => setCreditFilter(credit)}
              className={clsx(
                "px-3 py-2 text-sm font-medium border rounded-lg transition-colors",
                creditFilter === credit
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              )}
            >
              {credit}
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div ref={parentRef} className="overflow-auto no-scrollbar w-full">
        {status === "pending" ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoaderCircle className="animate-spin text-muted-foreground" />
          </div>
        ) : status === "error" ? (
          <p className="p-4">Error loading courses</p>
        ) : (
          <div
            className="relative w-full"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const isLoaderRow = virtualItem.index > allRows.length - 1;
              const course = allRows[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  ref={rowVirtualizer.measureElement}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <div className="p-4 w-full flex justify-center items-center">
                        <LoaderCircle className="animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No more courses
                      </div>
                    )
                  ) : (
                    <Link href={course.courseUrl}>
                      <Card
                        className="hover:bg-neutral-100"
                        onMouseEnter={() => setHoveredCourse(course)}
                        onMouseLeave={() => setHoveredCourse(null)}
                      >
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription className="flex flex-row gap-1 flex-wrap text-sm">
                            <span>{course.code}</span>
                            <span>&middot;</span>
                            <span>{course.credits} credit</span>
                            <span>&middot;</span>
                            <span>{course.level}</span>
                            <span>&middot;</span>
                            <span>{course.program}</span>
                          </CardDescription>
                          <div className="text-xs text-muted-foreground">
                            {course.description}
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSelector;
