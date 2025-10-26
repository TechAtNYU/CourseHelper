import { StepperWithForm } from "@/app/onboarding/component/stepper";
import { fetchProtectedQuery } from "@/lib/convex";
import { api } from "@dev-team-fall-25/server/convex/_generated/api";

export default async function Page() {
  const student = await fetchProtectedQuery(api.students.getCurrentStudent);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-8">
        <StepperWithForm />
      </div>
    </div>
  );
}
