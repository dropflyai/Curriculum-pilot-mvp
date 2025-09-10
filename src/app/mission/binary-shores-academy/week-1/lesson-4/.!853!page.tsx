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
      image: "/Commander Atlas.png",
      emotion: "confident"
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Functions are like specialized mission protocols. Define them once, use them everywhere. They accept inputs, process data, and return results - the backbone of professional spy software.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging"
    },
    {
      character: "Commander Atlas",
      text: "In field operations, you'll decrypt messages, calculate distances, analyze threats, and validate credentials repeatedly. Functions make these operations instant and error-free.",
      image: "/Commander Atlas.png", 
      emotion: "serious"
    },
    {
      character: "Dr. Maya Nexus",
      text: "Let's master function definition with 'def', parameters for inputs, and return statements for outputs. These skills separate field operatives from true cyber agents.",
      image: "/Dr. Maya Nexus.png",
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
      router.push('/mission/binary-shores-academy/week-1?completed=lesson-4')
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
                className="max-w-lg h-auto drop-shadow-2xl"
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
