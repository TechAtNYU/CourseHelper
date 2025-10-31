import { describe, expect, test } from "bun:test";
import { discoverCourses, scrapeCourse } from "./index";
import { JobError } from "../../lib/queue";

describe("Courses Scraper", () => {
  describe("discoverCourses", () => {
    test("should discover course category URLs from the courses index page", async () => {
      const url = "https://bulletins.nyu.edu/courses/";
      const courseUrls = await discoverCourses(url);

      // Verify that we get an array of URLs
      expect(Array.isArray(courseUrls)).toBe(true);

      // Verify that we have at least some course categories
      expect(courseUrls.length).toBeGreaterThan(0);

      // Verify that each URL is a valid string and contains the expected pattern
      for (const courseUrl of courseUrls) {
        expect(typeof courseUrl).toBe("string");
        expect(courseUrl).toContain("bulletins.nyu.edu");
        expect(courseUrl).toMatch(/\/courses\//);
      }

      // Log some sample URLs for manual verification
      console.log(`Discovered ${courseUrls.length} course categories`);
      console.log("Sample course category URLs:", courseUrls.slice(0, 5));
    });

    test("should handle invalid URLs gracefully", async () => {
      const invalidUrl = "https://invalid-url.example.com/courses/";

      expect(async () => {
        await discoverCourses(invalidUrl);
      }).not.toThrow(JobError);
    });
  });

  describe("scrapeCourse", () => {
    test("should scrape a specific course category page", async () => {
      // Using a known course category URL for testing
      const courseUrl = "https://bulletins.nyu.edu/courses/acct_gb/";

      // Mock database and environment - adjust based on actual requirements
      const mockDb = {} as any;
      const mockEnv = {} as any;

      const result = await scrapeCourse(courseUrl, mockDb, mockEnv);

      // Verify the structure of the returned object
      expect(result).toHaveProperty("course");
      expect(result).toHaveProperty("prerequisites");

      // Verify course data structure
      expect(typeof result.course).toBe("object");
      expect(Array.isArray(result.prerequisites)).toBe(true);

      // Log the result for manual verification
      console.log("Scraped course:", JSON.stringify(result, null, 2));
    });

    test("should handle invalid course URLs", async () => {
      const invalidUrl = "https://bulletins.nyu.edu/courses/nonexistent/";
      const mockDb = {} as any;
      const mockEnv = {} as any;

      // This test expects the function to throw an error for invalid URLs
      expect(async () => {
        await scrapeCourse(invalidUrl, mockDb, mockEnv);
      }).toThrow(JobError);
    });
  });
});
