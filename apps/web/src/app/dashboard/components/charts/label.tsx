import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChartOverlayToggleProps {
  showProgress: boolean;
  onToggle: (checked: boolean) => void;
}

export function ChartOverlayToggle({
  showProgress,
  onToggle,
}: ChartOverlayToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={showProgress}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="overlay" className="cursor-pointer">
        Overlay Taken Courses
      </Label>
    </div>
  );
}
