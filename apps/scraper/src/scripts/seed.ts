import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { jobs, errorLogs } from "../drizzle/schema";

// Connect to local D1 database (same location as wrangler)
const client = createClient({
	url: "file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/375a4651d06c046d8ffdc237c06c7167f5c9a9197f195868ac20afdc84593bba.sqlite",
});

const db = drizzle(client);

async function seed() {
	console.log("🌱 Seeding database with fake data...");

	// Insert fake jobs - 100 jobs total
	const fakeJobs = await db
		.insert(jobs)
		.values([
			// Discovery jobs (3 total)
			{
				url: "https://bulletins.nyu.edu/programs/",
				jobType: "discover-programs",
				status: "completed",
				createdAt: new Date("2025-01-10T08:00:00Z"),
				startedAt: new Date("2025-01-10T08:00:01Z"),
				completedAt: new Date("2025-01-10T08:00:45Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/",
				jobType: "discover-courses",
				status: "completed",
				createdAt: new Date("2025-01-10T08:01:00Z"),
				startedAt: new Date("2025-01-10T08:01:02Z"),
				completedAt: new Date("2025-01-10T08:03:30Z"),
			},
			{
				url: "https://bulletins.nyu.edu/programs/graduate/",
				jobType: "discover-programs",
				status: "failed",
				createdAt: new Date("2025-01-10T08:05:00Z"),
				startedAt: new Date("2025-01-10T08:05:01Z"),
				completedAt: null,
			},

			// Computer Science courses (15 total)
			{
				url: "https://bulletins.nyu.edu/programs/computer-science-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T09:00:00Z"),
				startedAt: new Date("2025-01-10T09:00:05Z"),
				completedAt: new Date("2025-01-10T09:00:12Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-101/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:01:00Z"),
				startedAt: new Date("2025-01-10T09:01:02Z"),
				completedAt: new Date("2025-01-10T09:01:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-102/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:02:00Z"),
				startedAt: new Date("2025-01-10T09:02:01Z"),
				completedAt: new Date("2025-01-10T09:02:07Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-201/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:03:00Z"),
				startedAt: new Date("2025-01-10T09:03:01Z"),
				completedAt: new Date("2025-01-10T09:03:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-202/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:04:00Z"),
				startedAt: new Date("2025-01-10T09:04:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-310/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:05:00Z"),
				startedAt: new Date("2025-01-10T09:05:02Z"),
				completedAt: new Date("2025-01-10T09:05:15Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-480/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:06:00Z"),
				startedAt: new Date("2025-01-10T09:06:03Z"),
				completedAt: new Date("2025-01-10T09:06:11Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-473/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:07:00Z"),
				startedAt: new Date("2025-01-10T09:07:01Z"),
				completedAt: new Date("2025-01-10T09:07:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-370/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:08:00Z"),
				startedAt: new Date("2025-01-10T09:08:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-380/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:09:00Z"),
				startedAt: new Date("2025-01-10T09:09:02Z"),
				completedAt: new Date("2025-01-10T09:09:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-470/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:10:00Z"),
				startedAt: new Date("2025-01-10T09:10:01Z"),
				completedAt: new Date("2025-01-10T09:10:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-453/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:11:00Z"),
				startedAt: new Date("2025-01-10T09:11:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-467/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:12:00Z"),
				startedAt: new Date("2025-01-10T09:12:02Z"),
				completedAt: new Date("2025-01-10T09:12:11Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-421/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T09:13:00Z"),
				startedAt: new Date("2025-01-10T09:13:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/csci-ua-9053/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T09:14:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Data Science (10 total)
			{
				url: "https://bulletins.nyu.edu/programs/data-science-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T09:20:00Z"),
				startedAt: new Date("2025-01-10T09:20:03Z"),
				completedAt: new Date("2025-01-10T09:20:15Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1001/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:21:00Z"),
				startedAt: new Date("2025-01-10T09:21:01Z"),
				completedAt: new Date("2025-01-10T09:21:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1003/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:22:00Z"),
				startedAt: new Date("2025-01-10T09:22:02Z"),
				completedAt: new Date("2025-01-10T09:22:11Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1004/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:23:00Z"),
				startedAt: new Date("2025-01-10T09:23:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1005/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:24:00Z"),
				startedAt: new Date("2025-01-10T09:24:02Z"),
				completedAt: new Date("2025-01-10T09:24:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1006/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:25:00Z"),
				startedAt: new Date("2025-01-10T09:25:01Z"),
				completedAt: new Date("2025-01-10T09:25:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1007/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:26:00Z"),
				startedAt: new Date("2025-01-10T09:26:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-3001/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:27:00Z"),
				startedAt: new Date("2025-01-10T09:27:02Z"),
				completedAt: new Date("2025-01-10T09:27:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1008/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T09:28:00Z"),
				startedAt: new Date("2025-01-10T09:28:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/dsga-1011/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T09:29:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Mathematics (12 total)
			{
				url: "https://bulletins.nyu.edu/programs/mathematics-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T09:35:00Z"),
				startedAt: new Date("2025-01-10T09:35:02Z"),
				completedAt: new Date("2025-01-10T09:35:14Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-120/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:36:00Z"),
				startedAt: new Date("2025-01-10T09:36:02Z"),
				completedAt: new Date("2025-01-10T09:36:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-121/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:37:00Z"),
				startedAt: new Date("2025-01-10T09:37:01Z"),
				completedAt: new Date("2025-01-10T09:37:07Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-140/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:38:00Z"),
				startedAt: new Date("2025-01-10T09:38:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-252/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:39:00Z"),
				startedAt: new Date("2025-01-10T09:39:02Z"),
				completedAt: new Date("2025-01-10T09:39:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-325/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:40:00Z"),
				startedAt: new Date("2025-01-10T09:40:01Z"),
				completedAt: new Date("2025-01-10T09:40:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-343/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:41:00Z"),
				startedAt: new Date("2025-01-10T09:41:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-9/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:42:00Z"),
				startedAt: new Date("2025-01-10T09:42:01Z"),
				completedAt: new Date("2025-01-10T09:42:07Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-123/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:43:00Z"),
				startedAt: new Date("2025-01-10T09:43:02Z"),
				completedAt: new Date("2025-01-10T09:43:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-233/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T09:44:00Z"),
				startedAt: new Date("2025-01-10T09:44:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-234/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T09:45:00Z"),
				startedAt: null,
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/math-ua-328/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T09:46:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Economics (10 total)
			{
				url: "https://bulletins.nyu.edu/programs/economics-ba/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T09:50:00Z"),
				startedAt: new Date("2025-01-10T09:50:02Z"),
				completedAt: new Date("2025-01-10T09:50:14Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-1/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:51:00Z"),
				startedAt: new Date("2025-01-10T09:51:01Z"),
				completedAt: new Date("2025-01-10T09:51:06Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-2/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:52:00Z"),
				startedAt: new Date("2025-01-10T09:52:02Z"),
				completedAt: new Date("2025-01-10T09:52:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-10/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:53:00Z"),
				startedAt: new Date("2025-01-10T09:53:01Z"),
				completedAt: new Date("2025-01-10T09:53:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-11/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:54:00Z"),
				startedAt: new Date("2025-01-10T09:54:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-13/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:55:00Z"),
				startedAt: new Date("2025-01-10T09:55:02Z"),
				completedAt: new Date("2025-01-10T09:55:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-20/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T09:56:00Z"),
				startedAt: new Date("2025-01-10T09:56:01Z"),
				completedAt: new Date("2025-01-10T09:56:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-266/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T09:57:00Z"),
				startedAt: new Date("2025-01-10T09:57:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-370/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T09:58:00Z"),
				startedAt: new Date("2025-01-10T09:58:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/econ-ua-453/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T09:59:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Physics (10 total)
			{
				url: "https://bulletins.nyu.edu/programs/physics-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T10:05:00Z"),
				startedAt: new Date("2025-01-10T10:05:04Z"),
				completedAt: new Date("2025-01-10T10:05:18Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-11/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:06:00Z"),
				startedAt: new Date("2025-01-10T10:06:01Z"),
				completedAt: new Date("2025-01-10T10:06:07Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-12/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:07:00Z"),
				startedAt: new Date("2025-01-10T10:07:02Z"),
				completedAt: new Date("2025-01-10T10:07:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-91/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:08:00Z"),
				startedAt: new Date("2025-01-10T10:08:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-93/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:09:00Z"),
				startedAt: new Date("2025-01-10T10:09:02Z"),
				completedAt: new Date("2025-01-10T10:09:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-95/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:10:00Z"),
				startedAt: new Date("2025-01-10T10:10:01Z"),
				completedAt: new Date("2025-01-10T10:10:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-123/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:11:00Z"),
				startedAt: new Date("2025-01-10T10:11:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-124/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:12:00Z"),
				startedAt: new Date("2025-01-10T10:12:02Z"),
				completedAt: new Date("2025-01-10T10:12:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-131/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T10:13:00Z"),
				startedAt: new Date("2025-01-10T10:13:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/phys-ua-140/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T10:14:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Chemistry (8 total)
			{
				url: "https://bulletins.nyu.edu/programs/chemistry-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T10:20:00Z"),
				startedAt: new Date("2025-01-10T10:20:02Z"),
				completedAt: new Date("2025-01-10T10:20:13Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-125/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:21:00Z"),
				startedAt: new Date("2025-01-10T10:21:01Z"),
				completedAt: new Date("2025-01-10T10:21:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-126/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:22:00Z"),
				startedAt: new Date("2025-01-10T10:22:02Z"),
				completedAt: new Date("2025-01-10T10:22:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-127/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:23:00Z"),
				startedAt: new Date("2025-01-10T10:23:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-247/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:24:00Z"),
				startedAt: new Date("2025-01-10T10:24:02Z"),
				completedAt: new Date("2025-01-10T10:24:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-375/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:25:00Z"),
				startedAt: new Date("2025-01-10T10:25:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-452/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T10:26:00Z"),
				startedAt: new Date("2025-01-10T10:26:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/chem-ua-465/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T10:27:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Biology (8 total)
			{
				url: "https://bulletins.nyu.edu/programs/biology-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T10:32:00Z"),
				startedAt: new Date("2025-01-10T10:32:03Z"),
				completedAt: new Date("2025-01-10T10:32:17Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-11/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:33:00Z"),
				startedAt: new Date("2025-01-10T10:33:02Z"),
				completedAt: new Date("2025-01-10T10:33:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-12/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:34:00Z"),
				startedAt: new Date("2025-01-10T10:34:01Z"),
				completedAt: new Date("2025-01-10T10:34:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-21/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:35:00Z"),
				startedAt: new Date("2025-01-10T10:35:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-22/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:36:00Z"),
				startedAt: new Date("2025-01-10T10:36:01Z"),
				completedAt: new Date("2025-01-10T10:36:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-123/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:37:00Z"),
				startedAt: new Date("2025-01-10T10:37:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-340/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T10:38:00Z"),
				startedAt: new Date("2025-01-10T10:38:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/bio-ua-450/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T10:39:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Psychology (6 total)
			{
				url: "https://bulletins.nyu.edu/programs/psychology-ba/",
				jobType: "program",
				status: "failed",
				createdAt: new Date("2025-01-10T10:44:00Z"),
				startedAt: new Date("2025-01-10T10:44:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/psych-ua-1/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:45:00Z"),
				startedAt: new Date("2025-01-10T10:45:01Z"),
				completedAt: new Date("2025-01-10T10:45:07Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/psych-ua-9/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T10:46:00Z"),
				startedAt: new Date("2025-01-10T10:46:02Z"),
				completedAt: new Date("2025-01-10T10:46:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/psych-ua-10/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T10:47:00Z"),
				startedAt: new Date("2025-01-10T10:47:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/psych-ua-25/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T10:48:00Z"),
				startedAt: new Date("2025-01-10T10:48:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/psych-ua-101/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T10:49:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Business programs (6 total)
			{
				url: "https://bulletins.nyu.edu/programs/finance-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T10:54:00Z"),
				startedAt: new Date("2025-01-10T10:54:03Z"),
				completedAt: new Date("2025-01-10T10:54:16Z"),
			},
			{
				url: "https://bulletins.nyu.edu/programs/marketing-bs/",
				jobType: "program",
				status: "failed",
				createdAt: new Date("2025-01-10T10:55:00Z"),
				startedAt: new Date("2025-01-10T10:55:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/programs/accounting-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T10:56:00Z"),
				startedAt: new Date("2025-01-10T10:56:05Z"),
				completedAt: new Date("2025-01-10T10:56:18Z"),
			},
			{
				url: "https://bulletins.nyu.edu/programs/management-bs/",
				jobType: "program",
				status: "failed",
				createdAt: new Date("2025-01-10T10:57:00Z"),
				startedAt: new Date("2025-01-10T10:57:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/programs/business-analytics-bs/",
				jobType: "program",
				status: "processing",
				createdAt: new Date("2025-01-10T10:58:00Z"),
				startedAt: new Date("2025-01-10T10:58:03Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/programs/actuarial-science-bs/",
				jobType: "program",
				status: "pending",
				createdAt: new Date("2025-01-10T10:59:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Engineering programs (4 total)
			{
				url: "https://bulletins.nyu.edu/programs/mechanical-engineering-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T11:03:00Z"),
				startedAt: new Date("2025-01-10T11:03:04Z"),
				completedAt: new Date("2025-01-10T11:03:19Z"),
			},
			{
				url: "https://bulletins.nyu.edu/programs/electrical-engineering-bs/",
				jobType: "program",
				status: "completed",
				createdAt: new Date("2025-01-10T11:04:00Z"),
				startedAt: new Date("2025-01-10T11:04:03Z"),
				completedAt: new Date("2025-01-10T11:04:17Z"),
			},
			{
				url: "https://bulletins.nyu.edu/programs/civil-engineering-bs/",
				jobType: "program",
				status: "failed",
				createdAt: new Date("2025-01-10T11:05:00Z"),
				startedAt: new Date("2025-01-10T11:05:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/programs/biomedical-engineering-bs/",
				jobType: "program",
				status: "pending",
				createdAt: new Date("2025-01-10T11:06:00Z"),
				startedAt: null,
				completedAt: null,
			},

			// Miscellaneous courses (8 total)
			{
				url: "https://bulletins.nyu.edu/courses/hist-ua-101/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T11:10:00Z"),
				startedAt: new Date("2025-01-10T11:10:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/phil-ua-1/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T11:11:00Z"),
				startedAt: new Date("2025-01-10T11:11:01Z"),
				completedAt: new Date("2025-01-10T11:11:08Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/eng-ua-101/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T11:12:00Z"),
				startedAt: new Date("2025-01-10T11:12:02Z"),
				completedAt: new Date("2025-01-10T11:12:09Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/soc-ua-1/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T11:13:00Z"),
				startedAt: new Date("2025-01-10T11:13:03Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/info-ua-300/",
				jobType: "course",
				status: "completed",
				createdAt: new Date("2025-01-10T11:14:00Z"),
				startedAt: new Date("2025-01-10T11:14:01Z"),
				completedAt: new Date("2025-01-10T11:14:10Z"),
			},
			{
				url: "https://bulletins.nyu.edu/courses/pol-ua-101/",
				jobType: "course",
				status: "failed",
				createdAt: new Date("2025-01-10T11:15:00Z"),
				startedAt: new Date("2025-01-10T11:15:02Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/anth-ua-1/",
				jobType: "course",
				status: "processing",
				createdAt: new Date("2025-01-10T11:16:00Z"),
				startedAt: new Date("2025-01-10T11:16:01Z"),
				completedAt: null,
			},
			{
				url: "https://bulletins.nyu.edu/courses/ling-ua-1/",
				jobType: "course",
				status: "pending",
				createdAt: new Date("2025-01-10T11:17:00Z"),
				startedAt: null,
				completedAt: null,
			},
		])
		.returning();

	console.log(`✅ Created ${fakeJobs.length} fake jobs`);

	// Insert fake errors - 50 errors for failed jobs
	const errorLogEntries = [
		// Errors for discover-programs graduate (index 2) - 2 errors
		{
			jobId: fakeJobs[2].id,
			errorType: "network" as const,
			errorMessage: "Failed to fetch: Connection timeout after 30s",
			stackTrace: `Error: Connection timeout
    at fetch (scraper.ts:123:15)
    at processJob (queue.ts:89:12)
    at async Worker.handleMessage (worker.ts:45:5)`,
			timestamp: new Date("2025-01-10T08:05:26Z"),
		},
		{
			jobId: fakeJobs[2].id,
			errorType: "timeout" as const,
			errorMessage: "Operation timed out after 60 seconds",
			stackTrace: `Error: Timeout
    at Timeout._onTimeout (scraper.ts:234:19)
    at listOnTimeout (internal/timers.js:554:17)`,
			timestamp: new Date("2025-01-10T08:06:01Z"),
		},

		// Errors for csci-ua-202 (index 7) - 3 errors
		{
			jobId: fakeJobs[7].id,
			errorType: "parsing" as const,
			errorMessage: "Could not parse prerequisites section - invalid HTML structure",
			stackTrace: `Error: Invalid HTML structure
    at parsePrereqs (parser.ts:45:10)
    at scrapeCourse (modules/courses.ts:78:23)
    at processJob (queue.ts:92:18)`,
			timestamp: new Date("2025-01-10T09:04:16Z"),
		},
		{
			jobId: fakeJobs[7].id,
			errorType: "validation" as const,
			errorMessage: "Missing required field: course_code",
			stackTrace: null,
			timestamp: new Date("2025-01-10T09:04:21Z"),
		},
		{
			jobId: fakeJobs[7].id,
			errorType: "network" as const,
			errorMessage: "Failed to fetch course prerequisites",
			stackTrace: `Error: HTTP 500
    at fetch (scraper.ts:123:15)
    at scrapeCourse (modules/courses.ts:45:8)`,
			timestamp: new Date("2025-01-10T09:04:10Z"),
		},

		// Errors for csci-ua-370 (index 12) - 2 errors
		{
			jobId: fakeJobs[12].id,
			errorType: "parsing" as const,
			errorMessage: "Unable to parse course description",
			stackTrace: `Error: querySelector failed
    at parseDescription (parser.ts:67:12)
    at scrapeCourse (modules/courses.ts:92:5)`,
			timestamp: new Date("2025-01-10T09:08:15Z"),
		},
		{
			jobId: fakeJobs[12].id,
			errorType: "timeout" as const,
			errorMessage: "Page load timeout",
			stackTrace: `Error: Timeout exceeded
    at waitForSelector (scraper.ts:201:9)`,
			timestamp: new Date("2025-01-10T09:08:45Z"),
		},

		// Errors for csci-ua-453 (index 14) - 2 errors
		{
			jobId: fakeJobs[14].id,
			errorType: "network" as const,
			errorMessage: "Connection refused by host",
			stackTrace: `Error: ECONNREFUSED
    at TLSSocket.onStreamRead (internal/stream_base_commons.js:209:20)`,
			timestamp: new Date("2025-01-10T09:11:08Z"),
		},
		{
			jobId: fakeJobs[14].id,
			errorType: "unknown" as const,
			errorMessage: "Unexpected error in course scraper",
			stackTrace: null,
			timestamp: new Date("2025-01-10T09:11:22Z"),
		},

		// Errors for dsga-1004 (index 19) - 3 errors
		{
			jobId: fakeJobs[19].id,
			errorType: "network" as const,
			errorMessage: "Failed to fetch: ECONNRESET - Connection reset by peer",
			stackTrace: `Error: ECONNRESET
    at TLSSocket.onStreamRead (internal/stream_base_commons.js:209:20)
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T09:23:25Z"),
		},
		{
			jobId: fakeJobs[19].id,
			errorType: "parsing" as const,
			errorMessage: "Failed to extract course code from page title",
			stackTrace: `Error: Cannot read property 'textContent' of null
    at extractCourseCode (parser.ts:23:18)
    at scrapeCourse (modules/courses.ts:56:12)`,
			timestamp: new Date("2025-01-10T09:23:08Z"),
		},
		{
			jobId: fakeJobs[19].id,
			errorType: "validation" as const,
			errorMessage: "Course title is empty",
			stackTrace: null,
			timestamp: new Date("2025-01-10T09:23:30Z"),
		},

		// Errors for dsga-1007 (index 22) - 2 errors
		{
			jobId: fakeJobs[22].id,
			errorType: "parsing" as const,
			errorMessage: "Invalid HTML structure in prerequisites section",
			stackTrace: `Error: Parse error
    at parsePrereqs (parser.ts:45:10)
    at scrapeCourse (modules/courses.ts:78:23)`,
			timestamp: new Date("2025-01-10T09:26:12Z"),
		},
		{
			jobId: fakeJobs[22].id,
			errorType: "network" as const,
			errorMessage: "HTTP 503: Service unavailable",
			stackTrace: `Error: HTTP 503
    at fetch (scraper.ts:145:11)`,
			timestamp: new Date("2025-01-10T09:26:05Z"),
		},

		// Errors for math-ua-140 (index 28) - 3 errors
		{
			jobId: fakeJobs[28].id,
			errorType: "validation" as const,
			errorMessage: "Invalid credits value: expected number, got string",
			stackTrace: null,
			timestamp: new Date("2025-01-10T09:38:18Z"),
		},
		{
			jobId: fakeJobs[28].id,
			errorType: "parsing" as const,
			errorMessage: "Credits field contains non-numeric value",
			stackTrace: `Error: Invalid credits format
    at parseCredits (parser.ts:89:12)
    at scrapeCourse (modules/courses.ts:102:8)`,
			timestamp: new Date("2025-01-10T09:38:15Z"),
		},
		{
			jobId: fakeJobs[28].id,
			errorType: "network" as const,
			errorMessage: "Failed to load course details",
			stackTrace: `Error: Connection timeout
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T09:38:08Z"),
		},

		// Errors for math-ua-343 (index 31) - 2 errors
		{
			jobId: fakeJobs[31].id,
			errorType: "timeout" as const,
			errorMessage: "Operation timed out after 60 seconds",
			stackTrace: `Error: Timeout
    at Timeout._onTimeout (scraper.ts:234:19)`,
			timestamp: new Date("2025-01-10T09:41:55Z"),
		},
		{
			jobId: fakeJobs[31].id,
			errorType: "unknown" as const,
			errorMessage: "Unexpected error during scraping",
			stackTrace: null,
			timestamp: new Date("2025-01-10T09:42:02Z"),
		},

		// Errors for econ-ua-11 (index 41) - 2 errors
		{
			jobId: fakeJobs[41].id,
			errorType: "parsing" as const,
			errorMessage: "Unable to parse course schedule",
			stackTrace: `Error: Element not found
    at parseSchedule (parser.ts:134:7)
    at scrapeCourse (modules/courses.ts:110:12)`,
			timestamp: new Date("2025-01-10T09:54:15Z"),
		},
		{
			jobId: fakeJobs[41].id,
			errorType: "validation" as const,
			errorMessage: "Missing course description",
			stackTrace: null,
			timestamp: new Date("2025-01-10T09:54:22Z"),
		},

		// Errors for econ-ua-266 (index 44) - 3 errors
		{
			jobId: fakeJobs[44].id,
			errorType: "network" as const,
			errorMessage: "HTTP 404: Page not found",
			stackTrace: `Error: HTTP 404
    at fetch (scraper.ts:145:11)
    at processJob (queue.ts:89:12)`,
			timestamp: new Date("2025-01-10T09:57:10Z"),
		},
		{
			jobId: fakeJobs[44].id,
			errorType: "parsing" as const,
			errorMessage: "Failed to parse course content",
			stackTrace: `Error: Invalid HTML
    at parseCourse (parser.ts:56:8)`,
			timestamp: new Date("2025-01-10T09:57:15Z"),
		},
		{
			jobId: fakeJobs[44].id,
			errorType: "timeout" as const,
			errorMessage: "Request timeout after 30s",
			stackTrace: `Error: Timeout
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T09:57:30Z"),
		},

		// Errors for phys-ua-91 (index 53) - 2 errors
		{
			jobId: fakeJobs[53].id,
			errorType: "network" as const,
			errorMessage: "HTTP 404: Page not found",
			stackTrace: `Error: HTTP 404
    at fetch (scraper.ts:145:11)
    at processJob (queue.ts:89:12)`,
			timestamp: new Date("2025-01-10T10:08:05Z"),
		},
		{
			jobId: fakeJobs[53].id,
			errorType: "validation" as const,
			errorMessage: "Course URL is invalid",
			stackTrace: null,
			timestamp: new Date("2025-01-10T10:08:12Z"),
		},

		// Errors for phys-ua-123 (index 56) - 2 errors
		{
			jobId: fakeJobs[56].id,
			errorType: "parsing" as const,
			errorMessage: "Cannot extract course information",
			stackTrace: `Error: Missing required elements
    at parseCourseInfo (parser.ts:78:9)
    at scrapeCourse (modules/courses.ts:88:14)`,
			timestamp: new Date("2025-01-10T10:11:15Z"),
		},
		{
			jobId: fakeJobs[56].id,
			errorType: "network" as const,
			errorMessage: "Connection error during page load",
			stackTrace: `Error: ETIMEDOUT
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T10:11:08Z"),
		},

		// Errors for chem-ua-127 (index 63) - 3 errors
		{
			jobId: fakeJobs[63].id,
			errorType: "parsing" as const,
			errorMessage: "Failed to parse lab requirements",
			stackTrace: `Error: querySelector returned null
    at parseLabReqs (parser.ts:145:11)
    at scrapeCourse (modules/courses.ts:125:7)`,
			timestamp: new Date("2025-01-10T10:23:12Z"),
		},
		{
			jobId: fakeJobs[63].id,
			errorType: "validation" as const,
			errorMessage: "Invalid credit hours format",
			stackTrace: null,
			timestamp: new Date("2025-01-10T10:23:18Z"),
		},
		{
			jobId: fakeJobs[63].id,
			errorType: "network" as const,
			errorMessage: "Failed to fetch lab schedule",
			stackTrace: `Error: HTTP 500
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T10:23:05Z"),
		},

		// Errors for chem-ua-375 (index 65) - 2 errors
		{
			jobId: fakeJobs[65].id,
			errorType: "timeout" as const,
			errorMessage: "Operation timed out after 60 seconds",
			stackTrace: `Error: Timeout
    at Timeout._onTimeout (scraper.ts:234:19)`,
			timestamp: new Date("2025-01-10T10:25:55Z"),
		},
		{
			jobId: fakeJobs[65].id,
			errorType: "parsing" as const,
			errorMessage: "Unable to locate course description",
			stackTrace: `Error: Element not found
    at parseDescription (parser.ts:67:12)`,
			timestamp: new Date("2025-01-10T10:25:15Z"),
		},

		// Errors for bio-ua-21 (index 71) - 2 errors
		{
			jobId: fakeJobs[71].id,
			errorType: "network" as const,
			errorMessage: "Connection reset during fetch",
			stackTrace: `Error: ECONNRESET
    at TLSSocket.onStreamRead (internal/stream_base_commons.js:209:20)`,
			timestamp: new Date("2025-01-10T10:35:10Z"),
		},
		{
			jobId: fakeJobs[71].id,
			errorType: "parsing" as const,
			errorMessage: "Failed to parse prerequisites",
			stackTrace: `Error: Invalid structure
    at parsePrereqs (parser.ts:45:10)`,
			timestamp: new Date("2025-01-10T10:35:20Z"),
		},

		// Errors for bio-ua-123 (index 73) - 3 errors
		{
			jobId: fakeJobs[73].id,
			errorType: "validation" as const,
			errorMessage: "Missing required field: course_name",
			stackTrace: null,
			timestamp: new Date("2025-01-10T10:37:25Z"),
		},
		{
			jobId: fakeJobs[73].id,
			errorType: "parsing" as const,
			errorMessage: "Cannot parse course sections",
			stackTrace: `Error: Sections table not found
    at parseSections (parser.ts:178:8)
    at scrapeCourse (modules/courses.ts:156:11)`,
			timestamp: new Date("2025-01-10T10:37:15Z"),
		},
		{
			jobId: fakeJobs[73].id,
			errorType: "network" as const,
			errorMessage: "HTTP 502: Bad gateway",
			stackTrace: `Error: HTTP 502
    at fetch (scraper.ts:145:11)`,
			timestamp: new Date("2025-01-10T10:37:08Z"),
		},

		// Errors for psychology-ba program (index 76) - 3 errors
		{
			jobId: fakeJobs[76].id,
			errorType: "parsing" as const,
			errorMessage: "Unexpected document structure - missing main content div",
			stackTrace: `Error: querySelector returned null
    at parseMainContent (parser.ts:34:7)
    at scrapeProgram (modules/programs.ts:45:18)`,
			timestamp: new Date("2025-01-10T10:44:12Z"),
		},
		{
			jobId: fakeJobs[76].id,
			errorType: "unknown" as const,
			errorMessage: "Unexpected error occurred during processing",
			stackTrace: `Error: Unexpected error
    at processJob (queue.ts:156:11)
    at async Worker.handleMessage (worker.ts:45:5)`,
			timestamp: new Date("2025-01-10T10:44:25Z"),
		},
		{
			jobId: fakeJobs[76].id,
			errorType: "network" as const,
			errorMessage: "Failed to load program requirements",
			stackTrace: `Error: Connection timeout
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T10:44:08Z"),
		},

		// Errors for psych-ua-10 (index 79) - 2 errors
		{
			jobId: fakeJobs[79].id,
			errorType: "parsing" as const,
			errorMessage: "Failed to extract instructor information",
			stackTrace: `Error: Instructor element not found
    at parseInstructor (parser.ts:198:10)
    at scrapeCourse (modules/courses.ts:167:9)`,
			timestamp: new Date("2025-01-10T10:47:15Z"),
		},
		{
			jobId: fakeJobs[79].id,
			errorType: "validation" as const,
			errorMessage: "Course schedule is invalid",
			stackTrace: null,
			timestamp: new Date("2025-01-10T10:47:22Z"),
		},

		// Errors for marketing-bs program (index 83) - 3 errors
		{
			jobId: fakeJobs[83].id,
			errorType: "parsing" as const,
			errorMessage: "Unable to locate program requirements table",
			stackTrace: `Error: Element not found
    at parseRequirements (parser.ts:156:9)
    at scrapeProgram (modules/programs.ts:89:14)`,
			timestamp: new Date("2025-01-10T10:55:18Z"),
		},
		{
			jobId: fakeJobs[83].id,
			errorType: "validation" as const,
			errorMessage: "Missing required field: program_code",
			stackTrace: null,
			timestamp: new Date("2025-01-10T10:55:22Z"),
		},
		{
			jobId: fakeJobs[83].id,
			errorType: "network" as const,
			errorMessage: "Failed to fetch program details",
			stackTrace: `Error: HTTP 500
    at fetch (scraper.ts:145:11)`,
			timestamp: new Date("2025-01-10T10:55:10Z"),
		},

		// Errors for management-bs program (index 85) - 2 errors
		{
			jobId: fakeJobs[85].id,
			errorType: "timeout" as const,
			errorMessage: "Page load timeout exceeded",
			stackTrace: `Error: Timeout
    at Timeout._onTimeout (scraper.ts:234:19)`,
			timestamp: new Date("2025-01-10T10:57:45Z"),
		},
		{
			jobId: fakeJobs[85].id,
			errorType: "parsing" as const,
			errorMessage: "Cannot parse program concentrations",
			stackTrace: `Error: Concentrations section not found
    at parseConcentrations (parser.ts:212:7)
    at scrapeProgram (modules/programs.ts:112:15)`,
			timestamp: new Date("2025-01-10T10:57:15Z"),
		},

		// Errors for civil-engineering-bs (index 90) - 2 errors
		{
			jobId: fakeJobs[90].id,
			errorType: "network" as const,
			errorMessage: "Connection timeout during fetch",
			stackTrace: `Error: Connection timeout
    at fetch (scraper.ts:123:15)`,
			timestamp: new Date("2025-01-10T11:05:30Z"),
		},
		{
			jobId: fakeJobs[90].id,
			errorType: "validation" as const,
			errorMessage: "Program degree type is missing",
			stackTrace: null,
			timestamp: new Date("2025-01-10T11:05:35Z"),
		},

		// Errors for hist-ua-101 (index 92) - 3 errors
		{
			jobId: fakeJobs[92].id,
			errorType: "timeout" as const,
			errorMessage: "Operation timed out after 60 seconds",
			stackTrace: `Error: Timeout
    at Timeout._onTimeout (scraper.ts:234:19)
    at listOnTimeout (internal/timers.js:554:17)`,
			timestamp: new Date("2025-01-10T11:10:55Z"),
		},
		{
			jobId: fakeJobs[92].id,
			errorType: "network" as const,
			errorMessage: "Failed to fetch: Connection timeout after 30s",
			stackTrace: `Error: Connection timeout
    at fetch (scraper.ts:123:15)
    at processJob (queue.ts:89:12)`,
			timestamp: new Date("2025-01-10T11:10:32Z"),
		},
		{
			jobId: fakeJobs[92].id,
			errorType: "parsing" as const,
			errorMessage: "Unable to parse historical context section",
			stackTrace: `Error: Section not found
    at parseContext (parser.ts:223:9)
    at scrapeCourse (modules/courses.ts:189:7)`,
			timestamp: new Date("2025-01-10T11:10:15Z"),
		},

		// Errors for soc-ua-1 (index 95) - 2 errors
		{
			jobId: fakeJobs[95].id,
			errorType: "parsing" as const,
			errorMessage: "Failed to parse course syllabus link",
			stackTrace: `Error: Link element not found
    at parseSyllabusLink (parser.ts:245:11)
    at scrapeCourse (modules/courses.ts:201:8)`,
			timestamp: new Date("2025-01-10T11:13:18Z"),
		},
		{
			jobId: fakeJobs[95].id,
			errorType: "validation" as const,
			errorMessage: "Invalid course format code",
			stackTrace: null,
			timestamp: new Date("2025-01-10T11:13:25Z"),
		},

		// Errors for pol-ua-101 (index 97) - 2 errors
		{
			jobId: fakeJobs[97].id,
			errorType: "network" as const,
			errorMessage: "HTTP 503: Service temporarily unavailable",
			stackTrace: `Error: HTTP 503
    at fetch (scraper.ts:145:11)`,
			timestamp: new Date("2025-01-10T11:15:10Z"),
		},
		{
			jobId: fakeJobs[97].id,
			errorType: "unknown" as const,
			errorMessage: "Unhandled exception during scraping",
			stackTrace: `Error: Unknown error
    at processJob (queue.ts:156:11)`,
			timestamp: new Date("2025-01-10T11:15:25Z"),
		},
	];

	await db.insert(errorLogs).values(errorLogEntries);
	console.log(`✅ Created ${errorLogEntries.length} fake errors`);


	console.log("🎉 Database seeded successfully!");
	process.exit(0);
}

seed().catch((error) => {
	console.error("❌ Error seeding database:", error);
	process.exit(1);
});
