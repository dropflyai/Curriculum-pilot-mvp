'use client'

import Link from 'next/link'
import { 
  Code, BookOpen, Users, Rocket, ChevronRight, Zap, Trophy, Bot, GraduationCap,
  Sparkles, Target, Award, GamepadIcon, LogOut, Star, Heart, Shield, TrendingUp,
  Globe, Clock, CheckCircle, ArrowRight, Play, Lightbulb, Brain, Gem, Crown,
  MessageCircle, ThumbsUp, Activity, BarChart3, DollarSign, School
} from 'lucide-react'

export default function HomePage() {
  // Show landing page for ALL users - no redirects, no authentication checks
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <Code className="h-8 w-8 text-blue-600 mr-2 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                CodeFly ✈️
              </h1>
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-gray-900 rounded-full animate-pulse">
                #1 in K-12
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/future-of-education" className="text-white/80 hover:text-white transition-colors duration-200 font-medium flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span>Vision</span>
              </Link>
              <Link href="/standards-compliance" className="text-white/80 hover:text-white transition-colors duration-200 font-medium flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Standards</span>
              </Link>
              <Link href="/course-overview" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                Curriculum
              </Link>
              <Link href="/teacher-benefits" className="text-white/80 hover:text-white transition-colors duration-200 font-medium flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Pricing</span>
              </Link>
              <Link href="/auth" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Main Content */}
        <div className="relative z-10">
              <div>
                {/* Hero Section */}
                <div className="text-center py-20 px-8">
                  {/* Trust Badges */}
                  <div className="flex justify-center items-center space-x-6 mb-8 animate-fade-in">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white font-semibold">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <School className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white font-semibold">127+ Schools</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white font-semibold">94% Completion</span>
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="inline-block relative">
                      <div className="absolute inset-0 animate-spin-slow">
                        <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-400" />
                        <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 text-purple-400" />
                        <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
                        <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-pink-400" />
                      </div>
                      <div className="text-8xl mb-6 animate-float">🚀</div>
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black mb-6">
                      <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
                        AI Education for
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
                        Every Age! ✈️
                      </span>
                    </h1>
                    <div className="flex justify-center items-center space-x-3 mb-6">
                      <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                      <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                        Complete AI Education Ecosystem: K-College+
                      </span>
                      <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                  
                  <p className="text-2xl text-gray-100 mb-4 max-w-4xl mx-auto font-medium">
                    From kindergarten to college, create AI-literate professionals with 
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">
                      story-driven games, real business partnerships, and Fortune 500 consulting! 
                    </span>
                  </p>
                  <p className="text-lg text-gray-300 mb-32 max-w-3xl mx-auto">
                    Age-appropriate games from Digi-Pet Academy (K-2) to CEO Academy (College+)
                    preparing students for high-paying AI careers starting at $100K+
                  </p>

                  {/* Age-Appropriate Games Showcase */}
                  <div className="max-w-7xl mx-auto mb-32">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">
                      The <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">Complete AI Education</span> Journey
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16 max-w-4xl mx-auto">
                      Five story-driven games, each perfectly designed for different age groups and skill levels
                    </p>
                    
                    {/* Top Row - 3 Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                      {/* Digi-Pet Academy (K-2) */}
                      <Link href="/games/digi-pet-academy" className="group relative block">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🧸</div>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <h3 className="text-2xl font-bold text-white">Digi-Pet Academy</h3>
                            </div>
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-pink-500 text-white text-sm font-bold rounded-full">Ages 5-8</span>
                            </div>
                            <p className="text-gray-300 text-base mb-4 leading-relaxed">
                              Take care of AI pet friends through simple drag-and-drop commands
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full">8 weeks</span>
                              <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full">Touch-friendly</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Magic School (3-5) */}
                      <Link href="/games/magic-school" className="group relative block">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🏰</div>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <h3 className="text-2xl font-bold text-white">Magic School</h3>
                            </div>
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-full">Ages 8-11</span>
                            </div>
                            <p className="text-gray-300 text-base mb-4 leading-relaxed">
                              Learn spell-coding as young wizards using block-based programming
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">12 weeks</span>
                              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">Scratch-like</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Space Academy (6-8) */}
                      <Link href="/games/space-academy" className="group relative block">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🚀</div>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <h3 className="text-2xl font-bold text-white">Space Academy</h3>
                            </div>
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">Ages 11-14</span>
                            </div>
                            <p className="text-gray-300 text-base mb-4 leading-relaxed">
                              Explore the galaxy with AI crew members learning Python and ethics
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">16 weeks</span>
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">AI ethics</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Bottom Row - 2 Cards Centered */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {/* Agent Academy (9-12) */}
                      <Link href="/games/agent-academy" className="group relative block">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/50 hover:border-green-400 transition-all duration-300 transform hover:scale-105 h-full ring-2 ring-yellow-400/50">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🕵️</div>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <h3 className="text-2xl font-bold text-white">Agent Academy</h3>
                              <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">CURRENT</span>
                            </div>
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">Ages 14-18</span>
                            </div>
                            <p className="text-gray-300 text-base mb-4 leading-relaxed">
                              Master AI agents for covert operations with professional development tools
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">18 weeks</span>
                              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">Professional IDE</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* CEO Academy (College+) */}
                      <Link href="/games/ceo-academy" className="group relative block">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                          <div className="text-center">
                            <div className="text-6xl mb-4">💼</div>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <h3 className="text-2xl font-bold text-white">CEO Academy</h3>
                              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">Fortune 500</span>
                            </div>
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-yellow-500 text-gray-900 text-sm font-bold rounded-full">Ages 18+</span>
                            </div>
                            <p className="text-gray-300 text-base mb-4 leading-relaxed">
                              Transform real Fortune 500 companies with AI leadership consulting
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full">20 weeks</span>
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full">C-suite access</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="text-center mt-12">
                      <Link
                        href="/course-overview"
                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105"
                      >
                        <GamepadIcon className="w-6 h-6" />
                        <span>Explore All Curriculum</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Educational Credentials Trust Section */}
                  <div className="mt-24 mb-16 p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="flex justify-center items-center space-x-4 mb-4">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <h2 className="text-3xl font-bold text-white">
                          Certified Educational Excellence
                        </h2>
                        <Award className="w-8 h-8 text-yellow-400" />
                      </div>
                      <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                        The <strong>first gamified coding platform</strong> to achieve full CSTA K-12 certification 
                        and approval in all <strong>50 states</strong> for graduation credit.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">CSTA</div>
                        <div className="text-sm text-gray-300">K-12 Certified</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
                        <Globe className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">50 States</div>
                        <div className="text-sm text-gray-300">Graduation Credit</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
                        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">23+</div>
                        <div className="text-sm text-gray-300">Standards Aligned</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
                        <School className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">100%</div>
                        <div className="text-sm text-gray-300">Compliance</div>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                          href="/standards-compliance"
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          <Award className="w-5 h-5" />
                          <span>View Full Certification Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link 
                          href="/standards-compliance"
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>See Game Examples & Standards</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                          href="/future-of-education"
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          <Brain className="w-5 h-5" />
                          <span>Explore Our K-12 Vision</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link 
                          href="/teacher-benefits"
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span>View Pricing & Benefits</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* School Administrator Section */}
                  <div className="mt-16 p-8 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-2xl border border-green-500/30 backdrop-blur-sm max-w-4xl mx-auto">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏫</div>
                      <h3 className="text-2xl font-bold text-green-400 mb-3">School Administrators & Teachers</h3>
                      <p className="text-gray-300 mb-6">
                        See how CodeFly transforms computer science education with 94% student completion rates, 
                        $60,000+ annual savings, and zero teacher training required.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          href="/auth"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-xl"
                        >
                          🚀 Get Started - Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-bold transition backdrop-blur-sm border border-white/20 transform hover:scale-105"
                        >
                          ✨ Create Account
                        </Link>
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        ✅ Used by 127+ schools nationwide • ✅ FERPA compliant • ✅ State standards aligned
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Section */}
                <div className="py-20 px-8 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center text-white mb-4">
                      The Numbers Speak for 
                      <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text"> Themselves</span>
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
                      Join the fastest-growing coding education platform that's revolutionizing how students learn to code
                    </p>
                    
                    <div className="grid md:grid-cols-4 gap-8">
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">94%</div>
                            <p className="text-gray-300 font-semibold">Completion Rate</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                            <School className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">127+</div>
                            <p className="text-gray-300 font-semibold">Schools Using CodeFly</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
                            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">50K+</div>
                            <p className="text-gray-300 font-semibold">Students Enrolled</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="relative inline-block mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30">
                            <Clock className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                            <div className="text-5xl font-black text-white mb-2">10hrs</div>
                            <p className="text-gray-300 font-semibold">Saved Per Week</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-20 px-8">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="text-5xl font-bold text-white mb-4">
                        Loved by <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Teachers & Students</span>
                      </h2>
                      <p className="text-xl text-gray-300">See why educators are switching to CodeFly</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-100 mb-6 italic">
                          "CodeFly transformed my classroom! Students are actually excited about homework now. 
                          The gamification keeps them engaged, and I save hours on grading every week."
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            JH
                          </div>
                          <div>
                            <p className="text-white font-semibold">Jessica Henderson</p>
                            <p className="text-gray-400 text-sm">9th Grade CS Teacher, Miami</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-100 mb-6 italic">
                          "The AI tutor is incredible! It helps me when I'm stuck without giving away the answer. 
                          I've gone from hating coding to building my own games!"
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            MR
                          </div>
                          <div>
                            <p className="text-white font-semibold">Marcus Robinson</p>
                            <p className="text-gray-400 text-sm">10th Grade Student, Atlanta</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-100 mb-6 italic">
                          "Our CS enrollment doubled after implementing CodeFly. Parents love seeing their kids' 
                          progress, and our test scores have improved significantly."
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            DP
                          </div>
                          <div>
                            <p className="text-white font-semibold">Dr. David Park</p>
                            <p className="text-gray-400 text-sm">Principal, Houston Academy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="py-20 px-8 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center text-white mb-4">
                      How CodeFly <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Works</span>
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
                      Get your classroom coding in minutes with our simple 3-step process
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-12">
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            1
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Quick Setup</h3>
                        <p className="text-gray-300">
                          Create your classroom in 5 minutes. Import student rosters with one click. 
                          No installation or IT support needed.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            2
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Students Learn & Play</h3>
                        <p className="text-gray-300">
                          Students login and start coding immediately. They earn XP, unlock badges, 
                          and compete on leaderboards while learning.
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-pink-500 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            3
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Track & Celebrate</h3>
                        <p className="text-gray-300">
                          Monitor progress in real-time. Automated grading saves hours. 
                          Celebrate achievements with built-in rewards system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 px-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-12 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                      <div className="relative z-10">
                        <h2 className="text-5xl font-bold text-white mb-6">
                          Ready to Transform Your Classroom?
                        </h2>
                        <p className="text-xl text-gray-100 mb-8">
                          Join 127+ schools already using CodeFly to make coding education magical
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/auth/signup"
                            className="bg-white text-purple-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
                          >
                            <DollarSign className="inline w-5 h-5 mr-2" />
                            Create Account
                          </Link>
                          <Link
                            href="/auth"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105 shadow-xl"
                          >
                            <Play className="inline w-5 h-5 mr-2" />
                            Sign In Now
                          </Link>
                        </div>
                        <p className="text-sm text-gray-200 mt-6">
                          ✓ No credit card required &nbsp; ✓ 30-day free trial &nbsp; ✓ Full support included
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}