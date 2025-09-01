'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User, Badge, LeaderboardEntry, XPEvent } from '@/lib/supabase/types'
import { Trophy, Zap, TrendingUp, Award, Target, Flame, Star, BookOpen, Code, Rocket } from 'lucide-react'
import Navigation from '@/components/Navigation'

// Simple test lessons to get server running
const pythonLessons = [
  {
    id: 'python-week-1',
    title: 'Welcome to CodeQuest',
    subtitle: 'First Interactive Program',
    emoji: '🚀',
    phase: 'Foundation',
    description: 'Begin your coding adventure! Create your very first interactive Python program.',
    week: 1,
    total_xp: 250,
    challenges: [
      { id: 'hello-world-plus', title: 'Hello World Plus+', xp_reward: 50, difficulty: 'beginner', description: 'Create an awesome introduction program!' },
      { id: 'personality-quiz', title: 'Personality Quiz', xp_reward: 125, difficulty: 'beginner', description: 'Create an interactive personality quiz!' }
    ],
    learning_objectives: [
      'Master print() and input() functions',
      'Understand variables and string manipulation',
      'Create interactive user experiences'
    ]
  },
  {
    id: 'python-week-2',
    title: 'Loops & Events',
    subtitle: 'Build a Clicker Game',
    emoji: '🎯',
    phase: 'Foundation',
    description: 'Master loops by building an addictive clicker game!',
    week: 2,
    total_xp: 275,
    challenges: [
      { id: 'countdown-timer', title: 'Epic Countdown Timer', xp_reward: 50, difficulty: 'beginner', description: 'Create a countdown timer!' },
      { id: 'clicker-game', title: 'Cookie Clicker Game', xp_reward: 150, difficulty: 'intermediate', description: 'Create your own clicker game!' }
    ],
    learning_objectives: [
      'Master while and for loops',
      'Handle user events and input validation',
      'Build interactive games with scoring'
    ]
  }
]

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [badges, setBadges] = useState<(Badge & { earned?: boolean })[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [recentXP, setRecentXP] = useState<XPEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'badges' | 'leaderboard'>('overview')
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [userCode, setUserCode] = useState<string>('')
  const [codeOutput, setCodeOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set())
  const [earnedXP, setEarnedXP] = useState<number>(0)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Python code execution function
  async function runPythonCode() {
    if (!userCode.trim()) {
      setCodeOutput('Please enter some Python code to run!')
      return
    }

    setIsRunning(true)
    setCodeOutput('Running your code...')

    try {
      // Simple simulation of Python execution
      const lines = userCode.split('\n')
      let output = ''
      
      for (const line of lines) {
        if (line.trim().startsWith('print(')) {
          const match = line.match(/print\((.*)\)/)
          if (match) {
            const content = match[1].replace(/['"]/g, '')
            output += content + '\n'
          }
        }
      }

      if (output) {
        setCodeOutput('Output:\n' + output)
      } else {
        setCodeOutput('Code ran successfully! (No output to display)')
      }

      setTimeout(() => {
        setCodeOutput(prev => prev + '\n+5 XP for running code!')
      }, 1000)

    } catch (error) {
      setCodeOutput('Error running code: ' + String(error))
    } finally {
      setIsRunning(false)
    }
  }

  // Get starter code for challenge
  function getStarterCode(challenge: any) {
    return `# ${challenge?.title || 'Challenge'}
# ${challenge?.description || 'Complete this coding challenge!'}

# Your code here:
print("Hello, CodeFly!")

# Add your solution below:

`
  }

  // Submit challenge and award XP
  function submitChallenge() {
    if (!selectedChallenge || !userCode.trim()) return

    const challengeId = selectedChallenge.id
    if (completedChallenges.has(challengeId)) {
      setCodeOutput('You already completed this challenge!')
      return
    }

    setCompletedChallenges(prev => new Set([...prev, challengeId]))
    setEarnedXP(prev => prev + selectedChallenge.xp_reward)
    
    setCodeOutput(`CHALLENGE COMPLETED! 
${selectedChallenge.title}
+${selectedChallenge.xp_reward} XP earned!
Total XP this session: ${earnedXP + selectedChallenge.xp_reward}

Keep coding and level up!`)

    setTimeout(() => {
      setCodeOutput(prev => prev + '\n\nAchievement unlocked! Keep going!')
    }, 2000)
  }

  async function loadDashboardData() {
    try {
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Get user profile with XP
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (userData) setUser(userData)

      // Get all badges and check which ones are earned
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .order('points', { ascending: true })

      const { data: earnedBadges } = await supabase
        .from('student_badges')
        .select('badge_id')
        .eq('student_id', authUser.id)

      if (allBadges) {
        const earnedIds = new Set(earnedBadges?.map(b => b.badge_id))
        setBadges(allBadges.map(badge => ({
          ...badge,
          earned: earnedIds.has(badge.id)
        })))
      }

      // Get leaderboard
      const { data: leaderboardData } = await supabase
        .from('current_leaderboard')
        .select('*')
      
      if (leaderboardData) setLeaderboard(leaderboardData)

      // Get recent XP events
      const { data: xpData } = await supabase
        .from('xp_events')
        .select('*')
        .eq('student_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (xpData) setRecentXP(xpData)

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading your quest...</div>
      </div>
    )
  }

  const getRankEmoji = (rank: number) => {
    switch(rank) {
      case 1: return '👑'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '⭐'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'LEGENDARY': return 'from-yellow-400 to-orange-500'
      case 'EPIC': return 'from-purple-400 to-pink-500'
      case 'RARE': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getXPSourceIcon = (source: string) => {
    switch(source) {
      case 'ASSIGNMENT': return '📝'
      case 'QUIZ': return '❓'
      case 'TEST': return '📊'
      case 'HOMEWORK': return '📚'
      case 'BONUS': return '🎁'
      case 'PEER_REVIEW': return '🤝'
      case 'STREAK': return '🔥'
      default: return '⭐'
    }
  }

  return (
    <>
      <Navigation />
      <div className="navigation-aware min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold">
                  {user?.avatar_url || '🚀'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {user?.display_name || user?.full_name || 'Code Warrior'}
                  </h1>
                  <p className="text-purple-200">Level {Math.floor((user?.total_xp || 0) / 100)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* XP Display */}
                <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{user?.total_xp || 0}</span>
                    <span className="text-purple-200">XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex space-x-2 mb-6">
            {['overview', 'lessons', 'badges', 'leaderboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Area */}
          {activeTab === 'overview' && (
            <div className="text-white text-center py-20">
              <h2 className="text-2xl mb-4">Welcome to CodeQuest!</h2>
              <p>Click the "Lessons" tab to start your coding adventure!</p>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-6">
              {selectedChallenge ? (
                // Challenge View
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
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
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3">Code Editor</h3>
                      <textarea
                        value={userCode || getStarterCode(selectedChallenge)}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="w-full h-80 bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 font-mono text-sm resize-none"
                        placeholder="Write your Python code here..."
                      />
                      <div className="flex items-center space-x-3 mt-4">
                        <button 
                          onClick={runPythonCode}
                          disabled={isRunning}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                        <button 
                          onClick={submitChallenge}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Submit
                        </button>
                      </div>

                      {codeOutput && (
                        <div className="mt-4">
                          <h4 className="text-sm font-bold text-white mb-2">Output:</h4>
                          <div className="bg-black text-green-300 p-4 rounded-lg border border-gray-700 font-mono text-sm whitespace-pre-wrap">
                            {codeOutput}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/30">
                        <h4 className="font-bold text-purple-400 mb-2">Challenge Info</h4>
                        <div className="text-sm text-purple-200 space-y-1">
                          <div>XP Reward: +{selectedChallenge.xp_reward}</div>
                          <div>Difficulty: {selectedChallenge.difficulty}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedLesson ? (
                // Lesson Detail View
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{selectedLesson.emoji}</div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">{selectedLesson.title}</h2>
                        <p className="text-purple-200">{selectedLesson.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedLesson(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      ← Back to Lessons
                    </button>
                  </div>

                  <p className="text-purple-200 text-lg mb-6">{selectedLesson.description}</p>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedLesson.learning_objectives.map((objective: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-purple-200">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Challenges ({selectedLesson.challenges.length})</h3>
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                      {selectedLesson.challenges.map((challenge: any) => {
                        const isCompleted = completedChallenges.has(challenge.id)
                        return (
                          <div 
                            key={challenge.id}
                            className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border transition-all cursor-pointer transform hover:scale-105 ${
                              isCompleted 
                                ? 'border-green-500/50 bg-green-900/20' 
                                : 'border-purple-500/30 hover:border-purple-400/50'
                            }`}
                            onClick={() => setSelectedChallenge(challenge)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-bold text-white">{challenge.title}</h4>
                              {isCompleted && <span className="text-green-400 text-lg">✅</span>}
                            </div>
                            <p className="text-purple-200 text-sm mb-3">{challenge.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                                {challenge.difficulty}
                              </span>
                              <div className={`font-medium ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isCompleted ? 'Completed!' : `+${challenge.xp_reward} XP`}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Lesson List View
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
                    Foundation Phase (Weeks 1-2)
                  </h2>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                    {pythonLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all transform hover:scale-105 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{lesson.emoji}</div>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                                {lesson.title}
                              </h3>
                              <p className="text-purple-200 text-sm">{lesson.subtitle}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold text-lg">{lesson.total_xp} XP</div>
                            <div className="text-purple-200 text-sm">Week {lesson.week}</div>
                          </div>
                        </div>
                        
                        <p className="text-purple-200 mb-4">{lesson.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-purple-200">
                            <div className="flex items-center space-x-1">
                              <Code className="w-4 h-4" />
                              <span>{lesson.challenges.length} Challenges</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{lesson.learning_objectives.length} Goals</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-purple-300 group-hover:text-white transition-colors">
                            <span>Start Quest</span>
                            <Rocket className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="text-white text-center py-20">
              <h2 className="text-2xl mb-4">Badges</h2>
              <p>Your earned badges will appear here!</p>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="text-white text-center py-20">
              <h2 className="text-2xl mb-4">Leaderboard</h2>
              <p>See how you rank against other students!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}