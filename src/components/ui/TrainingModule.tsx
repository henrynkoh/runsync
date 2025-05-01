'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface TrainingModuleProps {
  level: 'beginner' | 'intermediate' | 'advanced'
  targetSPM: number
}

export default function TrainingModule({ level, targetSPM }: TrainingModuleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const trainingSteps = {
    beginner: [
      { title: 'Warm-up', duration: 5, targetSPM: 150 },
      { title: 'Main Set', duration: 20, targetSPM: 160 },
      { title: 'Cool-down', duration: 5, targetSPM: 150 }
    ],
    intermediate: [
      { title: 'Warm-up', duration: 5, targetSPM: 160 },
      { title: 'Main Set', duration: 25, targetSPM: 170 },
      { title: 'Cool-down', duration: 5, targetSPM: 160 }
    ],
    advanced: [
      { title: 'Warm-up', duration: 5, targetSPM: 170 },
      { title: 'Main Set', duration: 30, targetSPM: 180 },
      { title: 'Cool-down', duration: 5, targetSPM: 170 }
    ]
  }

  const currentTraining = trainingSteps[level]
  const currentStepData = currentTraining[currentStep]

  const handleNext = () => {
    if (currentStep < currentTraining.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Training Session</h3>
      {!isCompleted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {currentTraining.length}</span>
            <span className="text-sm font-medium">{level}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-medium">{currentStepData.title}</h4>
            <p className="text-gray-600">Duration: {currentStepData.duration} minutes</p>
            <p className="text-gray-600">Target SPM: {currentStepData.targetSPM}</p>
          </div>
          <button onClick={handleNext} className="btn-primary w-full">
            {currentStep === currentTraining.length - 1 ? 'Complete Session' : 'Next Step'}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h4 className="text-lg font-medium">Training Completed!</h4>
          <p className="text-gray-600">Great job on completing your {level} training session.</p>
          <button
            onClick={() => {
              setCurrentStep(0)
              setIsCompleted(false)
            }}
            className="btn-primary"
          >
            Start New Session
          </button>
        </motion.div>
      )}
    </div>
  )
} 