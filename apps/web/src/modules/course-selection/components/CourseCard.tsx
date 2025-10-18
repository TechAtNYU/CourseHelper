import { ChevronDown, ChevronRight, InfoIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { CourseOffering, CourseWithOfferings } from "../types";
import { CourseSectionItem } from "./CourseSectionItem";

interface CourseCardProps {
  course: CourseWithOfferings;
  isExpanded: boolean;
  onToggleExpand: (courseCode: string) => void;
  onSectionSelect?: (offering: CourseOffering) => void;
  onSectionHover?: (offering: CourseOffering | null) => void;
}

export const CourseCard = ({
  course,
  isExpanded,
  onToggleExpand,
  onSectionSelect,
  onSectionHover,
}: CourseCardProps) => {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onToggleExpand(course.code)}
                className="shrink-0 hover:bg-neutral-200 rounded p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </button>
              <CardTitle className="truncate min-w-0" title={course.title}>
                {course.title}
              </CardTitle>
            </div>
            <HoverCard openDelay={10}>
              <HoverCardTrigger>
                <InfoIcon className="size-4 shrink-0 text-blue-400" />
              </HoverCardTrigger>
              <HoverCardContent>{course.description}</HoverCardContent>
            </HoverCard>
          </div>
          <CardDescription className="flex flex-row gap-1 flex-wrap text-sm">
            <span>{course.code}</span>
            <span>&middot;</span>
            <span>{course.credits} credit</span>
            <span>&middot;</span>
            <span>{course.level}</span>
            {course.offerings.length > 0 && (
              <>
                <span>&middot;</span>
                <span>
                  {course.offerings.length} section
                  {course.offerings.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </CardDescription>

          {/* Course Sections */}
          {isExpanded && course.offerings.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              {course.offerings.map((offering) => (
                <CourseSectionItem
                  key={offering._id}
                  offering={offering}
                  onSelect={onSectionSelect}
                  onHover={onSectionHover}
                />
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </div>
  );
};
