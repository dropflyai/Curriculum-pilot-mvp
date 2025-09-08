'use client'

import { ArrowLeft, Users, Calendar, Target, Award, Zap, Shield, Code, Rocket, Brain, BookOpen, Star, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AgentAcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-green-500/30">
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
              <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded-full">CURRENT</span>
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">Ages 14-18</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-8xl mb-6">🕵️</div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Agent Academy
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            <strong>"Master AI agents for covert operations!"</strong><br />
            Students become elite agents learning to deploy AI operatives through 8 specialized training facilities, 
            mastering real-world agentic workflows and professional AI development.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">18</div>
              <div className="text-sm text-gray-300">Weeks</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">8</div>
              <div className="text-sm text-gray-300">Operations</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">AI-First</div>
              <div className="text-sm text-gray-300">Approach</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">Real</div>
              <div className="text-sm text-gray-300">Business</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              🚀 Enroll Now
            </Link>
            <Link
              href="/course-overview"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20 transform hover:scale-105"
            >
              📚 View All Games
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* 8 Operations Overview */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            🎯 The 8 Training Operations
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-4xl mx-auto">
            Progress through specialized training facilities, each teaching crucial AI agent development skills
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🏰</div>
              <h3 className="text-xl font-bold text-white mb-2">Binary Shores Academy</h3>
              <p className="text-gray-300 text-sm mb-3">Python basics for AI + Ethics introduction</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 1-2</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🏘️</div>
              <h3 className="text-xl font-bold text-white mb-2">Variable Village</h3>
              <p className="text-gray-300 text-sm mb-3">Data processing + Error recovery</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 3-4</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🏔️</div>
              <h3 className="text-xl font-bold text-white mb-2">Logic Lake Outpost</h3>
              <p className="text-gray-300 text-sm mb-3">AI decision systems + Ethical frameworks</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 5-7</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🏭</div>
              <h3 className="text-xl font-bold text-white mb-2">Loop Canyon Base</h3>
              <p className="text-gray-300 text-sm mb-3">Batch processing + Environmental responsibility</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 8-10</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🌲</div>
              <h3 className="text-xl font-bold text-white mb-2">Function Forest Station</h3>
              <p className="text-gray-300 text-sm mb-3">AI tool creation + Safety constraints</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 11-13</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">⛰️</div>
              <h3 className="text-xl font-bold text-white mb-2">Array Mountains Facility</h3>
              <p className="text-gray-300 text-sm mb-3">Knowledge systems + Privacy by design</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 14-15</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🏜️</div>
              <h3 className="text-xl font-bold text-white mb-2">Object Oasis Complex</h3>
              <p className="text-gray-300 text-sm mb-3">Multi-agent orchestration + Governance</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Weeks 16-17</span>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-4xl mb-3">🗄️</div>
              <h3 className="text-xl font-bold text-white mb-2">Database Depths</h3>
              <p className="text-gray-300 text-sm mb-3">Complete AI systems + Impact assessment</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Week 18</span>
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <Brain className="w-12 h-12 text-green-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-6">Skills You'll Master</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Agentic AI Workflows</div>
                  <div className="text-sm">Build complex AI systems that work together</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Professional Python</div>
                  <div className="text-sm">Write production-ready code with AI assistance</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Business Applications</div>
                  <div className="text-sm">Solve real-world problems with AI solutions</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">AI Ethics & Safety</div>
                  <div className="text-sm">Responsible AI development and deployment</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <Rocket className="w-12 h-12 text-green-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-6">Career Outcomes</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">AI Developer Ready</div>
                  <div className="text-sm">Direct pipeline to $100K+ AI programming roles</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Industry Partnerships</div>
                  <div className="text-sm">Real business projects with tech companies</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">College Preparation</div>
                  <div className="text-sm">Advanced placement credit and scholarship opportunities</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Professional Portfolio</div>
                  <div className="text-sm">GitHub profile with real AI projects</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Tools & Technology */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            🛠️ Professional Development Tools
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-4xl mx-auto">
            Learn with industry-standard tools used by professional AI developers
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Professional IDE</h3>
              <p className="text-gray-300">VS Code-like environment with AI pair programming</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">AI APIs</h3>
              <p className="text-gray-300">Claude Code & OpenAI integration for real AI development</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Workflow Builder</h3>
              <p className="text-gray-300">n8n-style visual interface for complex AI workflows</p>
            </div>
          </div>
        </div>

        {/* Assessment & Certification */}
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-12 mb-20">
          <div className="text-center">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Industry-Recognized Certification
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Graduate with a <strong>Certified AI Agent Developer</strong> credential that employers recognize and value
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">Portfolio</div>
                <div className="text-sm text-gray-300">8 Real Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">Ethics</div>
                <div className="text-sm text-gray-300">Comprehensive Exam</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">Industry</div>
                <div className="text-sm text-gray-300">Mentor Endorsement</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">Standards</div>
                <div className="text-sm text-gray-300">CSTA Aligned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Become an AI Agent Master?</h2>
            <p className="text-xl mb-8">Join the next generation of AI developers and start your high-tech career</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                🚀 Start Agent Training
              </Link>
              <Link
                href="/teacher-benefits"
                className="bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-800 transition transform hover:scale-105 shadow-xl"
              >
                💰 View School Pricing
              </Link>
            </div>
            <p className="text-sm text-green-100 mt-6">
              ✓ No credit card required • ✓ 30-day free trial • ✓ CSTA standards aligned
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}