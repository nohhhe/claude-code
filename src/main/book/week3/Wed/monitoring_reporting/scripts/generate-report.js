const fs = require('fs');
const path = require('path');

function generateSampleData() {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const now = new Date();
  const history = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const passRate = 85 + Math.random() * 10;
    const totalTests = Math.floor(45 + Math.random() * 10);
    const failedTests = Math.floor((100 - passRate) * totalTests / 100);
    
    history.push({
      timestamp: date.toISOString(),
      passRate: passRate.toFixed(2),
      totalTests,
      failedTests,
      coverage: {
        statements: Math.floor(75 + Math.random() * 20),
        branches: Math.floor(70 + Math.random() * 20), 
        functions: Math.floor(80 + Math.random() * 15),
        lines: Math.floor(78 + Math.random() * 17)
      },
      totalTime: Math.floor(5000 + Math.random() * 3000)
    });
  }
  
  fs.writeFileSync(path.join(dataDir, 'test-history.json'), JSON.stringify(history, null, 2));

  const latestReport = {
    timestamp: now.toISOString(),
    summary: {
      totalTests: 52,
      passedTests: 47,
      failedTests: 5,
      skippedTests: 0,
      passRate: '90.38',
      totalTime: 6847
    },
    coverage: {
      statements: 89.5,
      branches: 85.2,
      functions: 92.1,
      lines: 88.7
    },
    testResults: [
      {
        testFilePath: './tests/user.test.js',
        numFailingTests: 2,
        numPassingTests: 8,
        numPendingTests: 0,
        perfStats: { runtime: 1245 },
        testResults: [
          {
            ancestorTitles: ['User Service'],
            title: 'should create user successfully',
            status: 'passed',
            duration: 45
          },
          {
            ancestorTitles: ['User Service'],  
            title: 'should validate email format',
            status: 'failed',
            duration: 78,
            failureMessages: ['Expected email validation to fail for invalid format']
          }
        ]
      },
      {
        testFilePath: './tests/auth.test.js',
        numFailingTests: 1,
        numPassingTests: 12,
        numPendingTests: 0,
        perfStats: { runtime: 2134 },
        testResults: [
          {
            ancestorTitles: ['Authentication'],
            title: 'should login with valid credentials',
            status: 'passed',
            duration: 123
          },
          {
            ancestorTitles: ['Authentication'],
            title: 'should handle token expiration',
            status: 'failed', 
            duration: 67,
            failureMessages: ['Token expiration not handled correctly']
          }
        ]
      }
    ]
  };

  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(reportsDir, 'latest-report.json'), JSON.stringify(latestReport, null, 2));
  
  console.log('✅ 샘플 테스트 데이터가 생성되었습니다.');
  console.log('📊 대시보드를 보려면: npm start 후 http://localhost:3000 접속');
}

if (require.main === module) {
  generateSampleData();
}

module.exports = generateSampleData;