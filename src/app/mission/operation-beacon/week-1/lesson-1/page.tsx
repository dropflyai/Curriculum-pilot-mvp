'use client'

import { useRouter } from 'next/navigation'
import EnhancedLessonInterface from '@/components/EnhancedLessonInterface'

export default function Lesson1() {
  const router = useRouter()

  // More comprehensive challenges with progressive difficulty
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
    },
    {
      id: 5,
      instruction: "Create a variable called 'agent_codename' and set it to your chosen codename (use quotes)",
      hint: "Remember to use quotes for text: agent_codename = 'Shadow'",
      correctCode: "agent_codename = ",
      explanation: "Excellent! You're building your agent's identity. Each variable can store different pieces of information.",
      concepts: ["String Variables", "Variable Naming", "Text Storage"],
      resources: [
        {
          title: "String Variables",
          content: "Strings are text values surrounded by quotes. You can use single ('') or double (\"\") quotes in Python.",
          type: "reference"
        }
      ]
    },
    {
      id: 6,
      instruction: "Store your mission success rate as 98.5 in a variable called 'success_rate'",
      hint: "Decimal numbers are called floats: success_rate = 98.5",
      correctCode: "success_rate = 98.5",
      explanation: "Perfect! Floats are numbers with decimal points. They're crucial for precise calculations and percentages.",
      concepts: ["Float Values", "Decimal Numbers", "Precision"],
      resources: [
        {
          title: "Float vs Integer",
          content: "Use integers for counting (3 agents) and floats for measurements (98.5% success rate).",
          type: "tip"
        }
      ]
    },
    {
      id: 7,
      instruction: "Update the mission_status variable to 'ACTIVE' (overwrite the previous value)",
      hint: "You can change a variable's value: mission_status = 'ACTIVE'",
      correctCode: "mission_status = 'ACTIVE'",
      explanation: "Variables can be updated! This is how your AI adapts to changing mission parameters in real-time.",
      concepts: ["Variable Reassignment", "Dynamic Values", "State Changes"],
      resources: [
        {
          title: "Changing Variables",
          content: "Variables are called 'variable' because their values can vary/change throughout your program.",
          type: "tip"
        }
      ]
    },
    {
      id: 8,
      instruction: "Create a mission_briefing variable with the text: 'Infiltrate the enemy base at 0800 hours'",
      hint: "Long strings work the same way: mission_briefing = 'Infiltrate the enemy base at 0800 hours'",
      correctCode: "mission_briefing = 'Infiltrate the enemy base at 0800 hours'",
      explanation: "Outstanding! Variables can store long text messages, perfect for mission communications and detailed instructions.",
      concepts: ["Long Strings", "Text Messages", "Information Storage"],
      resources: [
        {
          title: "String Length",
          content: "Python strings can be very long - even entire documents can be stored in a single variable!",
          type: "reference"
        }
      ]
    },
    {
      id: 9,
      instruction: "Create a variable 'threat_level' and set it to 0 (we'll increase it later)",
      hint: "Initialize with zero: threat_level = 0",
      correctCode: "threat_level = 0",
      explanation: "Smart thinking! Initializing variables with starting values is a best practice. This threat level can be updated as situations change.",
      concepts: ["Variable Initialization", "Default Values", "Integer Zero"],
      resources: [
        {
          title: "Initialization Best Practice",
          content: "Always initialize variables with sensible default values before using them in your program.",
          type: "tip"
        }
      ]
    },
    {
      id: 10,
      instruction: "Set enemy_detected to False (no enemies... yet)",
      hint: "Boolean for no detection: enemy_detected = False",
      correctCode: "enemy_detected = False",
      explanation: "Excellent defensive programming! Starting with False for detection variables ensures your AI doesn't trigger false alarms.",
      concepts: ["False State", "Detection Variables", "Safety Defaults"],
      resources: [
        {
          title: "Boolean Defaults",
          content: "For safety-critical variables, default to False until conditions are confirmed True.",
          type: "tip"
        }
      ]
    }
  ]

  const handleLessonComplete = (xpEarned: number) => {
    // Navigate to week overview with completion
    router.push('/mission/operation-beacon/week-1?completed=lesson-1')
  }

  // Opening Cutscene Dialogue - ENHANCED CINEMATIC VERSION
  const introDialogue = [
    {
      character: "Commander Atlas",
      text: "Agent, URGENT: Enemy AI systems are infiltrating our networks globally. You must immediately begin building our counter-AI defense system. Time is critical.",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus", 
      text: "Agent, I'm Dr. Maya Nexus. We're racing against time to build an AI that can outsmart the enemy. Variables are your AI's memory - without them, it can't think or act.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "zoom" as const
    },
    {
      character: "Commander Atlas",
      text: "Your AI needs variables to remember threat levels, enemy positions, and defense protocols. Each variable you create makes our AI more intelligent than theirs.",
      image: "/Commander Atlas.png", 
      emotion: "confident" as const,
      effect: "pulse" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Your AI's survival depends on remembering data. Program its memory using: ai_status = 'Active'. Every second counts - the enemy AI is learning too. Begin now!",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "glitch" as const
    }
  ]

  // Closing Cutscene - Mission accomplished, story progresses
  const outroDialogue = [
    {
      character: "Dr. Maya Nexus",
      text: "Outstanding work, Agent! Your AI's memory core is fully operational. It can now store and recall critical mission data.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "zoom" as const
    },
    {
      character: "Tech Chief Binary",
      text: "Systems analysis complete. Your variable implementation is flawless. The AI is learning faster than our projections!",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "pulse" as const
    },
    {
      character: "Commander Atlas",
      text: "Alert: Enemy AI activity detected in Sector 7. Your AI needs decision-making capabilities now. Report for Conditional Logic training immediately!",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Wait... I'm detecting something unusual in the enemy AI's code patterns. It's almost as if... No, it can't be. Agent, we need to move quickly!",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "glitch" as const
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
      outroDialogue={outroDialogue}
      backgroundImage="/Mission HQ Command Center.png"
      useCinematic={true}
      onComplete={handleLessonComplete}
    />
  )
}