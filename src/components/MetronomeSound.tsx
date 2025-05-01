'use client'

import React, { useEffect, useRef } from 'react'
import * as Tone from 'tone'

interface MetronomeSoundProps {
  isPlaying: boolean
  targetBPM: number
  soundType?: 'basic' | 'wood' | 'digital'
}

export default function MetronomeSound({ isPlaying, targetBPM, soundType = 'basic' }: MetronomeSoundProps) {
  const synthRef = useRef<Tone.Synth | null>(null)
  const loopRef = useRef<Tone.Loop | null>(null)

  // Create sound based on selected sound type
  useEffect(() => {
    // Initialize Tone.js
    Tone.start()

    // Different sound setup based on sound type
    if (soundType === 'basic') {
      // Simple sine wave for basic click
      synthRef.current = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
      }).toDestination()
    } else if (soundType === 'wood') {
      // Wooden metronome click sound
      synthRef.current = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }
      }).toDestination()
    } else if (soundType === 'digital') {
      // Digital electronic sound
      synthRef.current = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
      }).toDestination()
    }

    // Create a loop for the metronome
    loopRef.current = new Tone.Loop((time) => {
      if (synthRef.current) {
        if (soundType === 'basic') {
          synthRef.current.triggerAttackRelease('C6', '32n', time)
        } else if (soundType === 'wood') {
          // Low wooden sound
          synthRef.current.triggerAttackRelease('G3', '16n', time)
        } else if (soundType === 'digital') {
          // Electronic beep
          synthRef.current.triggerAttackRelease('C5', '32n', time)
        }
      }
    }, '4n') // Quarter note interval

    // Set initial BPM
    Tone.Transport.bpm.value = targetBPM / 2 // Divide by 2 because each step has 2 beats

    // Cleanup on unmount
    return () => {
      if (loopRef.current) {
        loopRef.current.dispose()
      }
      if (synthRef.current) {
        synthRef.current.dispose()
      }
    }
  }, [soundType])

  // Update BPM when targetBPM changes
  useEffect(() => {
    Tone.Transport.bpm.value = targetBPM / 2
  }, [targetBPM])

  // Start/stop metronome when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      // Ensure audio context is started (needed for iOS)
      if (Tone.context.state !== 'running') {
        Tone.context.resume()
      }
      
      if (loopRef.current) {
        loopRef.current.start(0)
      }
      
      Tone.Transport.start()
    } else {
      if (loopRef.current) {
        loopRef.current.stop()
      }
      
      Tone.Transport.stop()
    }
  }, [isPlaying])

  // No visible UI
  return null
} 