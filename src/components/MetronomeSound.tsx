'use client'

import React, { useState, useEffect, useRef } from 'react'

interface MetronomeSoundProps {
  isPlaying: boolean
  targetBPM: number
  soundType?: 'basic' | 'wood' | 'digital'
}

export default function MetronomeSound({ isPlaying, targetBPM, soundType = 'basic' }: MetronomeSoundProps) {
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Create audio context on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()
    } catch (err) {
      console.error("Failed to create AudioContext:", err)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Initialize audio and hide the prompt
  const initializeAudio = () => {
    if (!audioContextRef.current) {
      console.error("No AudioContext available")
      return
    }
    
    audioContextRef.current.resume().then(() => {
      // Play a silent sound to fully unlock audio on iOS
      try {
        if (!audioContextRef.current) return;
        
        const buffer = audioContextRef.current.createBuffer(1, 1, 22050)
        const source = audioContextRef.current.createBufferSource()
        source.buffer = buffer
        source.connect(audioContextRef.current.destination)
        source.start(0)
        
        // Play a test click
        playClick()
        
        setAudioInitialized(true)
        setShowPrompt(false)
      } catch (err) {
        console.error("Error during audio initialization:", err)
      }
    }).catch(err => {
      console.error('Failed to start audio context:', err)
    })
  }

  // Play a single click sound
  const playClick = () => {
    if (!audioContextRef.current || audioContextRef.current.state !== 'running') {
      return
    }
    
    try {
      const ctx = audioContextRef.current
      
      // Create oscillator and gain node
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      // Configure the oscillator based on the sound type
      if (soundType === 'basic') {
        osc.type = 'sine'
        osc.frequency.value = 1200
      } else if (soundType === 'wood') {
        osc.type = 'triangle'
        osc.frequency.value = 450 
      } else { // digital
        osc.type = 'square'
        osc.frequency.value = 880
      }
      
      // Configure gain for volume envelope
      gainNode.gain.value = 0
      
      // Connect nodes
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Create sharp attack and quick decay (click sound)
      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.7, now + 0.005) // Very quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1) // Fast decay
      
      // Start and stop the oscillator
      osc.start(now)
      osc.stop(now + 0.1)
    } catch (err) {
      console.error("Error playing click:", err)
    }
  }

  // Start or stop the metronome based on isPlaying state
  useEffect(() => {
    if (isPlaying && audioInitialized) {
      // Clear previous interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      // Make sure audio context is running
      if (audioContextRef.current && audioContextRef.current.state !== 'running') {
        audioContextRef.current.resume().catch(err => console.error("Failed to resume AudioContext:", err))
      }
      
      // Calculate interval in milliseconds
      const intervalMs = (60 / targetBPM) * 1000
      
      // Play a click immediately
      playClick()
      
      // Set up interval for regular clicks
      intervalRef.current = setInterval(playClick, intervalMs)
    } else {
      // Stop the metronome
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, targetBPM, soundType, audioInitialized])

  // Render the prompt if audio isn't initialized yet
  if (!audioInitialized && showPrompt) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-purple-700 text-white text-center shadow-lg">
        <p className="mb-2 font-bold text-lg">Audio needs to be enabled for the metronome</p>
        <button 
          onClick={initializeAudio}
          className="px-8 py-4 bg-white text-purple-700 rounded-lg font-bold text-xl shadow-md active:bg-gray-200"
        >
          TAP HERE TO ENABLE SOUND
        </button>
        <p className="mt-2 text-sm opacity-80">
          Required for iPhone - you must tap this button or you won't hear any sound
        </p>
      </div>
    )
  }
  
  // No visual UI needed if initialized
  return null
} 