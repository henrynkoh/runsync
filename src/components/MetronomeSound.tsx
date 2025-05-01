'use client'

import React, { useState, useEffect, useRef } from 'react'

interface MetronomeSoundProps {
  isPlaying: boolean
  targetBPM: number
  soundType?: 'basic' | 'wood' | 'digital'
}

export default function MetronomeSound({ isPlaying, targetBPM, soundType = 'basic' }: MetronomeSoundProps) {
  const [audioReady, setAudioReady] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)
  const [initializationError, setInitializationError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up intervals and audio context on unmount
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
      
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close().catch(err => {
            console.error('Error closing AudioContext:', err)
          })
        } catch (err) {
          console.error('Error during cleanup:', err)
        }
      }
    }
  }, [])

  // Initialize audio
  const initializeAudio = async () => {
    setInitializationAttempted(true)
    setInitializationError(null)
    
    try {
      // Create audio context if needed
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContext()
      }
      
      // Make sure audio context is running
      if (audioContextRef.current.state !== 'running') {
        await audioContextRef.current.resume()
      }
      
      // Play a silent sound to unlock audio on iOS
      const ctx = audioContextRef.current
      const buffer = ctx.createBuffer(1, 1, 22050)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start(0)
      
      // Play a test tone (helps verify audio is working)
      await new Promise(resolve => setTimeout(resolve, 100))
      playTestTone()
      
      setAudioReady(true)
    } catch (err) {
      console.error('Audio initialization error:', err)
      setInitializationError((err as Error).message || 'Unknown audio error')
      setAudioReady(false)
    }
  }
  
  // Play a simple test tone
  const playTestTone = () => {
    if (!audioContextRef.current) return
    
    try {
      const ctx = audioContextRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.frequency.value = 440
      osc.type = 'sine'
      gain.gain.value = 0.2
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch (err) {
      console.error('Error playing test tone:', err)
    }
  }
  
  // Play a metronome click sound
  const playClick = () => {
    if (!audioContextRef.current) return
    
    try {
      const ctx = audioContextRef.current
      
      // Ensure context is running
      if (ctx.state !== 'running') {
        ctx.resume().catch(err => console.error('Error resuming context:', err))
        return // Skip this click if context isn't ready
      }
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      // Configure based on sound type
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
      
      // Volume envelope
      gain.gain.value = 0
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      // Click sound
      const now = ctx.currentTime
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.7, now + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      
      osc.start(now)
      osc.stop(now + 0.1)
    } catch (err) {
      console.error('Error playing click sound:', err)
    }
  }
  
  // Start/stop the metronome
  useEffect(() => {
    const startMetronome = async () => {
      if (!audioContextRef.current || !audioReady) return
      
      try {
        // Make sure context is running
        if (audioContextRef.current.state !== 'running') {
          await audioContextRef.current.resume()
        }
        
        // Clear any existing interval
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
        }
        
        // Calculate interval from BPM
        const intervalMs = (60 / targetBPM) * 1000
        
        // Play first click
        playClick()
        
        // Set up regular interval
        intervalIdRef.current = setInterval(playClick, intervalMs)
      } catch (err) {
        console.error('Error starting metronome:', err)
      }
    }
    
    const stopMetronome = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
    }
    
    if (isPlaying && audioReady) {
      startMetronome()
    } else {
      stopMetronome()
    }
    
    return () => {
      stopMetronome()
    }
  }, [isPlaying, targetBPM, audioReady, soundType])
  
  // Check if we're on iOS
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  
  // Render audio initialization prompt if needed
  if (!audioReady) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-purple-700 text-white text-center shadow-lg">
        <p className="mb-2 font-bold text-lg">Tap below to enable sound</p>
        <button 
          onClick={initializeAudio}
          className="px-8 py-4 bg-white text-purple-700 rounded-lg font-bold text-xl shadow-md active:bg-gray-200"
        >
          ENABLE METRONOME SOUND
        </button>
        {initializationAttempted && initializationError && (
          <p className="mt-2 text-sm text-red-300">
            Error: {initializationError}. Try tapping again.
          </p>
        )}
        <p className="mt-2 text-sm opacity-80">
          {isIOS ? "iPhones require user interaction before playing sound" : "This unlocks audio playback"}
        </p>
        {isIOS && (
          <p className="mt-1 text-xs opacity-70">
            Make sure your device is not on silent mode
          </p>
        )}
      </div>
    )
  }
  
  return null
} 