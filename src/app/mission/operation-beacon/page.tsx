'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OperationBeacon() {
  const router = useRouter()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  const weeks = [
    {
      id: 1,
      title: 'Week 1: AI Memory Core',
      subtitle: 'Variables & Data Storage',
      description: 'Build the foundational memory systems for your AI agent prototype',
      character: '🎖️ Commander Atlas',
      status: 'available',
      lessons: 4,
      xp: 250
    },
    {
      id: 2, 
      title: 'Week 2: Agent Communication',
      subtitle: 'Print & Output',
      description: 'Program your AI to communicate and report critical intelligence',
      character: '🔧 Tech Chief Binary',
      status: 'locked',
      lessons: 4,
      xp: 300
    },
    {
      id: 3,
      title: 'Week 3: Interactive Agent', 
      subtitle: 'Input & User Interaction',
      description: 'Create an AI that can receive commands and adapt to user input',
      character: '📡 Operator Echo',
      status: 'locked',
      lessons: 5,
      xp: 350
    },
    {
      id: 4,
      title: 'Week 4: Tactical Calculations',
      subtitle: 'Basic Math & Operations', 
      description: 'Program your AI to perform real-time threat assessments and calculations',
      character: '🧠 Dr. Maya Nexus',
      status: 'locked',
      lessons: 5,
      xp: 400
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Tactical Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/student/dashboard" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Mission HQ
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2 font-mono">
              <span className="text-green-400">🎯 OPERATION BEACON</span>
            </h1>
            <p className="text-gray-300 font-mono">AI Agent Development - National Security Priority</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-mono text-xl">MISSION 1</div>
            <div className="text-gray-300 text-sm">Weeks 1-4</div>
          </div>
        </div>
      </div>

      {/* Mission Briefing */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Mission Overview */}
          <div className="bg-black/60 backdrop-blur-lg border-2 border-amber-400/40 p-6 mb-8"
               style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
            <div className="flex items-start space-x-4">
              <div className="text-6xl">🏔️</div>
              <div>
                <h2 className="text-2xl font-bold text-amber-400 font-mono mb-2">MISSION BRIEFING - CODE RED</h2>
                <p className="text-gray-300 font-mono mb-4">
                  🚨 NATIONAL SECURITY THREAT DETECTED: A rogue AI network is compromising global infrastructure. 
                  We need YOU to build a counter-AI agent capable of stopping this digital warfare before it's too late.
                </p>
                <div className="bg-red-500/10 border-l-4 border-red-400 p-4 mb-4">
                  <p className="text-red-300 font-mono text-sm">
                    <strong>URGENT:</strong> Enemy AI systems are learning faster than we can defend. 
                    Time is critical - we need our own super-intelligent agent operational ASAP.
                  </p>
                </div>
                <div className="bg-amber-400/10 border-l-4 border-amber-400 p-4">
                  <p className="text-amber-300 font-mono text-sm">
                    <strong>YOUR MISSION:</strong> Learn Python fundamentals to build increasingly sophisticated AI agents. 
                    Each week, your agent becomes more powerful - culminating in a super AI capable of national defense.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Week Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weeks.map((week) => (
              <div
                key={week.id}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  week.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => week.status === 'available' && setSelectedWeek(week.id)}
              >
                {/* Week Card */}
                <div className={`bg-black/60 backdrop-blur-lg border-2 p-6 ${
                  week.status === 'available' 
                    ? 'border-green-400/60 hover:border-green-300' 
                    : 'border-gray-600/40'
                }`}
                style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  
                  {/* Week Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        week.status === 'available' 
                          ? 'bg-green-400 text-black' 
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {week.id}
                      </div>
                      <div>
                        <h3 className={`font-bold font-mono ${
                          week.status === 'available' ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {week.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-mono">{week.subtitle}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-mono px-2 py-1 border ${
                      week.status === 'available' 
                        ? 'text-green-400 border-green-400/40 bg-green-400/10' 
                        : 'text-gray-500 border-gray-500/40 bg-gray-500/10'
                    }`}>
                      {week.status === 'available' ? 'READY' : 'LOCKED'}
                    </div>
                  </div>

                  {/* Week Description */}
                  <p className="text-gray-300 font-mono text-sm mb-4">{week.description}</p>

                  {/* Character & Stats */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-mono text-xs mb-1 ${
                        week.status === 'available' ? 'text-blue-400' : 'text-gray-500'
                      }`}>
                        INSTRUCTOR: {week.character}
                      </p>
                      <div className="flex space-x-4 text-xs">
                        <span className="text-cyan-400 font-mono">{week.lessons} Lessons</span>
                        <span className="text-yellow-400 font-mono">+{week.xp} XP</span>
                      </div>
                    </div>
                    
                    {week.status === 'available' && (
                      <button 
                        onClick={() => router.push(`/mission/operation-beacon/week-${week.id}`)}
                        className="bg-green-600 hover:bg-green-500 text-white font-mono text-sm px-4 py-2 transition-colors"
                        style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                      >
                        START WEEK
                      </button>
                    )}
                    
                    {week.status === 'locked' && (
                      <div className="text-gray-500 font-mono text-sm">🔒 Complete Previous Week</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Progress */}
          <div className="mt-8 bg-black/40 border border-gray-600/30 p-6">
            <h3 className="text-white font-mono font-bold mb-4">MISSION PROGRESS</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-800 h-4 border border-gray-600">
                <div className="bg-gradient-to-r from-green-500 to-cyan-400 h-full w-1/4"></div>
              </div>
              <span className="text-green-400 font-mono font-bold">25%</span>
            </div>
            <p className="text-gray-400 font-mono text-sm mt-2">
              Week 1 Available • 3 Weeks Locked • Perimeter Breach: 0%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}