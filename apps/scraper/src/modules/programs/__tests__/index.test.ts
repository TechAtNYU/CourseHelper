import { describe, expect, test } from "bun:test";
import { discoverPrograms, scrapeProgram } from "../index";

describe("Programs Scraper", () => {
  describe("discoverPrograms", () => {
    test("should discover program URLs from the programs index page", async () => {
      const url = "https://bulletins.nyu.edu/programs/";
      const programUrls = await discoverPrograms(url);

      // Verify that we get an array of URLs
      expect(Array.isArray(programUrls)).toBe(true);

      // Verify that we have at least some programs
      expect(programUrls.length).toBeGreaterThan(0);

      // Verify that each URL is a valid string and contains the expected pattern
      for (const programUrl of programUrls) {
        expect(typeof programUrl).toBe("string");
        expect(programUrl).toContain("bulletins.nyu.edu");
        expect(programUrl).toMatch(/\/programs\//);
      }

      // Log some sample URLs for manual verification
      console.log(`Discovered ${programUrls.length} programs`);
      console.log("Sample program URLs:", programUrls.slice(0, 5));
    });

    test("should handle invalid URLs gracefully", async () => {
      const invalidUrl = "https://invalid-url.example.com/programs/";

      // This test expects the function to either throw an error or return an empty array
      // Adjust based on the actual implementation behavior
      await expect(async () => {
        const result = await discoverPrograms(invalidUrl);
        // If it doesn't throw, it should at least return an empty array
        expect(Array.isArray(result)).toBe(true);
      }).not.toThrow();
    });
  });

  describe("scrapeProgram", () => {
    test("should scrape a specific program page", async () => {
      // Using a known program URL for testing
      const programUrl =
        "https://bulletins.nyu.edu/graduate/business/programs/accounting-ms/";

      // Mock database and environment - adjust based on actual requirements
      const mockDb = {} as any;
      const mockEnv = {} as any;

      const result = await scrapeProgram(programUrl, mockDb, mockEnv);

      // Verify the structure of the returned object
      expect(result).toHaveProperty("program");
      expect(result).toHaveProperty("requirements");

      // Verify program data structure
      expect(typeof result.program).toBe("object");
      expect(Array.isArray(result.requirements)).toBe(true);

      // Log the result for manual verification
      console.log("Scraped program:", JSON.stringify(result, null, 2));
    });

    test("should handle invalid program URLs", async () => {
      const invalidUrl = "https://bulletins.nyu.edu/programs/nonexistent/";
      const mockDb = {} as any;
      const mockEnv = {} as any;

      // This test expects the function to throw an error for invalid URLs
      await expect(async () => {
        await scrapeProgram(invalidUrl, mockDb, mockEnv);
      }).toThrow();
    });
  });
});
