/**
 * PLUG-AND-PLAY CURRICULUM STANDARDS CONFIGURATION
 * ==============================================
 * Drop in any game/curriculum configuration and it automatically works
 * with the StandardsCompliancePopup component.
 */

import { GameCurriculum } from '@/components/StandardsCompliancePopup'

// ================ WEB DEVELOPMENT GAME EXAMPLE ================
export const WEB_DEV_ACADEMY: GameCurriculum = {
  gameName: "Web Dev Academy",
  gameDescription: "Learn HTML, CSS, and JavaScript through building real websites",
  totalWeeks: 16,
  stateCompliance: [
    {
      stateName: "California",
      stateCode: "CA", 
      standardsBody: "California Computer Science Standards (Based on CSTA K-12)",
      website: "https://www.cde.ca.gov/ci/cr/cf/",
      mappings: [
        {
          standardCode: "6-8.IC.20",
          standardTitle: "Impacts of Computing - Digital Citizenship",
          description: "Compare tradeoffs associated with computing technologies",
          gameLocation: "Digital Ethics Lab",
          gameWeeks: "Weeks 1-2",
          gameActivities: ["Web accessibility principles", "Privacy policy creation", "Digital footprint analysis"]
        },
        {
          standardCode: "6-8.AP.17",
          standardTitle: "Algorithms and Programming - Program Design",
          description: "Systematically test programs and analyze results",
          gameLocation: "Testing Arena",
          gameWeeks: "Weeks 14-16", 
          gameActivities: ["Browser testing", "User experience testing", "Performance optimization"]
        }
      ]
    }
  ]
}

// ================ GAME DESIGN CURRICULUM EXAMPLE ================
export const GAME_DESIGN_STUDIO: GameCurriculum = {
  gameName: "Game Design Studio",
  gameDescription: "Create 2D games using Scratch and learn programming concepts",
  totalWeeks: 12,
  stateCompliance: [
    {
      stateName: "Texas",
      stateCode: "TX",
      standardsBody: "Texas Essential Knowledge and Skills (TEKS) - Technology Applications",
      website: "https://www.teksresourcesystem.net/",
      mappings: [
        {
          standardCode: "126.32(c)(3)(A)",
          standardTitle: "Creative Development - Digital Design",
          description: "Create digital products using design processes",
          gameLocation: "Character Creation Studio",
          gameWeeks: "Weeks 3-6",
          gameActivities: ["Sprite design", "Animation creation", "User interface design"]
        },
        {
          standardCode: "126.32(c)(2)(D)",
          standardTitle: "Computational Thinking - Testing",
          description: "Test programs and analyze results",
          gameLocation: "Game Testing Lab",
          gameWeeks: "Weeks 10-12",
          gameActivities: ["Playtesting sessions", "Bug identification", "Game balance analysis"]
        }
      ]
    }
  ]
}

// ================ AI/ML EXPLORATION CURRICULUM ================
export const AI_EXPLORATION_LAB: GameCurriculum = {
  gameName: "AI Exploration Lab", 
  gameDescription: "Discover artificial intelligence and machine learning concepts through hands-on projects",
  totalWeeks: 14,
  stateCompliance: [
    {
      stateName: "New York",
      stateCode: "NY",
      standardsBody: "New York State Computer Science and Digital Fluency Standards", 
      website: "http://www.nysed.gov/curriculum-instruction/computer-science-and-digital-fluency-standards",
      mappings: [
        {
          standardCode: "6-8.IC.1",
          standardTitle: "Impacts of Computing - Ethics",
          description: "Analyze the beneficial and harmful effects of computing innovations",
          gameLocation: "AI Ethics Center",
          gameWeeks: "Weeks 1-3",
          gameActivities: ["Bias in AI discussion", "Fairness in algorithms", "AI decision-making scenarios"]
        },
        {
          standardCode: "6-8.DA.7",
          standardTitle: "Data and Analysis - Patterns",
          description: "Identify patterns in large data sets",
          gameLocation: "Pattern Recognition Arena",
          gameWeeks: "Weeks 8-11",
          gameActivities: ["Image classification", "Data visualization", "Trend analysis projects"]
        }
      ]
    }
  ]
}

// ================ CYBERSECURITY TRAINING PROGRAM ================
export const CYBER_SECURITY_ACADEMY: GameCurriculum = {
  gameName: "Cyber Security Academy",
  gameDescription: "Learn cybersecurity fundamentals through ethical hacking scenarios",
  totalWeeks: 20,
  stateCompliance: [
    {
      stateName: "Florida",
      stateCode: "FL",
      standardsBody: "Florida Standards for Career and Technical Education - Information Technology",
      website: "https://www.fldoe.org/academics/career-adult-edu/career-tech-edu/", 
      mappings: [
        {
          standardCode: "CTS.05.01",
          standardTitle: "Network Security Fundamentals",
          description: "Demonstrate knowledge of network security principles",
          gameLocation: "Network Defense Center",
          gameWeeks: "Weeks 5-10",
          gameActivities: ["Firewall configuration", "Intrusion detection", "Network monitoring"]
        },
        {
          standardCode: "CTS.05.03", 
          standardTitle: "Ethical Hacking Principles",
          description: "Apply ethical hacking methodologies",
          gameLocation: "Penetration Testing Lab",
          gameWeeks: "Weeks 15-20",
          gameActivities: ["Vulnerability scanning", "Social engineering awareness", "Incident response procedures"]
        }
      ]
    }
  ]
}

// ================ AGENT ACADEMY CURRICULUM ================
export const AGENT_ACADEMY: GameCurriculum = {
  gameName: "Agent Academy",
  gameDescription: "Learn AI agent development through spy-themed missions and tactical operations",
  totalWeeks: 18,
  stateCompliance: [
    {
      stateName: "California",
      stateCode: "CA",
      standardsBody: "California Computer Science Standards (Based on CSTA K-12)",
      website: "https://www.cde.ca.gov/ci/cr/cf/",
      mappings: [
        {
          standardCode: "9-12.IC.25",
          standardTitle: "Impacts of Computing - AI and Society",
          description: "Evaluate the societal impacts of artificial intelligence systems",
          gameLocation: "AI Ethics Center",
          gameWeeks: "Weeks 1-3",
          gameActivities: ["AI bias analysis", "Ethical AI frameworks", "Algorithmic fairness assessment"]
        },
        {
          standardCode: "9-12.AP.22",
          standardTitle: "Algorithms and Programming - AI Integration",
          description: "Design programs that incorporate AI and machine learning concepts",
          gameLocation: "Agent Development Lab",
          gameWeeks: "Weeks 4-18",
          gameActivities: ["API integration", "Agent workflow design", "Multi-agent systems"]
        }
      ]
    },
    {
      stateName: "Texas",
      stateCode: "TX",
      standardsBody: "Texas Essential Knowledge and Skills (TEKS) - Technology Applications",
      website: "https://www.teksresourcesystem.net/",
      mappings: [
        {
          standardCode: "126.44(c)(4)(A)",
          standardTitle: "Computational Thinking - Problem Solving",
          description: "Use computational thinking to solve complex problems",
          gameLocation: "Mission Strategy Center",
          gameWeeks: "Weeks 5-10",
          gameActivities: ["Decision tree design", "Logic flow optimization", "Problem decomposition"]
        },
        {
          standardCode: "126.44(c)(6)(C)",
          standardTitle: "Programming - Advanced Applications",
          description: "Create programs using advanced programming concepts",
          gameLocation: "Advanced Coding Arena",
          gameWeeks: "Weeks 11-18",
          gameActivities: ["Function development", "Object-oriented design", "Database integration"]
        }
      ]
    }
  ]
}

// ================ EXPORT ALL CURRICULA ================
export const ALL_CURRICULA = {
  'agent-academy': AGENT_ACADEMY,
  'web-dev-academy': WEB_DEV_ACADEMY,
  'game-design-studio': GAME_DESIGN_STUDIO, 
  'ai-exploration-lab': AI_EXPLORATION_LAB,
  'cyber-security-academy': CYBER_SECURITY_ACADEMY
}

// ================ HELPER FUNCTIONS ================

/**
 * Get curriculum data by key
 */
export function getCurriculumByKey(key: string): GameCurriculum | null {
  const curriculum = ALL_CURRICULA[key as keyof typeof ALL_CURRICULA]
  return curriculum || null
}

/**
 * Add a new state to any curriculum (for dynamic expansion)
 */
export function addStateToGame(gameKey: string, stateData: any) {
  const game = getCurriculumByKey(gameKey)
  if (game && game.stateCompliance) {
    game.stateCompliance.push(stateData)
  }
}

/**
 * Example usage in any component:
 * 
 * import { WEB_DEV_ACADEMY } from '@/config/curriculum-standards'
 * 
 * <StandardsCompliancePopup 
 *   curriculum={WEB_DEV_ACADEMY}
 *   isOpen={showPopup}
 *   onClose={() => setShowPopup(false)}
 * />
 */