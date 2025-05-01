
// ThingSpeak Channel Configuration
const channelID = '2944234';  // Replace with your channel ID
const readAPIKey = 'Y23QWWN6OI2NLQ5E'; // Replace with your Read API Key
const dataPoints = 20; // Number of data points to fetch

// Base URL for ThingSpeak API
const baseUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=${dataPoints}`;

// Chart configuration
const chartConfig = {
    type: 'line',
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
                beginAtZero: false
            },
            x: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 2
            },
            line: {
                tension: 0.2
            }
        }
    }
};

// Chart objects
const charts = {};

// Initialize charts
function initCharts() {
    charts.co2 = new Chart(document.getElementById('co2-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'CO2',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: []
            }]
        }
    });
    
    charts.temp = new Chart(document.getElementById('temp-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'Temperature',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: []
            }]
        }
    });
    
    charts.humidity = new Chart(document.getElementById('humidity-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'Humidity',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: []
            }]
        }
    });
    
    charts.voc = new Chart(document.getElementById('voc-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'VOC Index',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: []
            }]
        }
    });
    
    charts.nox = new Chart(document.getElementById('nox-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'NOx Index',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                data: []
            }]
        }
    });
    
    charts.pm25 = new Chart(document.getElementById('pm25-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'PM2.5',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                data: []
            }]
        }
    });
    
    charts.pm10 = new Chart(document.getElementById('pm10-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'PM10',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: []
            }]
        }
    });
    
    charts.pm1 = new Chart(document.getElementById('pm1-chart').getContext('2d'), {
        ...chartConfig,
        data: {
            datasets: [{
                label: 'PM1.0',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                data: []
            }]
        }
    });
}

// Update chart data
function updateCharts(data) {
    const timestamps = data.map(entry => new Date(entry.created_at).toLocaleTimeString());
    
    // CO2 Data (Field 1)
    const co2Data = data.map(entry => parseFloat(entry.field1 || 0));
    charts.co2.data.labels = timestamps;
    charts.co2.data.datasets[0].data = co2Data;
    charts.co2.update();
    
    // Temperature Data (Field 2)
    const tempData = data.map(entry => parseFloat(entry.field2 || 0));
    charts.temp.data.labels = timestamps;
    charts.temp.data.datasets[0].data = tempData;
    charts.temp.update();
    
    // Humidity Data (Field 3)
    const humidityData = data.map(entry => parseFloat(entry.field3 || 0));
    charts.humidity.data.labels = timestamps;
    charts.humidity.data.datasets[0].data = humidityData;
    charts.humidity.update();
    
    // VOC Index Data (Field 4)
    const vocData = data.map(entry => parseFloat(entry.field4 || 0));
    charts.voc.data.labels = timestamps;
    charts.voc.data.datasets[0].data = vocData;
    charts.voc.update();
    
    // NOx Index Data (Field 5)
    const noxData = data.map(entry => parseFloat(entry.field5 || 0));
    charts.nox.data.labels = timestamps;
    charts.nox.data.datasets[0].data = noxData;
    charts.nox.update();
    
    // PM2.5 Data (Field 6)
    const pm25Data = data.map(entry => parseFloat(entry.field6 || 0));
    charts.pm25.data.labels = timestamps;
    charts.pm25.data.datasets[0].data = pm25Data;
    charts.pm25.update();
    
    // PM10 Data (Field 7)
    const pm10Data = data.map(entry => parseFloat(entry.field7 || 0));
    charts.pm10.data.labels = timestamps;
    charts.pm10.data.datasets[0].data = pm10Data;
    charts.pm10.update();
    
    // PM1.0 Data (Field 8)
    const pm1Data = data.map(entry => parseFloat(entry.field8 || 0));
    charts.pm1.data.labels = timestamps;
    charts.pm1.data.datasets[0].data = pm1Data;
    charts.pm1.update();
    
    // Update current values
    const latestEntry = data[data.length - 1];
    document.getElementById('current-co2').textContent = latestEntry.field1 || '--';
    document.getElementById('current-temp').textContent = latestEntry.field2 || '--';
    document.getElementById('current-humidity').textContent = latestEntry.field3 || '--';
    document.getElementById('current-voc').textContent = latestEntry.field4 || '--';
    document.getElementById('current-nox').textContent = latestEntry.field5 || '--';
    document.getElementById('current-pm25').textContent = latestEntry.field6 || '--';
    document.getElementById('current-pm10').textContent = latestEntry.field7 || '--';
    document.getElementById('current-pm1').textContent = latestEntry.field8 || '--';
    
    // Update last update time
    document.getElementById('last-update').textContent = new Date().toLocaleString();
    
    // Update status indicators
    updateStatus('co2', parseFloat(latestEntry.field1 || 0));
    updateStatus('voc', parseFloat(latestEntry.field4 || 0));
    updateStatus('nox', parseFloat(latestEntry.field5 || 0));
    updateStatus('pm25', parseFloat(latestEntry.field6 || 0));
    updateStatus('pm10', parseFloat(latestEntry.field7 || 0));
}

// Update status indicators
function updateStatus(type, value) {
    const statusElement = document.getElementById(`${type}-status`);
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
            status = 'Unhealthy for Sensitive Groups';
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
            status = 'Unhealthy for Sensitive Groups';
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

// Fetch data from ThingSpeak
function fetchData() {
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            if (data.feeds && data.feeds.length > 0) {
                updateCharts(data.feeds);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchData();
    
    // Refresh data every 1 minute
    setInterval(fetchData, 60000);
});
