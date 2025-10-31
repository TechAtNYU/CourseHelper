# Scraper Modules Tests

This directory contains the scraper modules for the AlbertPlus project. Each module includes tests to verify the scraping functionality.

## Running Tests

You can run the tests using the following commands:

```bash
# Run all tests
bun test

# Run only programs tests
bun test:programs

# Run only courses tests
bun test:courses
```

## Test Structure

### Programs Module (`programs/`)

The programs module is responsible for scraping program information from NYU Bulletins.

**Test file:** `programs/__tests__/index.test.ts`

**Functions tested:**
- `discoverPrograms(url)`: Discovers all program URLs from the programs index page
  - Input: `https://bulletins.nyu.edu/programs/`
  - Expected output: Array of program URLs
  
- `scrapeProgram(url, db, env)`: Scrapes individual program pages
  - Input: Individual program URL (e.g., `https://bulletins.nyu.edu/graduate/business/programs/accounting-ms/`)
  - Expected output: Object with program data and requirements

### Courses Module (`courses/`)

The courses module is responsible for scraping course information from NYU Bulletins.

**Test file:** `courses/__tests__/index.test.ts`

**Functions tested:**
- `discoverCourses(url)`: Discovers all course category URLs from the courses index page
  - Input: `https://bulletins.nyu.edu/courses/`
  - Expected output: Array of course category URLs
  
- `scrapeCourse(url, db, env)`: Scrapes individual course category pages
  - Input: Individual course category URL (e.g., `https://bulletins.nyu.edu/courses/acct_gb/`)
  - Expected output: Object with course data and prerequisites

## Implementation Notes

The test files are designed to validate:
1. The scraper functions return the correct data types (arrays, objects)
2. The discovered URLs follow the expected patterns
3. The scraped data has the required structure
4. Error handling works correctly for invalid URLs

Once you implement the actual scraping logic in `programs/index.ts` and `courses/index.ts`, these tests will verify that the implementation works correctly.
