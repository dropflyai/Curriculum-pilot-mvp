'use client'

import { ArrowLeft, Sparkles, Users, Calendar, Target, Award, Code, Shield, Rocket, Brain, BookOpen, Star, CheckCircle, Wand2 } from 'lucide-react'
import Link from 'next/link'

export default function MagicSchoolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
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
              <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-full">Ages 8-11</span>
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-8xl mb-6">🏰</div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Magic School
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            <strong>"Learn to cast spells with code magic!"</strong><br />
            Students become young wizards at a magical academy, learning to cast "spells" (AI prompts) 
            using block-based programming to solve magical problems and help the kingdom.
          </p>

          <div className="bg-blue-900/50 border border-blue-500/30 rounded-xl p-8 mb-8 max-w-4xl mx-auto">
            <Wand2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Coming in Phase 2</h2>
            <p className="text-lg text-gray-300 mb-6">
              Magic School is the next priority in our development roadmap, designed specifically for elementary students 
              ready to move beyond basic concepts to logical thinking and creative problem-solving.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h3 className="font-bold text-purple-300 mb-2">🧩 Block-Based Magic</h3>
                <p className="text-sm text-gray-300">Scratch-like interface for spell creation</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-purple-300 mb-2">🤝 Group Quests</h3>
                <p className="text-sm text-gray-300">Collaborative magic with classmates</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-purple-300 mb-2">👩‍🏫 Teacher Portal</h3>
                <p className="text-sm text-gray-300">Classroom management and progress monitoring</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-purple-300 mb-2">✨ Creative Expression</h3>
                <p className="text-sm text-gray-300">AI art and story generation magic</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games/space-academy"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              🚀 Explore Space Academy (Ages 11-14)
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
        
        {/* 12-Week Magic Journey */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            🎓 12-Week Magical Journey
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">🪄</div>
              <h3 className="text-lg font-bold text-white mb-2">Wand Selection</h3>
              <p className="text-gray-300 text-sm mb-2">Setting up AI tools (kid-safe)</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 1</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-bold text-white mb-2">Basic Spells</h3>
              <p className="text-gray-300 text-sm mb-2">Simple AI interactions</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 2</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">🧪</div>
              <h3 className="text-lg font-bold text-white mb-2">Potion Brewing</h3>
              <p className="text-gray-300 text-sm mb-2">Combining ingredients (data)</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 3</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">🐉</div>
              <h3 className="text-lg font-bold text-white mb-2">Creature Care</h3>
              <p className="text-gray-300 text-sm mb-2">Teaching AI recognition</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 4</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-lg font-bold text-white mb-2">Spell Scrolls</h3>
              <p className="text-gray-300 text-sm mb-2">Reusable magic (functions)</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 5</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">🔮</div>
              <h3 className="text-lg font-bold text-white mb-2">Crystal Ball</h3>
              <p className="text-gray-300 text-sm mb-2">Pattern recognition</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 6</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-lg font-bold text-white mb-2">Magic Items</h3>
              <p className="text-gray-300 text-sm mb-2">Building useful AI tools</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Weeks 7-12</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-300/30 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-bold text-white mb-2">Graduation</h3>
              <p className="text-gray-300 text-sm mb-2">Portfolio presentation</p>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">Week 12</span>
            </div>
          </div>
        </div>

        {/* Characters & Mentors */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🧙‍♂️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Headmaster Merlin</h3>
            <p className="text-gray-300">
              Wise AI teacher who guides students through magical coding challenges 
              and provides encouragement when spells don't work quite right.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🧚‍♀️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Professor Pixie</h3>
            <p className="text-gray-300">
              Fun helper for debugging who makes fixing mistakes feel like solving puzzles. 
              Always has a magical hint when students get stuck.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🐲</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ruby the Dragon</h3>
            <p className="text-gray-300">
              Advanced AI companion that students train throughout their magical journey, 
              growing more intelligent as students learn more spells.
            </p>
          </div>
        </div>

        {/* Learning Magic */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-12 mb-20">
          <div className="text-center">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              The Magic of Learning
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">🎯 Building Skills</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Logical thinking and problem decomposition</li>
                  <li>✓ Creative problem-solving with AI</li>
                  <li>✓ Collaboration and teamwork</li>
                  <li>✓ Natural language AI interactions</li>
                  <li>✓ Data organization and sorting</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">🛠️ Magic Tools</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Scratch-like AI programming blocks</li>
                  <li>✓ Group collaboration spells</li>
                  <li>✓ Creative AI art and story magic</li>
                  <li>✓ Visual debugging enchantments</li>
                  <li>✓ Problem-solving spell library</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready for Magical AI Learning?</h2>
            <p className="text-xl mb-8">Join the waitlist for the most enchanting way to learn AI and coding</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                ✨ Join the Waitlist
              </Link>
              <Link
                href="/games/agent-academy"
                className="bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-purple-800 transition transform hover:scale-105 shadow-xl"
              >
                🕵️ Try Agent Academy Now
              </Link>
            </div>
            <p className="text-sm text-purple-100 mt-6">
              ✓ Early access pricing • ✓ Magic-themed learning • ✓ Perfect for ages 8-11
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}