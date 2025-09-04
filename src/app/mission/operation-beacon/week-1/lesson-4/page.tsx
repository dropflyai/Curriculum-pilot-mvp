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

export default function Lesson4() {
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
      text: "Outstanding progress, Agent. Now for advanced tactical operations - modular command functions. These are reusable code tools that eliminate repetition and maximize efficiency.",
      image: "/Commander Atlas_processed.png",
      emotion: "confident"
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Functions are like specialized mission protocols. Define them once, use them everywhere. They accept inputs, process data, and return results - the backbone of professional spy software.",
      image: "/Dr. Maya Nexus_processed.png",
      emotion: "encouraging"
    },
    {
      character: "Commander Atlas",
      text: "In field operations, you'll decrypt messages, calculate distances, analyze threats, and validate credentials repeatedly. Functions make these operations instant and error-free.",
      image: "/Commander Atlas_processed.png", 
      emotion: "serious"
    },
    {
      character: "Dr. Maya Nexus",
      text: "Let's master function definition with 'def', parameters for inputs, and return statements for outputs. These skills separate field operatives from true cyber agents.",
      image: "/Dr. Maya Nexus_processed.png",
      emotion: "alert"
    }
  ]

  // Coding Challenges - Advanced spy function scenarios
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "Create a function called 'encrypt_message' that prints 'Message secured with quantum encryption'",
      hint: "def function_name():\n    print('your message here')",
      correctCode: "def encrypt_message():\n    print('Message secured with quantum encryption')",
      explanation: "Perfect! You've created a reusable encryption protocol. Functions with 'def' can be called multiple times without rewriting code.",
      spyContext: "Encryption module ready. All sensitive communications can now be secured with a single function call."
    },
    {
      id: 2, 
      instruction: "Create a function 'calculate_threat_level' that takes a 'risk_score' parameter and returns risk_score * 2",
      hint: "def function_name(parameter):\n    return parameter * 2",
      correctCode: "def calculate_threat_level(risk_score):\n    return risk_score * 2",
      explanation: "Excellent tactical calculation! Functions with parameters and return values process data dynamically for any input.",
      spyContext: "Threat assessment algorithm deployed. Field agents can now get instant risk calculations for any situation."
    },
    {
      id: 3,
      instruction: "Create 'generate_mission_code' function that takes 'agent_name' and 'location' parameters, returns 'Agent {agent_name} deployed to {location}'",
      hint: "Use f-strings: return f'Agent {param1} deployed to {param2}'",
      correctCode: "def generate_mission_code(agent_name, location):\n    return f'Agent {agent_name} deployed to {location}'",
      explanation: "Outstanding! Multi-parameter functions handle complex data processing. You've mastered dynamic string generation.",
      spyContext: "Mission dispatch system online. Command can now generate deployment codes for any agent-location combination instantly."
    },
    {
      id: 4,
      instruction: "Create 'security_clearance_check' that takes 'clearance_level'. If level >= 5, return 'TOP SECRET ACCESS', else return 'RESTRICTED ACCESS'",
      hint: "def function_name(parameter):\n    if parameter >= 5:\n        return 'TOP SECRET ACCESS'\n    else:\n        return 'RESTRICTED ACCESS'",
      correctCode: "def security_clearance_check(clearance_level):\n    if clearance_level >= 5:\n        return 'TOP SECRET ACCESS'\n    else:\n        return 'RESTRICTED ACCESS'",
      explanation: "Mission critical! You've combined functions with conditional logic - the foundation of intelligent security systems.",
      spyContext: "Automated security screening active. Access control now processes clearance levels without human oversight."
    },
    {
      id: 5,
      instruction: "Now test your function: Call encrypt_message() to execute the encryption protocol",
      hint: "Simply type: encrypt_message()",
      correctCode: "encrypt_message()",
      explanation: "Perfect execution! Function calls activate your pre-defined protocols. Your modular spy toolkit is now operational!",
      spyContext: "All tactical functions deployed and tested. Your spy programming toolkit is combat-ready for field operations."
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
        }, 3500) // Show dialogue for 3.5 seconds
        
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

  // Check user code with flexible validation
  const checkCode = () => {
    const trimmedCode = userCode.trim()
    const currentChallengeData = challenges[currentChallenge]
    
    let isCorrect = false
    
    switch (currentChallenge) {
      case 0: // encrypt_message function
        isCorrect = (
          trimmedCode.includes('def encrypt_message()') &&
          trimmedCode.includes('print') &&
          trimmedCode.includes('Message secured with quantum encryption')
        )
        break
      case 1: // calculate_threat_level function
        isCorrect = (
          trimmedCode.includes('def calculate_threat_level') &&
          trimmedCode.includes('risk_score') &&
          trimmedCode.includes('return') &&
          trimmedCode.includes('risk_score * 2')
        )
        break
      case 2: // generate_mission_code function
        isCorrect = (
          trimmedCode.includes('def generate_mission_code') &&
          trimmedCode.includes('agent_name') &&
          trimmedCode.includes('location') &&
          trimmedCode.includes('return') &&
          (trimmedCode.includes('f\'Agent {agent_name} deployed to {location}\'') ||
           trimmedCode.includes('f"Agent {agent_name} deployed to {location}"'))
        )
        break
      case 3: // security_clearance_check function
        isCorrect = (
          trimmedCode.includes('def security_clearance_check') &&
          trimmedCode.includes('clearance_level') &&
          trimmedCode.includes('if') &&
          trimmedCode.includes('>= 5') &&
          trimmedCode.includes('TOP SECRET ACCESS') &&
          trimmedCode.includes('RESTRICTED ACCESS')
        )
        break
      case 4: // Function call
        isCorrect = (
          trimmedCode === 'encrypt_message()' ||
          trimmedCode.includes('encrypt_message()')
        )
        break
      default:
        isCorrect = false
    }
    
    if (isCorrect) {
      setIsCorrect(true)
      setFeedback(currentChallengeData.explanation)
      if (!completedChallenges.includes(currentChallenge)) {
        setCompletedChallenges(prev => [...prev, currentChallenge])
        setXpEarned(prev => prev + 40)
      }
    } else {
      setIsCorrect(false)
      setFeedback("Function syntax error detected. Check def keyword, parameter format, indentation, and return statement structure!")
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
      router.push('/mission/operation-beacon/week-1?completed=lesson-4')
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
            <div className="bg-black/80 backdrop-blur-lg border-2 border-purple-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              
              {/* Character Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-400 font-mono">
                  {introDialogue[currentDialogue]?.character === "Commander Atlas" ? "<�" : "=,"} {introDialogue[currentDialogue]?.character}
                </h3>
                <button 
                  onClick={skipCutscene}
                  className="text-gray-400 hover:text-white font-mono text-sm"
                >
                  Skip Cutscene �
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
                      index === currentDialogue ? 'bg-purple-400' : 
                      index < currentDialogue ? 'bg-purple-600' : 'bg-gray-600'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-indigo-700/50 backdrop-blur-lg border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/mission/operation-beacon/week-1" className="text-purple-400 hover:text-purple-300 font-mono text-sm mb-2 block">
              � Return to Week 1
            </Link>
            <h1 className="text-2xl font-bold text-white font-mono">
              <span className="text-purple-400">� LESSON 4</span> - Modular Command Functions
            </h1>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-mono font-bold">+{xpEarned} XP</div>
            <div className="text-gray-300 text-sm">{completedChallenges.length}/5 Complete</div>
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
                    Function Module {currentChallenge + 1}/5
                  </h2>
                  <div className="text-blue-400 font-mono text-sm">Tactical Functions</div>
                </div>
                
                <p className="text-white font-mono mb-4">
                  {challenges[currentChallenge].instruction}
                </p>
                
                {/* Spy Context */}
                <div className="bg-indigo-900/20 border-l-4 border-indigo-400 p-3 mb-4">
                  <p className="text-indigo-300 font-mono text-sm">
                    <span className="text-indigo-400 font-bold">🎯 Operational Impact:</span> {challenges[currentChallenge].spyContext}
                  </p>
                </div>
                
                {/* Hint Button */}
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-400/40 text-yellow-400 font-mono text-sm px-3 py-2 mb-4 transition-colors"
                >
                  =� {showHint ? 'Hide Function Template' : 'Show Function Template'}
                </button>
                
                {showHint && (
                  <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-3 mb-4">
                    <p className="text-yellow-300 font-mono text-sm">
                      <span className="text-yellow-400 font-bold">=� Template:</span><br/>
                      <pre className="text-yellow-200 text-xs mt-1">{challenges[currentChallenge].hint}</pre>
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
                      src={isCorrect ? "/Dr. Maya Nexus_processed.png" : "/Commander Atlas_processed.png"}
                      alt={isCorrect ? "Dr. Maya Nexus" : "Commander Atlas"}
                      className="w-16 h-16 rounded-full border-2 border-purple-400"
                    />
                    <div>
                      <h3 className="text-purple-400 font-mono font-bold mb-2">
                        {isCorrect ? "=, Dr. Maya Nexus" : "<� Commander Atlas"}
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
                        {currentChallenge < challenges.length - 1 ? 'Deploy Next Module �' : 'Complete Training �'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Code Editor */}
            <div className="space-y-6">
              <div className="bg-black/80 backdrop-blur-lg border-2 border-purple-400/40 p-6"
                   style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
                
                <h3 className="text-purple-400 font-mono font-bold mb-4">� Function Development Terminal</h3>
                
                {/* Function Reference */}
                <div className="bg-gray-900 border border-purple-400/30 p-3 mb-4 text-sm">
                  <div className="text-purple-400 font-mono font-bold mb-2">=' Function Syntax Reference:</div>
                  <div className="text-gray-300 font-mono space-y-1">
                    <div><span className="text-yellow-400">def function_name():</span> Basic function</div>
                    <div><span className="text-green-400">def name(param):</span> Function with parameter</div>
                    <div><span className="text-blue-400">return value</span> Return result</div>
                    <div><span className="text-red-400">function_name()</span> Call function</div>
                  </div>
                  <div className="text-purple-300 text-xs mt-2">� Don't forget proper indentation!</div>
                </div>
                
                {/* Code Input */}
                <div className="bg-gray-900 border border-gray-600 p-4 mb-4">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="# Define your tactical function here&#10;def your_function_name():&#10;    # Your code here&#10;    return result"
                    className="w-full h-40 bg-transparent text-purple-400 font-mono text-sm resize-none focus:outline-none"
                  />
                </div>
                
                {/* Execute Button */}
                <div className="flex justify-between">
                  <button 
                    onClick={() => setUserCode('')}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-mono px-4 py-2 transition-colors"
                  >
                    Clear Function
                  </button>
                  <button 
                    onClick={checkCode}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-mono px-6 py-2 transition-colors"
                    style={{clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'}}
                  >
                    Deploy Function
                  </button>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-black/40 border border-gray-600/30 p-4">
                <h4 className="text-white font-mono font-bold mb-3">Function Module Status</h4>
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
                        Module {index + 1}
                        {completedChallenges.includes(index) && ' '}
                      </span>
                      <div className="text-xs text-gray-400 font-mono">
                        {index === 0 && 'Basic Function'} 
                        {index === 1 && 'Parameters'}
                        {index === 2 && 'Multi-Params'}
                        {index === 3 && 'Logic Functions'}
                        {index === 4 && 'Function Calls'}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* XP Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm font-mono text-gray-400 mb-1">
                    <span>Function Mastery XP</span>
                    <span>{xpEarned}/200</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded transition-all duration-500"
                      style={{ width: `${(xpEarned / 200) * 100}%` }}
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