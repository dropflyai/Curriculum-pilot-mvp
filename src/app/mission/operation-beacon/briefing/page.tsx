'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Star, Trophy, Target, Zap, Lock, ChevronRight, Award, BookOpen, Code, Brain, Users } from 'lucide-react'
import Link from 'next/link'

export default function OperationBeaconBriefing() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')

  const missionStats = {
    totalXP: 2000,
    lessons: 4,
    challenges: 40,
    estimatedTime: '6-8 hours',
    difficulty: 'Beginner',
    prerequisites: 'None'
  }

  const badges = [
    {
      id: 'variable-master',
      name: 'Variable Master',
      description: 'Complete all variable challenges',
      icon: Code,
      requirement: 'Lesson 1 - 100% completion',
      xp: 250,
      unlocked: false
    },
    {
      id: 'data-detective',
      name: 'Data Detective', 
      description: 'Master all data types',
      icon: Brain,
      requirement: 'Lesson 2 - 100% completion',
      xp: 300,
      unlocked: false
    },
    {
      id: 'logic-legend',
      name: 'Logic Legend',
      description: 'Conquer conditional statements',
      icon: Target,
      requirement: 'Lesson 3 - 100% completion', 
      xp: 350,
      unlocked: false
    },
    {
      id: 'function-commander',
      name: 'Function Commander',
      description: 'Master Python functions',
      icon: Zap,
      requirement: 'Lesson 4 - 100% completion',
      xp: 400,
      unlocked: false
    },
    {
      id: 'shadow-protocol-complete',
      name: 'Shadow Protocol Agent',
      description: 'Complete Operation Beacon mission',
      icon: Shield,
      requirement: 'Complete all Week 1 lessons',
      xp: 700,
      unlocked: false,
      special: true
    }
  ]

  const unlockables = [
    {
      id: 'advanced-editor',
      name: 'Advanced Code Editor',
      description: 'Syntax highlighting and auto-completion',
      requirement: 'Complete Lesson 1',
      type: 'Tool'
    },
    {
      id: 'debug-assistant',
      name: 'Debug Assistant AI',
      description: 'AI-powered error detection and hints',
      requirement: 'Complete Lesson 2', 
      type: 'Assistant'
    },
    {
      id: 'speed-mode',
      name: 'Speed Challenge Mode',
      description: 'Time-based coding challenges for extra XP',
      requirement: 'Complete Lesson 3',
      type: 'Mode'
    },
    {
      id: 'team-collaboration',
      name: 'Team Collaboration Hub',
      description: 'Connect with other agents for group challenges',
      requirement: 'Complete all Week 1 lessons',
      type: 'Feature'
    }
  ]

  const weekLessons = [
    {
      id: 1,
      title: 'Variables & Data Storage',
      description: 'Learn to store and manipulate data like a secret agent',
      challenges: 10,
      xp: 500,
      concepts: ['Variable assignment', 'Naming conventions', 'Data storage', 'Memory management']
    },
    {
      id: 2, 
      title: 'Data Types & Classification',
      description: 'Master different types of data in your intelligence work',
      challenges: 10,
      xp: 500,
      concepts: ['Integers', 'Floats', 'Strings', 'Booleans', 'Type conversion']
    },
    {
      id: 3,
      title: 'Conditional Logic & Decision Making', 
      description: 'Make strategic decisions with if/else statements',
      challenges: 10,
      xp: 500,
      concepts: ['If statements', 'Elif chains', 'Logical operators', 'Complex conditions']
    },
    {
      id: 4,
      title: 'Functions & Modular Programming',
      description: 'Create reusable code modules for efficient operations',
      challenges: 10,
      xp: 500,
      concepts: ['Function definition', 'Parameters', 'Return values', 'Code organization']
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Mission Overview', icon: Target },
    { id: 'rewards', name: 'Rewards & XP', icon: Star },
    { id: 'badges', name: 'Badges', icon: Award },
    { id: 'unlockables', name: 'Unlockables', icon: Lock }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/mission-hq" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                ← Back to Mission HQ
              </Link>
              <div className="w-px h-6 bg-cyan-500/30" />
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-cyan-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Operation Beacon</h1>
                  <p className="text-sm text-cyan-400">Mission Briefing - Week 1</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm font-mono">
                ACTIVE MISSION
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Mission Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(missionStats).map(([key, value]) => (
            <div key={key} className="bg-black/50 border border-cyan-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{value}</div>
              <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-black/30 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                  selectedTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Mission Description */}
              <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-3">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <span>Mission Objective</span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Intelligence has discovered a rogue AI system codenamed "BLACK CIPHER" operating from a fortified mountain facility. 
                  Your mission: learn the fundamental Python programming skills needed to infiltrate their systems and neutralize the threat.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Primary Objectives:</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Master variable storage and manipulation techniques</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Learn data classification and type handling</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Develop logical decision-making capabilities</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Create modular, reusable code functions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Mission Parameters:</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Clearance Level:</strong> Beginner</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Duration:</strong> 6-8 hours</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Challenge Count:</strong> 40 missions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Support:</strong> AI Assistant available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week Lessons */}
              <div className="grid md:grid-cols-2 gap-6">
                {weekLessons.map((lesson) => (
                  <div key={lesson.id} className="bg-black/50 border border-cyan-500/20 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">Lesson {lesson.id}</h4>
                        <h5 className="text-cyan-400 font-medium">{lesson.title}</h5>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">{lesson.challenges} challenges</div>
                        <div className="text-sm text-green-400 font-medium">{lesson.xp} XP</div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{lesson.description}</p>
                    <div>
                      <div className="text-sm font-medium text-cyan-400 mb-2">Key Concepts:</div>
                      <div className="flex flex-wrap gap-2">
                        {lesson.concepts.map((concept) => (
                          <span key={concept} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'rewards' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span>Experience Points & Progression</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-cyan-400 mb-4">XP Breakdown</h4>
                    <div className="space-y-3">
                      {weekLessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-5 h-5 text-cyan-400" />
                            <span className="text-white">Lesson {lesson.id}</span>
                          </div>
                          <span className="text-green-400 font-bold">{lesson.xp} XP</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="text-white font-semibold">Mission Bonus</span>
                        </div>
                        <span className="text-yellow-400 font-bold">+700 XP</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-cyan-400 mb-4">Progression Rewards</h4>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 mt-1" />
                        <div>
                          <div className="font-medium">Agent Level Up</div>
                          <div className="text-sm text-gray-400">Advance your agent clearance level</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-blue-400 mt-1" />
                        <div>
                          <div className="font-medium">Enhanced Abilities</div>
                          <div className="text-sm text-gray-400">Unlock new coding tools and features</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Users className="w-4 h-4 text-green-400 mt-1" />
                        <div>
                          <div className="font-medium">Team Recognition</div>
                          <div className="text-sm text-gray-400">Earn respect among fellow agents</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-red-400 mt-1" />
                        <div>
                          <div className="font-medium">Advanced Missions</div>
                          <div className="text-sm text-gray-400">Unlock Week 2: Cipher Command</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'badges' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Award className="w-6 h-6 text-purple-400" />
                  <span>Achievement Badges</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {badges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <div 
                        key={badge.id} 
                        className={`p-6 rounded-lg border-2 ${
                          badge.special 
                            ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50'
                            : badge.unlocked 
                            ? 'bg-green-500/20 border-green-500/50' 
                            : 'bg-gray-800/50 border-gray-600/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${
                              badge.special 
                                ? 'bg-purple-500/20'
                                : badge.unlocked 
                                ? 'bg-green-500/20' 
                                : 'bg-gray-700/50'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                badge.special 
                                  ? 'text-purple-400'
                                  : badge.unlocked 
                                  ? 'text-green-400' 
                                  : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{badge.name}</h4>
                              <p className="text-sm text-gray-300">{badge.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              badge.special ? 'text-purple-400' : 'text-yellow-400'
                            }`}>
                              +{badge.xp} XP
                            </div>
                            {badge.special && (
                              <div className="text-xs text-purple-400 font-medium">LEGENDARY</div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          <strong>Requirement:</strong> {badge.requirement}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'unlockables' && (
            <div className="space-y-6">
              <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Lock className="w-6 h-6 text-orange-400" />
                  <span>Mission Unlockables</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {unlockables.map((item) => (
                    <div key={item.id} className="bg-gray-800/50 border border-orange-500/30 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <p className="text-sm text-gray-300 mt-2">{item.description}</p>
                        </div>
                        <div className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                          {item.type}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        <strong>Unlock:</strong> {item.requirement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-12 p-6 bg-black/50 border border-cyan-500/20 rounded-lg">
          <div className="text-gray-300">
            <div className="font-semibold text-white">Ready to begin your mission?</div>
            <div className="text-sm">Start with Week 1 lessons and work your way through all 40 challenges.</div>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/mission-hq"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center space-x-2"
            >
              <span>Back to HQ</span>
            </Link>
            <Link
              href="/mission/operation-beacon"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-lg font-bold transition-all flex items-center space-x-3 transform hover:scale-105"
            >
              <Target className="w-5 h-5" />
              <span>START MISSION</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}