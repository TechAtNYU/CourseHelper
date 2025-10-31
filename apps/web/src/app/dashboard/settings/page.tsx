import ThemeSelector from "@/components/ThemeSelector";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-lg font-medium mb-1">Appearance</h1>
        </div>
        <ThemeSelector />
      </div>
    </div>
  );
}