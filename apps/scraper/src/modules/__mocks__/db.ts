import type { DrizzleD1Database } from "drizzle-orm/d1";
import { mock } from "bun:test";

export function createMockDb(): DrizzleD1Database {
  return {
    insert: mock(() => ({
      values: mock(() => ({
        returning: mock(() => Promise.resolve([{ id: "test-id" }])),
      })),
    })),
    select: mock(() => ({
      from: mock(() => ({
        where: mock(() => Promise.resolve([])),
      })),
    })),
    update: mock(() => ({
      set: mock(() => ({
        where: mock(() => Promise.resolve({ rowsAffected: 1 })),
      })),
    })),
  } as any;
}
