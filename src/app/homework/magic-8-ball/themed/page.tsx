'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, RotateCcw, ArrowRight, CheckCircle } from 'lucide-react'

export default function ThemedMagic8Ball() {
  const [currentTheme, setCurrentTheme] = useState('study')
  const [userCode, setUserCode] = useState(`# 🎯 Themed Magic 8-Balls Creator
import random

# Study Buddy Ball responses
study_responses = [
    "📚 Definitely study for that test!",
    "⏰ Take a 10-minute break first",
    "💡 Try explaining it to someone else",
    "🎯 Focus on the main concepts",
    "📝 Make flashcards to review"
]

# Sports Oracle responses  
sports_responses = [
    "🏆 Your team has great potential!",
    "⚽ Practice makes perfect",
    "🏃‍♂️ Stay focused on fundamentals",
    "🥇 Victory requires preparation",
    "🏀 Teamwork is everything"
]

# Future Career Guide responses
career_responses = [
    "💼 Follow your passion and skills will develop",
    "🚀 Technology careers are limitless",
    "🧠 Keep learning new things every day",
    "🌟 Your unique perspective matters",
    "🎓 Education opens all doors"
]

def themed_magic_ball():
    print("🎯 Welcome to Themed Magic 8-Balls!")
    print("Choose your oracle:")
    print("1. 📚 Study Buddy Ball")
    print("2. ⚽ Sports Oracle") 
    print("3. 💼 Future Career Guide")
    
    choice = input("\\nWhich Magic 8-Ball? (1-3): ")
    
    if choice == "1":
        theme = "Study Buddy"
        responses = study_responses
        emoji = "📚"
    elif choice == "2":
        theme = "Sports Oracle"
        responses = sports_responses  
        emoji = "⚽"
    elif choice == "3":
        theme = "Career Guide"
        responses = career_responses
        emoji = "💼"
    else:
        print("🤨 Please choose 1, 2, or 3!")
        return
    
    print(f"\\n{emoji} You chose the {theme}!")
    question = input(f"Ask the {theme} a question: ")
    
    if question.strip():
        print(f"\\n{emoji} *Consulting the {theme}*")
        print("🔮 ...")
        answer = random.choice(responses)
        print(f"\\n{emoji} The {theme} says:")
        print(f"'{answer}'")
    else:
        print(f"🤨 The {theme} needs a question to answer!")

# 🚀 Try your themed Magic 8-Balls!
themed_magic_ball()`)
  const [output, setOutput] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const themes = [
    { id: 'study', name: 'Study Buddy Ball', emoji: '📚', color: 'blue' },
    { id: 'sports', name: 'Sports Oracle', emoji: '⚽', color: 'green' },
    { id: 'career', name: 'Career Guide', emoji: '💼', color: 'purple' }
  ]

  const runCode = () => {
    // Simulate code execution
    setOutput(`🎯 Welcome to Themed Magic 8-Balls!
Choose your oracle:
1. 📚 Study Buddy Ball
2. ⚽ Sports Oracle
3. 💼 Future Career Guide

Which Magic 8-Ball? (1-3): 1

📚 You chose the Study Buddy!
Ask the Study Buddy a question: Will I pass my math test?

📚 *Consulting the Study Buddy*
🔮 ...

📚 The Study Buddy says:
'📚 Definitely study for that test!'`)
  }

  const resetCode = () => {
    setOutput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-blue-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/homework/magic-8-ball"
                className="flex items-center text-blue-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assignment
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  🎯 Enhancement Option A: Themed Magic 8-Balls
                </h1>
                <p className="text-blue-300">Create 3 specialized Magic 8-Ball versions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-yellow-400 font-medium">⏱️ 25 minutes</div>
              {isComplete && (
                <Link
                  href="/homework/magic-8-ball?step=portfolio"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue to Portfolio
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-4">🎯 Your Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div key={theme.id} className={`bg-${theme.color}-800/20 rounded-lg p-4 border border-${theme.color}-500/30`}>
                <div className="text-2xl mb-2">{theme.emoji}</div>
                <h3 className="font-bold text-white">{theme.name}</h3>
                <p className="text-gray-300 text-sm">Custom responses for {theme.name.toLowerCase()}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-300 mt-4">
            💡 <strong>Goal:</strong> Modify the code to create 3 different themed Magic 8-Balls with unique responses for each theme.
          </p>
        </div>

        {/* Code Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-600">
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="font-bold text-white">Code Editor</h3>
              <div className="flex gap-2">
                <button
                  onClick={runCode}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors text-sm"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </button>
                <button
                  onClick={resetCode}
                  className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors text-sm"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              </div>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder="Write your themed Magic 8-Ball code here..."
            />
          </div>

          {/* Output & Progress */}
          <div className="space-y-6">
            {/* Output Terminal */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-600">
              <div className="p-4 border-b border-gray-600">
                <h3 className="font-bold text-white">Output</h3>
              </div>
              <div className="p-4 h-64 overflow-y-auto">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || "Click 'Run' to test your themed Magic 8-Balls!"}
                </pre>
              </div>
            </div>

            {/* Progress Checklist */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                Progress Checklist
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Created Study Buddy Ball responses</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Created Sports Oracle responses</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Created Career Guide responses</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Added theme selection menu</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" onChange={(e) => setIsComplete(e.target.checked)} className="rounded" />
                  <span className="text-sm">Tested all 3 themes successfully</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-900/20 rounded-xl p-6 border border-yellow-500/30">
          <h3 className="font-bold text-yellow-300 mb-3">💡 Coding Tips</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Each theme should have at least 5 unique responses</li>
            <li>• Use descriptive variable names like `study_responses` instead of `responses1`</li>
            <li>• Add emojis to make each theme visually distinct</li>
            <li>• Test each theme to make sure it works properly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}