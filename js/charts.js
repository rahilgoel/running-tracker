// Charts Rendering Module
// Handles rendering of bar charts and goal tracking

// Render weekly bar chart
function renderWeeklyChart() {
    const chartContainer = document.getElementById('weeklyChart');
    const weeklyData = getWeeklyData(12);
    
    if (runs.length === 0) {
        chartContainer.innerHTML = '<div class="no-data">No running data yet.<br>Add some runs to see your weekly stats!</div>';
        return;
    }
    
    const maxValue = Math.max(...weeklyData.map(w => w.total), 1);
    
    chartContainer.innerHTML = weeklyData.map(week => `
        <div class="bar-row">
            <div class="bar-label">${week.label}</div>
            <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${(week.total / maxValue) * 100}%"></div>
            </div>
            <div class="bar-value">${week.total.toFixed(1)} mi</div>
        </div>
    `).join('');
}

// Render monthly bar chart
function renderMonthlyChart() {
    const chartContainer = document.getElementById('monthlyChart');
    const monthlyData = getMonthlyData();
    
    if (runs.length === 0) {
        chartContainer.innerHTML = '<div class="no-data">No data yet</div>';
        return;
    }
    
    const maxValue = Math.max(...monthlyData.map(m => m.total), 1);
    
    chartContainer.innerHTML = monthlyData.map(month => `
        <div class="bar-row">
            <div class="bar-label">${month.label}</div>
            <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${(month.total / maxValue) * 100}%; background: linear-gradient(90deg, #FF9500, #FF9F0A);"></div>
            </div>
            <div class="bar-value">${month.total.toFixed(1)} mi</div>
        </div>
    `).join('');
}

// Render goal tracking section
function renderGoalTracking() {
    const container = document.getElementById('goalTracking');
    const goalData = getGoalData();
    
    const goals = [
        { target: 100, label: '100 Miles', colorClass: 'goal-100' },
        { target: 150, label: '150 Miles', colorClass: 'goal-150' }
    ];
    
    container.innerHTML = goals.map(goal => {
        const expectedPace = (goal.target / goalData.daysInYear) * goalData.dayOfYear;
        const progress = (goalData.yearTotal / goal.target) * 100;
        const baselinePercent = (expectedPace / goal.target) * 100;
        const diff = goalData.yearTotal - expectedPace;
        
        let statusClass, statusText;
        if (diff > 1) {
            statusClass = 'ahead';
            statusText = `+${diff.toFixed(1)} mi ahead`;
        } else if (diff < -1) {
            statusClass = 'behind';
            statusText = `${Math.abs(diff).toFixed(1)} mi behind`;
        } else {
            statusClass = 'on-track';
            statusText = 'On track';
        }
        
        return `
            <div class="goal-item">
                <div class="goal-header">
                    <span class="goal-label">${goal.label}</span>
                    <span class="goal-status ${statusClass}">${statusText}</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-fill ${goal.colorClass}" style="width: ${Math.min(progress, 100)}%"></div>
                    <div class="goal-baseline" style="left: ${baselinePercent}%"></div>
                </div>
                <div class="goal-details">
                    <span>${goalData.yearTotal.toFixed(1)} / ${goal.target} mi</span>
                    <span>Expected: ${expectedPace.toFixed(1)} mi</span>
                </div>
            </div>
        `;
    }).join('');
}

// Render pace line chart (min/mile over time)
function renderPaceChart() {
    const container = document.getElementById('paceChart');
    const paceData = getPaceData();

    if (paceData.length < 2) {
        container.innerHTML = '<div class="no-data">Need at least 2 runs with duration to show pace trend.</div>';
        return;
    }

    const paces = paceData.map(d => d.pace);
    const minPace = Math.min(...paces);
    const maxPace = Math.max(...paces);
    const range = maxPace - minPace || 1;

    // Chart dimensions
    const width = container.clientWidth || 300;
    const height = 180;
    const padLeft = 45;
    const padRight = 15;
    const padTop = 15;
    const padBottom = 35;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Map data to pixel coordinates
    const points = paceData.map((d, i) => {
        const x = padLeft + (i / (paceData.length - 1)) * chartW;
        const y = padTop + ((maxPace - d.pace) / range) * chartH;
        return { x, y, pace: d.pace, date: d.date };
    });

    // Y-axis ticks (4 ticks)
    const yTicks = [];
    for (let i = 0; i <= 3; i++) {
        const val = maxPace - (i / 3) * range;
        const y = padTop + (i / 3) * chartH;
        const mins = Math.floor(val);
        const secs = Math.round((val - mins) * 60);
        yTicks.push({ y, label: `${mins}:${secs.toString().padStart(2, '0')}` });
    }

    // X-axis labels (show first, middle, last)
    const xLabels = [];
    const labelIndices = [0, Math.floor(paceData.length / 2), paceData.length - 1];
    // Deduplicate if fewer than 3 points
    const uniqueIndices = [...new Set(labelIndices)];
    uniqueIndices.forEach(i => {
        const parts = paceData[i].date.split('-');
        xLabels.push({
            x: points[i].x,
            label: `${parseInt(parts[1])}/${parseInt(parts[2])}`
        });
    });

    // Build SVG polyline path
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    // Build area path (fill under the line)
    const areaPath = linePath
        + ` L${points[points.length - 1].x.toFixed(1)},${padTop + chartH}`
        + ` L${points[0].x.toFixed(1)},${padTop + chartH} Z`;

    // Grid lines
    const gridLines = yTicks.map(t =>
        `<line x1="${padLeft}" y1="${t.y}" x2="${width - padRight}" y2="${t.y}" stroke="#e0e0e0" stroke-width="1"/>`
    ).join('');

    // Y-axis labels
    const yLabels = yTicks.map(t =>
        `<text x="${padLeft - 6}" y="${t.y + 4}" text-anchor="end" fill="#8E8E93" font-size="10">${t.label}</text>`
    ).join('');

    // X-axis labels
    const xLabelsSvg = xLabels.map(l =>
        `<text x="${l.x}" y="${height - 5}" text-anchor="middle" fill="#8E8E93" font-size="10">${l.label}</text>`
    ).join('');

    // Data point dots
    const dots = points.map(p =>
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#007AFF" stroke="white" stroke-width="1.5"/>`
    ).join('');

    container.innerHTML = `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Line chart showing running pace over time in minutes per mile">
            <title>Running pace over time</title>
            ${gridLines}
            ${yLabels}
            ${xLabelsSvg}
            <path d="${areaPath}" fill="rgba(0,122,255,0.1)"/>
            <polyline points="${points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="none" stroke="#007AFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            ${dots}
        </svg>
    `;
}

// Render all charts (called when Stats tab is opened)
function renderAllCharts() {
    renderGoalTracking();
    renderWeeklyChart();
    renderMonthlyChart();
    renderPaceChart();
}
