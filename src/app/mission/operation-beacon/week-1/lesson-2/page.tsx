'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Dialogue {
  character: string
  text: string
  image: string
  emotion?: 'neutral' | 'confident' | 'encouraging' | 'serious' | 'alert'
}

interface Challenge {
  id: number
  instruction: string
  hint: string
  correctCode: string
  explanation: string
  spyContext: string
}

export default function Lesson2() {
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

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('lesson2-progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCompletedChallenges(progress.completedChallenges || [])
      setXpEarned(progress.xpEarned || 0)
      setCurrentChallenge(progress.currentChallenge || 0)
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const progress = {
      completedChallenges,
      xpEarned,
      currentChallenge
    }
    localStorage.setItem('lesson2-progress', JSON.stringify(progress))
  }, [completedChallenges, xpEarned, currentChallenge])

  // Opening Cutscene Dialogue
  const introDialogue: Dialogue[] = [
    {
      character: "Tech Chief Binary",
      text: "Agent, we've intercepted classified enemy data, but it's scrambled across different data types. Your mission: decode these intel fragments using Python data classification.",
      image: "/Tech Chief Binary.png",
      emotion: "serious"
    },
    {
      character: "Operator Echo", 
      text: "Binary's right - data types are like different cipher keys. Each type unlocks specific information patterns. Master these, and no encrypted data can hide from us.",
      image: "/Operator_Echo_.png",
      emotion: "alert"
    },
    {
      character: "Tech Chief Binary",
      text: "We're dealing with four critical data types: integers for agent IDs, floats for coordinates, strings for encrypted messages, and booleans for security protocols.",
      image: "/Tech Chief Binary.png", 
      emotion: "confident"
    },
    {
      character: "Operator Echo",
      text: "Each data type has unique properties and operations. Understanding them means the difference between mission success and blown cover. Ready to decode some classified intel?",
      image: "/Operator_Echo_.png",
      emotion: "encouraging"
    }
  ]

  // Coding Challenges - Spy-themed data type scenarios
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "Store Agent 007's ID number as an integer in a variable called agent_id",
      hint: "Integers are whole numbers without quotes: agent_id = 7 (or 007)",
      correctCode: "agent_id = 7",
      explanation: "Perfect! Integers store whole numbers like agent IDs, security levels, or mission counts. No decimal points, no quotes needed.",
      spyContext: "Agent ID 007 successfully classified. Integer data type allows for mathematical operations like incrementing mission counters."
    },
    {
      id: 2, 
      instruction: "Store the GPS coordinates 40.7589 (latitude) in a variable called latitude using the correct data type",
      hint: "GPS coordinates have decimal points - use a float: latitude = 40.7589",
      correctCode: "latitude = 40.7589",
      explanation: "Excellent! Floats handle decimal numbers perfectly for coordinates, sensor readings, and precise measurements.",
      spyContext: "GPS latitude locked. Float precision allows tracking targets within meters, not just whole city blocks."
    },
    {
      id: 3,
      instruction: "Store the encrypted message 'PHOENIX_RISING' in a variable called encrypted_msg",
      hint: "Text data needs quotes: encrypted_msg = 'PHOENIX_RISING'",
      correctCode: "encrypted_msg = \"PHOENIX_RISING\"",
      explanation: "Outstanding! Strings store text data like messages, codenames, and passwords. Always wrapped in quotes.",
      spyContext: "Message encrypted and stored. String operations allow us to decode, slice, and manipulate intercepted communications."
    },
    {
      id: 4,
      instruction: "Set security_clearance_valid to True to confirm the agent has proper authorization",
      hint: "Boolean values are True or False (capital letters, no quotes): security_clearance_valid = True",
      correctCode: "security_clearance_valid = True",
      explanation: "Mission accomplished! Booleans handle yes/no decisions - security checks, mission status, and conditional operations.",
      spyContext: "Security clearance confirmed. Boolean logic controls access to classified systems and mission-critical decisions."
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
        }, 4000) // Show dialogue for 4 seconds
        
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
    
    // Flexible checking for different variations
    let isCorrect = false
    
    switch (currentChallenge) {
      case 0: // Agent ID
        isCorrect = (trimmedCode === "agent_id = 7" || 
                    trimmedCode === "agent_id = 007" || 
                    trimmedCode === "agent_id=7" || 
                    trimmedCode === "agent_id=007")
        break
      case 1: // Latitude
        isCorrect = (trimmedCode === "latitude = 40.7589" || 
                    trimmedCode === "latitude=40.7589")
        break
      case 2: // Encrypted message
        isCorrect = (trimmedCode === "encrypted_msg = \"PHOENIX_RISING\"" || 
                    trimmedCode === "encrypted_msg = 'PHOENIX_RISING'" ||
                    trimmedCode === "encrypted_msg=\"PHOENIX_RISING\"" ||
                    trimmedCode === "encrypted_msg='PHOENIX_RISING'")
        break
      case 3: // Security clearance
        isCorrect = (trimmedCode === "security_clearance_valid = True" || 
                    trimmedCode === "security_clearance_valid=True")
        break
      default:
        isCorrect = false
    }
    
    if (isCorrect) {
      setIsCorrect(true)
      setFeedback(currentChallengeData.explanation)
      if (!completedChallenges.includes(currentChallenge)) {
        setCompletedChallenges(prev => [...prev, currentChallenge])
        setXpEarned(prev => prev + 25)
      }
    } else {
      setIsCorrect(false)
      setFeedback("Incorrect code detected. Check data type and syntax. Remember: integers have no quotes, floats have decimals, strings need quotes, booleans are True/False.")
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
      // Lesson complete - mark as completed in localStorage
      const weekProgress = JSON.parse(localStorage.getItem('week1-progress') || '{}')
      weekProgress.lesson2 = true
      localStorage.setItem('week1-progress', JSON.stringify(weekProgress))
      router.push('/mission/operation-beacon/week-1?completed=lesson-2')
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
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Character Portrait */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          showCharacter ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {showCharacter && introDialogue[currentDialogue] && (
            <div className="relative">
              <img 
                src={introDialogue[currentDialogue].image}
                alt={introDialogue[currentDialogue].character}
                className="max-w-lg h-auto drop-shadow-2xl object-cover"
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 backdrop-blur-lg border-2 border-cyan-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              
              {/* Character Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-cyan-400 font-mono">
                  🔐 {introDialogue[currentDialogue]?.character}
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
                      index === currentDialogue ? 'bg-cyan-400' : 
                      index < currentDialogue ? 'bg-cyan-600' : 'bg-gray-600'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800/50 to-cyan-700/50 backdrop-blur-lg border-b border-cyan-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/mission/operation-beacon/week-1" className="text-cyan-400 hover:text-cyan-300 font-mono text-sm mb-2 block">
              ← Return to Week 1
            </Link>
            <h1 className="text-2xl font-bold text-white font-mono">
              <span className="text-cyan-400">🔐 LESSON 2</span> - Classified Data Types
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
                    Intel Fragment {currentChallenge + 1}/4
                  </h2>
                  <div className="text-blue-400 font-mono text-sm">Data Classification</div>
                </div>
                
                <p className="text-white font-mono mb-4">
                  {challenges[currentChallenge].instruction}
                </p>
                
                {/* Spy Context */}
                <div className="bg-red-900/20 border-l-4 border-red-400 p-3 mb-4">
                  <p className="text-red-300 font-mono text-sm">
                    <span className="text-red-400 font-bold">🕵️ Mission Context:</span> {challenges[currentChallenge].spyContext}
                  </p>
                </div>
                
                {/* Hint Button */}
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-400/40 text-yellow-400 font-mono text-sm px-3 py-2 mb-4 transition-colors"
                >
                  💡 {showHint ? 'Hide Cipher Key' : 'Show Cipher Key'}
                </button>
                
                {showHint && (
                  <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-3 mb-4">
                    <p className="text-yellow-300 font-mono text-sm">
                      <span className="text-yellow-400 font-bold">🔑 Cipher Key:</span> {challenges[currentChallenge].hint}
                    </p>
                  </div>
                )}
              </div>

              {/* Character Feedback */}
              {feedback && (
                <div className="bg-black/60 backdrop-blur-lg border-2 border-purple-400/40 p-6"
                     style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                  
                  <div className="flex items-start space-x-4">
                    <img 
                      src={isCorrect ? "/Tech Chief Binary_Sketch_processed.png" : "/Operator Echo Sketch_processed.png"}
                      alt={isCorrect ? "Tech Chief Binary" : "Operator Echo"}
                      className="w-16 h-16 rounded-full border-2 border-purple-400"
                    />
                    <div>
                      <h3 className="text-purple-400 font-mono font-bold mb-2">
                        {isCorrect ? "Tech Chief Binary" : "Operator Echo"}
                      </h3>
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
                        {currentChallenge < challenges.length - 1 ? 'Decode Next Fragment →' : 'Mission Complete →'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="space-y-6">
              <div className="bg-black/80 backdrop-blur-lg border-2 border-cyan-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h3 className="text-cyan-400 font-mono font-bold mb-4">🖥️ Data Classification Terminal</h3>
                
                {/* Data Type Reference */}
                <div className="bg-gray-900 border border-cyan-400/30 p-3 mb-4 text-sm">
                  <div className="text-cyan-400 font-mono font-bold mb-2">📊 Data Type Reference:</div>
                  <div className="text-gray-300 font-mono space-y-1">
                    <div><span className="text-yellow-400">int:</span> Whole numbers (7, 42, 1001)</div>
                    <div><span className="text-green-400">float:</span> Decimals (3.14, 40.7589)</div>
                    <div><span className="text-blue-400">str:</span> Text in quotes ("message", 'code')</div>
                    <div><span className="text-red-400">bool:</span> True or False (no quotes)</div>
                  </div>
                </div>
                
                {/* Code Input */}
                <div className="bg-gray-900 border border-gray-600 p-4 mb-4">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Type your classified data here..."
                    className="w-full h-32 bg-transparent text-cyan-400 font-mono text-sm resize-none focus:outline-none"
                  />
                </div>
                
                {/* Execute Button */}
                <div className="flex justify-between">
                  <button 
                    onClick={() => setUserCode('')}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-mono px-4 py-2 transition-colors"
                  >
                    Clear Intel
                  </button>
                  <button 
                    onClick={checkCode}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono px-6 py-2 transition-colors"
                    style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                  >
                    Classify Data
                  </button>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-black/40 border border-gray-600/30 p-4">
                <h4 className="text-white font-mono font-bold mb-3">Decryption Progress</h4>
                <div className="space-y-2">
                  {challenges.map((challenge, index) => (
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
                        Intel Fragment {index + 1}
                        {completedChallenges.includes(index) && ' ✓'}
                      </span>
                      <div className="text-xs text-gray-400 font-mono">
                        {index === 0 && 'Agent ID'} 
                        {index === 1 && 'GPS Coords'}
                        {index === 2 && 'Encrypted Msg'}
                        {index === 3 && 'Security Check'}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* XP Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm font-mono text-gray-400 mb-1">
                    <span>Mission XP</span>
                    <span>{xpEarned}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded transition-all duration-500"
                      style={{ width: `${(xpEarned / 100) * 100}%` }}
                    ></div>
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