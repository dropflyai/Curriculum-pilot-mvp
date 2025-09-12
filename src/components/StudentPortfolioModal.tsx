'use client'

import { useState, useMemo } from 'react'
import { X, Code, BookOpen, Trophy, Clock, MessageSquare, Download, Share2, CheckCircle, AlertCircle, Star, Filter, Calendar, FileText, Mail, Printer, TrendingUp, BarChart3 } from 'lucide-react'

interface StudentWork {
  id: string
  type: 'code' | 'quiz' | 'reflection' | 'mission'
  title: string
  content: string
  timestamp: string
  score?: number
  timeSpent: number
  feedback?: string
  badges?: string[]
}

interface StudentPortfolioProps {
  student: {
    id: string
    full_name: string
    email: string
    currentLesson: string
    completedLessons: number
    averageScore: number
    timeSpent: number
    lastSeen: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function StudentPortfolioModal({ student, isOpen, onClose }: StudentPortfolioProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'progress' | 'analytics'>('work')
  
  // Enhanced filtering and export states
  const [workFilter, setWorkFilter] = useState<'all' | 'code' | 'quiz' | 'reflection' | 'mission'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all')
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  // Mock portfolio data - in real implementation, this would come from database
  const studentWork: StudentWork[] = [
    {
      id: 'work-1',
      type: 'code',
      title: 'Variable Declaration Challenge',
      content: `# Agent Data Encryption
agent_name = "Shadow"
mission_code = "BEACON_01"
clearance_level = 5

# Encrypted message
secret_message = f"Agent {agent_name} has clearance level {clearance_level} for {mission_code}"
print(secret_message)`,
      timestamp: '2024-01-15 10:30 AM',
      score: 95,
      timeSpent: 12,
      feedback: 'Excellent use of f-strings for string formatting! Clean variable naming.',
      badges: ['Clean Code', 'First Try Success']
    },
    {
      id: 'work-2',
      type: 'reflection',
      title: 'Operation Beacon Reflection',
      content: 'I learned that variables are like secret agent codenames - they store information that can be used later. The hardest part was understanding when to use quotes around text vs numbers. I got better at debugging by reading error messages carefully.',
      timestamp: '2024-01-15 11:45 AM',
      timeSpent: 8
    },
    {
      id: 'work-3',
      type: 'code',
      title: 'String Manipulation - Cipher Decoder',
      content: `# Variable Village Outpost - String Operations
encrypted_msg = "EGNLLEECXI SI RUOY LAOG"

# Reverse the string to decode
decoded_msg = encrypted_msg[::-1]
print(f"Decoded: {decoded_msg}")

# Additional cipher methods
def simple_cipher(text, shift=1):
    result = ""
    for char in text:
        if char.isalpha():
            shifted = chr((ord(char) - ord('A') + shift) % 26 + ord('A'))
            result += shifted
        else:
            result += char
    return result

test_message = "HELLO AGENT"
encoded = simple_cipher(test_message, 3)
print(f"Encoded: {encoded}")`,
      timestamp: '2024-01-16 02:15 PM',
      score: 88,
      timeSpent: 25,
      feedback: 'Great problem-solving approach! Your cipher function shows good understanding of loops and conditionals.',
      badges: ['Logic Master', 'Creative Solution']
    },
    {
      id: 'work-4',
      type: 'mission',
      title: 'Operation Beacon - Mission Complete',
      content: 'Successfully infiltrated Binary Shores Academy and mastered variable operations. Completed all training modules with 92% accuracy.',
      timestamp: '2024-01-16 03:30 PM',
      score: 92,
      timeSpent: 45,
      badges: ['Mission Complete', 'Agent Certified', 'Variable Master']
    }
  ]

  const learningProgress = [
    {
      concept: 'Variable Declaration',
      status: 'mastered',
      evidence: '95% on variable challenges, clean code practices',
      standardsAlignment: 'SC.912.ET.2.2 - Data representation concepts'
    },
    {
      concept: 'String Manipulation',
      status: 'developing',
      evidence: '88% on string challenges, creative cipher implementation',
      standardsAlignment: 'SC.912.ET.2.4 - String operations and methods'
    },
    {
      concept: 'Debugging Skills',
      status: 'mastered',
      evidence: 'Systematic error resolution, effective use of print statements',
      standardsAlignment: 'SC.912.ET.2.6 - Problem-solving methodologies'
    },
    {
      concept: 'Code Documentation',
      status: 'developing',
      evidence: 'Good comments in complex functions, needs more inline documentation',
      standardsAlignment: 'SC.912.ET.2.1 - Software development practices'
    }
  ]

  const analyticsData = {
    totalMissions: 2,
    completedMissions: 1,
    totalChallenges: 8,
    completedChallenges: 6,
    averageScore: student.averageScore,
    totalTimeSpent: student.timeSpent,
    badgesEarned: 6,
    helpRequests: 2,
    peakLearningTime: '2:00 PM - 3:00 PM',
    learningStreak: 5,
    favoriteActivity: 'Code Challenges'
  }

  // Advanced filtering logic
  const filteredWork = useMemo(() => {
    let filtered = [...studentWork]
    
    // Filter by work type
    if (workFilter !== 'all') {
      filtered = filtered.filter(work => work.type === workFilter)
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = dateFilter === 'week' ? 
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) :
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(work => {
        const workDate = new Date(work.timestamp)
        return workDate >= filterDate
      })
    }
    
    // Filter by score
    if (scoreFilter !== 'all' && scoreFilter !== undefined) {
      filtered = filtered.filter(work => {
        if (!work.score) return scoreFilter === 'low' // No score items go to low
        if (scoreFilter === 'high') return work.score >= 85
        if (scoreFilter === 'medium') return work.score >= 70 && work.score < 85
        if (scoreFilter === 'low') return work.score < 70
        return true
      })
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [workFilter, dateFilter, scoreFilter])

  // Export functions
  const handleExportPDF = () => {
    // Generate comprehensive PDF report
    console.log('Generating PDF portfolio for', student.full_name)
    setShowExportMenu(false)
    // Implementation would create formatted PDF
  }

  const handleExportCSV = () => {
    // Export grades and progress data as CSV
    const csvData = filteredWork.map(work => ({
      timestamp: work.timestamp,
      title: work.title,
      type: work.type,
      score: work.score || 'N/A',
      timeSpent: work.timeSpent,
      feedback: work.feedback || 'None'
    }))
    console.log('Exporting CSV:', csvData)
    setShowExportMenu(false)
  }

  const handleShareParents = () => {
    // Generate parent-friendly progress report
    console.log('Sharing with parents for', student.full_name)
    setShowShareMenu(false)
    // Implementation would email or generate shareable link
  }

  const handleScheduleMeeting = () => {
    // Open calendar to schedule parent-teacher conference
    console.log('Scheduling meeting for', student.full_name)
    setShowShareMenu(false)
  }

  if (!isOpen) return null

  const renderWorkSample = (work: StudentWork) => {
    return (
      <div key={work.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {work.type === 'code' && <Code className="h-5 w-5 text-blue-400" />}
            {work.type === 'reflection' && <MessageSquare className="h-5 w-5 text-green-400" />}
            {work.type === 'mission' && <Trophy className="h-5 w-5 text-yellow-400" />}
            {work.type === 'quiz' && <BookOpen className="h-5 w-5 text-purple-400" />}
            <div>
              <h4 className="text-white font-medium">{work.title}</h4>
              <p className="text-gray-400 text-sm">{work.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {work.score && (
              <div className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                {work.score}%
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="h-3 w-3" />
              {work.timeSpent}m
            </div>
          </div>
        </div>

        <div className="mb-3">
          {work.type === 'code' ? (
            <pre className="bg-gray-900 p-3 rounded text-sm text-gray-300 overflow-x-auto">
              <code>{work.content}</code>
            </pre>
          ) : (
            <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded italic">
              "{work.content}"
            </p>
          )}
        </div>

        {work.feedback && (
          <div className="mb-3 bg-blue-900/20 border border-blue-500/30 rounded p-3">
            <p className="text-blue-200 text-sm">
              <strong>Teacher Feedback:</strong> {work.feedback}
            </p>
          </div>
        )}

        {work.badges && work.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {work.badges.map((badge, index) => (
              <span key={index} className="bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                <Star className="h-3 w-3" />
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {student.full_name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{student.full_name}</h2>
              <p className="text-gray-400">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Share with Parents Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share with Parents
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10">
                  <div className="py-1">
                    <button 
                      onClick={handleShareParents}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email Progress Report
                    </button>
                    <button 
                      onClick={handleScheduleMeeting}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Conference
                    </button>
                    <button 
                      onClick={() => {/* Generate shareable link */}}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Create Shareable Link
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Export Portfolio Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Portfolio
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-10">
                  <div className="py-1">
                    <button 
                      onClick={handleExportPDF}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      PDF Portfolio Report
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      CSV Grade Export
                    </button>
                    <button 
                      onClick={() => {/* Print friendly version */}}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print Version
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('work')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'work'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Work Samples
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'progress'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Learning Progress
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'work' && (
            <div className="space-y-6">
              {/* Enhanced Header with Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Student Work Portfolio</h3>
                  <p className="text-gray-400">{filteredWork.length} of {studentWork.length} submissions shown</p>
                </div>
                
                {/* Advanced Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Work Type Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select 
                      value={workFilter} 
                      onChange={(e) => setWorkFilter(e.target.value as any)}
                      className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                    >
                      <option value="all">All Work</option>
                      <option value="code">Code Projects</option>
                      <option value="quiz">Assessments</option>
                      <option value="reflection">Reflections</option>
                      <option value="mission">Missions</option>
                    </select>
                  </div>
                  
                  {/* Date Filter */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <select 
                      value={dateFilter} 
                      onChange={(e) => setDateFilter(e.target.value as any)}
                      className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                    </select>
                  </div>
                  
                  {/* Performance Filter */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <select 
                      value={scoreFilter} 
                      onChange={(e) => setScoreFilter(e.target.value as any)}
                      className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                    >
                      <option value="all">All Scores</option>
                      <option value="high">High (85%+)</option>
                      <option value="medium">Medium (70-84%)</option>
                      <option value="low">Needs Support (<70%)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Work Samples Display */}
              <div className="space-y-4">
                {filteredWork.length > 0 ? (
                  filteredWork.map(renderWorkSample)
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No work samples match the current filters.</p>
                    <p className="text-sm mt-1">Try adjusting your filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Competency Progress</h3>
              
              <div className="grid gap-4">
                {learningProgress.map((item, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {item.status === 'mastered' ? (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-yellow-400" />
                        )}
                        <div>
                          <h4 className="text-white font-medium">{item.concept}</h4>
                          <p className="text-sm text-gray-400">{item.standardsAlignment}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'mastered' 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-yellow-900/30 text-yellow-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{item.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Advanced Learning Analytics</h3>
                <div className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              {/* Key Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm">Mission Progress</p>
                      <p className="text-2xl font-bold text-white">
                        {analyticsData.completedMissions}/{analyticsData.totalMissions}
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${(analyticsData.completedMissions / analyticsData.totalMissions) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <Trophy className="h-8 w-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">Average Score</p>
                      <p className="text-2xl font-bold text-white">{analyticsData.averageScore}%</p>
                      <p className="text-xs text-green-300 mt-1">↗ +5% this week</p>
                    </div>
                    <Star className="h-8 w-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">Time Invested</p>
                      <p className="text-2xl font-bold text-white">{analyticsData.totalTimeSpent}m</p>
                      <p className="text-xs text-purple-300 mt-1">Peak: {analyticsData.peakLearningTime}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-400" />
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-300 text-sm">Learning Streak</p>
                      <p className="text-2xl font-bold text-white">{analyticsData.learningStreak} days</p>
                      <p className="text-xs text-yellow-300 mt-1">{analyticsData.badgesEarned} badges earned</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Advanced Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Timeline */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Progress Trend
                  </h4>
                  
                  {/* Mock progress chart */}
                  <div className="space-y-3">
                    {['Week 1', 'Week 2', 'Week 3', 'Current'].map((week, index) => {
                      const scores = [75, 82, 88, 85]
                      const score = scores[index]
                      return (
                        <div key={week} className="flex items-center gap-3">
                          <div className="w-16 text-sm text-gray-300">{week}</div>
                          <div className="flex-1 bg-gray-600 rounded-full h-4 relative">
                            <div 
                              className={`h-4 rounded-full ${
                                score >= 85 ? 'bg-green-500' : 
                                score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{width: `${score}%`}}
                            ></div>
                            <span className="absolute right-2 top-0 text-xs text-white leading-4">
                              {score}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Learning Patterns */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Learning Insights
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white font-medium mb-2">Strongest Areas:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Variable Manipulation', 'Code Structure', 'Problem Solving'].map(skill => (
                          <span key={skill} className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white font-medium mb-2">Growth Areas:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Loop Logic', 'Debugging'].map(skill => (
                          <span key={skill} className="bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-white font-medium mb-2">Engagement Pattern:</p>
                      <p className="text-gray-300 text-sm">
                        Most active during afternoon sessions. Prefers hands-on coding challenges over theoretical content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intervention Recommendations */}
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  Teacher Action Items
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-amber-300 font-medium mb-2">Recommended Interventions:</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Provide additional loop practice exercises</li>
                      <li>• Schedule 1-on-1 debugging session</li>
                      <li>• Pair with high-performing peer for collaboration</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-amber-300 font-medium mb-2">Predicted Outcomes:</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• 90% chance of Mission 3 success with support</li>
                      <li>• Strong candidate for advanced challenges</li>
                      <li>• High engagement with creative projects</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}