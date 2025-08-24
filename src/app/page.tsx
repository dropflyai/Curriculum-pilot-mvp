'use client'

import { BookOpen, Code, Users, Target, Calendar, Award, Bot } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'overview'>('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">CodeFly ✈️</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-medium transition-colors ${
                  activeTab === 'home' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                Course Overview
              </button>
              <div className="flex space-x-4 ml-6">
                <Link 
                  href="/dashboard" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Student Portal
                </Link>
                <Link 
                  href="/teacher" 
                  className="text-gray-600 hover:text-gray-800"
                >
                  Teacher
                </Link>
                <Link 
                  href="/auth" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'home' ? (
          <>
            {/* Hero Section */}
            <div className="text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Learn to Code,</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent animate-gradient">Take Flight! ✈️</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-medium animate-fade-in">
            Master Python programming through fun, interactive projects! 🎆
            <br />
            <span className="text-lg text-gray-300 mt-2 block">From Magic 8-Ball apps to awesome games - coding has never been this exciting! 🚀</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center glow-blue"
            >
              <BookOpen className="h-6 w-6 mr-3 animate-pulse" />
              Start Your Journey! 🎆
            </Link>
            <Link
              href="/teacher"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center glow-purple"
            >
              <Users className="h-6 w-6 mr-3 animate-bounce" />
              Teacher Portal 🎯
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Code className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 text-center">Interactive Coding</h3>
            <p className="text-gray-300 text-center font-medium">
              Write and run Python code directly in your browser. No setup required - just pure coding magic! \ud83d\udcbb
            </p>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <BookOpen className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">\ud83c\udf86</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 text-center">Project-Based Learning</h3>
            <p className="text-gray-300 text-center font-medium">
              Build real apps like Magic 8-Ball, calculators, and games while learning. Learning by doing! \ud83c\udfae
            </p>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-cyan-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Bot className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🤖</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4 text-center">AI Study Buddy</h3>
            <p className="text-gray-300 text-center font-medium">
              Your personal AI coding companion! Get instant help, debugging support, and personalized guidance 24/7! 🚀
            </p>
          </div>
          
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Users className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">\ud83c\udfc6</div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-center">Teacher Tools</h3>
            <p className="text-gray-300 text-center font-medium">
              Track student progress, provide feedback, and manage assignments with ease. Teaching made simple! \ud83c\udf86
            </p>
          </div>
            </div>
          </>
        ) : (
          <CourseOverview />
        )}
      </div>
    </div>
  )
}

function CourseOverview() {

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl sm:text-6xl font-bold mb-8">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">What Students Will Master</span>
      </h1>
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 shadow-2xl max-w-5xl mx-auto">
        <p className="text-xl text-gray-300 mb-8 font-medium">
          By the end of this 18-week semester, students will have mastered:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Programming Skills */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">💻</span>
              Python Programming Skills
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Variables, data types, and user input/output</li>
              <li>• Conditional logic (if/else statements)</li>
              <li>• Loops and iteration patterns</li>
              <li>• Lists, randomness, and data structures</li>
              <li>• Functions and code organization</li>
              <li>• Problem-solving with algorithmic thinking</li>
            </ul>
          </div>

          {/* AI & Technology */}
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🤖</span>
              AI & Machine Learning
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• How AI image classifiers work</li>
              <li>• API integration and data fetching</li>
              <li>• Pattern recognition principles</li>
              <li>• Machine learning vocabulary and concepts</li>
              <li>• Ethics in AI and responsible technology use</li>
              <li>• Emerging technology awareness</li>
            </ul>
          </div>

          {/* Web Development */}
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🌐</span>
              Web Development
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• HTML structure and semantic elements</li>
              <li>• CSS styling and responsive design</li>
              <li>• JavaScript basics and interactivity</li>
              <li>• Building personal websites and portfolios</li>
              <li>• API integration for dynamic content</li>
              <li>• Publishing and sharing projects online</li>
            </ul>
          </div>

          {/* Digital Media & Creative Skills */}
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🎨</span>
              Digital Media & Design
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Digital image editing and manipulation</li>
              <li>• Animation principles and creation</li>
              <li>• Visual design and user interface concepts</li>
              <li>• Creative problem-solving with technology</li>
              <li>• Combining AI tools with creative projects</li>
              <li>• Digital storytelling and presentation skills</li>
            </ul>
          </div>

          {/* Professional Skills */}
          <div className="bg-gradient-to-br from-cyan-900/50 to-teal-900/50 rounded-lg p-6 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🚀</span>
              21st Century Skills
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Team collaboration and project management</li>
              <li>• Technical communication and presentation</li>
              <li>• Debugging and problem-solving strategies</li>
              <li>• Digital portfolio creation and curation</li>
              <li>• Critical thinking about technology's impact</li>
              <li>• Self-directed learning and growth mindset</li>
            </ul>
          </div>

          {/* Real-World Applications */}
          <div className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 rounded-lg p-6 border border-violet-500/30">
            <h3 className="text-xl font-bold text-violet-300 mb-4 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Real-World Projects
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Interactive games and entertainment apps</li>
              <li>• AI-powered tools and applications</li>
              <li>• Personal websites and digital presence</li>
              <li>• Team-based mini-applications</li>
              <li>• Public project showcase and presentation</li>
              <li>• Future-ready skills for Grade 10 and beyond</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-blue-500/30">
          <p className="text-lg text-gray-200 font-medium">
            <span className="text-yellow-300 font-bold">🌟 Most importantly:</span> Students will develop confidence as creators, not just consumers of technology, with the skills and mindset to continue learning and building in our digital world.
          </p>
        </div>
      </div>
    </div>
  )
}