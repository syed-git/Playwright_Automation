const fs = require('fs');
const path = require('path');

// Read JSON report
const jsonReportPath = path.join(__dirname, '../test-results/results.json');
const reportData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));

// Helper function to format duration
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
}

// Extract test results
function extractTestResults() {
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const testResults = [];
  
  reportData.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        totalTests++;
        const result = test.results[0];
        
        if (result.status === 'passed') {
          passed++;
        } else if (result.status === 'failed') {
          failed++;
        } else if (result.status === 'skipped') {
          skipped++;
        }
        
        testResults.push({
          suite: suite.title,
          title: spec.title,
          status: result.status,
          duration: result.duration,
          startTime: result.startTime,
          project: test.projectName,
          attachments: result.attachments || []
        });
      });
    });
  });
  
  return { totalTests, passed, failed, skipped, testResults };
}

// Get OS and platform info
function getSystemInfo() {
  const os = require('os');
  return {
    platform: os.platform(),
    arch: os.arch(),
    version: os.version ? os.version() : 'Unknown'
  };
}

// Generate HTML
function generateHTML() {
  const { totalTests, passed, failed, skipped, testResults } = extractTestResults();
  const systemInfo = getSystemInfo();
  const stats = reportData.stats;
  const projects = reportData.config.projects.map(p => p.name);
  
  const passPercentage = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) : 0;
  
  // Generate SVG donut chart
  function generateDonutChart(passed, failed, skipped, total) {
    const passPerc = (passed / total) * 360;
    const failPerc = (failed / total) * 360;
    const skipPerc = (skipped / total) * 360;
    
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    
    const passOffset = circumference * (1 - (passed / total));
    const failOffset = circumference * (1 - ((passed + failed) / total));
    const skipOffset = circumference * (1 - 1);
    
    return `
      <svg width="120" height="120" viewBox="0 0 120 120" style="transform: rotate(-90deg);">
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#f0f0f0" stroke-width="10"></circle>
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#4CAF50" stroke-width="10" 
                stroke-dasharray="${circumference * (passed / total)} ${circumference}"
                style="stroke-linecap: round;"></circle>
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#f44336" stroke-width="10" 
                stroke-dasharray="${circumference * (failed / total)} ${circumference}"
                stroke-dashoffset="-${circumference * (passed / total)}"
                style="stroke-linecap: round;"></circle>
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#FFC107" stroke-width="10" 
                stroke-dasharray="${circumference * (skipped / total)} ${circumference}"
                stroke-dashoffset="-${circumference * ((passed + failed) / total)}"
                style="stroke-linecap: round;"></circle>
        <text x="60" y="65" text-anchor="middle" font-size="20" font-weight="bold" fill="#333" style="transform: rotate(90deg); transform-origin: 60px 60px;">${passPercentage}%</text>
      </svg>
    `;
  }
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playwright Test Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --primary-light: #818cf8;
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
      --dark: #0f172a;
      --light: #f9fafb;
      --bg-dark: #0f172a;
      --bg-darker: #010616;
      --bg-card: #1a1f3a;
      --text-primary: #f1f5f9;
      --text-secondary: #cbd5e1;
      --border: #334155;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
      --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 50%, #111827 100%);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 24px;
      min-height: 100vh;
    }
    
    .container {
      background: var(--bg-card);
      border-radius: 16px;
      box-shadow: var(--shadow-lg);
      max-width: 1600px;
      margin: 0 auto;
      overflow: hidden;
      animation: slideIn 0.6s ease;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: -30%;
      left: -5%;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      animation: float 8s ease-in-out infinite reverse;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(20px); }
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
    }
    
    .header-left {
      flex: 1;
      text-align: left;
    }
    
    .header-chart {
      flex-shrink: 0;
      width: 200px;
      height: 200px;
    }
    
    .header h1 {
      font-size: 3em;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -1px;
    }
    
    .header p {
      font-size: 1.15em;
      opacity: 0.95;
      font-weight: 300;
      letter-spacing: 0.5px;
    }
    
    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      padding: 48px 40px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(26, 31, 58, 0.8) 100%);
      border-bottom: 1px solid var(--border);
    }
    
    .summary-card {
      background: linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
      padding: 28px;
      border-radius: 12px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .summary-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    
    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary);
    }
    
    .summary-card.passed::before {
      background: linear-gradient(90deg, var(--success) 0%, #059669 100%);
    }
    
    .summary-card.failed::before {
      background: linear-gradient(90deg, var(--danger) 0%, #dc2626 100%);
    }
    
    .summary-card.skipped::before {
      background: linear-gradient(90deg, var(--warning) 0%, #d97706 100%);
    }
    
    .summary-card.total::before {
      background: linear-gradient(90deg, var(--primary) 0%, #4f46e5 100%);
    }
    
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    
    .card-info h3 {
      color: var(--text-secondary);
      font-size: 0.9em;
      text-transform: uppercase;
      margin-bottom: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .card-number {
      font-size: 2.8em;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 8px;
    }
    
    .card-percentage {
      font-size: 0.9em;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .chart-circle {
      flex-shrink: 0;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Progress Bar */
    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(148, 163, 184, 0.2);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 12px;
      position: relative;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
      transition: width 0.6s ease;
      border-radius: 3px;
      position: relative;
      overflow: hidden;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    /* Tab Navigation */
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--border);
      padding-bottom: 12px;
    }
    
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 8px 16px;
      font-size: 0.95em;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      margin-bottom: -14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .tab-btn:hover {
      color: var(--text-primary);
    }
    
    .tab-btn.active {
      color: var(--primary-light);
      border-bottom-color: var(--primary);
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    /* Pie Chart Container */
    .chart-container {
      position: relative;
      width: 300px;
      height: 300px;
      margin: 0 auto 30px;
    }
    
    .pie-chart-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
      z-index: 10;
    }
    
    .pie-chart-text .percentage {
      font-size: 2.5em;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }
    
    .pie-chart-text .label {
      font-size: 0.9em;
      color: var(--text-secondary);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    
    .stat-box {
      background: linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--border);
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .stat-box:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    
    .stat-box .value {
      font-size: 1.8em;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .stat-box .label {
      font-size: 0.85em;
      color: var(--text-secondary);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .stat-box.passed .value { color: #6ee7b7; }
    .stat-box.failed .value { color: #fca5a5; }
    .stat-box.skipped .value { color: #fcd34d; }
    
    /* Sections */
    .section {
      padding: 48px 40px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(26, 31, 58, 0.3) 100%);
    }
    
    .section:last-child {
      border-bottom: none;
    }
    
    .section h2 {
      color: var(--text-primary);
      margin-bottom: 28px;
      font-size: 1.6em;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: -0.5px;
    }
    
    .section h2::before {
      content: '';
      width: 4px;
      height: 28px;
      background: linear-gradient(180deg, var(--primary) 0%, var(--primary-light) 100%);
      border-radius: 2px;
    }
    
    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .info-item {
      background: linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid var(--border);
      transition: all 0.3s ease;
    }
    
    .info-item:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    
    .info-item label {
      color: var(--text-secondary);
      font-size: 0.85em;
      text-transform: uppercase;
      font-weight: 700;
      display: block;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    
    .info-item value {
      color: var(--text-primary);
      font-size: 1.15em;
      font-weight: 600;
      word-break: break-word;
    }
    
    /* Browser Tags */
    .browser-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    
    .browser-tag {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%);
      color: #a5b4fc;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 600;
      border: 1px solid rgba(99, 102, 241, 0.4);
      transition: all 0.2s ease;
    }
    
    .browser-tag:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(118, 75, 162, 0.25) 100%);
    }
    
    /* Table */
    .table-wrapper {
      overflow-x: auto;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    table thead {
      background: linear-gradient(90deg, rgba(26, 31, 58, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
    }
    
    table th {
      padding: 14px 16px;
      text-align: left;
      font-weight: 700;
      color: var(--text-primary);
      border-bottom: 2px solid var(--border);
      font-size: 0.9em;
      letter-spacing: 0.5px;
    }
    
    table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      font-size: 0.95em;
      color: var(--text-secondary);
    }
    
    table tbody tr {
      transition: all 0.2s ease;
    }
    
    table tbody tr:hover {
      background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
    
    table tbody tr td {
      color: var(--text-primary);
    }
    
    /* Expandable Rows */
    .expandable-row {
      cursor: pointer;
      user-select: none;
    }
    
    .expandable-row:hover {
      background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%) !important;
    }
    
    .expand-toggle {
      display: inline-block;
      width: 20px;
      text-align: center;
      transition: transform 0.3s ease;
      cursor: pointer;
      color: var(--primary-light);
      font-weight: bold;
    }
    
    .expand-toggle.expanded {
      transform: rotate(90deg);
    }
    
    .details-row {
      display: none;
    }
    
    .details-row.expanded {
      display: table-row;
    }
    
    .details-cell {
      padding: 20px !important;
      background: rgba(26, 31, 58, 0.6) !important;
      border: none !important;
    }
    
    .details-content {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
      padding: 20px;
      border-radius: 8px;
      border-left: 3px solid var(--primary);
    }
    
    .detail-item {
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
    }
    
    .detail-label {
      font-weight: 600;
      color: var(--primary-light);
      min-width: 120px;
      text-transform: uppercase;
      font-size: 0.85em;
      letter-spacing: 0.5px;
    }
    
    .detail-value {
      color: var(--text-secondary);
      word-break: break-word;
    }
    
    table tbody tr:last-child td {
      border-bottom: none;
    }
    
    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-badge.passed {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    
    .status-badge.failed {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.4);
    }
    
    .status-badge.skipped {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 100%);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }
    
    /* Screenshots */
    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    
    .screenshot-item {
      background: linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .screenshot-item:hover {
      box-shadow: var(--shadow);
      transform: translateY(-4px);
      border-color: var(--primary);
    }
    
    .screenshot-item img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      display: block;
      opacity: 0.9;
      transition: opacity 0.2s ease;
    }
    
    .screenshot-item:hover img {
      opacity: 1;
    }
    
    .screenshot-item p {
      padding: 8px;
      font-size: 0.85em;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    /* Footer */
    .footer {
      background: linear-gradient(135deg, rgba(26, 31, 58, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%);
      padding: 28px 40px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.95em;
      border-top: 1px solid var(--border);
      font-weight: 500;
    }
    
    .footer p {
      margin: 0;
    }
    
    /* Utilities */
    .text-muted {
      color: #64748b;
    }
    
    .gap-2 {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .duration-badge {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%);
      color: #a5b4fc;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9em;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    
    .suite-badge {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%);
      color: #d8b4fe;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 600;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .summary-card {
      animation: fadeIn 0.6s ease forwards;
    }
    
    .summary-card:nth-child(1) { animation-delay: 0.1s; }
    .summary-card:nth-child(2) { animation-delay: 0.2s; }
    .summary-card:nth-child(3) { animation-delay: 0.3s; }
    .summary-card:nth-child(4) { animation-delay: 0.4s; }
    
    /* Responsive */
    @media (max-width: 768px) {
      body {
        padding: 12px;
      }
      
      .header {
        padding: 40px 24px;
      }
      
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .header-left {
        text-align: center;
      }
      
      .header-chart {
        width: 150px;
        height: 150px;
        margin: 0 auto;
      }
      
      .header h1 {
        font-size: 2em;
      }
      
      .summary-grid {
        padding: 24px;
        gap: 16px;
      }
      
      .section {
        padding: 24px;
      }
      
      .card-content {
        flex-direction: column;
        text-align: center;
      }
      
      .chart-circle {
        width: 100px;
        height: 100px;
      }
      
      table {
        font-size: 0.85em;
      }
      
      table th, table td {
        padding: 10px 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>🎭 Test Report</h1>
          <p>Comprehensive Playwright Automation Results</p>
        </div>
        <div class="header-chart">
          <canvas id="headerChart" width="200" height="200"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card total">
        <div class="card-content">
          <div class="card-info">
            <h3>Total Tests</h3>
            <div class="card-number">${totalTests}</div>
            <div class="card-percentage">execution count</div>
          </div>
          <div class="chart-circle">
            <div style="font-size: 2.5em; font-weight: 800; color: var(--primary);">${totalTests}</div>
          </div>
        </div>
      </div>
      
      <div class="summary-card passed">
        <div class="card-content">
          <div class="card-info">
            <h3>✓ Passed</h3>
            <div class="card-number">${passed}</div>
            <div class="card-percentage">${((passed / totalTests) * 100).toFixed(2)}% success</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((passed / totalTests) * 100).toFixed(2)}%; background: linear-gradient(90deg, var(--success) 0%, #059669 100%);"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary-card failed">
        <div class="card-content">
          <div class="card-info">
            <h3>✕ Failed</h3>
            <div class="card-number">${failed}</div>
            <div class="card-percentage">${((failed / totalTests) * 100).toFixed(2)}% failed</div>
            ${failed > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: 100%; background: linear-gradient(90deg, var(--danger) 0%, #dc2626 100%);"></div></div>` : '<div class="progress-bar"><div class="progress-fill" style="width: 0%;"></div></div>'}
          </div>
        </div>
      </div>
      
      <div class="summary-card skipped">
        <div class="card-content">
          <div class="card-info">
            <h3>⊝ Skipped</h3>
            <div class="card-number">${skipped}</div>
            <div class="card-percentage">${((skipped / totalTests) * 100).toFixed(2)}% skipped</div>
            ${skipped > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: 100%; background: linear-gradient(90deg, var(--warning) 0%, #d97706 100%);"></div></div>` : '<div class="progress-bar"><div class="progress-fill" style="width: 0%;"></div></div>'}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Execution Information -->
    <div class="section">
      <h2>📊 Execution Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <label>Total Duration</label>
          <value>${formatDuration(stats.duration)}</value>
        </div>
        <div class="info-item">
          <label>Start Time</label>
          <value>${formatDate(stats.startTime)}</value>
        </div>
        <div class="info-item">
          <label>Platform</label>
          <value>${systemInfo.platform.charAt(0).toUpperCase() + systemInfo.platform.slice(1)} (${systemInfo.arch})</value>
        </div>
        <div class="info-item">
          <label>Environment</label>
          <value>Playwright v${reportData.config.version}</value>
        </div>
        <div class="info-item">
          <label>Browsers Tested</label>
          <value>
            <div class="browser-tags">
              ${projects.map(p => `<span class="browser-tag">${p.charAt(0).toUpperCase() + p.slice(1)}</span>`).join('')}
            </div>
          </value>
        </div>
        <div class="info-item">
          <label>Test Directory</label>
          <value>${reportData.config.rootDir.split('/').pop()}</value>
        </div>
      </div>
    </div>
    
    <!-- Test Results Table -->
    <div class="section">
      <h2>🧪 Test Results</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 30px;"></th>
              <th>Suite</th>
              <th>Test Name</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Browser</th>
              <th>Start Time</th>
            </tr>
          </thead>
          <tbody>
            ${testResults.map((test, idx) => {
              const statusColor = test.status === 'passed' ? 'passed' : test.status === 'failed' ? 'failed' : 'skipped';
              return `
                <tr class="expandable-row" onclick="toggleTestDetails(${idx})">
                  <td><span class="expand-toggle" data-idx="${idx}">▶</span></td>
                  <td><span class="suite-badge">${test.suite.split('\\\\').pop().split('/').pop().replace('.spec.ts', '')}</span></td>
                  <td style="color: var(--text-primary); font-weight: 500;">${test.title}</td>
                  <td><span class="status-badge ${statusColor}">${test.status}</span></td>
                  <td><span class="duration-badge">${formatDuration(test.duration)}</span></td>
                  <td><span class="browser-tag">${test.project}</span></td>
                  <td class="text-muted">${formatDate(test.startTime)}</td>
                </tr>
                <tr class="details-row" data-idx="${idx}">
                  <td colspan="7" class="details-cell">
                    <div class="details-content">
                      <div class="detail-item">
                        <span class="detail-label">Test Complete Path:</span>
                        <span class="detail-value">${test.suite}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value"><span class="status-badge ${statusColor}">${test.status}</span></span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${formatDuration(test.duration)}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Browser:</span>
                        <span class="detail-value">${test.project}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Started At:</span>
                        <span class="detail-value">${formatDate(test.startTime)}</span>
                      </div>
                      ${test.attachments.length > 0 ? `
                      <div class="detail-item" style="flex-direction: column; gap: 8px;">
                        <span class="detail-label">Attachments:</span>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                          ${test.attachments
                            .map(att => att.contentType && att.contentType.includes('image') 
                              ? `<img src="${att.path}" alt="Attachment" style="max-width: 150px; border-radius: 6px; border: 1px solid var(--border);">` 
                              : '')
                            .join('')}
                        </div>
                      </div>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <script>
      function toggleTestDetails(idx) {
        const toggle = document.querySelector(\`.expand-toggle[data-idx="\${idx}"]\`);
        const detailsRow = document.querySelector(\`.details-row[data-idx="\${idx}"]\`);
        toggle.classList.toggle('expanded');
        detailsRow.classList.toggle('expanded');
      }
      
      // Initialize header chart
      const headerCtx = document.getElementById('headerChart').getContext('2d');
      new Chart(headerCtx, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed', 'Skipped'],
          datasets: [{
            data: [${passed}, ${failed}, ${skipped}],
            backgroundColor: ['#6ee7b7', '#fca5a5', '#fcd34d'],
            borderColor: ['rgba(110, 231, 183, 0.15)', 'rgba(252, 165, 165, 0.15)', 'rgba(252, 211, 77, 0.15)'],
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#cbd5e1',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              borderWidth: 1,
              padding: 10,
              titleFont: { size: 12, weight: 'bold' },
              bodyFont: { size: 11 }
            }
          }
        }
      });
    </script>
    
    <!-- Screenshots Section -->
    ${testResults.some(test => test.attachments.length > 0) ? `
    <div class="section">
      <h2>📸 Screenshots</h2>
      <div class="screenshots-grid">
        ${testResults
          .filter(test => test.attachments.length > 0)
          .flatMap(test =>
            test.attachments
              .filter(att => att.contentType && att.contentType.includes('image'))
              .map(att => `
                <div class="screenshot-item">
                  <img src="${att.path}" alt="Screenshot">
                  <p>${test.title.substring(0, 30)}...</p>
                </div>
              `)
          )
          .join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      <p>📅 Report generated on ${new Date().toLocaleString()} | 🎭 Playwright v${reportData.config.version} | ✨ Automated Test Summary</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return html;
}

// Write HTML report
const outputPath = path.join(__dirname, '../playwright-report/custom-report.html');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, generateHTML(), 'utf8');
console.log(`✅ HTML Report generated at: ${outputPath}`);
