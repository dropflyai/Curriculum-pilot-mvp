'use client'

/**
 * Interactive Challenge Mode for Binary Shores Academy Week 1
 * Codefinity-like micro-challenges for AI Memory Core Programming
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InteractiveChallengeSystem from '@/components/InteractiveChallengeSystem'
import { Mission1Challenges } from '@/lib/mission1-challenges'
import { MicroChallenge, UserProgress, ChallengeProgress } from '@/types/challenge'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Target, 
  Trophy, 
  Star,
  Lock,
  Play,
  RotateCcw
} from 'lucide-react'

export default function Week1ChallengesPage() {
  const router = useRouter()
  const [challenges] = useState<MicroChallenge[]>(Mission1Challenges.generateWeek1Challenges())
  const [currentChallengeIndex, setChallengeIndex] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set())
  const [challengeProgress, setChallengeProgress] = useState<Map<string, ChallengeProgress>>(new Map())
  const [totalXP, setTotalXP] = useState(0)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  // Mock user progress - in real app this would come from backend/auth
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: 'agent_' + Math.random().toString(36).substr(2, 9),
    totalXp: 150, // Some existing XP
    level: 2,
    currentStreak: 1,
    longestStreak: 5,
    challengesCompleted: 3,
    challengesAttempted: 5,
    averageScore: 85,
    totalTimeSpent: 1200, // 20 minutes
    badges: [],
    recentAchievements: []
  })

  const currentChallenge = challenges[currentChallengeIndex]
  const isLastChallenge = currentChallengeIndex === challenges.length - 1
  const allChallengesCompleted = completedChallenges.size === challenges.length

  useEffect(() => {
    // Load progress from localStorage if available
    const savedProgress = localStorage.getItem('bsa_week1_progress')
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress)
        setCompletedChallenges(new Set(data.completed || []))
        setTotalXP(data.totalXP || 0)
        if (data.userProgress) {
          setUserProgress(data.userProgress)
        }
      } catch (error) {
        console.log('Could not load saved progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = () => {
    const progressData = {
      completed: Array.from(completedChallenges),
      totalXP,
      userProgress,
      timestamp: Date.now()
    }
    localStorage.setItem('bsa_week1_progress', JSON.stringify(progressData))
  }

  const handleChallengeComplete = (progress: ChallengeProgress, xpEarned: number) => {
    setCompletedChallenges(prev => new Set([...prev, progress.challengeId]))
    setChallengeProgress(prev => new Map(prev.set(progress.challengeId, progress)))
    setTotalXP(prev => prev + xpEarned)
    
    // Update user progress
    const updatedUserProgress = {
      ...userProgress,
      totalXp: userProgress.totalXp + xpEarned,
      challengesCompleted: userProgress.challengesCompleted + 1,
      currentStreak: userProgress.currentStreak + 1
    }
    setUserProgress(updatedUserProgress)
    
    saveProgress()

    // Show completion modal if all challenges done
    if (completedChallenges.size + 1 === challenges.length) {
      setTimeout(() => setShowCompletionModal(true), 1500)
    }
  }

  const handleProgressUpdate = (progress: UserProgress) => {
    setUserProgress(progress)
    saveProgress()
  }

  const goToNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setChallengeIndex(currentChallengeIndex + 1)
    }
  }

  const goToPreviousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setChallengeIndex(currentChallengeIndex - 1)
    }
  }

  const selectChallenge = (index: number) => {
    setChallengeIndex(index)
  }

  const resetProgress = () => {
    setCompletedChallenges(new Set())
    setChallengeProgress(new Map())
    setTotalXP(0)
    setChallengeIndex(0)
    setShowCompletionModal(false)
    localStorage.removeItem('bsa_week1_progress')
  }

  const returnToWeekOverview = () => {
    router.push('/mission/binary-shores-academy/week-1')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-slate-800 border-2 border-green-400 rounded-xl p-8 max-w-lg mx-4 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-green-400 mb-3">Week 1 Complete!</h2>
            <p className="text-green-300 mb-2">AI Memory Core Programming</p>
            <p className="text-gray-300 mb-6">
              Outstanding work, Agent! You've successfully built the foundation of your AI's memory system.
            </p>
            
            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6 mb-6">
              <h3 className="text-green-400 font-bold mb-3">Mission Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Challenges:</span>
                  <span className="text-white ml-2">{challenges.length}/{challenges.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">XP Earned:</span>
                  <span className="text-yellow-400 ml-2">+{totalXP}</span>
                </div>
                <div>
                  <span className="text-gray-400">Concepts:</span>
                  <span className="text-white ml-2">Variables</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 ml-2">Complete</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={returnToWeekOverview}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-bold transition-colors"
              >
                Continue to Week 2
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg text-white font-bold transition-colors"
              >
                Review Challenges
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur border-b border-green-500/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={returnToWeekOverview}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Week 1</span>
            </button>
            <div className="text-gray-400">|</div>
            <h1 className="text-xl font-bold text-white">Interactive Challenges</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-yellow-400">
              Total XP: <span className="font-bold">+{totalXP}</span>
            </div>
            <div className="text-green-400">
              Progress: <span className="font-bold">{completedChallenges.size}/{challenges.length}</span>
            </div>
            <button
              onClick={resetProgress}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Reset Progress"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Challenge Navigation */}
        <div className="w-80 bg-slate-800/60 backdrop-blur border-r border-green-500/30 p-6">
          <h2 className="text-green-400 font-bold text-lg mb-4">Mission Challenges</h2>
          
          <div className="space-y-3">
            {challenges.map((challenge, index) => {
              const isCompleted = completedChallenges.has(challenge.id)
              const isCurrent = index === currentChallengeIndex
              const progress = challengeProgress.get(challenge.id)
              
              return (
                <div
                  key={challenge.id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isCurrent 
                      ? 'border-green-400 bg-green-900/20' 
                      : isCompleted
                        ? 'border-green-600/50 bg-green-900/10 hover:bg-green-900/20'
                        : 'border-gray-600 bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                  onClick={() => selectChallenge(index)}
                >
                  {/* Challenge Status Icon */}
                  <div className="absolute top-3 right-3">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : isCurrent ? (
                      <Play className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <Target className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="pr-8">
                    <div className="text-white font-semibold text-sm mb-1">
                      Challenge {index + 1}
                    </div>
                    <div className="text-green-300 text-sm mb-2">
                      {challenge.title}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {challenge.estimatedTime} min
                      </span>
                      <span className="text-yellow-400">
                        {challenge.xpReward} XP
                      </span>
                    </div>
                    
                    {/* Progress bar for completed challenges */}
                    {progress && (
                      <div className="mt-2">
                        <div className="w-full h-1 bg-gray-700 rounded-full">
                          <div 
                            className="h-full bg-green-400 rounded-full transition-all"
                            style={{ width: `${progress.bestScore}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Best: {progress.bestScore}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Week Summary */}
          <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <h3 className="text-green-400 font-bold mb-3">Week 1 Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Focus:</span>
                <span className="text-white">Variables & Data</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className="text-green-400">Beginner</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total XP:</span>
                <span className="text-yellow-400">
                  {challenges.reduce((sum, c) => sum + c.xpReward, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Challenge Interface */}
        <div className="flex-1">
          {currentChallenge ? (
            <InteractiveChallengeSystem
              challenge={currentChallenge}
              userProgress={userProgress}
              onChallengeComplete={handleChallengeComplete}
              onProgressUpdate={handleProgressUpdate}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Target className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl text-gray-400 mb-2">No Challenge Selected</h2>
                <p className="text-gray-500">Select a challenge from the sidebar to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur border-t border-green-500/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousChallenge}
            disabled={currentChallengeIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              Challenge {currentChallengeIndex + 1} of {challenges.length}
            </span>
            
            {allChallengesCompleted && (
              <div className="flex items-center space-x-2 text-green-400">
                <Trophy className="h-5 w-5" />
                <span className="font-bold">Week Complete!</span>
              </div>
            )}
          </div>

          <button
            onClick={goToNextChallenge}
            disabled={isLastChallenge}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}