'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Rocket, Smartphone, Globe, Code2, Users, Trophy, Lightbulb, Target, CheckCircle, Star } from 'lucide-react'

interface ProjectOption {
  id: string
  title: string
  description: string
  type: 'web-app' | 'mobile-app' | 'website'
  icon: string
  difficulty: number
  estimatedHours: number
  technologies: string[]
  examples: string[]
  vibePrompts: string[]
}

const PROJECT_OPTIONS: ProjectOption[] = [
  {
    id: 'web-app',
    title: 'Interactive Web Application',
    description: 'Build a full-featured web app with user authentication, data storage, and real-time features',
    type: 'web-app',
    icon: '💻',
    difficulty: 5,
    estimatedHours: 12,
    technologies: ['HTML/CSS', 'JavaScript', 'Local Storage', 'APIs', 'Responsive Design'],
    examples: [
      'Student Habit Tracker with goals and progress charts',
      'Collaborative Study Planner with team features',
      'Personal Finance Manager for teens',
      'Recipe Sharing Community with ratings',
      'Virtual Pet Care Game with daily tasks'
    ],
    vibePrompts: [
      '"Help me build a habit tracker that motivates students with streaks and achievements"',
      '"Create a study planner where friends can share notes and schedule group sessions"',
      '"Build a teen budget app that gamifies saving money with visual progress"'
    ]
  },
  {
    id: 'mobile-app',
    title: 'Mobile-First Application',
    description: 'Design a Progressive Web App (PWA) optimized for mobile devices with offline capabilities',
    type: 'mobile-app',
    icon: '📱',
    difficulty: 4,
    estimatedHours: 10,
    technologies: ['PWA', 'Mobile-First CSS', 'Touch Gestures', 'Offline Storage', 'Push Notifications'],
    examples: [
      'Campus Navigation App with maps and events',
      'Food Truck Tracker with real-time locations',
      'Workout Companion with exercise timers',
      'Language Learning Flashcards with spaced repetition',
      'Social Media Mood Journal with photo uploads'
    ],
    vibePrompts: [
      '"Design a mobile app that helps students find their way around campus"',
      '"Create a workout app with customizable timers and progress tracking"',
      '"Build a language learning app with daily vocabulary challenges"'
    ]
  },
  {
    id: 'website',
    title: 'Professional Website',
    description: 'Create a polished website with modern design, animations, and interactive features',
    type: 'website',
    icon: '🌐',
    difficulty: 3,
    estimatedHours: 8,
    technologies: ['Modern CSS', 'Animations', 'Forms', 'Media Integration', 'SEO Optimization'],
    examples: [
      'Personal Portfolio showcasing coding projects',
      'Local Business Website with booking system',
      'School Club Website with event calendar',
      'Creative Arts Gallery with image lightbox',
      'Community Service Platform connecting volunteers'
    ],
    vibePrompts: [
      '"Help me create a stunning portfolio website that showcases my coding journey"',
      '"Build a website for my school\'s robotics club with event signup forms"',
      '"Design a volunteer matching platform for community service projects"'
    ]
  }
]

const DEVELOPMENT_PHASES = [
  { phase: 'Planning', icon: '📋', tasks: ['Project proposal', 'User stories', 'Technology decisions', 'Team role assignments'] },
  { phase: 'Design', icon: '🎨', tasks: ['Wireframes', 'UI mockups', 'User experience flow', 'Responsive layouts'] },
  { phase: 'Development', icon: '⚡', tasks: ['Core functionality', 'Claude vibe coding sessions', 'Feature implementation', 'Testing'] },
  { phase: 'Polish', icon: '✨', tasks: ['Styling refinements', 'Performance optimization', 'Bug fixes', 'Documentation'] },
  { phase: 'Launch', icon: '🚀', tasks: ['Final testing', 'Deployment', 'Demo preparation', 'Team presentation'] }
]

export default function CapstoneProject() {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null)
  const [userTeam, setUserTeam] = useState<any>(null)
  const [currentWeek] = useState(17)
  const [projectPhase, setProjectPhase] = useState('Planning')

  useEffect(() => {
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
    
    // Check if team already selected a project
    const savedProject = localStorage.getItem('capstone_project')
    if (savedProject) {
      setSelectedProject(JSON.parse(savedProject))
    }
  }, [router])

  const handleSelectProject = (project: ProjectOption) => {
    setSelectedProject(project)
    localStorage.setItem('capstone_project', JSON.stringify(project))
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
                href="/curriculum"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Curriculum</span>
              </Link>
              <div className="flex items-center">
                <Rocket className="h-8 w-8 text-pink-500 mr-3 animate-pulse" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Quantum Breach Capstone 🚀
                  </h1>
                  <p className="text-sm text-gray-300">Weeks 17-18 • Team Final Project</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-500/30">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-semibold">{userTeam.name}</span>
                </div>
              </div>
              <div className="bg-pink-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-pink-500/30">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-semibold">Final Challenge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mission Brief */}
        <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/30 text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-4">The Ultimate Coding Challenge</h2>
          <p className="text-xl text-pink-200 mb-6 max-w-4xl mx-auto">
            Your team has mastered the fundamentals. Now it's time to create something amazing! 
            Build a real web app, mobile app, or website using everything you've learned plus the power of Claude vibe coding.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-pink-200">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team Collaboration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code2 className="h-4 w-4" />
              <span>Claude Vibe Coding</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className="h-4 w-4" />
              <span>Real-World Application</span>
            </div>
          </div>
        </div>

        {/* Project Selection */}
        {!selectedProject ? (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Choose Your Project Type</h3>
              <p className="text-gray-300">Select the type of application your team wants to build</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {PROJECT_OPTIONS.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 cursor-pointer transition-all transform hover:scale-105"
                >
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{project.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    
                    <div className="flex justify-center space-x-4 text-sm text-gray-300 mb-4">
                      <span>Difficulty: {'⭐'.repeat(project.difficulty)}</span>
                      <span>~{project.estimatedHours} hours</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-white mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-white mb-2">Example Projects:</h4>
                      <ul className="space-y-1">
                        {project.examples.slice(0, 3).map((example, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                            <Lightbulb className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105">
                    Select This Project Type
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Project Development Dashboard */
          <div className="space-y-8">
            {/* Selected Project Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedProject.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                    <p className="text-gray-300">{selectedProject.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Change Project
                </button>
              </div>
            </div>

            {/* Development Phases */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Target className="h-6 w-6 text-purple-400" />
                <span>Development Timeline</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {DEVELOPMENT_PHASES.map((phase, index) => (
                  <div
                    key={phase.phase}
                    className={`p-4 rounded-xl border transition-all ${
                      phase.phase === projectPhase
                        ? 'bg-purple-500/20 border-purple-400/50 ring-2 ring-purple-400/30'
                        : index < DEVELOPMENT_PHASES.findIndex(p => p.phase === projectPhase)
                        ? 'bg-green-500/20 border-green-400/50'
                        : 'bg-gray-500/20 border-gray-400/50 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{phase.icon}</div>
                      <h4 className="font-bold text-white mb-3">{phase.phase}</h4>
                      <ul className="space-y-1">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-gray-300 text-xs flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vibe Coding Examples */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Code2 className="h-6 w-6 text-pink-400" />
                <span>Claude Vibe Coding Examples</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">Sample Prompts for Your Project:</h4>
                  <div className="space-y-3">
                    {selectedProject.vibePrompts.map((prompt, index) => (
                      <div key={index} className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-3">
                        <p className="text-pink-200 text-sm italic">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-white mb-3">Vibe Coding Best Practices:</h4>
                  <ul className="space-y-2">
                    <li className="text-gray-300 text-sm flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <span>Start with your big vision, then break into smaller features</span>
                    </li>
                    <li className="text-gray-300 text-sm flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <span>Ask Claude to explain the code it generates</span>
                    </li>
                    <li className="text-gray-300 text-sm flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <span>Iterate on designs - "make this more modern/colorful/interactive"</span>
                    </li>
                    <li className="text-gray-300 text-sm flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <span>Share your progress with teammates for collaboration</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/claude-access"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Code2 className="h-5 w-5" />
                  <span>Start Vibe Coding with Claude</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}