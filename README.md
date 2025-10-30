# Cloud Detection & Weather Monitor - Frontend

A modern Next.js application with Tailwind CSS for cloud detection and weather monitoring.

## Features

- **Combined Analysis**: Upload images and get both cloud detection and weather data
- **Cloud Detection**: Analyze cloud types using Roboflow AI
- **Weather Monitor**: Real-time weather data from OpenWeatherMap
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8000

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment (optional):
```bash
# Edit .env.local if backend is not on localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
CloudDweather/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with tabs
│   └── globals.css         # Global styles
├── components/
│   ├── CloudDetection.tsx  # Cloud detection component
│   ├── WeatherMonitor.tsx  # Weather display component
│   └── CombinedAnalysis.tsx # Combined analysis component
├── lib/
│   └── api.ts              # API client
└── public/                 # Static assets
```

## Usage

### Combined Analysis
1. Click "Combined Analysis" tab
2. Upload a cloud image
3. Enter city and country
4. Click "Analyze Cloud & Weather"
5. View both cloud detection results and weather data

### Cloud Detection Only
1. Click "Cloud Detection" tab
2. Upload an image
3. Click "Detect Clouds"
4. View detected cloud types with confidence scores

### Weather Monitor Only
1. Click "Weather Monitor" tab
2. Enter city name and optional country code
3. Click "Get Weather"
4. View current weather conditions

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios

## API Integration

The frontend connects to the FastAPI backend at `NEXT_PUBLIC_API_URL`.

Endpoints used:
- `POST /detect-clouds` - Cloud detection
- `GET /weather` - Current weather
- `POST /analyze` - Combined analysis
# CloudDweather
