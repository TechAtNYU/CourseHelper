export type JobMessage = {
  jobId: string;
};

export class JobError extends Error {
  type: "network" | "parsing" | "validation" | "timeout" | "unknown";

  constructor(
    message: string,
    type:
      | "network"
      | "parsing"
      | "validation"
      | "timeout"
      | "unknown" = "unknown",
  ) {
    super(message);
    this.type = type;
  }
}
