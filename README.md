# 🏃 Running Tracker

A simple, mobile-friendly web app to track your running progress. Built with vanilla HTML, CSS, and JavaScript - no frameworks required!

![Running Tracker Screenshot](https://img.shields.io/badge/Mobile-Friendly-green) ![No Dependencies](https://img.shields.io/badge/Dependencies-None-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 📊 Home Tab
- **Quick Stats** - View your weekly, monthly, and yearly mileage at a glance
- **Percentage Changes** - See how you're doing compared to last week/month (↑ or ↓)
- **Add Runs** - Log your runs with date, distance, and duration
- **Activity History** - View and delete past runs
- **CSV Export** - Download all your data as a CSV file

### 📈 Stats Tab
- **Goal Tracking** - Track progress toward 100-mile and 150-mile yearly goals
  - Visual progress bars with expected pace baseline
  - Shows if you're ahead, behind, or on track
- **Weekly Chart** - Bar chart showing last 12 weeks of running
- **Monthly Chart** - Bar chart showing monthly totals for the current year

## 🚀 Quick Start

### Option 1: Use the Live App
Simply visit: **[https://running-tracker-cyan.vercel.app](https://running-tracker-cyan.vercel.app)**

Add it to your phone's home screen for an app-like experience!

### Option 2: Host Your Own

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahilgoel/running-tracker.git
   cd running-tracker
   ```

2. **Serve locally** (choose one method)
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Using Node.js
   npx serve
   
   # Or just open index.html in your browser
   ```

3. **Deploy to your own hosting**
   - Upload to GitHub Pages, Vercel, Netlify, or any static hosting
   - No build step required - it's just HTML, CSS, and JS!

## 📱 Add to Home Screen (iOS/Android)

For the best mobile experience, add the app to your home screen:

**iOS (Safari):**
1. Open the app URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"

**Android (Chrome):**
1. Open the app URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"

## 📁 Project Structure

```
running-tracker/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styling (iOS-inspired design)
└── js/
    ├── data.js         # Data management & localStorage
    ├── stats.js        # Statistics calculations
    ├── charts.js       # Chart rendering
    ├── ui.js           # UI updates & interactions
    └── app.js          # App initialization
```

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`. This means:
- ✅ Your data stays on your device
- ✅ No account or login required
- ✅ Works offline
- ⚠️ Clearing browser data will delete your runs
- 💡 Use "Download Data" to backup your runs as CSV

## 🛠️ Customization

### Change Yearly Goals
Edit `js/charts.js` and modify the `goals` array in `renderGoalTracking()`:
```javascript
const goals = [
    { target: 100, label: '100 Miles', colorClass: 'goal-100' },
    { target: 150, label: '150 Miles', colorClass: 'goal-150' }
];
```

### Change Colors
Edit `css/styles.css` and modify the CSS variables in `:root`:
```css
:root {
    --primary: #007AFF;  /* Main accent color */
    --bg: #F2F2F7;       /* Background color */
    --card-bg: #ffffff;  /* Card background */
}
```

## 🤝 Contributing

Feel free to fork this project and make it your own! Pull requests are welcome.

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---

Made with ❤️ by [Rahil Goel](https://github.com/rahilgoel)
