'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TestSound2() {
  const [status, setStatus] = useState('Ready to test sound')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Initialize audio handler
  const initAudio = async () => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContext) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const newContext = new AudioContext()
        setAudioContext(newContext)
        setStatus('Audio context created, trying to resume...')
        
        // Resume the context
        await newContext.resume()
        
        // Play a silent sound to unlock audio
        const buffer = newContext.createBuffer(1, 1, 22050)
        const source = newContext.createBufferSource()
        source.buffer = buffer
        source.connect(newContext.destination)
        source.start(0)
        
        setAudioEnabled(true)
        setStatus('✅ Audio initialized! Now try playing a sound.')
      } else {
        // Resume existing context
        await audioContext.resume()
        setAudioEnabled(true)
        setStatus('✅ Existing context resumed! Try playing a sound.')
      }
    } catch (err) {
      setStatus(`❌ Error: ${(err as Error).message}`)
    }
  }

  // Play a tone
  const playTone = async () => {
    if (!audioContext) {
      setStatus('No audio context available')
      return
    }
    
    try {
      // Ensure context is running
      await audioContext.resume()
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.type = 'sine'
      oscillator.frequency.value = 440 // A4 note
      gainNode.gain.value = 0.5
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
      
      setStatus('✅ Tone played! Did you hear it?')
    } catch (err) {
      setStatus(`❌ Error playing tone: ${(err as Error).message}`)
    }
  }
  
  // Check if we're on iOS
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-purple-400 mb-4">Sound Test Page</h1>
        
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <p>Device: {isIOS ? 'iOS' : 'Non-iOS'}</p>
          <p className="font-bold mt-2">Status: <span className="text-yellow-400">{status}</span></p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Step 1: Initialize Audio</h2>
            <button
              onClick={initAudio}
              className="w-full bg-green-600 text-white py-4 px-4 rounded-lg text-lg font-bold hover:bg-green-700 active:bg-green-800"
            >
              TAP HERE FIRST
            </button>
            <p className="text-sm mt-2 text-gray-400">This unlocks audio on iOS - you must tap this first</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Step 2: Test Sound</h2>
            <button
              onClick={playTone}
              disabled={!audioEnabled}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold ${!audioEnabled ? 'opacity-50' : 'hover:bg-blue-700 active:bg-blue-800'}`}
            >
              Play Tone
            </button>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/training" className="text-purple-400 hover:underline">
              Go to Training Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 