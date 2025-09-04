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
      text: "Agent, we've detected a security breach. Multiple surveillance zones need automated patrol protocols. Time to master tactical decision-making and repetitive operations.",
      image: "/Commander Atlas.png",
      emotion: "serious"
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Loops and conditionals are the automation backbone of any security system. Loops handle repetitive tasks, while conditionals make smart decisions based on changing conditions.",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert"
    },
    {
      character: "Commander Atlas",
      text: "In the field, you'll need to: check security levels repeatedly, scan multiple targets, and make instant tactical decisions. These control structures are essential for mission automation.",
      image: "/Commander Atlas.png", 
      emotion: "confident"
    },
    {
      character: "Dr. Maya Nexus",
      text: "Let's start with conditionals using 'if' statements for decision-making, then move to 'for' loops for automated repetition. Master these and your code becomes truly intelligent.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging"
    }
  ]

  // Coding Challenges - Spy-themed loops and conditionals
  const challenges: Challenge[] = [
    {
      id: 1,
      instruction: "Check if security_level is greater than or equal to 3. If true, print 'Access Granted'",
      hint: "Use: if security_level >= 3:\n    print('Access Granted')\n\n(Create the security_level variable first with any value)",
      correctCode: "security_level = 5\nif security_level >= 3:\n    print('Access Granted')",
      explanation: "Perfect! Conditional statements let your code make intelligent decisions. 'if' checks a condition and executes code only when it's true.",
      spyContext: "Security checkpoint automated. The system now grants or denies access based on clearance levels without human intervention."
    },
    {
      id: 2, 
      instruction: "Create a complete security check: if agent_status equals 'ACTIVE', print 'Mission Ready', otherwise print 'Agent Offline'",
      hint: "Use if-else:\nif agent_status == 'ACTIVE':\n    print('Mission Ready')\nelse:\n    print('Agent Offline')\n\n(Set agent_status first)",
      correctCode: "agent_status = 'ACTIVE'\nif agent_status == 'ACTIVE':\n    print('Mission Ready')\nelse:\n    print('Agent Offline')",
      explanation: "Excellent tactical logic! The if-else structure handles binary decisions - your code now responds to any agent status automatically.",
      spyContext: "Agent status monitoring system active. Command HQ can now instantly verify operational readiness across all field agents."
    },
    {
      id: 3,
      instruction: "Patrol 3 security zones using a for loop. Print 'Zone [number] secured' for each zone (1, 2, 3)",
      hint: "Use: for zone in range(1, 4):\n    print(f'Zone {zone} secured')",
      correctCode: "for zone in range(1, 4):\n    print(f'Zone {zone} secured')",
      explanation: "Outstanding automation! For loops handle repetitive tasks efficiently. Your patrol protocol now runs continuously without manual oversight.",
      spyContext: "Automated patrol system engaged. Security coverage is now continuous and systematic, eliminating human error in zone monitoring."
    },
    {
      id: 4,
      instruction: "Scan a list of 4 agent codenames: ['Alpha', 'Bravo', 'Charlie', 'Delta']. Print 'Agent [codename] confirmed' for each",
      hint: "agents = ['Alpha', 'Bravo', 'Charlie', 'Delta']\nfor agent in agents:\n    print(f'Agent {agent} confirmed')",
      correctCode: "agents = ['Alpha', 'Bravo', 'Charlie', 'Delta']\nfor agent in agents:\n    print(f'Agent {agent} confirmed')",
      explanation: "Mission accomplished! You've mastered list iteration - essential for processing multiple data points in field operations.",
      spyContext: "Agent roster verification complete. All field operatives confirmed and accounted for through automated roll-call protocol."
    },
    {
      id: 5,
      instruction: "Combine both concepts: Check each threat level in [1, 3, 5, 2]. If level >= 3, print 'HIGH ALERT: Level [X]', else print 'Normal: Level [X]'",
      hint: "threat_levels = [1, 3, 5, 2]\nfor level in threat_levels:\n    if level >= 3:\n        print(f'HIGH ALERT: Level {level}')\n    else:\n        print(f'Normal: Level {level}')",
      correctCode: "threat_levels = [1, 3, 5, 2]\nfor level in threat_levels:\n    if level >= 3:\n        print(f'HIGH ALERT: Level {level}')\n    else:\n        print(f'Normal: Level {level}')",
      explanation: "Tactical perfection! You've combined loops and conditionals into an intelligent threat assessment system. This is advanced field programming!",
      spyContext: "Automated threat detection system online. Real-time analysis now categorizes all security alerts with appropriate response protocols."
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
    const trimmedCode = userCode.trim().replace(/\s+/g, ' ')
    const currentChallengeData = challenges[currentChallenge]
    
    let isCorrect = false
    
    switch (currentChallenge) {
      case 0: // Security level check
        isCorrect = (
          trimmedCode.includes('security_level') &&
          trimmedCode.includes('if') &&
          trimmedCode.includes('>=') &&
          trimmedCode.includes('3') &&
          trimmedCode.includes('print(') &&
          trimmedCode.includes('Access Granted')
        )
        break
      case 1: // Agent status if-else
        isCorrect = (
          trimmedCode.includes('agent_status') &&
          trimmedCode.includes('if') &&
          trimmedCode.includes('ACTIVE') &&
          trimmedCode.includes('else:') &&
          trimmedCode.includes('Mission Ready') &&
          trimmedCode.includes('Agent Offline')
        )
        break
      case 2: // Zone patrol loop
        isCorrect = (
          trimmedCode.includes('for') &&
          trimmedCode.includes('zone') &&
          trimmedCode.includes('range') &&
          trimmedCode.includes('Zone') &&
          trimmedCode.includes('secured')
        )
        break
      case 3: // Agent list iteration
        isCorrect = (
          trimmedCode.includes('agents') &&
          trimmedCode.includes('[') &&
          trimmedCode.includes('Alpha') &&
          trimmedCode.includes('for') &&
          trimmedCode.includes('agent') &&
          trimmedCode.includes('Agent') &&
          trimmedCode.includes('confirmed')
        )
        break
      case 4: // Combined loop and conditional
        isCorrect = (
          trimmedCode.includes('threat_levels') &&
          trimmedCode.includes('[1, 3, 5, 2]') &&
          trimmedCode.includes('for') &&
          trimmedCode.includes('if') &&
          trimmedCode.includes('HIGH ALERT') &&
          trimmedCode.includes('Normal')
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
        setXpEarned(prev => prev + 35)
      }
    } else {
      setIsCorrect(false)
      setFeedback("Code structure needs adjustment. Check your syntax - remember proper indentation for if statements and loops!")
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
            <div className="bg-black/80 backdrop-blur-lg border-2 border-orange-400/60 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'}}>
              
              {/* Character Name */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-orange-400 font-mono">
