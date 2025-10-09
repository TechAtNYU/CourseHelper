export type JobMessage = {
  jobId: string;
};

export interface JobError extends Error {
  type: "network" | "parsing" | "validation" | "timeout" | "unknown";
}
