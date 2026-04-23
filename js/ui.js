// UI Rendering Module
// Handles DOM updates and user interactions

// Render the main home tab UI
function render() {
    const stats = calculateStats();
    
    // Update stat cards
    document.getElementById('weekTotal').innerText = stats.week;
    document.getElementById('monthTotal').innerText = stats.month;
    document.getElementById('yearTotal').innerText = stats.year;

    // Update week change indicator
    const weekChangeEl = document.getElementById('weekChange');
    const weekChangeData = formatChange(stats.weekChange, stats.lastWeek > 0 || parseFloat(stats.week) > 0);
    weekChangeEl.innerText = weekChangeData.text;
    weekChangeEl.className = 'change ' + weekChangeData.class;

    // Update month change indicator
    const monthChangeEl = document.getElementById('monthChange');
    const monthChangeData = formatChange(stats.monthChange, stats.lastMonthTotal > 0 || parseFloat(stats.month) > 0);
    monthChangeEl.innerText = monthChangeData.text;
    monthChangeEl.className = 'change ' + monthChangeData.class;

    // Render history table
    renderHistoryTable();
}

// Render the history table
// Pagination state for history table
let historyPage = 1;
const HISTORY_PAGE_SIZE = 20;

function renderHistoryTable() {
    const tbody = document.getElementById('historyBody');
    tbody.innerHTML = '';

    // Sort runs by date descending
    const sortedRuns = [...runs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = sortedRuns.length;
    const shown = HISTORY_PAGE_SIZE * historyPage;
    const visibleRuns = sortedRuns.slice(0, shown);

    visibleRuns.forEach(run => {
        const row = document.createElement('tr');
        const dateParts = run.date.split('-');
        const shortDate = `${parseInt(dateParts[1])}/${parseInt(dateParts[2])}`;
        const durationDisplay = run.duration ? `${run.duration}m` : '';
        row.innerHTML = `
            <td>${shortDate}</td>
            <td>${run.distance} mi ${durationDisplay}</td>
            <td><button class="delete-btn" onclick="deleteRun(${run.id})">Del</button></td>
        `;
        tbody.appendChild(row);
    });

    // Show/hide Load More button
    const loadMoreBtn = document.getElementById('historyLoadMore');
    if (loadMoreBtn) {
        if (total > visibleRuns.length) {
            loadMoreBtn.style.display = '';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Handler for Load More button
function loadMoreHistory() {
    historyPage++;
    renderHistoryTable();
}

// Reset pagination when adding/deleting runs or switching tabs
function resetHistoryPagination() {
    historyPage = 1;
}

// Patch render() to reset pagination
const _origRender = render;
render = function() {
    resetHistoryPagination();
    _origRender();
}

// Tab switching function
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const tabs = { home: 0, training: 1, stats: 2 };
    const index = tabs[tab] || 0;
    document.querySelectorAll('.tab-btn')[index].classList.add('active');

    if (tab === 'home') {
        document.getElementById('homeTab').classList.add('active');
    } else if (tab === 'training') {
        document.getElementById('trainingTab').classList.add('active');
        initTrainingTab();
    } else {
        document.getElementById('statsTab').classList.add('active');
        renderAllCharts();
    }
}

// Add run handler
function addRun() {
    const dateVal = document.getElementById('dateInput').value;
    const distVal = parseFloat(document.getElementById('distanceInput').value);
    const mins = parseInt(document.getElementById('durationMin').value) || 0;
    const secs = parseInt(document.getElementById('durationSec').value) || 0;
    const durVal = mins + secs / 60;

    if (!dateVal || isNaN(distVal) || distVal <= 0) {
        alert("Please enter a valid distance.");
        return;
    }

    addRunData(dateVal, distVal, durVal);
    render();
    
    // Clear input fields
    document.getElementById('distanceInput').value = '';
    document.getElementById('durationMin').value = '';
    document.getElementById('durationSec').value = '';
}

// Delete run handler
function deleteRun(id) {
    if (confirm('Delete this entry?')) {
        deleteRunData(id);
        render();
    }
}

// Initialize date input to today
function initializeDateInput() {
    document.getElementById('dateInput').valueAsDate = new Date();
}
