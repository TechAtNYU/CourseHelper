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
 * JavaScript for handling refresh functionality
 * Updates dashboard w/o full page reload
 * Security: All dynamic data is HTML-escaped to prevent XSS attacks.
 * Still need implement auth (Basic Auth or Cloudfare Access)
 */
function RefreshScript() {
  const REFRESH_INTERVAL = 30000; // 30 sec
  const ITEMS_PER_PAGE = 12;
  // goes inside <script> tags
  const scriptContent = `
    const REFRESH_INTERVAL = ${REFRESH_INTERVAL};
    const ITEMS_PER_PAGE = ${ITEMS_PER_PAGE};
    let autoRefreshInterval = null;

    // Escape HTML to prevent XSS attacks
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Manual refresh button click handler
    document.getElementById('refresh-btn').addEventListener('click', () => {
      fetchAndUpdate();
    });

    // Auto-refresh toggle handler
    document.getElementById('auto-toggle').addEventListener('change', (e) => {
      if (e.target.checked) {
        autoRefreshInterval = setInterval(fetchAndUpdate, REFRESH_INTERVAL);
        console.log('Auto-refresh enabled: every ' + (REFRESH_INTERVAL / 1000) + ' seconds');
      } else {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('Auto-refresh disabled');
      }
    });

    // Client-side filtering and pagination - store all data in memory
    let allJobs = [];
    let allErrors = [];
    let currentJobsPage = 1;
    let currentErrorsPage = 1;

    // Initialize data on page load
    async function initializeData() {
      try {
        const response = await fetch('/', {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          allJobs = data.jobs;
          allErrors = data.errors;

          // Initialize button states
          updatePaginationButtons();
        }
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    }

    function updatePaginationButtons() {
      const filteredJobs = getFilteredJobs();
      const filteredErrors = getFilteredErrors();
      const jobsTotalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
      const errorsTotalPages = Math.ceil(filteredErrors.length / ITEMS_PER_PAGE);

      // Update jobs buttons
      const jobsPagination = document.getElementById('jobs-pagination');
      if (jobsPagination) {
        const firstBtn = jobsPagination.querySelector('.jobs-first-btn');
        const prevBtn = jobsPagination.querySelector('.jobs-prev-btn');
        const nextBtn = jobsPagination.querySelector('.jobs-next-btn');
        const lastBtn = jobsPagination.querySelector('.jobs-last-btn');
        const pageInfo = jobsPagination.querySelector('.page-info');

        // Disable buttons instead of hiding them to keep positions consistent
        firstBtn.disabled = currentJobsPage === 1 || jobsTotalPages <= 1;
        prevBtn.disabled = jobsTotalPages === 0;
        nextBtn.disabled = jobsTotalPages === 0;
        lastBtn.disabled = currentJobsPage === jobsTotalPages || jobsTotalPages <= 1;

        pageInfo.textContent = jobsTotalPages === 0 ? 'No results' : 'Page ' + currentJobsPage + ' of ' + jobsTotalPages;
      }

      // Update errors buttons
      const errorsPagination = document.getElementById('errors-pagination');
      if (errorsPagination) {
        const firstBtn = errorsPagination.querySelector('.errors-first-btn');
        const prevBtn = errorsPagination.querySelector('.errors-prev-btn');
        const nextBtn = errorsPagination.querySelector('.errors-next-btn');
        const lastBtn = errorsPagination.querySelector('.errors-last-btn');
        const pageInfo = errorsPagination.querySelector('.page-info');

        // Disable buttons instead of hiding them to keep positions consistent
        firstBtn.disabled = currentErrorsPage === 1 || errorsTotalPages <= 1;
        prevBtn.disabled = errorsTotalPages === 0;
        nextBtn.disabled = errorsTotalPages === 0;
        lastBtn.disabled = currentErrorsPage === errorsTotalPages || errorsTotalPages <= 1;

        pageInfo.textContent = errorsTotalPages === 0 ? 'No results' : 'Page ' + currentErrorsPage + ' of ' + errorsTotalPages;
      }
    }

    initializeData();

    document.getElementById('filter-job-type').addEventListener('change', filterJobs);
    document.getElementById('filter-job-status').addEventListener('change', filterJobs);
    document.getElementById('search-job-url').addEventListener('input', filterJobs);
    document.getElementById('filter-error-job-type').addEventListener('change', filterErrors);
    document.getElementById('filter-error-type').addEventListener('change', filterErrors);
    document.getElementById('search-error-url').addEventListener('input', filterErrors);

    // Track expanded job rows
    let expandedJobIds = new Set();

    // Handle job row clicks for failed jobs (expandable errors)
    document.addEventListener('click', (e) => {
      const row = e.target.closest('tr.job-row-failed');
      if (row) {
        const jobId = row.getAttribute('data-job-id');
        toggleJobErrors(jobId, row);
      }
    });

    function toggleJobErrors(jobId, row) {
      // Check if already expanded
      const existingErrorRow = row.nextElementSibling;
      if (existingErrorRow && existingErrorRow.classList.contains('error-expansion-row')) {
        // Collapse
        existingErrorRow.remove();
        expandedJobIds.delete(jobId);
        return;
      }

      // Expand - find errors for this job using jobId
      const jobErrors = allErrors.filter(error => error.jobId === jobId);

      if (jobErrors.length === 0) {
        // No errors found - show message
        const errorRow = document.createElement('tr');
        errorRow.className = 'error-expansion-row';
        errorRow.innerHTML = '<td colspan="5" class="error-expansion-cell"><div class="no-errors-message">No error details found for this job</div></td>';
        row.parentNode.insertBefore(errorRow, row.nextSibling);
      } else {
        // Show errors
        const errorRow = document.createElement('tr');
        errorRow.className = 'error-expansion-row';
        errorRow.innerHTML = '<td colspan="5" class="error-expansion-cell">' +
          '<div class="error-expansion-content">' +
          jobErrors.map(error =>
            '<div class="expanded-error">' +
              '<div class="expanded-error-header">' +
                '<span class="error-badge">' + escapeHtml(error.errorType) + '</span>' +
                '<span class="error-time">' + escapeHtml(new Date(error.timestamp).toLocaleString()) + '</span>' +
              '</div>' +
              '<div class="expanded-error-message">' + escapeHtml(error.errorMessage) + '</div>' +
            '</div>'
          ).join('') +
          '</div></td>';
        row.parentNode.insertBefore(errorRow, row.nextSibling);
        expandedJobIds.add(jobId);
      }
    }

    // Helper functions to get filtered data
    function getFilteredJobs() {
      const typeFilter = document.getElementById('filter-job-type').value;
      const statusFilter = document.getElementById('filter-job-status').value;
      const urlSearch = document.getElementById('search-job-url').value.toLowerCase();

      return allJobs.filter(job => {
        const matchType = !typeFilter || job.jobType === typeFilter;
        const matchStatus = !statusFilter || job.status === statusFilter;
        const matchUrl = !urlSearch || job.url.toLowerCase().includes(urlSearch);
        return matchType && matchStatus && matchUrl;
      });
    }

    function getFilteredErrors() {
      const jobTypeFilter = document.getElementById('filter-error-job-type').value;
      const errorTypeFilter = document.getElementById('filter-error-type').value;
      const urlSearch = document.getElementById('search-error-url').value.toLowerCase();

      return allErrors.filter(error => {
        const matchJobType = !jobTypeFilter || error.jobType === jobTypeFilter;
        const matchErrorType = !errorTypeFilter || error.errorType === errorTypeFilter;
        const matchUrl = !urlSearch || error.jobUrl.toLowerCase().includes(urlSearch);
        return matchJobType && matchErrorType && matchUrl;
      });
    }

    // Pagination button event listeners
    document.addEventListener('click', (e) => {
      // Jobs pagination
      if (e.target.classList.contains('jobs-first-btn')) {
        currentJobsPage = 1;
        renderJobsTable(getFilteredJobs());
      } else if (e.target.classList.contains('jobs-prev-btn')) {
        const filteredJobs = getFilteredJobs();
        const jobsTotalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
        currentJobsPage = currentJobsPage > 1 ? currentJobsPage - 1 : jobsTotalPages;
        renderJobsTable(filteredJobs);
      } else if (e.target.classList.contains('jobs-next-btn')) {
        const filteredJobs = getFilteredJobs();
        const jobsTotalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
        currentJobsPage = currentJobsPage < jobsTotalPages ? currentJobsPage + 1 : 1;
        renderJobsTable(filteredJobs);
      } else if (e.target.classList.contains('jobs-last-btn')) {
        const filteredJobs = getFilteredJobs();
        currentJobsPage = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
        renderJobsTable(filteredJobs);
      }
      // Errors pagination
      else if (e.target.classList.contains('errors-first-btn')) {
        currentErrorsPage = 1;
        renderErrorsTable(getFilteredErrors());
      } else if (e.target.classList.contains('errors-prev-btn')) {
        const filteredErrors = getFilteredErrors();
        const errorsTotalPages = Math.ceil(filteredErrors.length / ITEMS_PER_PAGE);
        currentErrorsPage = currentErrorsPage > 1 ? currentErrorsPage - 1 : errorsTotalPages;
        renderErrorsTable(filteredErrors);
      } else if (e.target.classList.contains('errors-next-btn')) {
        const filteredErrors = getFilteredErrors();
        const errorsTotalPages = Math.ceil(filteredErrors.length / ITEMS_PER_PAGE);
        currentErrorsPage = currentErrorsPage < errorsTotalPages ? currentErrorsPage + 1 : 1;
        renderErrorsTable(filteredErrors);
      } else if (e.target.classList.contains('errors-last-btn')) {
        const filteredErrors = getFilteredErrors();
        currentErrorsPage = Math.ceil(filteredErrors.length / ITEMS_PER_PAGE);
        renderErrorsTable(filteredErrors);
      }
    });

    function filterJobs() {
      currentJobsPage = 1; // Reset to first page when filtering
      renderJobsTable(getFilteredJobs());
    }

    function filterErrors() {
      currentErrorsPage = 1; // Reset to first page when filtering
      renderErrorsTable(getFilteredErrors());
    }

    function renderJobsTable(jobs) {
      const start = (currentJobsPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginatedJobs = jobs.slice(start, end);

      const jobsTableBody = document.getElementById('jobs-table-body');
      jobsTableBody.innerHTML = paginatedJobs.map(job => {
        let duration = 'Not started';
        if (job.startedAt) {
          if (job.completedAt) {
            const durationSec = Math.round(
              (new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000
            );
            duration = durationSec + 's';
          } else {
            duration = 'In progress';
          }
        }

        const isFailed = job.status === 'failed';
        const rowClass = isFailed ? 'job-row-failed clickable' : '';
        const dataAttr = isFailed ? ' data-job-id="' + escapeHtml(job.id) + '"' : '';

        return '<tr class="' + rowClass + '"' + dataAttr + '>' +
          '<td>' + escapeHtml(job.jobType) + '</td>' +
          '<td><span class="status-badge status-' + escapeHtml(job.status) + '">' + escapeHtml(job.status) + '</span></td>' +
          '<td><div class="text-truncate text-small" title="' + escapeHtml(job.url) + '">' + escapeHtml(job.url) + '</div></td>' +
          '<td class="text-small">' + escapeHtml(new Date(job.createdAt).toLocaleString()) + '</td>' +
          '<td class="text-small">' + escapeHtml(duration) + '</td>' +
        '</tr>';
      }).join('');

      // Update pagination controls
      updatePaginationButtons();
    }

    function renderErrorsTable(errors) {
      const start = (currentErrorsPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginatedErrors = errors.slice(start, end);

      const errorsTableBody = document.getElementById('errors-table-body');
      if (errorsTableBody) {
        errorsTableBody.innerHTML = paginatedErrors.map(error => {
          return '<tr>' +
            '<td>' + escapeHtml(error.jobType) + '</td>' +
            '<td><span class="error-badge">' + escapeHtml(error.errorType) + '</span></td>' +
            '<td><div class="text-truncate" title="' + escapeHtml(error.errorMessage) + '">' + escapeHtml(error.errorMessage) + '</div></td>' +
            '<td><div class="text-truncate text-small" title="' + escapeHtml(error.jobUrl) + '">' + escapeHtml(error.jobUrl) + '</div></td>' +
            '<td class="text-small">' + escapeHtml(new Date(error.timestamp).toLocaleString()) + '</td>' +
          '</tr>';
        }).join('');

        // Update pagination controls
        updatePaginationButtons();
      }
    }

    function updateStatsBar(type, stats) {
      if (type === 'jobs') {
        const total = stats.total || 1;
        const completedPct = ((stats.completed / total) * 100).toFixed(0);
        const failedPct = ((stats.failed / total) * 100).toFixed(0);
        const processingPct = ((stats.processing / total) * 100).toFixed(0);
        const pendingPct = ((stats.pending / total) * 100).toFixed(0);

        // Update bar segments 
        const bar = document.getElementById('jobs-stats-bar');
        bar.innerHTML =
          '<div class="stats-segment segment-completed" style="width: ' + completedPct + '%" title="Completed: ' + stats.completed + ' (' + completedPct + '%)"></div>' +
          '<div class="stats-segment segment-processing" style="width: ' + processingPct + '%" title="Processing: ' + stats.processing + ' (' + processingPct + '%)"></div>' +
          '<div class="stats-segment segment-pending" style="width: ' + pendingPct + '%" title="Pending: ' + stats.pending + ' (' + pendingPct + '%)"></div>' +
          '<div class="stats-segment segment-failed" style="width: ' + failedPct + '%" title="Failed: ' + stats.failed + ' (' + failedPct + '%)"></div>';

        // Update legend text
        const section = bar.closest('.stats-section');
        const legendItems = section.querySelectorAll('.legend-item');
        legendItems[0].innerHTML = '<span class="legend-dot segment-completed"></span>Completed ' + stats.completed;
        legendItems[1].innerHTML = '<span class="legend-dot segment-processing"></span>Processing ' + stats.processing;
        legendItems[2].innerHTML = '<span class="legend-dot segment-pending"></span>Pending ' + stats.pending;
        legendItems[3].innerHTML = '<span class="legend-dot segment-failed"></span>Failed ' + stats.failed;

        // Update title
        section.querySelector('.stats-title').textContent = 'Jobs (' + stats.total + ')';
      } else if (type === 'errors') {
        const total = stats.total || 1;
        const networkPct = ((stats.network / total) * 100).toFixed(0);
        const parsingPct = ((stats.parsing / total) * 100).toFixed(0);
        const validationPct = ((stats.validation / total) * 100).toFixed(0);
        const timeoutPct = ((stats.timeout / total) * 100).toFixed(0);
        const unknownPct = ((stats.unknown / total) * 100).toFixed(0);

        // Update bar segments
        const bar = document.getElementById('errors-stats-bar');
        bar.innerHTML =
          '<div class="stats-segment segment-error-network" style="width: ' + networkPct + '%" title="Network: ' + stats.network + ' (' + networkPct + '%)"></div>' +
          '<div class="stats-segment segment-error-parsing" style="width: ' + parsingPct + '%" title="Parsing: ' + stats.parsing + ' (' + parsingPct + '%)"></div>' +
          '<div class="stats-segment segment-error-validation" style="width: ' + validationPct + '%" title="Validation: ' + stats.validation + ' (' + validationPct + '%)"></div>' +
          '<div class="stats-segment segment-error-timeout" style="width: ' + timeoutPct + '%" title="Timeout: ' + stats.timeout + ' (' + timeoutPct + '%)"></div>' +
          '<div class="stats-segment segment-error-unknown" style="width: ' + unknownPct + '%" title="Unknown: ' + stats.unknown + ' (' + unknownPct + '%)"></div>';

        // Update legend text
        const section = bar.closest('.stats-section');
        const legendItems = section.querySelectorAll('.legend-item');
        legendItems[0].innerHTML = '<span class="legend-dot segment-error-network"></span>Network ' + stats.network;
        legendItems[1].innerHTML = '<span class="legend-dot segment-error-parsing"></span>Parsing ' + stats.parsing;
        legendItems[2].innerHTML = '<span class="legend-dot segment-error-validation"></span>Validation ' + stats.validation;
        legendItems[3].innerHTML = '<span class="legend-dot segment-error-timeout"></span>Timeout ' + stats.timeout;
        legendItems[4].innerHTML = '<span class="legend-dot segment-error-unknown"></span>Unknown ' + stats.unknown;

        // Update title
        section.querySelector('.stats-title').textContent = 'Errors (' + stats.total + ')';
      }
    }

    async function fetchAndUpdate() {
      try {
        const btn = document.getElementById('refresh-btn');
        const originalText = btn.textContent;
        btn.textContent = 'loading';
        btn.disabled = true;

        const response = await fetch('/', {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Update stored data
        allJobs = data.jobs;
        allErrors = data.errors;

        // Update stats bars
        updateStatsBar('jobs', data.stats);
        updateStatsBar('errors', data.errorStats);

        // Re-apply current filters
        filterJobs();
        filterErrors();

        document.getElementById('last-refresh').textContent = new Date().toLocaleTimeString();

        btn.textContent = originalText;
        btn.disabled = false;

        console.log('Dashboard updated successfully');
      } catch (error) {
        console.error('Failed to refresh dashboard:', error);
        alert('Failed to refresh dashboard. Check console for details.');

        const btn = document.getElementById('refresh-btn');
        btn.textContent = '↻ Refresh';
        btn.disabled = false;
      }
    }
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}
