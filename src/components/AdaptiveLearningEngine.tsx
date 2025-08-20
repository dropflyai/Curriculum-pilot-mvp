'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, Target, Zap, Award, Clock, BarChart } from 'lucide-react'

interface LearningPattern {
  conceptId: string
  conceptName: string
  masteryLevel: number // 0-100
  timeSpent: number // minutes
  attempts: number
  errorPatterns: string[]
  lastInteraction: Date
  difficulty: 'easy' | 'medium' | 'hard'
  preferredLearningStyle: 'visual' | 'hands-on' | 'theoretical'
}

interface AdaptiveRecommendation {
  type: 'challenge' | 'review' | 'hint' | 'break' | 'advanced'
  title: string
  description: string
  estimatedTime: number
  difficulty: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface AdaptiveLearningEngineProps {
  studentId: string
  currentLesson: string
  onRecommendation?: (recommendation: AdaptiveRecommendation) => void
}

export default function AdaptiveLearningEngine({ 
  studentId, 
  currentLesson, 
  onRecommendation 
}: AdaptiveLearningEngineProps) {
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([
    {
      conceptId: 'variables',
      conceptName: 'Variables',
      masteryLevel: 85,
      timeSpent: 23,
      attempts: 3,
      errorPatterns: ['naming_convention'],
      lastInteraction: new Date(),
      difficulty: 'easy',
      preferredLearningStyle: 'hands-on'
    },
    {
      conceptId: 'loops',
      conceptName: 'Loops',
      masteryLevel: 65,
      timeSpent: 35,
      attempts: 7,
      errorPatterns: ['infinite_loop', 'off_by_one'],
      lastInteraction: new Date(),
      difficulty: 'medium',
      preferredLearningStyle: 'visual'
    },
    {
      conceptId: 'functions',
      conceptName: 'Functions',
      masteryLevel: 40,
      timeSpent: 18,
      attempts: 5,
      errorPatterns: ['parameter_mismatch', 'return_statement'],
      lastInteraction: new Date(),
      difficulty: 'hard',
      preferredLearningStyle: 'theoretical'
    }
  ])
  
  const [currentRecommendations, setCurrentRecommendations] = useState<AdaptiveRecommendation[]>([])
  const [learningVelocity, setLearningVelocity] = useState(0.75) // concepts per hour
  const [focusLevel, setFocusLevel] = useState(0.8) // 0-1 scale
  const [adaptiveInsights, setAdaptiveInsights] = useState<string[]>([])

  // AI-powered learning analysis
  const analyzeLearningSituation = () => {
    const insights: string[] = []
    const recommendations: AdaptiveRecommendation[] = []

    // Analyze each concept
    learningPatterns.forEach(pattern => {
      const efficiencyScore = pattern.masteryLevel / Math.max(pattern.attempts, 1)
      const timeEfficiency = pattern.masteryLevel / Math.max(pattern.timeSpent, 1)

      // Struggling pattern detection
      if (pattern.masteryLevel < 50 && pattern.attempts > 5) {
        insights.push(`🎯 Detected learning challenge with ${pattern.conceptName}. Suggesting alternative approach.`)
        recommendations.push({
          type: 'review',
          title: `Master ${pattern.conceptName} with Visual Learning`,
          description: `You've been working hard on ${pattern.conceptName}! Let's try a different approach with visual examples and step-by-step breakdowns.`,
          estimatedTime: 15,
          difficulty: Math.max(1, pattern.difficulty === 'hard' ? 2 : 1),
          priority: 'high'
        })
      }

      // Mastery pattern detection
      if (pattern.masteryLevel > 80 && efficiencyScore > 20) {
        insights.push(`🚀 Excellent mastery of ${pattern.conceptName}! Ready for advanced challenges.`)
        recommendations.push({
          type: 'advanced',
          title: `Advanced ${pattern.conceptName} Challenges`,
          description: `You've mastered the basics! Try these real-world applications and advanced techniques.`,
          estimatedTime: 25,
          difficulty: 4,
          priority: 'medium'
        })
      }

      // Optimal learning zone
      if (pattern.masteryLevel >= 50 && pattern.masteryLevel <= 80) {
        recommendations.push({
          type: 'challenge',
          title: `Level Up Your ${pattern.conceptName} Skills`,
          description: `Perfect! You're in the learning sweet spot. Here's a challenge that will push you to the next level.`,
          estimatedTime: 20,
          difficulty: 3,
          priority: 'medium'
        })
      }
    })

    // Focus and fatigue analysis
    if (focusLevel < 0.6) {
      insights.push(`🧘 Your focus seems low. Consider taking a 5-minute break or switching to a lighter topic.`)
      recommendations.push({
        type: 'break',
        title: 'Recharge Break Recommended',
        description: 'Your brain needs a quick recharge! Try the coding game or take a 5-minute walk.',
        estimatedTime: 5,
        difficulty: 1,
        priority: 'urgent'
      })
    }

    // Learning velocity optimization
    if (learningVelocity < 0.5) {
      insights.push(`📈 Let's optimize your learning pace. Consider shorter, focused sessions with more hands-on practice.`)
      recommendations.push({
        type: 'hint',
        title: 'Learning Pace Optimization',
        description: 'Your learning style suggests shorter, intense coding sessions work best for you!',
        estimatedTime: 10,
        difficulty: 2,
        priority: 'medium'
      })
    }

    setAdaptiveInsights(insights)
    setCurrentRecommendations(recommendations)
  }

  useEffect(() => {
    analyzeLearningSituation()
    
    // Re-analyze every 30 seconds for real-time adaptation
    const interval = setInterval(analyzeLearningSituation, 30000)
    return () => clearInterval(interval)
  }, [learningPatterns, focusLevel, learningVelocity])

  const updateLearningPattern = (conceptId: string, updates: Partial<LearningPattern>) => {
    setLearningPatterns(prev => prev.map(pattern =>
      pattern.conceptId === conceptId ? { ...pattern, ...updates } : pattern
    ))
  }

  const simulateRealTimeTracking = () => {
    // Simulate user interaction tracking
    setFocusLevel(prev => Math.max(0.3, prev + (Math.random() - 0.5) * 0.2))
    setLearningVelocity(prev => Math.max(0.2, prev + (Math.random() - 0.5) * 0.1))
    
    // Update current concept tracking
    const currentPattern = learningPatterns.find(p => p.conceptId === currentLesson)
    updateLearningPattern(currentLesson, {
      timeSpent: (currentPattern?.timeSpent || 0) + 1,
      lastInteraction: new Date()
    })
  }

  // Simulate real-time tracking every 10 seconds
  useEffect(() => {
    const interval = setInterval(simulateRealTimeTracking, 10000)
    return () => clearInterval(interval)
  }, [currentLesson])

  const getPerformanceColor = (masteryLevel: number) => {
    if (masteryLevel >= 80) return 'text-green-400'
    if (masteryLevel >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-500/20'
      case 'high': return 'border-orange-500 bg-orange-500/20'
      case 'medium': return 'border-yellow-500 bg-yellow-500/20'
      default: return 'border-blue-500 bg-blue-500/20'
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl p-6 text-white">
      <div className="mb-6">
        <h3 className="text-2xl font-bold flex items-center mb-2">
          <Brain className="h-6 w-6 mr-2 text-purple-400 animate-pulse" />
          AI Learning Intelligence
        </h3>
        <p className="text-blue-200">Personalized insights and recommendations based on your learning patterns</p>
      </div>

      {/* Real-time Learning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-200">Focus Level</div>
              <div className="text-2xl font-bold text-purple-300">
                {Math.round(focusLevel * 100)}%
              </div>
            </div>
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <div className="w-full bg-purple-800/30 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${focusLevel * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-200">Learning Velocity</div>
              <div className="text-2xl font-bold text-green-300">
                {learningVelocity.toFixed(1)}x
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
          <div className="text-xs text-green-200 mt-1">concepts per hour</div>
        </div>

        <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-yellow-200">Session Time</div>
              <div className="text-2xl font-bold text-yellow-300">
                {Math.round(learningPatterns.reduce((sum, p) => sum + p.timeSpent, 0) / learningPatterns.length)}m
              </div>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Concept Mastery Overview */}
      <div className="mb-6">
        <h4 className="text-lg font-bold mb-3 flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-blue-400" />
          Concept Mastery Progress
        </h4>
        <div className="space-y-3">
          {learningPatterns.map(pattern => (
            <div key={pattern.conceptId} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{pattern.conceptName}</span>
                <span className={`font-bold ${getPerformanceColor(pattern.masteryLevel)}`}>
                  {pattern.masteryLevel}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    pattern.masteryLevel >= 80 ? 'bg-green-500' :
                    pattern.masteryLevel >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${pattern.masteryLevel}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{pattern.attempts} attempts</span>
                <span>{pattern.timeSpent} minutes</span>
                <span>{pattern.errorPatterns.length} error patterns</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      {adaptiveInsights.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-bold mb-3 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            AI Learning Insights
          </h4>
          <div className="space-y-2">
            {adaptiveInsights.map((insight, index) => (
              <div key={index} className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                <p className="text-blue-100 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Recommendations */}
      <div>
        <h4 className="text-lg font-bold mb-3 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-400" />
          Personalized Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRecommendations.slice(0, 4).map((rec, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 border ${getPriorityColor(rec.priority)} hover:scale-105 transition-transform cursor-pointer`}
              onClick={() => onRecommendation?.(rec)}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-sm">{rec.title}</h5>
                <div className="flex items-center space-x-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{rec.estimatedTime}m</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                  {rec.priority.toUpperCase()}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ml-1 ${
                        i < rec.difficulty ? 'bg-orange-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}