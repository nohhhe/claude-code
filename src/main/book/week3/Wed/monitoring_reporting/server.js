const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/test-history', (req, res) => {
  try {
    const historyPath = path.join(__dirname, 'data', 'test-history.json');
    if (fs.existsSync(historyPath)) {
      const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      res.json(history);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading test history:', error);
    res.status(500).json({ error: 'Failed to read test history' });
  }
});

app.get('/api/latest-report', (req, res) => {
  try {
    const reportPath = path.join(__dirname, 'reports', 'latest-report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      res.json(report);
    } else {
      res.status(404).json({ error: 'No test report found' });
    }
  } catch (error) {
    console.error('Error reading latest report:', error);
    res.status(500).json({ error: 'Failed to read latest report' });
  }
});

app.get('/api/coverage-trend', (req, res) => {
  try {
    const historyPath = path.join(__dirname, 'data', 'test-history.json');
    if (fs.existsSync(historyPath)) {
      const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      const coverageTrend = history.map(item => ({
        timestamp: item.timestamp,
        statements: item.coverage?.statements || 0,
        branches: item.coverage?.branches || 0,
        functions: item.coverage?.functions || 0,
        lines: item.coverage?.lines || 0
      }));
      res.json(coverageTrend);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading coverage trend:', error);
    res.status(500).json({ error: 'Failed to read coverage trend' });
  }
});

app.get('/api/failed-tests', (req, res) => {
  try {
    const reportPath = path.join(__dirname, 'reports', 'latest-report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const failedTests = [];
      
      report.testResults?.forEach(testFile => {
        testFile.testResults?.forEach(test => {
          if (test.status === 'failed') {
            failedTests.push({
              file: testFile.testFilePath,
              suite: test.ancestorTitles.join(' > '),
              test: test.title,
              duration: test.duration,
              error: test.failureMessages?.join('\n') || 'No error message'
            });
          }
        });
      });
      
      res.json(failedTests);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading failed tests:', error);
    res.status(500).json({ error: 'Failed to read failed tests' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 테스트 모니터링 대시보드가 http://localhost:${PORT}에서 실행 중입니다.`);
});