'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function TestSound() {
  const [status, setStatus] = useState('Ready to test audio')
  const [contextStarted, setContextStarted] = useState(false)
  
  // Check for iOS
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  
  // Initialize audio context
  const audioContextRef = useRef<AudioContext | null>(null)
  
  useEffect(() => {
    // Try to create AudioContext for WebAudio API method
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()
      console.log("AudioContext created, state:", audioContextRef.current.state)
    } catch (err) {
      console.error("Could not create AudioContext:", err)
    }
    
    return () => {
      // Cleanup
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.close().catch(console.error)
      }
    }
  }, [])
  
  // Play using Web Audio API
  const playTone = (frequency: number = 880, duration: number = 0.5) => {
    if (!audioContextRef.current) {
      setStatus('❌ AudioContext not available')
      return
    }
    
    try {
      // Make sure context is running (iOS requirement)
      if (audioContextRef.current.state !== 'running') {
        audioContextRef.current.resume().then(() => {
          setContextStarted(true)
          setStatus('AudioContext started - now try playing a sound')
          // Try playing the tone again after context is started
          setTimeout(() => playTone(frequency, duration), 100)
        }).catch(err => {
          console.error("Failed to resume context:", err)
          setStatus(`❌ Failed to start AudioContext: ${err.message}`)
        })
        return
      }
      
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      
      gainNode.gain.value = 0.5
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.start()
      oscillator.stop(ctx.currentTime + duration)
      
      setStatus(`✅ Tone played at ${frequency}Hz for ${duration}s`)
    } catch (err) {
      setStatus(`❌ Error playing tone: ${(err as Error).message}`)
    }
  }
  
  // Play metronome-like click
  const playClick = () => {
    if (!audioContextRef.current) {
      setStatus('❌ AudioContext not available')
      return
    }
    
    try {
      // Make sure context is running (iOS requirement)
      if (audioContextRef.current.state !== 'running') {
        audioContextRef.current.resume().then(() => {
          setContextStarted(true)
          setStatus('AudioContext started - now try playing a click')
          // Try playing the click again after context is started
          setTimeout(playClick, 100)
        }).catch(err => {
          console.error("Failed to resume context:", err)
          setStatus(`❌ Failed to start AudioContext: ${err.message}`)
        })
        return
      }
      
      const ctx = audioContextRef.current
      
      // Create and configure oscillator
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 1500 // Higher pitch for better mobile audibility
      
      // Create and configure gain node for envelope
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0
      
      // Connect nodes
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Create sharp attack and quick decay
      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.8, now + 0.01) // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1) // Fast decay
      
      // Start and stop
      osc.start(now)
      osc.stop(now + 0.1)
      
      setStatus('✅ Click sound played - this is what the metronome uses')
    } catch (err) {
      setStatus(`❌ Error playing click: ${(err as Error).message}`)
    }
  }
  
  // Play a metronome sequence
  const playMetronomeSequence = () => {
    if (!audioContextRef.current || audioContextRef.current.state !== 'running') {
      // Initialize audio first
      if (audioContextRef.current) {
        audioContextRef.current.resume().then(() => {
          setContextStarted(true)
          setStatus('AudioContext started - now playing metronome')
          // Start sequence after context is running
          startMetronomeSequence()
        }).catch(err => {
          setStatus(`❌ Failed to start AudioContext: ${err.message}`)
        })
      }
      return
    }
    
    startMetronomeSequence()
  }
  
  const startMetronomeSequence = () => {
    const bpm = 120 // 120 beats per minute
    const intervalMs = (60 / bpm) * 1000 // Convert BPM to milliseconds
    let count = 0
    
    setStatus('▶️ Playing metronome sequence at 120 BPM...')
    
    // Play first click immediately
    playClick()
    
    // Set up interval for remaining clicks
    const intervalId = setInterval(() => {
      count++
      playClick()
      
      // Stop after 8 beats
      if (count >= 7) {
        clearInterval(intervalId)
        setStatus('✅ Completed metronome sequence (8 beats)')
      }
    }, intervalMs)
  }
  
  // Initialize the audio context
  const initializeAudio = () => {
    if (!audioContextRef.current) {
      setStatus('❌ AudioContext could not be created')
      return
    }
    
    audioContextRef.current.resume().then(() => {
      setContextStarted(true)
      setStatus('✅ AudioContext initialized successfully!')
      
      // Play a silent sound to fully unlock audio on iOS
      try {
        const ctx = audioContextRef.current!
        const buffer = ctx.createBuffer(1, 1, 22050)
        const source = ctx.createBufferSource()
        source.buffer = buffer
        source.connect(ctx.destination)
        source.start(0)
      } catch (err) {
        console.error("Error playing silent sound:", err)
      }
    }).catch(err => {
      setStatus(`❌ Failed to initialize AudioContext: ${err.message}`)
    })
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Audio Test Page</h1>
      
      <div className="bg-purple-800 text-white p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">STATUS: {status}</h2>
        <p className="mb-4">Device: {isIOS ? 'iOS device detected' : 'Non-iOS device'}</p>
        <p className="mb-4">AudioContext state: {audioContextRef.current?.state || 'Not created'}</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Step 1: Initialize Audio System</h2>
          <button
            onClick={initializeAudio}
            className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 active:bg-green-800"
          >
            TAP HERE FIRST (Initialize Audio)
          </button>
          <p className="mt-2 text-sm text-gray-400">This will unlock audio on iOS. You must tap this button first.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Step 2: Test Different Sounds</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              onClick={() => playTone(440, 0.5)} // A4 note
              disabled={!contextStarted}
              className="py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
            >
              Play Low Tone
            </button>
            
            <button
              onClick={() => playTone(880, 0.5)} // A5 note
              disabled={!contextStarted}
              className="py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50"
            >
              Play High Tone
            </button>
            
            <button
              onClick={playClick}
              disabled={!contextStarted}
              className="py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
            >
              Play Click Sound
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Step 3: Test Metronome</h2>
          <button
            onClick={playMetronomeSequence}
            disabled={!contextStarted}
            className="w-full py-4 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 active:bg-yellow-800 disabled:opacity-50"
          >
            Play Metronome Sequence (8 beats)
          </button>
          <p className="mt-2 text-sm text-gray-400">This will play 8 clicks at 120 BPM (2 beats per second)</p>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/training" className="text-white bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700">
            Return to Training Page
          </Link>
        </div>
      </div>
    </div>
  )
} 