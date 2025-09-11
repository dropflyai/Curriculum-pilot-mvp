'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Brain, Zap, Code2, Lightbulb, Target, Users, Sparkles, Bot, Cpu, MessageSquare, Globe } from 'lucide-react'

interface AITool {
  name: string
  icon: string
  description: string
  strengths: string[]
  bestFor: string[]
  usedInWeeks: number[]
  phase: string
  color: string
}

const AI_TOOLS: AITool[] = [
  {
    name: 'CodeFly Assistant',
    icon: '🤖',
    description: 'Your built-in coding companion powered by OpenAI. Perfect for learning fundamentals and getting quick help.',
    strengths: ['Quick explanations', 'Code debugging', 'Concept reinforcement', 'Error solutions'],
    bestFor: ['Learning basics', 'Understanding errors', 'Code completion', 'Quiz help'],
    usedInWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
    phase: 'Foundation Learning',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Claude (Anthropic)',
    icon: '🧠',
    description: 'Advanced AI assistant for complex reasoning, creative projects, and collaborative coding. Your vibe coding partner!',
    strengths: ['Deep reasoning', 'Creative solutions', 'Complex projects', 'Natural conversation'],
    bestFor: ['Vibe coding', 'Project planning', 'Complex debugging', 'Architecture decisions'],
    usedInWeeks: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    phase: 'Advanced Development',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'GitHub Copilot',
    icon: '🐙',
    description: 'AI pair programmer that suggests code as you type. Industry standard for professional developers.',
    strengths: ['Code completion', 'Pattern recognition', 'Boilerplate generation', 'Real-world context'],
    bestFor: ['Production coding', 'Repetitive tasks', 'API integration', 'Professional workflows'],
    usedInWeeks: [16, 17, 18],
    phase: 'Professional Preparation',
    color: 'from-gray-600 to-gray-800'
  }
]

const AI_PROGRESSION_LESSONS = [
  {
    week: 1,
    title: 'Meet Your AI Coding Companion',
    content: 'Introduction to CodeFly Assistant - why AI helps beginners learn faster',
    skills: ['AI interaction basics', 'Asking good questions', 'Understanding AI responses']
  },
  {
    week: 5,
    title: 'Understanding Different AI Models',
    content: 'Why different AIs exist - specialization vs general purpose',
    skills: ['AI model comparison', 'Choosing right tool', 'Cost vs capability']
  },
  {
    week: 9,
    title: 'Unlocking Advanced AI: Meet Claude',
    content: 'Transition to Claude for complex reasoning and creative coding',
    skills: ['Advanced prompting', 'Creative problem solving', 'AI collaboration']
  },
  {
    week: 14,
    title: 'Professional AI Tools',
    content: 'Introduction to industry-standard AI tools like GitHub Copilot',
    skills: ['Professional workflows', 'Production coding', 'Career preparation']
  }
]

export default function AILiteracy() {
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null)
  const [currentWeek] = useState(9) // Demo: student unlocking Claude

  useEffect(() => {
    const demoMode = localStorage.getItem('codefly_demo_mode') === 'true'
    const demoAuth = localStorage.getItem('demo_authenticated') === 'true'
    
    if (!demoMode && !demoAuth) {
      router.push('/auth')
    }
  }, [router])

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
                href="/agent-academy-intel"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI Literacy Center 🧠
                  </h1>
                  <p className="text-sm text-gray-300">Understanding Your AI Coding Partners</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-white font-semibold">Week {currentWeek} - Claude Unlocked!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🧠✨</div>
            <h2 className="text-3xl font-bold text-white mb-4">Why Different AI Tools?</h2>
            <p className="text-xl text-blue-200 mb-6 max-w-4xl mx-auto">
              Just like you wouldn't use a hammer for everything, different AI tools are designed for different coding tasks. 
              Learn when and why to use each AI assistant in your developer toolkit!
            </p>
          </div>
        </div>

        {/* AI Tools Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {AI_TOOLS.map((tool) => (
            <div
              key={tool.name}
              onClick={() => setSelectedTool(selectedTool?.name === tool.name ? null : tool)}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 cursor-pointer transition-all transform hover:scale-105 ${
                tool.usedInWeeks.includes(currentWeek)
                  ? 'border-green-400/50 ring-2 ring-green-400/30 bg-green-500/10'
                  : currentWeek < Math.min(...tool.usedInWeeks)
                  ? 'border-gray-400/50 opacity-60'
                  : 'border-white/20 hover:border-white/40'
              } ${selectedTool?.name === tool.name ? 'scale-105 border-white/50' : ''}`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{tool.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-300">{tool.phase}</p>
                </div>
                {tool.usedInWeeks.includes(currentWeek) && (
                  <div className="text-green-400 font-bold text-sm">ACTIVE</div>
                )}
              </div>

              <p className="text-gray-300 mb-4">{tool.description}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Best For:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.bestFor.map((item, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Used in Weeks:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.usedInWeeks.map((week) => (
                      <span key={week} className={`px-2 py-1 rounded text-xs ${
                        week === currentWeek ? 'bg-green-500/30 text-green-200' :
                        week < currentWeek ? 'bg-gray-500/30 text-gray-300' :
                        'bg-purple-500/30 text-purple-200'
                      }`}>
                        {week}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTool?.name === tool.name && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white mb-2">Key Strengths:</h4>
                  <ul className="space-y-1">
                    {tool.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center space-x-2">
                        <Zap className="h-3 w-3 text-yellow-400" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Progression Timeline */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <Target className="h-6 w-6 text-purple-400" />
            <span>AI Learning Progression</span>
          </h2>

          <div className="space-y-4">
            {AI_PROGRESSION_LESSONS.map((lesson) => (
              <div
                key={lesson.week}
                className={`p-4 rounded-xl border transition-all ${
                  lesson.week === currentWeek
                    ? 'bg-green-500/20 border-green-400/50 ring-2 ring-green-400/30'
                    : lesson.week < currentWeek
                    ? 'bg-blue-500/20 border-blue-400/50'
                    : 'bg-gray-500/20 border-gray-400/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      lesson.week === currentWeek ? 'bg-green-500' :
                      lesson.week < currentWeek ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {lesson.week}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                      <p className="text-gray-300">{lesson.content}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lesson.skills.map((skill, index) => (
                          <span key={index} className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {lesson.week === currentWeek ? '⚡' :
                     lesson.week < currentWeek ? '✅' : '🔒'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Week Highlight */}
        {currentWeek >= 9 && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">🧠</div>
              <div>
                <h3 className="text-2xl font-bold text-white">Claude Unlocked!</h3>
                <p className="text-purple-200">Ready to experience advanced AI coding assistance</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-3">What's Different About Claude:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-purple-200">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <span>Creative problem solving and brainstorming</span>
                  </li>
                  <li className="flex items-center space-x-2 text-purple-200">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    <span>Natural conversation about complex code</span>
                  </li>
                  <li className="flex items-center space-x-2 text-purple-200">
                    <Code2 className="h-4 w-4 text-green-400" />
                    <span>Vibe coding - describe what you want, get full solutions</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Team Account Sharing:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-purple-200">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span>5 shared Claude accounts for class collaboration</span>
                  </li>
                  <li className="flex items-center space-x-2 text-purple-200">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span>Work with teammates on complex projects</span>
                  </li>
                  <li className="flex items-center space-x-2 text-purple-200">
                    <Bot className="h-4 w-4 text-purple-400" />
                    <span>Learn professional AI collaboration skills</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/claude-access"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>Access Claude for Team Projects</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}