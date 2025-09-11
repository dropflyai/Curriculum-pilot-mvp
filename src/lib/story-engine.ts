// Agent Academy Story Engine
// This is the brain that makes coding feel like a spy thriller

export interface Character {
  id: string
  name: string
  role: string
  personality: 'mentor' | 'partner' | 'commander' | 'mysterious'
  avatar: string
  relationships: Record<string, number> // How they feel about the student
}

export interface StoryBeat {
  id: string
  character: string
  type: 'briefing' | 'reaction' | 'consequence' | 'revelation'
  content: string
  conditions?: {
    codeQuality?: 'poor' | 'good' | 'excellent'
    previousChoices?: string[]
    missionProgress?: number
  }
  effects?: {
    relationshipChanges?: Record<string, number>
    unlocksCharacter?: string
    setsFlag?: string
  }
}

export interface Mission {
  id: string
  title: string
  description: string
  codeChallenge: {
    prompt: string
    expectedOutput: string
    hints: string[]
    difficulty: 1 | 2 | 3 | 4 | 5
  }
  storyBeats: {
    opening: StoryBeat
    success: StoryBeat[]
    failure: StoryBeat[]
    hints: StoryBeat[]
  }
  rewards: {
    xp: number
    unlocks?: string[]
    characterDevelopment?: string
  }
}

export class StoryEngine {
  private characters: Map<string, Character> = new Map()
  private studentState: {
    xp: number
    level: number
    completedMissions: string[]
    relationshipLevels: Record<string, number>
    flags: Set<string>
    codeStyle: {
      elegance: number
      efficiency: number
      creativity: number
    }
  }

  constructor() {
    this.initializeCharacters()
    this.studentState = {
      xp: 0,
      level: 1,
      completedMissions: [],
      relationshipLevels: {},
      flags: new Set(),
      codeStyle: {
        elegance: 50,
        efficiency: 50,
        creativity: 50
      }
    }
  }

  private initializeCharacters() {
    // Commander Atlas - The strategic mentor
    this.characters.set('atlas', {
      id: 'atlas',
      name: 'Commander Atlas',
      role: 'Strategic Operations Director',
      personality: 'commander',
      avatar: '/characters/atlas.png',
      relationships: { student: 0 }
    })

    // Agent NOVA - The AI partner who grows with student
    this.characters.set('nova', {
      id: 'nova',
      name: 'Agent NOVA',
      role: 'AI Tactical Specialist',
      personality: 'partner',
      avatar: '/characters/nova.png',
      relationships: { student: 0 }
    })

    // Dr. Maya - The genius researcher and mentor
    this.characters.set('maya', {
      id: 'maya',
      name: 'Dr. Maya Quantum',
      role: 'AI Research Division Lead',
      personality: 'mentor',
      avatar: '/characters/maya.png',
      relationships: { student: 0 }
    })

    // The Shadow - The mysterious antagonist
    this.characters.set('shadow', {
      id: 'shadow',
      name: 'The Shadow',
      role: 'Unknown Entity',
      personality: 'mysterious',
      avatar: '/characters/shadow.png',
      relationships: { student: -10 }
    })
  }

  // Analyze student's code and determine quality metrics
  analyzeCode(code: string, expectedOutput: string): {
    works: boolean
    quality: 'poor' | 'good' | 'excellent'
    metrics: {
      elegance: number
      efficiency: number
      creativity: number
    }
    feedback: string[]
  } {
    // Simple but effective code analysis
    const lines = code.split('\n').filter(line => line.trim())
    const hasComments = code.includes('#')
    const hasGoodVarNames = !/\b[a-z]\b/.test(code) // No single letter vars
    const isEfficient = lines.length <= 10 // Simple efficiency check
    
    let quality: 'poor' | 'good' | 'excellent' = 'poor'
    let elegance = 30
    let efficiency = 30
    let creativity = 30

    const feedback: string[] = []

    // Basic quality assessment
    if (hasGoodVarNames) {
      elegance += 30
      feedback.push("Clean variable naming detected")
    }
    
    if (hasComments) {
      elegance += 20
      feedback.push("Good documentation practices")
    }
    
    if (isEfficient) {
      efficiency += 40
      feedback.push("Efficient solution approach")
    }

    // Determine overall quality
    const avgScore = (elegance + efficiency + creativity) / 3
    if (avgScore >= 70) quality = 'excellent'
    else if (avgScore >= 50) quality = 'good'

    // Update student's coding style profile
    this.studentState.codeStyle.elegance = Math.round(
      (this.studentState.codeStyle.elegance + elegance) / 2
    )
    this.studentState.codeStyle.efficiency = Math.round(
      (this.studentState.codeStyle.efficiency + efficiency) / 2
    )

    return {
      works: true, // TODO: Implement actual code execution
      quality,
      metrics: { elegance, efficiency, creativity },
      feedback
    }
  }

  // Generate personalized character response based on code and relationship
  generateResponse(character: Character, codeAnalysis: any, context: string): StoryBeat {
    const relationship = this.studentState.relationshipLevels[character.id] || 0
    const { quality, metrics } = codeAnalysis

    // Personality-driven responses
    switch (character.personality) {
      case 'partner':
        if (quality === 'excellent') {
          return {
            id: `${character.id}_excellent_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "Outstanding work, Agent! That solution shows real tactical thinking. I'm learning from your approach."`
          }
        } else if (quality === 'good') {
          return {
            id: `${character.id}_good_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "Solid approach! I can work with this. Maybe we can optimize it together next time?"`
          }
        } else {
          return {
            id: `${character.id}_poor_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "It works, but I detect some inefficiencies. Dr. Maya might have some suggestions for improvement."`
          }
        }

      case 'commander':
        if (quality === 'excellent') {
          return {
            id: `${character.id}_excellent_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "Exceptional work, Agent. This is exactly the kind of strategic thinking we need in the field. Mission parameters exceeded."`
          }
        } else {
          return {
            id: `${character.id}_adequate_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "Mission accomplished, Agent. The objective is complete, though there's always room for tactical improvement."`
          }
        }

      case 'mentor':
        if (metrics.elegance < 50) {
          return {
            id: `${character.id}_teaching_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "Good progress! Here's a pro tip: Clear variable names make code easier to debug during high-pressure missions."`
          }
        } else {
          return {
            id: `${character.id}_proud_${Date.now()}`,
            character: character.id,
            type: 'reaction',
            content: `${character.name}: "Beautiful code structure! You're developing the instincts of a senior operative."`
          }
        }

      default:
        return {
          id: `${character.id}_default_${Date.now()}`,
          character: character.id,
          type: 'reaction',
          content: `${character.name}: "Interesting approach, Agent..."`
        }
    }
  }

  // Award XP and check for level ups
  awardXP(amount: number): { newLevel: boolean; totalXP: number; level: number } {
    this.studentState.xp += amount
    const oldLevel = this.studentState.level
    const newLevel = Math.floor(this.studentState.xp / 100) + 1
    
    this.studentState.level = newLevel
    
    return {
      newLevel: newLevel > oldLevel,
      totalXP: this.studentState.xp,
      level: newLevel
    }
  }

  // Get current student state for UI
  getStudentState() {
    return { ...this.studentState }
  }

  // Get character by ID
  getCharacter(id: string): Character | undefined {
    return this.characters.get(id)
  }

  // Update relationship with character
  updateRelationship(characterId: string, change: number) {
    const current = this.studentState.relationshipLevels[characterId] || 0
    this.studentState.relationshipLevels[characterId] = Math.max(-100, Math.min(100, current + change))
  }
}

// Global story engine instance
export const storyEngine = new StoryEngine()