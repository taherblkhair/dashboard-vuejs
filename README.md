# Dashboard Vue.js

A modern, responsive dashboard application built with Vue.js 3 and Vite.

## Features

- 📊 Interactive dashboard with stat cards and charts
- 📈 Analytics page with traffic and revenue visualization
- ⚙️ Settings page with toggle controls
- 🎨 Clean, modern UI design
- 📱 Responsive layout with collapsible sidebar
- 🔗 Vue Router for navigation

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Vue Router 4** - Official router for Vue.js
- **CSS3** - Modern styling with flexbox and grid

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── dashboard/
│       ├── StatCard.vue      # Statistics card component
│       ├── LineChart.vue     # SVG line chart component
│       └── DataTable.vue     # Data table component
├── layouts/
│   └── DashboardLayout.vue   # Main layout with sidebar
├── views/
│   ├── Dashboard.vue         # Main dashboard page
│   ├── Analytics.vue         # Analytics page
│   └── Settings.vue          # Settings page
├── router/
│   └── index.js              # Vue Router configuration
├── App.vue                   # Root component
├── main.js                   # Application entry point
└── style.css                 # Global styles
```

## License

MIT
