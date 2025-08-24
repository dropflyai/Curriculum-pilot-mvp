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
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Course Overview</span>
      </h1>
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30 shadow-2xl max-w-4xl mx-auto">
        <p className="text-2xl text-gray-200 leading-relaxed font-medium mb-6">
          By completing hands-on projects like AI vocabulary mastery, Magic 8-Ball apps, and interactive games, students will have learned essential AI concepts including <span className="text-purple-300 font-semibold">machine learning fundamentals</span>, <span className="text-blue-300 font-semibold">data classification</span>, <span className="text-cyan-300 font-semibold">pattern recognition</span>, and <span className="text-pink-300 font-semibold">algorithmic thinking</span> - all while building real Python applications that demonstrate their understanding of artificial intelligence principles. 🤖✨
        </p>
      </div>
    </div>
  )
}