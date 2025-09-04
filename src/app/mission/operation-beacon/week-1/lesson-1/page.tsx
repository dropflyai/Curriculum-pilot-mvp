'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      text: "Agent, welcome to your first tactical training session. Today you'll learn the foundation of all digital intelligence gathering.",
      image: "/Commander Atlas.png",
      emotion: "serious"
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Hello! I'm Dr. Maya Nexus, your AI learning advisor. I'll guide you through mastering Python variables - the building blocks of code intelligence.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging"
    },
    {
      character: "Commander Atlas",
      text: "Variables are like secure containers for storing mission-critical data. Master this skill, and you'll be ready for field operations.",
      image: "/Commander Atlas.png", 
      emotion: "confident"
    },
    {
      character: "Dr. Maya Nexus",
      text: "Let's start with the basics. A variable stores information using this format: variable_name = value. Ready for your first mission?",
      image: "/Dr. Maya Nexus.png",
      emotion: "neutral"
    }
  ]

  // Coding Challenges
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "Store the target location 'Digital Fortress' in a variable called target_location",
      hint: "Remember: variable_name = 'text value' (use quotes for text)",
      correctCode: "target_location = \"Digital Fortress\"",
      explanation: "Perfect! You've stored text data in a variable. The quotes tell Python this is text, not a command."
    },
    {
      id: 2, 
      instruction: "Store the security level number 5 in a variable called security_level",
      hint: "Numbers don't need quotes: variable_name = number",
      correctCode: "security_level = 5",
      explanation: "Excellent! Numbers are stored without quotes. Python recognizes this as numerical data."
    },
    {
      id: 3,
      instruction: "Store your agent codename in a variable called agent_name (choose any codename you like)",
      hint: "Use quotes around your codename text: agent_name = 'Your Codename'",
      correctCode: "agent_name = ",
      explanation: "Outstanding! You've created your agent profile. Variables can store any text you assign to them."
    },
    {
      id: 4,
      instruction: "Create a variable called mission_active and set it to True (this is a boolean - True/False value)",
      hint: "Boolean values: True or False (capital letters, no quotes)",
      correctCode: "mission_active = True",
      explanation: "Mission accomplished! Boolean variables store True/False values for yes/no decisions."
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
                className="max-w-md h-auto drop-shadow-2xl"
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
              <span className="text-green-400">📊 LESSON 1</span> - Mission Intel Storage
            </h1>
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
                      src="/Dr. Maya Nexus.png"
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
                    placeholder="Type your Python code here..."
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
                    Execute Code
                  </button>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-black/40 border border-gray-600/30 p-4">
                <h4 className="text-white font-mono font-bold mb-3">Lesson Progress</h4>
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
          </div>
        </div>
      </div>
    </div>
  )
}