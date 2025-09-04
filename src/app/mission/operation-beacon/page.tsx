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
      title: 'Week 1: Intelligence Gathering',
      subtitle: 'Variables & Data Storage',
      description: 'Learn to store critical mission intelligence in your tactical computer',
      character: '🎖️ Commander Atlas',
      status: 'available',
      lessons: 4,
      xp: 250
    },
    {
      id: 2, 
      title: 'Week 2: Communication Protocols',
      subtitle: 'Print & Output',
      description: 'Establish secure communication channels with mission headquarters',
      character: '🔧 Tech Chief Binary',
      status: 'locked',
      lessons: 4,
      xp: 300
    },
    {
      id: 3,
      title: 'Week 3: Terminal Hacking', 
      subtitle: 'Input & User Interaction',
      description: 'Infiltrate enemy security terminals and extract classified data',
      character: '📡 Operator Echo',
      status: 'locked',
      lessons: 5,
      xp: 350
    },
    {
      id: 4,
      title: 'Week 4: Mission Calculations',
      subtitle: 'Basic Math & Operations', 
      description: 'Calculate optimal breach timing and tactical advantages',
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
            <p className="text-gray-300 font-mono">Digital Fortress - Perimeter Infiltration</p>
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
                <h2 className="text-2xl font-bold text-amber-400 font-mono mb-2">MISSION BRIEFING</h2>
                <p className="text-gray-300 font-mono mb-4">
                  Intelligence has discovered the BLACK CIPHER AI in a fortified mountain facility. 
                  You are a newly recruited agent beginning infiltration of the outer perimeter security systems.
                </p>
                <div className="bg-amber-400/10 border-l-4 border-amber-400 p-4">
                  <p className="text-amber-300 font-mono text-sm">
                    <strong>OBJECTIVE:</strong> Master Python fundamentals while infiltrating the Digital Fortress perimeter. 
                    Each week brings you closer to the facility's core systems.
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