// Training Module
// Handles functional training workout sessions

let workouts = [];
let savedExercises = [];
let currentSessionExercises = [];

// Load training data from localStorage
function loadTrainingData() {
    workouts = JSON.parse(localStorage.getItem('workoutData')) || [];
    savedExercises = JSON.parse(localStorage.getItem('savedExercises')) || [];
}

// Save training data to localStorage
function saveTrainingData() {
    localStorage.setItem('workoutData', JSON.stringify(workouts));
    localStorage.setItem('savedExercises', JSON.stringify(savedExercises));
}

// Add exercise name to saved list (deduped, case-insensitive)
function saveExerciseName(name) {
    const upper = name.toUpperCase().trim();
    if (upper && !savedExercises.some(e => e.toUpperCase() === upper)) {
        savedExercises.push(name.trim());
        saveTrainingData();
    }
}

// Handle exercise select dropdown change
function onExerciseSelectChange() {
    const select = document.getElementById('exerciseSelect');
    const textInput = document.getElementById('exerciseNameInput');
    if (select.value === '__new__') {
        textInput.style.display = 'block';
        textInput.value = '';
        textInput.focus();
    } else {
        textInput.style.display = 'none';
        textInput.value = '';
    }
}

// Add exercise to current session
function addExerciseToSession() {
    const select = document.getElementById('exerciseSelect');
    const textInput = document.getElementById('exerciseNameInput');
    let name = '';

    if (select.value === '__new__') {
        name = textInput.value.trim();
    } else if (select.value) {
        name = select.value;
    }

    const sets = parseInt(document.getElementById('exerciseSets').value) || 0;
    const reps = document.getElementById('exerciseReps').value.trim();
    const weight = document.getElementById('exerciseWeight').value.trim();

    if (!name) {
        alert('Please enter an exercise name.');
        return;
    }
    if (sets <= 0) {
        alert('Please enter a valid number of sets.');
        return;
    }
    if (!reps) {
        alert('Please enter reps.');
        return;
    }

    saveExerciseName(name);

    currentSessionExercises.push({
        name: name,
        sets: sets,
        reps: reps,
        weight: weight || 'BW'
    });

    // Clear inputs
    select.value = '';
    textInput.value = '';
    textInput.style.display = 'none';
    document.getElementById('exerciseSets').value = '';
    document.getElementById('exerciseReps').value = '';
    document.getElementById('exerciseWeight').value = '';

    renderCurrentSession();
    populateExerciseDropdown();
}

// Remove exercise from current session
function removeSessionExercise(index) {
    currentSessionExercises.splice(index, 1);
    rebuildSavedExercises();
    renderCurrentSession();
    populateExerciseDropdown();
}

// Save the full session as a workout
function saveWorkoutSession() {
    if (currentSessionExercises.length === 0) {
        alert('Add at least one exercise before saving.');
        return;
    }

    const date = document.getElementById('trainingDateInput').value;
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const workout = {
        id: Date.now(),
        date: date,
        exercises: [...currentSessionExercises]
    };

    workouts.push(workout);
    currentSessionExercises = [];
    saveTrainingData();
    renderCurrentSession();
    renderWorkoutHistory();
}

// Delete the currently selected exercise from the saved list
function deleteSelectedExercise() {
    const select = document.getElementById('exerciseSelect');
    const name = select.value;
    if (!name || name === '__new__') {
        alert('Select an exercise to remove.');
        return;
    }
    if (confirm('Remove "' + name + '" from the list?')) {
        savedExercises = savedExercises.filter(e => e !== name);
        saveTrainingData();
        select.value = '';
        populateExerciseDropdown();
    }
}

// Rebuild savedExercises from all remaining workouts and current session
function rebuildSavedExercises() {
    const allNames = new Set();
    workouts.forEach(w => w.exercises.forEach(ex => allNames.add(ex.name)));
    currentSessionExercises.forEach(ex => allNames.add(ex.name));
    savedExercises = [...allNames];
    saveTrainingData();
}

// Delete a saved workout
function deleteWorkout(id) {
    if (confirm('Delete this workout?')) {
        workouts = workouts.filter(w => w.id !== id);
        rebuildSavedExercises();
        renderWorkoutHistory();
        populateExerciseDropdown();
    }
}

// Populate the exercise select dropdown from saved exercises
function populateExerciseDropdown() {
    const select = document.getElementById('exerciseSelect');
    // Keep the first two static options, rebuild the rest
    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Pick or add new --</option>'
        + savedExercises.map(name =>
            `<option value="${name}">${name}</option>`
        ).join('')
        + '<option value="__new__">+ New exercise…</option>';
    // Restore selection if it still exists
    if (currentVal && currentVal !== '__new__') {
        select.value = currentVal;
    }
}

// Render the current session exercise list
function renderCurrentSession() {
    const container = document.getElementById('currentSessionBody');

    if (currentSessionExercises.length === 0) {
        container.innerHTML = '<div class="no-data" style="padding:20px;">No exercises added yet.</div>';
        return;
    }

    container.innerHTML = currentSessionExercises.map((ex, i) => `
        <div class="session-exercise-row">
            <div class="session-exercise-name">${ex.name}</div>
            <div class="session-exercise-detail">${ex.reps} × ${ex.sets}</div>
            <div class="session-exercise-detail">${ex.weight}</div>
            <button class="delete-btn" onclick="removeSessionExercise(${i})">✕</button>
        </div>
    `).join('');
}

// Render workout history
function renderWorkoutHistory() {
    const container = document.getElementById('workoutHistoryBody');

    if (workouts.length === 0) {
        container.innerHTML = '<div class="no-data" style="padding:20px;">No workouts logged yet.</div>';
        return;
    }

    const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted.map(w => {
        const dateParts = w.date.split('-');
        const shortDate = `${parseInt(dateParts[1])}/${parseInt(dateParts[2])}`;
        const exerciseRows = w.exercises.map(ex => `
            <div class="history-exercise-row">
                <span class="hist-ex-name">${ex.name}</span>
                <span class="hist-ex-detail">${ex.reps} × ${ex.sets}</span>
                <span class="hist-ex-detail">${ex.weight}</span>
            </div>
        `).join('');

        return `
            <div class="workout-card">
                <div class="workout-card-header">
                    <span class="workout-date">${shortDate}</span>
                    <span class="workout-count">${w.exercises.length} exercise${w.exercises.length > 1 ? 's' : ''}</span>
                    <button class="delete-btn" onclick="deleteWorkout(${w.id})">Del</button>
                </div>
                <div class="workout-card-body">${exerciseRows}</div>
            </div>
        `;
    }).join('');
}

// Initialize training tab
function initTrainingTab() {
    document.getElementById('trainingDateInput').valueAsDate = new Date();
    populateExerciseDropdown();
    renderCurrentSession();
    renderWorkoutHistory();
}

// Load on startup
loadTrainingData();
