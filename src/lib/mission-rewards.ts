// Mission Rewards Configuration
// Each mission grants specific tech, clearance, and knowledge

export interface MissionReward {
  xp: number
  clearanceCard: {
    level: string
    name: string
    description: string
    color: string
  }
  techItems: Array<{
    icon: string
    name: string
    description: string
    type: 'formula' | 'hardware' | 'software' | 'intel'
  }>
  skillsUnlocked: string[]
  specialBonus?: {
    name: string
    description: string
    icon: string
  }
}

export const MISSION_REWARDS: Record<string, MissionReward> = {
  'shadow-protocol': {
    xp: 5000,
    clearanceCard: {
      level: 'CHARLIE',
      name: 'Charlie-Level Security Clearance',
      description: 'Grants access to Intermediate Training Facilities',
      color: 'green'
    },
    techItems: [
      {
        icon: '💾',
        name: 'Variable Storage Drive',
        description: 'Advanced data storage techniques for managing complex information',
        type: 'hardware'
      },
      {
        icon: '📜',
        name: 'Loop Control Formula',
        description: 'Mathematical formulas for iterative processing and automation',
        type: 'formula'
      },
      {
        icon: '🔧',
        name: 'Basic Debugger Kit',
        description: 'Essential tools for identifying and fixing code anomalies',
        type: 'software'
      },
      {
        icon: '📡',
        name: 'String Encryption Protocols',
        description: 'Secure communication methods for data transmission',
        type: 'intel'
      }
    ],
    skillsUnlocked: [
      'Variable Manipulation',
      'Basic Input/Output Operations',
      'Conditional Logic Processing',
      'String Operations'
    ],
    specialBonus: {
      name: 'Field Operative Badge',
      description: 'You are now recognized as a certified Field Operative',
      icon: '🎖️'
    }
  },
  
  'cipher-command': {
    xp: 7500,
    clearanceCard: {
      level: 'DELTA',
      name: 'Delta-Level Security Clearance',
      description: 'Authorized for Advanced Operations and Team Missions',
      color: 'blue'
    },
    techItems: [
      {
        icon: '🗄️',
        name: 'Array Management System',
        description: 'Technology for handling multiple data elements simultaneously',
        type: 'hardware'
      },
      {
        icon: '⚡',
        name: 'Function Generator Core',
        description: 'Create reusable code modules for efficiency',
        type: 'software'
      },
      {
        icon: '🔐',
        name: 'Team Sync Encryption Key',
        description: 'Secure collaboration protocols for team operations',
        type: 'intel'
      },
      {
        icon: '📊',
        name: 'Data Structure Blueprints',
        description: 'Advanced patterns for organizing complex information',
        type: 'formula'
      }
    ],
    skillsUnlocked: [
      'Function Creation & Management',
      'Array Manipulation',
      'Team Collaboration Protocols',
      'Module Design Patterns'
    ],
    specialBonus: {
      name: 'Squad Leader Certification',
      description: 'Qualified to lead team-based operations',
      icon: '👥'
    }
  },
  
  'ghost-protocol': {
    xp: 10000,
    clearanceCard: {
      level: 'OMEGA',
      name: 'Omega-Level Security Clearance',
      description: 'Top Secret - Access to Critical Infrastructure',
      color: 'purple'
    },
    techItems: [
      {
        icon: '🧬',
        name: 'Object-Oriented Framework',
        description: 'Advanced programming paradigm for complex systems',
        type: 'software'
      },
      {
        icon: '🌐',
        name: 'Network Protocol Analyzer',
        description: 'Tools for understanding and manipulating network communications',
        type: 'hardware'
      },
      {
        icon: '🛡️',
        name: 'Exception Handler Shield',
        description: 'Defensive programming techniques to prevent system failures',
        type: 'formula'
      },
      {
        icon: '💿',
        name: 'Database Access Codes',
        description: 'Credentials for persistent data storage systems',
        type: 'intel'
      },
      {
        icon: '🔮',
        name: 'Algorithm Optimizer',
        description: 'Advanced techniques for improving code performance',
        type: 'software'
      }
    ],
    skillsUnlocked: [
      'Object-Oriented Programming',
      'File I/O Operations',
      'Exception Handling',
      'Algorithm Optimization',
      'Database Fundamentals'
    ],
    specialBonus: {
      name: 'Elite Agent Status',
      description: 'Recognized as one of the agency\'s elite operatives',
      icon: '🌟'
    }
  },
  
  'quantum-breach': {
    xp: 15000,
    clearanceCard: {
      level: 'QUANTUM',
      name: 'Quantum-Level Security Clearance',
      description: 'Ultimate Access - Command Authority Granted',
      color: 'red'
    },
    techItems: [
      {
        icon: '🚀',
        name: 'API Gateway Interface',
        description: 'Connect to external systems and services worldwide',
        type: 'hardware'
      },
      {
        icon: '🧮',
        name: 'Machine Learning Core',
        description: 'Basic AI and pattern recognition capabilities',
        type: 'software'
      },
      {
        icon: '⚛️',
        name: 'Quantum Encryption Matrix',
        description: 'Unbreakable security protocols for sensitive operations',
        type: 'formula'
      },
      {
        icon: '🗺️',
        name: 'Full System Architecture',
        description: 'Complete understanding of complex software systems',
        type: 'intel'
      },
      {
        icon: '🔋',
        name: 'Performance Accelerator',
        description: 'Optimize any code for maximum efficiency',
        type: 'hardware'
      },
      {
        icon: '🎯',
        name: 'Deployment Automation Kit',
        description: 'Tools for automated testing and deployment',
        type: 'software'
      }
    ],
    skillsUnlocked: [
      'API Development',
      'Advanced Database Operations',
      'System Architecture',
      'Security Implementation',
      'Performance Optimization',
      'Deployment & DevOps',
      'Basic AI/ML Concepts'
    ],
    specialBonus: {
      name: 'Master Coder Insignia',
      description: 'You have achieved mastery of the Python language',
      icon: '👑'
    }
  }
}

// Function to get reward display data for a mission
export function getMissionRewardDisplay(missionId: string): string[] {
  const reward = MISSION_REWARDS[missionId]
  if (!reward) return []
  
  const display = [
    `🎯 ${reward.xp.toLocaleString()} XP`,
    `🎫 ${reward.clearanceCard.name}`,
    `🛠️ ${reward.techItems.length} New Tech Items`,
    `📚 ${reward.skillsUnlocked.length} Skills Unlocked`
  ]
  
  if (reward.specialBonus) {
    display.push(`${reward.specialBonus.icon} ${reward.specialBonus.name}`)
  }
  
  return display
}

// Function to format rewards for display in mission briefing
export function formatMissionRewards(missionId: string) {
  const reward = MISSION_REWARDS[missionId]
  if (!reward) return null
  
  return {
    summary: {
      xp: reward.xp,
      techCount: reward.techItems.length,
      skillCount: reward.skillsUnlocked.length,
      clearance: reward.clearanceCard.level
    },
    detailed: reward
  }
}