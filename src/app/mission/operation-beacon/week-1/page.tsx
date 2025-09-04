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
      title: 'Mission Intel Storage',
      subtitle: 'Creating Your First Variables',
      description: 'Store target coordinates and facility data in your tactical computer',
      concept: 'Basic variable assignment: name = value',
      example: 'target_location = "Digital Fortress"',
      difficulty: 'Beginner',
      duration: '15 min',
      xp: 50,
      status: 'available'
    },
    {
      id: 2,
      title: 'Classified Data Types', 
      subtitle: 'Numbers, Text, and Boolean Intel',
      description: 'Learn to store different types of intelligence data',
      concept: 'String, Integer, Float, and Boolean variables',
      example: 'security_level = 5, is_secure = True',
      difficulty: 'Beginner',
      duration: '20 min', 
      xp: 75,
      status: 'locked'
    },
    {
      id: 3,
      title: 'Agent Profile Setup',
      subtitle: 'Multiple Variable Assignment',
      description: 'Create your complete agent profile with multiple data points',
      concept: 'Multiple variables and organization',
      example: 'agent_name, clearance_level, mission_code',
      difficulty: 'Beginner',
      duration: '20 min',
      xp: 75,
      status: 'locked'
    },
    {
      id: 4,
      title: 'Intelligence Database',
      subtitle: 'Variable Memory Challenge',
      description: 'Complete intelligence gathering by storing complex facility data',
      concept: 'Combining all variable concepts',
      example: 'Multi-step intelligence storage system',
      difficulty: 'Intermediate',
      duration: '25 min',
      xp: 100,
      status: 'locked'
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
              <span className="text-green-400">📊 WEEK 1</span> - Intelligence Gathering
            </h1>
            <p className="text-gray-300 font-mono">Variables & Data Storage</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-mono text-xl">4 LESSONS</div>
            <div className="text-gray-300 text-sm">+300 Total XP</div>
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
                <h2 className="text-2xl font-bold text-blue-400 font-mono mb-2">COMMANDER ATLAS - WEEK 1 BRIEFING</h2>
                <p className="text-gray-300 font-mono mb-4">
                  "Agent, welcome to your first week of tactical training. Before you can infiltrate the Digital Fortress, 
                  you must master the fundamental skill of intelligence storage."
                </p>
                <p className="text-blue-300 font-mono text-sm mb-4">
                  "Your tactical computer uses Python variables to store critical mission data. Each piece of intelligence 
                  must be properly labeled and stored for instant retrieval during field operations."
                </p>
                <div className="bg-blue-400/10 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-300 font-mono text-sm">
                    <strong>WEEK 1 OBJECTIVE:</strong> Master variable creation and data storage. 
                    Store target locations, security codes, and agent profiles in your system memory.
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
                onClick={() => lesson.status === 'available' && setSelectedLesson(lesson.id)}
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
                    
                    {lesson.status === 'available' && (
                      <button 
                        onClick={() => router.push(`/mission/operation-beacon/week-1/lesson-${lesson.id}`)}
                        className="bg-green-600 hover:bg-green-500 text-white font-mono text-sm px-4 py-2 transition-colors"
                        style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                      >
                        START LESSON
                      </button>
                    )}
                    
                    {lesson.status === 'locked' && (
                      <div className="text-gray-500 font-mono text-sm">🔒 Complete Previous</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Week Progress */}
          <div className="bg-black/40 border border-gray-600/30 p-6">
            <h3 className="text-white font-mono font-bold mb-4">WEEK 1 PROGRESS</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 bg-gray-800 h-4 border border-gray-600">
                <div className="bg-gradient-to-r from-green-500 to-cyan-400 h-full w-0"></div>
              </div>
              <span className="text-green-400 font-mono font-bold">0%</span>
            </div>
            
            {/* Learning Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 font-mono font-bold mb-2">INTELLIGENCE SKILLS</h4>
                <ul className="space-y-1">
                  <li className="text-gray-400 font-mono text-sm">• Variable creation and naming</li>
                  <li className="text-gray-400 font-mono text-sm">• Data type recognition</li>
                  <li className="text-gray-400 font-mono text-sm">• Multiple variable management</li>
                  <li className="text-gray-400 font-mono text-sm">• Intelligence database construction</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-mono font-bold mb-2">MISSION APPLICATIONS</h4>
                <ul className="space-y-1">
                  <li className="text-gray-400 font-mono text-sm">• Target location storage</li>
                  <li className="text-gray-400 font-mono text-sm">• Security code management</li>
                  <li className="text-gray-400 font-mono text-sm">• Agent profile creation</li>
                  <li className="text-gray-400 font-mono text-sm">• Facility data organization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}