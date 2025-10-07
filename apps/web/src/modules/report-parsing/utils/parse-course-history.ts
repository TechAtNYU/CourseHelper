interface Course {
  term: string;
  subject: string;
  catalogNumber: string;
  title: string;
  grade: string;
  units: string;
  type: string;
  meta?: Record<string, string>;
}

export function parseCourseHistory(text: string): Course[] {
  const courses: Course[] = [];

  // for those course history that are longer than one page, remove the page number
  text = text.replace(/Page\s+\d+\s+of\s+\d+/gi, "");

  // Remove header line if present
  text = text.replace(
    /Course History\s+Term\s+Subject\s+Catalog Nbr\s+Title\s+Grade\s+Units\s+Type/gi,
    "",
  );

  // Split by year pattern
  // Look for pattern: 20XX followed by semester
  const coursePattern = /20\d{2}\s+(Sum|Spr|Fall|Win)/gi;
  const matches = [];
  let match: RegExpExecArray | null = null;

  // Find all positions where courses start
  const regex = new RegExp(coursePattern.source, "gi");
  match = regex.exec(text);
  while (match !== null) {
    matches.push(match.index);
    match = regex.exec(text);
  }

  // Extract each course block
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i];
    const end = i < matches.length - 1 ? matches[i + 1] : text.length;
    const block = text.substring(start, end).trim();

    // Check for metadata first and remove them from the block for parsing
    const meta: Record<string, string> = {};
    const metaMatch = block.match(
      /(Repeat Code|Course Topic):\s+(.+?)(?=\s*$)/,
    );
    if (metaMatch) {
      const key = metaMatch[1].replace(/\s+/g, "");
      const value = metaMatch[2].trim();
      meta[key] = value;
    }

    const cleanBlock = block
      .replace(/(Repeat Code|Course Topic):\s+.+$/, "")
      .trim();

    const parts = cleanBlock.split(/\s{3,}/);

    if (parts.length >= 6) {
      const termMatch = parts[0].match(/^(20\d{2})\s+(Sum|Spr|Fall|Win)/i);
      const term = termMatch
        ? `${termMatch[1]} ${termMatch[2]}`
        : parts[0].trim();

      // special case for the course that student is taking(which only ahve 6 parts: missing grade)
      const hasGrade = parts.length >= 7;

      const course: Course = {
        term: term,
        subject: parts[1].trim(),
        catalogNumber: parts[2].trim(),
        title: parts[3].trim(),
        grade: hasGrade ? parts[4].trim() : "",
        units: hasGrade ? parts[5].trim() : parts[4].trim(),
        type: hasGrade ? parts[6].trim() : parts[5].trim(),
      };

      if (Object.keys(meta).length > 0) {
        course.meta = meta;
      }

      courses.push(course);
    }
  }

  return courses;
}
