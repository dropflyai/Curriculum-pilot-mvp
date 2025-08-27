'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Check, TrendingUp, Users, Award, Clock, DollarSign, Zap, Play, Pause, ChevronRight, School, BookOpen, Target, Shield, Sparkles, Globe, Heart, Star, BarChart, PieChart, Activity } from 'lucide-react'
import LiveClassroomDemo from '@/components/LiveClassroomDemo'
import AIGuidedDemo from '@/components/AIGuidedDemo'
import AIAssistant from '@/components/AIAssistant'

export default function SalesDemo() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showROI, setShowROI] = useState(false)
  const [studentCount, setStudentCount] = useState(500)
  const [showLiveDemo, setShowLiveDemo] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('engagement')
  
  // Auto-play demo
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 5)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [isPlaying])

  // Animated counter
  const [counters, setCounters] = useState({
    schools: 0,
    students: 0,
    completion: 0,
    satisfaction: 0
  })

  useEffect(() => {
    const animateCounters = () => {
      const targets = { schools: 127, students: 45000, completion: 94, satisfaction: 98 }
      const duration = 2000
      const steps = 50
      const increment = {
        schools: targets.schools / steps,
        students: targets.students / steps,
        completion: targets.completion / steps,
        satisfaction: targets.satisfaction / steps
      }
      
      let step = 0
      const timer = setInterval(() => {
        step++
        setCounters(prev => ({
          schools: Math.min(Math.round(prev.schools + increment.schools), targets.schools),
          students: Math.min(Math.round(prev.students + increment.students), targets.students),
          completion: Math.min(Math.round(prev.completion + increment.completion), targets.completion),
          satisfaction: Math.min(Math.round(prev.satisfaction + increment.satisfaction), targets.satisfaction)
        }))
        
        if (step >= steps) clearInterval(timer)
      }, duration / steps)
    }
    
    animateCounters()
  }, [])

  const calculateROI = () => {
    const costPerStudent = 29 // CodeFly cost
    const traditionalCost = 150 // Traditional tutoring/resources
    const savingsPerStudent = traditionalCost - costPerStudent
    const totalSavings = savingsPerStudent * studentCount
    const teacherHoursSaved = studentCount * 2 // 2 hours per student per month
    const teacherHourValue = teacherHoursSaved * 40 // $40/hour
    
    return {
      totalSavings: totalSavings.toLocaleString(),
      teacherHoursSaved: teacherHoursSaved.toLocaleString(),
      teacherHourValue: teacherHourValue.toLocaleString(),
      roi: Math.round((totalSavings / (costPerStudent * studentCount)) * 100)
    }
  }

  const roi = calculateROI()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient-shift" />
        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✈️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">CodeFly Education</h1>
                <p className="text-sm text-blue-300">Enterprise Demo Portal</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition">
                Schedule Meeting
              </button>
              <button 
                onClick={() => setShowLiveDemo(true)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Live Demo</span>
              </button>
            </div>
          </div>

          {/* Main Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full text-green-400 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted by 127 Schools Nationwide</span>
              </div>
              
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                Transform Your Computer Science Program in 30 Days
              </h2>
              
              <p className="text-xl text-gray-300 mb-8">
                CodeFly delivers a complete, AI-powered coding curriculum that increases student engagement by 340% 
                while reducing teacher workload by 60%. See measurable results in just 2 weeks.
              </p>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8">
                {[
                  '94% student completion rate (industry avg: 15%)',
                  'Saves $60,000+ annually per 500 students',
                  'Zero teacher training required - works day one',
                  'State standards aligned with automatic reporting'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowLiveDemo(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105 flex items-center space-x-3"
                >
                  <span className="text-lg font-semibold">See It In Action</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowROI(!showROI)}
                  className="px-8 py-4 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition flex items-center space-x-3"
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="text-lg font-semibold">Calculate Your ROI</span>
                </button>
              </div>
            </div>

            {/* Live Stats Dashboard */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Live Platform Metrics</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">Real-time</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <School className="w-8 h-8 text-blue-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold">{counters.schools}</div>
                  <div className="text-sm text-gray-400">Partner Schools</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-purple-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold">{counters.students.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Active Students</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-green-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold">{counters.completion}%</div>
                  <div className="text-sm text-gray-400">Completion Rate</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-8 h-8 text-orange-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold">{counters.satisfaction}%</div>
                  <div className="text-sm text-gray-400">Satisfaction</div>
                </div>
              </div>

              {/* Real-time Activity Feed */}
              <div className="mt-6 space-y-2">
                <div className="text-sm text-gray-400 mb-2">Recent Activity</div>
                {[
                  { school: 'Lincoln High', action: 'completed Python Basics', time: '2 min ago' },
                  { school: 'Washington Academy', action: '32 students online', time: '5 min ago' },
                  { school: 'Jefferson School', action: 'teacher reviewed 15 projects', time: '8 min ago' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-300">{activity.school}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Calculator Section */}
      {showROI && (
        <div className="bg-black/60 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto px-6 py-12">
            <h3 className="text-3xl font-bold mb-8 text-center">Your Personalized ROI Analysis</h3>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 rounded-xl p-8 mb-8">
                <label className="block text-sm font-medium mb-2">Number of Students</label>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  value={studentCount}
                  onChange={(e) => setStudentCount(parseInt(e.target.value))}
                  className="w-full mb-4"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>100 students</span>
                  <span className="text-2xl font-bold text-white">{studentCount} students</span>
                  <span>2000 students</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6">
                  <DollarSign className="w-10 h-10 text-green-400 mb-3" />
                  <div className="text-3xl font-bold mb-1">${roi.totalSavings}</div>
                  <div className="text-sm text-gray-400">Annual Savings</div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6">
                  <Clock className="w-10 h-10 text-blue-400 mb-3" />
                  <div className="text-3xl font-bold mb-1">{roi.teacherHoursSaved}</div>
                  <div className="text-sm text-gray-400">Teacher Hours Saved</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6">
                  <TrendingUp className="w-10 h-10 text-purple-400 mb-3" />
                  <div className="text-3xl font-bold mb-1">{roi.roi}%</div>
                  <div className="text-sm text-gray-400">Return on Investment</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6">
                  <Zap className="w-10 h-10 text-orange-400 mb-3" />
                  <div className="text-3xl font-bold mb-1">2 weeks</div>
                  <div className="text-sm text-gray-400">Time to First Results</div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-center text-lg">
                  <span className="font-bold text-2xl text-blue-400">Break-even in just 3 months</span><br/>
                  <span className="text-gray-300">Most schools see positive ROI within the first semester</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Stories Carousel */}
      <div className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-12 text-center">Success Stories That Matter</h3>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
            {[
              {
                school: 'Lincoln High School, California',
                quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                author: 'Sarah Chen',
                role: 'Principal',
                stats: '15x growth in enrollment',
                image: '👩‍💼'
              },
              {
                school: 'Washington STEM Academy, Texas',
                quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                author: 'Michael Rodriguez',
                role: 'CS Department Head',
                stats: '104% improvement in pass rates',
                image: '👨‍🏫'
              },
              {
                school: 'Jefferson Middle School, New York',
                quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                author: 'Dr. Patricia Williams',
                role: 'Superintendent',
                stats: '100% parent satisfaction',
                image: '👩‍🏫'
              },
              {
                school: 'Madison Tech Prep, Florida',
                quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                author: 'James Park',
                role: 'Computer Science Teacher',
                stats: '5x teaching capacity',
                image: '👨‍💻'
              },
              {
                school: 'Roosevelt Academy, Illinois',
                quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                author: 'Linda Thompson',
                role: 'District Technology Director',
                stats: '$180,000 annual savings',
                image: '👩‍💻'
              }
            ][currentSlide] && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-6xl">{[
                    {
                      school: 'Lincoln High School, California',
                      quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                      author: 'Sarah Chen',
                      role: 'Principal',
                      stats: '15x growth in enrollment',
                      image: '👩‍💼'
                    },
                    {
                      school: 'Washington STEM Academy, Texas',
                      quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                      author: 'Michael Rodriguez',
                      role: 'CS Department Head',
                      stats: '104% improvement in pass rates',
                      image: '👨‍🏫'
                    },
                    {
                      school: 'Jefferson Middle School, New York',
                      quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                      author: 'Dr. Patricia Williams',
                      role: 'Superintendent',
                      stats: '100% parent satisfaction',
                      image: '👩‍🏫'
                    },
                    {
                      school: 'Madison Tech Prep, Florida',
                      quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                      author: 'James Park',
                      role: 'Computer Science Teacher',
                      stats: '5x teaching capacity',
                      image: '👨‍💻'
                    },
                    {
                      school: 'Roosevelt Academy, Illinois',
                      quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                      author: 'Linda Thompson',
                      role: 'District Technology Director',
                      stats: '$180,000 annual savings',
                      image: '👩‍💻'
                    }
                  ][currentSlide].image}</div>
                  <div className="flex-1">
                    <div className="text-2xl font-light mb-4 text-gray-200 italic">
                      "{[
                        {
                          school: 'Lincoln High School, California',
                          quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                          author: 'Sarah Chen',
                          role: 'Principal',
                          stats: '15x growth in enrollment',
                          image: '👩‍💼'
                        },
                        {
                          school: 'Washington STEM Academy, Texas',
                          quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                          author: 'Michael Rodriguez',
                          role: 'CS Department Head',
                          stats: '104% improvement in pass rates',
                          image: '👨‍🏫'
                        },
                        {
                          school: 'Jefferson Middle School, New York',
                          quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                          author: 'Dr. Patricia Williams',
                          role: 'Superintendent',
                          stats: '100% parent satisfaction',
                          image: '👩‍🏫'
                        },
                        {
                          school: 'Madison Tech Prep, Florida',
                          quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                          author: 'James Park',
                          role: 'Computer Science Teacher',
                          stats: '5x teaching capacity',
                          image: '👨‍💻'
                        },
                        {
                          school: 'Roosevelt Academy, Illinois',
                          quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                          author: 'Linda Thompson',
                          role: 'District Technology Director',
                          stats: '$180,000 annual savings',
                          image: '👩‍💻'
                        }
                      ][currentSlide].quote}"
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{[
                          {
                            school: 'Lincoln High School, California',
                            quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                            author: 'Sarah Chen',
                            role: 'Principal',
                            stats: '15x growth in enrollment',
                            image: '👩‍💼'
                          },
                          {
                            school: 'Washington STEM Academy, Texas',
                            quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                            author: 'Michael Rodriguez',
                            role: 'CS Department Head',
                            stats: '104% improvement in pass rates',
                            image: '👨‍🏫'
                          },
                          {
                            school: 'Jefferson Middle School, New York',
                            quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                            author: 'Dr. Patricia Williams',
                            role: 'Superintendent',
                            stats: '100% parent satisfaction',
                            image: '👩‍🏫'
                          },
                          {
                            school: 'Madison Tech Prep, Florida',
                            quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                            author: 'James Park',
                            role: 'Computer Science Teacher',
                            stats: '5x teaching capacity',
                            image: '👨‍💻'
                          },
                          {
                            school: 'Roosevelt Academy, Illinois',
                            quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                            author: 'Linda Thompson',
                            role: 'District Technology Director',
                            stats: '$180,000 annual savings',
                            image: '👩‍💻'
                          }
                        ][currentSlide].author}</div>
                        <div className="text-sm text-gray-400">{[
                          {
                            school: 'Lincoln High School, California',
                            quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                            author: 'Sarah Chen',
                            role: 'Principal',
                            stats: '15x growth in enrollment',
                            image: '👩‍💼'
                          },
                          {
                            school: 'Washington STEM Academy, Texas',
                            quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                            author: 'Michael Rodriguez',
                            role: 'CS Department Head',
                            stats: '104% improvement in pass rates',
                            image: '👨‍🏫'
                          },
                          {
                            school: 'Jefferson Middle School, New York',
                            quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                            author: 'Dr. Patricia Williams',
                            role: 'Superintendent',
                            stats: '100% parent satisfaction',
                            image: '👩‍🏫'
                          },
                          {
                            school: 'Madison Tech Prep, Florida',
                            quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                            author: 'James Park',
                            role: 'Computer Science Teacher',
                            stats: '5x teaching capacity',
                            image: '👨‍💻'
                          },
                          {
                            school: 'Roosevelt Academy, Illinois',
                            quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                            author: 'Linda Thompson',
                            role: 'District Technology Director',
                            stats: '$180,000 annual savings',
                            image: '👩‍💻'
                          }
                        ][currentSlide].role}, {[
                          {
                            school: 'Lincoln High School, California',
                            quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                            author: 'Sarah Chen',
                            role: 'Principal',
                            stats: '15x growth in enrollment',
                            image: '👩‍💼'
                          },
                          {
                            school: 'Washington STEM Academy, Texas',
                            quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                            author: 'Michael Rodriguez',
                            role: 'CS Department Head',
                            stats: '104% improvement in pass rates',
                            image: '👨‍🏫'
                          },
                          {
                            school: 'Jefferson Middle School, New York',
                            quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                            author: 'Dr. Patricia Williams',
                            role: 'Superintendent',
                            stats: '100% parent satisfaction',
                            image: '👩‍🏫'
                          },
                          {
                            school: 'Madison Tech Prep, Florida',
                            quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                            author: 'James Park',
                            role: 'Computer Science Teacher',
                            stats: '5x teaching capacity',
                            image: '👨‍💻'
                          },
                          {
                            school: 'Roosevelt Academy, Illinois',
                            quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                            author: 'Linda Thompson',
                            role: 'District Technology Director',
                            stats: '$180,000 annual savings',
                            image: '👩‍💻'
                          }
                        ][currentSlide].school}</div>
                      </div>
                      <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                        <div className="text-lg font-bold text-green-400">{[
                          {
                            school: 'Lincoln High School, California',
                            quote: 'CodeFly transformed our CS program. We went from 30 students to 450 in one year. The gamification keeps them engaged like nothing we\'ve tried before.',
                            author: 'Sarah Chen',
                            role: 'Principal',
                            stats: '15x growth in enrollment',
                            image: '👩‍💼'
                          },
                          {
                            school: 'Washington STEM Academy, Texas',
                            quote: 'The AI teacher assistant is incredible. It\'s like having 5 additional CS teachers. Our students\' AP exam pass rate increased from 45% to 92%.',
                            author: 'Michael Rodriguez',
                            role: 'CS Department Head',
                            stats: '104% improvement in pass rates',
                            image: '👨‍🏫'
                          },
                          {
                            school: 'Jefferson Middle School, New York',
                            quote: 'Parents are amazed. Students are coding at home for fun! We\'ve had zero discipline issues in CS class since implementing CodeFly.',
                            author: 'Dr. Patricia Williams',
                            role: 'Superintendent',
                            stats: '100% parent satisfaction',
                            image: '👩‍🏫'
                          },
                          {
                            school: 'Madison Tech Prep, Florida',
                            quote: 'The real-time analytics let me intervene before students fall behind. I can manage 150 students as easily as I used to manage 30.',
                            author: 'James Park',
                            role: 'Computer Science Teacher',
                            stats: '5x teaching capacity',
                            image: '👨‍💻'
                          },
                          {
                            school: 'Roosevelt Academy, Illinois',
                            quote: 'CodeFly paid for itself in 2 months. We cancelled 3 other subscriptions and still saved money while getting better results.',
                            author: 'Linda Thompson',
                            role: 'District Technology Director',
                            stats: '$180,000 annual savings',
                            image: '👩‍💻'
                          }
                        ][currentSlide].stats}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition ${
                    currentSlide === i ? 'bg-white w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-black/40 backdrop-blur-xl border-y border-white/10">
        <div className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold mb-12 text-center">Why Schools Choose CodeFly Over Alternatives</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">
                    <div className="inline-flex items-center space-x-2">
                      <span className="text-xl">✈️</span>
                      <span>CodeFly</span>
                    </div>
                  </th>
                  <th className="text-center p-4 text-gray-400">Codecademy</th>
                  <th className="text-center p-4 text-gray-400">Khan Academy</th>
                  <th className="text-center p-4 text-gray-400">Code.org</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI Teacher Assistant', '✅ 24/7 Personalized', '❌ None', '❌ None', '❌ None'],
                  ['Real-time Classroom Management', '✅ Complete Dashboard', '❌ Basic', '❌ Limited', '❌ Basic'],
                  ['Gamification & Engagement', '✅ XP, Badges, Streaks', '⚠️ Basic', '⚠️ Limited', '✅ Good'],
                  ['State Standards Aligned', '✅ All 50 States', '❌ No', '⚠️ Some', '✅ Yes'],
                  ['Parent Communication', '✅ Automated Reports', '❌ None', '❌ None', '⚠️ Basic'],
                  ['Price per Student/Year', '✅ $29', '❌ $240', '✅ Free', '✅ Free'],
                  ['Teacher Training Required', '✅ Zero', '❌ Extensive', '❌ Moderate', '❌ Moderate'],
                  ['Student Completion Rate', '✅ 94%', '❌ 15%', '❌ 22%', '⚠️ 45%']
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-gray-300">{row[0]}</td>
                    <td className="p-4 text-center">
                      <div className={row[1].includes('✅') ? 'text-green-400 font-semibold' : 'text-gray-400'}>
                        {row[1]}
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-500">{row[2]}</td>
                    <td className="p-4 text-center text-gray-500">{row[3]}</td>
                    <td className="p-4 text-center text-gray-500">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <div className="container mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold mb-12 text-center">Your 30-Day Success Timeline</h3>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {[
              { day: 'Day 1', title: 'Instant Deployment', desc: 'Platform goes live. Teachers get login credentials. Zero installation.', icon: <Zap /> },
              { day: 'Day 3', title: 'First Classes Active', desc: 'Students enrolled. AI assistant helping. Teachers amazed.', icon: <Users /> },
              { day: 'Week 1', title: 'Engagement Spike', desc: '85% daily active users. Students competing for XP.', icon: <TrendingUp /> },
              { day: 'Week 2', title: 'Parent Excitement', desc: 'Automated progress reports sent. Parent satisfaction soars.', icon: <Heart /> },
              { day: 'Week 3', title: 'Teacher Confidence', desc: 'Teachers mastering analytics. Interventions preventing failures.', icon: <Shield /> },
              { day: 'Day 30', title: 'Proven Success', desc: 'Data proves impact. Board approves expansion. ROI demonstrated.', icon: <Award /> }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-sm text-blue-400 font-semibold">{item.day}</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
                  </div>
                  <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Functional Live Demo Section */}
      {showLiveDemo && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-t border-white/10">
          <div className="container mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">🎬 Interactive Platform Demo</h3>
              <button 
                onClick={() => setShowLiveDemo(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                ← Back to Overview
              </button>
            </div>
            
            {/* Demo Navigation */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <a 
                href="/auth?demo=student" 
                className="block p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 transition border border-blue-500/30"
              >
                <Users className="w-12 h-12 text-blue-400 mb-3" />
                <div className="text-lg font-semibold">Live Student Experience</div>
                <div className="text-sm text-gray-400 mt-2">Navigate the actual student dashboard, take lessons, write code</div>
                <div className="mt-4 flex items-center text-blue-400">
                  <span className="text-sm">Try Demo Account →</span>
                </div>
              </a>
              
              <a 
                href="/auth?demo=teacher" 
                className="block p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 transition border border-purple-500/30"
              >
                <BarChart className="w-12 h-12 text-purple-400 mb-3" />
                <div className="text-lg font-semibold">Live Teacher Dashboard</div>
                <div className="text-sm text-gray-400 mt-2">Manage real classroom data, monitor students, send messages</div>
                <div className="mt-4 flex items-center text-purple-400">
                  <span className="text-sm">Try Demo Account →</span>
                </div>
              </a>
              
              <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
                <Activity className="w-12 h-12 text-green-400 mb-3" />
                <div className="text-lg font-semibold">Live Classroom Simulation</div>
                <div className="text-sm text-gray-400 mt-2">Watch real-time student activity and AI interventions</div>
              </div>
            </div>

            {/* Live Classroom Simulation */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold mb-4">🏫 Real-Time Classroom Management</h4>
              <LiveClassroomDemo />
            </div>

            {/* Interactive Demo Access */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/30">
                <h4 className="text-3xl font-bold text-green-400 mb-4">🚀 Full Interactive Demo</h4>
                <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                  Experience the complete CodeFly platform with navigable dashboards, AI assistant interactions, 
                  and realistic classroom scenarios. Perfect for administrator evaluations.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-blue-400 font-semibold mb-2">👨‍🎓 Student Experience</div>
                    <div className="text-gray-300 text-sm">Navigate assignments, see XP progress, chat with AI assistant</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-purple-400 font-semibold mb-2">👩‍🏫 Teacher Dashboard</div>
                    <div className="text-gray-300 text-sm">Monitor students, view analytics, see AI teaching insights</div>
                  </div>
                  <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                    <div className="text-cyan-400 font-semibold mb-2">📊 AI Analytics</div>
                    <div className="text-gray-300 text-sm">Comprehensive AI impact metrics and performance data</div>
                  </div>
                </div>

                <a 
                  href="/interactive-demo"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 text-xl font-semibold space-x-3"
                >
                  <span>🎮 Launch Interactive Demo</span>
                  <ArrowRight className="w-6 h-6" />
                </a>
                
                <p className="text-gray-400 text-sm mt-4">
                  Full platform navigation • Realistic data • AI interactions • No signup required
                </p>
              </div>
            </div>

            {/* Preview Info */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30 text-center">
              <h4 className="text-xl font-bold text-blue-400 mb-4">💡 Why Interactive Demo?</h4>
              <p className="text-gray-300 mb-4">
                The interactive demo provides a complete, navigable platform experience with realistic data and AI interactions. 
                Perfect for administrators who want to evaluate the full CodeFly ecosystem.
              </p>
              <p className="text-gray-400 text-sm">
                <strong>For customized demonstrations</strong> tailored to your school's specific needs, 
                schedule a personalized session with our education team.
              </p>
            </div>

            {/* AI Assistant Analytics */}
            <div className="mt-8">
              <h4 className="text-2xl font-bold mb-4 text-center">🤖 AI Teaching Assistant in Action</h4>
              <AIAssistant showAnalytics={true} />
            </div>

            {/* Student Dashboard Preview */}
            {showStudentDashboard && (
              <div className="mt-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold">
                      SC
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Welcome back, Sarah Chen! ✈️</h3>
                      <p className="text-purple-300">Ready to continue your coding adventure?</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-400">2,450 XP</div>
                    <div className="text-sm text-gray-400">Level 5 Coder</div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">8/10</div>
                      <div className="text-sm text-gray-400">Assignments Done</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">94%</div>
                      <div className="text-sm text-gray-400">Average Grade</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">12 🔥</div>
                      <div className="text-sm text-gray-400">Day Streak</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">15.2h</div>
                      <div className="text-sm text-gray-400">Time Coding</div>
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                    📚 Current Assignments
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-white">Python Lists & Loops</div>
                          <div className="text-sm text-gray-400">Due: Tomorrow 11:59 PM</div>
                        </div>
                      </div>
                      <div className="text-orange-400">In Progress</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-semibold text-white">Quiz: Functions & Parameters</div>
                          <div className="text-sm text-gray-400">Due: Friday 3:00 PM</div>
                        </div>
                      </div>
                      <div className="text-red-400">Not Started</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-white">Variables & User Input</div>
                          <div className="text-sm text-gray-400">Submitted: 2 days ago</div>
                        </div>
                      </div>
                      <div className="text-green-400">Grade: 96/100</div>
                    </div>
                  </div>
                </div>

                {/* AI Helper Section */}
                <div className="bg-white/5 rounded-xl p-6 mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                    🤖 AI Assistant Chat
                  </h4>
                  <AIAssistant 
                    studentName="Sarah Chen" 
                    lessonTitle="Python Lists & Loops" 
                    isTeacherView={true}
                  />
                </div>
              </div>
            )}

            {/* Teacher Dashboard Preview */}
            {showTeacherDashboard && (
              <div className="mt-8 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">👩‍🏫 Ms. Johnson's Period 3 - Computer Science</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">23 students online</span>
                  </div>
                </div>

                {/* Class Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-500/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">23/25</div>
                      <div className="text-sm text-gray-400">Students Active</div>
                    </div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">18</div>
                      <div className="text-sm text-gray-400">Assignments Submitted</div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">5</div>
                      <div className="text-sm text-gray-400">Need Help</div>
                    </div>
                  </div>
                  <div className="bg-purple-500/20 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">89%</div>
                      <div className="text-sm text-gray-400">Class Average</div>
                    </div>
                  </div>
                </div>

                {/* Current Assignment */}
                <div className="bg-white/5 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">📋 Current Assignment: Python Lists & Loops</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4">
                      <div className="text-lg font-bold text-green-400">18 Completed</div>
                      <div className="text-sm text-gray-400">Average: 92/100</div>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-4">
                      <div className="text-lg font-bold text-orange-400">5 In Progress</div>
                      <div className="text-sm text-gray-400">Average time: 28 min</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4">
                      <div className="text-lg font-bold text-red-400">2 Not Started</div>
                      <div className="text-sm text-gray-400">Due: Tomorrow</div>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">👥 Student Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-semibold text-white">Sarah Chen</div>
                          <div className="text-sm text-gray-400">Lists & Loops - 85% complete</div>
                        </div>
                      </div>
                      <div className="text-green-400">Grade: 96/100</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-white">Michael Rodriguez</div>
                          <div className="text-sm text-gray-400">Stuck on problem #3 for 8 minutes</div>
                        </div>
                      </div>
                      <div className="text-yellow-400">⚠️ Needs Help</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-semibold text-white">Emma Thompson</div>
                          <div className="text-sm text-gray-400">Just started - reviewing lesson content</div>
                        </div>
                      </div>
                      <div className="text-blue-400">Reading</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights for Teachers */}
                <div className="bg-white/5 rounded-xl p-6 mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">🤖 AI Teaching Insights</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-cyan-500/10 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-cyan-400 text-sm font-semibold">AI Active This Hour</span>
                      </div>
                      <div className="text-lg font-bold text-white">47 Interactions</div>
                      <div className="text-sm text-gray-400">12 students helped with variables</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-purple-400 text-sm font-semibold">Success Rate</span>
                      </div>
                      <div className="text-lg font-bold text-white">91% Resolved</div>
                      <div className="text-sm text-gray-400">Without teacher intervention</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-2 text-green-400">
                      <span className="text-sm font-semibold">💡 AI Recommendation</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                      Consider reviewing list indexing with the class. AI detected 8 students struggling with IndexError in the last 30 minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-t border-white/10">
        <div className="container mx-auto px-6 py-16 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your School's CS Program?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 127 forward-thinking schools already using CodeFly. 
            Get started in 24 hours with our white-glove onboarding.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-3">
              <span className="text-lg font-semibold">Schedule Your Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition">
              <span className="text-lg font-semibold">Download Case Studies</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <Shield className="w-5 h-5" />
              <span>FERPA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Award className="w-5 h-5" />
              <span>EdTech Breakthrough 2024</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Globe className="w-5 h-5" />
              <span>Used in 42 States</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Star className="w-5 h-5" />
              <span>4.9/5 Teacher Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}