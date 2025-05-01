'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface CadenceData {
  time: string
  spm: number
}

interface CadenceTrackerProps {
  targetSPM: number
}

export default function CadenceTracker({ targetSPM }: CadenceTrackerProps) {
  const [cadenceData, setCadenceData] = useState<CadenceData[]>([])
  const [currentSPM, setCurrentSPM] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Mock SPM calculation - replace with actual sensor data
      const mockSPM = Math.floor(Math.random() * (200 - 150 + 1)) + 150
      setCurrentSPM(mockSPM)
      setCadenceData(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), spm: mockSPM }
      ])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Real-Time Cadence</h3>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold">{currentSPM} SPM</p>
          <p className="text-sm text-gray-600">Current Steps Per Minute</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{targetSPM} SPM</p>
          <p className="text-sm text-gray-600">Target Steps Per Minute</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cadenceData}>
            <XAxis dataKey="time" />
            <YAxis domain={[150, 200]} />
            <Tooltip />
            <Line type="monotone" dataKey="spm" stroke="#0070f3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 