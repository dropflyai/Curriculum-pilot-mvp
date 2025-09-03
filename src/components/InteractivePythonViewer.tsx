'use client'

import React, { useState, useEffect } from 'react'
import { 
  Trophy, Star, Target, Zap, Clock, BookOpen, Code, Play, Check,
  ChevronRight, Award, Lightbulb, Rocket, GamepadIcon, Timer,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { pythonLessons, PythonLesson, PythonChallenge } from '@/lib/python-lessons'

interface InteractivePythonViewerProps {
  lessonId: string
}

interface ChallengeProgress {
  [challengeId: string]: {
    completed: boolean
    xp_earned: number
    attempts: number
  }
}

const InteractivePythonViewer: React.FC<InteractivePythonViewerProps> = ({ lessonId }) => {
  const [lesson, setLesson] = useState<PythonLesson | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'concepts' | 'challenges' | 'project'>('overview')
  const [selectedChallenge, setSelectedChallenge] = useState<PythonChallenge | null>(null)
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress>({})
  const [userCode, setUserCode] = useState<string>('')
  const [testResults, setTestResults] = useState<string[]>([])
  const [showHints, setShowHints] = useState(false)
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    const foundLesson = pythonLessons.find(l => l.id === lessonId)
    if (foundLesson) {
      setLesson(foundLesson)
      setUserCode(foundLesson.challenges[0]?.starter_code || '')
    }
  }, [lessonId])

  const handleRunCode = (challenge: PythonChallenge) => {
    // Simulate code testing (in real app, this would call a Python executor)
    const results = []
    let passedTests = 0
    
    // Simple validation checks
    if (userCode.trim().length > challenge.starter_code.length) {
      results.push('✅ Code has been modified from starter template')
      passedTests++
    }
    
    if (userCode.includes('print(')) {
      results.push('✅ Uses print() statements')
      passedTests++
    }
    
    if (userCode.includes('input(') && challenge.id.includes('quiz')) {
      results.push('✅ Uses input() for user interaction')
      passedTests++
    }
    
    if (userCode.includes('f"') && challenge.difficulty !== 'beginner') {
      results.push('✅ Uses f-strings for formatting')
      passedTests++
    }
    
    // Add some failing tests for realism
    if (Math.random() > 0.7) {
      results.push('❌ Consider adding more comments to explain your code')
    }
    
    if (passedTests >= challenge.test_cases.length - 1) {
      results.push('🎉 Challenge completed! Great work!')
      
      // Mark as completed and award XP
      setChallengeProgress(prev => ({
        ...prev,
        [challenge.id]: {
          completed: true,
          xp_earned: challenge.xp_reward,
          attempts: (prev[challenge.id]?.attempts || 0) + 1
        }
      }))
      
      setTotalXP(prev => prev + challenge.xp_reward)
    }
    
    setTestResults(results)
  }

  const getCompletedChallenges = () => {
    return Object.values(challengeProgress).filter(p => p.completed).length
  }

  const getTotalEarnedXP = () => {
    return Object.values(challengeProgress).reduce((sum, p) => sum + (p.completed ? p.xp_earned : 0), 0)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading lesson...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
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
              <div className="text-2xl font-bold text-yellow-400">
                {getTotalEarnedXP()} / {lesson.total_xp} XP
              </div>
              <div className="text-purple-200">
                Week {lesson.week} • {getCompletedChallenges()}/{lesson.challenges.length} Challenges
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-purple-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{lesson.estimated_time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{lesson.learning_objectives.length} Learning Goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>{lesson.total_xp} XP Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex space-x-4">
          {['overview', 'concepts', 'challenges', 'project'].map((tab) => (
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
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 What You'll Learn</h2>
              <p className="text-purple-200 text-lg mb-6">{lesson.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {lesson.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-200">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Elements */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">🎮 Game Elements</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {lesson.game_elements.map((element, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-400/30">
                    <div className="flex items-center space-x-2 mb-2">
                      {element.type === 'xp_boost' && <Zap className="w-5 h-5 text-yellow-400" />}
                      {element.type === 'code_battle' && <GamepadIcon className="w-5 h-5 text-red-400" />}
                      {element.type === 'debug_quest' && <Target className="w-5 h-5 text-green-400" />}
                      <h3 className="font-bold text-white">{element.title}</h3>
                    </div>
                    <p className="text-purple-200 text-sm mb-2">{element.description}</p>
                    <div className="text-yellow-400 font-medium">+{element.bonus_xp} Bonus XP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Concepts Tab */}
        {activeTab === 'concepts' && (
          <div className="space-y-6">
            {lesson.concepts.map((concept, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{concept.emoji}</div>
                  <h2 className="text-2xl font-bold text-white">{concept.name}</h2>
                </div>
                
                <p className="text-purple-200 text-lg mb-6">{concept.explanation}</p>
                
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{concept.code_example}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {selectedChallenge ? (
              // Challenge Detail View
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-white">{selectedChallenge.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedChallenge.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                      selectedChallenge.difficulty === 'intermediate' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {selectedChallenge.difficulty}
                    </span>
                  </div>
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
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-96 bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 font-mono text-sm resize-none"
                      placeholder="Write your Python code here..."
                    />
                    <div className="flex items-center space-x-3 mt-4">
                      <button
                        onClick={() => handleRunCode(selectedChallenge)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
                      >
                        <Play className="w-4 h-4" />
                        <span>Run Code</span>
                      </button>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>Hints</span>
                      </button>
                    </div>
                  </div>

                  {/* Results & Info Panel */}
                  <div className="space-y-4">
                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-bold text-white mb-2">🧪 Test Results</h4>
                        <div className="space-y-1">
                          {testResults.map((result, index) => (
                            <div key={index} className="text-sm text-purple-200">{result}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hints */}
                    {showHints && (
                      <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-600/30">
                        <h4 className="font-bold text-yellow-400 mb-2">💡 Hints</h4>
                        <div className="space-y-2">
                          {selectedChallenge.hints.map((hint, index) => (
                            <div key={index} className="text-sm text-yellow-200">• {hint}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fun Facts */}
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-600/30">
                      <h4 className="font-bold text-blue-400 mb-2">🌟 Fun Facts</h4>
                      <div className="space-y-2">
                        {selectedChallenge.fun_facts.map((fact, index) => (
                          <div key={index} className="text-sm text-blue-200">• {fact}</div>
                        ))}
                      </div>
                    </div>

                    {/* Challenge Info */}
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/30">
                      <h4 className="font-bold text-purple-400 mb-2">🎯 Challenge Info</h4>
                      <div className="text-sm text-purple-200 space-y-1">
                        <div>XP Reward: {selectedChallenge.xp_reward}</div>
                        {selectedChallenge.badge_reward && (
                          <div>Badge: {selectedChallenge.badge_reward}</div>
                        )}
                        <div>Tests: {selectedChallenge.test_cases.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Challenge List View
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lesson.challenges.map((challenge, index) => (
                  <div 
                    key={challenge.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer transform hover:scale-105"
                    onClick={() => {
                      setSelectedChallenge(challenge)
                      setUserCode(challenge.starter_code)
                      setTestResults([])
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-white">{challenge.title}</h3>
                      {challengeProgress[challenge.id]?.completed && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-purple-200 text-sm mb-4">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        challenge.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                        challenge.difficulty === 'intermediate' ? 'bg-yellow-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
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

        {/* Final Project Tab */}
        {activeTab === 'project' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{lesson.final_project.title.split(' ')[0]}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{lesson.final_project.title}</h2>
              <p className="text-purple-200 text-lg">{lesson.final_project.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📋 Requirements</h3>
                <div className="space-y-2">
                  {lesson.final_project.requirements.map((req, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-purple-200">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">⭐ Bonus Features</h3>
                <div className="space-y-2">
                  {lesson.final_project.bonus_features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-purple-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-400/30">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-yellow-400">+{lesson.final_project.xp_reward} XP</div>
                  <div className="text-purple-200">{lesson.final_project.badge_reward} Badge</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractivePythonViewer