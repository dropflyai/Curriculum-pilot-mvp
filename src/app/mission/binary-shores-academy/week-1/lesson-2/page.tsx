'use client'

import { useRouter } from 'next/navigation'
import EnhancedLessonInterface from '@/components/EnhancedLessonInterface'

export default function Lesson2() {
  const router = useRouter()

  // Enhanced challenges with comprehensive data type coverage
  const challenges = [
    {
      id: 1,
      instruction: "Store Agent 007's ID number as an integer in a variable called 'agent_id'",
      hint: "Integers are whole numbers without quotes: agent_id = 7 (or 007)",
      correctCode: "agent_id = 7",
      explanation: "Perfect! Integers store whole numbers like agent IDs, security levels, or mission counts. No decimal points, no quotes needed.",
      concepts: ["Integer Variables", "Numeric Data Types", "Agent Identification"],
      resources: [
        {
          title: "Python Integers",
          content: "Integers are whole numbers (positive, negative, or zero) without decimal points. Perfect for counting, IDs, and mathematical operations.",
          type: "reference" as const
        },
        {
          title: "Agent ID System",
          content: "In intelligence operations, agents are assigned numeric IDs for secure identification and tracking.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 2,
      instruction: "Store the GPS coordinates 40.7589 (latitude) in a variable called 'latitude' using the correct data type",
      hint: "GPS coordinates have decimal points - use a float: latitude = 40.7589",
      correctCode: "latitude = 40.7589",
      explanation: "Excellent! Floats handle decimal numbers perfectly for coordinates, sensor readings, and precise measurements.",
      concepts: ["Float Variables", "Decimal Numbers", "GPS Coordinates"],
      resources: [
        {
          title: "Python Floats",
          content: "Float (floating-point) numbers contain decimal points and are used for precise measurements and calculations.",
          type: "reference" as const
        },
        {
          title: "GPS Precision",
          content: "GPS coordinates require decimal precision. 40.7589 is different from 40 - that small difference could be miles!",
          type: "example" as const
        }
      ]
    },
    {
      id: 3,
      instruction: "Store the encrypted message 'PHOENIX_RISING' in a variable called 'encrypted_msg'",
      hint: "Text data needs quotes: encrypted_msg = 'PHOENIX_RISING'",
      correctCode: "encrypted_msg = 'PHOENIX_RISING'",
      explanation: "Outstanding! Strings store text data like messages, codenames, and passwords. Always wrapped in quotes.",
      concepts: ["String Variables", "Text Data", "Encrypted Messages"],
      resources: [
        {
          title: "Python Strings",
          content: "Strings are text values enclosed in quotes. You can use single ('text') or double (\"text\") quotes in Python.",
          type: "reference" as const
        },
        {
          title: "Code Names",
          content: "Intelligence operations use code names like PHOENIX_RISING to maintain secrecy in communications.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 4,
      instruction: "Set security_clearance_valid to True to confirm the agent has proper authorization",
      hint: "Boolean values are True or False (capital letters, no quotes): security_clearance_valid = True",
      correctCode: "security_clearance_valid = True",
      explanation: "Mission accomplished! Booleans handle yes/no decisions - security checks, mission status, and conditional operations.",
      concepts: ["Boolean Values", "True/False Logic", "Security Authorization"],
      resources: [
        {
          title: "Python Booleans",
          content: "Boolean values are either True or False (capitalized). They represent binary states and are crucial for decision-making in code.",
          type: "reference" as const
        },
        {
          title: "Security Clearance",
          content: "Boolean variables are perfect for security checks - either an agent has clearance (True) or doesn't (False).",
          type: "example" as const
        }
      ]
    },
    {
      id: 5,
      instruction: "Store the longitude coordinate -74.0060 in a variable called 'longitude'",
      hint: "Negative coordinates are still floats: longitude = -74.0060",
      correctCode: "longitude = -74.0060",
      explanation: "Excellent! Negative floats work just like positive ones. GPS coordinates can be negative (west/south) or positive (east/north).",
      concepts: ["Negative Numbers", "Float Variables", "Geographic Coordinates"],
      resources: [
        {
          title: "Negative Floats",
          content: "Numbers can be positive or negative. In GPS, negative longitude means west of the Prime Meridian.",
          type: "reference" as const
        }
      ]
    },
    {
      id: 6,
      instruction: "Create a variable 'mission_count' and set it to 15 (total completed missions)",
      hint: "Mission counts are whole numbers: mission_count = 15",
      correctCode: "mission_count = 15",
      explanation: "Perfect! Using integers for counting is ideal - you can't complete 15.5 missions, so whole numbers make sense.",
      concepts: ["Integer Counting", "Mission Tracking", "Whole Numbers"],
      resources: [
        {
          title: "When to Use Integers",
          content: "Use integers for counting discrete items: people, missions, attempts, levels, etc.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 7,
      instruction: "Store the agent's success rate as 94.7 percent in a variable called 'success_rate'",
      hint: "Percentages with decimals are floats: success_rate = 94.7",
      correctCode: "success_rate = 94.7",
      explanation: "Outstanding! Percentages often need decimal precision. 94.7% is very different from 94%.",
      concepts: ["Percentage Data", "Float Precision", "Performance Metrics"],
      resources: [
        {
          title: "Percentages in Programming",
          content: "Store percentages as floats (94.7) rather than strings ('94.7%') so you can do math with them.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 8,
      instruction: "Create a variable 'mission_active' and set it to False (mission is currently inactive)",
      hint: "Boolean for inactive status: mission_active = False",
      correctCode: "mission_active = False",
      explanation: "Perfect! False indicates an inactive or disabled state. Booleans are essential for status tracking.",
      concepts: ["Boolean False", "Status Tracking", "Inactive States"],
      resources: [
        {
          title: "Boolean States",
          content: "False represents 'no', 'off', 'inactive', or 'disabled' states in your program logic.",
          type: "reference" as const
        }
      ]
    },
    {
      id: 9,
      instruction: "Store the classified document name 'Operation_Nightfall.pdf' in a variable called 'document_name'",
      hint: "File names are text strings: document_name = 'Operation_Nightfall.pdf'",
      correctCode: "document_name = 'Operation_Nightfall.pdf'",
      explanation: "Excellent! File names, even with extensions, are stored as strings. This allows for text operations like searching and parsing.",
      concepts: ["File Names", "String Data", "Document Management"],
      resources: [
        {
          title: "File Names in Code",
          content: "Store file names as strings so you can manipulate them - extract extensions, search for patterns, etc.",
          type: "example" as const
        }
      ]
    },
    {
      id: 10,
      instruction: "Set temperature_celsius to -12.5 (winter mission location temperature)",
      hint: "Negative temperatures with decimals: temperature_celsius = -12.5",
      correctCode: "temperature_celsius = -12.5",
      explanation: "Mission complete! Negative floats handle below-zero temperatures perfectly. This data could trigger cold-weather gear protocols.",
      concepts: ["Negative Floats", "Temperature Data", "Environmental Variables"],
      resources: [
        {
          title: "Environmental Data",
          content: "Temperature, pressure, and other sensor data often requires negative values and decimal precision.",
          type: "tip" as const
        }
      ]
    }
  ]

  const handleLessonComplete = (xpEarned: number) => {
    // Navigate to week overview with completion
    router.push('/mission/binary-shores-academy/week-1?completed=lesson-2')
  }

  // Opening Cutscene Dialogue - Enhanced with story continuity
  const introDialogue = [
    {
      character: "Commander Atlas",
      text: "Agent, enemy activity detected in Sector 7. Your AI's memory is operational, but it needs decision-making capabilities to respond to threats.",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "The enemy AI is using different data types to disguise its communications. Your AI must learn to classify data correctly - integers, floats, strings, and booleans.",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "pulse" as const
    },
    {
      character: "Tech Chief Binary",
      text: "Data types are the foundation of AI intelligence. Each type has unique properties: integers for counting, floats for precision, strings for text, booleans for decisions.",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "zoom" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Master these data classifications, Agent. Your AI's ability to process different information types will be crucial when we encounter the enemy's advanced systems.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "glitch" as const
    }
  ]

  // Closing Cutscene - Story progression and setup for next lesson
  const outroDialogue = [
    {
      character: "Tech Chief Binary",
      text: "Outstanding work, Agent! Your AI now understands the four fundamental data types. This knowledge forms the backbone of intelligent decision-making.",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "pulse" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Data classification complete. Your AI can now distinguish between numbers, text, and true/false states. But something's wrong... I'm detecting anomalous patterns.",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "zoom" as const
    },
    {
      character: "Commander Atlas",
      text: "Alert: Enemy AI attempting infiltration of our systems! Agent, your AI needs conditional logic immediately - the ability to make IF-THEN decisions under pressure!",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "The enemy is adapting faster than expected. Agent, conditional statements are your next critical training. Without them, your AI is defenseless against logical attacks!",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "glitch" as const
    }
  ]

  return (
    <EnhancedLessonInterface
      lessonId={2}
      title="AI Data Classification System"
      description="Teach your AI to understand and classify different data types"
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