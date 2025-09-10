'use client'

import { useRouter } from 'next/navigation'
import EnhancedLessonInterface from '@/components/EnhancedLessonInterface'

export default function Lesson3() {
  const router = useRouter()

  // Enhanced challenges with comprehensive conditional logic coverage
  const challenges = [
    {
      id: 1,
      instruction: "Check if security_level is greater than 5. If true, set access_granted to True",
      hint: "Use an if statement: if security_level > 5: then set access_granted = True",
      correctCode: "if security_level > 5:\n    access_granted = True",
      explanation: "Perfect! Your AI can now make basic decisions. IF statements let your AI check conditions and take action when they're true.",
      concepts: ["If Statements", "Conditional Logic", "Boolean Assignment"],
      resources: [
        {
          title: "Python If Statements",
          content: "If statements check a condition and execute code only when that condition is True. Essential for decision-making in AI systems.",
          type: "reference" as const
        },
        {
          title: "Decision Making",
          content: "AI agents need to make decisions based on data. If statements are the foundation of intelligent behavior.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 2,
      instruction: "Check agent_status. If it equals 'ACTIVE', print 'Mission ready', otherwise print 'Standby mode'",
      hint: "Use if-else: if agent_status == 'ACTIVE': print something, else: print something else",
      correctCode: "if agent_status == 'ACTIVE':\n    print('Mission ready')\nelse:\n    print('Standby mode')",
      explanation: "Excellent! Your AI now handles binary decisions. ELSE ensures your AI always takes an appropriate action, no matter the condition.",
      concepts: ["If-Else Statements", "String Comparison", "Binary Decisions"],
      resources: [
        {
          title: "If-Else Logic",
          content: "Else provides a fallback action when the if condition is False. This ensures your AI always responds appropriately.",
          type: "reference" as const
        },
        {
          title: "String Equality",
          content: "Use == to compare strings. Remember: assignment (=) vs comparison (==) are different operations.",
          type: "example" as const
        }
      ]
    },
    {
      id: 3,
      instruction: "Check threat_level: if 'LOW' print 'Normal patrol', if 'MEDIUM' print 'Alert status', otherwise print 'Emergency protocols'",
      hint: "Use if-elif-else: if threat_level == 'LOW': ..., elif threat_level == 'MEDIUM': ..., else: ...",
      correctCode: "if threat_level == 'LOW':\n    print('Normal patrol')\nelif threat_level == 'MEDIUM':\n    print('Alert status')\nelse:\n    print('Emergency protocols')",
      explanation: "Outstanding! Your AI now handles multiple scenarios. ELIF allows checking multiple conditions in sequence.",
      concepts: ["If-Elif-Else", "Multiple Conditions", "Hierarchical Logic"],
      resources: [
        {
          title: "Elif Statements",
          content: "Elif (else if) allows checking multiple conditions in sequence. Only the first true condition executes.",
          type: "reference" as const
        },
        {
          title: "Threat Assessment",
          content: "Real AI systems use hierarchical decision trees like this for risk assessment and response protocols.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 4,
      instruction: "Check if both enemy_detected is True AND ammo_count is greater than 0. If both true, set engage_target to True",
      hint: "Use 'and' operator: if enemy_detected == True and ammo_count > 0:",
      correctCode: "if enemy_detected == True and ammo_count > 0:\n    engage_target = True",
      explanation: "Mission critical! Your AI now makes complex logical decisions. AND ensures all conditions are met before taking action.",
      concepts: ["Logical AND", "Multiple Conditions", "Combat Logic"],
      resources: [
        {
          title: "Logical AND",
          content: "AND requires ALL conditions to be True. Perfect for safety checks where everything must be verified.",
          type: "reference" as const
        },
        {
          title: "Safety Protocols",
          content: "Military AI uses AND logic for engagement rules: detect target AND have ammo AND authorization.",
          type: "example" as const
        }
      ]
    },
    {
      id: 5,
      instruction: "Check if backup_power is True OR main_power is True. If either is true, set systems_online to True",
      hint: "Use 'or' operator: if backup_power == True or main_power == True:",
      correctCode: "if backup_power == True or main_power == True:\n    systems_online = True",
      explanation: "Excellent redundancy! Your AI now handles failsafe logic. OR ensures systems remain operational with backup options.",
      concepts: ["Logical OR", "Redundancy Logic", "Failsafe Systems"],
      resources: [
        {
          title: "Logical OR",
          content: "OR requires only ONE condition to be True. Essential for backup systems and redundant safety measures.",
          type: "reference" as const
        },
        {
          title: "System Redundancy",
          content: "Critical systems use OR logic for backup power, communication links, and failsafe mechanisms.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 6,
      instruction: "Check if NOT stealth_mode. If stealth is off, set visibility to 'EXPOSED'",
      hint: "Use 'not' operator: if not stealth_mode:",
      correctCode: "if not stealth_mode:\n    visibility = 'EXPOSED'",
      explanation: "Perfect logic inversion! Your AI can now handle negative conditions. NOT is crucial for detecting when things are disabled or false.",
      concepts: ["Logical NOT", "Boolean Negation", "Stealth Logic"],
      resources: [
        {
          title: "Logical NOT",
          content: "NOT inverts a boolean value. True becomes False, False becomes True. Useful for detecting when something is off.",
          type: "reference" as const
        },
        {
          title: "Stealth Operations",
          content: "Military systems use NOT logic to detect when protective measures are disabled or compromised.",
          type: "example" as const
        }
      ]
    },
    {
      id: 7,
      instruction: "Check if coordinates_valid is True AND distance < 100 AND fuel_remaining >= 25. If all true, set mission_possible to True",
      hint: "Chain multiple AND conditions: if condition1 and condition2 and condition3:",
      correctCode: "if coordinates_valid == True and distance < 100 and fuel_remaining >= 25:\n    mission_possible = True",
      explanation: "Advanced tactical analysis! Your AI now performs complex multi-factor assessments like real military planning systems.",
      concepts: ["Complex Conditions", "Multi-Factor Analysis", "Mission Planning"],
      resources: [
        {
          title: "Complex Conditionals",
          content: "Real AI systems often check multiple conditions simultaneously for comprehensive decision-making.",
          type: "reference" as const
        },
        {
          title: "Mission Parameters",
          content: "Military planning requires checking location, distance, resources, and risk factors all together.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 8,
      instruction: "Check temperature. If < 0, set status to 'FROZEN', if between 0-100, set to 'NORMAL', if > 100, set to 'OVERHEATED'",
      hint: "Use ranges: if temperature < 0: ..., elif temperature <= 100: ..., else: ...",
      correctCode: "if temperature < 0:\n    status = 'FROZEN'\nelif temperature <= 100:\n    status = 'NORMAL'\nelse:\n    status = 'OVERHEATED'",
      explanation: "Excellent sensor logic! Your AI now handles range-based decisions, critical for monitoring and environmental systems.",
      concepts: ["Range Conditions", "Environmental Logic", "Sensor Processing"],
      resources: [
        {
          title: "Range Checking",
          content: "AI systems often need to categorize values into ranges for appropriate responses and alerts.",
          type: "reference" as const
        },
        {
          title: "Environmental Monitoring",
          content: "Temperature, pressure, and other sensor data require range-based logic for system protection.",
          type: "example" as const
        }
      ]
    },
    {
      id: 9,
      instruction: "Complex authorization: If (clearance >= 7 AND biometric_verified) OR emergency_override, set access to 'GRANTED'",
      hint: "Use parentheses for grouping: if (condition1 and condition2) or condition3:",
      correctCode: "if (clearance >= 7 and biometric_verified) or emergency_override:\n    access = 'GRANTED'",
      explanation: "Master-level logic! Your AI now handles sophisticated security protocols with grouped conditions and override systems.",
      concepts: ["Grouped Conditions", "Security Protocols", "Override Logic"],
      resources: [
        {
          title: "Boolean Grouping",
          content: "Parentheses control the order of logical operations, just like in mathematics. Essential for complex conditions.",
          type: "reference" as const
        },
        {
          title: "Security Systems",
          content: "High-security AI uses layered authentication: normal access (clearance AND biometric) OR emergency override.",
          type: "tip" as const
        }
      ]
    },
    {
      id: 10,
      instruction: "Nested decision: If mission_active, then check if enemy_detected. If enemy found, set alert_level to 'RED', else 'GREEN'",
      hint: "Nest if statements: if mission_active: followed by indented if-else block",
      correctCode: "if mission_active:\n    if enemy_detected:\n        alert_level = 'RED'\n    else:\n        alert_level = 'GREEN'",
      explanation: "AI mastery achieved! Your AI now uses nested logic for complex decision trees, the foundation of advanced autonomous systems.",
      concepts: ["Nested Conditionals", "Decision Trees", "Hierarchical Logic"],
      resources: [
        {
          title: "Nested If Statements",
          content: "Nest if statements for complex decision trees. Each level adds more specific conditions and responses.",
          type: "reference" as const
        },
        {
          title: "AI Decision Trees",
          content: "Advanced AI systems use nested logic to build decision trees for autonomous navigation, combat, and mission planning.",
          type: "example" as const
        }
      ]
    }
  ]

  const handleLessonComplete = (xpEarned: number) => {
    // Navigate to week overview with completion
    router.push('/mission/binary-shores-academy/week-1?completed=lesson-3')
  }

  // Opening Cutscene Dialogue - Enhanced with story continuity
  const introDialogue = [
    {
      character: "Commander Atlas",
      text: "Emergency status! The enemy AI is making decisions faster than our systems can respond. Your AI needs conditional logic - the ability to make IF-THEN decisions!",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Conditional statements are the decision-making core of AI systems. IF this happens, THEN do that. This is how AI agents respond intelligently to changing conditions.",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "pulse" as const
    },
    {
      character: "Tech Chief Binary",
      text: "Every advanced AI uses conditional logic: IF enemy detected AND weapons ready, THEN engage. IF low power OR damage detected, THEN retreat. Master this now!",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "zoom" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "The enemy AI is already using complex conditional logic against us. Agent, your AI must learn these decision patterns or we'll be outmaneuvered in every engagement!",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "glitch" as const
    }
  ]

  // Closing Cutscene - Story progression and setup for next lesson
  const outroDialogue = [
    {
      character: "Tech Chief Binary",
      text: "Incredible work, Agent! Your AI now thinks logically. It can make complex decisions using IF-THEN logic, AND/OR operations, and nested conditions.",
      image: "/Tech Chief Binary.png",
      emotion: "confident" as const,
      effect: "pulse" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Your AI's decision-making capabilities are now operational. But we're detecting massive data streams from enemy systems. We need to process repetitive patterns...",
      image: "/Dr. Maya Nexus.png",
      emotion: "encouraging" as const,
      effect: "zoom" as const
    },
    {
      character: "Commander Atlas",
      text: "Intelligence reports show the enemy is using automated systems that repeat the same operations thousands of times. We need loop technology immediately!",
      image: "/Commander Atlas.png",
      emotion: "serious" as const,
      effect: "shake" as const
    },
    {
      character: "Dr. Maya Nexus",
      text: "Agent, your next mission: master Python loops. Your AI must learn to repeat tasks efficiently, or the enemy's automation will overwhelm our response capabilities!",
      image: "/Dr. Maya Nexus.png",
      emotion: "alert" as const,
      effect: "glitch" as const
    }
  ]

  return (
    <EnhancedLessonInterface
      lessonId={3}
      title="AI Conditional Logic Engine"
      description="Teach your AI to make intelligent decisions using if-then logic"
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