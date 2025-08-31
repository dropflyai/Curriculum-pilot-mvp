'use client'

import { useState, useEffect } from 'react'
import { Eye, Brain, Zap, Camera, Play, ArrowRight, Lightbulb, Star, Trophy } from 'lucide-react'

interface AIFoundationExperienceProps {
  onComplete?: () => void
}

interface AIDemo {
  id: string
  title: string
  description: string
  example: string
  impact: string
  icon: any
}

export default function AIFoundationExperience({ onComplete }: AIFoundationExperienceProps) {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [demoResults, setDemoResults] = useState<any[]>([])
  const [studentResponse, setStudentResponse] = useState('')
  const [aiPredictions, setAiPredictions] = useState<any[]>([])

  // The "WOW" moments - immediate AI demonstrations
  const aiDemos: AIDemo[] = [
    {
      id: 'vision',
      title: 'AI Can SEE',
      description: 'Watch AI instantly recognize objects in photos',
      example: 'Upload any photo → AI tells you what\'s in it',
      impact: 'Powers: Self-driving cars, medical diagnosis, security systems',
      icon: Eye
    },
    {
      id: 'language', 
      title: 'AI Can UNDERSTAND',
      description: 'See AI comprehend and respond to human language',
      example: 'Type any question → AI gives you a helpful answer',
      impact: 'Powers: Chatbots, translation, writing assistants',
      icon: Brain
    },
    {
      id: 'learn',
      title: 'AI Can LEARN',
      description: 'Watch AI get better through practice and examples',
      example: 'Show AI examples → AI learns patterns → AI makes predictions',
      impact: 'Powers: Recommendations, fraud detection, drug discovery',
      icon: Zap
    }
  ]

  const foundationConcepts = [
    {
      question: "🤔 What makes something 'artificially intelligent'?",
      studentThinking: "Let students share their initial thoughts",
      revelation: "AI = Computer systems that can do tasks that normally require human intelligence",
      examples: ["Recognizing faces", "Understanding speech", "Making decisions", "Learning from experience"]
    },
    {
      question: "🧠 How is AI different from regular computer programs?", 
      studentThinking: "Compare to apps they use daily",
      revelation: "Regular programs follow exact rules. AI programs learn patterns from data.",
      examples: ["Calculator (rules) vs Netflix recommendations (learning)", "GPS directions (rules) vs Spotify suggestions (learning)"]
    },
    {
      question: "🎯 Why should 9th graders care about AI?",
      studentThinking: "What's in it for them?",
      revelation: "AI is reshaping every career field - you need to understand it to thrive in the future",
      examples: ["AI helps doctors diagnose diseases", "AI helps teachers personalize learning", "AI helps artists create new works", "AI helps scientists solve climate change"]
    }
  ]

  // Interactive AI simulation
  const simulateAIRecognition = async (item: string) => {
    setIsProcessing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const results = {
      'phone': { confidence: 94.2, category: 'electronics', features: ['rectangular shape', 'screen', 'camera'] },
      'pencil': { confidence: 89.7, category: 'school supply', features: ['cylindrical', 'wooden', 'pointed tip'] },
      'water bottle': { confidence: 91.3, category: 'container', features: ['transparent', 'cylindrical', 'cap'] },
      'backpack': { confidence: 87.8, category: 'bag', features: ['fabric', 'straps', 'zippers'] }
    }
    
    const result = results[item as keyof typeof results] || { 
      confidence: 76.4, 
      category: 'unknown object', 
      features: ['unique shape', 'distinct color', 'interesting texture'] 
    }
    
    setAiPredictions(prev => [...prev, { item, ...result, timestamp: new Date() }])
    setIsProcessing(false)
  }

  // Updated content - show the actual lesson content instead of old foundation
  const PhaseOne = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-2xl border border-blue-400/30">
        <h1 className="text-4xl font-bold text-white mb-4">🤖 AI Classifier - School Supplies</h1>
        <p className="text-blue-200 text-lg mb-6">
          Learn how to train your first AI image classifier using school supplies and discover how machine learning works!
        </p>
        
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">🧠 What Exactly IS Machine Learning?</h2>
            <p className="text-gray-200 mb-4">
              Imagine trying to teach your little cousin to recognize different dog breeds. You wouldn't sit down and write a list of rules like "if it's small and fluffy, it's a Pomeranian" or "if it's big with droopy ears, it's a Bloodhound." Instead, you'd show them hundreds of pictures of different dogs and tell them the breed each time.
            </p>
            <p className="text-gray-200 mb-4">
              <strong className="text-cyan-300">Machine Learning works exactly the same way!</strong> Instead of programming a computer with thousands of specific rules, we show it tons of examples and let it discover the patterns on its own.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-300 mb-4">🆚 AI vs. Machine Learning: What's the Real Difference?</h2>
            <p className="text-gray-200 mb-4">
              Think of <strong className="text-green-300">Artificial Intelligence (AI)</strong> like the concept of "being smart." It's any computer system that can do things we normally think require human intelligence - like recognizing faces, understanding speech, or making decisions.
            </p>
            <p className="text-gray-200">
              <strong className="text-green-300">Machine Learning (ML)</strong> is one specific way to create AI. It's like teaching intelligence through practice and examples, rather than programming every single rule by hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-400/30">
              <Eye className="w-8 h-8 text-purple-300 mb-2" />
              <h3 className="font-bold text-purple-300">AI Can SEE</h3>
              <p className="text-gray-300 text-sm">Recognize objects in photos, just like your eyes do</p>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
              <Brain className="w-8 h-8 text-blue-300 mb-2" />
              <h3 className="font-bold text-blue-300">AI Can THINK</h3>
              <p className="text-gray-300 text-sm">Process information and make smart decisions</p>
            </div>
            <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
              <Zap className="w-8 h-8 text-green-300 mb-2" />
              <h3 className="font-bold text-green-300">AI Can LEARN</h3>
              <p className="text-gray-300 text-sm">Get better through practice and examples</p>
            </div>
          </div>
        </div>
      </div>
      {/* Hook - The Magic Moment */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-8 border border-purple-500/30 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">🔮 Welcome to the Age of AI Magic!</h2>
        <p className="text-purple-200 text-lg mb-6">
          You're about to discover something incredible: how to teach computers to SEE, THINK, and LEARN just like humans do.
        </p>
        <div className="bg-purple-900/50 rounded-lg p-4 text-left">
          <p className="text-white mb-2">📱 <strong>Right now, AI is:</strong></p>
          <ul className="text-purple-200 space-y-1 text-sm">
            <li>• Helping doctors find diseases in X-rays</li>
            <li>• Enabling cars to drive themselves</li>
            <li>• Translating languages in real-time</li>
            <li>• Creating art, music, and writing</li>
            <li>• And you're about to learn how to build it yourself!</li>
          </ul>
        </div>
      </div>

      {/* Immediate AI Demonstrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiDemos.map((demo, index) => (
          <div key={demo.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <demo.icon className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">{demo.title}</h3>
            </div>
            <p className="text-gray-300 mb-3">{demo.description}</p>
            <div className="bg-blue-900/20 rounded p-3 mb-3">
              <p className="text-blue-200 text-sm font-medium">Example:</p>
              <p className="text-blue-100 text-sm">{demo.example}</p>
            </div>
            <p className="text-gray-400 text-xs">{demo.impact}</p>
            
            {index === 0 && (
              <button
                onClick={() => setCurrentPhase(1.5)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                Try This Demo!
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            if (onComplete) onComplete()
            setCurrentPhase(2)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
        >
          Start Building My AI Classifier! 🚀
        </button>
      </div>
    </div>
  )

  const InteractiveDemo = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="h-6 w-6" />
          🎮 Interactive AI Vision Demo
        </h3>
        <p className="text-green-200 mb-6">
          Let's see AI in action! Think of an object around you and watch our AI try to identify it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <label className="text-white font-medium mb-2 block">What object do you see around you?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={studentResponse}
                onChange={(e) => setStudentResponse(e.target.value)}
                placeholder="phone, pencil, water bottle, etc."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
              <button
                onClick={() => simulateAIRecognition(studentResponse)}
                disabled={isProcessing || !studentResponse}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                {isProcessing ? 'AI Thinking...' : 'Analyze!'}
              </button>
            </div>
            
            <div className="flex gap-2 mt-3">
              <span className="text-gray-400 text-sm">Quick try:</span>
              {['phone', 'pencil', 'water bottle', 'backpack'].map(item => (
                <button
                  key={item}
                  onClick={() => setStudentResponse(item)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h4 className="text-white font-medium mb-2">🤖 AI Analysis Results</h4>
            <div className="bg-gray-900 rounded p-4 h-48 overflow-y-auto">
              {aiPredictions.length === 0 ? (
                <p className="text-gray-500 italic text-center mt-8">AI results will appear here...</p>
              ) : (
                aiPredictions.map((prediction, index) => (
                  <div key={index} className="mb-4 p-3 bg-green-900/20 rounded border border-green-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{prediction.item}</span>
                      <span className="text-green-400 font-bold">{prediction.confidence}% confident</span>
                    </div>
                    <p className="text-gray-300 text-sm">Category: <span className="text-green-300">{prediction.category}</span></p>
                    <p className="text-gray-300 text-sm">Features detected: {prediction.features.join(', ')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/20 rounded-lg p-6 border border-yellow-500/30">
        <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          💡 What Just Happened?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-white font-medium mb-2">The AI Process:</h5>
            <ol className="text-yellow-200 space-y-1">
              <li>1. 📸 AI "looks" at image patterns</li>
              <li>2. 🧠 Compares to millions of examples it learned from</li>
              <li>3. 🎯 Makes prediction with confidence score</li>
              <li>4. 🔍 Shows what features it noticed</li>
            </ol>
          </div>
          <div>
            <h5 className="text-white font-medium mb-2">Key Insights:</h5>
            <ul className="text-yellow-200 space-y-1">
              <li>• AI isn't magic - it's pattern recognition</li>
              <li>• Confidence scores show uncertainty</li>
              <li>• AI can be wrong - it's making educated guesses</li>
              <li>• Features show HOW AI "thinks"</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setCurrentPhase(2)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Cool! Now Teach Me How to Build This →
        </button>
      </div>
    </div>
  )

  const ConceptBuilder = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-lg p-6 border border-indigo-500/30">
        <h3 className="text-2xl font-bold text-white mb-4">🧠 Building Your AI Foundation</h3>
        <p className="text-indigo-200 mb-6">
          Now that you've SEEN AI in action, let's understand the core concepts that make it all possible.
        </p>
      </div>

      {foundationConcepts.map((concept, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-xl text-white mb-4">{concept.question}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-blue-300 font-medium mb-3">🤔 Think About It:</h5>
              <p className="text-gray-300 mb-4">{concept.studentThinking}</p>
              
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <h6 className="text-blue-300 font-medium mb-2">💡 The Answer:</h6>
                <p className="text-white">{concept.revelation}</p>
              </div>
            </div>
            
            <div>
              <h5 className="text-green-300 font-medium mb-3">🌍 Real Examples:</h5>
              <ul className="text-gray-300 space-y-2">
                {concept.examples.map((example, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-6 border border-orange-500/30 text-center">
        <h4 className="text-2xl font-bold text-white mb-4">🎯 Your AI Journey Starts NOW!</h4>
        <p className="text-orange-200 mb-6">
          You understand what AI IS, you've SEEN it work, and now you're ready to BUILD your own AI system that can recognize school supplies with superhuman accuracy!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-orange-900/20 rounded-lg p-4">
            <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <h5 className="text-white font-medium mb-1">Phase 1: ✅ COMPLETE</h5>
            <p className="text-orange-200">You understand AI fundamentals</p>
          </div>
          <div className="bg-orange-900/20 rounded-lg p-4">
            <Camera className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <h5 className="text-white font-medium mb-1">Phase 2: UP NEXT</h5>
            <p className="text-orange-200">Build your AI image classifier</p>
          </div>
          <div className="bg-orange-900/20 rounded-lg p-4">
            <Brain className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <h5 className="text-white font-medium mb-1">Phase 3: COMING SOON</h5>
            <p className="text-orange-200">Advanced AI applications</p>
          </div>
        </div>
        
        <button
          onClick={onComplete}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          🚀 Let's Build My First AI System!
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4">
        {[
          { phase: 1, label: "🔮 The Magic", active: currentPhase >= 1 },
          { phase: 1.5, label: "🎮 Try It", active: currentPhase >= 1.5 },
          { phase: 2, label: "🧠 Understand", active: currentPhase >= 2 },
          { phase: 3, label: "🚀 Build", active: currentPhase >= 3 }
        ].map(step => (
          <div
            key={step.phase}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              step.active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>

      {/* Phase Content */}
      {currentPhase === 1 && <PhaseOne />}
      {currentPhase === 1.5 && <InteractiveDemo />}
      {currentPhase === 2 && <ConceptBuilder />}
    </div>
  )
}