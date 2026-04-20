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

// Render all charts (called when Stats tab is opened)
function renderAllCharts() {
    renderGoalTracking();
    renderWeeklyChart();
    renderMonthlyChart();
}
