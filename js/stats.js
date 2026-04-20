// Stats Calculation Module
// Handles all statistics calculations

// Get the start of the week (Monday) for a given date
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Calculate main stats (week, month, year totals with changes)
function calculateStats() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfWeek = getWeekStart(now);
    
    // Last week calculation
    const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    const endOfLastWeek = new Date(startOfWeek.getTime() - 1);
    
    // Last month calculation
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let week = 0, lastWeek = 0, month = 0, lastMonthTotal = 0, year = 0;

    runs.forEach(run => {
        const [y, m, d] = run.date.split('-').map(Number);
        const runDate = new Date(y, m - 1, d);
        
        // Current week
        if (runDate >= startOfWeek) week += run.distance;
        // Last week
        if (runDate >= startOfLastWeek && runDate <= endOfLastWeek) lastWeek += run.distance;
        // Current month
        if (runDate.getMonth() === currentMonth && runDate.getFullYear() === currentYear) month += run.distance;
        // Last month
        if (runDate.getMonth() === lastMonth && runDate.getFullYear() === lastMonthYear) lastMonthTotal += run.distance;
        // Year
        if (runDate.getFullYear() === currentYear) year += run.distance;
    });

    // Calculate percentage changes
    const weekChange = lastWeek > 0 ? ((week - lastWeek) / lastWeek * 100) : (week > 0 ? 100 : 0);
    const monthChange = lastMonthTotal > 0 ? ((month - lastMonthTotal) / lastMonthTotal * 100) : (month > 0 ? 100 : 0);

    return { 
        week: week.toFixed(1), 
        month: month.toFixed(1), 
        year: year.toFixed(1),
        weekChange: weekChange,
        monthChange: monthChange,
        lastWeek: lastWeek,
        lastMonthTotal: lastMonthTotal
    };
}

// Get weekly data for charts
function getWeeklyData(numWeeks = 12) {
    const weeks = [];
    const now = new Date();
    
    for (let i = 0; i < numWeeks; i++) {
        const weekStart = getWeekStart(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        weekEnd.setHours(23, 59, 59, 999);
        
        let total = 0;
        runs.forEach(run => {
            const [y, m, d] = run.date.split('-').map(Number);
            const runDate = new Date(y, m - 1, d);
            if (runDate >= weekStart && runDate <= weekEnd) {
                total += run.distance;
            }
        });
        
        const startLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
        
        weeks.push({
            label: startLabel,
            total: total,
            isCurrent: i === 0
        });
    }
    
    return weeks.reverse(); // Oldest first
}

// Get monthly data for charts
function getMonthlyData() {
    const months = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let m = 0; m < 12; m++) {
        let total = 0;
        runs.forEach(run => {
            const [y, month, d] = run.date.split('-').map(Number);
            if (y === currentYear && month - 1 === m) {
                total += run.distance;
            }
        });
        months.push({ label: monthNames[m], total: total });
    }
    return months;
}

// Get goal tracking data
function getGoalData() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Calculate day of year
    const startOfYear = new Date(currentYear, 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const daysInYear = ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) ? 366 : 365;
    
    // Get year total
    let yearTotal = 0;
    runs.forEach(run => {
        const [y] = run.date.split('-').map(Number);
        if (y === currentYear) yearTotal += run.distance;
    });
    
    return {
        yearTotal: yearTotal,
        dayOfYear: dayOfYear,
        daysInYear: daysInYear
    };
}

// Format percentage change for display
function formatChange(change, hasPreviousData) {
    if (!hasPreviousData) return { text: '--', class: 'neutral' };
    const rounded = Math.round(change);
    if (rounded > 0) return { text: `↑ ${rounded}%`, class: 'up' };
    if (rounded < 0) return { text: `↓ ${Math.abs(rounded)}%`, class: 'down' };
    return { text: '0%', class: 'neutral' };
}
