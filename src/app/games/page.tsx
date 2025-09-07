'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ParticleEffects from '@/components/ParticleEffects'

interface Game {
  id: string
  title: string
  subtitle: string
  description: string
  ageRange: string
  difficulty: string
  duration: string
  skills: string[]
  icon: string
  gradient: string
  available: boolean
  path: string
  preview: string
}

const games: Game[] = [
  {
    id: 'agent-academy',
    title: 'Agent Academy',
    subtitle: 'Learn Python Through Secret Missions',
    description: 'Train as a digital agent solving coding challenges to protect the cyber world. Master Python fundamentals through exciting spy missions!',
    ageRange: '10-18',
    difficulty: 'Beginner',
    duration: '18 weeks',
    skills: ['Python Basics', 'Problem Solving', 'Logic', 'Algorithms'],
    icon: '🕵️',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    available: true,
    path: '/mission-hq',
    preview: '/images/agent-academy-preview.jpg'
  },
  {
    id: 'web-warriors',
    title: 'Web Warriors',
    subtitle: 'Build Amazing Websites',
    description: 'Create stunning websites and web apps while learning HTML, CSS, and JavaScript. Design your digital kingdom!',
    ageRange: '12-18',
    difficulty: 'Intermediate',
    duration: '16 weeks',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Web Design'],
    icon: '🌐',
    gradient: 'from-green-500 via-teal-500 to-blue-500',
    available: false,
    path: '/web-warriors',
    preview: '/images/web-warriors-preview.jpg'
  },
  {
    id: 'robot-builders',
    title: 'Robot Builders',
    subtitle: 'Code Your Own AI Assistant',
    description: 'Program robots and create AI assistants using Python and machine learning. Build the future of technology!',
    ageRange: '14-18',
    difficulty: 'Advanced',
    duration: '20 weeks',
    skills: ['Python Advanced', 'AI/ML', 'Robotics', 'Data Science'],
    icon: '🤖',
    gradient: 'from-orange-500 via-red-500 to-purple-500',
    available: false,
    path: '/robot-builders',
    preview: '/images/robot-builders-preview.jpg'
  },
  {
    id: 'game-creators',
    title: 'Game Creators',
    subtitle: 'Design Your Own Video Games',
    description: 'Learn game development and create your own video games using Unity and C#. From idea to playable game!',
    ageRange: '12-18',
    difficulty: 'Intermediate',
    duration: '18 weeks',
    skills: ['Game Design', 'Unity', 'C#', '3D Graphics'],
    icon: '🎮',
    gradient: 'from-purple-500 via-indigo-500 to-blue-500',
    available: false,
    path: '/game-creators',
    preview: '/images/game-creators-preview.jpg'
  }
]

export default function GamesPage() {
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGameSelect = (game: Game) => {
    if (!game.available) return
    
    setSelectedGame(game.id)
    setIsLoading(true)
    
    // Simple client-side demo authentication
    document.cookie = 'demo_auth_token=demo_access_2025; path=/; max-age=86400; SameSite=Lax'
    document.cookie = 'demo_user_role=student; path=/; max-age=86400; SameSite=Lax' 
    document.cookie = 'user_role=student; path=/; max-age=86400; SameSite=Lax'
    
    // Navigate after brief delay
    setTimeout(() => {
      router.push(game.path)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      <ParticleEffects type="ambient" count={30} />
      
      {/* Header */}
      <div className="relative z-10">
        <div className="bg-black/50 backdrop-blur-lg border-b border-cyan-500/30 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                CodeFly ✈️
              </h1>
              <p className="text-gray-300 mt-1">Choose Your Coding Adventure</p>
            </div>
            <Link 
              href="/auth"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-cyan-500/50 hover:shadow-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">CodeFly Academy</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select your learning path and embark on an exciting coding journey. 
            Master programming through gamified lessons, interactive challenges, and real-world projects.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameSelect(game)}
              className={`relative group ${
                game.available 
                  ? 'cursor-pointer transform transition-all duration-300 hover:scale-105' 
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
              
              <div className="relative bg-black/60 backdrop-blur-lg border border-gray-700 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
                {/* Game Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-5xl">{game.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                        <p className="text-cyan-400 text-sm">{game.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  {!game.available && (
                    <span className="px-3 py-1 bg-gray-700 text-gray-400 text-xs rounded-full font-semibold">
                      COMING SOON
                    </span>
                  )}
                  {game.available && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">
                      AVAILABLE NOW
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6">{game.description}</p>

                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Age Range</p>
                    <p className="text-white font-semibold">{game.ageRange} years</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Difficulty</p>
                    <p className="text-white font-semibold">{game.difficulty}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-white font-semibold">{game.duration}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Students</p>
                    <p className="text-white font-semibold">
                      {game.id === 'agent-academy' ? '50,000+' : 'New'}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 mb-2">Skills You'll Learn</p>
                  <div className="flex flex-wrap gap-2">
                    {game.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {game.available ? (
                  <button className={`w-full py-4 bg-gradient-to-r ${game.gradient} text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105`}>
                    {selectedGame === game.id && isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading Adventure...
                      </span>
                    ) : (
                      'Start Learning →'
                    )}
                  </button>
                ) : (
                  <button disabled className="w-full py-4 bg-gray-700 text-gray-400 font-bold rounded-lg cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Why Choose CodeFly?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-white font-semibold mb-2">Project-Based Learning</h4>
              <p className="text-gray-400 text-sm">Build real projects while learning to code</p>
            </div>
            <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="text-white font-semibold mb-2">Achievements & Rewards</h4>
              <p className="text-gray-400 text-sm">Earn badges and certificates as you progress</p>
            </div>
            <div className="bg-black/40 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">👥</div>
              <h4 className="text-white font-semibold mb-2">Collaborative Learning</h4>
              <p className="text-gray-400 text-sm">Learn with friends and compete on leaderboards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}