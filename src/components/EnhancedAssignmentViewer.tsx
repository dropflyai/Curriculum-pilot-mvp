'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BookOpen, Code, HelpCircle, Send, CheckCircle, Clock, 
  Award, Zap, Target, Users, Bot, Play, RotateCcw,
  ChevronRight, ChevronLeft, Trophy, Star, AlertCircle
} from 'lucide-react'
import { assignmentEngine, AssignmentDefinition, StudentProgress } from '@/lib/assignment-engine'
import { assessmentEngine } from '@/lib/assessment-engine'
import { coachNova, TutorContext } from '@/lib/coach-nova'
import { xpEngine } from '@/lib/xp-engine'

interface EnhancedAssignmentViewerProps {
  assignmentId: string
  onBack?: () => void
}

type TabType = 'learn' | 'code' | 'quiz' | 'submit'

export default function EnhancedAssignmentViewer({ assignmentId, onBack }: EnhancedAssignmentViewerProps) {
  const { user } = useAuth()
  const [assignment, setAssignment] = useState<AssignmentDefinition | null>(null)
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('learn')
  const [loading, setLoading] = useState(true)
  
  // Learn Tab State
  const [readingProgress, setReadingProgress] = useState(0)
  
  // Code Tab State  
  const [code, setCode] = useState('')
  const [codeOutput, setCodeOutput] = useState('')
  const [codeErrors, setCodeErrors] = useState<string[]>([])
  const [codeExecutions, setCodeExecutions] = useState(0)
  
  // Quiz Tab State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizResults, setQuizResults] = useState<any>(null)
  
  // Submit Tab State
  const [submitResponse, setSubmitResponse] = useState('')
  const [checklistCompleted, setChecklistCompleted] = useState<boolean[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Coach Nova Integration
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessages, setAIMessages] = useState<any[]>([])
  const [aiInput, setAIInput] = useState('')
  const [aiSessionId, setAISessionId] = useState<string>('')
  
  // XP & Achievement State
  const [xpSummary, setXPSummary] = useState<any>(null)
  const [recentBadges, setRecentBadges] = useState<any[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  // Load assignment and progress data
  useEffect(() => {
    loadAssignmentData()
  }, [assignmentId, user?.id])

  const loadAssignmentData = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      // Load assignment definition (mock for now)
      const mockAssignment: AssignmentDefinition = {
        id: assignmentId,
        week: 1,
        title: "Python Variables & Input/Output",
        assignment_type: 'SOLO',
        duration_minutes: 60,
        unlock_rule: 'sequential',
        objectives: [
          "Create and use variables to store information",
          "Use input() to get user information", 
          "Use print() to display output"
        ],
        standards: ["SC.912.ET.2.2", "SC.912.ET.2.3"],
        learn_md: `# Variables: Your Digital Storage Boxes 📦

Think of variables like labeled storage boxes. Each box has a name and can hold something inside.

## Creating Variables
\`\`\`python
student_name = "Alex"
student_age = 15
\`\`\`

## Getting User Input
\`\`\`python
name = input("What's your name? ")
\`\`\`

## Displaying Output
\`\`\`python
print(f"Hi {name}!")
\`\`\``,
        code_starter: `# Personal Profile Creator
print("Welcome to CodeFly! ✨")

# Your code here:
`,
        code_tests_py: '',
        code_patterns: {
          must_use_calls: ['input', 'print'],
          min_lines: 5
        },
        quiz_items: [
          {
            type: 'mcq',
            question: 'What does `name = input("Your name: ")` do?',
            options: [
              'Prints "Your name:" to screen',
              'Asks user for name and stores it',
              'Creates variable called input',
              'Deletes variable name'
            ],
            answer_index: 1,
            explanation: 'input() asks the user a question and stores their response.',
            points: 1
          }
        ],
        checklist: [
          "I used input() to ask questions",
          "I stored answers in variables", 
          "I used print() to display output",
          "My code runs without errors"
        ],
        submit_prompt: "Describe your Personal Profile Creator. What makes it special?",
        rubric: [{
          name: "Functionality",
          description: "Does the code work correctly?",
          levels: [
            { score: 0, label: "Doesn't Work", description: "Code has errors" },
            { score: 1, label: "Basic", description: "Code works with issues" },
            { score: 2, label: "Good", description: "Code works well" },
            { score: 3, label: "Excellent", description: "Code works perfectly" }
          ]
        }],
        base_xp: 150,
        badges_on_complete: ['first_run', 'ship_it'],
        team_size_min: 1,
        team_size_max: 1,
        allow_draft_day: false,
        late_penalty_percent: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setAssignment(mockAssignment)
      setCode(mockAssignment.code_starter)
      
      // Initialize progress
      await assignmentEngine.initializeProgress(user.id, assignmentId)
      const progressData = await assignmentEngine.getAssignmentProgress(user.id, assignmentId)
      setProgress(progressData)
      
      // Load XP summary
      const xpData = await xpEngine.getStudentXPSummary(user.id)
      setXPSummary(xpData)
      
      // Initialize checklist
      setChecklistCompleted(new Array(mockAssignment.checklist.length).fill(false))
      
    } catch (error) {
      console.error('Error loading assignment:', error)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // TAB COMPLETION TRACKING
  // ==========================================

  const completeTab = async (tab: TabType) => {
    if (!user?.id || !assignment) return
    
    const additionalData: any = {}
    
    if (tab === 'code') {
      additionalData.submitted_code = code
    } else if (tab === 'quiz') {
      additionalData.quiz_answers = quizAnswers
    } else if (tab === 'submit') {
      additionalData.submit_response = submitResponse
    }
    
    await assignmentEngine.updateTabProgress(user.id, assignmentId, tab, true, additionalData)
    
    // Reload progress
    const updatedProgress = await assignmentEngine.getAssignmentProgress(user.id, assignmentId)
    setProgress(updatedProgress)
  }

  // ==========================================
  // CODE EXECUTION SYSTEM
  // ==========================================

  const runCode = async () => {
    if (!assignment) return
    
    try {
      setCodeOutput('Running code...')
      setCodeErrors([])
      setCodeExecutions(prev => prev + 1)
      
      // Validate code patterns
      const validation = assignmentEngine.validateCodeSubmission(code, assignment.code_patterns)
      
      if (!validation.valid) {
        setCodeErrors(validation.errors)
        setCodeOutput('Code validation failed. Check requirements.')
        return
      }
      
      // Simulate code execution (would use Pyodide in real implementation)
      setTimeout(() => {
        setCodeOutput('Program executed successfully! ✅\n\nGreat job! Your code is working correctly.')
        
        // Auto-complete code tab after successful execution
        if (validation.valid && validation.errors.length === 0) {
          completeTab('code')
        }
      }, 1000)
      
    } catch (error) {
      setCodeErrors(['Execution error: ' + (error as Error).message])
      setCodeOutput('Code execution failed.')
    }
  }

  // ==========================================
  // QUIZ SYSTEM
  // ==========================================

  const submitQuiz = () => {
    if (!assignment) return
    
    const results = assignmentEngine.gradeQuiz(quizAnswers, assignment.quiz_items)
    setQuizResults(results)
    setShowQuizResults(true)
    
    // Auto-complete quiz tab if score >= 60%
    if (results.percentage >= 60) {
      completeTab('quiz')
    }
  }

  // ==========================================
  // ASSIGNMENT SUBMISSION
  // ==========================================

  const submitAssignment = async () => {
    if (!user?.id || !assignment) return
    
    try {
      setIsSubmitting(true)
      
      // Grade the complete assignment
      const assessmentResults = await assessmentEngine.gradeAssignment(user.id, assignmentId, {
        criterion_scores: { functionality: 3, understanding: 2, code_quality: 3 }, // Mock rubric scores
        teacher_feedback: 'Auto-graded submission',
        bonus_points: 0,
        late_penalty_applied: false,
        standards_evidence: { 'python-basics': 'proficient' }
      })
      
      if (assessmentResults.success) {
        await completeTab('submit')
        setShowCelebration(true)
        
        // Show celebration message
        setTimeout(() => {
          setShowCelebration(false)
        }, 3000)
      }
      
    } catch (error) {
      console.error('Error submitting assignment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==========================================
  // COACH NOVA INTEGRATION
  // ==========================================

  const askCoachNova = async () => {
    if (!aiInput.trim() || !assignment) return
    
    const context: TutorContext = {
      lessonContent: assignment.learn_md,
      studentCode: code,
      errorMessage: codeErrors.join('\n'),
      attemptCount: codeExecutions,
      timeSpentMinutes: 30, // Would track actual time
      previousHints: aiMessages.filter(m => m.role === 'ai').map(m => m.message)
    }
    
    const policy = {
      mode: 'LEARN' as const,
      scopeLevel: 'TIGHT' as const,
      allowedTopics: ['variables', 'input', 'output', 'print'],
      blockedPhrases: ['homework answers'],
      maxHintsPerAssignment: 5,
      escalationThreshold: 3
    }
    
    // Start session if needed
    if (!aiSessionId) {
      const session = await coachNova.startTutoringSession(user!.id, assignmentId, { assignment_title: assignment.title }, policy)
      if (session.success) {
        setAISessionId(session.session_id)
      }
    }
    
    try {
      const response = await coachNova.generateTutoringResponse(context, aiSessionId, policy)
      
      // Add messages to chat
      setAIMessages(prev => [
        ...prev,
        { role: 'student', message: aiInput, timestamp: new Date() },
        { 
          role: 'ai', 
          message: response.message, 
          helpLevel: response.helpLevel,
          responseType: response.responseType,
          timestamp: new Date()
        }
      ])
      
      setAIInput('')
      
      // Handle escalation
      if (response.shouldEscalate) {
        setAIMessages(prev => [...prev, {
          role: 'system',
          message: "🚨 I've notified your teacher that you might need extra help. They'll check in with you soon!",
          timestamp: new Date()
        }])
      }
      
    } catch (error) {
      console.error('Error with Coach Nova:', error)
    }
  }

  // ==========================================
  // RENDER HELPER FUNCTIONS
  // ==========================================

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'learn': return <BookOpen className="w-5 h-5" />
      case 'code': return <Code className="w-5 h-5" />
      case 'quiz': return <HelpCircle className="w-5 h-5" />
      case 'submit': return <Send className="w-5 h-5" />
    }
  }

  const getTabProgress = (tab: TabType): boolean => {
    return progress?.tab_progress?.[tab] || false
  }

  const calculateOverallProgress = (): number => {
    if (!progress) return 0
    const completed = Object.values(progress.tab_progress || {}).filter(Boolean).length
    return Math.round((completed / 4) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading assignment... ✨</div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Assignment not found 😞</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header with Progress */}
      <div className="bg-gray-800/90 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{assignment.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span>Week {assignment.week}</span>
                  <span>•</span>
                  <span>{assignment.duration_minutes} min</span>
                  <span>•</span>
                  <span>{assignment.base_xp} XP</span>
                </div>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Progress: {calculateOverallProgress()}%
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateOverallProgress()}%` }}
                />
              </div>
              
              {/* XP Display */}
              {xpSummary && (
                <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-lg">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 font-semibold">Level {xpSummary.current_level}</span>
                  <span className="text-yellow-200 text-sm">{xpSummary.total_xp} XP</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {(['learn', 'code', 'quiz', 'submit'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }`}
              >
                {getTabIcon(tab)}
                <span className="capitalize">{tab}</span>
                {getTabProgress(tab) && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Learn Tab */}
            {activeTab === 'learn' && (
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-blue-500/30">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: assignment.learn_md.replace(/```python\n([\s\S]*?)\n```/g, '<pre class="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto"><code>$1</code></pre>') }} />
                </div>
                
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => completeTab('learn')}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      getTabProgress('learn')
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {getTabProgress('learn') ? '✅ Completed' : '📚 Mark as Read'}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('code')}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                  >
                    <span>Ready to Code</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Code Tab */}
            {activeTab === 'code' && (
              <div className="space-y-6">
                {/* Code Editor */}
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
                  <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Code className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">Python Code Editor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={runCode}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                      >
                        <Play className="w-4 h-4" />
                        <span>Run Code</span>
                      </button>
                      <button
                        onClick={() => setCode(assignment.code_starter)}
                        className="p-2 text-gray-400 hover:text-white transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
                    spellCheck={false}
                    placeholder="Write your Python code here..."
                  />
                </div>

                {/* Output Panel */}
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-green-500/30 overflow-hidden">
                  <div className="bg-gray-900 px-4 py-2 border-b border-gray-700">
                    <span className="text-green-400 font-medium">Output</span>
                  </div>
                  <div className="p-4 h-32 overflow-y-auto">
                    {codeErrors.length > 0 ? (
                      <div className="space-y-2">
                        {codeErrors.map((error, index) => (
                          <div key={index} className="text-red-400 text-sm">❌ {error}</div>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-green-400 text-sm whitespace-pre-wrap">{codeOutput || 'Click "Run Code" to see your output...'}</pre>
                    )}
                  </div>
                </div>

                {/* Code Requirements */}
                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/30">
                  <h3 className="text-blue-300 font-semibold mb-3">✅ Code Requirements</h3>
                  <div className="space-y-2">
                    {assignment.code_patterns.must_use_calls?.map((call, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${code.includes(call + '(') ? 'text-green-400' : 'text-gray-500'}`} />
                        <span className={code.includes(call + '(') ? 'text-green-300' : 'text-gray-400'}>
                          Use {call}() function
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 ${code.split('\n').filter(l => l.trim()).length >= (assignment.code_patterns.min_lines || 0) ? 'text-green-400' : 'text-gray-500'}`} />
                      <span className={code.split('\n').filter(l => l.trim()).length >= (assignment.code_patterns.min_lines || 0) ? 'text-green-300' : 'text-gray-400'}>
                        At least {assignment.code_patterns.min_lines} lines of code
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 mr-3 text-yellow-400" />
                  Knowledge Check Quiz
                </h2>
                
                {!showQuizResults ? (
                  <div className="space-y-6">
                    {assignment.quiz_items.map((item, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-white font-semibold mb-4">
                          Question {index + 1}: {item.question}
                        </h3>
                        
                        {item.type === 'mcq' && (
                          <div className="space-y-3">
                            {item.options?.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question_${index}`}
                                  value={option}
                                  onChange={() => setQuizAnswers(prev => ({ ...prev, [index]: option }))}
                                  className="text-blue-600"
                                />
                                <span className="text-gray-300">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        {item.type === 'short' && (
                          <textarea
                            value={quizAnswers[index] || ''}
                            onChange={(e) => setQuizAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                            rows={3}
                            placeholder="Type your answer here..."
                          />
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={submitQuiz}
                      className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
                    >
                      Submit Quiz 🎯
                    </button>
                  </div>
                ) : (
                  // Quiz Results
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {quizResults.percentage}%
                      </div>
                      <div className="text-gray-300">
                        {quizResults.score} / {quizResults.total_points} points
                      </div>
                      {quizResults.percentage >= 90 && <div className="text-2xl mt-2">🏆</div>}
                      {quizResults.percentage >= 70 && quizResults.percentage < 90 && <div className="text-2xl mt-2">🎉</div>}
                      {quizResults.percentage < 70 && <div className="text-2xl mt-2">💪</div>}
                    </div>
                    
                    <div className="space-y-4">
                      {quizResults.results.map((result: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          result.correct ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            {result.correct ? 
                              <CheckCircle className="w-5 h-5 text-green-400" /> :
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            }
                            <span className="text-white font-medium">Question {index + 1}</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{result.explanation}</p>
                          {!result.correct && (
                            <p className="text-gray-400 text-xs">
                              Your answer: {result.student_answer} | Correct: {result.correct_answer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {quizResults.percentage >= 60 && (
                      <button
                        onClick={() => setActiveTab('submit')}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                      >
                        <span>Continue to Submission</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Tab */}
            {activeTab === 'submit' && (
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-green-500/30 space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Send className="w-6 h-6 mr-3 text-green-400" />
                  Submit Your Work
                </h2>
                
                {/* Checklist */}
                <div className="bg-gray-900/50 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">📋 Final Checklist</h3>
                  <div className="space-y-3">
                    {assignment.checklist.map((item, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklistCompleted[index] || false}
                          onChange={(e) => {
                            const updated = [...checklistCompleted]
                            updated[index] = e.target.checked
                            setChecklistCompleted(updated)
                          }}
                          className="rounded"
                        />
                        <span className={`${checklistCompleted[index] ? 'text-green-300' : 'text-gray-300'}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Reflection */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    💭 Reflection
                  </label>
                  <p className="text-gray-400 text-sm mb-3">{assignment.submit_prompt}</p>
                  <textarea
                    value={submitResponse}
                    onChange={(e) => setSubmitResponse(e.target.value)}
                    className="w-full h-32 p-4 bg-gray-900 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500"
                    placeholder="Share your thoughts about this assignment..."
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  onClick={submitAssignment}
                  disabled={isSubmitting || checklistCompleted.filter(Boolean).length < assignment.checklist.length || !submitResponse.trim()}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition text-lg"
                >
                  {isSubmitting ? 'Submitting... ⚡' : '🚀 Submit Assignment'}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Coach Nova AI Assistant */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-cyan-500/30 overflow-hidden">
              <div className="bg-cyan-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Coach Nova</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <button
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className="text-cyan-100 hover:text-white transition"
                >
                  {showAIAssistant ? '−' : '+'}
                </button>
              </div>
              
              {showAIAssistant && (
                <div className="p-4">
                  {/* AI Messages */}
                  <div className="h-48 overflow-y-auto space-y-3 mb-4">
                    {aiMessages.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Bot className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                        <p>Hi! I'm Coach Nova, your AI coding buddy! 🤖</p>
                        <p className="text-sm mt-1">Ask me anything about this assignment!</p>
                      </div>
                    ) : (
                      aiMessages.map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${
                          msg.role === 'student' ? 'bg-blue-600 ml-4' : 'bg-gray-700 mr-4'
                        }`}>
                          <div className="text-white text-sm">{msg.message}</div>
                          {msg.helpLevel && (
                            <div className="text-xs text-gray-300 mt-1">
                              Help Level {msg.helpLevel} • {msg.responseType}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* AI Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAIInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && askCoachNova()}
                      placeholder="Ask for help..."
                      className="flex-1 p-2 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={askCoachNova}
                      className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Assignment Info */}
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-white font-semibold mb-4">🎯 Learning Objectives</h3>
              <div className="space-y-2">
                {assignment.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{objective}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="text-white font-semibold mb-2">🏆 Rewards</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">{assignment.base_xp} XP</span>
                  </div>
                  {assignment.badges_on_complete.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{badge} Badge</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-xl text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-4">Assignment Submitted!</h2>
            <p className="text-green-100 mb-6">
              Great work! Your teacher will review and grade your assignment soon.
            </p>
            <div className="space-y-2 text-green-100">
              <div>+{assignment.base_xp} XP earned! ⚡</div>
              {recentBadges.map((badge, index) => (
                <div key={index}>🏆 {badge.name} badge unlocked!</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}