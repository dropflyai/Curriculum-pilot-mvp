'use client'

import { BookOpen, Code, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Coding Academy</h1>
            </div>
            <div className="flex space-x-4">
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Learn to Code,
            <span className="text-blue-600"> Build the Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master Python, JavaScript, and AI fundamentals through hands-on projects. 
            From Magic 8-Ball apps to real-world solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Learning
            </Link>
            <Link
              href="/teacher"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Teacher Dashboard
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <Code className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Coding</h3>
            <p className="text-gray-600">
              Write and run Python code directly in your browser. No setup required.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Project-Based Learning</h3>
            <p className="text-gray-600">
              Build real apps like Magic 8-Ball, calculators, and games while learning.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-purple-600 mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Teacher Tools</h3>
            <p className="text-gray-600">
              Track student progress, provide feedback, and manage assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}