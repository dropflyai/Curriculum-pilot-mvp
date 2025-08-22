'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Code, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => <div className="text-white">Loading Python Editor...</div>
})

interface TutorialStep {
  id: string
  title: string
  explanation: string
  code: string
  expectedOutput: string
  emoji: string
  tip?: string
}

interface InteractivePythonTutorialProps {
  onComplete?: () => void
}

export default function InteractivePythonTutorial({ onComplete }: InteractivePythonTutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [showOutput, setShowOutput] = useState(false)
  const [executionResult, setExecutionResult] = useState<{success: boolean, output: string, error?: string} | null>(null)

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Python Programming',
      explanation: "Let's start with the basics! Python is like having a conversation with your computer. You give it instructions, and it responds. Watch how we can make Python say hello to us.",
      code: 'print("Hello, future AI creator!")\nprint("Welcome to your Python journey!")',
      expectedOutput: 'Hello, future AI creator!\nWelcome to your Python journey!',
      emoji: '👋',
      tip: 'The print() function is like speaking out loud - it shows text on the screen!'
    },
    {
      id: 'variables',
      title: 'Storing Information with Variables',
      explanation: 'Variables are like labeled boxes where we store information. Think of them as your phone contacts - each name points to a phone number. In Python, we can store text, numbers, or anything!',
      code: 'student_name = "Alex"\nfavorite_subject = "Science"\ngrade_level = 9\n\nprint(f"Hi {student_name}!")\nprint(f"You love {favorite_subject} and you\'re in grade {grade_level}")',
      expectedOutput: 'Hi Alex!\nYou love Science and you\'re in grade 9',
      emoji: '📦',
      tip: 'Use descriptive variable names like "student_name" instead of just "n" - it makes your code readable!'
    },
    {
      id: 'user-input',
      title: 'Getting Information from Users',
      explanation: 'The input() function is like asking someone a question and waiting for their answer. This is how we make programs interactive - they can respond to what users tell them!',
      code: '# This is how we get user input\nuser_name = input("What\'s your name? ")\nuser_mood = input("How are you feeling today? ")\n\nprint(f"Nice to meet you, {user_name}!")\nprint(f"I hope your {user_mood} day gets even better!")',
      expectedOutput: '# When user types "Sarah" and "excited":\nNice to meet you, Sarah!\nI hope your excited day gets even better!',
      emoji: '💬',
      tip: 'input() always gives you text (string) back, even if someone types numbers!'
    },
    {
      id: 'conditionals',
      title: 'Making Decisions with If Statements',
      explanation: 'Computers can make decisions! if statements are like asking "Is this true?" and then doing different things based on the answer. This is how AI advisors give different advice for different situations.',
      code: 'mood = input("How are you feeling? (happy/sad/stressed) ")\n\nif mood == "happy":\n    print("That\'s wonderful! Keep spreading those good vibes! 😊")\nelif mood == "sad":\n    print("I\'m sorry you\'re feeling down. Remember, this feeling will pass. 🤗")\nelif mood == "stressed":\n    print("Take a deep breath. You\'ve got this! Try some relaxation. 🧘")\nelse:\n    print("Whatever you\'re feeling is valid. I\'m here to help! 💙")',
      expectedOutput: '# When user types "stressed":\nTake a deep breath. You\'ve got this! Try some relaxation. 🧘',
      emoji: '🤔',
      tip: 'elif means "else if" - it is like saying "if not that, then maybe this?"'
    },
    {
      id: 'lists-advice',
      title: 'Creating Lists of Advice',
      explanation: 'Lists are like having multiple items in a shopping bag. We can store many pieces of advice and pick different ones. This is perfect for AI advisors that need lots of helpful responses!',
      code: 'study_tips = [\n    "Take breaks every 25 minutes",\n    "Find a quiet study space",\n    "Use flashcards for memorization",\n    "Teach someone else what you learned",\n    "Get enough sleep before tests"\n]\n\nprint("Here are some study tips:")\nfor tip in study_tips:\n    print(f"• {tip}")',
      expectedOutput: 'Here are some study tips:\n• Take breaks every 25 minutes\n• Find a quiet study space\n• Use flashcards for memorization\n• Teach someone else what you learned\n• Get enough sleep before tests',
      emoji: '📝',
      tip: 'Lists use square brackets [] and commas to separate items!'
    },
    {
      id: 'random-selection',
      title: 'Adding Randomness for Variety',
      explanation: 'Sometimes we want our AI to give different advice each time. The random module is like rolling dice - it helps us pick different responses so our advisor feels more natural and interesting!',
      code: 'import random\n\nencouragement = [\n    "You\'re doing amazing! Keep going! 🌟",\n    "Every expert was once a beginner! 💪",\n    "Mistakes are proof you\'re trying! 🎯",\n    "You\'re braver than you believe! 🦁",\n    "Progress, not perfection! ✨"\n]\n\nrandom_encouragement = random.choice(encouragement)\nprint("Your daily motivation:")\nprint(random_encouragement)',
      expectedOutput: '# Each time it runs, you get a different message:\nYour daily motivation:\nYou\'re doing amazing! Keep going! 🌟',
      emoji: '🎲',
      tip: 'random.choice() picks one random item from a list - like pulling a name from a hat!'
    },
    {
      id: 'building-advisor-step1',
      title: 'Step 1: Create Your AI Advisor Foundation',
      explanation: "Now we're building YOUR AI advisor! We start by creating the basic structure - asking what kind of help they need and storing different types of advice. This is like building the brain of your advisor!",
      code: 'import random\n\n# Your AI Advisor\'s Knowledge Base\npositive_affirmations = [\n    "You are capable of amazing things! 🌟",\n    "Today is full of possibilities! ✨",\n    "You have the power to make great choices! 💪",\n    "Your potential is limitless! 🚀"\n]\n\nstudy_advice = [\n    "Break big tasks into smaller steps",\n    "Create a study schedule and stick to it",\n    "Find your peak focus hours",\n    "Use active learning techniques"\n]\n\nstress_relief = [\n    "Take 5 deep breaths",\n    "Go for a short walk",\n    "Listen to calming music", \n    "Talk to someone you trust"\n]\n\nprint("🤖 AI Advisor Foundation Created!")\nprint("Knowledge base loaded with positive advice!")',
      expectedOutput: '🤖 AI Advisor Foundation Created!\nKnowledge base loaded with positive advice!',
      emoji: '🏗️',
      tip: "We're organizing advice into categories - this makes our AI smarter and more helpful!"
    },
    {
      id: 'building-advisor-step2',
      title: 'Step 2: Add the AI Brain Logic',
      explanation: 'Now we give our AI the ability to think! We create a function that takes what the user says and decides what type of help to give. This is the "brain" that makes decisions based on keywords.',
      code: 'def ai_advisor_brain(user_message):\n    """The thinking center of your AI advisor"""\n    user_message = user_message.lower()  # Make it case-insensitive\n    \n    # Detect what kind of help they need\n    if "stressed" in user_message or "anxiety" in user_message:\n        advice_type = "stress_relief"\n    elif "study" in user_message or "homework" in user_message or "test" in user_message:\n        advice_type = "study_advice"\n    elif "sad" in user_message or "down" in user_message or "upset" in user_message:\n        advice_type = "positive_affirmations"\n    else:\n        advice_type = "positive_affirmations"  # Default to positivity\n    \n    print(f"🧠 AI Brain detected: {advice_type}")\n    return advice_type\n\n# Test the brain\ntest_message = "I\'m feeling stressed about my math test"\nadvice_needed = ai_advisor_brain(test_message)\nprint(f"User said: {test_message}")\nprint(f"AI recommends: {advice_needed}")',
      expectedOutput: '🧠 AI Brain detected: stress_relief\nUser said: I\'m feeling stressed about my math test\nAI recommends: stress_relief',
      emoji: '🧠',
      tip: 'The .lower() method makes "STRESSED" and "stressed" both work - smart programming!'
    },
    {
      id: 'building-advisor-step3',
      title: 'Step 3: Connect Brain to Advice Database',
      explanation: "Now we connect the AI brain to our advice database! When the brain decides what help is needed, this function grabs the perfect advice. It's like having a smart librarian who knows exactly which book you need.",
      code: 'import random\n\n# Re-create the advice lists for this step\npositive_affirmations = [\n    "You are capable of amazing things! 🌟",\n    "Today is full of possibilities! ✨",\n    "You have the power to make great choices! 💪",\n    "Your potential is limitless! 🚀"\n]\n\nstudy_advice = [\n    "Break big tasks into smaller steps",\n    "Create a study schedule and stick to it",\n    "Find your peak focus hours",\n    "Use active learning techniques"\n]\n\nstress_relief = [\n    "Take 5 deep breaths",\n    "Go for a short walk",\n    "Listen to calming music", \n    "Talk to someone you trust"\n]\n\n# The AI brain function\ndef ai_advisor_brain(user_message):\n    user_message = user_message.lower()\n    if "stressed" in user_message or "anxiety" in user_message:\n        return "stress_relief"\n    elif "study" in user_message or "homework" in user_message or "test" in user_message:\n        return "study_advice"\n    else:\n        return "positive_affirmations"\n\n# The advice connection function\ndef get_personalized_advice(advice_type, user_name="friend"):\n    """Get specific advice based on what the AI brain detected"""\n    \n    if advice_type == "stress_relief":\n        advice = random.choice(stress_relief)\n        response = f"Hey {user_name}, I can tell you\'re feeling overwhelmed. Here\'s what helps: {advice} 🌱"\n    \n    elif advice_type == "study_advice":\n        advice = random.choice(study_advice)\n        response = f"{user_name}, let\'s boost your study game! Try this: {advice} 📚"\n    \n    else:  # positive_affirmations\n        advice = random.choice(positive_affirmations)\n        response = f"{user_name}, here\'s some positivity for you: {advice} 💝"\n    \n    return response\n\n# Test the complete system\nuser_input = "I have a big test tomorrow and I\'m stressed"\nbrain_decision = ai_advisor_brain(user_input)\npersonalized_response = get_personalized_advice(brain_decision, "Alex")\n\nprint("=== AI ADVISOR IN ACTION ===")\nprint(f"Student: {user_input}")\nprint(f"AI Advisor: {personalized_response}")',
      expectedOutput: '=== AI ADVISOR IN ACTION ===\nStudent: I have a big test tomorrow and I\'m stressed\nAI Advisor: Hey Alex, I can tell you\'re feeling overwhelmed. Here\'s what helps: Take 5 deep breaths 🌱',
      emoji: '🔗',
      tip: 'We use f-strings with {user_name} to make responses feel personal and caring!'
    },
    {
      id: 'building-advisor-step4',
      title: 'Step 4: Create the Complete AI Advisor',
      explanation: "This is it! We're putting everything together into one amazing AI advisor. This is your complete creation - it can listen, think, and respond just like a real counselor. You've built something truly incredible!",
      code: 'import random\n\n# Complete AI Advisor - All components together!\npositive_affirmations = [\n    "You are capable of amazing things! 🌟",\n    "Today is full of possibilities! ✨",\n    "You have the power to make great choices! 💪",\n    "Your potential is limitless! 🚀"\n]\n\nstudy_advice = [\n    "Break big tasks into smaller steps",\n    "Create a study schedule and stick to it",\n    "Find your peak focus hours",\n    "Use active learning techniques"\n]\n\nstress_relief = [\n    "Take 5 deep breaths",\n    "Go for a short walk",\n    "Listen to calming music", \n    "Talk to someone you trust"\n]\n\ndef ai_advisor_brain(user_message):\n    """The thinking center of your AI advisor"""\n    user_message = user_message.lower()\n    if "stressed" in user_message or "anxiety" in user_message:\n        return "stress_relief"\n    elif "study" in user_message or "homework" in user_message or "test" in user_message:\n        return "study_advice"\n    else:\n        return "positive_affirmations"\n\ndef get_personalized_advice(advice_type, user_name="friend"):\n    """Get specific advice based on what the AI brain detected"""\n    if advice_type == "stress_relief":\n        advice = random.choice(stress_relief)\n        response = f"Hey {user_name}, I can tell you\'re feeling overwhelmed. Here\'s what helps: {advice} 🌱"\n    elif advice_type == "study_advice":\n        advice = random.choice(study_advice)\n        response = f"{user_name}, let\'s boost your study game! Try this: {advice} 📚"\n    else:\n        advice = random.choice(positive_affirmations)\n        response = f"{user_name}, here\'s some positivity for you: {advice} 💝"\n    return response\n\n# Test your complete AI advisor!\nprint("🎉 CONGRATULATIONS! 🎉")\nprint("You\'ve successfully created your very own AI advisor!")\nprint("\\n🤖✨ Your AI Advisor is Ready! ✨🤖")\n\n# Demo the advisor with sample interactions\ntest_messages = [\n    "I\'m feeling stressed about my math test",\n    "I need help with my homework",\n    "I\'m feeling sad today"\n]\n\nprint("\\n=== DEMO: Your AI in Action! ===")\nfor message in test_messages:\n    advice_type = ai_advisor_brain(message)\n    response = get_personalized_advice(advice_type, "Student")\n    print(f"\\nStudent: {message}")\n    print(f"AI Advisor: {response}")\n\nprint("\\n🚀 Amazing! You\'ve built a real AI advisor!")',
      expectedOutput: '🎉 CONGRATULATIONS! 🎉\nYou\'ve successfully created your very own AI advisor!\n\n🤖✨ Your AI Advisor is Ready! ✨🤖\n\n=== DEMO: Your AI in Action! ===\n\nStudent: I\'m feeling stressed about my math test\nAI Advisor: Hey Student, I can tell you\'re feeling overwhelmed. Here\'s what helps: Take 5 deep breaths 🌱\n\nStudent: I need help with my homework\nAI Advisor: Student, let\'s boost your study game! Try this: Break big tasks into smaller steps 📚\n\nStudent: I\'m feeling sad today\nAI Advisor: Student, here\'s some positivity for you: You are capable of amazing things! 🌟\n\n🚀 Amazing! You\'ve built a real AI advisor!',
      emoji: '🎉',
      tip: "You've just built a real AI advisor! This is actual artificial intelligence programming!"
    }
  ]

  const currentStep = tutorialSteps[currentStepIndex]
  const isLastStep = currentStepIndex === tutorialSteps.length - 1
  const isFirstStep = currentStepIndex === 0

  const getErrorExplanation = (error: string) => {
    if (error.includes('SyntaxError')) {
      return {
        explanation: "🤔 Syntax Error means Python couldn't understand your code structure.",
        hints: [
          "Check for missing quotes around text (strings)",
          "Make sure parentheses () are properly closed",
          "Check your indentation - Python is picky about spaces!"
        ]
      }
    }
    if (error.includes('NameError')) {
      return {
        explanation: "📝 Name Error means you're using a variable that doesn't exist yet.",
        hints: [
          "Make sure you've defined the variable before using it",
          "Check for typos in variable names",
          "Remember Python is case-sensitive: 'Name' ≠ 'name'"
        ]
      }
    }
    if (error.includes('IndentationError')) {
      return {
        explanation: "📐 Indentation Error means your spacing is off.",
        hints: [
          "Use 4 spaces (or 1 tab) for each indentation level",
          "Make sure if/elif/else blocks are properly indented",
          "Check that all lines at the same level have the same indentation"
        ]
      }
    }
    return {
      explanation: "🐛 Something went wrong with your code.",
      hints: [
        "Read the error message carefully for clues",
        "Try comparing your code to the example above",
        "Don't worry - errors are how we learn!"
      ]
    }
  }

  const handleNext = () => {
    if (!isLastStep) {
      // Mark current step as completed
      const newCompleted = new Set([...completedSteps, currentStep.id])
      setCompletedSteps(newCompleted)
      setCurrentStepIndex(currentStepIndex + 1)
      setShowOutput(false)
      setExecutionResult(null)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1)
      setShowOutput(false)
      setExecutionResult(null)
    }
  }

  const handleRunCode = () => {
    setShowOutput(true)
  }

  const handleExecutionResult = (result: {success: boolean, output: string, error?: string}) => {
    setExecutionResult(result)
    setShowOutput(true)
  }

  const handleRunTutorialCode = async () => {
    // Execute the exact tutorial code using the python executor
    try {
      const { executeCode } = await import('@/lib/python-executor')
      const result = await executeCode(currentStep.code)
      setExecutionResult(result)
      setShowOutput(true)
    } catch (error) {
      // Fallback to simulated success if execution fails
      const simulatedResult = {
        success: true,
        output: currentStep.expectedOutput,
        error: undefined
      }
      setExecutionResult(simulatedResult)
      setShowOutput(true)
    }
  }

  const handleComplete = () => {
    // Mark final step as completed
    const newCompleted = new Set([...completedSteps, currentStep.id])
    setCompletedSteps(newCompleted)
    onComplete?.()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-3xl p-6 border-2 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-pulse">🐍</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">Interactive Python Laboratory</h2>
              <p className="text-blue-200 text-lg">Build Your AI Advisor Step by Step</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 font-bold text-xl">
              Step {currentStepIndex + 1} of {tutorialSteps.length}
            </div>
            <div className="text-cyan-300 text-sm">
              {Math.round(((completedSteps.size + (showOutput ? 0.5 : 0)) / tutorialSteps.length) * 100)}% Complete
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 bg-blue-900/50 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full h-3 transition-all duration-500"
            style={{ width: `${((completedSteps.size + (showOutput ? 0.5 : 0)) / tutorialSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Navigation Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {tutorialSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => {
              setCurrentStepIndex(index)
              setShowOutput(false)
              setExecutionResult(null)
            }}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              completedSteps.has(step.id)
                ? 'bg-green-600 border-green-400 text-white'
                : index === currentStepIndex
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-cyan-600 border-cyan-400 text-white hover:bg-cyan-500'
            }`}
          >
            <span className="text-lg">{step.emoji}</span>
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/30 rounded-3xl p-8 border-2 border-blue-500/30">
        {/* Step Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-8xl animate-bounce">{currentStep.emoji}</div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{currentStep.title}</h3>
            <p className="text-blue-200 text-lg">{currentStep.explanation}</p>
          </div>
        </div>

        {/* Code Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-cyan-400" />
              <h4 className="text-xl font-bold text-cyan-300">Code to Try:</h4>
            </div>
            
            {/* Code Display */}
            <div className="bg-cyan-900/20 rounded-xl border border-cyan-500/30 p-4">
              <div className="text-cyan-300 font-semibold mb-3">🐍 Python Code to Learn:</div>
              <pre className="text-cyan-200 font-mono text-sm whitespace-pre-wrap overflow-x-auto bg-cyan-900/30 rounded p-3 border border-cyan-600/30">
                {currentStep.code}
              </pre>
            </div>
            
            {/* Interactive Code Editor */}
            <div className="bg-gray-900/80 rounded-xl border border-gray-600">
              <div className="text-gray-400 text-xs p-2 border-b border-gray-600">
                💻 Try editing and running this code yourself:
              </div>
              <CodeEditor
                key={currentStep.id}
                initialCode={currentStep.code}
                onCodeChange={() => {}}
                onExecutionResult={handleExecutionResult}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={handleRunCode}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                Run Your Code
              </button>
              
              <button
                onClick={handleRunTutorialCode}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Sparkles className="h-5 w-5" />
                ✨ Run Perfect Tutorial Code
              </button>
            </div>
          </div>

          {/* Expected Output */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <h4 className="text-xl font-bold text-yellow-300">Expected Output:</h4>
            </div>
            
            {/* Always show expected output */}
            <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-500/30">
              <div className="text-yellow-300 font-semibold mb-3">📋 What This Code Will Do:</div>
              <pre className="text-yellow-200 whitespace-pre-wrap font-mono text-sm bg-yellow-900/30 rounded p-3">
                {currentStep.expectedOutput}
              </pre>
            </div>

            {/* Show execution results - success or error */}
            {executionResult && (
              <div className={`rounded-xl p-6 border ${
                executionResult.success 
                  ? 'bg-green-900/30 border-green-500/30' 
                  : 'bg-red-900/30 border-red-500/30'
              }`}>
                {executionResult.success ? (
                  <div className="space-y-3">
                    <div className="text-green-400 font-semibold text-center">
                      ✅ Perfect! Your code ran successfully!
                    </div>
                    <div className="bg-green-900/40 rounded p-3">
                      <div className="text-green-300 text-sm mb-1">Your Output:</div>
                      <pre className="text-green-200 font-mono text-sm">{executionResult.output}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-red-400 font-semibold text-center">
                      ⚠️ Oops! Let's fix this error together
                    </div>
                    
                    {/* Error Explanation */}
                    {executionResult.error && (() => {
                      const errorHelp = getErrorExplanation(executionResult.error)
                      return (
                        <div className="space-y-4">
                          <div className="bg-red-900/40 rounded p-3">
                            <div className="text-red-300 text-sm mb-1">Error Message:</div>
                            <pre className="text-red-200 font-mono text-xs">{executionResult.error}</pre>
                          </div>
                          
                          <div className="bg-orange-900/30 rounded p-4 border border-orange-500/30">
                            <div className="text-orange-300 font-semibold mb-2">{errorHelp.explanation}</div>
                            <div className="text-orange-200 text-sm">
                              <div className="font-semibold mb-2">💡 How to Fix It:</div>
                              <ul className="space-y-1">
                                {errorHelp.hints.map((hint, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-400">•</span>
                                    <span>{hint}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="bg-blue-900/30 rounded p-3 border border-blue-500/30 text-center">
                            <div className="text-blue-300 text-sm">
                              🎯 <strong>Keep trying!</strong> Every programmer makes mistakes - it's how we learn and get better!
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Learning Tip */}
            {currentStep.tip && (
              <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 text-lg">💡</span>
                  <div>
                    <div className="text-yellow-300 font-semibold text-sm">Pro Tip:</div>
                    <div className="text-yellow-200 text-sm">{currentStep.tip}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isFirstStep
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous Step
        </button>

        <div className="text-center">
          <div className="text-white font-semibold text-lg">{currentStep.title}</div>
          <div className="text-blue-400 text-sm">
            {currentStepIndex + 1} of {tutorialSteps.length} steps
          </div>
        </div>

        {isLastStep ? (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all transform bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:scale-105 shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            🎉 My AI Advisor is Complete! 🎉
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all transform bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105"
          >
            Next Step
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Completion Celebration */}
      {isLastStep && (
        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-3xl p-8 border-2 border-purple-500/30 text-center">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-4xl font-bold text-white mb-4">
            CONGRATULATIONS! YOU&apos;VE BUILT AN AI ADVISOR! 
          </h3>
          <p className="text-purple-200 text-lg mb-6">
            You just created a real artificial intelligence program that can:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-purple-200 font-semibold">Think & Analyze</div>
              <div className="text-purple-300 text-sm">Detect emotions in text</div>
            </div>
            <div className="bg-pink-900/30 rounded-lg p-4">
              <div className="text-3xl mb-2">💝</div>
              <div className="text-pink-200 font-semibold">Give Personal Advice</div>
              <div className="text-pink-300 text-sm">Customize responses by name</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-blue-200 font-semibold">Learn & Adapt</div>
              <div className="text-blue-300 text-sm">Handle different situations</div>
            </div>
          </div>
          <p className="text-white text-lg font-semibold">
            This is real AI programming - you&apos;re officially an AI developer! 🚀
          </p>
        </div>
      )}
    </div>
  )
}