'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, Brain, Lightbulb } from 'lucide-react'

interface TutorialSection {
  id: string
  title: string
  explanation: string
  codeExample: string
  whyItMatters: string
  realWorldExample: string
  emoji: string
  keyPoints: string[]
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface PythonTutorialViewerProps {
  onComplete?: () => void
}

export default function PythonTutorialViewer({ onComplete }: PythonTutorialViewerProps) {
  const [currentSectionIndex, setSectionIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const tutorialSections: TutorialSection[] = [
    {
      id: 'welcome',
      title: 'Welcome to Python Programming',
      explanation: "Python is like having a conversation with your computer. You give it instructions using simple English-like commands, and it responds by doing exactly what you ask. Think of it as teaching a very smart robot that follows directions perfectly!",
      codeExample: 'print("Hello, future AI creator!")\nprint("Welcome to your Python journey!")',
      whyItMatters: "Learning to 'talk' to computers is the foundation of creating AI advisors. Every AI system starts with basic communication between humans and computers.",
      realWorldExample: "Just like texting a friend, when you write print('Hello!'), Python 'texts' that message to your screen. Apps like Instagram, TikTok, and Snapchat all started with simple print statements!",
      emoji: '👋',
      keyPoints: [
        "Python uses everyday English words like 'print'",
        "Code runs from top to bottom, line by line",
        "Python is case-sensitive (Print ≠ print)",
        "Every instruction ends with parentheses ()"
      ]
    },
    {
      id: 'variables',
      title: 'Storing Information with Variables',
      explanation: "Variables are like labeled containers where we store information. Think of them as your phone contacts - each name (variable) points to specific information (like a phone number). In Python, we can store text, numbers, or any kind of data!",
      codeExample: 'student_name = "Alex"\nfavorite_subject = "Science"\ngrade_level = 9\n\nprint(f"Hi {student_name}!")\nprint(f"You love {favorite_subject} and you\'re in grade {grade_level}")',
      whyItMatters: "AI advisors need to remember information about users - their names, preferences, and situations. Variables are how we teach computers to have memory and provide personalized responses.",
      realWorldExample: "Netflix remembers your name and favorite shows using variables. When you log in, it says 'Welcome back, [your name]!' and shows 'Because you watched [show name]' - that's variables in action!",
      emoji: '📦',
      keyPoints: [
        "Variables store information for later use",
        "Use descriptive names like 'student_name' not 'x'",
        "Text goes in quotes: 'Hello' or \"Hello\"",
        "Numbers don't need quotes: age = 15",
        "f-strings let you insert variables: f\"Hi {name}!\""
      ]
    },
    {
      id: 'user-input',
      title: 'Getting Information from Users',
      explanation: "The input() function is like asking someone a question and waiting patiently for their answer. This is how we make programs interactive - they can respond to what real people tell them, just like a human conversation!",
      codeExample: 'user_name = input("What\'s your name? ")\nuser_mood = input("How are you feeling today? ")\n\nprint(f"Nice to meet you, {user_name}!")\nprint(f"I hope your {user_mood} day gets even better!")',
      whyItMatters: "AI advisors need to listen before they can help. input() is how we teach computers to ask questions and wait for human responses - the foundation of AI conversation.",
      realWorldExample: "When Siri asks 'What can I help you with?' or when a chatbot asks for your name, they're using input() functions to collect information before providing personalized help.",
      emoji: '💬',
      keyPoints: [
        "input() pauses and waits for user response",
        "Always include a clear question prompt",
        "input() always returns text (even if user types numbers)",
        "Store the response in a variable for later use",
        "Great for personalizing AI interactions"
      ]
    },
    {
      id: 'conditionals',
      title: 'Making Smart Decisions with If Statements',
      explanation: "Computers can make decisions! If statements are like asking 'Is this true?' and then doing different things based on the answer. This is the core of artificial intelligence - making smart choices based on information.",
      codeExample: 'mood = "stressed"  # This could come from user input\n\nif mood == "happy":\n    print("That\'s wonderful! Keep spreading good vibes! 😊")\nelif mood == "sad":\n    print("I\'m sorry you\'re feeling down. This will pass. 🤗")\nelif mood == "stressed":\n    print("Take a deep breath. You\'ve got this! 🧘")\nelse:\n    print("Whatever you\'re feeling is valid. I\'m here! 💙")',
      whyItMatters: "This is how AI advisors give different advice for different situations. Without if statements, computers can only give the same response every time - not very helpful for real problems!",
      realWorldExample: "When Netflix suggests different movies based on your mood, or when your phone suggests 'Do Not Disturb' when it detects you're studying - that's if statements analyzing your situation and responding appropriately.",
      emoji: '🤔',
      keyPoints: [
        "if checks if something is true",
        "elif means 'else if' - checks another condition",
        "else catches everything not covered above",
        "Use == to compare (not = which assigns)",
        "Indent code inside if blocks with 4 spaces",
        "This creates AI 'thinking' and decision-making"
      ]
    },
    {
      id: 'lists-advice',
      title: 'Creating Collections of Information',
      explanation: "Lists are like having a backpack full of different items. Instead of carrying one thing, you can carry many related things together. For AI advisors, lists let us store many pieces of advice and pick the right one for each situation.",
      codeExample: 'study_tips = [\n    "Take breaks every 25 minutes",\n    "Find a quiet study space",\n    "Use flashcards for memorization",\n    "Teach someone else what you learned",\n    "Get enough sleep before tests"\n]\n\nprint("Here are some study tips:")\nfor tip in study_tips:\n    print(f"• {tip}")',
      whyItMatters: "Real AI advisors need hundreds of different responses. Lists let us organize advice by category (stress relief, study tips, motivation) so our AI can pick the perfect response for each student's needs.",
      realWorldExample: "Spotify has lists of songs for different moods (sad songs, workout music, study playlists). When you're stressed, it picks from the 'calm music' list. That's exactly how our AI advisor will work!",
      emoji: '📝',
      keyPoints: [
        "Lists use square brackets: [item1, item2, item3]",
        "Separate items with commas",
        "Lists can hold text, numbers, or mixed data",
        "for loops let you go through each item",
        "Lists make AI responses varied and interesting",
        "Organize advice by category for smarter AI"
      ]
    },
    {
      id: 'random-selection',
      title: 'Adding Variety and Surprise',
      explanation: "The random module is like rolling dice or drawing names from a hat. It helps our AI give different responses each time, making conversations feel natural and surprising rather than robotic and predictable.",
      codeExample: 'import random\n\nencouragement = [\n    "You\'re doing amazing! Keep going! 🌟",\n    "Every expert was once a beginner! 💪",\n    "Mistakes are proof you\'re trying! 🎯",\n    "You\'re braver than you believe! 🦁",\n    "Progress, not perfection! ✨"\n]\n\nrandom_message = random.choice(encouragement)\nprint("Your daily motivation:")\nprint(random_message)',
      whyItMatters: "Without randomness, AI would be boring and predictable. Adding variety makes our advisor feel more human-like and engaging. Students will want to keep talking to an AI that surprises them!",
      realWorldExample: "When you open Instagram, you see different posts each time. When you ask Alexa for a joke, you get different jokes. That's random.choice() making technology feel fresh and personal!",
      emoji: '🎲',
      keyPoints: [
        "import random gives us randomization tools",
        "random.choice() picks one item from a list",
        "Makes AI responses feel natural and human-like",
        "Prevents boring, repetitive conversations",
        "Essential for engaging AI personality",
        "Users love surprises and variety"
      ]
    },
    {
      id: 'complete-advisor',
      title: 'Your Complete AI Advisor System',
      explanation: "Now we combine everything into one incredible AI advisor! This system can analyze what students say, understand their emotions, and provide personalized help. You've built real artificial intelligence that can make a difference in people's lives!",
      codeExample: 'import random\n\n# AI Advisor Knowledge Base\nstress_help = ["Take 5 deep breaths", "Go for a walk", "Talk to someone"]\nstudy_help = ["Break tasks into steps", "Create a schedule", "Find quiet space"]\npositive_words = ["You\'re amazing! 🌟", "You\'ve got this! 💪", "Keep going! ✨"]\n\n# AI Brain - Analyzes user messages\ndef understand_student(message):\n    message = message.lower()\n    if "stressed" in message or "anxiety" in message:\n        return "stress"\n    elif "study" in message or "homework" in message:\n        return "study"\n    else:\n        return "positive"\n\n# AI Response - Gives personalized advice\ndef give_advice(situation, student_name):\n    if situation == "stress":\n        advice = random.choice(stress_help)\n        return f"Hey {student_name}, try this: {advice} 🌱"\n    elif situation == "study":\n        advice = random.choice(study_help) \n        return f"{student_name}, here\'s a study tip: {advice} 📚"\n    else:\n        encouragement = random.choice(positive_words)\n        return f"{student_name}, remember: {encouragement}"\n\n# Demo your AI advisor!\nprint("🎉 YOUR AI ADVISOR IS COMPLETE! 🎉")\nprint("\\n=== Testing Your Creation ===")\n\n# Test with different scenarios\ntest_cases = [\n    ("I\'m stressed about my math test", "Maya"),\n    ("I need help studying for science", "Jordan"),\n    ("I\'m feeling down today", "Alex")\n]\n\nfor message, name in test_cases:\n    situation = understand_student(message)\n    response = give_advice(situation, name)\n    print(f"\\nStudent: {message}")\n    print(f"AI Advisor: {response}")\n\nprint("\\n🚀 Congratulations! You\'ve built real AI!")',
      whyItMatters: "This is actual artificial intelligence programming! Your advisor can analyze emotions, understand context, and provide personalized responses. You've created technology that can genuinely help students succeed and feel better about school.",
      realWorldExample: "Your AI works just like ChatGPT, Siri, or Google Assistant! They all use these same concepts: understanding user input, making decisions, and giving helpful responses. You're now an AI developer!",
      emoji: '🎉',
      keyPoints: [
        "Real AI combines: input analysis + decision making + personalized responses",
        "Your advisor understands emotions and provides appropriate help",
        "This is the same technology used in professional AI systems",
        "You've built something that can actually help real students",
        "Programming + psychology = powerful AI for good",
        "You're officially an AI developer! 🚀"
      ]
    }
  ]

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What does the print() function do in Python?',
      options: [
        'Prints documents on paper',
        'Displays text on the screen',
        'Saves files to computer',
        'Deletes information'
      ],
      correctAnswer: 1,
      explanation: 'print() displays text on the screen - like sending a message that appears for users to see.'
    },
    {
      id: 'q2', 
      question: 'Which of these is the best variable name for storing a student\'s age?',
      options: [
        'x',
        'number', 
        'student_age',
        'data'
      ],
      correctAnswer: 2,
      explanation: 'student_age is descriptive and clear - anyone reading your code immediately knows what information it stores.'
    },
    {
      id: 'q3',
      question: 'What does input() do?',
      options: [
        'Displays text on screen',
        'Asks user a question and waits for their answer',
        'Creates random numbers', 
        'Stores information permanently'
      ],
      correctAnswer: 1,
      explanation: 'input() asks the user a question and pauses the program until they type an answer - essential for interactive AI.'
    },
    {
      id: 'q4',
      question: 'What does this code do? if mood == "happy":',
      options: [
        'Sets mood to happy',
        'Checks if mood equals happy and runs code if true',
        'Prints the word happy',
        'Creates a variable called mood'
      ],
      correctAnswer: 1,
      explanation: 'The == compares two values. If they match, the code inside the if block runs - this is how AI makes decisions.'
    },
    {
      id: 'q5',
      question: 'Why are lists important for AI advisors?',
      options: [
        'They make code look professional',
        'They store many advice options so AI can pick appropriate responses', 
        'They run code faster',
        'They prevent errors'
      ],
      correctAnswer: 1,
      explanation: 'Lists let AI store hundreds of responses and pick the perfect one for each situation - making AI helpful and varied.'
    },
    {
      id: 'q6',
      question: 'What does random.choice() do?',
      options: [
        'Deletes random items',
        'Creates random text',
        'Picks one random item from a list',
        'Sorts lists alphabetically'
      ],
      correctAnswer: 2,
      explanation: 'random.choice() picks one random item from a list - making AI responses surprising and engaging for users.'
    },
    {
      id: 'q7',
      question: 'What makes an AI advisor "intelligent"?',
      options: [
        'Using big words',
        'Analyzing user input, making decisions, and giving personalized responses',
        'Running very fast',
        'Having colorful displays'
      ],
      correctAnswer: 1,
      explanation: 'True AI intelligence comes from understanding what users need and responding appropriately - just like human counselors do.'
    },
    {
      id: 'q8',
      question: 'Which Python concept helps AI understand user emotions?',
      options: [
        'print() statements',
        'Variables for storing data',
        'if statements for checking keywords like "stressed" or "happy"',
        'Lists for organization'
      ],
      correctAnswer: 2,
      explanation: 'if statements analyze user messages for emotional keywords, allowing AI to detect feelings and respond with appropriate help.'
    },
    {
      id: 'q9',
      question: 'Why do we use f-strings like f"Hello {name}!" in AI advisors?',
      options: [
        'They make code run faster',
        'They prevent errors',
        'They create personalized responses by inserting user-specific information',
        'They make text appear in different colors'
      ],
      correctAnswer: 2,
      explanation: 'f-strings personalize responses by inserting user names and specific information - making AI feel caring and attentive.'
    },
    {
      id: 'q10',
      question: 'What combination of Python concepts creates effective AI advisors?',
      options: [
        'Only print statements',
        'Variables + input + if statements + lists + random selection working together',
        'Just random numbers',
        'Only user input'
      ],
      correctAnswer: 1,
      explanation: 'Powerful AI combines all these concepts: collecting user info (input), remembering it (variables), making decisions (if statements), and providing varied responses (lists + random).'
    }
  ]

  const currentSection = tutorialSections[currentSectionIndex]
  const isLastSection = currentSectionIndex === tutorialSections.length - 1
  const isFirstSection = currentSectionIndex === 0

  const handleNext = () => {
    if (!isLastSection) {
      // Mark current section as completed
      const newCompleted = new Set([...completedSections, currentSection.id])
      setCompletedSections(newCompleted)
      setSectionIndex(currentSectionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstSection) {
      setSectionIndex(currentSectionIndex - 1)
    }
  }

  const goToSection = (index: number) => {
    setSectionIndex(index)
  }

  const handleStartQuiz = () => {
    // Mark final section as completed
    const newCompleted = new Set([...completedSections, currentSection.id])
    setCompletedSections(newCompleted)
    setShowQuiz(true)
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleQuizSubmit = () => {
    let correct = 0
    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    const score = Math.round((correct / quizQuestions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
  }

  const handleQuizComplete = () => {
    onComplete?.()
  }

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-3xl p-6 border-2 border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="text-6xl">🧠</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">Python Knowledge Quiz</h2>
              <p className="text-purple-200 text-lg">Test your AI programming knowledge!</p>
            </div>
          </div>
        </div>

        {!quizSubmitted ? (
          <div className="space-y-6">
            {/* Quiz Questions */}
            {quizQuestions.map((question, qIndex) => (
              <div key={question.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600">
                <h3 className="text-purple-300 font-bold text-lg mb-4">
                  Question {qIndex + 1}: {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => handleQuizAnswer(question.id, oIndex)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        quizAnswers[question.id] === oIndex
                          ? 'bg-purple-600/30 border-purple-400 text-white'
                          : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-purple-600/10 hover:border-purple-500'
                      }`}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + oIndex)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  Object.keys(quizAnswers).length === quizQuestions.length
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                📊 Submit Quiz & See Results
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Results */}
            <div className={`rounded-3xl p-8 border-2 text-center ${
              quizScore >= 80 
                ? 'bg-gradient-to-r from-green-800/30 to-emerald-800/30 border-green-500/30'
                : quizScore >= 60
                ? 'bg-gradient-to-r from-yellow-800/30 to-orange-800/30 border-yellow-500/30'
                : 'bg-gradient-to-r from-red-800/30 to-pink-800/30 border-red-500/30'
            }`}>
              <div className="text-8xl mb-4">
                {quizScore >= 80 ? '🎉' : quizScore >= 60 ? '👍' : '💪'}
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Quiz Complete!
              </h3>
              <div className="text-6xl font-bold text-white mb-4">
                {quizScore}%
              </div>
              <p className="text-lg mb-6">
                {quizScore >= 80 
                  ? 'Outstanding! You truly understand AI programming concepts!'
                  : quizScore >= 60
                  ? 'Good job! You have a solid foundation in AI concepts!'
                  : 'Keep learning! AI programming takes practice - you\'re on the right track!'
                }
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              {quizQuestions.map((question, index) => {
                const userAnswer = quizAnswers[question.id]
                const isCorrect = userAnswer === question.correctAnswer
                return (
                  <div key={question.id} className={`rounded-xl p-4 border ${
                    isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? '✅' : '❌'}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-2">
                          Question {index + 1}: {question.question}
                        </div>
                        <div className="text-sm space-y-1">
                          <div className={isCorrect ? 'text-green-200' : 'text-red-200'}>
                            Your answer: {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-200">
                              Correct answer: {question.options[question.correctAnswer]}
                            </div>
                          )}
                          <div className="text-gray-300 text-xs mt-2">
                            💡 {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Completion Button */}
            <div className="text-center">
              <button
                onClick={handleQuizComplete}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎓 Complete Python Laboratory & Return to Adventure Map
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-3xl p-6 border-2 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-pulse">🐍</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">Python Programming Tutorial</h2>
              <p className="text-blue-200 text-lg">Learn AI Programming Step by Step</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 font-bold text-xl">
              Section {currentSectionIndex + 1} of {tutorialSections.length}
            </div>
            <div className="text-cyan-300 text-sm">
              {Math.round((completedSections.size / tutorialSections.length) * 100)}% Complete
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 bg-blue-900/50 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full h-3 transition-all duration-500"
            style={{ width: `${(completedSections.size / tutorialSections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Navigation Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {tutorialSections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => goToSection(index)}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              completedSections.has(section.id)
                ? 'bg-green-600 border-green-400 text-white'
                : index === currentSectionIndex
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-cyan-600 border-cyan-400 text-white hover:bg-cyan-500'
            }`}
          >
            <span className="text-lg">{section.emoji}</span>
          </button>
        ))}
        {/* Quiz Dot */}
        <button
          onClick={() => setShowQuiz(true)}
          disabled={completedSections.size < tutorialSections.length}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
            quizSubmitted
              ? 'bg-purple-600 border-purple-400 text-white'
              : completedSections.size >= tutorialSections.length
              ? 'bg-pink-600 border-pink-400 text-white hover:bg-pink-500'
              : 'bg-gray-700 border-gray-500 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="text-lg">🧠</span>
        </button>
      </div>

      {/* Current Section Content */}
      <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/30 rounded-3xl p-8 border-2 border-blue-500/30">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-8xl animate-bounce">{currentSection.emoji}</div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{currentSection.title}</h3>
            <p className="text-blue-200 text-lg">{currentSection.explanation}</p>
          </div>
        </div>

        {/* Learning Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Code Example */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <h4 className="text-xl font-bold text-cyan-300">Code Example:</h4>
            </div>
            
            <div className="bg-cyan-900/20 rounded-xl border border-cyan-500/30 p-4">
              <pre className="text-cyan-200 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                {currentSection.codeExample}
              </pre>
            </div>

            {/* Why It Matters */}
            <div className="bg-emerald-900/20 rounded-xl border border-emerald-500/30 p-4">
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-emerald-400 mt-1" />
                <div>
                  <div className="text-emerald-300 font-semibold mb-2">Why This Matters for AI:</div>
                  <div className="text-emerald-200 text-sm">{currentSection.whyItMatters}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real World Example & Key Points */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <h4 className="text-xl font-bold text-yellow-300">Real-World Connection:</h4>
            </div>

            <div className="bg-yellow-900/20 rounded-xl border border-yellow-500/30 p-4">
              <div className="text-yellow-200 text-sm">{currentSection.realWorldExample}</div>
            </div>

            {/* Key Points */}
            <div className="bg-purple-900/20 rounded-xl border border-purple-500/30 p-4">
              <div className="text-purple-300 font-semibold mb-3">🎯 Key Programming Concepts:</div>
              <ul className="space-y-2">
                {currentSection.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-purple-200 text-sm">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={isFirstSection}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isFirstSection
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <div className="text-center">
          <div className="text-white font-semibold text-lg">{currentSection.title}</div>
          <div className="text-blue-400 text-sm">
            {currentSectionIndex + 1} of {tutorialSections.length} sections
          </div>
        </div>

        {isLastSection ? (
          <button
            onClick={handleStartQuiz}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all transform hover:scale-105 shadow-lg"
          >
            <Brain className="h-5 w-5" />
            🧠 Take Knowledge Quiz!
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all transform hover:scale-105"
          >
            Next Section
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Completion Message */}
      {completedSections.size === tutorialSections.length && !showQuiz && (
        <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-2xl p-6 border border-green-500/30 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-2xl font-bold text-green-300 mb-2">Tutorial Complete!</h3>
          <p className="text-green-200 text-lg mb-4">
            You've learned all the essential AI programming concepts. Ready for the quiz?
          </p>
        </div>
      )}
    </div>
  )
}