"use client"

import React, { useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'

interface MusicPlayerProps {
  targetBPM: number
  onBPMChange: (bpm: number) => void
}

export default function MusicPlayer({ targetBPM, onBPMChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBPM, setCurrentBPM] = useState(targetBPM)
  const metronomeRef = useRef<Tone.Synth | null>(null)
  const loopRef = useRef<Tone.Loop | null>(null)

  useEffect(() => {
    // Initialize Tone.js
    Tone.start()
    
    // Create a synth for metronome sound
    metronomeRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();

    // Create a loop for the metronome
    loopRef.current = new Tone.Loop((time) => {
      if (metronomeRef.current) {
        metronomeRef.current.triggerAttackRelease('C6', '32n', time);
      }
    }, '4n');

    // Set initial BPM
    Tone.Transport.bpm.value = currentBPM;

    return () => {
      if (loopRef.current) {
        loopRef.current.dispose();
      }
      if (metronomeRef.current) {
        metronomeRef.current.dispose();
      }
    }
  }, [])

  useEffect(() => {
    Tone.Transport.bpm.value = currentBPM;
  }, [currentBPM]);

  const handlePlay = async () => {
    if (!isPlaying) {
      await Tone.start()
      if (loopRef.current) {
        loopRef.current.start(0);
      }
      Tone.Transport.start()
      setIsPlaying(true)
    } else {
      if (loopRef.current) {
        loopRef.current.stop();
      }
      Tone.Transport.stop()
      setIsPlaying(false)
    }
  }

  const handleBPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBPM = parseInt(e.target.value)
    setCurrentBPM(newBPM)
    onBPMChange(newBPM)
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Music Synchronization</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-gray-300">BPM: {currentBPM}</label>
          <input
            type="range"
            min="100"
            max="240"
            value={currentBPM}
            onChange={handleBPMChange}
            className="w-48 accent-blue-500"
          />
        </div>
        <button
          onClick={handlePlay}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isPlaying ? 'Stop' : 'Start'} Metronome
        </button>
      </div>
    </div>
  )
} 