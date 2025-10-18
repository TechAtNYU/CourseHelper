import { groupBy } from "lodash";
import { useMemo, useReducer } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_SELECTED_DAYS } from "../components/DaysOfWeek";
import type {
  Course,
  CourseOffering,
  FilterAction,
  FilterState,
} from "../types";

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

export const useCourseFiltering = (
  courses: Course[],
  courseOfferings: CourseOffering[],
) => {
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const { searchInput, creditFilter, selectedDays } = filterState;

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

  return {
    filterState,
    dispatch,
    filteredData,
    availableCredits,
  };
};
