'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, Zap, Eye, Users, Lightbulb, Target, Award } from 'lucide-react'

interface CodeLine {
  id: string
  content: string
  explanation?: string
  isHighlighted?: boolean
  suggestedBy?: 'student' | 'teacher'
}

interface InteractiveCodingPlaygroundProps {
  initialChallenge: {
    title: string
    description: string
    startingCode: string
    goal: string
    hints: string[]
  }
  onComplete?: (code: string, attempts: number) => void
}

export default function InteractiveCodingPlayground({ 
  initialChallenge, 
  onComplete 
}: InteractiveCodingPlaygroundProps) {
  const [codeLines, setCodeLines] = useState<CodeLine[]>([])
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showTeacherTyping, setShowTeacherTyping] = useState(false)
  const [teacherSuggestion, setTeacherSuggestion] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize code lines from starting code
    const lines = initialChallenge.startingCode.split('\n').map((line, index) => ({
      id: `line-${index}`,
      content: line,
      isHighlighted: false,
      suggestedBy: 'teacher' as const
    }))
    setCodeLines(lines)
  }, [initialChallenge.startingCode])

  // Simulate AI teacher providing real-time assistance
  const simulateTeacherAssistance = () => {
    setShowTeacherTyping(true)
    
    setTimeout(() => {
      setShowTeacherTyping(false)
      
      const suggestions = [
        "Try adding a print() statement to see what's happening! 🖨️",
        "Remember to check your variable names - they need to match exactly! 🏷️",
        "Don't forget the colon : at the end of your if statement! ⭐",
        "Great progress! Try running it to see what happens next! 🚀",
        "You're so close! Check your indentation - Python is picky about spaces! 📐"
      ]
      
      setTeacherSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
      
      // Clear suggestion after 5 seconds
      setTimeout(() => setTeacherSuggestion(null), 5000)
    }, 2000)
  }

  const runCode = () => {
    setIsRunning(true)
    setAttempts(prev => prev + 1)
    
    const fullCode = codeLines.map(line => line.content).join('\n')
    
    // Simulate code execution with educational feedback
    setTimeout(() => {
      try {
        // Simple code simulation for educational purposes
        let result = ''
        const lines = fullCode.split('\n')
        
        for (const line of lines) {
          const trimmedLine = line.trim()
          if (trimmedLine.startsWith('print(')) {
            const match = trimmedLine.match(/print\((.*)\)/)
            if (match) {
              const content = match[1].replace(/['"]/g, '')
              result += content + '\n'
            }
          }
        }
        
        if (result) {
          setOutput(`🎉 Success! Your code output:\n\n${result}\n✨ Great job! You're thinking like a programmer!`)
          setScore(prev => prev + 10)
          
          // Check for achievements
          if (attempts === 1) {
            setAchievements(prev => [...prev, "First Try Champion! 🏆"])
          }
          if (fullCode.includes('input(')) {
            setAchievements(prev => [...prev, "Interactive Coder! 🎮"])
          }
          
          onComplete?.(fullCode, attempts)
        } else {
          setOutput(`🤔 Hmm, I don't see any output yet. Try adding some print() statements to see your code in action!\n\n💡 Tip: print("Hello World") will display text on screen!`)
          simulateTeacherAssistance()
        }
      } catch (error) {
        setOutput(`🐛 Oops! There's a small bug to fix:\n\n${error}\n\n🤖 Don't worry - every programmer deals with bugs! Let me help you fix it.`)
        simulateTeacherAssistance()
      }
      
      setIsRunning(false)
    }, 1500)
  }

  const addCodeLine = (content: string = '', suggestedBy: 'student' | 'teacher' = 'student') => {
    const newLine: CodeLine = {
      id: `line-${Date.now()}`,
      content,
      suggestedBy,
      isHighlighted: true
    }
    
    setCodeLines(prev => [...prev, newLine])
    
    // Remove highlight after animation
    setTimeout(() => {
      setCodeLines(prev => prev.map(line => 
        line.id === newLine.id ? { ...line, isHighlighted: false } : line
      ))
    }, 2000)
  }

  const updateCodeLine = (id: string, content: string) => {
    setCodeLines(prev => prev.map(line =>
      line.id === id ? { ...line, content } : line
    ))
  }

  const getHint = () => {
    if (currentHint < initialChallenge.hints.length - 1) {
      setCurrentHint(prev => prev + 1)
    }
  }

  const resetCode = () => {
    const lines = initialChallenge.startingCode.split('\n').map((line, index) => ({
      id: `line-${index}`,
      content: line,
      isHighlighted: false,
      suggestedBy: 'teacher' as const
    }))
    setCodeLines(lines)
    setOutput('')
    setAttempts(0)
    setCurrentHint(0)
    setTeacherSuggestion(null)
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-6 text-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-400 animate-pulse" />
              {initialChallenge.title}
            </h3>
            <p className="text-blue-200 mt-1">{initialChallenge.description}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-400">Score: {score}</div>
            <div className="text-sm text-gray-300">Attempts: {attempts}</div>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <Target className="h-5 w-5 mr-2 text-yellow-400" />
            <span className="font-bold text-yellow-300">Your Mission:</span>
          </div>
          <p className="text-yellow-100">{initialChallenge.goal}</p>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold animate-bounce"
              >
                <Award className="h-4 w-4 inline mr-1" />
                {achievement}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Code Editor */}
        <div className="space-y-4">
          <div className="bg-black/50 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-400" />
                Collaborative Code Editor
              </h4>
              <button
                onClick={() => addCodeLine()}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                + Add Line
              </button>
            </div>

            <div className="space-y-2 font-mono text-sm">
              {codeLines.map((line, index) => (
                <div
                  key={line.id}
                  className={`flex items-center space-x-2 transition-all duration-500 ${
                    line.isHighlighted ? 'bg-yellow-400/20 border border-yellow-400/50 rounded' : ''
                  }`}
                >
                  <span className="text-gray-400 w-8 text-right">{index + 1}</span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={line.content}
                      onChange={(e) => updateCodeLine(line.id, e.target.value)}
                      className="w-full bg-transparent text-green-400 border-none outline-none"
                      placeholder="# Type your code here..."
                    />
                    {line.suggestedBy === 'teacher' && (
                      <div className="absolute -right-6 top-0 text-blue-400">
                        👨‍🏫
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Teacher Suggestion */}
          {(showTeacherTyping || teacherSuggestion) && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
                  🤖
                </div>
                <span className="font-bold text-blue-300">Your AI Teacher</span>
              </div>
              {showTeacherTyping ? (
                <div className="flex items-center text-blue-200">
                  <span>is typing</span>
                  <div className="flex space-x-1 ml-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              ) : (
                <p className="text-blue-100">{teacherSuggestion}</p>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex space-x-3">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </button>
            
            <button
              onClick={getHint}
              disabled={currentHint >= initialChallenge.hints.length - 1}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Hint
            </button>
            
            <button
              onClick={resetCode}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>

          {/* Hint Display */}
          {currentHint < initialChallenge.hints.length && (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="font-bold text-yellow-300">Hint {currentHint + 1}:</span>
              </div>
              <p className="text-yellow-100">{initialChallenge.hints[currentHint]}</p>
            </div>
          )}
        </div>

        {/* Live Output & Visualization */}
        <div className="space-y-4">
          <div className="bg-black/50 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
            <h4 className="font-bold mb-4 flex items-center">
              <Eye className="h-4 w-4 mr-2 text-green-400" />
              Live Output
            </h4>
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap min-h-[200px] bg-black/30 rounded p-3">
              {output || "Click 'Run Code' to see your program in action! ✨"}
            </pre>
          </div>

          {/* Real-time Code Analysis */}
          <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
            <h4 className="font-bold mb-3 text-purple-300">Code Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Lines of code:</span>
                <span className="text-purple-300">{codeLines.filter(line => line.content.trim()).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Variables used:</span>
                <span className="text-purple-300">
                  {new Set(
                    codeLines
                      .join('\n')
                      .match(/\b[a-zA-Z_][a-zA-Z0-9_]*\s*=/g)?.map(v => v.split('=')[0].trim()) || []
                  ).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Functions called:</span>
                <span className="text-purple-300">
                  {(codeLines.join('\n').match(/\b\w+\(/g) || []).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}