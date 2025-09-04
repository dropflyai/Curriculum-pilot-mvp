'use client'

import { useState } from 'react'
import { X, Code, BookOpen, Trophy, Clock, MessageSquare, Download, Share2, CheckCircle, AlertCircle, Star } from 'lucide-react'

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
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Share2 className="h-4 w-4" />
              Share with Parents
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              <Download className="h-4 w-4" />
              Export Portfolio
            </button>
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Recent Work Samples</h3>
                <p className="text-gray-400">{studentWork.length} submissions</p>
              </div>
              {studentWork.map(renderWorkSample)}
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
              <h3 className="text-xl font-bold text-white">Learning Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm">Mission Progress</p>
                      <p className="text-2xl font-bold text-white">
                        {analyticsData.completedMissions}/{analyticsData.totalMissions}
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">Average Score</p>
                      <p className="text-2xl font-bold text-white">{analyticsData.averageScore}%</p>
                    </div>
                    <Star className="h-8 w-8 text-green-400" />
                  </div>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">Time Invested</p>
                      <p className="text-2xl font-bold text-white">{analyticsData.totalTimeSpent}m</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-400" />
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-300 text-sm">Badges Earned</p>
                      <p className="text-2xl font-bold text-white">{analyticsData.badgesEarned}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-3">Learning Insights</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Peak Learning Time:</span>
                      <span className="text-white">{analyticsData.peakLearningTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Streak:</span>
                      <span className="text-white">{analyticsData.learningStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Favorite Activity:</span>
                      <span className="text-white">{analyticsData.favoriteActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Help Requests:</span>
                      <span className="text-white">{analyticsData.helpRequests}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-white font-medium mb-3">Next Steps</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-300">• Continue Variable Village Outpost mission</li>
                    <li className="text-gray-300">• Practice more string method combinations</li>
                    <li className="text-gray-300">• Focus on code documentation habits</li>
                    <li className="text-gray-300">• Explore advanced cipher algorithms</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}