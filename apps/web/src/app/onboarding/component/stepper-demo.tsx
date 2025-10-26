"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import { defineStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadButton from "@/modules/report-parsing/components/file-upload-button";
import MultipleSelector from "@/components/ui/multiselect";

const programs = [
  "Computer Science",
  "Mathematics",
  "Statistics",
  "Data Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business Administration",
  "Finance",
  "Economics",
  "Psychology",
  "English",
  "History",
  "Political Science",
  "Art",
  "Music",
  "Other",
];

const academicInfoSchema = z
  .object({
    programs: z.array(z.string()).min(1, "At least one program is required"),
    startingDate: z.object({
      year: z.number().min(2000).max(2100),
      term: z.enum(["spring", "fall"]),
    }),
    expectedGraduationDate: z.object({
      year: z.number().min(2000).max(2100),
      term: z.enum(["spring", "fall"]),
    }),
  })
  .refine(
    (data) => {
      const startValue =
        data.startingDate.year + (data.startingDate.term === "fall" ? 1 : 0.5);
      const gradValue =
        data.expectedGraduationDate.year +
        (data.expectedGraduationDate.term === "fall" ? 1 : 0.5);
      return gradValue > startValue;
    },
    {
      message: "Expected graduation date must be after the starting date",
      path: ["expectedGraduationDate"],
    },
  );

const extensionSchema = z.object({
  // optional chrome extension
  extensionInstalled: z.boolean().optional(),
});

const reportSchema = z.object({
  reportUploaded: z
    .boolean()
    .refine((val) => val === true, "Please upload your degree progress report"),
});

type AcademicInfoFormValues = z.infer<typeof academicInfoSchema>;
type ReportFormValues = z.infer<typeof reportSchema>;

const AcademicInfoForm = () => {
  const { control, setValue, watch } = useFormContext<AcademicInfoFormValues>();

  const programsValue = watch("programs") || [];
  const startingYear = watch("startingDate.year");
  const startingTerm = watch("startingDate.term");
  const gradYear = watch("expectedGraduationDate.year");
  const gradTerm = watch("expectedGraduationDate.term");

  // Set default values if not present
  React.useEffect(() => {
    if (!startingYear) {
      setValue("startingDate.year", new Date().getFullYear());
    }
    if (!startingTerm) {
      setValue("startingDate.term", "fall");
    }
    if (!gradYear) {
      setValue("expectedGraduationDate.year", new Date().getFullYear() + 4);
    }
    if (!gradTerm) {
      setValue("expectedGraduationDate.term", "spring");
    }
  }, [setValue, startingYear, startingTerm, gradYear, gradTerm]);

  return (
    <div className="space-y-6 text-start">
      {/* Programs Selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Please select your program (major and minor)
        </p>
        <MultipleSelector
          value={programsValue.map((p) => ({ value: p, label: p }))}
          onChange={(options) => {
            const values = options.map((opt) => opt.value);
            console.log("Programs selected:", values);
            setValue("programs", values);
          }}
          defaultOptions={programs.map((p) => ({ value: p, label: p }))}
          placeholder="Select your programs"
          commandProps={{
            label: "Select programs",
          }}
          emptyIndicator={
            <p className="text-center text-sm">No programs found</p>
          }
        />
      </div>

      {/* Starting Date */}
      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">
          When did you start your program?
        </FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="startingDate.year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2000"
                    max="2100"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="startingDate.term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Fall</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Expected Graduation Date */}
      <FormField
        control={control}
        name="expectedGraduationDate"
        render={({ fieldState }) => (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              When do you expect to graduate?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="expectedGraduationDate.year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="2000"
                        max="2100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="expectedGraduationDate.term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="fall">Fall</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
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
      <p className="text-sm font-medium text-red-500">
        You have uploaded your degree progress report.
      </p>;
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
    id: "report",
    title: "Degree Report",
    schema: reportSchema,
    Component: ReportUploadForm,
  },
  {
    id: "extension",
    title: "Chrome Extension",
    schema: extensionSchema,
    Component: ExtensionForm,
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
  const upsertStudent = useMutation(api.students.upsertCurrentStudent);

  // Track data across all steps
  const [allStepsData, setAllStepsData] = React.useState<
    Record<string, unknown>
  >({});

  const onSubmit = async (values: z.infer<typeof methods.current.schema>) => {
    // Store this step's data
    setAllStepsData((prev) => ({
      ...prev,
      [methods.current.id]: values,
    }));

    if (methods.current.id !== "complete") {
      console.log(
        `Form values for step ${methods.current.id}: ${JSON.stringify(values)}`,
      );
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
          report: ({ Component }) => <Component />,
          extension: ({ Component }) => <Component />,
          complete: ({ Component }) => <Component />,
        })}
        <Stepper.Controls>
          <Button
            type="button"
            variant="secondary"
            onClick={methods.prev}
            disabled={methods.isFirst}
          >
            Previous
          </Button>
          <Button
            type="submit"
            onClick={async () => {
              if (methods.isLast) {
                // Complete onboarding and go to dashboard
                const valid = await form.trigger();
                if (!valid) return;

                try {
                  const values = form.getValues();
                  console.log("Completing onboarding with values:", values);

                  // Get programs data from the first step
                  const academicInfo = allStepsData["academic-info"] as
                    | AcademicInfoFormValues
                    | undefined;
                  console.log("Collected academic info:", academicInfo);

                  if (!academicInfo) {
                    console.error("Academic info not found");
                    return;
                  }

                  // TODO: Convert program names to program IDs
                  // For now, we'll use an empty array until we implement program lookup
                  // The academic info data contains the program names selected by the user
                  // We need to look up these programs in the database and get their IDs

                  // Save student data to Convex
                  // Note: This requires program IDs, not names.
                  // We're using the actual dates collected from the form
                  await upsertStudent({
                    // TODO: Map program names to program IDs
                    // For now using empty array - will be populated once we add program lookup
                    programs: [],
                    startingDate: {
                      year: academicInfo.startingDate.year,
                      term: academicInfo.startingDate.term,
                    },
                    expectedGraduationDate: {
                      year: academicInfo.expectedGraduationDate.year,
                      term: academicInfo.expectedGraduationDate.term,
                    },
                  });

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
                return;
              }
              methods.beforeNext(async () => {
                const valid = await form.trigger();
                if (!valid) return false;
                return true;
              });
            }}
          >
            {methods.isLast ? "Complete Onboarding" : "Next"}
          </Button>
        </Stepper.Controls>
      </form>
    </Form>
  );
};
