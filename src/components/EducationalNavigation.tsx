'use client'

import Link from 'next/link'
import { Code, Brain, Award, CheckCircle, TrendingUp, BookOpen, ArrowLeft } from 'lucide-react'

export default function EducationalNavigation() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Home Link */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8">
              <ArrowLeft className="h-4 w-4 mr-2 text-gray-600" />
              <Code className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CodeFly ✈️
              </span>
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-gray-900 rounded-full">
                #1 in K-12
              </span>
            </Link>
          </div>

          {/* Educational Pages Navigation */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/future-of-education" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <Brain className="w-4 h-4" />
              <span>Vision</span>
            </Link>
            <Link 
              href="/standards-compliance" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Standards</span>
            </Link>
            <Link 
              href="/course-overview" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Curriculum
            </Link>
            <Link 
              href="/teacher-benefits" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Pricing</span>
            </Link>
            <Link 
              href="/auth" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}