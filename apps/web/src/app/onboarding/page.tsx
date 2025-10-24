import { StepperWithForm } from "@/app/onboarding/component/stepper-demo";

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-8">
        <StepperWithForm />
      </div>
    </div>
  );
}
