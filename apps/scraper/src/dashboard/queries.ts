import { desc, sql, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { jobs, errorLogs } from "../drizzle/schema";

/**
 * Exports the data from the queries in this format
 */
export type DashboardData = {
	stats: {
		total: number;
		completed: number;
		failed: number;
		pending: number;
		processing: number;
	};
	errorStats: {
		total: number;
		network: number;
		parsing: number;
		validation: number;
		timeout: number;
		unknown: number;
	};
	jobs: Array<{
		id: string;
		url: string;
		status: string;
		jobType: string;
		createdAt: Date;
		startedAt: Date | null;
		completedAt: Date | null;
	}>;
	errors: Array<{
		id: string;
		jobId: string | null;
		errorType: string;
		errorMessage: string;
		timestamp: Date;
		jobType: string;
		jobUrl: string;
	}>;
};

/**
 * Fetches the data for the dashboard
 * @param db - Drizzle D1 database instance
 * @returns Dashboard data including stats, recent jobs, and errors
 */
export async function getDashboardData(
	db: DrizzleD1Database,
): Promise<DashboardData> {
	// how many to query
	const MAX_JOBS_TO_SHOW = 500;
	const MAX_ERRORS_TO_SHOW = 100;

	// Recent Jobs
	const recentJobs = await db
		.select()
		.from(jobs)
		.orderBy(desc(jobs.createdAt))
		.limit(MAX_JOBS_TO_SHOW);

	// Job Counts 
	const statusCounts = await db
		.select({
			status: jobs.status,
			count: sql<number>`count(*)`.as("count"),
		})
		.from(jobs)
		.groupBy(jobs.status)
		.all();

	// Get stats for (job) stats object
	const stats = {
		total: statusCounts.reduce((sum, s) => sum + s.count, 0),
		completed:
			statusCounts.find((s) => s.status === "completed")?.count || 0,
		failed: statusCounts.find((s) => s.status === "failed")?.count || 0,
		pending: statusCounts.find((s) => s.status === "pending")?.count || 0,
		processing:
			statusCounts.find((s) => s.status === "processing")?.count || 0,
	};

	// Error Counts (by type)
	const errorTypeCounts = await db
		.select({
			errorType: errorLogs.errorType,
			count: sql<number>`count(*)`.as("count"),
		})
		.from(errorLogs)
		.groupBy(errorLogs.errorType)
		.all();

	// Get stats for errorStats
	const errorStats = {
		total: errorTypeCounts.reduce((sum, e) => sum + e.count, 0),
		network: errorTypeCounts.find((e) => e.errorType === "network")?.count || 0,
		parsing: errorTypeCounts.find((e) => e.errorType === "parsing")?.count || 0,
		validation: errorTypeCounts.find((e) => e.errorType === "validation")?.count || 0,
		timeout: errorTypeCounts.find((e) => e.errorType === "timeout")?.count || 0,
		unknown: errorTypeCounts.find((e) => e.errorType === "unknown")?.count || 0,
	};

	// Recent errors + job info -- join for job url and type info
	const recentErrors = await db
		.select({
			id: errorLogs.id,
			jobId: errorLogs.jobId,
			errorType: errorLogs.errorType,
			errorMessage: errorLogs.errorMessage,
			timestamp: errorLogs.timestamp,
			jobType: jobs.jobType,
			jobUrl: jobs.url,
		})
		.from(errorLogs)
		.innerJoin(jobs, eq(errorLogs.jobId, jobs.id))
		.orderBy(desc(errorLogs.timestamp))
		.limit(MAX_ERRORS_TO_SHOW)
		.all();

	return {
		stats,
		errorStats,
		jobs: recentJobs,
		errors: recentErrors,
	};
}
