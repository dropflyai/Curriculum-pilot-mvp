'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Upload, CheckCircle, Camera, Code, FileText, Users } from 'lucide-react'

export default function Magic8BallHomework() {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const enhancementOptions = [
    {
      id: 'themed',
      icon: '🎯',
      title: 'Themed Magic 8-Balls',
      description: 'Create 3 specialized versions (Study Buddy Ball, Sports Oracle, Future Career Guide)',
      tasks: ['Custom responses for each theme', 'Theme-specific visual design', 'Documentation of theme choices']
    },
    {
      id: 'smart',
      icon: '🧠',
      title: 'Smart Question Analysis',
      description: 'Make responses adapt to question types and add confidence levels',
      tasks: ['Question type detection', 'Confidence level responses', 'Pattern tracking display']
    },
    {
      id: 'persistence',
      icon: '💾',
      title: 'Data Persistence System',
      description: 'Save questions/answers and create history features',
      tasks: ['File saving system', 'Question history display', 'Custom response loading']
    },
    {
      id: 'interactive',
      icon: '🎨',
      title: 'Interactive Experience',
      description: 'Add animations, effects, and themed interfaces',
      tasks: ['ASCII art animations', 'Typing effects', 'Colorful user interface']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link 
                href="/dashboard"
                className="flex items-center text-purple-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Lesson 2 Homework: Magic 8-Ball Portfolio 🎱
                </h1>
                <p className="text-purple-300">60-minute portfolio assignment</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock className="h-5 w-5" />
              <span className="font-medium">60 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Overview */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <h2 className="text-xl font-bold text-white mb-4">📋 Assignment Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-800/50 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white font-medium">Part 1</div>
              <div className="text-blue-200 text-sm">Enhancement (25 min)</div>
            </div>
            <div className="bg-purple-800/50 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-white font-medium">Part 2</div>
              <div className="text-purple-200 text-sm">Portfolio (20 min)</div>
            </div>
            <div className="bg-pink-800/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-white font-medium">Part 3</div>
              <div className="text-pink-200 text-sm">Peer Prep (15 min)</div>
            </div>
          </div>
        </div>

        {/* Part 1: Enhancement Options */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">⚡</span>
            Part 1: Choose Your Enhancement (25 minutes)
          </h2>
          <p className="text-gray-300 mb-6">Select ONE option to enhance your Magic 8-Ball project:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enhancementOptions.map((option) => (
              <div 
                key={option.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedOption === option.id 
                    ? 'border-blue-400 bg-blue-900/30' 
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">{option.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{option.description}</p>
                    <ul className="space-y-1">
                      {option.tasks.map((task, index) => (
                        <li key={index} className="text-gray-400 text-xs flex items-center">
                          <span className="text-green-400 mr-2">✓</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Portfolio Documentation */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">📱</span>
            Part 2: Portfolio Documentation (20 minutes)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <h3 className="font-bold text-purple-300 mb-2 flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Screenshots & Visuals
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Take 3-5 screenshots of your Magic 8-Ball in action</li>
                  <li>• Show different responses and features</li>
                  <li>• Capture any visual enhancements you added</li>
                </ul>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-4">
                <h3 className="font-bold text-blue-300 mb-2 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Code Documentation
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Explain your key code additions</li>
                  <li>• Highlight one cool technique you're proud of</li>
                  <li>• Document any challenges you overcame</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-pink-900/30 rounded-lg p-4">
                <h3 className="font-bold text-pink-300 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Reflection Essay
                </h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• What did you learn about randomness?</li>
                  <li>• How does programming connect to real life?</li>
                  <li>• What would you add next?</li>
                </ul>
              </div>

              <div className="bg-green-900/30 rounded-lg p-4">
                <h3 className="font-bold text-green-300 mb-2">Portfolio Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">#MagicBall</span>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">#Week2</span>
                  <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs">#PythonProject</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 3: Peer Preparation */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 mb-8 border border-pink-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">🤝</span>
            Part 3: Peer Gallery Preparation (15 minutes)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-900/30 rounded-lg p-4">
              <h3 className="font-bold text-pink-300 mb-3">Gallery Walk Prep</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>🏆 <strong>Feature Demo:</strong> Practice 2-minute demonstration</li>
                <li>💡 <strong>Inspiration Story:</strong> What inspired your theme/approach?</li>
                <li>🔍 <strong>Technical Highlight:</strong> Coolest coding technique you used</li>
                <li>🎯 <strong>Future Ideas:</strong> How would you enhance it further?</li>
              </ul>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-4">
              <h3 className="font-bold text-blue-300 mb-3">Class Voting Categories</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>🎨 <strong>Most Creative Theme</strong></li>
                <li>💻 <strong>Best Code Innovation</strong></li>
                <li>✨ <strong>Coolest Visual Design</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Upload className="h-6 w-6 mr-3" />
            Submit Your Portfolio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-green-300 mb-3">Required Submissions:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Enhanced Magic 8-Ball code file (.py)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Screenshots (3-5 images)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Code explanation document</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Reflection essay (2-3 paragraphs)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-green-300 mb-3">Upload Files:</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400 text-sm mb-2">Drag files here or click to upload</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Choose Files
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              💡 Remember to include hashtags: #MagicBall #Week2 #PythonProject
            </div>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Portfolio ✨
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="h-6 w-6 mr-3 text-cyan-400" />
            What Happens Next?
          </h2>
          <div className="text-gray-300 space-y-3">
            <p>🎨 <strong>Gallery Walk:</strong> Next class, browse everyone's Magic 8-Ball creations</p>
            <p>🗳️ <strong>Peer Voting:</strong> Vote for "Most Creative Theme," "Best Code Innovation," and "Coolest Visual Design"</p>
            <p>💬 <strong>Positive Feedback:</strong> Leave encouraging comments on classmates' portfolios</p>
            <p>🏆 <strong>Celebration:</strong> Recognize creativity and share learning insights with the class</p>
          </div>
        </div>
      </div>
    </div>
  )
}