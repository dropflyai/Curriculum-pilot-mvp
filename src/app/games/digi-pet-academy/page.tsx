'use client'

import { ArrowLeft, Heart, Users, Calendar, Target, Award, Sparkles, Shield, Code, Rocket, Brain, BookOpen, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function DigiPetAcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-pink-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to CodeFly</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-pink-500 text-white text-sm font-bold rounded-full">Ages 5-8</span>
              <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-8xl mb-6">🧸</div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Digi-Pet Academy
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            <strong>"Take care of your AI pet friends!"</strong><br />
            The perfect introduction to AI for kindergarten through 2nd grade. 
            Students adopt digital pets and learn basic AI concepts through simple drag-and-drop commands.
          </p>

          <div className="bg-purple-900/50 border border-purple-500/30 rounded-xl p-8 mb-8 max-w-4xl mx-auto">
            <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Coming in Phase 2</h2>
            <p className="text-lg text-gray-300 mb-6">
              Digi-Pet Academy is currently in development as part of our K-College+ expansion. 
              We're working with child development experts to create the perfect AI learning experience for young minds.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h3 className="font-bold text-pink-300 mb-2">📱 Touch-Friendly Design</h3>
                <p className="text-sm text-gray-300">Tablet-optimized interface perfect for small hands</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-pink-300 mb-2">🎵 Voice Commands</h3>
                <p className="text-sm text-gray-300">Kids can talk to their pets naturally</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-pink-300 mb-2">👨‍👩‍👧‍👦 Parent Dashboard</h3>
                <p className="text-sm text-gray-300">Full oversight and progress tracking</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-pink-300 mb-2">🔒 COPPA Compliant</h3>
                <p className="text-sm text-gray-300">Built with child privacy as top priority</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games/magic-school"
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              🏰 Explore Magic School (Ages 8-11)
            </Link>
            <Link
              href="/games/agent-academy"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20 transform hover:scale-105"
            >
              🕵️ Try Agent Academy (Current)
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* What We're Building */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            🎮 What We're Building for Little Learners
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-300/30 text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Pet Care</h3>
              <p className="text-gray-300 text-sm">Feed, play with, and train adorable AI pets</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-300/30 text-center">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Simple Commands</h3>
              <p className="text-gray-300 text-sm">Drag and drop blocks to give pets instructions</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-300/30 text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Learning Patterns</h3>
              <p className="text-gray-300 text-sm">Pets "learn" from repeated actions and grow</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-300/30 text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Celebrations</h3>
              <p className="text-gray-300 text-sm">Pet shows and achievements to share</p>
            </div>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 rounded-2xl p-12 mb-20">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-pink-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Age-Appropriate Learning Goals
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-pink-300 mb-4">🎯 Core Skills</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Basic cause-and-effect understanding</li>
                  <li>✓ Following simple instructions</li>
                  <li>✓ Pattern recognition</li>
                  <li>✓ Creative expression</li>
                  <li>✓ Caring and responsibility</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-pink-300 mb-4">🛠️ Technical Foundation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Introduction to commands</li>
                  <li>✓ Sequencing activities</li>
                  <li>✓ Problem-solving basics</li>
                  <li>✓ Digital literacy</li>
                  <li>✓ AI as helpful friend concept</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Notify Me */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Get Notified When We Launch!</h2>
            <p className="text-xl mb-8">Be the first to know when Digi-Pet Academy becomes available for young learners</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-pink-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                🔔 Notify Me When Available
              </Link>
              <Link
                href="/games/agent-academy"
                className="bg-pink-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-pink-800 transition transform hover:scale-105 shadow-xl"
              >
                🕵️ Start with Agent Academy Today
              </Link>
            </div>
            <p className="text-sm text-pink-100 mt-6">
              ✓ No spam • ✓ Early access pricing • ✓ Development updates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}