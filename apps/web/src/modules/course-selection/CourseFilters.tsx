import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  creditFilter: number | null;
  onCreditFilterChange: (credit: number | null) => void;
  availableCredits: number[];
}

export const CourseFilters = ({
  searchInput,
  onSearchChange,
  creditFilter,
  onCreditFilterChange,
  availableCredits,
}: CourseFiltersProps) => {
  return (
    <div className="flex flex-col space-y-2">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="course-search">Search Courses</Label>
        <Input
          id="course-search"
          placeholder="Search by course name or code..."
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Credit Filter Buttons */}
      <div className="flex flex-col space-y-2">
        <Label>Credits</Label>
        <div className="flex flex-row gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onCreditFilterChange(null)}
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
              onClick={() => onCreditFilterChange(credit)}
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
  );
};
