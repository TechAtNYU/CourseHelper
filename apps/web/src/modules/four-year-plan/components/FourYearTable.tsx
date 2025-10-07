"use client";

import clsx from "clsx";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Course, YearPlan } from "./types";

interface FourYearTableProps {
  data: YearPlan[];
}

export default function FourYearTable({ data }: FourYearTableProps) {
  const allTerms = ["Fall", "J-Term", "Spring", "Summer"] as const;

  const [courseSearch, setCourseSearch] = useState<string>("");
  const [creditFilter, setCreditFilter] = useState<number | null>(null);

  // Get unique credit values from all courses
  // used by the credits filter
  const availableCredits = useMemo(() => {
    const credits = new Set<number>();
    data.forEach((yearPlan) => {
      yearPlan.terms.forEach((term) => {
        term.courses.forEach((course) => {
          credits.add(course.credits);
        });
      });
    });
    return Array.from(credits).sort((a, b) => a - b);
  }, [data]);

  // Filter data based on all filters
  const filteredData = useMemo(() => {
    return data.map((yearPlan) => ({
      ...yearPlan,
      terms: yearPlan.terms.map((termCourses) => ({
        ...termCourses,
        courses: termCourses.courses.filter((course) => {
          const matchesSearch =
            !courseSearch ||
            course.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
            course.title.toLowerCase().includes(courseSearch.toLowerCase());
          const matchesCredits =
            creditFilter === null || course.credits === creditFilter;
          return matchesSearch && matchesCredits;
        }),
      })),
    }));
  }, [data, courseSearch, creditFilter]);

  // Create a map of year -> term -> courses using filtered data
  const yearTermMap = useMemo(() => {
    const map = new Map<string, Map<string, Course[]>>();
    filteredData.forEach((yearPlan) => {
      const termMap = new Map(yearPlan.terms.map((t) => [t.term, t.courses]));
      map.set(yearPlan.year, termMap);
    });
    return map;
  }, [filteredData]);

  // only show terms with course
  const visibleTerms = useMemo(() => {
    return allTerms.filter((term) => {
      return filteredData.some((yearPlan) => {
        const termMap = yearTermMap.get(yearPlan.year);
        const courses = termMap?.get(term) || [];
        return courses.length > 0;
      });
    });
  }, [allTerms, filteredData, yearTermMap]);

  return (
    <div className="space-y-3 overflow-x-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Course search */}
        <div className="w-64">
          <Label htmlFor="course-search">Search</Label>
          <div className="relative">
            <Input
              id="course-search"
              className="peer ps-9"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search by code or title"
              type="text"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>

        {/* Credits filter */}
        <div>
          <Label>Credits</Label>
          <div className="flex gap-2">
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
      </div>
      <Table className="min-w-max">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="border-t w-[80px]">
              <div className="font-semibold">Term</div>
            </TableHead>
            {filteredData.map((yearPlan) => (
              <TableHead
                key={yearPlan.year}
                className="border-t min-w-[200px] w-[200px]"
              >
                <div className="font-semibold">{yearPlan.year} Year</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleTerms.map((term) => (
            <TableRow key={term}>
              <TableCell className="font-medium bg-muted/30">{term}</TableCell>
              {filteredData.map((yearPlan) => {
                const termMap = yearTermMap.get(yearPlan.year);
                const courses = termMap?.get(term) || [];
                const totalCredits = courses.reduce(
                  (sum, course) => sum + course.credits,
                  0,
                );

                return (
                  <TableCell key={yearPlan.year} className="align-top p-3">
                    {courses.length > 0 ? (
                      <div className="space-y-3">
                        {courses.map((course) => {
                          const key = `${yearPlan.year}-${term}-${course.code}`;
                          return (
                            <Link
                              key={key}
                              href={course.courseUrl}
                              target="_blank"
                              className="block p-2 border rounded-md bg-card hover:bg-muted/50 transition-colors"
                            >
                              <div className="font-medium text-sm">
                                {course.code}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {course.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {course.credits} credits
                              </div>
                            </Link>
                          );
                        })}
                        <div className="pt-2 border-t text-sm font-medium">
                          Total: {totalCredits} credits
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No courses
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
