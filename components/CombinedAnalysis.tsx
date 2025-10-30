'use client'

import { useState } from 'react'
import { apiClient, type CombinedAnalysis } from '@/lib/api'

export default function CombinedAnalysisComponent() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CombinedAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !city.trim()) return

    setLoading(true)
    setError(null)

    try {
      const data = await apiClient.analyzeCombined(file, city, country || undefined)
      setResult(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 Combined Analysis</h2>
      <p className="text-gray-600 mb-6">Upload a cloud image and enter a location to get comprehensive cloud detection and weather analysis.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Cloud Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="mb-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-48 w-auto rounded-lg"
                  />
                </div>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>{preview ? 'Change image' : 'Upload a file'}</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Location Input */}
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
              Country Code
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., PH"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || !city.trim() || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Analyzing...' : 'Analyze Cloud & Weather'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Analysis Results</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cloud Detection Results */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">☁️ Cloud Detection</h4>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Total Detections:</span>
                    <span className="font-bold text-blue-600">{result.cloud_detection.summary.total_detections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Image Size:</span>
                    <span className="font-medium text-gray-900">
                      {result.cloud_detection.image_dimensions.width} × {result.cloud_detection.image_dimensions.height}
                    </span>
                  </div>
                </div>

                {result.cloud_detection.predictions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Detected Clouds:</p>
                    {result.cloud_detection.predictions.map((pred, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{pred.class}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No clouds detected in this image.</p>
                )}
              </div>

              {/* Weather Results */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-indigo-900 mb-4">🌤️ Weather Conditions</h4>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-lg text-gray-900">
                      {result.weather.location.name}, {result.weather.location.country}
                    </h5>
                    <img
                      src={`https://openweathermap.org/img/wn/${result.weather.current.icon}@2x.png`}
                      alt={result.weather.current.description}
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{result.weather.current.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Temperature</p>
                    <p className="text-xl font-bold text-indigo-600">{result.weather.current.temperature}°C</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Humidity</p>
                    <p className="text-xl font-bold text-cyan-600">{result.weather.current.humidity}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Wind Speed</p>
                    <p className="text-xl font-bold text-blue-600">{result.weather.wind.speed} m/s</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Cloud Coverage</p>
                    <p className="text-xl font-bold text-purple-600">{result.weather.clouds.coverage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
