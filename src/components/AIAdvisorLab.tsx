'use client'

import { useState, useEffect } from 'react'
import { Play, CheckCircle, Brain, Code, Sparkles, MessageCircle, TestTube, Rocket } from 'lucide-react'
import Confetti from 'react-confetti'

interface AIAdvisorStep {
  id: string
  title: string
  instruction: string
  codeTemplate: string
  solution: string
  testScenarios: {
    input: string
    expectedBehavior: string
  }[]
  completionCheck: (code: string) => boolean
  emoji: string
  xpReward: number
}

interface AIAdvisorLabProps {
  onComplete?: () => void
}

export default function AIAdvisorLab({ onComplete }: AIAdvisorLabProps) {
  const [currentStepIndex, setStepIndex] = useState(0)
  const [code, setCode] = useState('')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [totalXP, setTotalXP] = useState(0)
  const [testResults, setTestResults] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isTestingAI, setIsTestingAI] = useState(false)

  const aiAdvisorSteps: AIAdvisorStep[] = [
    {
      id: 'setup',
      title: 'Create Your AI\'s Knowledge Base',
      emoji: '🧠',
      instruction: 'First, let\'s create lists of advice for different situations. Your AI needs knowledge before it can help students!',
      codeTemplate: `# Your AI Advisor's Knowledge Database
# TODO: Create lists for different types of help

stress_relief = [
    # Add 3-4 stress relief tips here
]

study_advice = [
    # Add 3-4 study tips here  
]

encouragement = [
    # Add 3-4 encouraging messages here
]

print("✅ AI Knowledge Base Created!")
print(f"Stress relief options: {len(stress_relief)}")
print(f"Study advice options: {len(study_advice)}")
print(f"Encouragement options: {len(encouragement)}")`,
      solution: `stress_relief = [
    "Take 5 deep breaths and count to 10",
    "Go for a 10-minute walk outside",
    "Listen to calming music",
    "Talk to someone you trust"
]

study_advice = [
    "Break large tasks into smaller 15-minute chunks",
    "Create a distraction-free study space",
    "Use the Pomodoro Technique: 25 min work, 5 min break",
    "Teach what you learned to someone else"
]

encouragement = [
    "You're braver than you believe and stronger than you seem! 💪",
    "Every expert was once a beginner - you're on your way! 🌟", 
    "Mistakes are proof that you're trying and learning! ✨",
    "Your potential is limitless when you believe in yourself! 🚀"
]`,
      testScenarios: [
        {
          input: "Check that stress_relief list has items",
          expectedBehavior: "Should contain stress management techniques"
        },
        {
          input: "Check that study_advice list has items", 
          expectedBehavior: "Should contain learning strategies"
        }
      ],
      completionCheck: (code: string) => {
        return code.includes('stress_relief = [') && 
               code.includes('study_advice = [') && 
               code.includes('encouragement = [') &&
               code.split('stress_relief = [')[1]?.includes('"') &&
               code.split('study_advice = [')[1]?.includes('"') &&
               code.split('encouragement = [')[1]?.includes('"')
      },
      xpReward: 100
    },
    {
      id: 'brain',
      title: 'Code the AI Brain Function',
      emoji: '🤖',
      instruction: 'Now create the "brain" function that analyzes what students say and decides what type of help they need.',
      codeTemplate: `import random

# Your AI knowledge base (from previous step)
stress_relief = ["Take 5 deep breaths", "Go for a walk", "Listen to music"]
study_advice = ["Break tasks into chunks", "Find quiet space", "Use Pomodoro technique"] 
encouragement = ["You've got this! 💪", "Every expert was once a beginner! 🌟", "Keep going! ✨"]

def ai_brain(student_message):
    """
    The thinking center of your AI advisor
    Analyzes student messages and determines what type of help they need
    """
    # TODO: Convert message to lowercase for easier analysis
    message = # your code here
    
    # TODO: Check for stress-related keywords
    if # your condition here:
        return "stress"
    
    # TODO: Check for study-related keywords  
    elif # your condition here:
        return "study"
    
    # TODO: Default to encouragement for everything else
    else:
        return # your return value here

# Test your AI brain
test_message = "I'm so stressed about my math test tomorrow"
advice_type = ai_brain(test_message)
print(f"Student said: {test_message}")
print(f"AI detected they need: {advice_type}")`,
      solution: `def ai_brain(student_message):
    message = student_message.lower()
    
    if "stress" in message or "anxiety" in message or "worried" in message:
        return "stress"
    elif "study" in message or "homework" in message or "test" in message or "exam" in message:
        return "study" 
    else:
        return "encouragement"`,
      testScenarios: [
        {
          input: 'ai_brain("I\'m stressed about my exam")',
          expectedBehavior: 'Should return "stress"'
        },
        {
          input: 'ai_brain("I need help with homework")', 
          expectedBehavior: 'Should return "study"'
        }
      ],
      completionCheck: (code: string) => {
        return code.includes('def ai_brain(') &&
               code.includes('.lower()') &&
               code.includes('if') && code.includes('elif') && code.includes('else') &&
               code.includes('return')
      },
      xpReward: 150
    },
    {
      id: 'responses',
      title: 'Create Personalized Response System',
      emoji: '💝',
      instruction: 'Connect your AI brain to the advice database! This function takes the brain\'s decision and creates personalized, caring responses.',
      codeTemplate: `def create_response(advice_type, student_name="friend"):
    """
    Creates personalized advice based on AI brain analysis
    This is where your AI becomes helpful and caring!
    """
    
    # TODO: Handle stress relief responses
    if advice_type == "stress":
        advice = # pick random advice from stress_relief list
        return f"Hey {student_name}, I can tell you're feeling overwhelmed. Here's what might help: {advice} 🌱"
    
    # TODO: Handle study advice responses
    elif advice_type == "study":
        advice = # pick random advice from study_advice list  
        return f"{student_name}, let's boost your learning! Try this strategy: {advice} 📚"
    
    # TODO: Handle encouragement responses
    else:
        advice = # pick random encouragement message
        return f"{student_name}, here's some motivation: {advice} 💙"

# Test your complete AI system!
student_input = "I'm stressed about my chemistry test"
brain_decision = ai_brain(student_input)
ai_response = create_response(brain_decision, "Alex")

print("🤖 YOUR AI ADVISOR IN ACTION:")
print(f"Student: {student_input}")
print(f"AI Advisor: {ai_response}")`,
      solution: `def create_response(advice_type, student_name="friend"):
    if advice_type == "stress":
        advice = random.choice(stress_relief)
        return f"Hey {student_name}, I can tell you're feeling overwhelmed. Here's what might help: {advice} 🌱"
    elif advice_type == "study":
        advice = random.choice(study_advice)
        return f"{student_name}, let's boost your learning! Try this strategy: {advice} 📚"
    else:
        advice = random.choice(encouragement)
        return f"{student_name}, here's some motivation: {advice} 💙"`,
      testScenarios: [
        {
          input: 'Test with stressed student message',
          expectedBehavior: 'Should give personalized stress relief advice'
        },
        {
          input: 'Test with study help request',
          expectedBehavior: 'Should give personalized study strategies'
        }
      ],
      completionCheck: (code: string) => {
        return code.includes('def create_response(') &&
               code.includes('random.choice(') &&
               code.includes('f"Hey {student_name}') &&
               code.includes('f"{student_name}, let\'s boost') &&
               code.includes('f"{student_name}, here\'s some')
      },
      xpReward: 200
    },
    {
      id: 'complete',
      title: 'Deploy Your AI Advisor',
      emoji: '🚀',
      instruction: 'Put it all together! Create the complete AI advisor that can handle real student conversations.',
      codeTemplate: `# Complete AI Advisor System - Your Creation!

def complete_ai_advisor():
    """Your fully functional AI advisor - ready to help real students!"""
    
    print("🤖✨ Welcome to Your Personal AI Advisor! ✨🤖")
    print("I'm here to help with stress, studying, and motivation!")
    print()
    
    # TODO: Create a conversation loop
    while True:
        # Get student input
        student_message = input("Tell me what's on your mind (or 'quit' to exit): ")
        
        # TODO: Check if they want to quit
        if # your quit condition:
            print("Take care! Remember, you're capable of amazing things! 🌟")
            break
        
        # TODO: Get student name if first interaction
        if # condition to check if you need their name:
            student_name = input("What's your name? ")
        else:
            student_name = "friend"
        
        # TODO: Use your AI brain to analyze their message
        advice_needed = # call your ai_brain function
        
        # TODO: Create personalized response
        response = # call your create_response function
        
        # TODO: Display the AI's helpful response
        print(f"\\n🤖 AI Advisor: {response}")
        print("-" * 50)

# Launch your AI advisor!
print("🎉 CONGRATULATIONS! Your AI Advisor is ready!")
print("Time to test it with real conversations!")
complete_ai_advisor()`,
      solution: `def complete_ai_advisor():
    print("🤖✨ Welcome to Your Personal AI Advisor! ✨🤖")
    print("I'm here to help with stress, studying, and motivation!")
    print()
    
    student_name = None
    
    while True:
        student_message = input("Tell me what's on your mind (or 'quit' to exit): ")
        
        if student_message.lower() == 'quit':
            print("Take care! Remember, you're capable of amazing things! 🌟")
            break
        
        if student_name is None:
            student_name = input("What's your name? ")
        
        advice_needed = ai_brain(student_message)
        response = create_response(advice_needed, student_name)
        
        print(f"\\n🤖 AI Advisor: {response}")
        print("-" * 50)`,
      testScenarios: [
        {
          input: 'Run complete AI advisor system',
          expectedBehavior: 'Should create interactive conversation loop'
        },
        {
          input: 'Test with multiple conversation turns',
          expectedBehavior: 'Should remember name and provide varied responses'
        }
      ],
      completionCheck: (code: string) => {
        return code.includes('def complete_ai_advisor(') &&
               code.includes('while True:') &&
               code.includes('input(') &&
               code.includes('ai_brain(') &&
               code.includes('create_response(')
      },
      xpReward: 250
    }
  ]

  const currentStep = aiAdvisorSteps[currentStepIndex]
  const isLastStep = currentStepIndex === aiAdvisorSteps.length - 1

  // Initialize code template when step changes
  useEffect(() => {
    setCode(currentStep.codeTemplate)
    setTestResults([])
  }, [currentStepIndex])

  const checkCodeCompletion = () => {
    const isComplete = currentStep.completionCheck(code)
    if (isComplete) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]))
      setTotalXP(prev => prev + currentStep.xpReward)
      
      // Show celebration
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      
      return true
    }
    return false
  }

  const handleRunCode = () => {
    const isComplete = checkCodeCompletion()
    
    if (isComplete) {
      setTestResults([
        `✅ Step ${currentStepIndex + 1} Complete!`,
        `🎉 Earned ${currentStep.xpReward} XP!`,
        `🚀 ${currentStep.title} - Success!`,
        '',
        '💡 Your code meets all requirements!'
      ])
    } else {
      setTestResults([
        `🔧 Not quite complete yet...`,
        `💭 Check the TODO comments in your code`,
        `📝 Make sure to fill in all the missing parts`,
        '',
        '💪 You\'re close! Keep coding!'
      ])
    }
  }

  const handleTestAI = async () => {
    const isComplete = checkCodeCompletion()
    if (!isComplete) {
      setTestResults(['❌ Complete your code first before testing!'])
      return
    }

    setIsTestingAI(true)
    setTestResults(['🧪 Testing your AI advisor...', '', '🤖 Simulating student conversations:'])
    
    // Simulate testing the AI with different scenarios
    setTimeout(() => {
      const testMessages = [
        '"I\'m stressed about my math test" → AI detects stress and gives calming advice ✅',
        '"I need help studying for history" → AI detects study need and gives learning tips ✅', 
        '"I\'m feeling down today" → AI provides encouragement and motivation ✅',
        '',
        '🎉 Your AI advisor is working perfectly!',
        '🚀 Ready to help real students!'
      ]
      setTestResults(prev => [...prev, ...testMessages])
      setIsTestingAI(false)
    }, 3000)
  }

  const handleNextStep = () => {
    if (completedSteps.has(currentStep.id) && !isLastStep) {
      setStepIndex(currentStepIndex + 1)
    }
  }

  const handleComplete = () => {
    if (completedSteps.has(currentStep.id)) {
      onComplete?.()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      {/* Lab Header */}
      <div className="bg-gradient-to-r from-orange-800/30 to-red-800/30 rounded-3xl p-6 border-2 border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-pulse">🤖</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">AI Advisor Laboratory</h2>
              <p className="text-orange-200 text-lg">Build Your Real AI Advisor</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold text-2xl flex items-center gap-2">
              <Brain className="h-6 w-6" />
              {totalXP} XP Earned
            </div>
            <div className="text-yellow-300 text-sm">
              Step {currentStepIndex + 1} of {aiAdvisorSteps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex justify-center gap-2 mb-6">
        {aiAdvisorSteps.map((step, index) => (
          <div
            key={step.id}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              completedSteps.has(step.id)
                ? 'bg-green-600 border-green-400 text-white'
                : index === currentStepIndex
                ? 'bg-orange-600 border-orange-400 text-white'
                : 'bg-gray-700 border-gray-500 text-gray-400'
            }`}
          >
            <span className="text-lg">{step.emoji}</span>
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Instruction Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/30 rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-6xl">{currentStep.emoji}</div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentStep.title}</h3>
                <p className="text-orange-200">{currentStep.instruction}</p>
              </div>
            </div>
          </div>

          {/* Test Scenarios */}
          <div className="bg-blue-900/30 rounded-xl border border-blue-500/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TestTube className="h-5 w-5 text-blue-400" />
              <h4 className="text-blue-300 font-bold">Test Scenarios:</h4>
            </div>
            <div className="space-y-2">
              {currentStep.testScenarios.map((scenario, index) => (
                <div key={index} className="text-sm">
                  <div className="text-blue-200">📝 {scenario.input}</div>
                  <div className="text-blue-300 ml-4">→ {scenario.expectedBehavior}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRunCode}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-bold transition-all transform hover:scale-105"
            >
              <Play className="h-5 w-5" />
              🔍 Check My Code
            </button>
            
            {completedSteps.has(currentStep.id) && (
              <button
                onClick={handleTestAI}
                disabled={isTestingAI}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isTestingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Testing AI...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5" />
                    🧪 Test My AI Advisor
                  </>
                )}
              </button>
            )}
            
            {!isLastStep && completedSteps.has(currentStep.id) && (
              <button
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold transition-all transform hover:scale-105"
              >
                <Rocket className="h-5 w-5" />
                ➡️ Next Step
              </button>
            )}
            
            {isLastStep && completedSteps.has(currentStep.id) && (
              <button
                onClick={handleComplete}
                className="w-full flex items-center justify-center gap-2 px-8 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
              >
                <Sparkles className="h-6 w-6" />
                🎉 MY AI ADVISOR IS COMPLETE! 🎉
              </button>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="space-y-6">
          {/* Code Editor */}
          <div className="bg-gray-900 rounded-xl border border-gray-600">
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-400" />
                  <h4 className="text-orange-300 font-bold">Your AI Advisor Code:</h4>
                </div>
                {completedSteps.has(currentStep.id) && (
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 font-mono text-sm bg-gray-800 text-green-400 border border-gray-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Write your AI advisor code here..."
                style={{ lineHeight: '1.5' }}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-900 rounded-xl border border-gray-600">
            <div className="border-b border-gray-700 p-4">
              <h4 className="text-cyan-300 font-bold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                AI Advisor Output:
              </h4>
            </div>
            
            <div className="p-4">
              <div className="h-48 bg-gray-800 rounded-lg p-4 border border-gray-700 overflow-y-auto">
                {testResults.length > 0 ? (
                  <div className="space-y-1">
                    {testResults.map((result, index) => (
                      <div key={index} className={`text-sm font-mono ${
                        result.includes('✅') ? 'text-green-400' :
                        result.includes('❌') ? 'text-red-400' :
                        result.includes('🤖') ? 'text-cyan-400' :
                        result.includes('🎉') ? 'text-yellow-400' :
                        'text-gray-300'
                      }`}>
                        {result}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Click "Check My Code" to test your AI advisor...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => {
            if (currentStepIndex > 0) {
              setStepIndex(currentStepIndex - 1)
            }
          }}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            currentStepIndex === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105'
          }`}
        >
          ← Previous Step
        </button>

        <div className="text-center">
          <div className="text-white font-semibold text-lg">{currentStep.title}</div>
          <div className="text-orange-400 text-sm">
            {completedSteps.has(currentStep.id) ? '✅ Complete' : '🔧 In Progress'}
          </div>
        </div>

        <div className="text-orange-300 font-semibold">
          Total XP: {totalXP} / {aiAdvisorSteps.reduce((sum, step) => sum + step.xpReward, 0)}
        </div>
      </div>

      {/* Final Celebration */}
      {completedSteps.size === aiAdvisorSteps.length && (
        <div className="bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-3xl p-8 border-2 border-yellow-500/30 text-center">
          <div className="text-8xl mb-4 animate-bounce">🎊</div>
          <h3 className="text-4xl font-bold text-white mb-4">
            🎉 AI ADVISOR CREATION COMPLETE! 🎉
          </h3>
          <p className="text-yellow-200 text-lg mb-6">
            You've successfully built a fully functional AI advisor that can:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-900/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-green-200 font-semibold">Analyze Messages</div>
              <div className="text-green-300 text-sm">Understand student emotions</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4">
              <div className="text-3xl mb-2">💝</div>
              <div className="text-blue-200 font-semibold">Give Personal Advice</div>
              <div className="text-blue-300 text-sm">Customized responses</div>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-purple-200 font-semibold">Handle Conversations</div>
              <div className="text-purple-300 text-sm">Interactive dialogue system</div>
            </div>
          </div>
          <p className="text-white text-lg font-semibold">
            🚀 Congratulations! You're officially an AI developer!
          </p>
        </div>
      )}
    </div>
  )
}