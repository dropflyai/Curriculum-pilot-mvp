'use client'

import { useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { ArrowLeft, Code, Play, Lightbulb, Trophy } from 'lucide-react'
import { useState } from 'react'

// Direct lesson data to avoid import issues
const lessonData: any = {
  'python-week-1': {
    id: 'python-week-1',
    title: 'Welcome to CodeQuest',
    subtitle: 'Your First Interactive Program',
    emoji: '🚀',
    description: 'Begin your coding adventure! Learn Python basics by creating your very first interactive program. Experience the magic of making computers respond to you!',
    week: 1,
    total_xp: 250,
    estimated_time: '60 minutes',
    learning_objectives: [
      'Write your first Python program that talks back to you',
      'Master the print() function to display awesome messages',
      'Use input() to create interactive experiences', 
      'Understand variables and how they store information',
      'Create personalized programs that remember your name'
    ],
    challenges: [
      {
        id: 'hello-world-plus',
        title: '🌟 Hello World Plus+',
        description: 'Create a greeting program that introduces you and shares 3 fun facts about yourself. Make it colorful with emojis!',
        difficulty: 'beginner',
        xp_reward: 25,
        starter_code: `# 🌟 Hello World Plus+ Challenge
# Create an awesome introduction program!

print("Challenge starter code - replace this with your introduction!")`
      },
      {
        id: 'personality-quiz',
        title: '🎭 Interactive Personality Quiz',
        description: 'Build a mini personality quiz that asks the user questions and creates a fun profile based on their answers!',
        difficulty: 'beginner',
        xp_reward: 50,
        starter_code: `# 🎭 Interactive Personality Quiz
# Create a quiz that gets to know your user!

print("🎭 Welcome to the Personality Quiz!")
# Your code here!`
      }
    ]
  },
  'python-week-2': {
    id: 'python-week-2',
    title: 'Loops & Events',
    subtitle: 'Build an Epic Clicker Game',
    emoji: '🎯',
    description: 'Master the power of loops and events by building an addictive clicker game! Learn how repetition makes programs powerful and interactive.',
    week: 2,
    total_xp: 300,
    estimated_time: '90 minutes',
    learning_objectives: [
      'Understand how loops make code repeat automatically',
      'Master while loops for continuous action',
      'Use for loops to repeat exact amounts',
      'Handle user events and input validation',
      'Build a complete interactive game with scoring'
    ],
    challenges: [
      {
        id: 'countdown-timer',
        title: '⏰ Epic Countdown Timer',
        description: 'Create a countdown timer that builds excitement for a rocket launch, birthday, or any special event!',
        difficulty: 'beginner',
        xp_reward: 40,
        starter_code: `# ⏰ Epic Countdown Timer Challenge
# Build a countdown that gets users excited!

print("🎉 Welcome to the Epic Countdown Timer!")
# Your countdown code here!`
      }
    ]
  }
}

export default function PythonLessonDirectPage() {
  const params = useParams()
  const lessonId = params.id as string
  const lesson = lessonData[lessonId]
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges'>('overview')
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [userCode, setUserCode] = useState<string>('')

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navigation />
        <div className="navigation-aware flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-2xl mb-4">
              Lesson "{lessonId}" not found
            </div>
            <div className="text-purple-200 mb-4">
              Available: python-week-1, python-week-2
            </div>
            <Link 
              href="/python-test"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Test Page</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      <div className="navigation-aware p-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{lesson.emoji}</div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
                  <p className="text-purple-200">{lesson.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">{lesson.total_xp} XP</div>
                <div className="text-purple-200">Week {lesson.week}</div>
              </div>
            </div>
            
            <p className="text-purple-200 text-lg">{lesson.description}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex space-x-4">
            {['overview', 'challenges'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">🎯 What You'll Learn</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {lesson.learning_objectives.map((objective: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-purple-200">{objective}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-400/30">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">+{lesson.total_xp} XP</div>
                    <div className="text-purple-200">Available to Earn</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              {selectedChallenge ? (
                // Challenge Detail View
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
                    <button
                      onClick={() => setSelectedChallenge(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      ← Back to Challenges
                    </button>
                  </div>

                  <p className="text-purple-200 text-lg mb-6">{selectedChallenge.description}</p>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Code Editor */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">💻 Code Editor</h3>
                      <textarea
                        value={userCode || selectedChallenge.starter_code}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="w-full h-96 bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 font-mono text-sm resize-none"
                        placeholder="Write your Python code here..."
                      />
                      <div className="flex items-center space-x-3 mt-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition">
                          <Play className="w-4 h-4" />
                          <span>Run Code</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                          <Lightbulb className="w-4 h-4" />
                          <span>Hints</span>
                        </button>
                      </div>
                    </div>

                    {/* Info Panel */}
                    <div className="space-y-4">
                      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/30">
                        <h4 className="font-bold text-purple-400 mb-2">🎯 Challenge Info</h4>
                        <div className="text-sm text-purple-200 space-y-1">
                          <div>XP Reward: {selectedChallenge.xp_reward}</div>
                          <div>Difficulty: {selectedChallenge.difficulty}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Challenge List View
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lesson.challenges.map((challenge: any) => (
                    <div 
                      key={challenge.id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer transform hover:scale-105"
                      onClick={() => {
                        setSelectedChallenge(challenge)
                        setUserCode(challenge.starter_code)
                      }}
                    >
                      <h3 className="font-bold text-white mb-3">{challenge.title}</h3>
                      <p className="text-purple-200 text-sm mb-4">{challenge.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                          {challenge.difficulty}
                        </span>
                        <div className="text-yellow-400 font-medium">+{challenge.xp_reward} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          <Link 
            href="/python-test"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Test Page</span>
          </Link>
        </div>
      </div>
    </div>
  )
}