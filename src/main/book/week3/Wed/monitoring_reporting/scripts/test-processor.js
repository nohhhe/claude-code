const fs = require('fs');
const path = require('path');

module.exports = (results) => {
  const timestamp = new Date().toISOString();
  const reportDir = path.join(__dirname, '../reports');
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const testReport = {
    timestamp,
    summary: {
      totalTests: results.numTotalTests,
      passedTests: results.numPassedTests,
      failedTests: results.numFailedTests,
      skippedTests: results.numPendingTests,
      passRate: ((results.numPassedTests / results.numTotalTests) * 100).toFixed(2),
      totalTime: results.testResults.reduce((acc, test) => acc + test.perfStats.runtime, 0)
    },
    coverage: results.coverageMap ? {
      statements: results.coverageMap.getCoverageSummary().statements.pct,
      branches: results.coverageMap.getCoverageSummary().branches.pct,
      functions: results.coverageMap.getCoverageSummary().functions.pct,
      lines: results.coverageMap.getCoverageSummary().lines.pct
    } : null,
    testResults: results.testResults.map(testFile => ({
      testFilePath: testFile.testFilePath.replace(process.cwd(), ''),
      numFailingTests: testFile.numFailingTests,
      numPassingTests: testFile.numPassingTests,
      numPendingTests: testFile.numPendingTests,
      perfStats: testFile.perfStats,
      testResults: testFile.testResults.map(test => ({
        ancestorTitles: test.ancestorTitles,
        title: test.title,
        status: test.status,
        duration: test.duration,
        failureMessages: test.failureMessages
      }))
    }))
  };

  const reportFile = path.join(reportDir, `test-report-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(testReport, null, 2));
  
  const latestFile = path.join(reportDir, 'latest-report.json');
  fs.writeFileSync(latestFile, JSON.stringify(testReport, null, 2));

  updateHistoricalData(testReport);
  
  return results;
};

function updateHistoricalData(report) {
  const historyFile = path.join(__dirname, '../data/test-history.json');
  let history = [];
  
  if (fs.existsSync(historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    } catch (e) {
      console.warn('Failed to read history file:', e.message);
    }
  }
  
  history.push({
    timestamp: report.timestamp,
    passRate: report.summary.passRate,
    totalTests: report.summary.totalTests,
    failedTests: report.summary.failedTests,
    coverage: report.coverage,
    totalTime: report.summary.totalTime
  });
  
  history = history.slice(-50);
  
  const dataDir = path.dirname(historyFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}