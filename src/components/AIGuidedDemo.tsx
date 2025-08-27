'use client'

import { useState, useEffect } from 'react'
import { Bot, ArrowRight, Users, BookOpen, Code, Trophy, MessageCircle, Play, Pause, Volume2, ChevronRight, Activity } from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  aiMessage: string
  component: 'dashboard' | 'lesson' | 'teacher' | 'coding'
  highlight?: string[]
  duration: number
}

const demoSteps: DemoStep[] = [
  {
    id: 'student-login',
    title: 'Student Login Experience',
    description: 'Watch how students access their personalized learning dashboard',
    aiMessage: "Hi! I'm CodeFly AI, your personal coding tutor! Let me show you how Sarah, a 9th-grade student, starts her coding journey. Notice how quickly she can access her dashboard with zero setup required.",
    component: 'dashboard',
    highlight: ['gamification', 'progress-tracking'],
    duration: 8000
  },
  {
    id: 'dashboard-overview',
    title: 'Gamified Student Dashboard',
    description: 'See the XP system, achievements, and personalized learning path',
    aiMessage: "Look at Sarah's dashboard! She's earned 1,250 XP points and unlocked 6 achievement badges. The AI tracks her 5-day learning streak and shows she's 80% toward her weekly goal. This gamification keeps students motivated like a video game!",
    component: 'dashboard',
    highlight: ['achievements', 'xp-system', 'streaks'],
    duration: 10000
  },
  {
    id: 'lesson-entry',
    title: 'Interactive Lesson Experience',
    description: 'Enter a lesson and see the AI-powered learning environment',
    aiMessage: "Now Sarah clicks on 'Python Basics' lesson. Watch how the AI personalizes the content based on her learning style. The lesson adapts in real-time - if she's struggling, I provide extra examples. If she's excelling, I offer advanced challenges!",
    component: 'lesson',
    highlight: ['personalization', 'adaptive-content'],
    duration: 12000
  },
  {
    id: 'coding-practice',
    title: 'Real Python Execution',
    description: 'Watch students code in a real Python environment',
    aiMessage: "Here's the magic! Sarah writes actual Python code that runs instantly in her browser. No software installation needed. Watch as she makes a mistake - I immediately detect it and provide a personalized hint. This is real coding, not just theory!",
    component: 'coding',
    highlight: ['python-execution', 'error-detection', 'hints'],
    duration: 15000
  },
  {
    id: 'teacher-view',
    title: 'Teacher Real-Time Monitoring',
    description: 'See how teachers monitor and help students instantly',
    aiMessage: "Now let's switch to the teacher's perspective. Mrs. Johnson can see all 25 students in real-time. Look - I just detected that Michael is stuck on variables for 8 minutes. I automatically alert the teacher and suggest an intervention!",
    component: 'teacher',
    highlight: ['real-time-monitoring', 'alerts', 'interventions'],
    duration: 12000
  }
]

interface MockStudentData {
  name: string
  xp: number
  level: number
  streak: number
  achievements: string[]
  currentLesson: string
  progress: number
}

export default function AIGuidedDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showAI, setShowAI] = useState(true)
  const [aiSpeaking, setAISpeaking] = useState(false)

  const [mockStudent] = useState<MockStudentData>({
    name: 'Sarah Chen',
    xp: 1250,
    level: 3,
    streak: 5,
    achievements: ['First Steps', 'Code Explorer', 'Quiz Master', 'Debug Detective', 'Streak Warrior', 'Python Rookie'],
    currentLesson: 'Python Basics: Variables',
    progress: 68
  })

  const currentStepData = demoSteps[currentStep]

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let stepInterval: NodeJS.Timeout

    if (isPlaying) {
      // Progress within current step
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 100
          }
          return prev + (100 / (currentStepData.duration / 200))
        })
      }, 200)

      // Move to next step
      stepInterval = setTimeout(() => {
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(prev => prev + 1)
          setProgress(0)
          setAISpeaking(true)
          setTimeout(() => setAISpeaking(false), 3000)
        } else {
          setIsPlaying(false)
          setProgress(100)
        }
      }, currentStepData.duration)

      // AI speaking animation
      setAISpeaking(true)
      setTimeout(() => setAISpeaking(false), Math.min(3000, currentStepData.duration / 2))
    }

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepInterval)
    }
  }, [currentStep, isPlaying, currentStepData.duration])

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    setProgress(0)
  }

  const pauseDemo = () => {
    setIsPlaying(false)
  }

  const skipToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setProgress(0)
    setAISpeaking(true)
    setTimeout(() => setAISpeaking(false), 3000)
  }

  const renderDashboardDemo = () => (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold">
            {mockStudent.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Welcome back, {mockStudent.name}!</h3>
            <p className="text-purple-300">Ready to continue coding? ✈️</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">{mockStudent.xp} XP</div>
          <div className="text-sm text-gray-400">Level {mockStudent.level}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 transition-all duration-500 ${currentStepData.highlight?.includes('xp-system') ? 'ring-4 ring-yellow-400 scale-105' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{mockStudent.xp}</div>
            <div className="text-sm text-gray-400">Total XP</div>
            <div className="mt-2 bg-blue-900/50 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{width: '80%'}}></div>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 transition-all duration-500 ${currentStepData.highlight?.includes('streaks') ? 'ring-4 ring-yellow-400 scale-105' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{mockStudent.streak} 🔥</div>
            <div className="text-sm text-gray-400">Day Streak</div>
            <div className="text-xs text-purple-300 mt-1">Keep it up!</div>
          </div>
        </div>

        <div className={`bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 transition-all duration-500 ${currentStepData.highlight?.includes('progress-tracking') ? 'ring-4 ring-yellow-400 scale-105' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{mockStudent.progress}%</div>
            <div className="text-sm text-gray-400">Course Progress</div>
            <div className="mt-2 bg-green-900/50 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{width: `${mockStudent.progress}%`}}></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">2</div>
            <div className="text-sm text-gray-400">Weekly Goal</div>
            <div className="text-xs text-orange-300 mt-1">4 lessons target</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className={`mb-6 transition-all duration-500 ${currentStepData.highlight?.includes('achievements') ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <h4 className="text-lg font-semibold mb-3 text-white">🏆 Achievement Collection</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {mockStudent.achievements.map((achievement, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xs text-gray-300">{achievement}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Lesson */}
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-lg font-semibold mb-2 text-white">📚 Continue Learning</h4>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-blue-400">{mockStudent.currentLesson}</div>
            <div className="text-sm text-gray-400">Last activity: 2 minutes ago</div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Continue</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderLessonDemo = () => (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Python Basics: Variables</h3>
        <div className="flex items-center space-x-4">
          <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm">
            🌱 Beginner Friendly
          </div>
          <div className="text-purple-300">Progress: 68%</div>
        </div>
      </div>

      <div className={`mb-6 transition-all duration-500 ${currentStepData.highlight?.includes('adaptive-content') ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-semibold mb-2 text-purple-400">🎯 What You'll Learn</h4>
          <p className="text-gray-300">Think of variables like labeled containers in your phone's contact list. Each contact has a name (the variable) and stores information (the value)!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h5 className="font-semibold text-blue-400 mb-2">📱 Real-World Example</h5>
            <div className="text-sm text-gray-300">
              <p className="mb-2">In your phone contacts:</p>
              <ul className="space-y-1 text-green-400 font-mono">
                <li>best_friend = "Alex"</li>
                <li>pizza_place = "Mario's"</li>
                <li>emergency_contact = "Mom"</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h5 className="font-semibold text-purple-400 mb-2">🤖 AI Hint</h5>
            <p className="text-sm text-gray-300">I noticed you learn best with examples! Let's practice with your favorite things...</p>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${currentStepData.highlight?.includes('personalization') ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <div className="bg-black/40 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-green-400">✨ Personalized for Sarah</h5>
            <div className="text-xs text-gray-400">AI Adapted Content</div>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Based on your interests in music and art, let's create variables for your creative projects:
          </p>
          <div className="bg-gray-900/50 rounded p-3 font-mono text-green-400 text-sm">
            <div>favorite_song = "Flowers by Miley Cyrus"</div>
            <div>art_project = "Digital Landscape"</div>
            <div>inspiration_quote = "Code is poetry in motion"</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCodingDemo = () => (
    <div className="bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">🐍 Python Code Editor</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Real Python Environment</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="bg-black/60 rounded-lg border border-green-500/30 overflow-hidden">
            <div className="bg-green-900/30 px-4 py-2 border-b border-green-500/30">
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold">Code Editor</span>
                <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition">
                  ▶ Run Code
                </button>
              </div>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="text-gray-500 mb-2"># Sarah's first variables</div>
              <div className="text-green-400">name = "Sarah Chen"</div>
              <div className="text-blue-400">grade = 9</div>
              <div className="text-purple-400">favorite_subject = "Art"</div>
              <div className="text-yellow-400 mt-2">print(f"Hi! I'm {name}, a grade {grade} student!")</div>
              <div className="text-red-400 mt-2">print(f"I love {favorite_subjec}!")  # ❌ Typo here!</div>
            </div>
          </div>
        </div>

        <div>
          <div className={`transition-all duration-500 ${currentStepData.highlight?.includes('error-detection') ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="text-red-400 text-lg">⚠️</div>
                <div>
                  <div className="text-red-400 font-semibold">AI Detected Error</div>
                  <p className="text-gray-300 text-sm mt-1">
                    NameError on line 4: 'favorite_subjec' is not defined
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 transition-all duration-500 ${currentStepData.highlight?.includes('hints') ? 'ring-2 ring-blue-400' : ''}`}>
              <div className="flex items-start space-x-3">
                <Bot className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <div className="text-blue-400 font-semibold">CodeFly AI Assistant</div>
                  <p className="text-gray-300 text-sm mt-1">
                    I see a typo! You wrote "favorite_subjec" but the variable is named "favorite_subject". 
                    Missing the 't' at the end. This is super common - I'll help you catch these!
                  </p>
                  <button className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition">
                    Fix It For Me
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4 transition-all duration-500 ${currentStepData.highlight?.includes('python-execution') ? 'ring-4 ring-green-400' : ''}`}>
            <div className="text-green-400 font-semibold mb-2">✅ Output (after fix)</div>
            <div className="bg-black/40 rounded p-3 font-mono text-green-300 text-sm">
              <div>Hi! I'm Sarah Chen, a grade 9 student!</div>
              <div>I love Art!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTeacherDemo = () => (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">🏫 Teacher Dashboard - Mrs. Johnson's Class</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">25 students online</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-400" />
            <div className="text-xs text-green-300">↗ +12%</div>
          </div>
          <div className="text-2xl font-bold text-white">23/25</div>
          <div className="text-sm text-gray-400">Students Active</div>
        </div>

        <div className="bg-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-blue-400" />
            <div className="text-xs text-blue-300">New!</div>
          </div>
          <div className="text-2xl font-bold text-white">94%</div>
          <div className="text-sm text-gray-400">Avg Completion</div>
        </div>

        <div className={`bg-yellow-500/20 rounded-xl p-4 transition-all duration-500 ${currentStepData.highlight?.includes('alerts') ? 'ring-4 ring-red-400 scale-105' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-yellow-400" />
            <div className="text-xs text-red-400 animate-pulse">Alert!</div>
          </div>
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-sm text-gray-400">Need Help</div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${currentStepData.highlight?.includes('real-time-monitoring') ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <h4 className="text-lg font-semibold mb-4 text-white">👥 Live Student Activity</h4>
        <div className="space-y-3">
          {[
            { name: 'Sarah Chen', status: 'active', lesson: 'Variables', time: '12 min', activity: 'Running code successfully' },
            { name: 'Michael Rodriguez', status: 'stuck', lesson: 'Variables', time: '8 min', activity: '⚠️ Stuck on exercise 3' },
            { name: 'Emma Wilson', status: 'active', lesson: 'Magic 8-Ball', time: '5 min', activity: 'Reading lesson content' },
            { name: 'David Park', status: 'completed', lesson: 'Variables', time: '18 min', activity: '✅ Quiz completed (95%)' }
          ].map((student, i) => (
            <div key={i} className={`bg-white/5 rounded-lg p-3 flex items-center justify-between ${student.status === 'stuck' ? 'border-l-4 border-red-500 bg-red-900/10' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  student.status === 'active' ? 'bg-green-500 animate-pulse' :
                  student.status === 'stuck' ? 'bg-red-500 animate-bounce' :
                  'bg-blue-500'
                }`}></div>
                <div>
                  <div className="font-semibold text-white">{student.name}</div>
                  <div className="text-sm text-gray-400">{student.activity}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">{student.lesson}</div>
                <div className="text-xs text-gray-500">{student.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 transition-all duration-500 ${currentStepData.highlight?.includes('interventions') ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="text-red-400 text-lg animate-pulse">🚨</div>
              <span className="text-red-400 font-semibold">AI Intervention Alert</span>
            </div>
            <div className="text-xs text-gray-400">8 minutes ago</div>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Michael Rodriguez has been stuck on Variables Exercise 3 for 8+ minutes. AI has provided 2 hints but student needs teacher support.
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm transition">
              💬 Send Message
            </button>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition">
              🎯 Provide Hint
            </button>
            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm transition">
              📞 Start Screen Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentDemo = () => {
    switch (currentStepData.component) {
      case 'dashboard': return renderDashboardDemo()
      case 'lesson': return renderLessonDemo()
      case 'coding': return renderCodingDemo()
      case 'teacher': return renderTeacherDemo()
      default: return renderDashboardDemo()
    }
  }

  return (
    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
      {/* Demo Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-bold text-white">🎬 Live Platform Demonstration</h3>
          <div className="text-sm text-gray-400">Interactive Walkthrough</div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`p-2 rounded-lg transition ${showAI ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
          {!isPlaying ? (
            <button
              onClick={startDemo}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Demo</span>
            </button>
          ) : (
            <button
              onClick={pauseDemo}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition flex items-center space-x-2"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Demo Progress</span>
          <span className="text-sm text-gray-400">{currentStep + 1} of {demoSteps.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-200" 
            style={{ width: `${((currentStep / demoSteps.length) * 100) + (progress / demoSteps.length)}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {demoSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => skipToStep(index)}
            className={`p-2 rounded-lg text-xs transition ${
              index === currentStep
                ? 'bg-blue-500 text-white'
                : index < currentStep
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <div className="font-semibold">{index + 1}</div>
            <div className="text-xs opacity-75">{step.title.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* AI Guide */}
      {showAI && (
        <div className={`mb-6 transition-all duration-500 ${aiSpeaking ? 'scale-105' : ''}`}>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-transform ${aiSpeaking ? 'animate-pulse scale-110' : ''}`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-400 font-semibold">CodeFly AI Guide</span>
                  {aiSpeaking && <div className="text-xs text-blue-300 animate-pulse">Speaking...</div>}
                </div>
                <p className="text-gray-300">{currentStepData.aiMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Demo Content */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-white">{currentStepData.title}</h4>
          <div className="text-sm text-gray-400">{currentStepData.description}</div>
        </div>
        {renderCurrentDemo()}
      </div>

      {/* Demo Complete */}
      {currentStep === demoSteps.length - 1 && progress >= 90 && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="text-xl font-bold text-green-400 mb-2">Demo Complete!</h4>
          <p className="text-gray-300 mb-6">
            You've seen how CodeFly transforms computer science education with AI-powered learning, 
            real-time teacher insights, and engaging student experiences.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={startDemo}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              🔄 Restart Demo
            </button>
            <a
              href="/auth"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition"
            >
              🚀 Try Full Platform
            </a>
          </div>
        </div>
      )}
    </div>
  )
}