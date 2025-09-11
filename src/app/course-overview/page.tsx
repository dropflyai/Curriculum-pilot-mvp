'use client'

import { Brain, Code, Globe, GamepadIcon, Rocket, Target, Calendar, Users, Award, BookOpen, Star, Heart, Crown, Zap, Shield, ChevronRight } from 'lucide-react'
import EducationalNavigation from '@/components/EducationalNavigation'
import Link from 'next/link'

export default function CourseOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900">
      <EducationalNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="text-8xl mb-6">🚀</div>
          <h1 className="text-6xl font-bold mb-6">
            CodeFly ✈️ Complete Curriculum
          </h1>
          <p className="text-2xl mb-8 max-w-5xl mx-auto">
            <strong>Five Age-Appropriate AI Education Games</strong> from Kindergarten to College+
            <br />
            Creating the next generation of AI-literate professionals
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">K-College+</div>
              <div className="text-sm">Complete Journey</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">5 Games</div>
              <div className="text-sm">Age-Appropriate</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">AI-First</div>
              <div className="text-sm">Future-Ready</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">Story</div>
              <div className="text-sm">Driven Learning</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">Fortune 500</div>
              <div className="text-sm">Partnerships</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Philosophy Section */}
        <div className="text-center mb-20">
          <Brain className="h-16 w-16 mx-auto mb-6 text-purple-600" />
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Our Educational Philosophy
          </h2>
          <p className="text-xl text-gray-700 max-w-5xl mx-auto leading-relaxed">
            We believe every student can master AI through <strong>story-driven adventures</strong> that grow with them from kindergarten to career. 
            Each game is carefully designed for specific developmental stages, ensuring age-appropriate challenges, tools, and outcomes 
            that prepare students for the AI-powered future.
          </p>
        </div>

        {/* Complete Curriculum Overview */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            🎮 The Complete CodeFly Game Universe
          </h2>
          
          <div className="grid gap-12">
            
            {/* Digi-Pet Academy (K-2) */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 border-2 border-pink-300">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="text-8xl">🧸</div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <h3 className="text-4xl font-bold text-gray-800">Digi-Pet Academy</h3>
                    <span className="px-4 py-2 bg-pink-500 text-white font-bold rounded-full">K-2 • Ages 5-8</span>
                  </div>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong>"Take care of your AI pet friends!"</strong><br />
                    Students adopt digital pets and learn basic AI concepts through simple drag-and-drop commands. 
                    Pets grow and learn as students master cause-and-effect relationships.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🎯 Learning Goals:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Basic cause-and-effect</li>
                        <li>• Following simple instructions</li>
                        <li>• Pattern recognition</li>
                        <li>• Creative expression</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🛠️ Tools & Interface:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Touch-friendly tablet interface</li>
                        <li>• Voice commands</li>
                        <li>• Parent oversight dashboard</li>
                        <li>• Visual drag-drop blocks</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="px-3 py-1 bg-pink-200 text-pink-800 font-semibold rounded-full">8 weeks</span>
                    <span className="px-3 py-1 bg-pink-200 text-pink-800 font-semibold rounded-full">Pet care</span>
                    <span className="px-3 py-1 bg-pink-200 text-pink-800 font-semibold rounded-full">COPPA compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Magic School (3-5) */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl p-8 border-2 border-purple-300">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="text-8xl">🏰</div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <h3 className="text-4xl font-bold text-gray-800">Magic School</h3>
                    <span className="px-4 py-2 bg-purple-500 text-white font-bold rounded-full">3-5 • Ages 8-11</span>
                  </div>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong>"Learn to cast spells with code magic!"</strong><br />
                    Students are young wizards learning to cast "spells" (AI prompts) using block-based programming 
                    to solve magical problems and help the kingdom.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🎯 Learning Goals:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Logical thinking</li>
                        <li>• Problem decomposition</li>
                        <li>• Creative problem-solving</li>
                        <li>• Collaboration skills</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🛠️ Tools & Interface:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Scratch-like block programming</li>
                        <li>• Group collaboration tools</li>
                        <li>• Teacher monitoring system</li>
                        <li>• Visual debugging</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="px-3 py-1 bg-purple-200 text-purple-800 font-semibold rounded-full">12 weeks</span>
                    <span className="px-3 py-1 bg-purple-200 text-purple-800 font-semibold rounded-full">Magic theme</span>
                    <span className="px-3 py-1 bg-purple-200 text-purple-800 font-semibold rounded-full">Block coding</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Space Academy (6-8) */}
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl p-8 border-2 border-blue-300">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="text-8xl">🚀</div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <h3 className="text-4xl font-bold text-gray-800">Space Academy</h3>
                    <span className="px-4 py-2 bg-blue-500 text-white font-bold rounded-full">6-8 • Ages 11-14</span>
                  </div>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong>"Explore the galaxy with AI crew members!"</strong><br />
                    Students are space cadets learning to work with AI crew members on interstellar missions, 
                    exploring different planets with unique AI challenges.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🎯 Learning Goals:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Abstract thinking</li>
                        <li>• System design</li>
                        <li>• Ethical reasoning</li>
                        <li>• Research and analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🛠️ Tools & Interface:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Hybrid block/text programming</li>
                        <li>• Introduction to Python</li>
                        <li>• Project-based learning</li>
                        <li>• Peer review systems</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 font-semibold rounded-full">16 weeks</span>
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 font-semibold rounded-full">Space theme</span>
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 font-semibold rounded-full">AI ethics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Academy (9-12) - CURRENT */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-8 border-2 border-green-300 ring-4 ring-yellow-300">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="text-8xl">🕵️</div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <h3 className="text-4xl font-bold text-gray-800">Agent Academy</h3>
                    <span className="px-4 py-2 bg-green-500 text-white font-bold rounded-full">9-12 • Ages 14-18</span>
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-bold rounded-full flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      CURRENT
                    </span>
                  </div>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong>"Master AI agents for covert operations!"</strong><br />
                    Students are elite agents learning to deploy AI operatives through 8 specialized training facilities, 
                    mastering real-world agentic workflows and professional AI development.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🎯 Learning Goals:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Complex AI workflows</li>
                        <li>• Business applications</li>
                        <li>• Industry standards</li>
                        <li>• Professional presentation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🛠️ Tools & Interface:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Professional IDE (VS Code-like)</li>
                        <li>• Claude Code & OpenAI APIs</li>
                        <li>• n8n-style workflow builder</li>
                        <li>• Industry partnerships</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="px-3 py-1 bg-green-200 text-green-800 font-semibold rounded-full">18 weeks</span>
                    <span className="px-3 py-1 bg-green-200 text-green-800 font-semibold rounded-full">Spy theme</span>
                    <span className="px-3 py-1 bg-green-200 text-green-800 font-semibold rounded-full">Real business</span>
                  </div>
                  <div className="mt-6">
                    <Link href="/curriculum/agent-academy" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                      View Detailed Curriculum
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CEO Academy (College+) */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-8 border-2 border-yellow-300">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="text-8xl">💼</div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <h3 className="text-4xl font-bold text-gray-800">CEO Academy</h3>
                    <span className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-full">College+ • Ages 18+</span>
                    <span className="px-3 py-1 bg-red-500 text-white font-bold rounded-full">Fortune 500</span>
                  </div>
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong>"Transform real Fortune 500 companies with AI leadership!"</strong><br />
                    Students are AI Transformation Consultants working on actual Fortune 500 business challenges, 
                    presenting to C-suite executives and earning equity participation.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🎯 Learning Goals:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Strategic thinking</li>
                        <li>• Executive leadership</li>
                        <li>• Enterprise AI architecture</li>
                        <li>• Market analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">🏢 Real Partnerships:</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Amazon, Walmart, JPMorgan</li>
                        <li>• McDonald's, Ford, Pfizer</li>
                        <li>• C-suite video calls</li>
                        <li>• Harvard Business Review cases</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 font-semibold rounded-full">20 weeks</span>
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 font-semibold rounded-full">Real companies</span>
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-800 font-semibold rounded-full">$100M+ projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progression Path */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            📈 Complete Learning Progression
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <div className="grid md:grid-cols-5 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl">🧸</div>
                <div className="font-bold">K-2</div>
                <div className="text-sm text-gray-600">Basic AI Concepts</div>
                <div className="text-xs text-pink-600">• Cause & Effect<br/>• Pattern Recognition</div>
              </div>
              <div className="hidden md:block text-4xl text-gray-300">→</div>
              <div className="space-y-2">
                <div className="text-3xl">🏰</div>
                <div className="font-bold">3-5</div>
                <div className="text-sm text-gray-600">Logic & Creativity</div>
                <div className="text-xs text-purple-600">• Block Programming<br/>• Collaboration</div>
              </div>
              <div className="hidden md:block text-4xl text-gray-300">→</div>
              <div className="space-y-2">
                <div className="text-3xl">🚀</div>
                <div className="font-bold">6-8</div>
                <div className="text-sm text-gray-600">Systems & Ethics</div>
                <div className="text-xs text-blue-600">• Python Intro<br/>• AI Ethics</div>
              </div>
              <div className="hidden md:block text-4xl text-gray-300">→</div>
              <div className="space-y-2">
                <div className="text-3xl">🕵️</div>
                <div className="font-bold">9-12</div>
                <div className="text-sm text-gray-600">Professional AI</div>
                <div className="text-xs text-green-600">• Agentic Workflows<br/>• Real Business</div>
              </div>
              <div className="hidden md:block text-4xl text-gray-300">→</div>
              <div className="space-y-2">
                <div className="text-3xl">💼</div>
                <div className="font-bold">College+</div>
                <div className="text-sm text-gray-600">Fortune 500 Ready</div>
                <div className="text-xs text-orange-600">• C-Suite Access<br/>• $100K+ Careers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            What Makes CodeFly Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <GamepadIcon className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Age-Appropriate Stories</h3>
              <p className="text-gray-700">Each game is carefully designed for specific developmental stages with engaging narratives that make learning irresistible.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <Brain className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">AI-First Education</h3>
              <p className="text-gray-700">Built for the age of AI from day one, teaching students to collaborate with AI rather than compete against it.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Real-World Outcomes</h3>
              <p className="text-gray-700">Direct pipeline to high-paying AI careers, with Fortune 500 partnerships and actual business consulting experience.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Education?</h2>
            <p className="text-xl mb-8">Join the AI education revolution that's preparing students for the future</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                🚀 Get Started Now
              </Link>
              <Link
                href="/standards-compliance"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-800 transition transform hover:scale-105 shadow-xl"
              >
                📋 View Standards Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}