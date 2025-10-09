import {
  ZCreatePrerequisites,
  ZCreateRequirements,
  ZDeleteCourse,
  ZDeleteCourseOffering,
  ZDeletePrerequisites,
  ZDeleteProgram,
  ZDeleteRequirements,
  ZUpsertCourse,
  ZUpsertCourseOffering,
  ZUpsertProgram,
} from "@dev-team-fall-25/server/convex/http";
import type * as z from "zod/mini";
import type { JobError } from "./queue";

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
    const validated = schema.parse(data);

    const response = await fetch(`${this.config.baseUrl}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.config.apiKey,
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      const error = new Error(
        `HTTP ${response.status}: ${await response.text()}`,
      ) as JobError;
      error.type = "network";
      throw error;
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

  async deleteCourse(data: z.infer<typeof ZDeleteCourse>) {
    await this.request("/api/courses/delete", ZDeleteCourse, data);
  }

  async upsertProgram(data: z.infer<typeof ZUpsertProgram>) {
    const result = await this.request(
      "/api/programs/upsert",
      ZUpsertProgram,
      data,
    );
    return result.id;
  }

  async deleteProgram(data: z.infer<typeof ZDeleteProgram>) {
    await this.request("/api/programs/delete", ZDeleteProgram, data);
  }

  async createRequirements(data: z.infer<typeof ZCreateRequirements>) {
    const result = await this.request(
      "/api/requirements/create",
      ZCreateRequirements,
      data,
    );
    return result.id;
  }

  async deleteRequirements(data: z.infer<typeof ZDeleteRequirements>) {
    await this.request("/api/requirements/delete", ZDeleteRequirements, data);
  }

  async createPrerequisites(data: z.infer<typeof ZCreatePrerequisites>) {
    const result = await this.request(
      "/api/prerequisites/create",
      ZCreatePrerequisites,
      data,
    );
    return result.id;
  }

  async deletePrerequisites(data: z.infer<typeof ZDeletePrerequisites>) {
    await this.request("/api/prerequisites/delete", ZDeletePrerequisites, data);
  }

  async upsertCourseOffering(data: z.infer<typeof ZUpsertCourseOffering>) {
    const result = await this.request(
      "/api/courseOfferings/upsert",
      ZUpsertCourseOffering,
      data,
    );
    return result.id;
  }

  async deleteCourseOffering(data: z.infer<typeof ZDeleteCourseOffering>) {
    await this.request(
      "/api/courseOfferings/delete",
      ZDeleteCourseOffering,
      data,
    );
  }
}
