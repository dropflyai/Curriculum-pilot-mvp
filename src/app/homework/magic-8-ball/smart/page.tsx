'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, RotateCcw, ArrowRight, CheckCircle, Brain } from 'lucide-react'

export default function SmartMagic8Ball() {
  const [userCode, setUserCode] = useState(`# 🧠 Smart Question Analysis Magic 8-Ball
import random

def analyze_question_type(question):
    """Detect the type of question being asked"""
    question = question.lower().strip()
    
    if question.startswith(('will i', 'will you', 'will')):
        return 'future'
    elif question.startswith(('should i', 'should')):
        return 'advice'
    elif question.startswith(('am i', 'are you', 'is')):
        return 'present'
    elif question.startswith(('can i', 'can you', 'can')):
        return 'ability'
    else:
        return 'general'

def get_smart_response(question_type):
    """Return responses based on question type"""
    responses = {
        'future': [
            ("🔮 Very likely", "high"),
            ("✨ The signs point to yes", "medium"),
            ("⏰ Ask again later", "low"),
            ("🌟 It is certain", "high"),
            ("❓ Reply hazy, try again", "low")
        ],
        'advice': [
            ("💡 You should definitely consider it", "high"),
            ("🤔 Think it through carefully", "medium"),
            ("⚠️ Proceed with caution", "low"),
            ("✅ Go for it!", "high"),
            ("📚 Gather more information first", "medium")
        ],
        'present': [
            ("🎯 Absolutely", "high"),
            ("🤷‍♂️ It's unclear right now", "low"),
            ("✨ Yes, you are", "high"),
            ("📊 The evidence suggests yes", "medium"),
            ("🔍 Look deeper within yourself", "low")
        ],
        'ability': [
            ("💪 You have the power", "high"),
            ("🚀 With effort, yes", "medium"),
            ("⏳ Not at this time", "low"),
            ("🌟 Your potential is unlimited", "high"),
            ("📈 Practice makes possible", "medium")
        ],
        'general': [
            ("🎲 The answer is yes", "medium"),
            ("🌈 All signs point to positive", "high"),
            ("❓ Ask a more specific question", "low"),
            ("🔄 Try rephrasing your question", "low"),
            ("✨ The universe will guide you", "medium")
        ]
    }
    
    response, confidence = random.choice(responses[question_type])
    return response, confidence

def smart_magic_8_ball():
    print("🧠 Welcome to the Smart Magic 8-Ball!")
    print("I analyze your questions and give thoughtful responses!")
    
    questions_asked = []
    
    while True:
        question = input("\\n🤔 Ask me anything (or 'quit' to exit): ")
        
        if question.lower() == 'quit':
            break
            
        if question.strip():
            # Analyze question
            q_type = analyze_question_type(question)
            response, confidence = get_smart_response(q_type)
            
            # Store question data
            questions_asked.append({
                'question': question,
                'type': q_type,
                'confidence': confidence
            })
            
            # Display response
            print(f"\\n🔍 Question type detected: {q_type.title()}")
            print(f"🎱 *Analyzing with {confidence} confidence*")
            print(f"\\n🧠 Smart Magic 8-Ball says:")
            print(f"'{response}'")
            print(f"📊 Confidence Level: {confidence.title()}")
        else:
            print("🤨 I need a question to analyze!")
    
    # Show patterns
    if questions_asked:
        print("\\n📊 Your Question Patterns:")
        types_count = {}
        for q in questions_asked:
            types_count[q['type']] = types_count.get(q['type'], 0) + 1
        
        for q_type, count in types_count.items():
            print(f"  {q_type.title()}: {count} questions")

# 🚀 Try the Smart Magic 8-Ball!
smart_magic_8_ball()`)
  const [output, setOutput] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const runCode = () => {
    setOutput(`🧠 Welcome to the Smart Magic 8-Ball!
I analyze your questions and give thoughtful responses!

🤔 Ask me anything (or 'quit' to exit): Will I pass my coding class?

🔍 Question type detected: Future
🎱 *Analyzing with high confidence*

🧠 Smart Magic 8-Ball says:
'🌟 It is certain'
📊 Confidence Level: High`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/homework/magic-8-ball"
                className="flex items-center text-purple-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assignment
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  🧠 Enhancement Option B: Smart Question Analysis
                </h1>
                <p className="text-purple-300">Make responses adapt to question types</p>
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
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <h2 className="text-xl font-bold text-white mb-4">🧠 Your Mission</h2>
          <p className="text-gray-300 mb-4">
            Create an intelligent Magic 8-Ball that analyzes question types and provides contextually appropriate responses with confidence levels.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-800/30 rounded p-3 text-center">
              <div className="text-lg mb-1">🔮</div>
              <div className="text-blue-300 text-sm font-medium">Future Questions</div>
              <div className="text-gray-400 text-xs">"Will I...?"</div>
            </div>
            <div className="bg-green-800/30 rounded p-3 text-center">
              <div className="text-lg mb-1">💡</div>
              <div className="text-green-300 text-sm font-medium">Advice Questions</div>
              <div className="text-gray-400 text-xs">"Should I...?"</div>
            </div>
            <div className="bg-yellow-800/30 rounded p-3 text-center">
              <div className="text-lg mb-1">🎯</div>
              <div className="text-yellow-300 text-sm font-medium">Present Questions</div>
              <div className="text-gray-400 text-xs">"Am I...?"</div>
            </div>
            <div className="bg-pink-800/30 rounded p-3 text-center">
              <div className="text-lg mb-1">💪</div>
              <div className="text-pink-300 text-sm font-medium">Ability Questions</div>
              <div className="text-gray-400 text-xs">"Can I...?"</div>
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
              placeholder="Enhance the smart question analysis..."
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
                  {output || "Click 'Run' to test your smart Magic 8-Ball!"}
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
                  <span className="text-sm">Question type detection working</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Different responses for each type</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Confidence levels displayed</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Pattern tracking shows statistics</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" onChange={(e) => setIsComplete(e.target.checked)} className="rounded" />
                  <span className="text-sm">Tested with multiple question types</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}