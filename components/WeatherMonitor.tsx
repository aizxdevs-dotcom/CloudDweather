'use client'

import { useState } from 'react'
import { apiClient, type WeatherData } from '@/lib/api'

export default function WeatherMonitor() {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError(null)

    try {
      const data = await apiClient.getWeather(city, country || undefined)
      setWeather(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🌤️ Weather Monitor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City Name
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Bongao, Manila, London"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Code (Optional)
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., PH, UK"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!city.trim() || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Weather Results */}
      {weather && (
        <div className="mt-8 space-y-6">
          <div className="border-t pt-6">
            {/* Location Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {weather.weather.location.name}, {weather.weather.location.country}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(weather.weather.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather.current.icon}@2x.png`}
                  alt={weather.weather.current.description}
                  className="w-20 h-20"
                />
              </div>
            </div>

            {/* Main Weather Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-3xl font-bold text-blue-600">
                  {weather.weather.current.temperature}°C
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Feels like {weather.weather.current.feels_like}°C
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-3xl font-bold text-cyan-600">
                  {weather.weather.current.humidity}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Wind Speed</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {weather.weather.wind.speed} m/s
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cloud Coverage</p>
                <p className="text-3xl font-bold text-purple-600">
                  {weather.weather.clouds.coverage}%
                </p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Additional Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Condition</p>
                  <p className="font-medium text-gray-900">{weather.weather.current.description}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pressure</p>
                  <p className="font-medium text-gray-900">{weather.weather.current.pressure} hPa</p>
                </div>
                <div>
                  <p className="text-gray-600">Visibility</p>
                  <p className="font-medium text-gray-900">{weather.weather.current.visibility} km</p>
                </div>
                <div>
                  <p className="text-gray-600">Wind Direction</p>
                  <p className="font-medium text-gray-900">{weather.weather.wind.direction}°</p>
                </div>
                <div>
                  <p className="text-gray-600">Sunrise</p>
                  <p className="font-medium text-gray-900">
                    {new Date(weather.weather.sun.sunrise * 1000).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Sunset</p>
                  <p className="font-medium text-gray-900">
                    {new Date(weather.weather.sun.sunset * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
