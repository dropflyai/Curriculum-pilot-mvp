'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CoachNova from '@/components/CoachNova'

interface Dialogue {
  character: string
  text: string
  image: string
  emotion?: 'neutral' | 'confident' | 'encouraging' | 'serious'
}

interface Challenge {
  id: number
  instruction: string
  hint: string
  correctCode: string
  explanation: string
}

export default function Lesson3() {
  const router = useRouter()
  
  // Cutscene & Dialogue System
  const [showCutscene, setShowCutscene] = useState(true)
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [showCharacter, setShowCharacter] = useState(false)
  
  // Coding Challenge System
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userCode, setUserCode] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  
  // Progress Tracking
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const [xpEarned, setXpEarned] = useState(0)

  // Opening Cutscene Dialogue
  const introDialogue: Dialogue[] = [
    {
      character: "Commander Atlas",
      text: "Agent, urgent situation! The Digital Fortress has infiltrated St. Michael's Academy. Their security system is blocking access to the chapel before morning prayer. We need immediate action!",
      image: "/Commander Atlas.png",
      emotion: "serious"
    },
    {
      character: "Dr. Maya Nexus", 
      text: "I've analyzed their system - it's using conditional logic to control access. We can reprogram it using Python if-statements to restore proper chapel access for the students and faculty.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging"
    },
    {
      character: "Commander Atlas",
      text: "Time is critical! Morning prayer starts in minutes. These conditional statements work like the monastery's ancient rules - if certain conditions are met, then specific actions follow.",
      image: "/Commander Atlas.png", 
      emotion: "confident"
    },
    {
      character: "Dr. Maya Nexus",
      text: "Think of it like the sacred schedule - if it's morning prayer time AND you're an authorized student, then access is granted. Master these logical pathways and you'll unlock their entire system!",
      image: "/Dr. Maya Nexus.png",
      emotion: "neutral"
    }
  ]

  // Coding Challenges
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "The chapel doors are locked! Check if current_time is greater than 6, then print 'Morning prayer access granted'",
      hint: "Use: if condition: (followed by indented print statement)",
      correctCode: "if current_time > 6:\n    print('Morning prayer access granted')",
      explanation: "Brilliant! Your conditional logic bypassed the first security layer. The chapel system now recognizes morning prayer hours."
    },
    {
      id: 2, 
      instruction: "Sacred files detected! If student_role equals 'altar_server', print 'Sacred archives unlocked', else print 'Permission required'",
      hint: "Use: if condition: ... else: ... (remember proper indentation)",
      correctCode: "if student_role == 'altar_server':\n    print('Sacred archives unlocked')\nelse:\n    print('Permission required')",
      explanation: "Excellent infiltration! The system now recognizes authorized altar servers and grants access to the sacred digital archives."
    },
    {
      id: 3,
      instruction: "Multiple access levels found! If prayer_level is 'novice' print 'Basic chapel access', if 'adept' print 'Sacristy access', else print 'Full sanctuary access'",
      hint: "Use: if condition1: ... elif condition2: ... else: ...",
      correctCode: "if prayer_level == 'novice':\n    print('Basic chapel access')\nelif prayer_level == 'adept':\n    print('Sacristy access')\nelse:\n    print('Full sanctuary access')",
      explanation: "Outstanding! Your multi-level conditional unlocked the hierarchical access system used by the monastery's digital network."
    },
    {
      id: 4,
      instruction: "Final security barrier! If both confession_booth_empty is True AND evening_vespers is True, print 'Secret passage revealed'",
      hint: "Use 'and' to combine conditions: if condition1 and condition2:",
      correctCode: "if confession_booth_empty == True and evening_vespers == True:\n    print('Secret passage revealed')",
      explanation: "Mission successful! You've discovered the hidden passage that leads to the next lesson's intelligence files. The monastery's secrets are now within reach!"
    }
  ]

  // Auto-advance cutscene dialogue
  useEffect(() => {
    if (showCutscene && currentDialogue < introDialogue.length) {
      const timer = setTimeout(() => {
        setShowCharacter(true)
        const nextTimer = setTimeout(() => {
          if (currentDialogue < introDialogue.length - 1) {
            setCurrentDialogue(prev => prev + 1)
            setShowCharacter(false)
          } else {
            setShowCutscene(false)
            setShowCharacter(false)
          }
        }, 6000) // Show dialogue for 6 seconds
        
        return () => clearTimeout(nextTimer)
      }, 500) // Character fade-in delay
      
      return () => clearTimeout(timer)
    }
  }, [currentDialogue, showCutscene, introDialogue.length])

  // Skip cutscene
  const skipCutscene = () => {
    setShowCutscene(false)
    setShowCharacter(false)
  }

  // Check user code
  const checkCode = () => {
    const trimmedCode = userCode.trim()
    const currentChallengeData = challenges[currentChallenge]
    
    // More flexible checking for conditional logic
    const codeLines = trimmedCode.split('\n').map(line => line.trim())
    const expectedLines = currentChallengeData.correctCode.split('\n').map(line => line.trim())
    
    // Check if the key elements are present
    let isValid = true
    for (const expectedLine of expectedLines) {
      if (expectedLine && !codeLines.some(codeLine => 
        codeLine.includes(expectedLine.replace(/\s+/g, ' ')) || 
        codeLine.replace(/\s+/g, ' ') === expectedLine.replace(/\s+/g, ' ')
      )) {
        isValid = false
        break
      }
    }
    
    if (isValid || trimmedCode.replace(/\s+/g, ' ') === currentChallengeData.correctCode.replace(/\s+/g, ' ')) {
      setIsCorrect(true)
      setFeedback(currentChallengeData.explanation)
      setCompletedChallenges(prev => [...prev, currentChallenge])
      setXpEarned(prev => prev + 25)
    } else {
      setIsCorrect(false)
      setFeedback("Not quite right. Check your syntax and conditional logic!")
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
      // Lesson complete
      router.push('/mission/operation-beacon/week-1?completed=lesson-3')
    }
  }

  if (showCutscene) {
    return (
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url('/Mission HQ Command Center.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Character Portrait */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          showCharacter ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {showCharacter && introDialogue[currentDialogue] && (
            <div className="relative">
              <img 
                src={introDialogue[currentDialogue].image}
                alt={introDialogue[currentDialogue].character}
                className="max-w-md h-auto drop-shadow-2xl object-cover"
                style={{
                  clipPath: 'polygon(25% 0%, 75% 0%, 75% 100%, 25% 100%)',
                  transform: 'scale(1.2)',
                  objectPosition: 'center'
                }}
              />
            </div>
          )}
        </div>

        {/* Dialogue Box */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-lg border-2 border-orange-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              
              {/* Character Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-orange-400 font-mono">
                  🎖️ {introDialogue[currentDialogue]?.character}
                </h3>
                <button 
                  onClick={skipCutscene}
                  className="text-gray-400 hover:text-white font-mono text-sm"
                >
                  Skip Cutscene →
                </button>
              </div>
              
              {/* Dialogue Text */}
              <p className="text-white font-mono text-lg leading-relaxed">
                {introDialogue[currentDialogue]?.text}
              </p>
              
              {/* Progress Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {introDialogue.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentDialogue ? 'bg-orange-400' : 
                      index < currentDialogue ? 'bg-orange-600' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-orange-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/mission/operation-beacon/week-1" className="text-orange-400 hover:text-orange-300 font-mono text-sm mb-2 block">
              ← Return to Week 1
            </Link>
            <h1 className="text-2xl font-bold text-white font-mono">
              <span className="text-orange-400">🤖 LESSON 3</span> - AI Decision Engine
            </h1>
          </div>
          <div className="text-right max-w-md">
            <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg mb-2">
              <div className="text-red-400 font-mono font-bold text-xs mb-1">🚨 URGENT MISSION</div>
              <div className="text-red-300 text-xs font-mono leading-tight">
                Digital Fortress security detected! Must reprogram chapel access system using conditional logic before morning prayer service begins.
              </div>
            </div>
            <div className="text-yellow-400 font-mono font-bold text-sm">+{xpEarned} XP</div>
            <div className="text-gray-300 text-xs">{completedChallenges.length}/4 Systems Bypassed</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Challenge Instructions */}
            <div className="space-y-6">
              {/* Current Challenge */}
              <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-400 font-mono">
                    Challenge {currentChallenge + 1}/4
                  </h2>
                  <div className="text-blue-400 font-mono text-sm">Conditional Logic</div>
                </div>
                
                <p className="text-white font-mono mb-4">
                  {challenges[currentChallenge].instruction}
                </p>
                
                {/* Hint Button */}
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-400/40 text-yellow-400 font-mono text-sm px-3 py-2 mb-4 transition-colors"
                >
                  💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                
                {showHint && (
                  <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-3 mb-4">
                    <p className="text-yellow-300 font-mono text-sm">
                      {challenges[currentChallenge].hint}
                    </p>
                  </div>
                )}
              </div>

              {/* Dr. Maya Nexus Feedback */}
              {feedback && (
                <div className="bg-black/60 backdrop-blur-lg border-2 border-purple-400/40 p-6"
                     style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  
                  <div className="flex items-start space-x-4">
                    <img 
                      src="/Dr. Maya Nexus_processed.png"
                      alt="Dr. Maya Nexus"
                      className="w-16 h-16 rounded-full border-2 border-purple-400"
                    />
                    <div>
                      <h3 className="text-purple-400 font-mono font-bold mb-2">Dr. Maya Nexus</h3>
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
                        {currentChallenge < challenges.length - 1 ? 'Next Challenge →' : 'Complete Lesson →'}
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                        Challenge {index + 1}
                        {completedChallenges.includes(index) && ' ✓'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column: Code Editor (Expanded) */}
            <div className="space-y-6">
              <div className="bg-black/80 backdrop-blur-lg border-2 border-orange-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h3 className="text-orange-400 font-mono font-bold mb-4">🖥️ Tactical Code Terminal</h3>
                
                {/* Code Input - Larger */}
                <div className="bg-gray-900 border border-gray-600 p-4 mb-4">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Type your Python conditional code here..."
                    className="w-full h-64 bg-transparent text-orange-400 font-mono text-sm resize-none focus:outline-none"
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
                    className="bg-orange-600 hover:bg-orange-500 text-white font-mono px-6 py-2 transition-colors"
                    style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                  >
                    Execute Code
                  </button>
                </div>
              </div>

              {/* Code Output/Console */}
              <div className="bg-black/60 backdrop-blur-lg border-2 border-green-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h4 className="text-green-400 font-mono font-bold mb-3">📟 Console Output</h4>
                <div className="bg-gray-900 border border-gray-600 p-4 min-h-[120px]">
                  <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                    {feedback ? (
                      isCorrect ? (
                        `✅ Code executed successfully!\n\n${feedback}`
                      ) : (
                        `❌ Execution failed!\n\n${feedback}`
                      )
                    ) : (
                      "Ready to execute code...\nType your Python conditional statements above and click 'Execute Code'."
                    )}
                  </pre>
                </div>
              </div>
            </div>

            {/* Right Column: AI Tutor */}
            <div className="space-y-6">
              <div className="bg-black/60 backdrop-blur-lg border-2 border-cyan-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                <h3 className="text-cyan-400 font-mono font-bold mb-4">🤖 Coach Nova AI Tutor</h3>
                <div className="space-y-4">
                  <CoachNova 
                    studentName="Agent"
                    lessonTitle="Tactical Decision Logic - Conditional Statements Training"
                    currentChallenge={currentChallenge}
                    totalChallenges={challenges.length}
                    xpEarned={xpEarned}
                    lessonContext={{
                      type: 'lesson',
                      difficulty: 'recruit',
                      mission: 'Operation Beacon - Week 1'
                    }}
                  />
                </div>
              </div>

              {/* Quick Reference Card */}
              <div className="bg-black/40 border border-gray-600/30 p-4">
                <h4 className="text-white font-mono font-bold mb-3">📋 Quick Reference</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-blue-300">
                    <span className="text-yellow-400">if</span> condition:
                  </div>
                  <div className="text-blue-300 ml-4">
                    # execute if true
                  </div>
                  <div className="text-blue-300">
                    <span className="text-yellow-400">elif</span> condition2:
                  </div>
                  <div className="text-blue-300 ml-4">
                    # execute if condition2 true
                  </div>
                  <div className="text-blue-300">
                    <span className="text-yellow-400">else</span>:
                  </div>
                  <div className="text-blue-300 ml-4">
                    # execute if all false
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <div className="text-gray-400">Operators:</div>
                    <div className="text-green-300">== != &gt; &lt; &gt;= &lt;=</div>
                    <div className="text-purple-300">and or not</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}