"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { defineStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FileUploadButton from "@/modules/report-parsing/components/file-upload-button";
import SelectMajor from "./select-major";

const academicInfoSchema = z.object({
  major: z.string().min(1, "Major is required"),
  minor: z.string().optional(),
});

const extensionSchema = z.object({
  // TODO: Make this required when Chrome extension is implemented
  extensionInstalled: z.boolean().optional(),
});

const reportSchema = z.object({
  reportUploaded: z
    .boolean()
    .refine((val) => val === true, "Please upload your degree progress report"),
});

type AcademicInfoFormValues = z.infer<typeof academicInfoSchema>;
type ExtensionFormValues = z.infer<typeof extensionSchema>;
type ReportFormValues = z.infer<typeof reportSchema>;

const AcademicInfoForm = () => {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<AcademicInfoFormValues>();

  const majorValue = watch("major");
  const minorValue = watch("minor");

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <SelectMajor
          value={majorValue}
          onValueChange={(value) => {
            console.log("Major selected:", value);
            setValue("major", value);
          }}
          placeholder="Select your major"
          label="Major"
          required={true}
        />
        {errors.major && (
          <span className="text-sm text-destructive">
            {"Please select your major"}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <SelectMajor
          value={minorValue}
          onValueChange={(value) => {
            console.log("Minor selected:", value);
            setValue("minor", value);
          }}
          placeholder="Select your minor (optional)"
          label="Minor"
          required={false}
        />
        {errors.minor && (
          <span className="text-sm text-destructive">
            {"Please select your minor (optional)"}
          </span>
        )}
      </div>
    </div>
  );
};

function ExtensionForm() {
  return (
    <div className="space-y-4 text-start">
      <div className="space-y-4">
        {/* TODO: Implement Chrome extension installation flow */}
        <div className="rounded-lg border p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">
            Chrome Extension (Coming Soon)
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            The Chrome extension will help you automatically track courses and
            prerequisites while browsing your university's course catalog.
          </p>
          <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md inline-block">
            Extension installation
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" defaultChecked={true} className="rounded" />
            <span className="text-sm font-medium text-primary">
              Continue to next step (Chrome extension coming soon)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

function ReportUploadForm() {
  const { setValue } = useFormContext<ReportFormValues>();

  const handleFileUploaded = (file: File | null) => {
    setValue("reportUploaded", file !== null);

    if (file) {
      console.log("Degree report uploaded:", file.name);
      // Could show a success message here
    } else {
      console.log("Degree report removed");
    }
  };

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-4">
        <div className="rounded-lg border p-4 bg-gray-50">
          <h3 className="font-semibold text-black mb-2">
            Upload Your Degree Progress Report
          </h3>
          <p className="text-sm text-black mb-4">
            Upload your degree progress report (PDF) so we can help you track
            your academic progress and suggest courses.
          </p>

          <div className="space-y-4">
            <FileUploadButton
              maxSizeMB={20}
              onFileUploaded={handleFileUploaded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompleteComponent() {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold">Onboarding Complete!</h2>
      <p className="text-muted-foreground">
        Welcome to CourseHelper! You can now access your dashboard and start
        managing your courses.
      </p>
    </div>
  );
}

const { Stepper, useStepper } = defineStepper(
  {
    id: "academic-info",
    title: "Academic Information",
    schema: academicInfoSchema,
    Component: AcademicInfoForm,
  },
  {
    id: "extension",
    title: "Chrome Extension",
    schema: extensionSchema,
    Component: ExtensionForm,
  },
  {
    id: "report",
    title: "Degree Report",
    schema: reportSchema,
    Component: ReportUploadForm,
  },
  {
    id: "complete",
    title: "Complete",
    schema: z.object({}),
    Component: CompleteComponent,
  },
);

export function StepperWithForm() {
  return (
    <Stepper.Provider>
      <FormStepperComponent />
    </Stepper.Provider>
  );
}

const FormStepperComponent = () => {
  const methods = useStepper();

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(methods.current.schema),
  });

  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof methods.current.schema>) => {
    // If this is the last step, mark onboarding as complete
    if (methods.current.id === "complete") {
      try {
        // Update user metadata to mark onboarding as complete
        await user?.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboarding_completed: true,
          },
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Error completing onboarding:", error);
      }
    } else {
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Stepper.Navigation>
          {methods.all.map((step) => (
            <Stepper.Step
              key={step.id}
              of={step.id}
              type={step.id === methods.current.id ? "submit" : "button"}
              onClick={async () => {
                const valid = await form.trigger();
                if (!valid) return;
                methods.goTo(step.id);
              }}
            >
              <Stepper.Title>{step.title}</Stepper.Title>
            </Stepper.Step>
          ))}
        </Stepper.Navigation>
        {methods.switch({
          "academic-info": ({ Component }) => <Component />,
          extension: ({ Component }) => <Component />,
          report: ({ Component }) => <Component />,
          complete: ({ Component }) => <Component />,
        })}
        <Stepper.Controls>
          {!methods.isLast && (
            <Button
              type="button"
              variant="secondary"
              onClick={methods.prev}
              disabled={methods.isFirst}
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            onClick={() => {
              if (methods.isLast) {
                return methods.reset();
              }
              methods.beforeNext(async () => {
                const valid = await form.trigger();
                if (!valid) return false;
                return true;
              });
            }}
          >
            {methods.isLast ? "Reset" : "Next"}
          </Button>
        </Stepper.Controls>
      </form>
    </Form>
  );
};
