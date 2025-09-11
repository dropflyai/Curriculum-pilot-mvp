// Agent Academy Cinematic Cutscenes
// These cutscenes teach coding concepts through spy narrative

interface Dialogue {
  character: string
  text: string
  image: string
  emotion?: 'neutral' | 'confident' | 'encouraging' | 'serious' | 'alert'
  effect?: 'glitch' | 'pulse' | 'shake' | 'zoom'
}

interface CutsceneData {
  id: string
  title: string
  missionContext: string
  dialogues: Dialogue[]
  backgroundImage: string
  triggers?: {
    beforeMission?: boolean
    afterSuccess?: boolean
    afterFailure?: boolean
  }
}

// Mission 1 Opening: Recruitment Briefing
export const MISSION_01_OPENING: CutsceneData = {
  id: 'mission_01_opening',
  title: 'CLASSIFIED RECRUITMENT BRIEFING',
  missionContext: 'Agent Academy - Binary Shores Facility',
  backgroundImage: '/Mission HQ Command Center.png',
  triggers: { beforeMission: true },
  dialogues: [
    {
      character: 'Commander Atlas',
      text: 'Welcome to Agent Academy, recruit. I\'m Commander Atlas, Strategic Operations Director. We\'ve been monitoring your digital footprint... your problem-solving patterns show exceptional potential.',
      image: '/Commander Atlas.png',
      emotion: 'confident'
    },
    {
      character: 'Commander Atlas',
      text: 'The world faces AI threats that traditional methods cannot handle. We need operatives who can think like machines while maintaining human intuition. Your first task: activate Agent NOVA.',
      image: '/Commander Atlas.png',
      emotion: 'serious'
    },
    {
      character: 'Commander Atlas', 
      text: 'NOVA has been in standby mode for 72 hours. We need you to wake her up using Python communication protocols. Think of code as your tactical language - every line matters in the field.',
      image: '/Commander Atlas.png',
      emotion: 'encouraging'
    }
  ]
}

// Mission 1 Success: NOVA Activation
export const MISSION_01_SUCCESS: CutsceneData = {
  id: 'mission_01_success',
  title: 'AGENT NOVA ACTIVATION SEQUENCE',
  missionContext: 'Binary Shores Academy - Tactical Systems Online',
  backgroundImage: '/Digital Fortress Exterior.png',
  triggers: { afterSuccess: true },
  dialogues: [
    {
      character: 'Agent NOVA',
      text: 'Communication protocols verified. Handler identification... confirmed. I am Agent NOVA, AI Tactical Specialist, now fully operational and ready for deployment.',
      image: '/Black Cipher_1.png', // Using one of our cipher images for NOVA
      emotion: 'confident',
      effect: 'pulse'
    },
    {
      character: 'Agent NOVA',
      text: 'Analysis of activation sequence: Clean implementation, standard protocols followed. Your systematic approach shows methodical thinking - a valuable trait for field operations.',
      image: '/Black Cipher_1.png',
      emotion: 'encouraging'
    },
    {
      character: 'Commander Atlas',
      text: 'Outstanding work, Agent. NOVA\'s systems are operational thanks to your intervention. You\'ve taken your first step into a larger world of AI operative training.',
      image: '/Commander Atlas.png',
      emotion: 'confident'
    }
  ]
}

// Mission 2 Opening: Intelligence Gathering
export const MISSION_02_OPENING: CutsceneData = {
  id: 'mission_02_opening', 
  title: 'OPERATION: INTELLIGENCE GATHERING',
  missionContext: 'Variable Village - Secure Communications Protocol',
  backgroundImage: '/black cipher map 2.png',
  triggers: { beforeMission: true },
  dialogues: [
    {
      character: 'Agent NOVA',
      text: 'Handler, we have a situation. I\'ve detected encrypted transmissions from unknown sources. Standard communication channels may be compromised.',
      image: '/Black Cipher_2.png',
      emotion: 'alert',
      effect: 'glitch'
    },
    {
      character: 'Agent NOVA', 
      text: 'Commander Atlas has authorized new secure protocols using variable-based encoding. Variables store classified information safely - think of them as encrypted containers.',
      image: '/Black Cipher_2.png',
      emotion: 'serious'
    },
    {
      character: 'Dr. Maya Quantum',
      text: 'Welcome to Variable Village, Agent. I\'m Dr. Maya, Research Division Lead. Variables are the foundation of all programming - they hold our most sensitive operational data.',
      image: '/Dr. Maya Nexus.png',
      emotion: 'encouraging'
    },
    {
      character: 'Dr. Maya Quantum',
      text: 'In the field, secure data storage can mean life or death. Master variable assignment and you\'ll control the flow of classified intelligence. Your mission: establish secure variable protocols.',
      image: '/Dr. Maya Nexus.png',
      emotion: 'confident'
    }
  ]
}

// Mission 2 Success: Secure Communications Established
export const MISSION_02_SUCCESS: CutsceneData = {
  id: 'mission_02_success',
  title: 'SECURE COMMUNICATIONS ONLINE',
  missionContext: 'Variable Village - Encryption Successful',
  backgroundImage: '/black cipher map 3.png',
  triggers: { afterSuccess: true },
  dialogues: [
    {
      character: 'Agent NOVA',
      text: 'Communication secure! Variable encoding successful. I\'ve logged your chosen codename in my tactical database - it suits an operative of your caliber.',
      image: '/Black Cipher_3.png',
      emotion: 'confident'
    },
    {
      character: 'Operator Echo',
      text: 'This is Operator Echo, Intel Coordinator. Your secure transmission protocols are now active. Enemy detection risk: MINIMAL. Well executed, Agent.',
      image: '/Operator_Echo_.png',
      emotion: 'confident'
    },
    {
      character: 'Dr. Maya Quantum',
      text: 'Excellent variable implementation! You understand that data storage isn\'t just about syntax - it\'s about creating secure, reliable systems that protect critical information.',
      image: '/Dr. Maya Nexus.png',
      emotion: 'encouraging'
    }
  ]
}

// Mission 3 Opening: Decision Matrix
export const MISSION_03_OPENING: CutsceneData = {
  id: 'mission_03_opening',
  title: 'URGENT: TACTICAL DECISION REQUIRED', 
  missionContext: 'Logic Lake Outpost - Conditional Operations',
  backgroundImage: '/black cipher map 4.png',
  triggers: { beforeMission: true },
  dialogues: [
    {
      character: 'Agent NOVA',
      text: 'Handler, I\'m approaching the target facility but there\'s a complication. Advanced security checkpoint ahead with variable threat assessment protocols.',
      image: '/Black Cipher_4.png',
      emotion: 'alert',
      effect: 'shake'
    },
    {
      character: 'Agent NOVA',
      text: 'I need your decision-making algorithm to guide my response. The scanner will feed me threat level data, but I need conditional logic to interpret it correctly.',
      image: '/Black Cipher_4.png', 
      emotion: 'serious'
    },
    {
      character: 'Commander Atlas',
      text: 'Agent, this is where we separate elite operatives from basic agents. Conditional logic is the backbone of tactical decision-making. Your code will literally determine NOVA\'s next move.',
      image: '/Commander Atlas.png',
      emotion: 'serious'
    },
    {
      character: 'Tech Chief Binary',
      text: 'Binary here. I\'ve uploaded the decision matrix framework to your system. Use if/elif/else statements like we use tactical contingency plans - prepare for every scenario.',
      image: '/Tech Chief Binary.png',
      emotion: 'confident'
    }
  ]
}

// Mission 3 Success: Decision Matrix Mastered
export const MISSION_03_SUCCESS: CutsceneData = {
  id: 'mission_03_success',
  title: 'TACTICAL DECISION SYSTEM ONLINE',
  missionContext: 'Logic Lake Outpost - Decision Matrix Successful',
  backgroundImage: '/black cipher map 5.png',
  triggers: { afterSuccess: true },
  dialogues: [
    {
      character: 'Agent NOVA',
      text: 'Decision matrix uploaded and functioning perfectly! Your conditional logic is flawless - I can now navigate any threat level scenario with complete confidence.',
      image: '/Black Cipher_5.png',
      emotion: 'confident',
      effect: 'pulse'
    },
    {
      character: 'Agent NOVA',
      text: 'Field Test Results: Low threat response ✓ Stealth protocol engaged. High threat response ✓ Exfiltration route calculated. Unknown threat ✓ Strategic hold position confirmed.',
      image: '/Black Cipher_5.png',
      emotion: 'confident'
    },
    {
      character: 'Dr. Maya Quantum',
      text: 'Brilliant conditional logic implementation! You\'ve mastered decision trees that respond to changing conditions. This is what makes AI systems truly intelligent.',
      image: '/Dr. Maya Nexus.png',
      emotion: 'encouraging'
    },
    {
      character: 'Commander Atlas',
      text: 'Exceptional work, Agent. Operatives with your logical reasoning skills are exactly what we need for advanced missions. Prepare for Variable Village assignment.',
      image: '/Commander Atlas.png',
      emotion: 'confident'
    }
  ]
}

// Learning-focused cutscene for teaching concepts
export const PYTHON_BASICS_TUTORIAL: CutsceneData = {
  id: 'python_basics_tutorial',
  title: 'CLASSIFIED: PYTHON PROTOCOL TRAINING',
  missionContext: 'Agent Academy - Programming Fundamentals',
  backgroundImage: '/Briefing Room.png',
  dialogues: [
    {
      character: 'Dr. Maya Quantum',
      text: 'Agent, let me explain Python basics. Think of print() as your tactical communication system - it displays messages to command.',
      image: '/Dr. Maya Nexus.png',
      emotion: 'encouraging'
    },
    {
      character: 'Dr. Maya Quantum',
      text: 'Variables are like classified files. You assign sensitive data: agent_name = "Cipher". Then retrieve it when needed: print(agent_name). Simple but powerful.',
      image: '/Dr. Maya Nexus.png',
      emotion: 'confident'
    },
    {
      character: 'Tech Chief Binary',
      text: 'Remember: every line of code in the field could mean mission success or failure. Syntax matters. Practice makes perfect. Now show me what you\'ve learned.',
      image: '/Tech Chief Binary.png',
      emotion: 'serious'
    }
  ]
}

// Export all cutscenes
export const ALL_CUTSCENES = {
  'mission_01_opening': MISSION_01_OPENING,
  'mission_01_success': MISSION_01_SUCCESS,
  'mission_02_opening': MISSION_02_OPENING,
  'mission_02_success': MISSION_02_SUCCESS, 
  'mission_03_opening': MISSION_03_OPENING,
  'mission_03_success': MISSION_03_SUCCESS,
  'python_basics_tutorial': PYTHON_BASICS_TUTORIAL
}

export type CutsceneId = keyof typeof ALL_CUTSCENES