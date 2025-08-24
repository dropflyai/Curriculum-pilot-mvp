'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, RotateCcw, ArrowRight, CheckCircle, Database } from 'lucide-react'

export default function PersistenceMagic8Ball() {
  const [userCode, setUserCode] = useState(`# 💾 Data Persistence Magic 8-Ball
import random
import json
from datetime import datetime

def save_question_history(question, answer):
    """Save question and answer to history file"""
    try:
        # Try to load existing history
        with open('magic_8_ball_history.txt', 'r') as file:
            history = json.loads(file.read())
    except (FileNotFoundError, json.JSONDecodeError):
        history = []
    
    # Add new entry
    entry = {
        'question': question,
        'answer': answer,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    history.append(entry)
    
    # Save updated history
    with open('magic_8_ball_history.txt', 'w') as file:
        file.write(json.dumps(history, indent=2))
    
    return len(history)

def load_custom_responses():
    """Load custom responses from file"""
    try:
        with open('custom_responses.txt', 'r') as file:
            custom = [line.strip() for line in file.readlines() if line.strip()]
            return custom if custom else get_default_responses()
    except FileNotFoundError:
        return get_default_responses()

def get_default_responses():
    """Default Magic 8-Ball responses"""
    return [
        "🎯 It is certain",
        "✨ Without a doubt", 
        "🌟 Yes definitely",
        "💫 You may rely on it",
        "🔮 As I see it, yes",
        "❓ Reply hazy, try again",
        "⏰ Ask again later",
        "❌ Don't count on it",
        "🚫 My reply is no",
        "⚠️ Very doubtful"
    ]

def show_history():
    """Display question history"""
    try:
        with open('magic_8_ball_history.txt', 'r') as file:
            history = json.loads(file.read())
            
        if history:
            print("\\n📊 Your Magic 8-Ball History:")
            for i, entry in enumerate(history[-5:], 1):  # Show last 5
                print(f"  {i}. {entry['timestamp']}")
                print(f"     Q: {entry['question']}")
                print(f"     A: {entry['answer']}")
                print()
        else:
            print("\\n📝 No history yet. Ask some questions!")
            
    except (FileNotFoundError, json.JSONDecodeError):
        print("\\n📝 No history file found. Start asking questions!")

def persistent_magic_8_ball():
    print("💾 Welcome to the Persistent Magic 8-Ball!")
    print("Your questions and answers are saved for future reference!")
    
    responses = load_custom_responses()
    print(f"\\n📚 Loaded {len(responses)} responses")
    
    while True:
        print("\\n" + "="*50)
        print("1. 🎱 Ask a question")
        print("2. 📊 View history")
        print("3. 🚪 Quit")
        
        choice = input("\\nWhat would you like to do? (1-3): ")
        
        if choice == "1":
            question = input("\\n🤔 Ask your question: ")
            if question.strip():
                answer = random.choice(responses)
                count = save_question_history(question, answer)
                
                print("\\n🎱 *Shaking the Magic 8-Ball*")
                print("🔮 ...")
                print(f"\\n💾 The Persistent Magic 8-Ball says:")
                print(f"'{answer}'")
                print(f"\\n📝 Saved to history (#{count})")
            else:
                print("🤨 I need a question to answer!")
                
        elif choice == "2":
            show_history()
            
        elif choice == "3":
            print("\\n💾 Thanks for using the Persistent Magic 8-Ball!")
            print("📊 Your history has been saved for next time!")
            break
        else:
            print("🤨 Please choose 1, 2, or 3!")

# 🚀 Try the Persistent Magic 8-Ball!
persistent_magic_8_ball()`)
  const [output, setOutput] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const runCode = () => {
    setOutput(`💾 Welcome to the Persistent Magic 8-Ball!
Your questions and answers are saved for future reference!

📚 Loaded 10 responses

==================================================
1. 🎱 Ask a question
2. 📊 View history  
3. 🚪 Quit

What would you like to do? (1-3): 1

🤔 Ask your question: Should I learn more about AI?

🎱 *Shaking the Magic 8-Ball*
🔮 ...

💾 The Persistent Magic 8-Ball says:
'🌟 Yes definitely'

📝 Saved to history (#1)`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-green-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/homework/magic-8-ball"
                className="flex items-center text-green-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assignment
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  💾 Enhancement Option C: Data Persistence System
                </h1>
                <p className="text-green-300">Save questions/answers and create history features</p>
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
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 mb-8 border border-green-500/30">
          <h2 className="text-xl font-bold text-white mb-4">💾 Your Mission</h2>
          <p className="text-gray-300 mb-4">
            Add data persistence to your Magic 8-Ball so it can remember questions, save answers, and load custom responses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-800/20 rounded-lg p-4">
              <Database className="h-6 w-6 text-blue-400 mb-2" />
              <h3 className="font-bold text-blue-300">Save History</h3>
              <p className="text-gray-300 text-sm">Store all questions and answers in a file</p>
            </div>
            <div className="bg-purple-800/20 rounded-lg p-4">
              <Database className="h-6 w-6 text-purple-400 mb-2" />
              <h3 className="font-bold text-purple-300">View History</h3>
              <p className="text-gray-300 text-sm">Display past questions and responses</p>
            </div>
            <div className="bg-green-800/20 rounded-lg p-4">
              <Database className="h-6 w-6 text-green-400 mb-2" />
              <h3 className="font-bold text-green-300">Custom Responses</h3>
              <p className="text-gray-300 text-sm">Load personalized response sets</p>
            </div>
          </div>
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
                  onClick={() => setOutput('')}
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
              placeholder="Add data persistence features..."
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
                  {output || "Click 'Run' to test your persistent Magic 8-Ball!"}
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
                  <span className="text-sm">History saving function works</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">History viewing displays past Q&A</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Custom response loading implemented</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Menu system for navigation</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" onChange={(e) => setIsComplete(e.target.checked)} className="rounded" />
                  <span className="text-sm">Tested file operations successfully</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}