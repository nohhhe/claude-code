class TestDashboard {
    constructor() {
        this.charts = {};
        this.currentData = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateLastUpdateTime();
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // 30초마다 자동 새로고침
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    async refreshData() {
        const btn = document.getElementById('refreshBtn');
        btn.disabled = true;
        btn.textContent = '🔄 업데이트 중...';

        await this.loadData();
        this.updateLastUpdateTime();

        btn.disabled = false;
        btn.textContent = '🔄 새로고침';
    }

    async loadData() {
        try {
            console.log('데이터 로드 시작...');

            const [historyResponse, reportResponse, failedTestsResponse] = await Promise.all([
                fetch('/api/test-history'),
                fetch('/api/latest-report'),
                fetch('/api/failed-tests')
            ]);

            console.log('API 응답 상태:', historyResponse.status, reportResponse.status, failedTestsResponse.status);

            const history = await historyResponse.json();
            const latestReport = await reportResponse.json();
            const failedTests = await failedTestsResponse.json();

            console.log('데이터 로드 완료:', {
                historyLength: history.length,
                hasSummary: !!latestReport.summary,
                failedTestsLength: failedTests.length
            });

            this.currentData = {
                history,
                latestReport,
                failedTests
            };

            this.updateSummaryCards();
            console.log('요약 카드 업데이트 완료');

            this.updateCharts();
            console.log('차트 업데이트 완료');

            this.updateTimeStats();
            console.log('시간 통계 업데이트 완료');

            this.updateSlowTestsList();
            console.log('느린 테스트 목록 업데이트 완료');

            this.updateFileStatsList();
            console.log('파일 통계 업데이트 완료');

            this.updateFailedTestsList();
            console.log('실패 테스트 목록 업데이트 완료');

        } catch (error) {
            console.error('데이터 로드 실패:', error);
            console.error('에러 스택:', error.stack);
            this.showError('데이터를 불러오는데 실패했습니다: ' + error.message);
        }
    }

    updateSummaryCards() {
        const { latestReport, history } = this.currentData;
        const previousReport = history[history.length - 2];

        this.updateMetricCard('totalTests', latestReport.summary.totalTests,
            previousReport?.totalTests);
        this.updateMetricCard('passRate', `${latestReport.summary.passRate}%`,
            previousReport?.passRate, '%');
        this.updateMetricCard('failedTests', latestReport.summary.failedTests,
            previousReport?.failedTests);
        this.updateMetricCard('totalTime', `${(latestReport.summary.totalTime / 1000).toFixed(2)}s`,
            previousReport?.totalTime ? (previousReport.totalTime / 1000).toFixed(2) : null, 's');
    }

    updateMetricCard(elementId, currentValue, previousValue, suffix = '') {
        document.getElementById(elementId).textContent = currentValue;

        const changeElement = document.getElementById(`${elementId}Change`);
        if (previousValue !== undefined && previousValue !== null) {
            const current = parseFloat(currentValue.toString().replace(/[^\d.-]/g, ''));
            const previous = parseFloat(previousValue.toString().replace(/[^\d.-]/g, ''));
            const change = current - previous;
            const changePercent = previous !== 0 ? ((change / previous) * 100).toFixed(1) : 0;

            let changeText = '';
            let changeClass = 'neutral';

            if (change > 0) {
                changeText = `▲ +${change.toFixed(elementId === 'totalTime' ? 2 : 0)}${suffix} (+${changePercent}%)`;
                changeClass = elementId === 'failedTests' || elementId === 'totalTime' ? 'negative' : 'positive';
            } else if (change < 0) {
                changeText = `▼ ${change.toFixed(elementId === 'totalTime' ? 2 : 0)}${suffix} (${changePercent}%)`;
                changeClass = elementId === 'failedTests' || elementId === 'totalTime' ? 'positive' : 'negative';
            } else {
                changeText = '변화 없음';
            }

            changeElement.textContent = changeText;
            changeElement.className = `metric-change ${changeClass}`;
        } else {
            changeElement.textContent = '이전 데이터 없음';
            changeElement.className = 'metric-change neutral';
        }
    }

    updateCharts() {
        this.updatePassRateChart();
        this.updateCoverageChart();
        this.updateTimeChart();
        this.updateCoverageDonut();
    }

    updatePassRateChart() {
        const ctx = document.getElementById('passRateChart').getContext('2d');
        const { history } = this.currentData;

        if (this.charts.passRate) {
            this.charts.passRate.destroy();
        }

        const labels = history.map(item => this.formatDate(item.timestamp));
        const data = history.map(item => parseFloat(item.passRate));

        // 목표 라인 (90%)
        const targetLine = new Array(data.length).fill(90);

        this.charts.passRate = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: '통과율 (%)',
                        data,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: data.map(v => v >= 90 ? '#27ae60' : '#e74c3c'),
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: '목표 (90%)',
                        data: targetLine,
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.max(0, Math.min(...data) - 5),
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateCoverageChart() {
        const ctx = document.getElementById('coverageChart').getContext('2d');
        const { history } = this.currentData;

        if (this.charts.coverage) {
            this.charts.coverage.destroy();
        }

        const labels = history.map(item => this.formatDate(item.timestamp));

        this.charts.coverage = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Statements',
                        data: history.map(item => item.coverage?.statements || 0),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'Branches',
                        data: history.map(item => item.coverage?.branches || 0),
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'Functions',
                        data: history.map(item => item.coverage?.functions || 0),
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'Lines',
                        data: history.map(item => item.coverage?.lines || 0),
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateTimeChart() {
        const ctx = document.getElementById('timeChart').getContext('2d');
        const { history } = this.currentData;

        if (this.charts.time) {
            this.charts.time.destroy();
        }

        const labels = history.map(item => this.formatDate(item.timestamp));
        const data = history.map(item => item.totalTime / 1000);
        const avgTime = data.reduce((a, b) => a + b, 0) / data.length;

        this.charts.time = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: '실행 시간 (초)',
                        data,
                        backgroundColor: data.map(time => {
                            if (time > avgTime * 1.2) return 'rgba(231, 76, 60, 0.8)';
                            if (time > avgTime) return 'rgba(243, 156, 18, 0.8)';
                            return 'rgba(39, 174, 96, 0.8)';
                        }),
                        borderColor: data.map(time => {
                            if (time > avgTime * 1.2) return '#e74c3c';
                            if (time > avgTime) return '#f39c12';
                            return '#27ae60';
                        }),
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: avgTime,
                                yMax: avgTime,
                                borderColor: '#3498db',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    display: true,
                                    content: `평균: ${avgTime.toFixed(2)}s`
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '초';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateCoverageDonut() {
        const ctx = document.getElementById('coverageDonut').getContext('2d');
        const { latestReport } = this.currentData;

        if (this.charts.coverageDonut) {
            this.charts.coverageDonut.destroy();
        }

        const coverage = latestReport.coverage || { statements: 0, branches: 0, functions: 0, lines: 0 };
        const avgCoverage = (coverage.statements + coverage.branches + coverage.functions + coverage.lines) / 4;

        this.charts.coverageDonut = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Statements', 'Branches', 'Functions', 'Lines'],
                datasets: [{
                    data: [
                        coverage.statements,
                        coverage.branches,
                        coverage.functions,
                        coverage.lines
                    ],
                    backgroundColor: [
                        '#e74c3c',
                        '#f39c12',
                        '#27ae60',
                        '#9b59b6'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed.toFixed(1) + '%';
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = 'bold 24px Arial';
                    ctx.fillStyle = avgCoverage >= 80 ? '#27ae60' : avgCoverage >= 60 ? '#f39c12' : '#e74c3c';
                    ctx.fillText(avgCoverage.toFixed(1) + '%', centerX, centerY - 10);
                    ctx.font = '12px Arial';
                    ctx.fillStyle = '#666';
                    ctx.fillText('평균 커버리지', centerX, centerY + 15);
                    ctx.restore();
                }
            }]
        });
    }

    updateTimeStats() {
        const { history } = this.currentData;
        const times = history.map(item => item.totalTime / 1000);

        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const max = Math.max(...times);
        const min = Math.min(...times);
        const variance = times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);

        document.getElementById('avgTime').textContent = `${avg.toFixed(2)}s`;
        document.getElementById('maxTime').textContent = `${max.toFixed(2)}s`;
        document.getElementById('minTime').textContent = `${min.toFixed(2)}s`;
        document.getElementById('stdDev').textContent = `±${stdDev.toFixed(2)}s`;
    }

    updateSlowTestsList() {
        const { latestReport } = this.currentData;
        const listContainer = document.getElementById('slowTestsList');

        const slowTests = latestReport.performanceMetrics?.slowestTests || [];

        if (slowTests.length === 0) {
            listContainer.innerHTML = '<div class="no-data">데이터 없음</div>';
            return;
        }

        const html = slowTests.map((test, index) => `
            <div class="slow-test-item">
                <div class="slow-test-rank">#${index + 1}</div>
                <div class="slow-test-info">
                    <div class="slow-test-name">${this.escapeHtml(test.name)}</div>
                    <div class="slow-test-file">${this.escapeHtml(test.file)}</div>
                </div>
                <div class="slow-test-duration ${test.duration > 200 ? 'danger' : test.duration > 100 ? 'warning' : ''}">${test.duration}ms</div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
    }

    updateFileStatsList() {
        const { latestReport } = this.currentData;
        const listContainer = document.getElementById('fileStatsList');

        const fileStats = latestReport.performanceMetrics?.testsByFile || [];

        if (fileStats.length === 0) {
            listContainer.innerHTML = '<div class="no-data">데이터 없음</div>';
            return;
        }

        const html = fileStats.map(file => `
            <div class="file-stat-item">
                <div class="file-stat-info">
                    <div class="file-stat-name">${this.escapeHtml(file.file)}</div>
                    <div class="file-stat-details">
                        <span class="file-stat-count">${file.count}개 테스트</span>
                        <span class="file-stat-duration">${(file.duration / 1000).toFixed(2)}s</span>
                    </div>
                </div>
                <div class="file-stat-progress">
                    <div class="progress-bar">
                        <div class="progress-fill ${file.passRate >= 90 ? 'success' : file.passRate >= 70 ? 'warning' : 'danger'}"
                             style="width: ${file.passRate}%"></div>
                    </div>
                    <span class="progress-label">${file.passRate.toFixed(1)}%</span>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
    }

    updateFailedTestsList() {
        const { failedTests } = this.currentData;
        const listContainer = document.getElementById('failedTestsList');
        const countBadge = document.getElementById('failedTestCount');

        countBadge.textContent = failedTests.length;

        if (failedTests.length === 0) {
            listContainer.innerHTML = '<div class="no-data">🎉 모든 테스트가 통과했습니다!</div>';
            return;
        }

        const failedTestsHtml = failedTests.map(test => `
            <div class="failed-test-item">
                <div class="test-info">
                    <div>
                        <div class="test-suite">${this.escapeHtml(test.suite)}</div>
                        <div class="test-name">${this.escapeHtml(test.test)}</div>
                    </div>
                    <div class="test-duration">${test.duration}ms</div>
                </div>
                <div class="test-file">${this.escapeHtml(test.file)}</div>
                <div class="test-error">${this.escapeHtml(test.error)}</div>
            </div>
        `).join('');

        listContainer.innerHTML = failedTestsHtml;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    updateLastUpdateTime() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent =
            `마지막 업데이트: ${now.toLocaleString('ko-KR')}`;
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showError(message) {
        console.error(message);
        const listContainer = document.getElementById('failedTestsList');
        listContainer.innerHTML = `<div class="loading" style="color: #e74c3c;">❌ ${message}</div>`;
    }
}

// 대시보드 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TestDashboard();
});
