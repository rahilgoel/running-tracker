// Data Management Module
// Handles localStorage operations and run data CRUD

let runs = [];

// Load data from localStorage
function loadData() {
    runs = JSON.parse(localStorage.getItem('runData')) || [];
    return runs;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('runData', JSON.stringify(runs));
}

// Add a new run
function addRunData(date, distance, duration) {
    const newRun = {
        id: Date.now(),
        date: date,
        distance: distance,
        duration: duration || 0
    };
    runs.push(newRun);
    saveData();
    return newRun;
}

// Delete a run by ID
function deleteRunData(id) {
    runs = runs.filter(run => run.id !== id);
    saveData();
}

// Get all runs
function getRuns() {
    return runs;
}

// Export data as CSV
function exportToCSV() {
    if (runs.length === 0) {
        return null;
    }

    const sortedRuns = [...runs].sort((a, b) => new Date(a.date) - new Date(b.date));

    let csvContent = 'Date,Distance (miles),Duration (minutes)\n';
    sortedRuns.forEach(run => {
        csvContent += `${run.date},${run.distance},${run.duration || 0}\n`;
    });

    return csvContent;
}

// Download CSV file
function downloadCSV() {
    const csvContent = exportToCSV();
    
    if (!csvContent) {
        alert('No data to download.');
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `running_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// Initialize data on load
loadData();
