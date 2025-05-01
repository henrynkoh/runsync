"use client"

import { useState, useEffect } from 'react'
import * as Tone from 'tone'

interface MusicPlayerProps {
  targetBPM: number
  onBPMChange: (bpm: number) => void
}

export default function MusicPlayer({ targetBPM, onBPMChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBPM, setCurrentBPM] = useState(targetBPM)

  useEffect(() => {
    // Initialize Tone.js
    Tone.start()
    
    // Create a metronome
    const metronome = new Tone.Player({
      url: '/metronome.wav',
      loop: true
    }).toDestination()

    // Set initial BPM
    Tone.Transport.bpm.value = currentBPM

    return () => {
      metronome.dispose()
    }
  }, [])

  const handlePlay = async () => {
    if (!isPlaying) {
      await Tone.start()
      Tone.Transport.start()
      setIsPlaying(true)
    } else {
      Tone.Transport.stop()
      setIsPlaying(false)
    }
  }

  const handleBPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBPM = parseInt(e.target.value)
    setCurrentBPM(newBPM)
    Tone.Transport.bpm.value = newBPM
    onBPMChange(newBPM)
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Music Synchronization</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-gray-700">BPM: {currentBPM}</label>
          <input
            type="range"
            min="100"
            max="240"
            value={currentBPM}
            onChange={handleBPMChange}
            className="w-48"
          />
        </div>
        <button
          onClick={handlePlay}
          className={`btn-primary ${isPlaying ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isPlaying ? 'Stop' : 'Start'} Metronome
        </button>
      </div>
    </div>
  )
} 