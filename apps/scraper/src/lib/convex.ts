import {
  ZCreatePrerequisite,
  ZCreateRequirement,
  ZDeleteCourse,
  ZDeletePrerequisites,
  ZDeleteProgram,
  ZDeleteRequirements,
  ZUpsertCourse,
  ZUpsertProgram,
} from "@dev-team-fall-25/server/convex/http";
import type * as z from "zod/mini";

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
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
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

  async createRequirement(data: z.infer<typeof ZCreateRequirement>) {
    const result = await this.request(
      "/api/requirements/create",
      ZCreateRequirement,
      data,
    );
    return result.id;
  }

  async deleteRequirements(data: z.infer<typeof ZDeleteRequirements>) {
    await this.request("/api/requirements/delete", ZDeleteRequirements, data);
  }

  async createPrerequisite(data: z.infer<typeof ZCreatePrerequisite>) {
    const result = await this.request(
      "/api/prerequisites/create",
      ZCreatePrerequisite,
      data,
    );
    return result.id;
  }

  async deletePrerequisites(data: z.infer<typeof ZDeletePrerequisites>) {
    await this.request("/api/prerequisites/delete", ZDeletePrerequisites, data);
  }
}
