'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Brain, Users, Clock, Zap, Code2, MessageSquare, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'

interface ClaudeSession {
  id: string
  accountName: string
  inUse: boolean
  currentUser?: string
  timeRemaining?: number
  teamId: string
}

const CLAUDE_ACCOUNTS: ClaudeSession[] = [
  { id: 'claude-1', accountName: 'Shadow Wolves Claude', inUse: false, teamId: 'team-1' },
  { id: 'claude-2', accountName: 'Cipher Knights Claude', inUse: true, currentUser: 'Emma', timeRemaining: 23, teamId: 'team-2' },
  { id: 'claude-3', accountName: 'Ghost Squad Claude', inUse: false, teamId: 'team-3' },
  { id: 'claude-4', accountName: 'Quantum Hawks Claude', inUse: true, currentUser: 'Alex', timeRemaining: 8, teamId: 'team-4' },
  { id: 'claude-5', accountName: 'Shared Development Claude', inUse: false, teamId: 'shared' }
]

export default function ClaudeAccess() {
  const router = useRouter()
  const [userTeam, setUserTeam] = useState<any>(null)
  const [selectedSession, setSelectedSession] = useState<ClaudeSession | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(45) // 45 minute sessions
  const [showGuidelines, setShowGuidelines] = useState(true)

  useEffect(() => {
    // Check authentication and team membership
    const demoMode = localStorage.getItem('codefly_demo_mode') === 'true'
    const demoAuth = localStorage.getItem('demo_authenticated') === 'true'
    const teamData = localStorage.getItem('student_team')
    
    if (!demoMode && !demoAuth) {
      router.push('/auth')
      return
    }

    if (!teamData) {
      router.push('/team-formation')
      return
    }

    setUserTeam(JSON.parse(teamData))
  }, [router])

  const handleStartSession = (account: ClaudeSession) => {
    if (account.inUse) return
    
    // In real implementation, this would reserve the account
    const updatedAccount = {
      ...account,
      inUse: true,
      currentUser: 'You',
      timeRemaining: 45
    }
    
    setSelectedSession(updatedAccount)
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setSelectedSession(null)
          return 0
        }
        return prev - 1
      })
    }, 60000) // Update every minute
  }

  const getTeamAccount = () => {
    return CLAUDE_ACCOUNTS.find(account => account.teamId === userTeam?.id)
  }

  const getAvailableAccounts = () => {
    return CLAUDE_ACCOUNTS.filter(account => !account.inUse)
  }

  if (!userTeam) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/ai-literacy"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">AI Literacy</span>
              </Link>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-purple-500 mr-3 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Claude Access Portal 🧠
                  </h1>
                  <p className="text-sm text-gray-300">Team-Based Advanced AI Coding</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-semibold">{userTeam.name}</span>
                </div>
              </div>
              {selectedSession && (
                <div className="bg-green-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-white font-semibold">{timeRemaining}min left</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Guidelines Section */}
        {showGuidelines && (
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30 mb-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-orange-400 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-4">Claude Usage Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-orange-200 mb-2">✅ Best Practices:</h4>
                    <ul className="space-y-1 text-orange-100 text-sm">
                      <li>• Describe your project goals clearly</li>
                      <li>• Ask for explanations, not just code</li>
                      <li>• Share your work with team members</li>
                      <li>• Use for creative brainstorming</li>
                      <li>• Document what you learn</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-200 mb-2">⏰ Time Management:</h4>
                    <ul className="space-y-1 text-orange-100 text-sm">
                      <li>• 45-minute sessions per student</li>
                      <li>• Share accounts fairly with team</li>
                      <li>• Plan your questions in advance</li>
                      <li>• Take notes for later reference</li>
                      <li>• Respect others' session time</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGuidelines(false)}
                className="text-orange-400 hover:text-orange-200 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Active Session */}
        {selectedSession && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-xl font-bold text-white">Active Claude Session</h3>
                  <p className="text-green-200">{selectedSession.accountName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{timeRemaining}:00</div>
                <div className="text-sm text-green-200">minutes remaining</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                  <Code2 className="h-4 w-4" />
                  <span>Vibe Coding Tips</span>
                </h4>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li>"Help me build a web app that tracks student habits"</li>
                  <li>"Create a Python game with these specific features..."</li>
                  <li>"Debug this code and explain what went wrong"</li>
                  <li>"What's the best way to structure this project?"</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Team Collaboration</span>
                </h4>
                <ul className="space-y-2 text-green-100 text-sm">
                  <li>Share interesting responses with teammates</li>
                  <li>Work together on complex problems</li>
                  <li>Document solutions for future reference</li>
                  <li>Teach others what you discover</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <ExternalLink className="h-5 w-5" />
                <span>Open Claude.ai</span>
              </a>
              <p className="text-green-200 text-sm mt-2">
                Login with account: {selectedSession.accountName.toLowerCase().replace(/\s+/g, '')}@codefly.edu
              </p>
            </div>
          </div>
        )}

        {/* Available Accounts */}
        {!selectedSession && (
          <div className="space-y-6">
            {/* Your Team Account */}
            {getTeamAccount() && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-400" />
                  <span>Your Team Claude Account</span>
                </h2>
                
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  getTeamAccount()?.inUse 
                    ? 'border-red-400/50 bg-red-500/10' 
                    : 'border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{userTeam.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{getTeamAccount()?.accountName}</h3>
                        <p className="text-gray-300">Dedicated Claude account for {userTeam.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {getTeamAccount()?.inUse ? (
                        <div>
                          <div className="text-red-400 font-bold">In Use</div>
                          <div className="text-sm text-red-300">
                            {getTeamAccount()?.currentUser} • {getTeamAccount()?.timeRemaining}min left
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartSession(getTeamAccount()!)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
                        >
                          Start Session
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shared Accounts */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Zap className="h-6 w-6 text-purple-400" />
                <span>Shared Class Accounts</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CLAUDE_ACCOUNTS.filter(account => account.id !== getTeamAccount()?.id).map((account) => (
                  <div
                    key={account.id}
                    className={`p-4 rounded-xl border transition-all ${
                      account.inUse 
                        ? 'border-gray-400/50 bg-gray-500/10 opacity-60' 
                        : 'border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 cursor-pointer transform hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">{account.accountName}</h4>
                        <p className="text-sm text-gray-300">
                          {account.inUse 
                            ? `Used by ${account.currentUser} (${account.timeRemaining}min left)`
                            : 'Available for any team'
                          }
                        </p>
                      </div>
                      
                      <div>
                        {account.inUse ? (
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        ) : (
                          <button
                            onClick={() => handleStartSession(account)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-1 rounded text-sm font-medium transition-all"
                          >
                            Use
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-400/30">
                <p className="text-purple-200 text-sm flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Available accounts: {getAvailableAccounts().length} • Sessions auto-end after 45 minutes</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Educational Context */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-indigo-500/30 mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Why We Share Claude Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-bold text-white mb-2">Cost Efficiency</h4>
              <p className="text-indigo-200 text-sm">
                Sharing 5 accounts saves $1,500+ per class while giving everyone Claude access
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-bold text-white mb-2">Collaboration</h4>
              <p className="text-indigo-200 text-sm">
                Teams learn to coordinate and share resources like in real development
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <h4 className="font-bold text-white mb-2">Focused Learning</h4>
              <p className="text-indigo-200 text-sm">
                45-minute sessions encourage preparation and efficient AI interaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}