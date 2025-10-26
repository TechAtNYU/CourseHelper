import z from "zod";

export const extensionSchema = z.object({
  // optional chrome extension
  extensionInstalled: z.boolean().optional(),
});

export function ExtensionForm() {
  return (
    <div className="space-y-4 text-start">
      <div className="space-y-4">
        {/* TODO: Implement Chrome extension installation flow */}
        <div className="rounded-lg border p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">Chrome Extension</h3>
          <p className="text-sm text-gray-700 mb-4">
            The Chrome extension will help you automatically track courses and
            prerequisites while browsing your university's course catalog.
          </p>
          <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md inline-block">
            Extension installation
          </div>
        </div>
      </div>
    </div>
  );
}
