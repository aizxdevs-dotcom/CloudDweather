'use client'

import { useState } from 'react'
import CloudDetection from '@/components/CloudDetection'
import WeatherMonitor from '@/components/WeatherMonitor'
import CombinedAnalysis from '@/components/CombinedAnalysis'
// WeatherHistory removed

export default function Home() {
  const [activeTab, setActiveTab] = useState<'detection' | 'weather' | 'combined'>('combined')

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 leading-tight break-words">
                ☁️ Cloud Detection & Weather Monitor
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Powered by Roboflow AI & OpenWeatherMap
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('combined')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'combined'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔍 Combined Analysis
          </button>
          <button
            onClick={() => setActiveTab('detection')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'detection'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ☁️ Cloud Detection
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === 'weather'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🌤️ Weather Monitor
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'combined' && <CombinedAnalysis />}
        {activeTab === 'detection' && <CloudDetection />}
        {activeTab === 'weather' && <WeatherMonitor />}
      </div>

      {/* Footer */}
      {/* Weather history removed */}

      <footer className="mt-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Cloud Detection & Weather Monitoring System • 2025
          </p>
        </div>
      </footer>
    </main>
  )
}
