'use client'

import { ArrowLeft, Rocket, Users, Calendar, Target, Award, Code, Shield, Globe, Brain, BookOpen, Star, CheckCircle, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SpaceAcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-blue-500/30">
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
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">Ages 11-14</span>
              <span className="px-3 py-1 bg-cyan-500 text-white text-sm font-bold rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-8xl mb-6">🚀</div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Space Academy
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            <strong>"Explore the galaxy with AI crew members!"</strong><br />
            Students become space cadets learning to work with AI crew members on interstellar missions. 
            Each operation takes them to different planets with unique AI challenges and ethical dilemmas.
          </p>

          <div className="bg-cyan-900/50 border border-cyan-500/30 rounded-xl p-8 mb-8 max-w-4xl mx-auto">
            <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Coming in Phase 2</h2>
            <p className="text-lg text-gray-300 mb-6">
              Space Academy bridges the gap between elementary block coding and professional AI development, 
              perfect for middle school students ready for more complex challenges.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h3 className="font-bold text-blue-300 mb-2">🐍 Python Introduction</h3>
                <p className="text-sm text-gray-300">Transition from blocks to real code</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-blue-300 mb-2">🤖 AI Ethics Deep Dive</h3>
                <p className="text-sm text-gray-300">Critical thinking about AI decisions</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-blue-300 mb-2">🌟 Project-Based Learning</h3>
                <p className="text-sm text-gray-300">Build real AI-powered space missions</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-blue-300 mb-2">👥 Peer Collaboration</h3>
                <p className="text-sm text-gray-300">Team missions and code reviews</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games/agent-academy"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              🕵️ Try Agent Academy (Ages 14-18)
            </Link>
            <Link
              href="/games/magic-school"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20 transform hover:scale-105"
            >
              🏰 Back to Magic School (Ages 8-11)
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* 16-Week Space Missions */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            🌌 16-Week Galactic Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Launch Pad</h3>
              <p className="text-gray-300 text-sm mb-2">AI crew introductions</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Week 1</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">🧭</div>
              <h3 className="text-lg font-bold text-white mb-2">Navigation</h3>
              <p className="text-gray-300 text-sm mb-2">AI decision making</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Week 2</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">☿️</div>
              <h3 className="text-lg font-bold text-white mb-2">Planet Mercury</h3>
              <p className="text-gray-300 text-sm mb-2">Speed processing</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Week 3</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">♀️</div>
              <h3 className="text-lg font-bold text-white mb-2">Planet Venus</h3>
              <p className="text-gray-300 text-sm mb-2">Handling biased AI</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Week 4</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">🔴</div>
              <h3 className="text-lg font-bold text-white mb-2">Planet Mars</h3>
              <p className="text-gray-300 text-sm mb-2">Resource management</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Weeks 5-6</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">🪨</div>
              <h3 className="text-lg font-bold text-white mb-2">Asteroid Belt</h3>
              <p className="text-gray-300 text-sm mb-2">Multiple AI agents</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Weeks 7-8</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">🪐</div>
              <h3 className="text-lg font-bold text-white mb-2">Planet Jupiter</h3>
              <p className="text-gray-300 text-sm mb-2">Large-scale data</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Weeks 9-10</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30 text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-bold text-white mb-2">Home Planet</h3>
              <p className="text-gray-300 text-sm mb-2">Mission presentation</p>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Week 16</span>
            </div>
          </div>
        </div>

        {/* AI Crew Members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
            <div className="text-5xl mb-4">👨‍🚀</div>
            <h3 className="text-xl font-bold text-white mb-3">Commander Cosmos</h3>
            <p className="text-gray-300 text-sm">
              Mission leader who provides strategic guidance and unlocks advanced challenges.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-3">ARIA</h3>
            <p className="text-gray-300 text-sm">
              AI Research Intelligence Assistant - your personal AI partner for all missions.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
            <div className="text-5xl mb-4">👩‍🔬</div>
            <h3 className="text-xl font-bold text-white mb-3">Dr. Data</h3>
            <p className="text-gray-300 text-sm">
              Scientist teaching data analysis and helping with research on each planet.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 text-center">
            <div className="text-5xl mb-4">👽</div>
            <h3 className="text-xl font-bold text-white mb-3">Alien AIs</h3>
            <p className="text-gray-300 text-sm">
              Different AI personalities on each planet with unique challenges to overcome.
            </p>
          </div>
        </div>

        {/* Skills Bridge */}
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-2xl p-12 mb-20">
          <div className="text-center">
            <Brain className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              The Perfect Skills Bridge
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">🎯 Advanced Skills</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Abstract thinking and system design</li>
                  <li>✓ Ethical reasoning with AI systems</li>
                  <li>✓ Research and analysis methods</li>
                  <li>✓ Critical evaluation of AI decisions</li>
                  <li>✓ Team collaboration on complex projects</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">🛠️ Technical Transition</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Hybrid block/text programming interface</li>
                  <li>✓ Introduction to Python syntax</li>
                  <li>✓ AI ethics deep-dive scenarios</li>
                  <li>✓ Data science with AI tools</li>
                  <li>✓ Project-based learning approach</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready for Galactic AI Adventures?</h2>
            <p className="text-xl mb-8">Perfect for middle schoolers ready to explore the universe of AI possibilities</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                🚀 Join the Mission
              </Link>
              <Link
                href="/games/agent-academy"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-800 transition transform hover:scale-105 shadow-xl"
              >
                🕵️ Advance to Agent Academy
              </Link>
            </div>
            <p className="text-sm text-blue-100 mt-6">
              ✓ Perfect for ages 11-14 • ✓ Bridges to professional AI • ✓ Team-based learning
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}