'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OperationBeacon() {
  const router = useRouter()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [matrixRain, setMatrixRain] = useState<Array<{left: string, top: string, delay: string, text: string}>>([])
  const [agentId, setAgentId] = useState('')

  useEffect(() => {
    setIsClient(true)
    // Generate consistent client-side random values
    const rainElements = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      text: Math.random() > 0.5 ? '01' : '10'
    }))
    setMatrixRain(rainElements)
    setAgentId(Math.random().toString(36).substr(2, 9).toUpperCase())
  }, [])

  const weeks = [
    {
      id: 1,
      title: 'Week 1: AI Memory Core',
      subtitle: 'Variables & Data Storage',
      description: 'Build the foundational memory systems for your AI agent prototype',
      character: '🎖️ Commander Atlas',
      status: 'available',
      lessons: 4,
      xp: 250,
      difficulty: 'BEGINNER',
      duration: '4 lessons',
      image: '/mission-images/week1-memory-core.jpg'
    },
    {
      id: 2, 
      title: 'Week 2: Agent Communication',
      subtitle: 'Print & Output',
      description: 'Program your AI to communicate and report critical intelligence',
      character: '🔧 Tech Chief Binary',
      status: 'locked',
      lessons: 4,
      xp: 300,
      difficulty: 'BEGINNER',
      duration: '4 lessons',
      image: '/mission-images/week2-communication.jpg'
    },
    {
      id: 3,
      title: 'Week 3: Interactive Agent', 
      subtitle: 'Input & User Interaction',
      description: 'Create an AI that can receive commands and adapt to user input',
      character: '📡 Operator Echo',
      status: 'locked',
      lessons: 5,
      xp: 350,
      difficulty: 'INTERMEDIATE',
      duration: '5 lessons',
      image: '/mission-images/week3-interactive.jpg'
    },
    {
      id: 4,
      title: 'Week 4: Tactical Calculations',
      subtitle: 'Basic Math & Operations', 
      description: 'Program your AI to perform real-time threat assessments and calculations',
      character: '🧠 Dr. Maya Nexus',
      status: 'locked',
      lessons: 5,
      xp: 400,
      difficulty: 'INTERMEDIATE',
      duration: '5 lessons',
      image: '/mission-images/week4-calculations.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Tactical Scan Lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-green-400 animate-pulse"
              style={{
                top: `${i * 5}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
        
        {/* Radar Sweep */}
        <div className="absolute top-4 right-4 w-32 h-32 border-2 border-green-400/20 rounded-full">
          <div className="absolute inset-0 border-t-2 border-green-400/60 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Matrix Rain Effect */}
        {isClient && (
          <div className="absolute inset-0 opacity-5">
            {matrixRain.map((rain, i) => (
              <div
                key={i}
                className="absolute text-green-400 font-mono text-xs animate-bounce"
                style={{
                  left: rain.left,
                  top: rain.top,
                  animationDelay: rain.delay,
                  animationDuration: '2s'
                }}
              >
                {rain.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="relative z-20 bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-lg border-b border-green-400/50 px-6 py-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">SYSTEMS: ONLINE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">COMMS: SECURE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400">THREAT LEVEL: MEDIUM</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <span className="text-cyan-400">AGENT ID: {isClient ? agentId : 'LOADING...'}</span>
            <span className="text-amber-400">CLEARANCE: TOP SECRET</span>
          </div>
        </div>
      </div>

      {/* Tactical Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/agent-academy-intel" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Mission HQ
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2 font-mono">
              <span className="text-green-400">🎯 BINARY SHORES ACADEMY</span>
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
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Mission Overview */}
          <div className="relative bg-black/80 backdrop-blur-lg border-2 border-red-400/60 rounded-xl p-6 mb-8 overflow-hidden">
            
            {/* Alert Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-pulse rounded-t-xl"></div>
            
            <div className="flex items-start space-x-4">
              <div className="text-6xl animate-pulse">🏔️</div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-red-400 font-mono">MISSION BRIEFING</h2>
                  <span className="bg-red-500 text-white px-3 py-1 text-xs font-mono animate-pulse">CODE RED</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
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
                  week.status === 'locked' ? 'opacity-60' : ''
                }`}
                onClick={() => week.status !== 'locked' && setSelectedWeek(week.id)}
              >
                {/* Week Card - Mission HQ Style */}
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-green-500/50 transition-all">
                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: week.status === 'available' 
                        ? 'linear-gradient(135deg, #1a3d2e 0%, #0f2922 50%, #1a5434 100%)'
                        : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #2a1a1a 100%)',
                      opacity: 0.8
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  
                  {/* Lock Overlay */}
                  {week.status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 text-red-500 mx-auto mb-2 text-4xl">🔒</div>
                        <div className="text-red-400 font-mono text-sm">CLASSIFIED</div>
                        <div className="text-gray-500 text-xs mt-1">CLEARANCE {week.difficulty === 'INTERMEDIATE' ? 'DELTA' : 'CHARLIE'}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-mono px-1 py-0.5 rounded ${
                          week.difficulty === 'INTERMEDIATE' ? 'bg-blue-900/80 text-blue-300' : 'bg-green-900/80 text-green-300'
                        }`}>
                          {week.difficulty}
                        </span>
                        {week.status === 'available' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{week.title}</h3>
                      <p className="text-xs text-gray-400 font-mono">{week.subtitle}</p>
                    </div>
                    
                    {/* Footer */}
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">{week.description}</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{week.duration}</span>
                        <span className="text-yellow-400">{week.xp} XP</span>
                      </div>
                      
                      {/* Progress bar placeholder for active weeks */}
                      {week.status === 'available' && (
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-800 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{width: '0%'}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Click overlay for navigation */}
                  {week.status === 'available' && (
                    <div 
                      className="absolute inset-0 bg-transparent hover:bg-green-400/5 transition-colors cursor-pointer"
                      onClick={() => router.push(`/mission/binary-shores-academy/week-${week.id}`)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mission Progress */}
          <div className="mt-8 relative bg-black/60 border-2 border-cyan-400/40 rounded-xl p-6 backdrop-blur-lg">
            
            <div className="flex items-center space-x-3 mb-4">
              <h3 className="text-cyan-400 font-mono font-bold">MISSION PROGRESS</h3>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
              <span className="bg-cyan-400/10 text-cyan-300 px-2 py-1 text-xs font-mono border border-cyan-400/30">TRACKING</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex-1 bg-gray-900/60 h-4 border-2 border-gray-600/60 rounded-full relative overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 via-cyan-400 to-green-400 h-full w-1/4 relative rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse rounded-full"></div>
              </div>
              <span className="text-green-400 font-mono font-bold text-lg">25%</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-green-400">● ACTIVE:</span>
                <span className="text-gray-300 ml-1">Week 1 Available</span>
              </div>
              <div>
                <span className="text-red-400">● LOCKED:</span>
                <span className="text-gray-300 ml-1">3 Weeks Secured</span>
              </div>
              <div>
                <span className="text-yellow-400">● BREACH:</span>
                <span className="text-gray-300 ml-1">0% Compromised</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}