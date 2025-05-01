'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CadenceTrackerProps {
  targetSPM: number
  onCadenceChange: (spm: number) => void
}

export default function CadenceTracker({ targetSPM, onCadenceChange }: CadenceTrackerProps) {
  const [currentSPM, setCurrentSPM] = useState(0)
  const [distance, setDistance] = useState(0)
  
  // Simulate cadence tracking
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random cadence around target with some variation
      const randomVariation = Math.floor(Math.random() * 10) - 5
      const newSPM = targetSPM + randomVariation
      setCurrentSPM(newSPM)
      onCadenceChange(newSPM)
      
      // Simulate distance
      setDistance(prevDistance => {
        const metersPerMinute = newSPM * 0.75 // approximate stride length
        const metersPerSecond = metersPerMinute / 60
        return prevDistance + (metersPerSecond / 5) // update every 0.2 seconds
      })
    }, 200)
    
    return () => clearInterval(interval)
  }, [targetSPM, onCadenceChange])
  
  const percentToTarget = (currentSPM / targetSPM) * 100
  const gaugeColor = 
    percentToTarget < 90 ? 'text-red-500' :
    percentToTarget > 110 ? 'text-yellow-500' :
    'text-green-500'
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4 text-green-400">Cadence Tracker</h3>
      
      <div className="space-y-6">
        <div className="text-center">
          <motion.div 
            className={`text-4xl font-bold ${gaugeColor}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            {currentSPM}
          </motion.div>
          <p className="text-gray-300 mt-1">steps per minute</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>0</span>
            <span>Target: {targetSPM}</span>
            <span>240</span>
          </div>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${gaugeColor} transition-all duration-300`}
              initial={{ width: '0%' }}
              animate={{ width: `${(currentSPM / 240) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-300 text-sm">Distance</p>
            <p className="text-xl font-semibold">{distance.toFixed(2)} m</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Time</p>
            <p className="text-xl font-semibold">00:00</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Calories</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
      </div>
    </div>
  )
} 