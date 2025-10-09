import {
  ZUpsertCourse,
  ZUpsertCourseOffering,
  ZUpsertPrerequisites,
  ZUpsertProgram,
  ZUpsertRequirements,
} from "@dev-team-fall-25/server/convex/http";
import * as z from "zod/mini";
import { JobError } from "./queue";

type ConvexApiConfig = {
  baseUrl: string;
  apiKey: string;
};

export class ConvexApi {
  private config: ConvexApiConfig;

  constructor(config: ConvexApiConfig) {
    this.config = config;
  }

  private async request<T extends z.ZodMiniType>(
    path: string,
    schema: T,
    data: z.infer<T>,
  ): Promise<{ success: boolean; id?: string }> {
    const { data: validated, success, error } = schema.safeParse(data);

    if (!success) {
      throw new JobError(
        `Invalid data shape: \n${z.prettifyError(error)}`,
        "validation",
      );
    }

    const response = await fetch(`${this.config.baseUrl}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.config.apiKey,
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      throw new JobError(
        `HTTP ${response.status}: ${await response.text()}`,
        "network",
      );
    }

    return response.json();
  }

  async upsertCourse(data: z.infer<typeof ZUpsertCourse>) {
    const result = await this.request(
      "/api/courses/upsert",
      ZUpsertCourse,
      data,
    );
    return result.id;
  }

  async upsertProgram(data: z.infer<typeof ZUpsertProgram>) {
    const result = await this.request(
      "/api/programs/upsert",
      ZUpsertProgram,
      data,
    );
    return result.id;
  }

  async upsertRequirements(data: z.infer<typeof ZUpsertRequirements>) {
    const result = await this.request(
      "/api/requirements/upsert",
      ZUpsertRequirements,
      data,
    );
    return result.id;
  }

  async upsertPrerequisites(data: z.infer<typeof ZUpsertPrerequisites>) {
    const result = await this.request(
      "/api/prerequisites/upsert",
      ZUpsertPrerequisites,
      data,
    );
    return result.id;
  }

  async upsertCourseOffering(data: z.infer<typeof ZUpsertCourseOffering>) {
    const result = await this.request(
      "/api/courseOfferings/upsert",
      ZUpsertCourseOffering,
      data,
    );
    return result.id;
  }
}
