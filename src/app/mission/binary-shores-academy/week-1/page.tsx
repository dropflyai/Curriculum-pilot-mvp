'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Week1() {
  const router = useRouter()
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
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

  const lessons = [
    {
      id: 1,
      title: 'AI Memory Banks',
      subtitle: 'Programming Agent Memory',
      description: 'Create your AI\'s memory system to store critical information and threat data',
      concept: 'Variables store information: agent_name = "Guardian"',
      example: 'threat_level = 5, ai_status = "Active"',
      difficulty: 'BEGINNER',
      duration: '15 min',
      xp: 50,
      status: 'available'
    },
    {
      id: 2,
      title: 'Data Intelligence Types', 
      subtitle: 'Teaching AI to Recognize Data',
      description: 'Program your AI to understand different types of intelligence data',
      concept: 'AI processes strings, integers, floats, and boolean data',
      example: 'enemy_count = 12, coordinates = 40.7589',
      difficulty: 'BEGINNER',
      duration: '20 min', 
      xp: 100,
      status: 'available'
    },
    {
      id: 3,
      title: 'AI Decision Making',
      subtitle: 'Conditional Logic & Automation',
      description: 'Program your AI to make autonomous decisions and patrol protocols',
      concept: 'AI logic: if condition, then action (autonomous behavior)',
      example: 'if threat_detected: activate_defense()',
      difficulty: 'INTERMEDIATE',
      duration: '25 min',
      xp: 175,
      status: 'available'
    },
    {
      id: 4,
      title: 'AI Skill Modules',
      subtitle: 'Reusable AI Capabilities',
      description: 'Create specialized AI functions for threat analysis and response',
      concept: 'Modular AI skills: functions that can be called repeatedly',
      example: 'def analyze_threat(): return "threat_assessment"',
      difficulty: 'INTERMEDIATE',
      duration: '30 min',
      xp: 200,
      status: 'available'
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
            <Link href="/mission/binary-shores-academy" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Binary Shores Academy
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2 font-mono">
              <span className="text-green-400">🤖 WEEK 1</span> - AI Memory Core
            </h1>
            <p className="text-gray-300 font-mono">Building Your First AI Agent</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-mono text-xl">4 LESSONS</div>
            <div className="text-gray-300 text-sm">+525 Total XP</div>
          </div>
        </div>
      </div>

      {/* Commander Atlas Briefing */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-black/80 backdrop-blur-lg border-2 border-blue-400/60 rounded-xl p-6 mb-8 overflow-hidden">
            
            {/* Alert Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-pulse rounded-t-xl"></div>
            
            <div className="flex items-start space-x-4">
              <div className="text-6xl">🎖️</div>
              <div>
                <h2 className="text-2xl font-bold text-blue-400 font-mono mb-2">🚨 COMMANDER ATLAS - URGENT AI BRIEFING</h2>
                <p className="text-gray-300 font-mono mb-4">
                  "Agent, the situation is critical. Enemy AI systems are evolving rapidly, and we need our own 
                  intelligent defense system operational IMMEDIATELY. You will build our counter-AI from the ground up."
                </p>
                <p className="text-blue-300 font-mono text-sm mb-4">
                  "This week, you'll create the AI's foundational memory system using Python variables. Think of it as 
                  programming a digital brain that can remember, process, and act on critical information autonomously."
                </p>
                <div className="bg-red-500/10 border-l-4 border-red-400 p-4 mb-4">
                  <p className="text-red-300 font-mono text-sm">
                    <strong>NATIONAL THREAT LEVEL:</strong> CRITICAL - Enemy AI becoming more sophisticated daily. 
                    Our survival depends on building a superior counter-intelligence agent.
                  </p>
                </div>
                <div className="bg-blue-400/10 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-300 font-mono text-sm">
                    <strong>WEEK 1 MISSION:</strong> Build your AI's memory core and data processing systems. 
                    Each lesson makes your AI more intelligent and capable of autonomous operations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  lesson.status === 'locked' ? 'opacity-60' : ''
                }`}
                onClick={() => lesson.status !== 'locked' && setSelectedLesson(lesson.id)}
              >
                {/* Lesson Card - Mission HQ Style */}
                <div className="relative h-80 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-green-500/50 transition-all">
                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: lesson.status === 'available' 
                        ? 'linear-gradient(135deg, #1a3d2e 0%, #0f2922 50%, #1a5434 100%)'
                        : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #2a1a1a 100%)',
                      opacity: 0.8
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  
                  {/* Lock Overlay */}
                  {lesson.status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 text-red-500 mx-auto mb-2 text-4xl">🔒</div>
                        <div className="text-red-400 font-mono text-sm">CLASSIFIED</div>
                        <div className="text-gray-500 text-xs mt-1">CLEARANCE {lesson.difficulty === 'INTERMEDIATE' ? 'DELTA' : 'CHARLIE'}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-mono px-1 py-0.5 rounded ${
                          lesson.difficulty === 'INTERMEDIATE' ? 'bg-blue-900/80 text-blue-300' : 'bg-green-900/80 text-green-300'
                        }`}>
                          {lesson.difficulty}
                        </span>
                        {lesson.status === 'available' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{lesson.title}</h3>
                      <p className="text-xs text-gray-400 font-mono">{lesson.subtitle}</p>
                    </div>
                    
                    {/* Middle - Code Example */}
                    <div className="bg-gray-900/90 border border-gray-600/40 rounded-lg p-3 my-2">
                      <p className="text-cyan-400 font-mono text-xs mb-1">CONCEPT:</p>
                      <p className="text-gray-300 font-mono text-xs mb-2">{lesson.concept}</p>
                      <p className="text-green-400 font-mono text-xs mb-1">EXAMPLE:</p>
                      <code className="text-yellow-400 font-mono text-xs">{lesson.example}</code>
                    </div>
                    
                    {/* Footer */}
                    <div>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-2">{lesson.description}</p>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-400">{lesson.duration}</span>
                        <span className="text-yellow-400">{lesson.xp} XP</span>
                      </div>
                      
                      {/* Progress bar placeholder for active lessons */}
                      {lesson.status === 'available' && (
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
                  {lesson.status === 'available' && (
                    <div 
                      className="absolute inset-0 bg-transparent hover:bg-green-400/5 transition-colors cursor-pointer"
                      onClick={() => router.push(`/mission/binary-shores-academy/week-1/lesson-${lesson.id}`)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Challenges Section */}
          <div className="mb-8 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border-2 border-purple-400/40 rounded-xl p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 border border-purple-400/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border border-blue-400/30 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">⚡</div>
                <div>
                  <h3 className="text-purple-400 font-mono font-bold text-xl">NEW: Interactive Challenge Mode</h3>
                  <p className="text-purple-300 text-sm">Codefinity-style micro-challenges with real-time feedback</p>
                </div>
                <div className="flex-1"></div>
                <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg px-3 py-1">
                  <span className="text-purple-300 text-xs font-mono">BETA</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Challenge Mode Info */}
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Experience bite-sized coding challenges with instant validation, XP rewards, and achievements. 
                    Perfect for learning Python fundamentals through hands-on practice.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">Real-time code execution with Pyodide</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">Instant feedback and validation</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">XP system and achievements</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">Progressive difficulty with hints</span>
                    </div>
                  </div>
                </div>
                
                {/* Challenge Stats */}
                <div className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-4">
                  <h4 className="text-purple-400 font-mono font-bold mb-3">Challenge Overview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Challenges:</span>
                      <span className="text-white">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Focus Area:</span>
                      <span className="text-white">Variables & Data</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Time:</span>
                      <span className="text-white">6-8 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total XP:</span>
                      <span className="text-yellow-400">180 XP</span>
                    </div>
                  </div>
                  
                  <Link href="/mission/binary-shores-academy/week-1/challenges">
                    <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-3 rounded-lg text-white font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                      <span>⚡</span>
                      <span>Start Interactive Challenges</span>
                      <span>→</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Week Progress */}
          <div className="bg-black/60 border-2 border-cyan-400/40 rounded-xl p-6">
            <h3 className="text-cyan-400 font-mono font-bold mb-4">🤖 AI AGENT DEVELOPMENT PROGRESS</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 bg-gray-900/60 h-4 border-2 border-gray-600/60 rounded-full">
                <div className="bg-gradient-to-r from-green-500 to-cyan-400 h-full w-0 rounded-full"></div>
              </div>
              <span className="text-green-400 font-mono font-bold">0%</span>
            </div>
            
            {/* Learning Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 font-mono font-bold mb-2">🤖 AI DEVELOPMENT SKILLS</h4>
                <ul className="space-y-1">
                  <li className="text-gray-400 font-mono text-sm">• AI memory system creation</li>
                  <li className="text-gray-400 font-mono text-sm">• Intelligent data processing</li>
                  <li className="text-gray-400 font-mono text-sm">• Multi-variable AI state management</li>
                  <li className="text-gray-400 font-mono text-sm">• Agent knowledge base construction</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-mono font-bold mb-2">🛡️ DEFENSE APPLICATIONS</h4>
                <ul className="space-y-1">
                  <li className="text-gray-400 font-mono text-sm">• Threat level monitoring</li>
                  <li className="text-gray-400 font-mono text-sm">• Enemy AI tracking systems</li>
                  <li className="text-gray-400 font-mono text-sm">• Automated defense protocols</li>
                  <li className="text-gray-400 font-mono text-sm">• Real-time intelligence processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}