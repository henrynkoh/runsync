'use client'

import React, { useState } from 'react'

export default function Training() {
  const [targetSPM, setTargetSPM] = useState(170)
  const [currentSPM, setCurrentSPM] = useState(170)
  const [trainingLevel, setTrainingLevel] = useState('intermediate')

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="border-b border-gray-700 pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Training Session</h1>
        <p className="text-gray-300">Improve your running cadence with real-time feedback and guided training.</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-300">
          Your target cadence is <span className="font-bold">{targetSPM}</span> steps per minute.
        </p>
        <div className="flex items-center space-x-2">
          <label htmlFor="level" className="text-gray-300">Training Level:</label>
          <select 
            id="level" 
            value={trainingLevel} 
            onChange={(e) => setTrainingLevel(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Coming Soon</h2>
        <p className="text-gray-300 mb-4">
          The training module is being prepared for your iPhone. When you install the app
          on your device, you'll be able to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Track your real-time cadence</li>
          <li>Sync music to your running pace</li>
          <li>Follow structured training programs</li>
          <li>Monitor your progress over time</li>
        </ul>
      </div>
    </div>
  )
} 