'use client'

import { BookOpen, Code, Users, Target, Calendar, Award } from 'lucide-react'
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
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium animate-fade-in">
            Master Python programming through fun, interactive projects! 🎆
            <br />
            <span className="text-lg text-gray-600 mt-2 block">From Magic 8-Ball apps to awesome games - coding has never been this exciting! 🚀</span>
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
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
            <div className="mb-6 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <Code className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">\u2728</div>
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
  const [overviewTab, setOverviewTab] = useState<'overview' | 'projects' | 'schedule' | 'requirements'>('overview')

  return (
    <>
      {/* Hero Stats */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Python Programming Course</span>
        </h1>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="bg-blue-600/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-blue-400/30">
            <span className="text-blue-400 font-bold text-lg">18 Weeks</span>
          </div>
          <div className="bg-purple-600/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-purple-400/30">
            <span className="text-purple-400 font-bold text-lg">2 Major Projects</span>
          </div>
          <div className="bg-pink-600/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-pink-400/30">
            <span className="text-pink-400 font-bold text-lg">Real Portfolio</span>
          </div>
          <div className="bg-green-600/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-400/30">
            <span className="text-green-400 font-bold text-lg">No Prerequisites</span>
          </div>
        </div>
      </div>

      {/* Course Overview Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center space-x-1 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'projects', label: 'What You\'ll Build', icon: Code },
            { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
            { id: 'requirements', label: 'Requirements', icon: Award }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setOverviewTab(id as any)}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
                overviewTab === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 shadow-2xl">
        {overviewTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Course Description</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform from coding newbie to Python programmer! This comprehensive course introduces 9th-grade students to programming fundamentals through hands-on projects, interactive lessons, and real-world applications. Students build confidence through gamified learning while teachers track progress with powerful analytics. ✨
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent mb-6">Learning Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🎯 Students Will:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Master Python fundamentals (variables, functions, loops)</li>
                    <li>• Build interactive applications and games</li>
                    <li>• Debug code and solve programming problems</li>
                    <li>• Create personal coding portfolio</li>
                    <li>• Develop computational thinking skills</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">📚 Teachers Will:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Monitor real-time student progress</li>
                    <li>• Access comprehensive analytics dashboard</li>
                    <li>• Manage assignments and grading efficiently</li>
                    <li>• Generate detailed progress reports</li>
                    <li>• Support struggling students proactively</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Course Philosophy</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Learning to code should be engaging, accessible, and fun! CodeFly uses project-based learning where students immediately see their code come to life. Every lesson connects programming concepts to real-world applications students understand and enjoy. 🚀
              </p>
            </div>
          </div>
        )}

        {overviewTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">🚀 What You'll Build</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">🎱 Magic 8-Ball App</h3>
                <p className="text-gray-300 mb-3">Interactive fortune-telling application with custom responses and beautiful animations.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Random number generation</li>
                  <li>• User input handling</li>
                  <li>• Conditional logic</li>
                  <li>• List operations</li>
                </ul>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">🧮 Smart Calculator</h3>
                <p className="text-gray-300 mb-3">Advanced calculator with memory functions, history, and scientific operations.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Mathematical operations</li>
                  <li>• Function definitions</li>
                  <li>• Error handling</li>
                  <li>• Data persistence</li>
                </ul>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">🎮 Adventure Game</h3>
                <p className="text-gray-300 mb-3">Text-based adventure with player choices, inventory system, and story progression.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Object-oriented programming</li>
                  <li>• Complex data structures</li>
                  <li>• Game logic design</li>
                  <li>• User experience flow</li>
                </ul>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-pink-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">📊 Personal Portfolio</h3>
                <p className="text-gray-300 mb-3">Showcase all projects in a professional coding portfolio with live demos.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Project documentation</li>
                  <li>• Code organization</li>
                  <li>• Presentation skills</li>
                  <li>• Professional development</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {overviewTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent mb-6 text-center">📅 18-Week Learning Journey</h2>
            <div className="space-y-4">
              {[
                { weeks: "Weeks 1-3", title: "🌱 Foundation Building", topics: "Variables, Input/Output, Basic Operations, Debugging" },
                { weeks: "Weeks 4-6", title: "🔄 Control Flow Mastery", topics: "Conditionals, Loops, Decision Making, Logic" },
                { weeks: "Weeks 7-9", title: "📝 Functions & Organization", topics: "Function Creation, Parameters, Return Values, Code Structure" },
                { weeks: "Weeks 10-12", title: "📊 Data Management", topics: "Lists, Dictionaries, File Operations, Data Processing" },
                { weeks: "Weeks 13-15", title: "🎮 Game Development", topics: "Object-Oriented Programming, Classes, Game Logic" },
                { weeks: "Weeks 16-18", title: "🏆 Portfolio Creation", topics: "Project Refinement, Documentation, Presentation Skills" }
              ].map((phase, index) => (
                <div key={index} className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{phase.weeks}: {phase.title}</h3>
                      <p className="text-gray-300 mt-2">{phase.topics}</p>
                    </div>
                    <div className="text-2xl">{index < 2 ? '🟢' : index < 4 ? '🟡' : '🔴'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {overviewTab === 'requirements' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">📋 Course Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">✅ Student Requirements</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• No prior programming experience needed</li>
                    <li>• Computer with internet access</li>
                    <li>• Modern web browser (Chrome, Firefox, Safari)</li>
                    <li>• Curiosity and willingness to learn!</li>
                    <li>• 3-4 hours per week commitment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">🎯 Teacher Requirements</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Basic computer skills (no coding required)</li>
                    <li>• Access to teacher dashboard</li>
                    <li>• Ability to support student problem-solving</li>
                    <li>• Classroom management experience</li>
                    <li>• 1-2 hours prep time per week</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 text-center">🏆 Assessment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">📝 Interactive Quizzes (30%)</h3>
                  <p className="text-gray-300 text-sm">Auto-graded concept checks with immediate feedback</p>
                </div>
                <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">💻 Coding Projects (50%)</h3>
                  <p className="text-gray-300 text-sm">Hands-on applications demonstrating programming skills</p>
                </div>
                <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-pink-100">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent mb-3">🎯 Participation (20%)</h3>
                  <p className="text-gray-300 text-sm">Active engagement and progress tracking</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6 text-center">📈 Success Metrics</h2>
              <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-purple-500/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">🎓 Student Success Indicators</h3>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• 80%+ completion rate on coding projects</li>
                      <li>• Ability to debug simple programming errors</li>
                      <li>• Portfolio with 2+ functional applications</li>
                      <li>• Demonstrated problem-solving improvement</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">📊 Teacher Dashboard Features</h3>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Real-time progress monitoring</li>
                      <li>• Automated grading and feedback</li>
                      <li>• Parent communication reports</li>
                      <li>• AI-powered intervention alerts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}