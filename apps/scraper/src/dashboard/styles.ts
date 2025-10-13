export const minimalCSS = `
  body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 20px;
    background: #fafafa;
    padding-bottom: 100px;
    color: #171717;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  h2 {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
  }

  /* Stats sections */
  .stats-section {
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  .stats-inline {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stats-title {
    font-size: 14px;
    font-weight: 600;
    color: #171717;
    min-width: 80px;
  }

  .stats-bar-compact {
    display: flex;
    height: 20px;
    width: 200px;
    border-radius: 3px;
    overflow: hidden;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  .stats-segment {
    transition: opacity 0.2s;
    cursor: pointer;
  }

  .stats-segment:hover {
    opacity: 0.8;
  }

  .stats-legend {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #525252;
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  /* Job status colors */
  .segment-completed {
    background: #10b981;
  }

  .segment-failed {
    background: #ef4444;
  }

  .segment-processing {
    background: #a855f7;
  }

  .segment-pending {
    background: #f59e0b;
  }

  /* Error type colors */
  .segment-error-network {
    background: #dc2626;
  }

  .segment-error-parsing {
    background: #ea580c;
  }

  .segment-error-validation {
    background: #d97706;
  }

  .segment-error-timeout {
    background: #ca8a04;
  }

  .segment-error-unknown {
    background: #64748b;
  }

  /* Header filters in table headers */
  .header-filter {
    font-size: 12px;
    font-weight: 600;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    color: inherit;
    width: 100%;
  }

  .header-filter:focus {
    outline: 1px solid #999;
  }

  /* URL search input in header */
  .url-search-header {
    font-size: 12px;
    font-weight: 400;
    border: 1px solid #d4d4d4;
    border-radius: 3px;
    padding: 4px 8px;
    background: white;
    cursor: text;
  }

  .url-search-header::placeholder {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Tables */
  .table-container {
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .table-header {
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  .empty-state {
    padding: 40px;
    text-align: center;
    color: #737373;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  /* (12 rows * 40px per row) */
  tbody {
    display: block;
    min-height: calc(12 * 40px);
    overflow-y: auto;
  }
  /* table rows (including the header) */
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  /* table header row */
  th {
    background: #fafafa;
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  /* table data */
  td {
    padding: 10px 16px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 14px;
  }

  tr:hover {
    background: #fafafa;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }

  .status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  .status-processing {
    background: #e9d5ff;
    color: #6b21a8;
  }

  .status-completed {
    background: #d1fae5;
    color: #065f46;
  }

  .status-failed {
    background: #fee2e2;
    color: #991b1b;
  }

  .error-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    background: #fee2e2;
    color: #991b1b;
  }

  .refresh-controls {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 12px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .refresh-btn {
    background: #171717;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
  }

  .refresh-btn:hover {
    background: #404040;
  }

  label {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  input[type="checkbox"] {
    cursor: pointer;
  }

  .last-refresh {
    font-size: 12px;
    color: #737373;
  }

  .text-truncate {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-small {
    font-size: 12px;
    color: #737373;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid #e5e5e5;
  }

  .pagination-btn {
    background: #171717;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #404040;
  }

  .pagination-btn:disabled {
    background: #d4d4d4;
    cursor: not-allowed;
  }

  .page-info {
    font-size: 13px;
    color: #737373;
    min-width: 100px;
    text-align: center;
  }

  /* Expandable error rows for failed jobs */
  .job-row-failed.clickable {
    cursor: pointer;
  }

  .job-row-failed.clickable:hover {
    background: #fef3c7 !important;
  }

  .error-expansion-row {
    background: #fef9f3 !important;
  }

  .error-expansion-cell {
    padding: 0 !important;
  }

  .error-expansion-content {
    padding: 16px;
    border-left: 3px solid #dc2626;
  }

  .expanded-error {
    margin-bottom: 12px;
    padding: 12px;
    background: white;
    border-radius: 4px;
    border: 1px solid #fee2e2;
  }

  .expanded-error:last-child {
    margin-bottom: 0;
  }

  .expanded-error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .expanded-error-message {
    font-size: 13px;
    color: #404040;
    line-height: 1.5;
  }

  .error-time {
    font-size: 12px;
    color: #737373;
  }

  .no-errors-message {
    padding: 16px;
    text-align: center;
    color: #737373;
    font-style: italic;
  }
`;
