'use client'

import { useState } from 'react'
import CadenceTracker from '@/components/ui/CadenceTracker'
import MusicPlayer from '@/components/ui/MusicPlayer'
import TrainingModule from '@/components/ui/TrainingModule'

export default function TrainingPage() {
  const [targetSPM, setTargetSPM] = useState(170)
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')

  const handleBPMChange = (bpm: number) => {
    // Adjust target SPM based on BPM changes
    setTargetSPM(bpm)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Running Cadence Training</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <CadenceTracker targetSPM={targetSPM} />
        <MusicPlayer targetBPM={targetSPM} onBPMChange={handleBPMChange} />
      </div>

      <div className="mb-8">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setLevel('beginner')}
            className={`btn-primary ${level === 'beginner' ? 'bg-secondary' : ''}`}
          >
            Beginner
          </button>
          <button
            onClick={() => setLevel('intermediate')}
            className={`btn-primary ${level === 'intermediate' ? 'bg-secondary' : ''}`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setLevel('advanced')}
            className={`btn-primary ${level === 'advanced' ? 'bg-secondary' : ''}`}
          >
            Advanced
          </button>
        </div>
        <TrainingModule level={level} targetSPM={targetSPM} />
      </div>
    </div>
  )
} 