// ========== CONFIGURATION ==========
const THINGSPEAK_CHANNEL_ID = '2944234';
const THINGSPEAK_READ_API_KEY = 'Y23QWWN6OI2NLQ5E';
// ===================================

let currentTimeRange = '24h';
let showTrendline = false;
let charts = {};
let lastFeeds = null; // cached for trendline toggle without refetch

// Time range configurations
// Your sensor sends data every ~1 minute (~1,422 entries/day).
// ThingSpeak caps responses at 8,000 entries, so longer ranges need
// the 'average' parameter to downsample and stay under the cap.
const timeRanges = {
    '24h': { days: 1,   average: 0,    label: '24 Hours' },     // ~1,422 pts (raw, no averaging)
    '7d':  { days: 7,   average: 10,   label: '7 Days' },       // ~1,008 pts (10-min averages)
    '30d': { days: 30,  average: 60,   label: '30 Days' },      // ~720 pts (hourly averages)
    '1y':  { days: 365, average: 1440, label: '1 Year' }        // ~365 pts (daily averages)
};

// Chart color definitions per sensor
const chartColors = {
    co2:      { border: 'rgb(75, 192, 192)',  bg: 'rgba(75, 192, 192, 0.1)' },
    temp:     { border: 'rgb(255, 99, 132)',  bg: 'rgba(255, 99, 132, 0.1)' },
    humidity: { border: 'rgb(54, 162, 235)',  bg: 'rgba(54, 162, 235, 0.1)' },
    voc:      { border: 'rgb(153, 102, 255)', bg: 'rgba(153, 102, 255, 0.1)' },
    nox:      { border: 'rgb(255, 159, 64)',  bg: 'rgba(255, 159, 64, 0.1)' },
    pm25:     { border: 'rgb(255, 206, 86)',  bg: 'rgba(255, 206, 86, 0.1)' },
    pm10:     { border: 'rgb(76, 175, 80)',   bg: 'rgba(76, 175, 80, 0.1)' },
    pm1:      { border: 'rgb(121, 85, 72)',   bg: 'rgba(121, 85, 72, 0.1)' }
};

// Field mapping: ThingSpeak field → chart key
const fieldMap = [
    { field: 'field1', key: 'co2',      chartId: 'co2Chart',      label: 'CO2 (ppm)',          decimals: 0, elemId: 'currentCo2' },
    { field: 'field2', key: 'temp',     chartId: 'tempChart',     label: 'Temperature (\u00B0C)', decimals: 1, elemId: 'currentTemp' },
    { field: 'field3', key: 'humidity', chartId: 'humidityChart', label: 'Humidity (%)',        decimals: 1, elemId: 'currentHumidity' },
    { field: 'field4', key: 'voc',      chartId: 'vocChart',      label: 'VOC Index',          decimals: 0, elemId: 'currentVoc' },
    { field: 'field5', key: 'nox',      chartId: 'noxChart',      label: 'NOx Index',          decimals: 0, elemId: 'currentNox' },
    { field: 'field6', key: 'pm25',     chartId: 'pm25Chart',     label: 'PM2.5 (\u03BCg/m\u00B3)', decimals: 1, elemId: 'currentPm25' },
    { field: 'field7', key: 'pm10',     chartId: 'pm10Chart',     label: 'PM10 (\u03BCg/m\u00B3)',  decimals: 1, elemId: 'currentPm10' },
    { field: 'field8', key: 'pm1',      chartId: 'pm1Chart',      label: 'PM1.0 (\u03BCg/m\u00B3)', decimals: 1, elemId: 'currentPm1' }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadData();

    // Auto-refresh every 5 minutes
    setInterval(() => {
        loadData();
    }, 5 * 60 * 1000);
});

function initializeEventListeners() {
    document.querySelectorAll('.range-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTimeRange = e.target.dataset.range;
            loadData();
        });
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadData();
    });

    document.getElementById('trendlineBtn').addEventListener('click', (e) => {
        showTrendline = !showTrendline;
        e.target.classList.toggle('active', showTrendline);
        if (lastFeeds) {
            updateCharts(lastFeeds);
        }
    });
}

async function loadData() {
    const range = timeRanges[currentTimeRange];
    const url = buildThingSpeakURL(range.days, range.average);

    try {
        document.getElementById('lastUpdate').textContent = 'Loading...';

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();

        if (!data.feeds || data.feeds.length === 0) {
            throw new Error('No data available');
        }

        lastFeeds = data.feeds;
        updateCurrentValues(data.feeds[data.feeds.length - 1]);
        updateCharts(data.feeds);
        updateStatusIndicators(data.feeds[data.feeds.length - 1]);
        updateLastUpdateTime(data.feeds[data.feeds.length - 1].created_at);

    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('lastUpdate').textContent = 'Error loading data';
    }
}

function buildThingSpeakURL(days, average) {
    let url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?days=${days}`;
    if (average > 0) {
        url += `&average=${average}`;
    }
    if (THINGSPEAK_READ_API_KEY) {
        url += `&api_key=${THINGSPEAK_READ_API_KEY}`;
    }
    return url;
}

function updateCurrentValues(latestData) {
    fieldMap.forEach(f => {
        const el = document.getElementById(f.elemId);
        if (el) {
            el.textContent = latestData[f.field]
                ? parseFloat(latestData[f.field]).toFixed(f.decimals)
                : '--';
        }
    });
}

function updateCharts(feeds) {
    const labels = feeds.map(feed => new Date(feed.created_at));

    fieldMap.forEach(f => {
        const data = feeds.map(feed => feed[f.field] ? parseFloat(feed[f.field]) : null);
        const color = chartColors[f.key];
        createOrUpdateChart(f.chartId, labels, {
            label: f.label,
            data: data,
            borderColor: color.border,
            backgroundColor: color.bg
        });
    });
}

function createOrUpdateChart(chartId, labels, dataset) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (charts[chartId]) {
        charts[chartId].destroy();
    }

    const datasets = [{
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5
    }];

    if (showTrendline) {
        const trendData = computeLinearTrend(dataset.data);
        datasets.push({
            label: 'Trend',
            data: trendData,
            borderColor: 'rgba(255, 0, 0, 0.6)',
            borderWidth: 2,
            borderDash: [8, 4],
            pointRadius: 0,
            fill: false,
            tension: 0
        });
    }

    charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    callbacks: {
                        title: function(context) {
                            const date = new Date(context[0].label);
                            return date.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        tooltipFormat: 'MMM dd, yyyy HH:mm',
                        displayFormats: getTimeDisplayFormat()
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Compute linear regression trendline (least squares)
function computeLinearTrend(data) {
    const valid = [];
    data.forEach((v, i) => {
        if (v !== null && !isNaN(v)) {
            valid.push({ x: i, y: v });
        }
    });

    if (valid.length < 2) return data.map(() => null);

    const n = valid.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (const p of valid) {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumXX += p.x * p.x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((v, i) => {
        return parseFloat((slope * i + intercept).toFixed(4));
    });
}

function getTimeDisplayFormat() {
    switch (currentTimeRange) {
        case '24h':
            return { hour: 'HH:mm', minute: 'HH:mm' };
        case '7d':
            return { day: 'MMM dd', hour: 'MMM dd HH:mm' };
        case '30d':
            return { hour: 'MMM dd', day: 'MMM dd', week: 'MMM dd' };
        case '1y':
            return { month: 'MMM yyyy', day: 'MMM dd' };
        default:
            return { day: 'MMM dd' };
    }
}

function updateStatusIndicators(latestData) {
    updateStatus('co2', parseFloat(latestData.field1 || 0));
    updateStatus('voc', parseFloat(latestData.field4 || 0));
    updateStatus('nox', parseFloat(latestData.field5 || 0));
    updateStatus('pm25', parseFloat(latestData.field6 || 0));
    updateStatus('pm10', parseFloat(latestData.field7 || 0));
}

function updateStatus(type, value) {
    const statusElement = document.getElementById(`${type}-status`);
    if (!statusElement) return;

    let status = 'Unknown';
    let className = '';

    if (type === 'co2') {
        if (value < 800) {
            status = 'Excellent';
            className = 'excellent';
        } else if (value < 1000) {
            status = 'Good';
            className = 'good';
        } else if (value < 1500) {
            status = 'Moderate';
            className = 'moderate';
        } else {
            status = 'Poor';
            className = 'poor';
        }
    } else if (type === 'voc' || type === 'nox') {
        if (value < 50) {
            status = 'Excellent';
            className = 'excellent';
        } else if (value < 100) {
            status = 'Good';
            className = 'good';
        } else if (value < 200) {
            status = 'Moderate';
            className = 'moderate';
        } else if (value < 300) {
            status = 'Poor';
            className = 'poor';
        } else {
            status = 'Very Poor';
            className = 'very-poor';
        }
    } else if (type === 'pm25') {
        if (value <= 12) {
            status = 'Good';
            className = 'excellent';
        } else if (value <= 35) {
            status = 'Moderate';
            className = 'good';
        } else if (value <= 55) {
            status = 'Unhealthy (Sensitive)';
            className = 'moderate';
        } else if (value <= 150) {
            status = 'Unhealthy';
            className = 'poor';
        } else {
            status = 'Very Unhealthy';
            className = 'very-poor';
        }
    } else if (type === 'pm10') {
        if (value <= 54) {
            status = 'Good';
            className = 'excellent';
        } else if (value <= 154) {
            status = 'Moderate';
            className = 'good';
        } else if (value <= 254) {
            status = 'Unhealthy (Sensitive)';
            className = 'moderate';
        } else if (value <= 354) {
            status = 'Unhealthy';
            className = 'poor';
        } else {
            status = 'Very Unhealthy';
            className = 'very-poor';
        }
    }

    statusElement.textContent = status;
    statusElement.className = `status ${className}`;
}

function updateLastUpdateTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    let timeAgo;
    if (diffMinutes < 1) {
        timeAgo = 'Just now';
    } else if (diffMinutes < 60) {
        timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffMinutes / 1440);
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
    }

    document.getElementById('lastUpdate').textContent = `Last update: ${timeAgo}`;
}
