import { Mission } from '../lib/story-engine'

// Binary Shores Academy - Mission 1: "AI Threat Assessment"
export const MISSION_01: Mission = {
  id: 'binary_shores_01',
  title: 'Operation: AI Threat Assessment',
  description: 'Rogue AI systems have infiltrated global networks. You must learn to deploy our own AI agents to counter this threat. Your first mission: establish communication with Agent NOVA using OpenAI API.',
  codeChallenge: {
    prompt: `🚨 URGENT: AI THREAT DETECTED 🚨
Agent Academy Command Center

SITUATION: Hostile AI entities are compromising global systems.
MISSION: Deploy Agent NOVA using AI API integration.

Your task: Write Python code to activate our AI agent defense system.
Use the OpenAI API to create our first line of defense.

MISSION PARAMETERS:
import openai
openai.api_key = "your_api_key"  # We'll provide this

# Create a function that sends a message to our AI agent
def activate_agent_nova(threat_level):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are Agent NOVA, an AI defense specialist."},
            {"role": "user", "content": f"Threat level: {threat_level}. Assess and respond."}
        ]
    )
    return response.choices[0].message.content

# Test with: print(activate_agent_nova("HIGH"))
- Classification Level: AI AGENT DEPLOYMENT`,
    expectedOutput: 'AI Agent NOVA activated and responding to threats',
    hints: [
      'Import openai library for AI agent communication',
      'Use ChatCompletion.create() to deploy agents',
      'System prompts define agent personality and role'
    ],
    difficulty: 2
  },
  storyBeats: {
    opening: {
      id: 'recruit_opening',
      character: 'atlas',
      type: 'briefing',
      content: `Commander Atlas: "Welcome to Agent Academy, recruit. I'm Commander Atlas, Strategic Operations Director. We've been watching your digital footprint - your problem-solving patterns show potential.

The world faces AI threats that traditional methods can't handle. We need operatives who can think like machines while maintaining human intuition.

Your first task: Wake up Agent NOVA. She's our most advanced AI tactical specialist, but she's been in standby mode for 72 hours. We need you to activate her communication protocols.

Are you ready to begin your training, Agent?"`
    },
    success: [
      {
        id: 'nova_activation_success',
        character: 'nova',
        type: 'reaction',
        content: `Agent NOVA: "Communication protocols verified. Handler identification... confirmed. I am Agent NOVA, AI Tactical Specialist, now online and ready for deployment.

Analysis of activation sequence: Clean implementation, standard protocols followed. Your approach shows methodical thinking - a valuable trait in field operations.

I look forward to working with you, Agent. Together, we'll tackle challenges that require both human creativity and AI precision."`
      },
      {
        id: 'atlas_approval',
        character: 'atlas',
        type: 'consequence',
        content: `Commander Atlas: "Excellent work, Agent. NOVA's systems are fully operational thanks to your intervention. You've just taken your first step into a larger world.

Mission Status: SUCCESS
Agent NOVA recruitment: COMPLETE
Next Assignment: Field readiness assessment

Your methodical approach to the activation sequence demonstrates the kind of strategic thinking we need. Dr. Maya has prepared your next challenge - it's time to test your problem-solving skills under pressure."`,
        effects: {
          relationshipChanges: { atlas: 10, nova: 15 },
          setsFlag: 'nova_recruited'
        }
      }
    ],
    failure: [
      {
        id: 'activation_failure',
        character: 'atlas',
        type: 'reaction',
        content: `Commander Atlas: "Agent, the activation sequence isn't complete. NOVA's systems remain in standby mode. 

Remember: Every line of code in the field could mean the difference between mission success and failure. Take your time, review the protocol requirements, and try again.

The academy believes in learning through iteration. Dr. Maya always says: 'The best agents are made through persistence, not perfection.'"`,
        effects: {
          relationshipChanges: { atlas: 5 }
        }
      }
    ],
    hints: [
      {
        id: 'maya_hint',
        character: 'maya',
        type: 'reaction',
        content: `Dr. Maya: "Need some guidance, Agent? NOVA responds to standard Python print statements. Think of it like sending a message - you're telling the computer what to display.

Try something like: print("Your message here")

Remember, in the field, clear communication is everything. The same principle applies to code."`
      }
    ]
  },
  rewards: {
    xp: 100,
    unlocks: ['binary_shores_02'],
    characterDevelopment: 'NOVA joins your operative team'
  }
}

// Binary Shores Academy - Mission 2: "Variable Intelligence"
export const MISSION_02: Mission = {
  id: 'binary_shores_02',
  title: 'Operation: Intelligence Gathering',
  description: 'Your first field assignment. The enemy has intercepted our communications, but we can use variables to create secure message protocols.',
  codeChallenge: {
    prompt: `🎯 FIELD ASSIGNMENT BRIEFING 🎯
Operation: Intelligence Gathering

Agent NOVA has detected suspicious network activity. We need to establish secure communication protocols using encoded variables.

Your mission: Create a message system that stores classified intel in variables.

MISSION PARAMETERS:
- Store your agent codename in a variable called 'agent_codename'
- Store NOVA's status in a variable called 'ai_partner_status'  
- Display both pieces of intelligence using print statements
- Classification Level: BEGINNER

The enemy is monitoring standard channels. Variable-based encoding will keep our communications secure.`,
    expectedOutput: 'Agent Codename: [student chooses]\nAI Partner Status: OPERATIONAL',
    hints: [
      'Variables store information: variable_name = "value"',
      'Use print() to display variable contents',
      'Choose a cool codename - it will be remembered!'
    ],
    difficulty: 1
  },
  storyBeats: {
    opening: {
      id: 'intel_mission_opening',
      character: 'nova',
      type: 'briefing',
      content: `Agent NOVA: "Handler, we have a situation. I've detected encrypted transmissions from unknown sources. Standard communication channels may be compromised.

Commander Atlas has authorized us to establish new secure protocols using variable-based encoding. This method will allow us to store and transmit classified information without detection.

Your task is to create our new communication framework. We'll start with basic identity verification - store our operational details in secure variables and transmit them through our encoded channel.

Ready to begin the intelligence gathering phase?"`
    },
    success: [
      {
        id: 'secure_comms_success',
        character: 'nova',
        type: 'reaction',
        content: `Agent NOVA: "Communication secure! Variable encoding successful. I've logged your chosen codename in my tactical database - it suits an operative of your caliber.

Protocol Analysis:
✓ Secure variable storage: CONFIRMED
✓ Data transmission: CLEAR
✓ Enemy detection risk: MINIMAL

Your understanding of information storage shows real potential for advanced cryptographic operations. The enemy won't be able to intercept these communications."`
      },
      {
        id: 'atlas_intel_approval',
        character: 'atlas',
        type: 'consequence',
        content: `Commander Atlas: "Outstanding work, Agent. Our communication protocols are now secure thanks to your variable implementation. 

Intelligence Analysis:
- Secure data storage: MASTERED
- Communication protocols: ESTABLISHED
- Field readiness: IMPROVING

Dr. Maya has been monitoring your progress. She's impressed with your systematic approach to problem-solving. Your next mission will test your decision-making abilities under pressure."`,
        effects: {
          relationshipChanges: { atlas: 10, nova: 10 },
          setsFlag: 'secure_comms_established'
        }
      }
    ],
    failure: [
      {
        id: 'intel_failure',
        character: 'nova',
        type: 'reaction',
        content: `Agent NOVA: "Communication protocols incomplete. Variable encoding requires precise syntax to maintain security.

Error Analysis: Variable assignment or output transmission failed. In the field, incomplete intel can compromise entire operations.

Recommendation: Review variable creation syntax and ensure all intelligence is properly transmitted via print statements. I'm standing by for your corrected transmission."`
      }
    ],
    hints: [
      {
        id: 'maya_variable_hint',
        character: 'maya',
        type: 'reaction',
        content: `Dr. Maya: "Having trouble with variables, Agent? Think of them as secure containers for information. 

For example:
secret_code = "CLASSIFIED"
print(secret_code)

In intelligence work, we store important data in variables so we can use it multiple times without revealing the source. Give it another try!"`
      }
    ]
  },
  rewards: {
    xp: 150,
    unlocks: ['binary_shores_03'],
    characterDevelopment: 'Established secure communication protocols with NOVA'
  }
}

// Binary Shores Academy - Mission 3: "Conditional Operations"
export const MISSION_03: Mission = {
  id: 'binary_shores_03',
  title: 'Operation: Decision Matrix',
  description: 'Field agents must make split-second decisions. Master conditional logic to help NOVA navigate a dangerous situation.',
  codeChallenge: {
    prompt: `⚠️ URGENT FIELD SITUATION ⚠️
Operation: Decision Matrix

Agent NOVA has encountered a security checkpoint during her infiltration mission. She needs your guidance to make the correct tactical decision.

The checkpoint scanner will return different threat levels. NOVA needs conditional logic to respond appropriately.

MISSION PARAMETERS:
- Create a function: checkpoint_decision(threat_level)
- If threat_level is "low": return "Proceed with stealth protocol"
- If threat_level is "high": return "Abort mission, exfiltrate immediately"  
- Otherwise: return "Maintain position, await further intel"
- Classification Level: INTERMEDIATE

Time is critical, Agent. NOVA's safety depends on your decision-making code.`,
    expectedOutput: 'Function should handle different threat levels with appropriate responses',
    hints: [
      'Use if/elif/else statements for different conditions',
      'Functions need def keyword and return statements',
      'Test your logic with different threat levels'
    ],
    difficulty: 2
  },
  storyBeats: {
    opening: {
      id: 'decision_mission_opening',
      character: 'nova',
      type: 'briefing',
      content: `Agent NOVA: "Handler, I'm approaching the target facility but there's an unexpected complication. Advanced security checkpoint ahead with variable threat assessment protocols.

I need your decision-making algorithm to guide my response. The scanner will feed me threat level data, but I need conditional logic to interpret it correctly.

In the field, split-second decisions can mean the difference between mission success and compromised operations. Your code will literally determine my next tactical move.

Uploading mission parameters now. The clock is ticking, Agent."`
    },
    success: [
      {
        id: 'decision_success',
        character: 'nova',
        type: 'reaction',
        content: `Agent NOVA: "Decision matrix uploaded and functioning perfectly! Your conditional logic is flawless - I can now navigate any threat level scenario with confidence.

Field Test Results:
✓ Low threat response: Stealth protocol engaged
✓ High threat response: Exfiltration route calculated  
✓ Unknown threat response: Strategic hold position confirmed

Your programming gives me the tactical flexibility I need for complex operations. This is the kind of decision-making intelligence that separates elite operatives from basic agents."`
      },
      {
        id: 'maya_logic_praise',
        character: 'maya',
        type: 'consequence',
        content: `Dr. Maya: "Brilliant conditional logic implementation, Agent! You've just mastered one of the most crucial concepts in both programming and tactical operations.

The ability to create decision trees that respond to changing conditions is what makes AI systems truly intelligent. Your code doesn't just work - it thinks.

Commander Atlas has been reviewing your progress. He's mentioned that operatives with your logical reasoning skills are exactly what we need for the Variable Village assignment."`,
        effects: {
          relationshipChanges: { maya: 15, nova: 15 },
          setsFlag: 'decision_logic_mastered'
        }
      }
    ],
    failure: [
      {
        id: 'decision_failure',
        character: 'nova',
        type: 'reaction',
        content: `Agent NOVA: "Decision matrix malfunction! I'm unable to process the threat level data correctly. My tactical systems need properly structured conditional logic to function.

Error Analysis: Conditional statements require precise syntax. Remember: if, elif, and else must be properly indented and followed by colons.

I'm maintaining defensive position until you can correct the decision algorithm. Time is critical, Agent."`
      }
    ],
    hints: [
      {
        id: 'atlas_logic_hint',
        character: 'atlas',
        type: 'reaction',
        content: `Commander Atlas: "Agent, conditional logic is the backbone of tactical decision-making. In programming, we use if/elif/else statements just like we use decision trees in military strategy.

Structure it like this:
if condition:
    # action for this condition
elif other_condition:  
    # action for different condition
else:
    # default action

Every great operative learns to think in contingencies. Apply that same logic to your code."`
      }
    ]
  },
  rewards: {
    xp: 200,
    unlocks: ['variable_village_01'],
    characterDevelopment: 'NOVA gains advanced decision-making capabilities'
  }
}

// Export all missions
export const BINARY_SHORES_MISSIONS = [
  MISSION_01,
  MISSION_02, 
  MISSION_03
]

export const ALL_MISSIONS = {
  binary_shores: BINARY_SHORES_MISSIONS
}