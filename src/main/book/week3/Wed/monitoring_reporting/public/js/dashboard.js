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
            const [historyResponse, reportResponse, failedTestsResponse] = await Promise.all([
                fetch('/api/test-history'),
                fetch('/api/latest-report'), 
                fetch('/api/failed-tests')
            ]);

            const history = await historyResponse.json();
            const latestReport = await reportResponse.json();
            const failedTests = await failedTestsResponse.json();

            this.currentData = {
                history,
                latestReport,
                failedTests
            };

            this.updateSummaryCards();
            this.updateCharts();
            this.updateFailedTestsList();

        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.showError('데이터를 불러오는데 실패했습니다.');
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
        this.updateMetricCard('totalTime', `${(latestReport.summary.totalTime / 1000).toFixed(2)}초`,
            previousReport?.totalTime ? (previousReport.totalTime / 1000).toFixed(2) : null, '초');
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

        this.charts.passRate = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: '통과율 (%)',
                    data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                        tension: 0.4
                    },
                    {
                        label: 'Branches',
                        data: history.map(item => item.coverage?.branches || 0),
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Functions',
                        data: history.map(item => item.coverage?.functions || 0),
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Lines',
                        data: history.map(item => item.coverage?.lines || 0),
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
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

        this.charts.time = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: '실행 시간 (초)',
                    data,
                    backgroundColor: data.map(time => {
                        if (time > 8) return 'rgba(231, 76, 60, 0.8)';
                        if (time > 6) return 'rgba(243, 156, 18, 0.8)';
                        return 'rgba(39, 174, 96, 0.8)';
                    }),
                    borderColor: data.map(time => {
                        if (time > 8) return '#e74c3c';
                        if (time > 6) return '#f39c12';
                        return '#27ae60';
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
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
                        <div class="test-suite">${test.suite}</div>
                        <div class="test-name">${test.test}</div>
                    </div>
                    <div class="test-duration">${test.duration}ms</div>
                </div>
                <div class="test-file">${test.file}</div>
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

document.addEventListener('DOMContentLoaded', () => {
    new TestDashboard();
});