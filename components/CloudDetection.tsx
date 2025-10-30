"use client"

import { useEffect, useState } from 'react'
import { apiClient, type CloudDetectionResult } from '@/lib/api'
import LiveStream from './LiveStream'

export default function CloudDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CloudDetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState(false)
  const [health, setHealth] = useState<{ healthy: boolean; missing_keys?: string[] } | null>(null)

  useEffect(() => {
    let mounted = true
    apiClient.health()
      .then((res) => {
        if (mounted) setHealth({ healthy: res.healthy, missing_keys: res.missing_keys })
      })
      .catch(() => {
        if (mounted) setHealth({ healthy: false, missing_keys: [] })
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const data = await apiClient.detectClouds(file)
      setResult(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to detect clouds. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Health banner: show if keys are missing */}
      {health && !health.healthy && (
        <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-800 text-sm">Configuration incomplete: missing keys: {(health.missing_keys || []).join(', ') || 'unknown'}. Live inference and weather features may be disabled.</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">☁️ Cloud Detection</h2>
        <div>
          <button
            onClick={() => setLiveMode((s) => !s)}
            className={`ml-4 px-3 py-1 rounded-md text-sm font-medium ${liveMode ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
          >
            {liveMode ? 'Stop Live' : 'Start Live'}
          </button>
        </div>
      </div>

      {liveMode ? (
        <div className="mt-4">
          <LiveStream fps={1} />
        </div>
      ) : (
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
                    className="mx-auto max-h-64 w-auto rounded-lg"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Detect Clouds'}
        </button>
        </form>
      )}

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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Results</h3>
            
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Detections</p>
                <p className="text-2xl font-bold text-blue-600">
                  {result.predictions.summary.total_detections}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Image Size</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {result.predictions.image_dimensions.width} × {result.predictions.image_dimensions.height}
                </p>
              </div>
            </div>

            {/* Predictions */}
            {result.predictions.predictions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Cloud Types Detected:</h4>
                {result.predictions.predictions.map((pred, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{pred.class}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {(pred.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Position: ({Math.round(pred.bounding_box.x)}, {Math.round(pred.bounding_box.y)}) • 
                      Size: {Math.round(pred.bounding_box.width)} × {Math.round(pred.bounding_box.height)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No clouds detected in this image.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
