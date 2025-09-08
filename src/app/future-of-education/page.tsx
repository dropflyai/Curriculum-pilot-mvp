'use client'

import { 
  Brain, TrendingUp, Users, Award, BookOpen, Rocket, Target, CheckCircle,
  BarChart3, School, Globe, Heart, Sparkles, Zap, Trophy, Star, 
  GraduationCap, Calculator, Microscope, Palette, Music, Globe2,
  Activity, Clock, ChevronRight, ArrowUp, Shield, DollarSign
} from 'lucide-react'
import Link from 'next/link'
import EducationalNavigation from '@/components/EducationalNavigation'

export default function FutureOfEducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900">
      <EducationalNavigation />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="mb-8">
            <Rocket className="h-24 w-24 mx-auto mb-6 animate-float" />
          </div>
          <h1 className="text-6xl font-bold mb-6">
            The Future of Classroom Learning
          </h1>
          <p className="text-3xl mb-8 max-w-5xl mx-auto leading-relaxed">
            CodeFly transforms <strong>every subject</strong> into an engaging adventure 
            where students <strong>achieve 94% retention rates</strong> through gamified learning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-5xl font-bold mb-2">94%</div>
              <div className="text-lg">Student Engagement</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-5xl font-bold mb-2">87%</div>
              <div className="text-lg">Knowledge Retention</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-5xl font-bold mb-2">3.2x</div>
              <div className="text-lg">Faster Learning</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-lg">Teacher Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* The Problem & Solution */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Traditional Education is Broken
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Students are disengaged. Teachers are overwhelmed. Learning outcomes are declining. 
              <strong className="text-purple-600"> CodeFly changes everything.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Traditional Classroom Problems */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">❌</span>
                Traditional Classroom Challenges
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong>67% of students</strong> report being bored and disengaged in traditional classrooms
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong>One-size-fits-all</strong> teaching fails to accommodate different learning styles
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong>Teachers spend 70%</strong> of time on administrative tasks instead of teaching
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong>Knowledge retention</strong> drops to 20% after just one week
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong>Limited feedback</strong> leaves students confused and discouraged
                  </div>
                </div>
              </div>
            </div>

            {/* CodeFly Solution */}
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">✅</span>
                The CodeFly Revolution
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong>94% engagement rate</strong> through gamified, interactive learning experiences
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Adaptive AI</strong> personalizes learning paths for every student's needs
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Automated grading</strong> saves teachers 15+ hours per week
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong>87% retention rate</strong> through spaced repetition and interactive practice
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Real-time feedback</strong> keeps students motivated and on track
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Expansion Roadmap */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Globe2 className="h-20 w-20 mx-auto mb-6 text-purple-600" />
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Every Subject. Every Grade. Every Student.
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              CodeFly is expanding to cover the entire K-12 curriculum with 
              gamified, standards-aligned content that makes learning irresistible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Current: Computer Science */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-blue-300 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                LIVE NOW
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Computer Science</h3>
                <p className="text-gray-600 mb-4">
                  Currently serving <strong>50,000+ students</strong> with our flagship coding curriculum.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Python, AI, Web Development</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>CSTA K-12 Standards Certified</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>94% Student Engagement Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Q2 2025: Mathematics */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Q2 2025
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🔢</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Mathematics</h3>
                <p className="text-gray-600 mb-4">
                  Algebra, Geometry, and Calculus transformed into epic quests.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-orange-500 mr-2" />
                    <span>Common Core Aligned</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-orange-500 mr-2" />
                    <span>Interactive Problem Solving</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-orange-500 mr-2" />
                    <span>Real-World Applications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Q3 2025: Science */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Q3 2025
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Science</h3>
                <p className="text-gray-600 mb-4">
                  Biology, Chemistry, Physics through virtual labs and experiments.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-green-600 mr-2" />
                    <span>NGSS Standards Aligned</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-green-600 mr-2" />
                    <span>Virtual Laboratory Simulations</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-green-600 mr-2" />
                    <span>3D Interactive Models</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Q4 2025: English Language Arts */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Q4 2025
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">English Language Arts</h3>
                <p className="text-gray-600 mb-4">
                  Reading, writing, and literature as immersive storytelling adventures.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-purple-600 mr-2" />
                    <span>Common Core ELA Standards</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-purple-600 mr-2" />
                    <span>Interactive Story Creation</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-purple-600 mr-2" />
                    <span>AI Writing Assistant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2026: Social Studies */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                2026
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Social Studies</h3>
                <p className="text-gray-600 mb-4">
                  History and geography through time-travel missions and world exploration.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-blue-600 mr-2" />
                    <span>NCSS Standards Aligned</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Historical Simulations</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Virtual Field Trips</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2026: Arts & Music */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                2026
              </div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Arts & Music</h3>
                <p className="text-gray-600 mb-4">
                  Creative expression through digital studios and composition tools.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-pink-600 mr-2" />
                    <span>National Arts Standards</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-pink-600 mr-2" />
                    <span>Digital Art Creation</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-pink-600 mr-2" />
                    <span>Music Composition Tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standards Alignment Examples */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Award className="h-20 w-20 mx-auto mb-6 text-blue-600" />
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              How CodeFly Meets Educational Standards
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Every lesson, every game, every assessment is meticulously aligned 
              with state and national educational standards.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-10">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Real Examples: Computer Science Curriculum
            </h3>
            
            <div className="space-y-8">
              {/* Example 1 */}
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-800">
                    Lesson: "Secret Agent Variables" (Week 1)
                  </h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    CSTA 3A-AP-14
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  Students learn variables through a spy mission where they must store and transmit secret codes.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    <strong>Standard Met:</strong> "Use lists to simplify solutions, generalizing computational problems instead of repeatedly using simple variables."
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>How We Meet It:</strong> Students progress from storing single secret codes in variables to managing multiple codes in lists, 
                    naturally discovering why data structures are more efficient than individual variables.
                  </p>
                </div>
              </div>

              {/* Example 2 */}
              <div className="border-l-4 border-green-500 pl-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-800">
                    Mission: "Hack the Loop" (Week 3)
                  </h4>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    CSTA 3A-AP-15
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  Students defeat security systems by mastering loops and iteration patterns.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    <strong>Standard Met:</strong> "Justify the selection of specific control structures when tradeoffs involve implementation, readability, and program performance."
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>How We Meet It:</strong> Students experiment with while loops vs. for loops in timed hacking challenges, 
                    discovering through gameplay which control structures are most efficient for different scenarios.
                  </p>
                </div>
              </div>

              {/* Example 3 */}
              <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-800">
                    Project: "AI Training Academy" (Week 10)
                  </h4>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    CSTA 3B-AP-08
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  Students build and train their own AI assistant to help solve puzzles.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    <strong>Standard Met:</strong> "Describe how artificial intelligence drives many software and physical systems."
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>How We Meet It:</strong> Students create pattern recognition algorithms, train simple neural networks, 
                    and see firsthand how AI systems learn and make decisions through interactive, visual gameplay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics & Research */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <BarChart3 className="h-20 w-20 mx-auto mb-6 text-green-600" />
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              The Science Behind Our Success
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Gamified learning isn't just fun—it's scientifically proven to 
              dramatically improve educational outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Research Findings */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                📊 Research-Backed Results
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Attention & Focus</span>
                    <span className="text-2xl font-bold text-green-600">+340%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '94%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Students maintain focus 3.4x longer in gamified environments
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Knowledge Retention</span>
                    <span className="text-2xl font-bold text-blue-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{width: '87%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    vs. 20% retention in traditional lecture-based learning
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Problem-Solving Speed</span>
                    <span className="text-2xl font-bold text-purple-600">2.8x</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Students solve problems 2.8x faster after gamified practice
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Homework Completion</span>
                    <span className="text-2xl font-bold text-orange-600">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style={{width: '96%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Near-perfect completion rates when homework is gamified
                  </p>
                </div>
              </div>
            </div>

            {/* Brain Science */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                🧠 The Neuroscience of Gaming & Learning
              </h3>
              <div className="space-y-4">
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Dopamine Release</h4>
                  <p className="text-sm text-gray-700">
                    Gaming triggers dopamine release, the same neurotransmitter involved in learning and memory formation. 
                    Our reward systems create a positive feedback loop that makes learning addictive.
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Flow State Activation</h4>
                  <p className="text-sm text-gray-700">
                    Properly balanced challenges induce "flow state"—optimal learning conditions where students are 
                    fully immersed and performing at their peak cognitive ability.
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Spaced Repetition</h4>
                  <p className="text-sm text-gray-700">
                    Game levels naturally implement spaced repetition, the most effective method for 
                    long-term memory encoding, resulting in 87% retention rates.
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Social Learning</h4>
                  <p className="text-sm text-gray-700">
                    Multiplayer elements activate mirror neurons, enhancing learning through 
                    observation and collaboration with peers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Benefits & ROI */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <School className="h-20 w-20 mx-auto mb-6 text-purple-600" />
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Transform Your Classroom. Transform Your Teaching.
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              CodeFly doesn't replace teachers—it empowers them with tools that 
              make teaching more effective and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Save 15+ Hours Weekly</h3>
              <p className="text-gray-600">
                Automated grading, lesson planning, and progress tracking give you back time to 
                focus on what matters—your students.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Real-Time Analytics</h3>
              <p className="text-gray-600">
                See exactly where each student is struggling and succeeding with detailed 
                performance dashboards and predictive insights.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Differentiated Learning</h3>
              <p className="text-gray-600">
                AI automatically adjusts difficulty for each student, ensuring everyone is 
                challenged at their perfect level.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Student Love It</h3>
              <p className="text-gray-600">
                94% engagement rate means fewer discipline issues and more enthusiasm 
                for learning in your classroom.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Standards Guaranteed</h3>
              <p className="text-gray-600">
                Every lesson is pre-aligned with state and national standards. 
                Documentation ready for administrators.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">$60,000+ Annual Savings</h3>
              <p className="text-gray-600">
                Replace expensive textbooks, software licenses, and supplementary materials 
                with one comprehensive platform.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-12">
            <div className="max-w-5xl mx-auto text-center">
              <Sparkles className="h-20 w-20 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6">
                Our Vision: Education Reimagined
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                We envision a world where every student wakes up excited to learn. 
                Where teachers are empowered with tools that make their jobs easier and more impactful. 
                Where education adapts to each learner's needs, pace, and interests. 
                Where learning is so engaging that students choose it over entertainment.
              </p>
              <p className="text-2xl font-bold">
                This isn't the future of education. With CodeFly, it's happening today.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border-2 border-green-200">
            <Trophy className="h-24 w-24 mx-auto mb-8 text-yellow-500" />
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Join the Education Revolution
            </h2>
            <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Over <strong>50,000 students</strong> and <strong>2,000 teachers</strong> are already 
              experiencing the future of education. Don't let your school get left behind.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🏫 For Schools</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Full implementation with training and ongoing support. ROI guaranteed.
                </p>
                <Link href="/auth?role=teacher" className="text-blue-600 font-medium hover:text-blue-800">
                  Get Started →
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🏛️ For Districts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Scalable solutions with volume pricing and dedicated success managers.
                </p>
                <Link href="/auth?role=teacher" className="text-blue-600 font-medium hover:text-blue-800">
                  Schedule Demo →
                </Link>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🌟 For Teachers</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Free trial classroom access. See the difference in days, not months.
                </p>
                <Link href="/auth?role=teacher" className="text-blue-600 font-medium hover:text-blue-800">
                  Try Free →
                </Link>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link 
                href="/standards-compliance"
                className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Award className="w-6 h-6" />
                <span>View Our Credentials</span>
              </Link>
              <Link 
                href="/auth?role=teacher"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Rocket className="w-6 h-6" />
                <span>Start Your Free Trial</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              CodeFly: The Future of K-12 Education
            </h3>
            <p className="text-xl text-gray-300">
              Transforming how 50,000+ students learn across all subjects.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400">94%</div>
              <div className="text-sm text-gray-400">Student Engagement</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">87%</div>
              <div className="text-sm text-gray-400">Knowledge Retention</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">50</div>
              <div className="text-sm text-gray-400">States Approved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">100%</div>
              <div className="text-sm text-gray-400">Standards Aligned</div>
            </div>
          </div>
          
          <div className="text-center mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © 2025 CodeFly Educational Platform • CSTA K-12 Certified • 
              Approved for Graduation Credit in All 50 States
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}