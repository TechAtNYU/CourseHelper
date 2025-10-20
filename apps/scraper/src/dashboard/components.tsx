import type { DashboardData } from "./queries";
import { minimalCSS } from "./styles";

/**
 * Format date + time
 */
function formatDate(date: Date): string {
  return date.toLocaleString();
}

/**
 * Dashboard component renders the returned HTML (server-side generates complete HTML for first-load)
 */
export function Dashboard({ stats, errorStats, jobs, errors }: DashboardData) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Scraper Dashboard - CourseHelper</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{minimalCSS}</style>
      </head>
      <body>
        <Header />
        <JobsStatsBar stats={stats} />
        <JobsTable jobs={jobs} />
        <ErrorsStatsBar errorStats={errorStats} />
        <ErrorsTable errors={errors} />
        <RefreshControls />
        <RefreshScript />
      </body>
    </html>
  );
}

/**
 * Header
 */
function Header() {
  return (
    <header>
      <h1>Scraper Dashboard</h1>
    </header>
  );
}

/**
 * Jobs stats bar with visual breakdown
 */
function JobsStatsBar({ stats }: { stats: DashboardData["stats"] }) {
  const jobsTotal = stats.total || 1;
  const completedPct = ((stats.completed / jobsTotal) * 100).toFixed(0);
  const failedPct = ((stats.failed / jobsTotal) * 100).toFixed(0);
  const processingPct = ((stats.processing / jobsTotal) * 100).toFixed(0);
  const pendingPct = ((stats.pending / jobsTotal) * 100).toFixed(0);

  return (
    <div class="stats-section">
      <div class="stats-inline">
        <div class="stats-title">Jobs ({stats.total})</div>
        <div class="stats-bar-compact" id="jobs-stats-bar">
          <div
            class="stats-segment segment-completed"
            style={`width: ${completedPct}%`}
            title={`Completed: ${stats.completed} (${completedPct}%)`}
          ></div>
          <div
            class="stats-segment segment-processing"
            style={`width: ${processingPct}%`}
            title={`Processing: ${stats.processing} (${processingPct}%)`}
          ></div>
          <div
            class="stats-segment segment-pending"
            style={`width: ${pendingPct}%`}
            title={`Pending: ${stats.pending} (${pendingPct}%)`}
          ></div>
          <div
            class="stats-segment segment-failed"
            style={`width: ${failedPct}%`}
            title={`Failed: ${stats.failed} (${failedPct}%)`}
          ></div>
        </div>
        <div class="stats-legend">
          <span class="legend-item">
            <span class="legend-dot segment-completed"></span>
            Completed {stats.completed}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-processing"></span>
            Processing {stats.processing}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-pending"></span>
            Pending {stats.pending}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-failed"></span>
            Failed {stats.failed}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Errors stats bar with visual breakdown
 */
function ErrorsStatsBar({
  errorStats,
}: {
  errorStats: DashboardData["errorStats"];
}) {
  const errorsTotal = errorStats.total || 1;
  const networkPct = ((errorStats.network / errorsTotal) * 100).toFixed(0);
  const parsingPct = ((errorStats.parsing / errorsTotal) * 100).toFixed(0);
  const validationPct = ((errorStats.validation / errorsTotal) * 100).toFixed(
    0,
  );
  const timeoutPct = ((errorStats.timeout / errorsTotal) * 100).toFixed(0);
  const unknownPct = ((errorStats.unknown / errorsTotal) * 100).toFixed(0);

  return (
    <div class="stats-section">
      <div class="stats-inline">
        <div class="stats-title">Errors ({errorStats.total})</div>
        <div class="stats-bar-compact" id="errors-stats-bar">
          <div
            class="stats-segment segment-error-network"
            style={`width: ${networkPct}%`}
            title={`Network: ${errorStats.network} (${networkPct}%)`}
          ></div>
          <div
            class="stats-segment segment-error-parsing"
            style={`width: ${parsingPct}%`}
            title={`Parsing: ${errorStats.parsing} (${parsingPct}%)`}
          ></div>
          <div
            class="stats-segment segment-error-validation"
            style={`width: ${validationPct}%`}
            title={`Validation: ${errorStats.validation} (${validationPct}%)`}
          ></div>
          <div
            class="stats-segment segment-error-timeout"
            style={`width: ${timeoutPct}%`}
            title={`Timeout: ${errorStats.timeout} (${timeoutPct}%)`}
          ></div>
          <div
            class="stats-segment segment-error-unknown"
            style={`width: ${unknownPct}%`}
            title={`Unknown: ${errorStats.unknown} (${unknownPct}%)`}
          ></div>
        </div>
        <div class="stats-legend">
          <span class="legend-item">
            <span class="legend-dot segment-error-network"></span>
            Network {errorStats.network}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-error-parsing"></span>
            Parsing {errorStats.parsing}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-error-validation"></span>
            Validation {errorStats.validation}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-error-timeout"></span>
            Timeout {errorStats.timeout}
          </span>
          <span class="legend-item">
            <span class="legend-dot segment-error-unknown"></span>
            Unknown {errorStats.unknown}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Recent jobs table , job table
 */
function JobsTable({ jobs }: { jobs: DashboardData["jobs"] }) {
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice(0, ITEMS_PER_PAGE);

  return (
    <div class="table-container">
      <div class="table-header">
        <h2>Recent Jobs</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <select id="filter-job-type" class="header-filter">
                <option value="">job type</option>
                <option value="discover-programs">discover-programs</option>
                <option value="discover-courses">discover-courses</option>
                <option value="program">program</option>
                <option value="course">course</option>
              </select>
            </th>
            <th>
              <select id="filter-job-status" class="header-filter">
                <option value="">status</option>
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="completed">completed</option>
                <option value="failed">failed</option>
              </select>
            </th>
            <th>
              <input
                type="text"
                id="search-job-url"
                class="header-filter url-search-header"
                placeholder="url"
              />
            </th>
            <th>Created</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody id="jobs-table-body">
          {paginatedJobs.map((job) => (
            <JobRow job={job} key={job.id} />
          ))}
        </tbody>
      </table>
      <div class="pagination-controls" id="jobs-pagination">
        <button type="button" class="pagination-btn jobs-first-btn">
          First
        </button>
        <button type="button" class="pagination-btn jobs-prev-btn">
          Previous
        </button>
        <span class="page-info">Page 1 of {totalPages}</span>
        <button type="button" class="pagination-btn jobs-next-btn">
          Next
        </button>
        <button type="button" class="pagination-btn jobs-last-btn">
          Last
        </button>
      </div>
    </div>
  );
}

/**
 * Job row with expandable errors for failed jobs
 */
function JobRow({ job }: { job: DashboardData["jobs"][0] }) {
  const duration = job.startedAt
    ? job.completedAt
      ? Math.round(
          (new Date(job.completedAt).getTime() -
            new Date(job.startedAt).getTime()) /
            1000,
        ) // calculate how long it took
      : "In progress" // if no completedAt, hasn't completed
    : "Not started"; // if !job.startedAt, it hasn't started

  const isFailed = job.status === "failed";

  return (
    <tr
      class={isFailed ? "job-row-failed clickable" : ""}
      data-job-id={isFailed ? job.id : undefined}
    >
      <td>{job.jobType}</td>
      <td>
        <span class={`status-badge status-${job.status}`}>{job.status}</span>
      </td>
      <td>
        <div class="text-truncate text-small" title={job.url}>
          {job.url}
        </div>
      </td>
      <td class="text-small">{formatDate(new Date(job.createdAt))}</td>
      <td class="text-small">
        {typeof duration === "number" ? `${duration}s` : duration}
      </td>
    </tr>
  );
}

/**
 * Recent errors table , error table
 */
function ErrorsTable({ errors }: { errors: DashboardData["errors"] }) {
  const ITEMS_PER_PAGE = 12;

  if (errors.length === 0) {
    return (
      <div class="table-container">
        <div class="table-header">
          <h2>Recent Errors</h2>
        </div>
        <div class="empty-state">no errors found</div>
      </div>
    );
  }

  const totalPages = Math.ceil(errors.length / ITEMS_PER_PAGE);
  const paginatedErrors = errors.slice(0, ITEMS_PER_PAGE);

  return (
    <div class="table-container">
      <div class="table-header">
        <h2>Recent Errors</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <select id="filter-error-job-type" class="header-filter">
                <option value="">job type</option>
                <option value="discover-programs">discover-programs</option>
                <option value="discover-courses">discover-courses</option>
                <option value="program">program</option>
                <option value="course">course</option>
              </select>
            </th>
            <th>
              <select id="filter-error-type" class="header-filter">
                <option value="">error type</option>
                <option value="network">network</option>
                <option value="parsing">parsing</option>
                <option value="validation">validation</option>
                <option value="timeout">timeout</option>
                <option value="unknown">unknown</option>
              </select>
            </th>
            <th>Message</th>
            <th>
              <input
                type="text"
                id="search-error-url"
                class="header-filter url-search-header"
                placeholder="url"
              />
            </th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody id="errors-table-body">
          {paginatedErrors.map((error) => (
            <ErrorRow error={error} key={error.id} />
          ))}
        </tbody>
      </table>
      <div class="pagination-controls" id="errors-pagination">
        <button type="button" class="pagination-btn errors-first-btn">
          First
        </button>
        <button type="button" class="pagination-btn errors-prev-btn">
          Previous
        </button>
        <span class="page-info">Page 1 of {totalPages}</span>
        <button type="button" class="pagination-btn errors-next-btn">
          Next
        </button>
        <button type="button" class="pagination-btn errors-last-btn">
          Last
        </button>
      </div>
    </div>
  );
}

/**
 * Individual error row
 */
function ErrorRow({ error }: { error: DashboardData["errors"][0] }) {
  return (
    <tr>
      <td>{error.jobType}</td>
      <td>
        <span class="error-badge">{error.errorType}</span>
      </td>
      <td>
        <div class="text-truncate" title={error.errorMessage}>
          {error.errorMessage}
        </div>
      </td>
      <td>
        <div class="text-truncate text-small" title={error.jobUrl}>
          {error.jobUrl}
        </div>
      </td>
      <td class="text-small">{formatDate(new Date(error.timestamp))}</td>
    </tr>
  );
}

/**
 * Refresh control - manual button, and checkbox to turn on automatic mode
 */
function RefreshControls() {
  return (
    <div class="refresh-controls">
      <button type="button" id="refresh-btn" class="refresh-btn">
        ↻ Refresh
      </button>
      <label>
        <input type="checkbox" id="auto-toggle" />
        Auto-refresh
      </label>
      <div class="last-refresh">
        Last: <span id="last-refresh">Just now</span>
      </div>
    </div>
  );
}

/**
 * Load external JavaScript for dashboard functionality
 * Handles auto-refresh, filtering, pagination, and real-time updates
 * Security: All dynamic data is HTML-escaped to prevent XSS attacks.
 */
function RefreshScript() {
  return <script src="/dashboard.js" />;
}
