'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, RotateCcw, ArrowRight, CheckCircle, Palette } from 'lucide-react'

export default function InteractiveMagic8Ball() {
  const [userCode, setUserCode] = useState(`# 🎨 Interactive Experience Magic 8-Ball
import random
import time

def typing_animation(text, delay=0.05):
    """Simulate typing effect"""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()  # New line at end

def magic_8_ball_ascii():
    """Display ASCII art Magic 8-Ball"""
    ball_art = '''
    🎱 MAGIC 8-BALL 🎱
    ╭─────────────────╮
    │    ╭───────╮    │
    │   ╱         ╲   │
    │  ╱     8     ╲  │
    │ ╱             ╲ │
    │╱               ╲│
    │╲               ╱│
    │ ╲             ╱ │
    │  ╲___________╱  │
    │                 │
    ╰─────────────────╯
    '''
    print(ball_art)

def shake_animation():
    """Simulate shaking animation"""
    shakes = ["🎱", "🌀", "💫", "✨", "🔮"]
    print("\\n🤚 *Shaking the Magic 8-Ball*")
    
    for i in range(3):
        for shake in shakes:
            print(f"\\r{shake} Shaking...", end='', flush=True)
            time.sleep(0.3)
    print("\\n")

def colorful_response(response):
    """Add colors and effects to responses"""
    colors = {
        'positive': '\\033[92m',  # Green
        'negative': '\\033[91m',  # Red  
        'neutral': '\\033[93m',   # Yellow
        'reset': '\\033[0m'       # Reset
    }
    
    positive_words = ['yes', 'certain', 'definitely', 'rely']
    negative_words = ['no', 'don\\'t', 'doubtful', 'unlikely']
    
    response_lower = response.lower()
    
    if any(word in response_lower for word in positive_words):
        color = colors['positive']
    elif any(word in response_lower for word in negative_words):
        color = colors['negative']
    else:
        color = colors['neutral']
    
    return f"{color}{response}{colors['reset']}"

def interactive_magic_8_ball():
    """Main interactive Magic 8-Ball with full experience"""
    
    responses = [
        "🎯 It is certain",
        "✨ Without a doubt", 
        "🌟 Yes definitely",
        "💫 You may rely on it",
        "🔮 As I see it, yes",
        "💭 Most likely",
        "🎲 Outlook good",
        "👍 Yes",
        "🤷‍♂️ Signs point to yes",
        "❓ Reply hazy, try again",
        "⏰ Ask again later",
        "🔍 Better not tell you now",
        "🤐 Cannot predict now",
        "🎭 Concentrate and ask again",
        "❌ Don't count on it",
        "🚫 My reply is no",
        "🙅‍♂️ My sources say no",
        "⚠️ Outlook not so good",
        "😬 Very doubtful"
    ]
    
    # Display beautiful ASCII art
    magic_8_ball_ascii()
    
    typing_animation("🌟 Welcome to the Interactive Magic 8-Ball Experience! 🌟")
    print("\\n💫 Ask me anything and watch the magic happen!")
    
    questions_count = 0
    
    while True:
        question = input("\\n🤔 What's your question? (or 'quit' to exit): ")
        
        if question.lower() == 'quit':
            typing_animation(f"\\n🎱 Thanks for asking {questions_count} questions!")
            typing_animation("✨ May your future be filled with magic! ✨")
            break
            
        if question.strip():
            questions_count += 1
            
            # Interactive experience
            shake_animation()
            
            # Get and display response with colors
            response = random.choice(responses)
            colored_response = colorful_response(response)
            
            typing_animation("🔮 The Magic 8-Ball reveals...")
            time.sleep(0.5)
            print(f"\\n🎱 {colored_response}")
            
            # Add some sparkle
            print("\\n" + "✨ " * 10)
            
        else:
            typing_animation("🤨 The Magic 8-Ball needs a question to answer!")

# 🚀 Experience the Interactive Magic 8-Ball!
interactive_magic_8_ball()`)
  const [output, setOutput] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const runCode = () => {
    setOutput(`    🎱 MAGIC 8-BALL 🎱
    ╭─────────────────╮
    │    ╭───────╮    │
    │   ╱         ╲   │
    │  ╱     8     ╲  │
    │ ╱             ╲ │
    │╱               ╲│
    │╲               ╱│
    │ ╲             ╱ │
    │  ╲___________╱  │
    │                 │
    ╰─────────────────╯

🌟 Welcome to the Interactive Magic 8-Ball Experience! 🌟

💫 Ask me anything and watch the magic happen!

🤔 What's your question? (or 'quit' to exit): Will I become a great programmer?

🤚 *Shaking the Magic 8-Ball*
🎱 Shaking...💫 Shaking...✨ Shaking...

🔮 The Magic 8-Ball reveals...

🎱 🌟 Yes definitely

✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-pink-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/homework/magic-8-ball"
                className="flex items-center text-pink-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assignment
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  🎨 Enhancement Option D: Interactive Experience
                </h1>
                <p className="text-pink-300">Add animations, effects, and themed interfaces</p>
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
        <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl p-6 mb-8 border border-pink-500/30">
          <h2 className="text-xl font-bold text-white mb-4">🎨 Your Mission</h2>
          <p className="text-gray-300 mb-4">
            Transform your Magic 8-Ball into a visually stunning interactive experience with animations and effects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/20 rounded-lg p-4">
              <Palette className="h-6 w-6 text-purple-400 mb-2" />
              <h3 className="font-bold text-purple-300">ASCII Art</h3>
              <p className="text-gray-300 text-sm">Beautiful visual Magic 8-Ball design</p>
            </div>
            <div className="bg-blue-800/20 rounded-lg p-4">
              <Palette className="h-6 w-6 text-blue-400 mb-2" />
              <h3 className="font-bold text-blue-300">Animations</h3>
              <p className="text-gray-300 text-sm">Typing effects and shake animations</p>
            </div>
            <div className="bg-pink-800/20 rounded-lg p-4">
              <Palette className="h-6 w-6 text-pink-400 mb-2" />
              <h3 className="font-bold text-pink-300">Colors & Effects</h3>
              <p className="text-gray-300 text-sm">Colorful responses and visual feedback</p>
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
              placeholder="Add interactive animations and effects..."
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
                  {output || "Click 'Run' to test your interactive Magic 8-Ball!"}
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
                  <span className="text-sm">ASCII art Magic 8-Ball displays</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Typing animation works</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Shake animation implemented</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Colorful response system</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" onChange={(e) => setIsComplete(e.target.checked)} className="rounded" />
                  <span className="text-sm">Full interactive experience tested</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}