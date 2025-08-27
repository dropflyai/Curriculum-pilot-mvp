'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Users, BookOpen, BarChart, MessageCircle, Settings, LogOut, Home, ChevronRight, Play, User, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import AIAssistant from '@/components/AIAssistant'

type DemoView = 'landing' | 'student' | 'teacher' | 'ai-analytics'

export default function InteractiveDemoPage() {
  const [currentView, setCurrentView] = useState<DemoView>('landing')
  const [userName, setUserName] = useState('Demo User')
  const [showWelcome, setShowWelcome] = useState(true)
  
  useEffect(() => {
    // Auto-hide welcome after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Demo Navigation Header
  const DemoHeader = ({ title, userType }: { title: string; userType?: string }) => (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentView('landing')}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            <Home className="w-5 h-5" />
          </button>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {userType && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                {userType === 'student' ? 'SC' : 'MJ'}
              </div>
              <span className="text-gray-300">{userType === 'student' ? 'Sarah Chen' : 'Ms. Johnson'}</span>
            </div>
          )}
          <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm">
            🎭 DEMO MODE
          </div>
        </div>
      </div>
    </div>
  )

  // Landing/Menu Page
  const LandingView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-6 py-12">
        
        {/* Welcome Banner */}
        {showWelcome && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-green-400 mb-2">🎉 Welcome to the Interactive Demo!</h2>
                <p className="text-gray-300">Explore the full CodeFly platform from student, teacher, and admin perspectives.</p>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeFly Interactive Demo ✈️
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the complete CodeFly platform. Navigate through student dashboards, teacher management tools, 
            and see our AI assistant in action - all with realistic data and interactions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          
          {/* Student Experience */}
          <div className="bg-white/5 rounded-xl p-8 border border-blue-500/30 hover:border-blue-500/50 transition group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Student Experience</h3>
              <p className="text-gray-300 mb-6">
                See the gamified learning environment with assignments, XP system, achievements, and AI assistance.
              </p>
              <button 
                onClick={() => setCurrentView('student')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg py-3 px-6 hover:from-blue-600 hover:to-purple-700 transition flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Enter Student Dashboard</span>
              </button>
            </div>
          </div>

          {/* Teacher Experience */}
          <div className="bg-white/5 rounded-xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Teacher Dashboard</h3>
              <p className="text-gray-300 mb-6">
                Explore classroom management, real-time student monitoring, grading, and AI teaching insights.
              </p>
              <button 
                onClick={() => setCurrentView('teacher')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg py-3 px-6 hover:from-purple-600 hover:to-pink-700 transition flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Enter Teacher Portal</span>
              </button>
            </div>
          </div>

          {/* AI Analytics */}
          <div className="bg-white/5 rounded-xl p-8 border border-cyan-500/30 hover:border-cyan-500/50 transition group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Analytics</h3>
              <p className="text-gray-300 mb-6">
                Comprehensive AI teaching assistant analytics and impact metrics for administrators.
              </p>
              <button 
                onClick={() => setCurrentView('ai-analytics')}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg py-3 px-6 hover:from-cyan-600 hover:to-teal-700 transition flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>View AI Insights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-12 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">📋 Demo Instructions</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <div className="text-blue-400 font-semibold mb-2">Student Experience</div>
              <ul className="space-y-1">
                <li>• View assignments and grades</li>
                <li>• See XP system and achievements</li>
                <li>• Chat with AI assistant</li>
                <li>• Explore gamified learning</li>
              </ul>
            </div>
            <div>
              <div className="text-purple-400 font-semibold mb-2">Teacher Dashboard</div>
              <ul className="space-y-1">
                <li>• Monitor student progress</li>
                <li>• View class analytics</li>
                <li>• See AI intervention insights</li>
                <li>• Review grade book</li>
              </ul>
            </div>
            <div>
              <div className="text-cyan-400 font-semibold mb-2">AI Analytics</div>
              <ul className="space-y-1">
                <li>• Comprehensive AI metrics</li>
                <li>• Teaching impact analysis</li>
                <li>• Performance statistics</li>
                <li>• Cost-benefit insights</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Sales Demo */}
        <div className="text-center mt-8">
          <Link 
            href="/demo"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Sales Demo</span>
          </Link>
        </div>
      </div>
    </div>
  )

  // Student Dashboard View
  const StudentView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <DemoHeader title="Student Dashboard" userType="student" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold">
              SC
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Welcome back, Sarah Chen! ✈️</h2>
              <p className="text-purple-300">Ready to continue your coding adventure?</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-purple-400">2,450 XP</div>
            <div className="text-sm text-gray-400">Level 5 Coder</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">8/10</div>
              <div className="text-sm text-gray-400">Assignments Done</div>
              <div className="mt-2 bg-blue-900/50 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">94%</div>
              <div className="text-sm text-gray-400">Average Grade</div>
              <div className="text-xs text-green-300 mt-1">Excellent work!</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">12 🔥</div>
              <div className="text-sm text-gray-400">Day Streak</div>
              <div className="text-xs text-purple-300 mt-1">On fire!</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">15.2h</div>
              <div className="text-sm text-gray-400">Time Coding</div>
              <div className="text-xs text-orange-300 mt-1">This week</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Assignments */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                📚 Current Assignments
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold text-white">Python Lists & Loops</div>
                      <div className="text-sm text-gray-400">Due: Tomorrow 11:59 PM • 85% complete</div>
                      <div className="text-xs text-orange-400 mt-1">Currently working on this</div>
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition">
                    Continue
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-white">Quiz: Functions & Parameters</div>
                      <div className="text-sm text-gray-400">Due: Friday 3:00 PM • Not started</div>
                      <div className="text-xs text-red-400 mt-1">Needs attention</div>
                    </div>
                  </div>
                  <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                    Start
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-white">Variables & User Input</div>
                      <div className="text-sm text-gray-400">Submitted: 2 days ago</div>
                      <div className="text-xs text-green-400 mt-1">Grade: 96/100 - Excellent work!</div>
                    </div>
                  </div>
                  <button className="bg-white/10 px-4 py-2 rounded-lg text-gray-300 hover:bg-white/20 transition">
                    Review
                  </button>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
              <h3 className="text-xl font-bold text-white mb-6">🏆 Recent Achievements</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  { name: 'First Steps', emoji: '🌱', earned: true },
                  { name: 'Code Master', emoji: '💻', earned: true },
                  { name: 'Quiz Champion', emoji: '🧠', earned: true },
                  { name: 'Speed Coder', emoji: '⚡', earned: true },
                  { name: 'Debug Detective', emoji: '🔍', earned: true },
                  { name: 'Python Ninja', emoji: '🐍', earned: false }
                ].map((achievement, i) => (
                  <div key={i} className={`bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition ${achievement.earned ? 'border border-yellow-500/30' : 'grayscale opacity-50'}`}>
                    <div className="text-2xl mb-1">{achievement.emoji}</div>
                    <div className="text-xs text-gray-300">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Up */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">⏰ Next Up</h3>
              <div className="space-y-3">
                <div className="text-orange-400 font-semibold">Lists & Loops</div>
                <div className="text-gray-300 text-sm">Continue where you left off with problem #4</div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 rounded-lg py-2 hover:from-orange-600 hover:to-red-600 transition">
                  Resume Coding
                </button>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">📈 This Week</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Lessons Completed</span>
                  <span className="text-green-400 font-semibold">3/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coding Time</span>
                  <span className="text-blue-400 font-semibold">15.2h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Earned</span>
                  <span className="text-purple-400 font-semibold">450</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">🚀 Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg py-2 transition">
                  Practice Problems
                </button>
                <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg py-2 transition">
                  Review Notes
                </button>
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg py-2 transition">
                  Take Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant studentName="Sarah Chen" lessonTitle="Python Lists & Loops" />
    </div>
  )

  // Teacher Dashboard View  
  const TeacherView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <DemoHeader title="Teacher Dashboard" userType="teacher" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">👩‍🏫 Ms. Johnson's Period 3</h2>
            <p className="text-purple-300">Computer Science - 9th Grade</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">23 students online</span>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
              <span className="text-blue-400">Current: Lists & Loops</span>
            </div>
          </div>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">23/25</div>
              <div className="text-sm text-gray-400">Students Active</div>
              <div className="text-xs text-blue-300 mt-1">↗ +2 since last class</div>
            </div>
          </div>
          <div className="bg-green-500/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">18</div>
              <div className="text-sm text-gray-400">Assignments Done</div>
              <div className="text-xs text-green-300 mt-1">72% completion rate</div>
            </div>
          </div>
          <div className="bg-yellow-500/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">5</div>
              <div className="text-sm text-gray-400">Need Help</div>
              <div className="text-xs text-yellow-300 mt-1">AI assisting</div>
            </div>
          </div>
          <div className="bg-purple-500/20 rounded-xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">89%</div>
              <div className="text-sm text-gray-400">Class Average</div>
              <div className="text-xs text-purple-300 mt-1">Above target</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Student Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">👥 Live Student Activity</h3>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', status: 'active', lesson: 'Lists & Loops', progress: '85%', activity: 'Working on problem #4', color: 'green' },
                  { name: 'Michael Rodriguez', status: 'stuck', lesson: 'Lists & Loops', progress: '45%', activity: '⚠️ Stuck on indexing for 8 min', color: 'yellow' },
                  { name: 'Emma Wilson', status: 'active', lesson: 'Lists & Loops', progress: '92%', activity: 'Almost finished!', color: 'green' },
                  { name: 'David Park', status: 'completed', lesson: 'Lists & Loops', progress: '100%', activity: '✅ Assignment completed', color: 'blue' },
                  { name: 'Maya Patel', status: 'reading', lesson: 'Lists & Loops', progress: '12%', activity: 'Reading lesson content', color: 'blue' },
                  { name: 'Alex Johnson', status: 'stuck', lesson: 'Lists & Loops', progress: '38%', activity: '⚠️ Multiple syntax errors', color: 'red' }
                ].map((student, i) => (
                  <div key={i} className={`bg-white/5 rounded-lg p-4 border-l-4 ${
                    student.color === 'green' ? 'border-green-500 hover:bg-green-500/10' :
                    student.color === 'yellow' ? 'border-yellow-500 hover:bg-yellow-500/10' :
                    student.color === 'red' ? 'border-red-500 hover:bg-red-500/10' :
                    'border-blue-500 hover:bg-blue-500/10'
                  } hover:bg-white/10 transition cursor-pointer`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          student.color === 'green' ? 'bg-green-500 animate-pulse' :
                          student.color === 'yellow' ? 'bg-yellow-500 animate-bounce' :
                          student.color === 'red' ? 'bg-red-500 animate-pulse' :
                          'bg-blue-500'
                        }`}></div>
                        <div>
                          <div className="font-semibold text-white">{student.name}</div>
                          <div className="text-sm text-gray-400">{student.activity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">{student.progress}</div>
                        <div className="text-xs text-gray-500">Progress</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">
                  Message Class
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg transition">
                  Send Hint
                </button>
                <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition">
                  Start Screen Share
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Status */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">📋 Current Assignment</h3>
              <div className="text-purple-400 font-semibold mb-2">Python Lists & Loops</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Due</span>
                  <span className="text-orange-400">Tomorrow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400">18/25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Score</span>
                  <span className="text-blue-400">92/100</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg py-2 transition">
                  Grade Book
                </button>
                <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg py-2 transition">
                  Create Assignment
                </button>
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg py-2 transition">
                  Parent Reports
                </button>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">🤖 AI Insights</h3>
              <div className="space-y-4">
                <div className="bg-cyan-500/10 rounded-lg p-3">
                  <div className="text-cyan-400 text-sm font-semibold">This Hour</div>
                  <div className="text-white font-bold">47 AI Interactions</div>
                  <div className="text-gray-400 text-xs">12 students helped</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                  <div className="text-green-400 text-sm font-semibold">💡 Recommendation</div>
                  <div className="text-gray-300 text-sm mt-1">
                    8 students struggling with IndexError. Consider a quick review.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // AI Analytics View
  const AIAnalyticsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-teal-900">
      <DemoHeader title="AI Teaching Assistant Analytics" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">🤖 AI Teaching Assistant Impact</h2>
          <p className="text-cyan-300">Comprehensive analytics and performance metrics</p>
        </div>
        
        <AIAssistant showAnalytics={true} />
        
        {/* Additional Admin Insights */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">📊 Implementation Benefits</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">Cost Savings</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Reduced TA Hours</span>
                  <span className="text-green-400">-$12,000/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Improved Retention</span>
                  <span className="text-green-400">+$45,000/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Teacher Efficiency</span>
                  <span className="text-green-400">+40 hrs/month</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-4">Educational Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Student Satisfaction</span>
                  <span className="text-green-400">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Completion Rate</span>
                  <span className="text-green-400">+42%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Grade Improvement</span>
                  <span className="text-green-400">+18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render based on current view
  switch(currentView) {
    case 'student':
      return <StudentView />
    case 'teacher':
      return <TeacherView />
    case 'ai-analytics':
      return <AIAnalyticsView />
    default:
      return <LandingView />
  }
}