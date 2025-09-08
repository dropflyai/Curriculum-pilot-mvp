'use client'

import { ArrowLeft, Users, Calendar, Target, Award, Building, TrendingUp, Globe, Code, Rocket, Brain, BookOpen, Star, CheckCircle, ArrowRight, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function CeoAcademyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-orange-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-yellow-500/30">
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
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">Fortune 500</span>
              <span className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-bold rounded-full">Ages 18+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-8xl mb-6">💼</div>
          <h1 className="text-6xl font-bold text-white mb-6">
            CEO Academy
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            <strong>"Transform real Fortune 500 companies with AI leadership!"</strong><br />
            Students are hired as AI Transformation Consultants for actual Fortune 500 companies, 
            working on live business challenges with C-suite executives and earning equity participation.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">20</div>
              <div className="text-sm text-gray-300">Weeks</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">8+</div>
              <div className="text-sm text-gray-300">Fortune 500</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">$100M+</div>
              <div className="text-sm text-gray-300">Projects</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">C-Suite</div>
              <div className="text-sm text-gray-300">Access</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-gray-900 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              💼 Apply Now
            </Link>
            <Link
              href="/games/agent-academy"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20 transform hover:scale-105"
            >
              🕵️ Start with Agent Academy
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* Fortune 500 Partners */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            🏢 Real Fortune 500 Partnerships
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-4xl mx-auto">
            Work directly with executives from the world's largest companies on actual AI transformation projects
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">Amazon</h3>
              <p className="text-gray-300 text-sm">Supply chain optimization for AWS data centers</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <h3 className="text-xl font-bold text-white mb-2">Walmart</h3>
              <p className="text-gray-300 text-sm">Customer behavior prediction for inventory management</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">🏦</div>
              <h3 className="text-xl font-bold text-white mb-2">JPMorgan Chase</h3>
              <p className="text-gray-300 text-sm">Risk assessment AI for loan approvals</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">General Electric</h3>
              <p className="text-gray-300 text-sm">Predictive maintenance for jet engines</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">🍟</div>
              <h3 className="text-xl font-bold text-white mb-2">McDonald's</h3>
              <p className="text-gray-300 text-sm">Dynamic pricing and demand forecasting</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="text-xl font-bold text-white mb-2">Ford Motor</h3>
              <p className="text-gray-300 text-sm">Quality control AI for manufacturing lines</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">💊</div>
              <h3 className="text-xl font-bold text-white mb-2">Pfizer</h3>
              <p className="text-gray-300 text-sm">Drug discovery acceleration with AI</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">Verizon</h3>
              <p className="text-gray-300 text-sm">Network optimization and customer service automation</p>
            </div>
          </div>
        </div>

        {/* Program Structure */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            📈 20-Week Transformation Program
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Weeks 1-5</div>
              <h3 className="text-xl font-bold text-white mb-3">Strategic Foundation</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Executive briefings</li>
                <li>• Market analysis</li>
                <li>• Customer intelligence</li>
                <li>• Operations assessment</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Weeks 6-10</div>
              <h3 className="text-xl font-bold text-white mb-3">AI Implementation</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Supply chain optimization</li>
                <li>• Revenue modeling</li>
                <li>• Financial impact analysis</li>
                <li>• Workforce integration</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Weeks 11-15</div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation & Growth</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Product development</li>
                <li>• Data monetization</li>
                <li>• Risk management</li>
                <li>• International expansion</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Weeks 16-20</div>
              <h3 className="text-xl font-bold text-white mb-3">Leadership & Legacy</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Investor presentations</li>
                <li>• Crisis management</li>
                <li>• Industry disruption</li>
                <li>• Legacy building</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Unique Opportunities */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <Building className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-6">Real Business Impact</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">C-Suite Video Calls</div>
                  <div className="text-sm">Present directly to Fortune 500 executives</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Live Data Access</div>
                  <div className="text-sm">Work with actual company data and systems</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Stakeholder Meetings</div>
                  <div className="text-sm">Regular check-ins with business leaders</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Implementation Results</div>
                  <div className="text-sm">See your solutions deployed in production</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <TrendingUp className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-6">Career Acceleration</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">LinkedIn Recommendations</div>
                  <div className="text-sm">From Fortune 500 executives you worked with</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Harvard Business Review</div>
                  <div className="text-sm">Published case studies of your work</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Board Advisory Positions</div>
                  <div className="text-sm">Direct pathways to corporate board roles</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Equity Participation</div>
                  <div className="text-sm">Share in the success of transformations</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-2xl p-12 mb-20">
          <div className="text-center">
            <Target className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Prerequisites & Admission
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              CEO Academy is our most advanced program, requiring completion of Agent Academy or equivalent experience
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">🕵️</div>
                <div className="text-xl font-bold text-white mb-2">Agent Academy Graduate</div>
                <div className="text-sm text-gray-300">OR equivalent AI development experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">💼</div>
                <div className="text-xl font-bold text-white mb-2">Business Aptitude</div>
                <div className="text-sm text-gray-300">Understanding of business fundamentals</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-xl font-bold text-white mb-2">Executive Mindset</div>
                <div className="text-sm text-gray-300">Leadership potential and strategic thinking</div>
              </div>
            </div>
            
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-6">
              <p className="text-red-200">
                <strong>Limited Enrollment:</strong> Only 50 students accepted per cohort. 
                Applications include portfolio review, business case analysis, and executive interviews.
              </p>
            </div>
          </div>
        </div>

        {/* Outcomes */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            💰 Graduate Outcomes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">$200K+</div>
              <p className="text-gray-300 text-sm">Average starting salary</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Building className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <p className="text-gray-300 text-sm">Job placement rate</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Global</div>
              <p className="text-gray-300 text-sm">Career opportunities</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Rocket className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">C-Suite</div>
              <p className="text-gray-300 text-sm">Track record</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Lead AI Transformation?</h2>
            <p className="text-xl mb-8">Join the elite few who will shape the future of business with AI</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
              >
                💼 Apply to CEO Academy
              </Link>
              <Link
                href="/games/agent-academy"
                className="bg-orange-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-orange-800 transition transform hover:scale-105 shadow-xl"
              >
                🕵️ Start with Agent Academy
              </Link>
            </div>
            <p className="text-sm text-orange-100 mt-6">
              ✓ Requires Agent Academy completion • ✓ Limited enrollment • ✓ Executive mentorship included
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}