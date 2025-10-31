"use client"

import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api"

export default function LiveStream({ fps = 1 }: { fps?: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const overlayRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [lastResult, setLastResult] = useState<any | null>(null)
  const [intervalMs, setIntervalMs] = useState(Math.round(1000 / fps))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      // Stop stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((t) => t.stop())
      }
    }
  }, [])

  const start = async () => {
    setError(null)
    try {
      // Prefer the back (environment) camera. Use an 'ideal' constraint so browsers
      // fall back gracefully if the device doesn't expose a rear camera.
      let stream: MediaStream | null = null
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      } catch (e) {
        // Some browsers/devices may reject the 'ideal' constraint; try a simpler request
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream
        // Some browsers require play() to start rendering
        try {
          await videoRef.current.play()
        } catch (playErr) {
          // ignore play errors; stream will still be available
        }
      }
      setStreaming(true)
      captureLoop()
    } catch (err: any) {
      setError(err?.message || "Unable to access camera")
    }
  }

  const stop = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    setStreaming(false)
  }

  const captureLoop = async () => {
    if (!streaming) return
    try {
      if (!videoRef.current) return
      const video = videoRef.current
      const w = video.videoWidth || 640
      const h = video.videoHeight || 480
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas")
      }
      const canvas = canvasRef.current
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(video, 0, 0, w, h)
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.8))
      if (!blob || blob.size === 0) {
        console.warn('Captured blob is empty or null; skipping this frame')
        // If blob is missing, wait and continue; on some mobile browsers canvas.toBlob
        // may fail briefly while the video is initializing.
        setTimeout(() => {
          if (streaming) captureLoop()
        }, Math.max(200, intervalMs))
        return
      }

      // Send to backend
      try {
        // Ensure file has a good name/type
        const fileName = `frame-${Date.now()}.jpg`
        const fileType = blob.type || 'image/jpeg'
        const file = new File([blob], fileName, { type: fileType })

        const data = await apiClient.detectClouds(file)
        setLastResult(data)
        // draw overlay immediately if overlay canvas is present
        if (overlayRef.current) {
          drawBoxesOnOverlay(overlayRef.current, data)
        }
      } catch (err: any) {
        // Surface backend error messages to the UI for easier debugging on mobile
        console.error('Live detection error', err)
        const msg = err?.response?.data?.detail || err?.message || String(err)
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
        // Keep streaming but wait a bit to avoid spamming the backend
        await new Promise((r) => setTimeout(r, Math.max(500, intervalMs)))
      }
    } catch (err) {
      console.error(err)
    } finally {
      // schedule next capture
      setTimeout(() => {
        if (streaming) captureLoop()
      }, intervalMs)
    }
  }

  // Draw bounding boxes onto the overlay canvas, scaling from model image dims
  const drawBoxesOnOverlay = (canvas: HTMLCanvasElement, data: any) => {
    try {
      const ctx = canvas.getContext("2d")
      if (!ctx || !videoRef.current) return
      const video = videoRef.current
      const vw = video.videoWidth || video.clientWidth || canvas.width
      const vh = video.videoHeight || video.clientHeight || canvas.height

      // Match overlay canvas to displayed video size
      canvas.width = video.clientWidth || vw
      canvas.height = video.clientHeight || vh

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const preds = data?.predictions?.predictions || []
      const imgW = data?.predictions?.image_dimensions?.width || vw
      const imgH = data?.predictions?.image_dimensions?.height || vh

      // Scale factors from model image -> displayed video
      const sx = canvas.width / imgW
      const sy = canvas.height / imgH

      ctx.lineWidth = 2
      ctx.font = "14px sans-serif"

      preds.forEach((p: any) => {
        // Roboflow uses center x,y and width/height in many responses
        const cx = p.bounding_box.x
        const cy = p.bounding_box.y
        const bw = p.bounding_box.width
        const bh = p.bounding_box.height
        const left = (cx - bw / 2) * sx
        const top = (cy - bh / 2) * sy
        const w = bw * sx
        const h = bh * sy

  // Box (blue) and subtle fill for visibility
  ctx.lineWidth = 3
  ctx.strokeStyle = "rgba(59,130,246,0.95)" // blue
  ctx.fillStyle = "rgba(59,130,246,0.08)"
  ctx.strokeRect(left, top, w, h)
  ctx.fillRect(left, top, w, h)

  // Label background and text (cloud type + confidence)
  const label = `${p.class} ${(p.confidence * 100).toFixed(1)}%`
  const textWidth = ctx.measureText(label).width + 10
  const labelX = left
  const labelY = Math.max(0, top - 26)
  ctx.fillStyle = "rgba(59,130,246,0.9)"
  ctx.fillRect(labelX, labelY, textWidth, 22)
  // Label text
  ctx.fillStyle = "#fff"
  ctx.font = "bold 14px sans-serif"
  ctx.fillText(label, labelX + 6, labelY + 16)
      })
    } catch (err) {
      console.error("Error drawing overlay", err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => (streaming ? stop() : start())}
          className={`px-4 py-2 rounded-md font-medium ${streaming ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
        >
          {streaming ? "Stop Live" : "Start Live"}
        </button>
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">FPS</span>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.2}
            value={1000 / intervalMs}
            onChange={(e) => {
              const v = Number(e.target.value)
              setIntervalMs(Math.round(1000 / v))
            }}
          />
        </label>
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg relative overflow-hidden">
          <video ref={videoRef} className="w-full h-auto rounded-md bg-black object-cover aspect-video" playsInline muted />
          <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-semibold">Last Detection</h4>
          {lastResult ? (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Detections: {lastResult.predictions.summary.total_detections}</p>
              <ul className="mt-2 space-y-2">
                {lastResult.predictions.predictions.map((p: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.class}</span>
                    <span className="text-sm text-gray-500">{(p.confidence * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No frames analyzed yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
