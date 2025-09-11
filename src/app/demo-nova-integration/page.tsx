'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CoachNova from '@/components/CoachNova'

interface Challenge {
  id: number
  instruction: string
  hint: string
  correctCode: string
  explanation: string
}

export default function NovaIntegrationDemo() {
  const router = useRouter()
  
  // Coding Challenge System
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userCode, setUserCode] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  
  // Progress Tracking
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const [xpEarned, setXpEarned] = useState(0)

  // Coding Challenges
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "Create a variable called 'agent_callsign' and store your chosen codename",
      hint: "Remember: variable_name = 'text value' (use quotes for text)",
      correctCode: "agent_callsign = ",
      explanation: "Perfect! You've created your agent identity. Variables store data for later use in your missions."
    },
    {
      id: 2, 
      instruction: "Store the mission clearance level (number 7) in a variable called 'clearance_level'",
      hint: "Numbers don't need quotes: variable_name = number",
      correctCode: "clearance_level = 7",
      explanation: "Excellent! Numerical data is crucial for security protocols and access control."
    },
    {
      id: 3,
      instruction: "Set the mission status to active using a boolean variable called 'mission_active'",
      hint: "Boolean values: True or False (capital letters, no quotes)",
      correctCode: "mission_active = True",
      explanation: "Outstanding! Boolean variables control mission states and decision logic."
    },
    {
      id: 4,
      instruction: "Create a secret message using the variable 'encrypted_intel' with any classified text",
      hint: "Use quotes around your secret message: variable_name = 'Your secret message'",
      correctCode: "encrypted_intel = ",
      explanation: "Mission accomplished! You've successfully secured classified intelligence in a variable."
    }
  ]

  // Check user code
  const checkCode = () => {
    const trimmedCode = userCode.trim()
    const currentChallengeData = challenges[currentChallenge]
    
    // Special handling for variable challenges that can have any value
    if (currentChallenge === 0 || currentChallenge === 3) {
      const expectedStart = currentChallengeData.correctCode
      const isValid = trimmedCode.startsWith(expectedStart) && 
                     (trimmedCode.includes('"') || trimmedCode.includes("'"))
      if (isValid) {
        setIsCorrect(true)
        setFeedback(currentChallengeData.explanation)
        setCompletedChallenges(prev => [...prev, currentChallenge])
        setXpEarned(prev => prev + 25)
      } else {
        setIsCorrect(false)
        setFeedback("Check your syntax. Make sure you're using quotes around text values!")
      }
      return
    }
    
    // Standard check for other challenges
    if (trimmedCode === currentChallengeData.correctCode) {
      setIsCorrect(true)
      setFeedback(currentChallengeData.explanation)
      setCompletedChallenges(prev => [...prev, currentChallenge])
      setXpEarned(prev => prev + 25)
    } else {
      setIsCorrect(false)
      setFeedback("Not quite right. Check your syntax and try again!")
    }
  }

  // Next challenge
  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1)
      setUserCode('')
      setFeedback('')
      setIsCorrect(false)
      setShowHint(false)
    } else {
      // Demo complete
      alert('Demo Complete! Coach Nova integration successful!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/mission/binary-shores-academy/week-1" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Missions
            </Link>
            <h1 className="text-2xl font-bold text-white font-mono">
              <span className="text-green-400">🎯 COACH NOVA INTEGRATION DEMO</span> - Tactical AI Support
            </h1>
            <p className="text-gray-300 font-mono text-sm mt-2">
              Experience Agent Academy's new AI mentor system in action
            </p>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-mono font-bold">+{xpEarned} XP</div>
            <div className="text-gray-300 text-sm">{completedChallenges.length}/4 Complete</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Challenge Instructions */}
            <div className="space-y-6">
              {/* Demo Introduction */}
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-2 border-green-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                <h2 className="text-xl font-bold text-green-400 font-mono mb-3">
                  🤖 COACH NOVA INTEGRATION FEATURES
                </h2>
                <ul className="space-y-2 text-white font-mono text-sm">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Spy-themed personality with tactical language</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Collapsible floating interface (bottom-right)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Multiple modes: Support, Tactical, Analytical</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Progress tracking and lesson context awareness</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Integrates with existing AI response system</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-black/30 border border-green-400/30 rounded">
                  <p className="text-green-300 font-mono text-xs">
                    💡 TIP: Look for Coach Nova in the bottom-right corner! Click to expand and interact.
                  </p>
                </div>
              </div>

              {/* Current Challenge */}
              <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-400 font-mono">
                    Mission Objective {currentChallenge + 1}/4
                  </h2>
                  <div className="text-blue-400 font-mono text-sm">Variables Training</div>
                </div>
                
                <p className="text-white font-mono mb-4">
                  {challenges[currentChallenge].instruction}
                </p>
                
                {/* Hint Button */}
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-400/40 text-yellow-400 font-mono text-sm px-3 py-2 mb-4 transition-colors"
                >
                  💡 {showHint ? 'Hide Hint' : 'Request Hint'}
                </button>
                
                {showHint && (
                  <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-3 mb-4">
                    <p className="text-yellow-300 font-mono text-sm">
                      {challenges[currentChallenge].hint}
                    </p>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="bg-black/60 backdrop-blur-lg border-2 border-purple-400/40 p-6"
                     style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-400">
                      <span className="text-purple-400 text-lg">🎖️</span>
                    </div>
                    <div>
                      <h3 className="text-purple-400 font-mono font-bold mb-2">Mission Control</h3>
                      <p className={`font-mono text-sm ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                        {feedback}
                      </p>
                    </div>
                  </div>
                  
                  {isCorrect && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={nextChallenge}
                        className="bg-green-600 hover:bg-green-500 text-white font-mono px-4 py-2 transition-colors"
                        style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                      >
                        {currentChallenge < challenges.length - 1 ? 'Next Objective →' : 'Complete Demo →'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="space-y-6">
              <div className="bg-black/80 backdrop-blur-lg border-2 border-green-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h3 className="text-green-400 font-mono font-bold mb-4">🖥️ Tactical Code Terminal</h3>
                
                {/* Code Input */}
                <div className="bg-gray-900 border border-gray-600 p-4 mb-4">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Enter your Python code here..."
                    className="w-full h-32 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none"
                  />
                </div>
                
                {/* Execute Button */}
                <div className="flex justify-between">
                  <button 
                    onClick={() => setUserCode('')}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-mono px-4 py-2 transition-colors"
                  >
                    Clear Code
                  </button>
                  <button 
                    onClick={checkCode}
                    className="bg-green-600 hover:bg-green-500 text-white font-mono px-6 py-2 transition-colors"
                    style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                  >
                    Execute Mission
                  </button>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-black/40 border border-gray-600/30 p-4">
                <h4 className="text-white font-mono font-bold mb-3">Mission Progress</h4>
                <div className="space-y-2">
                  {challenges.map((_, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        completedChallenges.includes(index) ? 'bg-green-500 text-white' :
                        index === currentChallenge ? 'bg-yellow-500 text-black' :
                        'bg-gray-600 text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`font-mono text-sm ${
                        completedChallenges.includes(index) ? 'text-green-400' :
                        index === currentChallenge ? 'text-yellow-400' :
                        'text-gray-500'
                      }`}>
                        Objective {index + 1}
                        {completedChallenges.includes(index) && ' ✓'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integration Instructions */}
              <div className="bg-black/40 border border-cyan-400/30 p-4">
                <h4 className="text-cyan-400 font-mono font-bold mb-3">📋 Integration Guide</h4>
                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <p><span className="text-cyan-400">1.</span> Import CoachNova component</p>
                  <p><span className="text-cyan-400">2.</span> Add to lesson page JSX</p>
                  <p><span className="text-cyan-400">3.</span> Pass lesson context props</p>
                  <p><span className="text-cyan-400">4.</span> Configure difficulty level</p>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  See the component in action! →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coach Nova Integration */}
      <CoachNova 
        studentName="Agent Demo"
        lessonTitle="Coach Nova Integration Demo"
        currentChallenge={currentChallenge}
        totalChallenges={challenges.length}
        xpEarned={xpEarned}
        lessonContext={{
          type: 'lesson',
          difficulty: 'recruit',
          mission: 'Variable Operations Training'
        }}
      />
    </div>
  )
}