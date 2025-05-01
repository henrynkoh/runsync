"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            RunSync
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Elevate your running experience with personalized cadence training and music synchronization.
          </p>
          <Link
            href="/training"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Training
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Real-time Cadence Tracking</h3>
            <p className="text-gray-300">
              Monitor your steps per minute (SPM) in real-time and receive instant feedback to maintain your target cadence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Music Synchronization</h3>
            <p className="text-gray-300">
              Train with a metronome or music that automatically syncs to your target cadence for a more engaging experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Personalized Training</h3>
            <p className="text-gray-300">
              Choose from beginner, intermediate, or advanced training programs tailored to your running goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-900 to-purple-900 p-12 rounded-2xl"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Running?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join RunSync today and discover the perfect rhythm for your runs.
          </p>
          <Link
            href="/training"
            className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </motion.div>
      </section>
    </main>
  )
} 