'use client'

import { useRouter } from 'next/navigation'
import EnhancedLessonInterface from '@/components/EnhancedLessonInterface'

export default function Lesson4() {
  const router = useRouter()

  // Enhanced challenges with comprehensive function programming coverage
  const challenges = [
    {
      id: 1,
      instruction: "Create a simple function called 'activate_defense' that prints 'Defense systems online'",
      hint: "Define function with: def activate_defense(): then print the message",
      correctCode: "def activate_defense():\n    print('Defense systems online')",
      explanation: "Perfect! You've created your first function. Functions are reusable code blocks that execute when called.",
      concepts: ["Function Definition", "Def Keyword", "Function Body"],
      resources: [
        {
          title: "Python Functions",
          content: "Functions are defined with 'def', followed by the function name, parentheses, and a colon. The function body is indented.",
          type: "reference" as const
        },
        {
          title: "Function Benefits",
          content: "Functions eliminate code repetition, make programs modular, and easier to debug and maintain.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 2,
      instruction: "Create function 'calculate_distance' that takes one parameter 'meters' and returns meters * 0.000621371 (converts to miles)",
      hint: "def calculate_distance(meters): then return meters * 0.000621371",
      correctCode: "def calculate_distance(meters):\n    return meters * 0.000621371",
      explanation: "Excellent! Functions with parameters accept input values. Return statements send results back to the caller.",
      concepts: ["Function Parameters", "Return Statements", "Unit Conversion"],
      resources: [
        {
          title: "Function Parameters",
          content: "Parameters are variables that receive values when the function is called. They allow functions to work with different data.",
          type: "reference" as const
        },
        {
          title: "Return Values",
          content: "Return statements pass calculated results back. Without return, functions return None by default.",
          type: "example" as const
        }
      ]
    },
    {
      id: 3,
      instruction: "Create function 'agent_introduction' with two parameters 'name' and 'rank', return f'Agent {name}, {rank} reporting for duty'",
      hint: "Use f-string: return f'Agent {name}, {rank} reporting for duty'",
      correctCode: "def agent_introduction(name, rank):\n    return f'Agent {name}, {rank} reporting for duty'",
      explanation: "Outstanding! Multiple parameters allow complex data processing. F-strings efficiently format output.",
      concepts: ["Multiple Parameters", "F-String Formatting", "String Interpolation"],
      resources: [
        {
          title: "Multiple Parameters",
          content: "Functions can accept multiple parameters separated by commas. Order matters when calling the function.",
          type: "reference" as const
        },
        {
          title: "F-String Formatting",
          content: "F-strings (f'...') allow embedding variables directly in strings for clean, readable formatting.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 4,
      instruction: "Create function 'assess_threat' with parameter 'danger_level'. If danger_level > 7, return 'CRITICAL', elif > 4, return 'MODERATE', else return 'LOW'",
      hint: "Use if-elif-else inside function: if danger_level > 7: return 'CRITICAL'",
      correctCode: "def assess_threat(danger_level):\n    if danger_level > 7:\n        return 'CRITICAL'\n    elif danger_level > 4:\n        return 'MODERATE'\n    else:\n        return 'LOW'",
      explanation: "Master-level programming! You've combined functions with conditional logic for intelligent decision-making systems.",
      concepts: ["Functions with Logic", "Conditional Returns", "Decision Trees"],
      resources: [
        {
          title: "Functions with Conditionals",
          content: "Combining functions with if-statements creates intelligent systems that make decisions based on input data.",
          type: "reference" as const
        },
        {
          title: "Multiple Return Paths",
          content: "Functions can have multiple return statements. The first one executed ends the function immediately.",
          type: "example" as const
        }
      ]
    },
    {
      id: 5,
      instruction: "Create function 'validate_credentials' with 'username' and 'password'. Return True if username=='admin' AND password=='secret123', else False",
      hint: "Return boolean directly: return username == 'admin' and password == 'secret123'",
      correctCode: "def validate_credentials(username, password):\n    return username == 'admin' and password == 'secret123'",
      explanation: "Excellent security logic! Functions can return boolean values directly from logical expressions.",
      concepts: ["Boolean Returns", "Logical Expressions", "Authentication Logic"],
      resources: [
        {
          title: "Boolean Functions",
          content: "Functions that return True/False are perfect for validation, checking conditions, and filtering data.",
          type: "reference" as const
        },
        {
          title: "Direct Boolean Return",
          content: "Instead of if-else returning True/False, return the boolean expression directly for cleaner code.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 6,
      instruction: "Create function 'calculate_mission_time' with parameters 'distance_km' and 'speed_kmh', return distance_km / speed_kmh",
      hint: "Simple division: return distance_km / speed_kmh",
      correctCode: "def calculate_mission_time(distance_km, speed_kmh):\n    return distance_km / speed_kmh",
      explanation: "Perfect mathematical modeling! Functions excel at performing calculations with multiple variables.",
      concepts: ["Mathematical Functions", "Division Operations", "Time Calculations"],
      resources: [
        {
          title: "Mathematical Functions",
          content: "Functions are ideal for mathematical operations, allowing reusable calculations with different inputs.",
          type: "reference" as const
        },
        {
          title: "Real-World Applications",
          content: "Time = Distance ÷ Speed is a classic physics formula, perfect for mission planning calculations.",
          type: "example" as const
        }
      ]
    },
    {
      id: 7,
      instruction: "Create function 'format_coordinates' with 'lat' and 'lon', return f'Position: {lat}°N, {lon}°W' if both positive, else 'Invalid coordinates'",
      hint: "if lat > 0 and lon > 0: return f'Position: {lat}°N, {lon}°W' else: return 'Invalid coordinates'",
      correctCode: "def format_coordinates(lat, lon):\n    if lat > 0 and lon > 0:\n        return f'Position: {lat}°N, {lon}°W'\n    else:\n        return 'Invalid coordinates'",
      explanation: "Advanced data processing! Your function validates input and formats output differently based on conditions.",
      concepts: ["Input Validation", "Conditional Formatting", "Geographic Data"],
      resources: [
        {
          title: "Input Validation",
          content: "Always validate function parameters before processing to prevent errors and ensure reliable results.",
          type: "tip" as const
        },
        {
          title: "Conditional Output",
          content: "Functions can return different formats or types based on input validation or processing requirements.",
          type: "example" as const
        }
      ]
    },
    {
      id: 8,
      instruction: "Call the function: activate_defense() to execute the defense systems",
      hint: "Just type the function name with parentheses: activate_defense()",
      correctCode: "activate_defense()",
      explanation: "Perfect function execution! Calling functions activates the code you've written. This is how programs use functions.",
      concepts: ["Function Calls", "Code Execution", "Function Invocation"],
      resources: [
        {
          title: "Function Calls",
          content: "Functions must be called (invoked) to execute. Use the function name followed by parentheses.",
          type: "reference" as const
        },
        {
          title: "Execution Flow",
          content: "When called, program execution jumps to the function, runs its code, then returns to where it was called.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 9,
      instruction: "Call calculate_distance with 1000 as parameter and store result in variable 'miles'",
      hint: "miles = calculate_distance(1000)",
      correctCode: "miles = calculate_distance(1000)",
      explanation: "Excellent! You're capturing function return values. This lets you use calculated results in other parts of your program.",
      concepts: ["Function Arguments", "Return Value Storage", "Variable Assignment"],
      resources: [
        {
          title: "Function Arguments",
          content: "Arguments are the actual values passed to function parameters when calling the function.",
          type: "reference" as const
        },
        {
          title: "Storing Results",
          content: "Store function return values in variables to use the calculated results elsewhere in your program.",
          type: "example" as const
        }
      ]
    },
    {
      id: 10,
      instruction: "Create advanced function 'mission_status' with 'fuel', 'ammo', 'health'. Return 'READY' if all > 50, 'CAUTION' if any 25-50, else 'ABORT'",
      hint: "Check conditions: if fuel > 50 and ammo > 50 and health > 50: return 'READY'",
      correctCode: "def mission_status(fuel, ammo, health):\n    if fuel > 50 and ammo > 50 and health > 50:\n        return 'READY'\n    elif fuel >= 25 or ammo >= 25 or health >= 25:\n        return 'CAUTION'\n    else:\n        return 'ABORT'",
      explanation: "AI mastery achieved! You've created a complex function that analyzes multiple factors to make intelligent decisions.",
      concepts: ["Complex Logic", "Multi-Factor Analysis", "Advanced Conditionals"],
      resources: [
        {
          title: "Complex Decision Functions",
          content: "Advanced functions can analyze multiple variables and conditions to make sophisticated decisions.",
          type: "reference" as const
        },
        {
          title: "Mission Planning Systems",
          content: "Real AI systems use functions like this to assess readiness, risk factors, and operational status.",
          type: "tip" as const
        }
      ]
    }
  ]

  const handleLessonComplete = (xpEarned: number) => {
    // Navigate to week overview with completion
    router.push('/mission/operation-beacon/week-1?completed=lesson-4')
  }

  // Opening Cutscene Dialogue - Enhanced with story continuity
  const introDialogue = [
    {
      character: "Commander Atlas",
      text: "Agent, we've intercepted enemy communications. They're using modular code systems - functions that can be reused and combined. Our AI needs this capability immediately!",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Functions are the building blocks of advanced programming. Instead of repeating code, functions let you write once and use everywhere - just like military protocols.",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "pulse" as const
    },
    {
      character: "Tech Chief Binary",
      text: "Every professional AI system uses functions: def calculate_threat(), def process_data(), def make_decision(). They accept inputs, process them, and return results.",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "zoom" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "The enemy AI is already using function-based architecture. Agent, your AI must master function definition, parameters, and return values - or we'll be outprogrammed!",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "glitch" as const
    }
  ]

  // Closing Cutscene - Story progression and setup for next mission
  const outroDialogue = [
    {
      character: "Tech Chief Binary",
      text: "Phenomenal work, Agent! Your AI now has modular function capabilities. It can create reusable code, accept parameters, and return calculated results.",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "pulse" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Function mastery complete! Your AI can now build complex systems from simple, reusable components. But we've completed Week 1 training...",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "zoom" as const
    },
    {
      character: "Commander Atlas",
      text: "Outstanding progress, Agent! Week 1 of Operation Beacon is complete. Your AI now has variables, data types, conditionals, and functions - the core of intelligence.",
      image: "/Commander Atlas.png",
      emotion: "confident" as const,
      effect: "pulse" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "But this is only the beginning. The enemy AI grows stronger each day. Report to Week 2 for advanced loop operations and data structure training. The real challenge starts now!",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "glitch" as const
    }
  ]

  return (
    <EnhancedLessonInterface
      lessonId={4}
      title="AI Function Architecture System"
      description="Build your AI's modular programming capabilities with reusable functions"
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