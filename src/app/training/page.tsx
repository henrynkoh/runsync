'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetronomeSound from '../../components/MetronomeSound'

type TrainingLevel = 'beginner' | 'intermediate' | 'advanced'
type SoundType = 'basic' | 'wood' | 'digital'

interface ExerciseStep {
  title: string
  duration: number
  targetSPM: number
  description: string
}

type TrainingProgram = Record<TrainingLevel, ExerciseStep[]>

export default function Training() {
  const [targetSPM, setTargetSPM] = useState(170)
  const [currentSPM, setCurrentSPM] = useState(0)
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>('intermediate')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTrainingActive, setIsTrainingActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [distance, setDistance] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundType, setSoundType] = useState<SoundType>('basic')

  const trainingPrograms: TrainingProgram = {
    beginner: [
      { title: 'Warm-up', duration: 5, targetSPM: 150, description: 'Start with an easy pace to warm up your muscles.' },
      { title: 'Main Set', duration: 15, targetSPM: 160, description: 'Focus on maintaining a consistent cadence.' },
      { title: 'Cool-down', duration: 5, targetSPM: 150, description: 'Gradually slow down to recover.' }
    ],
    intermediate: [
      { title: 'Warm-up', duration: 5, targetSPM: 160, description: 'Begin with a moderate pace to prepare for training.' },
      { title: 'Cadence Drill', duration: 10, targetSPM: 175, description: 'Increase your cadence and focus on form.' },
      { title: 'Recovery', duration: 3, targetSPM: 165, description: 'Brief recovery at a slightly lower cadence.' },
      { title: 'Speed Work', duration: 7, targetSPM: 180, description: 'Push yourself to maintain a higher cadence.' },
      { title: 'Cool-down', duration: 5, targetSPM: 160, description: 'Gradually reduce your pace to recover.' }
    ],
    advanced: [
      { title: 'Warm-up', duration: 5, targetSPM: 170, description: 'Begin with a brisk pace to prepare for intensive training.' },
      { title: 'High Cadence Drill', duration: 8, targetSPM: 185, description: 'Focus on quick, light steps at high cadence.' },
      { title: 'Recovery', duration: 2, targetSPM: 170, description: 'Brief recovery while maintaining good form.' },
      { title: 'Race Pace', duration: 10, targetSPM: 190, description: 'Maintain your target race cadence.' },
      { title: 'Recovery', duration: 2, targetSPM: 170, description: 'Short recovery period.' },
      { title: 'Final Push', duration: 5, targetSPM: 185, description: 'Strong finish at high cadence.' },
      { title: 'Cool-down', duration: 5, targetSPM: 170, description: 'Gradually reduce intensity to recover.' }
    ]
  }

  const currentProgram = trainingPrograms[trainingLevel];
  const currentExercise = currentProgram[currentStep];

  // Simulate cadence tracking
  useEffect(() => {
    if (!isTrainingActive) return;

    const interval = setInterval(() => {
      // Simulate random cadence around target with some variation
      const randomVariation = Math.floor(Math.random() * 10) - 5
      const newSPM = currentExercise.targetSPM + randomVariation
      setCurrentSPM(newSPM)
      
      // Simulate distance
      setDistance(prevDistance => {
        const metersPerMinute = newSPM * 0.75 // approximate stride length
        const metersPerSecond = metersPerMinute / 60
        return prevDistance + (metersPerSecond / 2) // update every 0.5 seconds
      })

      // Update elapsed time
      setElapsedTime(prev => prev + 0.5)
    }, 500)
    
    return () => clearInterval(interval)
  }, [isTrainingActive, currentExercise])

  // Check for step completion
  useEffect(() => {
    if (!isTrainingActive) return;
    
    if (elapsedTime >= currentExercise.duration * 60) {
      if (currentStep < currentProgram.length - 1) {
        setCurrentStep(prev => prev + 1);
        setElapsedTime(0);
      } else {
        // Training complete
        setIsTrainingActive(false);
      }
    }
  }, [elapsedTime, currentStep, currentExercise, currentProgram, isTrainingActive]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrainingLevel(e.target.value as TrainingLevel);
    setCurrentStep(0);
    setElapsedTime(0);
    setDistance(0);
    setIsTrainingActive(false);
  }

  const handleSoundTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSoundType(e.target.value as SoundType);
  }

  const handleStartStop = () => {
    if (isTrainingActive) {
      setIsTrainingActive(false);
    } else {
      setCurrentStep(0);
      setElapsedTime(0);
      setDistance(0);
      setIsTrainingActive(true);
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const percentComplete = (elapsedTime / (currentExercise.duration * 60)) * 100;
  
  // Determine the color based on how close current SPM is to target
  const getAccuracyColor = () => {
    const accuracy = Math.abs(currentSPM - currentExercise.targetSPM);
    if (accuracy <= 5) return 'text-green-400';
    if (accuracy <= 10) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      {/* Include the metronome sound component */}
      {soundEnabled && <MetronomeSound 
        isPlaying={isTrainingActive} 
        targetBPM={currentExercise.targetSPM}
        soundType={soundType} 
      />}

      <div className="border-b border-gray-700 pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Training Session</h1>
        <p className="text-gray-300">Improve your running cadence with real-time feedback and guided training.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-gray-300">
          {isTrainingActive ? 
            <span>Current cadence: <span className={`font-bold ${getAccuracyColor()}`}>{currentSPM}</span> spm</span> :
            <span>Target cadence: <span className="font-bold">{currentExercise.targetSPM}</span> spm</span>
          }
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {/* Sound Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSound}
              className="flex items-center space-x-1 text-gray-300 hover:text-white"
            >
              <span className={`text-sm ${soundEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {soundEnabled ? (
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                )}
              </svg>
            </button>
            
            {soundEnabled && (
              <select 
                value={soundType}
                onChange={handleSoundTypeChange}
                className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                disabled={isTrainingActive}
              >
                <option value="basic">Basic Click</option>
                <option value="wood">Metronome</option>
                <option value="digital">Electronic</option>
              </select>
            )}
          </div>

          {/* Training Level Selection */}
          <div className="flex items-center space-x-2">
            <label htmlFor="level" className="text-gray-300">Training Level:</label>
            <select 
              id="level" 
              value={trainingLevel} 
              onChange={handleLevelChange}
              className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1"
              disabled={isTrainingActive}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-xl mb-6">
        <motion.div layout>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-400">
              {isTrainingActive ? currentExercise.title : 'Training Program'}
            </h2>
            <button
              onClick={handleStartStop}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isTrainingActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isTrainingActive ? 'Stop Training' : 'Start Training'}
            </button>
          </div>

          {isTrainingActive ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <p className="text-gray-300 mb-2">{currentExercise.description}</p>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Step {currentStep + 1} of {currentProgram.length}</span>
                  <span className="text-gray-400">
                    {formatTime(elapsedTime)} / {formatTime(currentExercise.duration * 60)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min(percentComplete, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{currentSPM}</div>
                  <div className="text-xs text-gray-400">STEPS/MIN</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{distance.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">METERS</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                  <div className="text-xs text-gray-400">TIME</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-300 mb-4">Program Overview</h3>
              <div className="space-y-3">
                {currentProgram.map((step, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between">
                    <div>
                      <span className="font-medium text-white">{step.title}</span>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                    <div className="flex space-x-6 items-center">
                      <div className="text-right">
                        <span className="text-xs text-gray-400">DURATION</span>
                        <p className="text-white">{step.duration} min</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">CADENCE</span>
                        <p className="text-white">{step.targetSPM} spm</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 