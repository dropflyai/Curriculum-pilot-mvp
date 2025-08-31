'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Globe, Github, Eye, Code, Star, Trophy, Zap, ExternalLink, Share2 } from 'lucide-react'
import { portfolioEngine, isEligibleForPortfolio } from '@/lib/portfolio-engine'
import type { StudentPortfolio } from '@/lib/portfolio-engine'

interface PortfolioPreviewProps {
  onViewPortfolio?: () => void
  className?: string
}

export default function PortfolioPreview({ onViewPortfolio, className = '' }: PortfolioPreviewProps) {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<StudentPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    if (user) {
      checkEligibilityAndLoadPortfolio()
    }
  }, [user])

  const checkEligibilityAndLoadPortfolio = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      // Check if student has enough completed work for portfolio
      // This would normally check actual progress data from Supabase
      const mockProgress = [
        { status: 'graded', final_score: 85 },
        { status: 'graded', final_score: 92 },
        { status: 'graded', final_score: 78 }
      ]
      
      const isEligible = isEligibleForPortfolio(mockProgress)
      setEligible(isEligible)
      
      if (isEligible) {
        const portfolioData = await portfolioEngine.generateStudentPortfolio(user.id)
        setPortfolio(portfolioData)
      }
    } catch (error) {
      console.error('Error loading portfolio preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSharePortfolio = async () => {
    if (!portfolio) return
    
    const shareUrl = `${window.location.origin}/portfolio/${portfolio.user_id}`
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${portfolio.student_name}'s CodeFly Portfolio`,
          text: `Check out my coding portfolio with ${portfolio.projects.length} projects!`,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert('Portfolio link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing portfolio:', error)
    }
  }

  if (loading) {
    return (
      <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading portfolio preview... 📁</div>
        </div>
      </div>
    )
  }

  if (!eligible) {
    return (
      <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Trophy className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Portfolio Coming Soon!</h3>
          <p className="text-gray-400 mb-4">
            Complete 3 assignments with passing grades to unlock your portfolio
          </p>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Continue Learning
          </button>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 ${className}`}>
        <div className="text-center text-red-400">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Failed to load portfolio</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {portfolio.profile_image ? (
              <img src={portfolio.profile_image} alt={portfolio.student_name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <Code className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">My Portfolio</h3>
            <p className="text-gray-400 text-sm">Showcase your coding journey</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {portfolio.portfolio_url && (
            <a
              href={portfolio.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-400 hover:text-green-300 transition"
              title="View Live Portfolio"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={handleSharePortfolio}
            className="p-2 text-blue-400 hover:text-blue-300 transition"
            title="Share Portfolio"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={onViewPortfolio}
            className="p-2 text-purple-400 hover:text-purple-300 transition"
            title="Manage Portfolio"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600/20 rounded-lg mb-2 mx-auto">
            <Code className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">{portfolio.projects.length}</div>
          <div className="text-xs text-gray-400">Projects</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-600/20 rounded-lg mb-2 mx-auto">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-white">{portfolio.projects.filter(p => p.featured).length}</div>
          <div className="text-xs text-gray-400">Featured</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg mb-2 mx-auto">
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{portfolio.badges.length}</div>
          <div className="text-xs text-gray-400">Badges</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-600/20 rounded-lg mb-2 mx-auto">
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white">{portfolio.skills.length}</div>
          <div className="text-xs text-gray-400">Skills</div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <h4 className="text-white font-semibold mb-3">Recent Projects</h4>
        <div className="space-y-3">
          {portfolio.projects.slice(0, 3).map(project => (
            <div
              key={project.id}
              className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h5 className="text-white font-medium truncate">{project.title}</h5>
                  {project.featured && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                </div>
                <p className="text-gray-400 text-sm">Week {project.week} • {project.grade}%</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => window.open(`/portfolio/project/${project.id}`, '_blank')}
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {portfolio.projects.length > 3 && (
            <div className="text-center pt-2">
              <button
                onClick={onViewPortfolio}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
              >
                View all {portfolio.projects.length} projects →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* XP Progress */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Portfolio Level</span>
          <span className="text-yellow-400 font-medium">
            Level {Math.floor(portfolio.total_xp / 1000) + 1}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (portfolio.total_xp % 1000) / 10)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{portfolio.total_xp.toLocaleString()} XP</span>
          <span>{1000 - (portfolio.total_xp % 1000)} XP to next level</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={onViewPortfolio}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Portfolio</span>
        </button>
        
        {!portfolio.portfolio_url && (
          <button
            onClick={onViewPortfolio}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition flex items-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>Deploy</span>
          </button>
        )}
      </div>

      {/* Quick Links */}
      <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-700">
        {portfolio.github_username && (
          <a
            href={`https://github.com/${portfolio.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-sm flex items-center space-x-1"
          >
            <Github className="w-3 h-3" />
            <span>GitHub</span>
          </a>
        )}
        <button
          onClick={handleSharePortfolio}
          className="text-gray-400 hover:text-white transition text-sm flex items-center space-x-1"
        >
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </button>
        {portfolio.portfolio_url && (
          <a
            href={portfolio.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition text-sm flex items-center space-x-1"
          >
            <Globe className="w-3 h-3" />
            <span>Live Site</span>
          </a>
        )}
      </div>
    </div>
  )
}