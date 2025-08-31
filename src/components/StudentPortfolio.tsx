'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, Github, Download, Share2, Settings, Eye, Code, 
  Star, Trophy, Zap, Target, Calendar, Clock, ExternalLink,
  User, Mail, MapPin, Briefcase, GraduationCap, Award
} from 'lucide-react'
import { portfolioEngine, PortfolioProject } from '@/lib/portfolio-engine'
import type { StudentPortfolio } from '@/lib/portfolio-engine'

interface StudentPortfolioProps {
  userId: string
  viewMode?: 'owner' | 'public'
  onPortfolioUpdate?: (portfolio: StudentPortfolio) => void
}

export default function StudentPortfolio({ 
  userId, 
  viewMode = 'owner',
  onPortfolioUpdate 
}: StudentPortfolioProps) {
  const [portfolio, setPortfolio] = useState<StudentPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'about' | 'achievements' | 'deploy'>('projects')
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [deploymentConfig, setDeploymentConfig] = useState({
    enabled: false,
    auto_deploy: false,
    template: 'professional' as 'minimal' | 'professional' | 'showcase',
    github_username: '',
    repository_name: '',
    custom_domain: ''
  })
  const [deploymentStatus, setDeploymentStatus] = useState<{
    deploying: boolean
    success?: boolean
    url?: string
    error?: string
  }>({ deploying: false })

  // Load portfolio data
  useEffect(() => {
    loadPortfolioData()
  }, [userId])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      const portfolioData = await portfolioEngine.generateStudentPortfolio(userId)
      setPortfolio(portfolioData)
      
      // Load existing deployment config
      if (portfolioData.github_username) {
        setDeploymentConfig(prev => ({
          ...prev,
          enabled: true,
          github_username: portfolioData.github_username || '',
          repository_name: `${portfolioData.student_name.toLowerCase().replace(/\s+/g, '-')}-portfolio`
        }))
      }
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeployToGitHub = async () => {
    if (!portfolio) return
    
    try {
      setDeploymentStatus({ deploying: true })
      
      const result = await portfolioEngine.generateGitHubPortfolio(portfolio, {
        enabled: deploymentConfig.enabled,
        auto_deploy: deploymentConfig.auto_deploy,
        repository_name: deploymentConfig.repository_name,
        branch: 'main',
        template: deploymentConfig.template,
        custom_domain: deploymentConfig.custom_domain
      })
      
      if (result.success) {
        setDeploymentStatus({
          deploying: false,
          success: true,
          url: result.pages_url
        })
      } else {
        setDeploymentStatus({
          deploying: false,
          success: false,
          error: 'Failed to deploy portfolio'
        })
      }
    } catch (error) {
      setDeploymentStatus({
        deploying: false,
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      })
    }
  }

  const handleShareProject = async (project: PortfolioProject) => {
    try {
      const shareUrl = `${window.location.origin}/portfolio/project/${project.id}`
      
      if (navigator.share) {
        await navigator.share({
          title: `${project.title} by ${portfolio?.student_name}`,
          text: project.description,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert('Project link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing project:', error)
    }
  }

  const getSkillColor = (skill: string) => {
    const colors = {
      'User Input': 'bg-blue-600',
      'Output Display': 'bg-green-600',
      'Loops': 'bg-purple-600',
      'Functions': 'bg-red-600',
      'Conditional Logic': 'bg-yellow-600',
      'Lists': 'bg-indigo-600',
      'Dictionaries': 'bg-pink-600',
      'Object-Oriented Programming': 'bg-orange-600',
      'Error Handling': 'bg-teal-600',
      'File Operations': 'bg-cyan-600'
    }
    return colors[skill as keyof typeof colors] || 'bg-gray-600'
  }

  const getBadgeIcon = (badge: string) => {
    const icons = {
      'First Steps': '🚀',
      'Quiz Champion': '🧠',
      'Speed Coder': '⚡',
      'Python Master': '🐍',
      'Streak Warrior': '🔥',
      'Perfect Student': '🏆',
      'Code Quality Expert': '💎',
      'Debugging Detective': '🔍',
      'Creative Coder': '🎨',
      'Team Player': '🤝'
    }
    return icons[badge as keyof typeof icons] || '🏅'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading portfolio... 📁</div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📂</div>
          <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
          <p className="text-gray-300">Complete some assignments to build your portfolio!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {portfolio.profile_image ? (
                  <img src={portfolio.profile_image} alt={portfolio.student_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {portfolio.student_name}'s Portfolio
                </h1>
                <p className="text-gray-300">CodeFly Academy Student</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">{portfolio.total_xp.toLocaleString()} XP</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="text-blue-400 font-medium">
                    Level {Math.floor(portfolio.total_xp / 1000) + 1}
                  </div>
                </div>
              </div>
            </div>
            
            {viewMode === 'owner' && (
              <div className="flex items-center space-x-3">
                {portfolio.portfolio_url && (
                  <a
                    href={portfolio.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Live</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveTab('deploy')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                  <Github className="w-4 h-4" />
                  <span>Deploy</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2 mt-6">
            {[
              { id: 'projects', label: 'Projects', icon: Code, count: portfolio.projects.length },
              { id: 'about', label: 'About', icon: User },
              { id: 'achievements', label: 'Achievements', icon: Trophy, count: portfolio.badges.length },
              ...(viewMode === 'owner' ? [{ id: 'deploy', label: 'Deploy', icon: Github }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Code className="w-8 h-8 text-blue-200" />
                  <span className="text-2xl font-bold">{portfolio.projects.length}</span>
                </div>
                <div className="text-blue-100 text-sm font-medium">Total Projects</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-8 h-8 text-green-200" />
                  <span className="text-2xl font-bold">{portfolio.projects.filter(p => p.featured).length}</span>
                </div>
                <div className="text-green-100 text-sm font-medium">Featured</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-purple-200" />
                  <span className="text-2xl font-bold">
                    {Math.round(portfolio.projects.reduce((sum, p) => sum + (p.grade || 0), 0) / portfolio.projects.length)}%
                  </span>
                </div>
                <div className="text-purple-100 text-sm font-medium">Avg Grade</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 text-orange-200" />
                  <span className="text-2xl font-bold">{portfolio.skills.length}</span>
                </div>
                <div className="text-orange-100 text-sm font-medium">Skills Mastered</div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.projects.map(project => (
                <div
                  key={project.id}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                >
                  {/* Project Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Week {project.week} • {new Date(project.completion_date).toLocaleDateString()}
                        </p>
                      </div>
                      {project.featured && (
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs font-medium text-white bg-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Grade */}
                    {project.grade && (
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Grade:</span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          project.grade >= 90 ? 'bg-green-600/20 text-green-400' :
                          project.grade >= 80 ? 'bg-blue-600/20 text-blue-400' :
                          project.grade >= 70 ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {project.grade}%
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition"
                          title="View Project"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareProject(project)}
                          className="p-2 text-green-400 hover:text-green-300 transition"
                          title="Share Project"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        {project.live_demo_url && (
                          <a
                            href={project.live_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-purple-400 hover:text-purple-300 transition"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          const blob = new Blob([project.code], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}.py`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition"
                      >
                        <Download className="w-3 h-3" />
                        <span>Code</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Project Placeholder */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-600 p-6 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-colors">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-white font-semibold mb-2">Keep Building!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Complete more assignments to add projects to your portfolio
                </p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
                  View Assignments
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">About Me</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Bio</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {portfolio.bio}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <GraduationCap className="w-5 h-5 text-blue-400" />
                      <span>CodeFly Academy Student</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <span>Portfolio Updated: {new Date(portfolio.last_updated).toLocaleDateString()}</span>
                    </div>
                    {portfolio.github_username && (
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Github className="w-5 h-5 text-purple-400" />
                        <a 
                          href={`https://github.com/${portfolio.github_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition"
                        >
                          @{portfolio.github_username}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Programming Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {portfolio.skills.map(skill => (
                      <span
                        key={skill}
                        className={`px-3 py-2 rounded-lg text-white text-sm font-medium ${getSkillColor(skill)}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">Achievements & Badges</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.badges.map(badge => (
                  <div
                    key={badge}
                    className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/30 text-center"
                  >
                    <div className="text-4xl mb-3">{getBadgeIcon(badge)}</div>
                    <h3 className="text-white font-semibold mb-2">{badge}</h3>
                    <p className="text-gray-400 text-sm">
                      Earned through consistent progress and achievement
                    </p>
                  </div>
                ))}
                
                {/* XP Milestones */}
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 text-center">
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="text-white font-semibold mb-2">XP Master</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {portfolio.total_xp.toLocaleString()} Total Experience Points
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (portfolio.total_xp % 1000) / 10)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {1000 - (portfolio.total_xp % 1000)} XP to next level
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deploy' && viewMode === 'owner' && (
          <div className="space-y-8">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Github className="w-8 h-8 mr-3 text-purple-400" />
                GitHub Pages Deployment
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Deployment Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        value={deploymentConfig.github_username}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, github_username: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="your-github-username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Repository Name
                      </label>
                      <input
                        type="text"
                        value={deploymentConfig.repository_name}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, repository_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="my-portfolio"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Template Style
                      </label>
                      <select
                        value={deploymentConfig.template}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, template: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      >
                        <option value="minimal">Minimal</option>
                        <option value="professional">Professional</option>
                        <option value="showcase">Showcase</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Custom Domain (Optional)
                      </label>
                      <input
                        type="text"
                        value={deploymentConfig.custom_domain}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, custom_domain: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="myportfolio.com"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="auto-deploy"
                        checked={deploymentConfig.auto_deploy}
                        onChange={(e) => setDeploymentConfig(prev => ({ ...prev, auto_deploy: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                      />
                      <label htmlFor="auto-deploy" className="text-gray-300 text-sm">
                        Auto-deploy when completing assignments
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDeployToGitHub}
                    disabled={deploymentStatus.deploying || !deploymentConfig.github_username}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition flex items-center justify-center space-x-2"
                  >
                    {deploymentStatus.deploying ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4" />
                        <span>Deploy to GitHub Pages</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Preview & Status */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio Preview</h3>
                  
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-white font-semibold">{portfolio.student_name}</h4>
                      <p className="text-gray-400 text-sm">CodeFly Academy Portfolio</p>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Projects:</span>
                        <span className="text-white">{portfolio.projects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Skills:</span>
                        <span className="text-white">{portfolio.skills.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Badges:</span>
                        <span className="text-white">{portfolio.badges.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-yellow-400">Level {Math.floor(portfolio.total_xp / 1000) + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Deployment Status */}
                  {deploymentStatus.success && (
                    <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-400 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Portfolio Deployed Successfully!</span>
                      </div>
                      <a
                        href={deploymentStatus.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm transition flex items-center space-x-1"
                      >
                        <span>{deploymentStatus.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  {deploymentStatus.error && (
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-400 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Deployment Failed</span>
                      </div>
                      <p className="text-red-300 text-sm">{deploymentStatus.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <Code className="w-6 h-6 text-blue-400" />
                  {selectedProject.title}
                </h3>
                <p className="text-gray-400">Week {selectedProject.week} • {selectedProject.grade ? `Grade: ${selectedProject.grade}%` : ''}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Info */}
              <div>
                <h4 className="text-white font-semibold mb-3">Project Details</h4>
                <p className="text-gray-300 mb-4">{selectedProject.description}</p>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-medium mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-sm font-medium text-white bg-blue-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-white font-medium mb-2">Project Stats</h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-900/20 rounded p-3 text-center">
                        <div className="text-blue-400 font-bold">Week {selectedProject.week}</div>
                        <div className="text-blue-300">Assignment</div>
                      </div>
                      {selectedProject.grade && (
                        <div className="bg-green-900/20 rounded p-3 text-center">
                          <div className="text-green-400 font-bold">{selectedProject.grade}%</div>
                          <div className="text-green-300">Grade</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code */}
              <div>
                <h4 className="text-white font-semibold mb-3">Source Code</h4>
                <div className="bg-gray-900 rounded-lg p-4 h-80 overflow-y-auto">
                  <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                    {selectedProject.code}
                  </pre>
                </div>
                
                <h4 className="text-white font-semibold mb-3 mt-4">Output</h4>
                <div className="bg-gray-900 rounded-lg p-4 h-32 overflow-y-auto">
                  <pre className="text-sm text-cyan-400 whitespace-pre-wrap font-mono">
                    {selectedProject.output}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedProject.completion_date).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleShareProject(selectedProject)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([selectedProject.code], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}.py`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}