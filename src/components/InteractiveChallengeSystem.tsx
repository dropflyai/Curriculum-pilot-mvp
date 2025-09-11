'use client'

/**
 * Interactive Challenge System Component
 * Codefinity-like micro-challenges with real-time feedback and gamification
 */

import { useState, useEffect, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { 
  Play, 
  Square, 
  RefreshCw, 
  Terminal, 
  FileText, 
  Trophy,
  Target,
  Clock,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  HelpCircle,
  Star,
  Award,
  Users,
  ArrowRight,
  Lightbulb,
  Timer,
  BarChart3,
  Loader2
} from 'lucide-react'

import { 
  MicroChallenge, 
  ChallengeSession, 
  ValidationResult,
  UserProgress,
  ChallengeProgress,
  Badge,
  Achievement
} from '@/types/challenge'
import { challengeEngine } from '@/lib/challenge-engine'
import { xpSystem, XPCalculationResult, LevelInfo } from '@/lib/xp-system'

interface InteractiveChallengeSystemProps {
  challenge: MicroChallenge
  userProgress: UserProgress
  onChallengeComplete?: (progress: ChallengeProgress, xpEarned: number) => void
  onProgressUpdate?: (progress: UserProgress) => void
}

export default function InteractiveChallengeSystem({
  challenge,
  userProgress,
  onChallengeComplete,
  onProgressUpdate
}: InteractiveChallengeSystemProps) {
  // Core state
  const [code, setCode] = useState(challenge.starterCode || '')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [session, setSession] = useState<ChallengeSession | null>(null)
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null)
  
  // Progress and gamification
  const [currentProgress, setCurrentProgress] = useState<ChallengeProgress | null>(null)
  const [recentXP, setRecentXP] = useState<XPCalculationResult | null>(null)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  
  // UI state
  const [showHints, setShowHints] = useState(false)
  const [unlockedHints, setUnlockedHints] = useState<string[]>([])
  const [timeSpent, setTimeSpent] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showStoryModal, setShowStoryModal] = useState(true)
  const [realtimeErrors, setRealtimeErrors] = useState<any[]>([])
  const [engineStatus, setEngineStatus] = useState({ ready: false, initializing: true })

  // Refs
  const startTimeRef = useRef<Date>(new Date())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const engineStatusRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await challengeEngine.startChallengeSession(challenge.id, userProgress.userId)
        setSession(newSession)
        setCurrentProgress({
          challengeId: challenge.id,
          userId: userProgress.userId,
          status: 'in_progress',
          attempts: 0,
          bestScore: 0,
          timeSpent: 0,
          hintsUsed: [],
          codeSubmissions: [],
          xpEarned: 0
        })
        
        // Update level info
        setLevelInfo(xpSystem.calculateLevel(userProgress.totalXp))
        
        // Start timer
        startTimeRef.current = new Date()
        timerRef.current = setInterval(() => {
          setTimeSpent(Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000))
        }, 1000)
      } catch (error) {
        console.error('Failed to initialize challenge session:', error)
      }
    }

    initSession()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (engineStatusRef.current) {
        clearInterval(engineStatusRef.current)
      }
      challengeEngine.endSession()
    }
  }, [challenge.id, userProgress.userId])

  // Monitor engine status
  useEffect(() => {
    const checkEngineStatus = () => {
      setEngineStatus(challengeEngine.getEngineStatus())
    }
    
    // Check immediately
    checkEngineStatus()
    
    // Then check periodically until ready
    engineStatusRef.current = setInterval(() => {
      const status = challengeEngine.getEngineStatus()
      setEngineStatus(status)
      
      if (status.ready) {
        clearInterval(engineStatusRef.current!)
      }
    }, 500)

    return () => {
      if (engineStatusRef.current) {
        clearInterval(engineStatusRef.current)
      }
    }
  }, [])

  // Real-time validation
  useEffect(() => {
    const validateRealtime = async () => {
      if (code.length > 10 && challengeEngine.isEngineReady()) {
        try {
          const errors = await challengeEngine.validateCodeRealtime(code, challenge)
          setRealtimeErrors(errors)
        } catch (error) {
          console.error('Real-time validation error:', error)
        }
      }
    }

    const debounceTimer = setTimeout(validateRealtime, 500)
    return () => clearTimeout(debounceTimer)
  }, [code, challenge])

  // Run code
  const runCode = async () => {
    if (!challengeEngine.isEngineReady() || !session || isRunning) return

    setIsRunning(true)
    setOutput(['🔄 Running code...'])

    try {
      const result = await challengeEngine.executeCode(code, challenge)
      setOutput(result.output)
      setLastValidation(result.validationResult)

      // Update progress
      if (currentProgress) {
        const updatedProgress = {
          ...currentProgress,
          attempts: currentProgress.attempts + 1,
          bestScore: Math.max(currentProgress.bestScore, result.validationResult.score),
          timeSpent: Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
        }
        setCurrentProgress(updatedProgress)
      }

    } catch (error) {
      setOutput([`❌ Error: ${error}`])
    } finally {
      setIsRunning(false)
    }
  }

  // Submit solution
  const submitSolution = async () => {
    if (!session || !currentProgress) return

    try {
      const submission = await challengeEngine.submitCode(code, challenge)
      
      // Update progress
      const finalProgress: ChallengeProgress = {
        ...currentProgress,
        status: submission.validationResult.isValid ? 'completed' : 'in_progress',
        completedAt: submission.validationResult.isValid ? new Date() : undefined,
        finalCode: code,
        codeSubmissions: [...currentProgress.codeSubmissions, submission]
      }

      if (submission.validationResult.isValid) {
        // Calculate XP
        const xpResult = xpSystem.calculateChallengeXP(challenge, submission, session, userProgress)
        setRecentXP(xpResult)
        
        // Update user progress
        const updatedUserProgress = xpSystem.updateUserProgress(userProgress, finalProgress, xpResult)
        
        // Check for achievements
        const achievements = xpSystem.checkForAchievements(updatedUserProgress, finalProgress, session, challenge)
        setNewAchievements(achievements)
        
        // Update level info
        setLevelInfo(xpSystem.calculateLevel(updatedUserProgress.totalXp))
        
        // Update XP earned in progress
        finalProgress.xpEarned = xpResult.totalXP
        
        // Show success modal
        setShowSuccessModal(true)
        
        // Callback with results
        onChallengeComplete?.(finalProgress, xpResult.totalXP)
        onProgressUpdate?.(updatedUserProgress)
      }

      setCurrentProgress(finalProgress)
      
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  // Unlock hint
  const unlockHint = (hintId: string) => {
    if (!unlockedHints.includes(hintId)) {
      setUnlockedHints([...unlockedHints, hintId])
      if (session) {
        session.hintsUnlocked.push(hintId)
      }
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/20'
      case 'advanced': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-green-400 flex flex-col font-mono">
      {/* Story Cutscene Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-xl p-8 max-w-2xl mx-4 text-center relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-green-900/10 to-blue-900/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-6 animate-bounce">🎯</div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">MISSION BRIEFING</h2>
              <div className="text-cyan-300 mb-6 space-y-4 text-left">
                <p className="text-lg">
                  <span className="text-yellow-400 font-bold">Agent</span>, welcome to the 
                  <span className="text-green-400 font-bold"> Binary Shores Academy</span>.
                </p>
                <p>
                  Your mission: Build an AI memory core using Python programming. Each challenge 
                  will teach your AI how to store and process critical intelligence data.
                </p>
                <p className="text-blue-300">
                  <span className="font-bold">Challenge:</span> {challenge.title}
                </p>
                <p className="text-sm text-gray-400 italic">
                  "{challenge.description}"
                </p>
              </div>
              
              <div className="bg-slate-800 border border-cyan-400/30 rounded-lg p-4 mb-6">
                <h3 className="text-cyan-400 font-bold mb-2">Mission Objective</h3>
                <p className="text-cyan-300 text-sm">{challenge.instruction}</p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm">{challenge.xpReward} XP Reward</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{challenge.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">{challenge.difficulty}</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowStoryModal(false)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-8 py-3 rounded-lg text-white font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                BEGIN MISSION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 border-2 border-green-400 rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Challenge Complete!</h2>
            <p className="text-green-300 mb-4">{challenge.title}</p>
            
            {recentXP && (
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mb-4">
                <div className="text-green-400 font-bold text-xl">+{recentXP.totalXP} XP</div>
                <div className="text-green-300 text-sm">
                  {recentXP.reasons.join(' • ')}
                </div>
              </div>
            )}

            {newAchievements.length > 0 && (
              <div className="mb-4">
                <h3 className="text-yellow-400 font-bold mb-2">New Achievements!</h3>
                {newAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center justify-center gap-2 text-yellow-300">
                    <span className="text-lg">{achievement.icon}</span>
                    <span>{achievement.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-bold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur border-b border-green-500/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-green-400" />
              <h1 className="text-xl font-bold text-white">{challenge.title}</h1>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </div>
            <div className="text-yellow-400 text-sm">
              {challenge.xpReward} XP
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2 text-cyan-400">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            
            {/* Level Progress */}
            {levelInfo && (
              <div className="flex items-center space-x-2">
                <div className="text-purple-400">{levelInfo.levelBadge}</div>
                <div className="text-purple-300 text-sm">
                  Level {levelInfo.level}
                </div>
              </div>
            )}

            {/* Score */}
            {lastValidation && (
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span className="text-blue-300">{lastValidation.score}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Challenge Info */}
        <div className="w-80 bg-slate-800/60 backdrop-blur border-r border-green-500/30 flex flex-col">
          {/* Challenge Description */}
          <div className="p-6 border-b border-green-500/20">
            <h3 className="text-green-400 font-bold mb-2">Mission Brief</h3>
            <p className="text-green-300 text-sm leading-relaxed">{challenge.description}</p>
            
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <div className="text-blue-400 font-bold text-sm mb-1">Objective:</div>
              <div className="text-blue-300 text-sm">{challenge.instruction}</div>
            </div>
          </div>

          {/* Progress Stats */}
          {currentProgress && (
            <div className="p-6 border-b border-green-500/20">
              <h3 className="text-green-400 font-bold mb-3">Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Attempts:</span>
                  <span className="text-white">{currentProgress.attempts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Best Score:</span>
                  <span className="text-white">{currentProgress.bestScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hints Used:</span>
                  <span className="text-white">{unlockedHints.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Hints Section */}
          <div className="p-6 border-b border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-green-400 font-bold">Hints</h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            
            {showHints && (
              <div className="space-y-2">
                {challenge.hints.map((hint, index) => (
                  <div key={hint.id} className="text-sm">
                    {unlockedHints.includes(hint.id) ? (
                      <div className="p-2 bg-yellow-900/20 border border-yellow-400/30 rounded">
                        <div className="text-yellow-300">{hint.content}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => unlockHint(hint.id)}
                        className="w-full p-2 border border-gray-600 rounded hover:border-yellow-400/50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="h-3 w-3 text-yellow-400" />
                          <span className="text-gray-400">Unlock Hint {index + 1}</span>
                          {hint.xpCost && (
                            <span className="text-red-400 text-xs">(-{hint.xpCost} XP)</span>
                          )}
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Concepts */}
          <div className="p-6">
            <h3 className="text-green-400 font-bold mb-3">Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {challenge.concepts.map(concept => (
                <span 
                  key={concept}
                  className="px-2 py-1 bg-cyan-900/20 border border-cyan-400/30 rounded text-cyan-300 text-xs"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-slate-800/70 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-green-400" />
              <span className="text-green-300 text-sm">agent_challenge.py</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning || !engineStatus.ready}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-sm text-white transition-colors"
                title={
                  !engineStatus.ready 
                    ? engineStatus.initializing 
                      ? "Loading Python runtime..." 
                      : "Python runtime unavailable"
                    : "Run your code"
                }
              >
                {isRunning ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : engineStatus.initializing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                <span>
                  {engineStatus.initializing ? "LOADING..." : "RUN"}
                </span>
              </button>
              
              <button
                onClick={submitSolution}
                disabled={!lastValidation || !lastValidation.isValid}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-sm text-white transition-colors"
              >
                <CheckCircle className="h-3 w-3" />
                <span>SUBMIT</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                padding: { top: 20, bottom: 20 }
              }}
            />
            
            {/* Real-time validation overlay */}
            {realtimeErrors.length > 0 && (
              <div className="absolute top-4 right-4 bg-red-900/90 border border-red-400/50 rounded-lg p-3 max-w-xs">
                <div className="text-red-400 font-bold text-sm mb-1">Issues Detected:</div>
                {realtimeErrors.slice(0, 3).map((error, index) => (
                  <div key={index} className="text-red-300 text-xs">
                    • {error.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Output Terminal */}
          <div className="h-48 bg-black border-t border-green-500/30 flex flex-col">
            <div className="bg-slate-800/70 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm">Output</span>
              </div>
              
              {lastValidation && (
                <div className="flex items-center space-x-2">
                  {lastValidation.isValid ? (
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Valid Solution</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Needs Work</span>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setOutput([])}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {!engineStatus.ready ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    {engineStatus.initializing ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
                        <div className="text-cyan-400 font-bold mb-2">Initializing Python Runtime...</div>
                        <div className="text-cyan-300 text-sm">This may take a few moments on first load</div>
                      </>
                    ) : (
                      <>
                        <div className="text-red-400 text-xl mb-2">⚠️</div>
                        <div className="text-red-400 font-bold mb-2">Python Runtime Error</div>
                        <div className="text-red-300 text-sm mb-4">{engineStatus.error}</div>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
                        >
                          Reload Page
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : output.length === 0 ? (
                <div className="text-green-500/50 italic">Output will appear here...</div>
              ) : (
                <div className="space-y-1">
                  {output.map((line, index) => (
                    <div key={index} className="text-green-400 whitespace-pre-wrap font-mono text-sm">
                      {line}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Validation feedback */}
              {lastValidation && (
                <div className="mt-4 p-3 bg-slate-800/50 border border-gray-600 rounded">
                  <div className="text-cyan-400 font-bold text-sm mb-1">Validation Result:</div>
                  <div className="text-cyan-300 text-sm mb-2">{lastValidation.feedback}</div>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">Score: <span className="text-white">{lastValidation.score}%</span></span>
                    {lastValidation.passedTests !== undefined && (
                      <span className="text-gray-400">
                        Tests: <span className="text-white">{lastValidation.passedTests}/{lastValidation.totalTests}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}