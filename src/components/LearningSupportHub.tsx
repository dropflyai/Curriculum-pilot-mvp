'use client'

import { useState, useEffect } from 'react'
import { 
  GraduationCap, 
  Lightbulb, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  GitBranch,
  HelpCircle,
  Zap,
  Target,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react'

// Import our learning components
import SmartHintsSystem from './SmartHintsSystem'
import InteractiveFlashcards from './InteractiveFlashcards'
import ResourceCenter from './ResourceCenter'
import ConceptMaps from './ConceptMaps'

interface LearningSupportHubProps {
  currentCode: string
  errorMessage?: string
  lessonContext?: {
    id: string
    title: string
    concepts: string[]
    difficulty: string
  }
  isVisible: boolean
  onClose?: () => void
  onHintUsed?: (hintId: string) => void
  onResourceView?: (resourceId: string) => void
}

type ActiveTab = 'hints' | 'flashcards' | 'resources' | 'concepts' | 'chat'

export default function LearningSupportHub({
  currentCode,
  errorMessage,
  lessonContext,
  isVisible,
  onClose,
  onHintUsed,
  onResourceView
}: LearningSupportHubProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hints')
  const [isMinimized, setIsMinimized] = useState(false)
  const [helpMessages, setHelpMessages] = useState<Array<{
    id: string
    question: string
    answer: string
    timestamp: Date
  }>>([])
  const [helpInput, setHelpInput] = useState('')
  const [studyStats, setStudyStats] = useState({
    hintsUsed: 0,
    flashcardsStudied: 0,
    resourcesViewed: 0,
    conceptsExplored: 0,
    timeSpent: 0
  })

  const [sessionStartTime] = useState(Date.now())

  // Update study stats
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyStats(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionStartTime])

  // Auto-switch to hints when there's an error
  useEffect(() => {
    if (errorMessage && activeTab !== 'hints') {
      setActiveTab('hints')
    }
  }, [errorMessage])

  const handleHintUsed = (hintId: string) => {
    setStudyStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
    onHintUsed?.(hintId)
  }

  const handleResourceView = (resourceId: string) => {
    setStudyStats(prev => ({ ...prev, resourcesViewed: prev.resourcesViewed + 1 }))
    onResourceView?.(resourceId)
  }

  const handleFlashcardProgress = (stats: any) => {
    setStudyStats(prev => ({ 
      ...prev, 
      flashcardsStudied: stats.cardsStudied 
    }))
  }

  const handleConceptExplored = () => {
    setStudyStats(prev => ({ ...prev, conceptsExplored: prev.conceptsExplored + 1 }))
  }

  const handleHelpQuestion = () => {
    if (!helpInput.trim()) return

    const question = helpInput.trim()
    setHelpInput('')

    // Generate contextual answer based on current code and lesson
    const generateAnswer = (question: string): string => {
      const lowerQuestion = question.toLowerCase()
      
      if (lowerQuestion.includes('error') || lowerQuestion.includes('bug')) {
        return `For debugging help:
1. Check the hints tab for specific error guidance
2. Look at the exact error message carefully
3. Common issues: indentation, missing colons, typos
4. Use print() statements to debug step by step

Try the Smart Hints system - it analyzes your current error and provides targeted help!`
      }
      
      if (lowerQuestion.includes('function') || lowerQuestion.includes('def')) {
        return `Functions in Python:
• Use 'def function_name(parameters):' syntax
• Don't forget the colon ':'
• Indent the function body
• Use 'return' to send values back

Example:
def greet(name):
    return f"Hello, {name}!"

Check the flashcards for more function examples!`
      }
      
      if (lowerQuestion.includes('variable') || lowerQuestion.includes('store')) {
        return `Variables store data in Python:
• Simply assign: name = "value"
• No need to declare types
• Use descriptive names: student_age not 'a'
• Follow snake_case convention

Python automatically handles the data type. Check the concept map to see how variables connect to other concepts!`
      }
      
      if (lowerQuestion.includes('loop') || lowerQuestion.includes('repeat')) {
        return `Loops repeat code:
• for item in list: - iterate through items
• while condition: - repeat while true
• Don't forget the colon and indentation

Use the resource center for detailed loop tutorials and examples!`
      }
      
      if (lowerQuestion.includes('class') || lowerQuestion.includes('object')) {
        return `Classes create objects:
• class ClassName: 
• def __init__(self, parameters): for constructor
• self refers to the instance

This is an advanced topic - check the concept map to see prerequisites you might need first!`
      }
      
      // Generic helpful response
      return `Great question! Here are some ways I can help:

🔍 **Smart Hints**: Get context-aware help for your current code
📚 **Flashcards**: Study concepts with spaced repetition
📖 **Resources**: Access tutorials and documentation
🗺️ **Concept Maps**: See how topics connect

For your specific question about "${question}", try:
1. Check the hints tab for immediate help
2. Browse resources for detailed explanations
3. Use concept maps to understand relationships

What specific part would you like to explore further?`
    }

    const newMessage = {
      id: Date.now().toString(),
      question,
      answer: generateAnswer(question),
      timestamp: new Date()
    }

    setHelpMessages(prev => [...prev, newMessage])
  }

  const getTabIcon = (tab: ActiveTab) => {
    switch (tab) {
      case 'hints': return <Lightbulb className="h-4 w-4" />
      case 'flashcards': return <Brain className="h-4 w-4" />
      case 'resources': return <BookOpen className="h-4 w-4" />
      case 'concepts': return <GitBranch className="h-4 w-4" />
      case 'chat': return <MessageSquare className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getTabColor = (tab: ActiveTab) => {
    switch (tab) {
      case 'hints': return activeTab === tab ? 'bg-yellow-600/30 text-yellow-400 border-yellow-500/30' : 'text-yellow-400/70 hover:text-yellow-400'
      case 'flashcards': return activeTab === tab ? 'bg-blue-600/30 text-blue-400 border-blue-500/30' : 'text-blue-400/70 hover:text-blue-400'
      case 'resources': return activeTab === tab ? 'bg-green-600/30 text-green-400 border-green-500/30' : 'text-green-400/70 hover:text-green-400'
      case 'concepts': return activeTab === tab ? 'bg-purple-600/30 text-purple-400 border-purple-500/30' : 'text-purple-400/70 hover:text-purple-400'
      case 'chat': return activeTab === tab ? 'bg-cyan-600/30 text-cyan-400 border-cyan-500/30' : 'text-cyan-400/70 hover:text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-slate-900 border-l border-green-500/30 z-40 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-green-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-6 w-6 text-green-400" />
            <div>
              <h3 className="text-green-300 font-medium">Learning Support</h3>
              <p className="text-green-500/70 text-xs">
                Study time: {formatTime(studyStats.timeSpent)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-green-400 hover:text-green-300 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Study Stats */}
        {!isMinimized && (
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
            <div className="text-center">
              <div className="text-yellow-400 font-bold">{studyStats.hintsUsed}</div>
              <div className="text-green-500/50">Hints</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">{studyStats.flashcardsStudied}</div>
              <div className="text-green-500/50">Cards</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">{studyStats.resourcesViewed}</div>
              <div className="text-green-500/50">Resources</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold">{studyStats.conceptsExplored}</div>
              <div className="text-green-500/50">Concepts</div>
            </div>
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-green-500/30">
            {(['hints', 'flashcards', 'resources', 'concepts', 'chat'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center space-x-1 py-3 px-2 border-b-2 transition-colors text-xs ${getTabColor(tab)}`}
              >
                {getTabIcon(tab)}
                <span className="capitalize">{tab}</span>
                {tab === 'hints' && errorMessage && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'hints' && (
              <div className="h-full overflow-y-auto p-4">
                <SmartHintsSystem
                  currentCode={currentCode}
                  errorMessage={errorMessage}
                  lessonContext={lessonContext}
                  onHintUsed={handleHintUsed}
                />
              </div>
            )}

            {activeTab === 'flashcards' && (
              <div className="h-full overflow-y-auto p-4">
                <InteractiveFlashcards
                  lessonContext={lessonContext}
                  onProgress={handleFlashcardProgress}
                />
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="h-full overflow-y-auto p-4">
                <ResourceCenter
                  lessonContext={lessonContext}
                  onResourceView={handleResourceView}
                />
              </div>
            )}

            {activeTab === 'concepts' && (
              <div className="h-full overflow-y-auto p-4">
                <ConceptMaps
                  lessonContext={lessonContext}
                  onNodeClick={handleConceptExplored}
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                {/* Help Chat */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {helpMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-cyan-400 mx-auto mb-4 opacity-50" />
                        <h4 className="text-cyan-300 text-lg mb-2">Need Help?</h4>
                        <p className="text-cyan-500/70 text-sm mb-4">
                          Ask any question about your code or concepts you're learning!
                        </p>
                        <div className="text-left bg-slate-800 rounded-lg p-4 text-sm">
                          <div className="text-cyan-400 font-medium mb-2">Try asking:</div>
                          <ul className="space-y-1 text-cyan-300/70">
                            <li>• "How do I fix this error?"</li>
                            <li>• "What are Python functions?"</li>
                            <li>• "How do loops work?"</li>
                            <li>• "What's wrong with my code?"</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      helpMessages.map((msg) => (
                        <div key={msg.id} className="space-y-3">
                          <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3">
                            <div className="font-medium text-cyan-300 mb-1">You asked:</div>
                            <div className="text-cyan-100 text-sm">{msg.question}</div>
                          </div>
                          <div className="bg-slate-800 border border-green-500/30 rounded-lg p-3">
                            <div className="font-medium text-green-300 mb-1">Learning Assistant:</div>
                            <div className="text-green-100 text-sm whitespace-pre-line">{msg.answer}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Help Input */}
                <div className="border-t border-green-500/30 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={helpInput}
                      onChange={(e) => setHelpInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleHelpQuestion()}
                      placeholder="Ask a question about your code or concepts..."
                      className="flex-1 bg-slate-800 border border-green-500/30 rounded px-3 py-2 text-green-300 placeholder-green-500/50 focus:outline-none focus:border-green-400 text-sm"
                    />
                    <button
                      onClick={handleHelpQuestion}
                      disabled={!helpInput.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white px-4 py-2 rounded transition-colors text-sm"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="flex flex-col space-y-2 p-2">
          {(['hints', 'flashcards', 'resources', 'concepts', 'chat'] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setIsMinimized(false)
              }}
              className={`p-2 rounded transition-colors ${getTabColor(tab)}`}
              title={tab.charAt(0).toUpperCase() + tab.slice(1)}
            >
              {getTabIcon(tab)}
              {tab === 'hints' && errorMessage && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}