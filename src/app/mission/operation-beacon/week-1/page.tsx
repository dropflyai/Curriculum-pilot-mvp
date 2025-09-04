'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Week1() {
  const router = useRouter()
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)

  const lessons = [
    {
      id: 1,
      title: 'AI Memory Banks',
      subtitle: 'Programming Agent Memory',
      description: 'Create your AI\'s memory system to store critical information and threat data',
      concept: 'Variables store information: agent_name = "Guardian"',
      example: 'threat_level = 5, ai_status = "Active"',
      difficulty: 'Beginner',
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
      difficulty: 'Beginner',
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
      difficulty: 'Intermediate',
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
      difficulty: 'Intermediate',
      duration: '30 min',
      xp: 200,
      status: 'available'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Tactical Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/mission/operation-beacon" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Operation Beacon
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
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-400/40 p-6 mb-8"
               style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
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
                  lesson.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setSelectedLesson(lesson.id)}
              >
                <div className={`bg-black/60 backdrop-blur-lg border-2 p-6 ${
                  lesson.status === 'available' 
                    ? 'border-green-400/60 hover:border-green-300' 
                    : 'border-gray-600/40'
                }`}
                style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  
                  {/* Lesson Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        lesson.status === 'available' 
                          ? 'bg-green-400 text-black' 
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {lesson.id}
                      </div>
                      <div>
                        <h3 className={`font-bold font-mono ${
                          lesson.status === 'available' ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-mono">{lesson.subtitle}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-mono px-2 py-1 border ${
                      lesson.status === 'available' 
                        ? 'text-green-400 border-green-400/40 bg-green-400/10' 
                        : 'text-gray-500 border-gray-500/40 bg-gray-500/10'
                    }`}>
                      {lesson.status === 'available' ? 'READY' : 'LOCKED'}
                    </div>
                  </div>

                  {/* Lesson Description */}
                  <p className="text-gray-300 font-mono text-sm mb-4">{lesson.description}</p>

                  {/* Code Example */}
                  <div className="bg-gray-900/80 border border-gray-600/40 p-3 mb-4">
                    <p className="text-cyan-400 font-mono text-xs mb-1">CONCEPT:</p>
                    <p className="text-gray-300 font-mono text-sm mb-2">{lesson.concept}</p>
                    <p className="text-green-400 font-mono text-xs">EXAMPLE:</p>
                    <code className="text-yellow-400 font-mono text-sm">{lesson.example}</code>
                  </div>

                  {/* Lesson Stats & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-xs">
                      <span className="text-blue-400 font-mono">{lesson.difficulty}</span>
                      <span className="text-purple-400 font-mono">{lesson.duration}</span>
                      <span className="text-yellow-400 font-mono">+{lesson.xp} XP</span>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/mission/operation-beacon/week-1/lesson-${lesson.id}`)}
                      className="bg-green-600 hover:bg-green-500 text-white font-mono text-sm px-4 py-2 transition-colors"
                      style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                    >
                      START LESSON
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Week Progress */}
          <div className="bg-black/40 border border-gray-600/30 p-6">
            <h3 className="text-white font-mono font-bold mb-4">🤖 AI AGENT DEVELOPMENT PROGRESS</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 bg-gray-800 h-4 border border-gray-600">
                <div className="bg-gradient-to-r from-green-500 to-cyan-400 h-full w-0"></div>
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