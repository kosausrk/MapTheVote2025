# MapTheVote NYC 2025 - Interactive Dashboard

A modern, production-ready web application for visualizing strategic voter engagement opportunities across NYC boroughs and neighborhoods.

## ✨ Features

### 🗺️ Interactive Mapping
- **Multi-layer visualization** with borough and neighborhood data
- **Three view modes**: Strategic Opportunity, Voter Turnout, and Demographics  
- **MapLibre GL** for smooth, performant map interactions
- **Multiple map styles**: Light, Dark, and Voyager themes

### 🎛️ Advanced Filtering
- **Borough-level filters** with checkboxes and dropdowns
- **Range sliders** for turnout rate, income, and demographic filters
- **Real-time filtering** with instant map updates
- **Smart filter combinations** for targeted analysis

### 📊 Live Data Integration
- **NYC Open Data API** integration with fallback data
- **Automated data refresh** every 30 minutes
- **API status monitoring** with visual indicators
- **Cached responses** for improved performance

### 🏘️ Neighborhood Support
- **25+ NYC neighborhoods** with detailed metrics
- **Strategic scoring** at neighborhood level
- **Population-weighted visualization** with dynamic sizing
- **Toggleable neighborhood layer** for detailed analysis

### 📱 Modern UI/UX
- **Responsive design** with collapsible sidebar
- **Real-time hover tooltips** with detailed statistics
- **Interactive legends** for all visualization modes
- **Loading states** and error handling
- **Accessibility features** with keyboard navigation

## 🚀 Quick Start

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

## 📊 Data Sources & Methodology

### Strategic Engagement Index Formula
```
Strategic Score = (
  40% × Unaffiliated Voter Rate +
  30% × Under-30 Population % +
  20% × College Education Rate +
  10% × Turnout Rate
) × Income Factor
```

### Data Sources
- **NYC Board of Elections**: Voter registration and turnout data
- **Furman Center**: Housing and demographic statistics  
- **NYC Planning**: Population and neighborhood boundaries
- **American Community Survey**: Education and income data
- **NYC Open Data Portal**: Real-time civic data

## 🏗️ Architecture

### Frontend Stack
- **React 19** with modern hooks and concurrent features
- **MapLibre GL JS** for vector map rendering
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development and optimized builds

### Key Components
```
src/
├── components/
│   ├── Dashboard.jsx          # Main layout and state management
│   ├── NYCMap.jsx             # Interactive map with layers
│   ├── SidePanel.jsx          # Filters and controls
│   ├── NeighborhoodLayer.jsx  # Neighborhood visualization
│   ├── BoroughCard.jsx        # Borough detail cards
│   └── LiveDataPanel.jsx      # API status and data freshness
├── data/
│   ├── boroughData.js         # Borough-level metrics
│   └── neighborhoodData.js    # Neighborhood-level data
└── services/
    └── dataService.js         # API integration and caching
```

## 🎯 Strategic Use Cases

### Campaign Operations
- **Identify high-opportunity neighborhoods** for voter outreach
- **Optimize canvassing routes** based on strategic scores
- **Track engagement metrics** across different demographics

### Civic Organizations  
- **Prioritize voter registration drives** in underrepresented areas
- **Analyze turnout patterns** to improve future campaigns
- **Coordinate with local community groups** using neighborhood data

### Data Analysis
- **Compare borough performance** across multiple metrics
- **Export insights** for presentations and reports
- **Monitor real-time changes** during election periods

## 🔧 Configuration

### Environment Variables
```bash
# Optional: NYC Open Data API key
VITE_NYC_API_KEY=your_api_key_here

# Data refresh interval (minutes)
VITE_REFRESH_INTERVAL=30
```

### Map Customization
Edit `src/components/NYCMap.jsx` to:
- Add new map styles
- Modify color schemes
- Adjust zoom levels and bounds

## 📱 Browser Support

- **Chrome** 88+
- **Firefox** 85+  
- **Safari** 14+
- **Edge** 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙋‍♀️ Support

- **Documentation**: Full API documentation in `/docs`
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Contact**: [@zohranfornyc](https://www.zohranfornyc.com/) for campaign-related questions

---

**Built with ❤️ for NYC voters and the Zohran4NYC campaign**