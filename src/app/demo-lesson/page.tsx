'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DemoLesson() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/50 to-red-700/50 backdrop-blur-lg border-b border-red-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-red-400 hover:text-red-300 font-mono text-sm mb-2 block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white font-mono">
              <span className="text-red-400">🎯 DEMO ACCESS</span>
            </h1>
            <p className="text-gray-300 font-mono">Quick access to lesson content for demonstration</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Demo Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Direct Lesson Access */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-green-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              
              <h2 className="text-2xl font-bold text-green-400 font-mono mb-4">
                🎮 First Lesson - Variables
              </h2>
              
              <p className="text-gray-300 font-mono mb-6">
                Interactive Python lesson with cutscene intro, coding challenges, and AI feedback from Dr. Maya Nexus.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-blue-400">✨</span>
                  <span className="text-gray-300 font-mono">Animated character cutscene</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-blue-400">⚡</span>
                  <span className="text-gray-300 font-mono">4 interactive coding challenges</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-blue-400">🏆</span>
                  <span className="text-gray-300 font-mono">XP rewards & progress tracking</span>
                </div>
              </div>
              
              <Link
                href="/mission/operation-beacon/week-1/lesson-1"
                className="block w-full bg-green-600 hover:bg-green-500 text-white font-mono text-center py-3 px-6 transition-colors"
                style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
              >
                🚀 START LESSON 1
              </Link>
            </div>

            {/* Mission Overview */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              
              <h2 className="text-2xl font-bold text-blue-400 font-mono mb-4">
                🗺️ Mission Overview
              </h2>
              
              <p className="text-gray-300 font-mono mb-6">
                View the Operation Beacon mission briefing and week structure.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-amber-400">📋</span>
                  <span className="text-gray-300 font-mono">Mission briefing & objectives</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-amber-400">📅</span>
                  <span className="text-gray-300 font-mono">4-week structure overview</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-amber-400">🎖️</span>
                  <span className="text-gray-300 font-mono">Character introductions</span>
                </div>
              </div>
              
              <Link
                href="/mission/operation-beacon"
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-center py-3 px-6 transition-colors"
                style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
              >
                📊 VIEW MISSION BRIEFING
              </Link>
            </div>
          </div>

          {/* Alternative Routes */}
          <div className="bg-black/40 border border-amber-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-400 font-mono mb-4">
              🛠️ Additional Demo Routes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/mission-hq" 
                className="bg-purple-900/20 border border-purple-400/40 text-purple-300 hover:text-purple-200 font-mono text-sm px-4 py-3 text-center transition-colors"
              >
                🏛️ Mission HQ
              </Link>
              
              <Link
                href="/student/dashboard"
                className="bg-cyan-900/20 border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 font-mono text-sm px-4 py-3 text-center transition-colors"
              >
                👤 Student Dashboard
              </Link>
              
              <Link
                href="/mission/operation-beacon/week-1"
                className="bg-orange-900/20 border border-orange-400/40 text-orange-300 hover:text-orange-200 font-mono text-sm px-4 py-3 text-center transition-colors"
              >
                📚 Week 1 Overview
              </Link>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="mt-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-red-300 font-mono font-bold mb-3">🎯 DEMO INSTRUCTIONS</h3>
            <div className="text-gray-300 font-mono text-sm space-y-2">
              <p>• Click <strong>"START LESSON 1"</strong> for the full interactive lesson experience</p>
              <p>• The lesson includes character dialogue, coding challenges, and instant feedback</p>
              <p>• Use <strong>"Skip Cutscene"</strong> button if you need to jump to coding quickly</p>
              <p>• All routes work without authentication for demo purposes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}