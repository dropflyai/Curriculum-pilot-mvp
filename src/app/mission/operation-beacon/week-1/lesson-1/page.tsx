'use client'

import { useRouter } from 'next/navigation'
import EnhancedLessonInterface from '@/components/EnhancedLessonInterface'

export default function Lesson1() {
  const router = useRouter()

  const challenges = [
    {
      id: 1,
      instruction: "Create a secret code variable called 'mission_status' and set it to 'CLASSIFIED'",
      hint: "Variables store information. Use quotes around text: mission_status = 'CLASSIFIED'",
      correctCode: "mission_status = 'CLASSIFIED'",
      explanation: "Perfect! You've created your first variable. Variables are like secret containers that store information for your AI agent.",
      concepts: ["Variables", "String Values", "Assignment Operator"],
      resources: [
        {
          title: "Python Variables Basics",
          content: "Variables are containers for storing data values. In Python, you create a variable by giving it a name and assigning a value using the = operator.",
          type: "reference"
        },
        {
          title: "Naming Variables", 
          content: "Use descriptive names like 'mission_status' instead of 'x' or 'var1'. This makes your code easier to understand.",
          type: "tip"
        }
      ]
    },
    {
      id: 2,
      instruction: "Store the agent's clearance level as a number in a variable called 'clearance_level' (use any number 1-10)",
      hint: "Numbers don't need quotes: clearance_level = 5",
      correctCode: "clearance_level = ",
      explanation: "Excellent! You've learned that numbers don't need quotes. Python can tell the difference between text (strings) and numbers.",
      concepts: ["Numeric Values", "Data Types", "Integer Variables"],
      resources: [
        {
          title: "Python Data Types",
          content: "Python has different data types: strings (text in quotes), integers (whole numbers), floats (decimal numbers), and booleans (True/False).",
          type: "reference"
        },
        {
          title: "When to Use Numbers vs Strings",
          content: "Use numbers for calculations and counting. Use strings for names, messages, and text that won't be used in math.",
          type: "example"
        }
      ]
    },
    {
      id: 3,
      instruction: "Create your AI's creator signature in a variable called developer_name (use your own name or codename)",
      hint: "Use quotes around your name: developer_name = 'Your Name'",
      correctCode: "developer_name = ",
      explanation: "Great work! Your AI knows who created it. This creates accountability and helps with command authorization protocols.",
      concepts: ["String Variables", "Personal Data", "Code Attribution"],
      resources: [
        {
          title: "Why Attribution Matters",
          content: "In real programming, it's important to document who wrote code. This helps with maintenance and debugging.",
          type: "tip"
        }
      ]
    },
    {
      id: 4,
      instruction: "Activate your AI by creating a variable called ai_status and setting it to True",
      hint: "Boolean values: True or False (capital letters, no quotes)",
      correctCode: "ai_status = True",
      explanation: "Mission critical! Your AI is now ACTIVE. Boolean variables let your AI make yes/no decisions for autonomous operations.",
      concepts: ["Boolean Values", "True/False Logic", "System Status"],
      resources: [
        {
          title: "Boolean Logic in Programming",
          content: "Boolean values (True/False) are fundamental to programming logic. They control decision-making in your code.",
          type: "reference"
        },
        {
          title: "Python Boolean Rules",
          content: "In Python, Boolean values must be capitalized: True and False (not true/false or TRUE/FALSE).",
          type: "tip"
        }
      ]
    }
  ]

  const handleLessonComplete = (xpEarned: number) => {
    // Navigate to week overview with completion
    router.push('/mission/operation-beacon/week-1?completed=lesson-1')
  }

  // Opening Cutscene Dialogue - RESTORED FROM WORKING COMMIT
  const introDialogue = [
    {
      character: "Commander Atlas",
      text: "Agent, URGENT: Enemy AI systems are infiltrating our networks globally. You must immediately begin building our counter-AI defense system. Time is critical.",
      image: "/Commander Atlas.png",
      emotion: "serious" as const
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Agent, I'm Dr. Maya Nexus. We're racing against time to build an AI that can outsmart the enemy. Variables are your AI's memory - without them, it can't think or act.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const
    },
    {
      character: "Commander Atlas",
      text: "Your AI needs variables to remember threat levels, enemy positions, and defense protocols. Each variable you create makes our AI more intelligent than theirs.",
      image: "/Commander Atlas.png", 
      emotion: "confident" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Your AI's survival depends on remembering data. Program its memory using: ai_status = 'Active'. Every second counts - the enemy AI is learning too. Begin now!",
      image: "/Dr. Maya Nexus.png",
      emotion: "neutral" as const
    }
  ]

  return (
    <EnhancedLessonInterface
      lessonId={1}
      title="AI Memory Core Programming"
      description="Build your counter-AI's memory system using Python variables"
      challenges={challenges}
      weekNumber={1}
      introDialogue={introDialogue}
      backgroundImage="/Mission HQ Command Center.png"
      onComplete={handleLessonComplete}
    />
  )
}