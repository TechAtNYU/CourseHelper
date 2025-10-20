// Dashboard client-side JavaScript
// Configured Wrangler to serve as a static asset

const REFRESH_INTERVAL = 30000; // 30 seconds
const ITEMS_PER_PAGE = 12;
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
