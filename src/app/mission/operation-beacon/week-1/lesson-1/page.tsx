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

export default function Lesson1() {
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
      text: "Agent, URGENT: Enemy AI systems are infiltrating our networks globally. You must immediately begin building our counter-AI defense system. Time is critical.",
      image: "/Commander Atlas_processed.png",
      emotion: "serious"
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Agent, I'm Dr. Maya Nexus. We're racing against time to build an AI that can outsmart the enemy. Variables are your AI's memory - without them, it can't think or act.",
      image: "/Dr. Maya Nexus_processed.png",
      emotion: "encouraging"
    },
    {
      character: "Commander Atlas",
      text: "Your AI needs variables to remember threat levels, enemy positions, and defense protocols. Each variable you create makes our AI more intelligent than theirs.",
      image: "/Commander Atlas_processed.png", 
      emotion: "confident"
    },
    {
      character: "Dr. Maya Nexus",
      text: "Your AI's survival depends on remembering data. Program its memory using: ai_status = 'Active'. Every second counts - the enemy AI is learning too. Begin now!",
      image: "/Dr. Maya Nexus_processed.png",
      emotion: "neutral"
    }
  ]

  // Coding Challenges
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "Program your AI's identity by storing 'Guardian AI' in a variable called ai_name",
      hint: "Give your AI a name: ai_name = 'Guardian AI' (use quotes for text)",
      correctCode: "ai_name = \"Guardian AI\"",
      explanation: "Excellent! Your AI now has an identity. This is the first step in creating an intelligent agent that can defend our systems."
    },
    {
      id: 2, 
      instruction: "Set your AI's initial threat level to 3 by storing it in a variable called threat_level",
      hint: "Numbers don't need quotes: threat_level = 3",
      correctCode: "threat_level = 3",
      explanation: "Perfect! Your AI can now track threat levels. This numerical data helps it assess danger and respond appropriately."
    },
    {
      id: 3,
      instruction: "Create your AI's creator signature in a variable called developer_name (use your own name or codename)",
      hint: "Use quotes around your name: developer_name = 'Your Name'",
      correctCode: "developer_name = ",
      explanation: "Great work! Your AI knows who created it. This creates accountability and helps with command authorization protocols."
    },
    {
      id: 4,
      instruction: "Activate your AI by creating a variable called ai_status and setting it to True",
      hint: "Boolean values: True or False (capital letters, no quotes)",
      correctCode: "ai_status = True",
      explanation: "Mission critical! Your AI is now ACTIVE. Boolean variables let your AI make yes/no decisions for autonomous operations."
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
        }, 3000) // Show dialogue for 3 seconds
        
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
    
    // Special handling for challenge 3 (agent name - can be anything)
    if (currentChallenge === 2) {
      const isValidAgentName = trimmedCode.startsWith('agent_name = ') && 
                              (trimmedCode.includes('"') || trimmedCode.includes("'"))
      if (isValidAgentName) {
        setIsCorrect(true)
        setFeedback(currentChallengeData.explanation)
        setCompletedChallenges(prev => [...prev, currentChallenge])
        setXpEarned(prev => prev + 25)
      } else {
        setIsCorrect(false)
        setFeedback("Remember: agent_name = 'Your Codename' (use quotes around text)")
      }
      return
    }
    
    // Standard check for other challenges
    if (trimmedCode === currentChallengeData.correctCode || 
        (currentChallengeData.correctCode.includes('= ') && trimmedCode.startsWith(currentChallengeData.correctCode))) {
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
      // Lesson complete
      router.push('/mission/operation-beacon/week-1?completed=lesson-1')
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
            <div className="bg-black/80 backdrop-blur-lg border-2 border-green-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              
              {/* Character Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-400 font-mono">
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
                      index === currentDialogue ? 'bg-green-400' : 
                      index < currentDialogue ? 'bg-green-600' : 'bg-gray-600'
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
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/mission/operation-beacon/week-1" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Week 1
            </Link>
            <h1 className="text-2xl font-bold text-white font-mono">
              <span className="text-green-400">🤖 LESSON 1</span> - AI Memory Core Programming
            </h1>
          </div>
          <div className="text-right max-w-md">
            <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg mb-2">
              <div className="text-blue-400 font-mono font-bold text-xs mb-1">📡 INTEL BRIEFING</div>
              <div className="text-blue-300 text-xs font-mono leading-tight">
  URGENT: Enemy AI systems are becoming self-aware. Build your counter-AI's memory system before they achieve full autonomy. National security depends on it.
              </div>
            </div>
            <div className="text-yellow-400 font-mono font-bold text-sm">+{xpEarned} XP</div>
            <div className="text-gray-300 text-xs">{completedChallenges.length}/4 Intel Secured</div>
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
                  <div className="text-blue-400 font-mono text-sm">Variables Basics</div>
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
              <div className="bg-black/80 backdrop-blur-lg border-2 border-green-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h3 className="text-green-400 font-mono font-bold mb-4">🖥️ Tactical Code Terminal</h3>
                
                {/* Code Input - Larger */}
                <div className="bg-gray-900 border border-gray-600 p-4 mb-4">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Type your Python code here..."
                    className="w-full h-64 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none"
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
                    Execute Code
                  </button>
                </div>
              </div>

              {/* Code Output/Console */}
              <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h4 className="text-blue-400 font-mono font-bold mb-3">📟 Console Output</h4>
                <div className="bg-gray-900 border border-gray-600 p-4 min-h-[120px]">
                  <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                    {feedback ? (
                      isCorrect ? (
                        `✅ Code executed successfully!\n\n${feedback}`
                      ) : (
                        `❌ Execution failed!\n\n${feedback}`
                      )
                    ) : (
                      "Ready to execute code...\nType your Python variable assignments above and click 'Execute Code'."
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
                    lessonTitle="Mission Intel Storage - Variables Training"
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
                    <span className="text-yellow-400">variable_name</span> = <span className="text-green-300">value</span>
                  </div>
                  <div className="text-gray-400 ml-4">
                    # Store data in memory
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <div className="text-gray-400">Data Types:</div>
                    <div className="text-green-300">"text" → String</div>
                    <div className="text-blue-300">42 → Integer</div>
                    <div className="text-purple-300">True/False → Boolean</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <div className="text-gray-400">Examples:</div>
                    <div className="text-green-300">name = "Agent"</div>
                    <div className="text-blue-300">level = 5</div>
                    <div className="text-purple-300">ready = True</div>
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