'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Code, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import CodeEditor from './CodeEditor'
import QuizComponent, { QuizResults } from './QuizComponent'
import InteractiveCodeExample from './InteractiveCodeExample'
import { saveLessonProgress, getLessonProgress } from '@/lib/progress-storage'

interface LessonSection {
  type: 'content' | 'code' | 'quiz'
  title: string
  content?: string
  codeChallenge?: {
    description: string
    startingCode: string
    solution: string
    tests: string[]
    hints?: string[]
  }
  quiz?: {
    type: 'mcq' | 'short'
    q: string
    options?: string[]
    answer?: string
  }[]
}

interface LessonViewerProps {
  title: string
  description: string
  sections: LessonSection[]
  lessonId?: string
  onLessonComplete?: (progress: number) => void
}

export default function LessonViewer({ title, description, sections, lessonId, onLessonComplete }: LessonViewerProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionProgress, setSectionProgress] = useState<Record<number, boolean>>({})
  const [quizResults, setQuizResults] = useState<Record<number, QuizResults>>({})
  const [codeAttempts, setCodeAttempts] = useState<Record<number, string>>({})

  const currentSectionData = sections[currentSection]
  const progress = (Object.keys(sectionProgress).length / sections.length) * 100
  
  // Load saved progress on component mount
  useEffect(() => {
    if (lessonId) {
      const savedProgress = getLessonProgress(lessonId)
      if (savedProgress) {
        setSectionProgress(savedProgress.sectionProgress || {})
        setQuizResults(savedProgress.quizResults as Record<number, QuizResults> || {})
        setCodeAttempts(savedProgress.codeAttempts || {})
      }
    }
  }, [lessonId])

  const markSectionComplete = (sectionIndex: number, additionalData?: { quizResult?: QuizResults, codeAttempt?: string }) => {
    setSectionProgress(prev => ({ ...prev, [sectionIndex]: true }))
    
    // Save to localStorage
    if (lessonId) {
      saveLessonProgress(lessonId, sectionIndex, true, additionalData)
    }
    
    const newProgress = ((Object.keys(sectionProgress).length + 1) / sections.length) * 100
    if (onLessonComplete) {
      onLessonComplete(newProgress)
    }
  }

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(prev => ({ ...prev, [currentSection]: results }))
    markSectionComplete(currentSection, { quizResult: results })
  }

  const handleCodeChallengeComplete = (code?: string) => {
    if (code) {
      setCodeAttempts(prev => ({ ...prev, [currentSection]: code }))
    }
    markSectionComplete(currentSection, { codeAttempt: code })
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const previousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const goToSection = (index: number) => {
    setCurrentSection(index)
  }
  
  const renderContentWithInteractiveExamples = (content: string) => {
    // Split content by interactive examples
    const parts = content.split(/<interactive-example>([\s\S]*?)<\/interactive-example>/g)
    
    return (
      <div>
        {parts.map((part, index) => {
          if (index % 2 === 0) {
            // Regular content
            return (
              <div 
                key={index}
                className="content-with-highlights"
                dangerouslySetInnerHTML={{
                  __html: part
                    ?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    ?.replace(/🎯 (.*?):/g, '<em>🎯 $1:</em>')
                    ?.replace(/---/g, '<hr>')
                    ?.replace(/(\d+\.\s.*?)(?=\n|$)/g, '<div class="formula-step">$1</div>')
                    ?.replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
                    ?.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
                    ?.replace(/\n\n/g, '</p><p>')
                    ?.replace(/^(.*)$/gm, '<p>$1</p>')
                    ?.replace(/<p><\/p>/g, '')
                    ?.replace(/<p>(<hr>)<\/p>/g, '$1')
                    ?.replace(/<p>(<strong>.*?<\/strong>)<\/p>/g, '$1')
                    ?.replace(/<p>(<em>.*?<\/em>)<\/p>/g, '$1')
                    ?.replace(/`(.*?)`/g, '<code>$1</code>') || ''
                }}
              />
            )
          } else {
            // Interactive example
            const lines = part.trim().split('\n')
            let code = ''
            let title = 'Try this code:'
            let description = ''
            
            let currentSection = 'code'
            for (const line of lines) {
              if (line.startsWith('title:')) {
                title = line.replace('title:', '').trim()
                currentSection = 'title'
              } else if (line.startsWith('description:')) {
                description = line.replace('description:', '').trim()
                currentSection = 'description'
              } else if (line.startsWith('code:')) {
                code = line.replace('code:', '').trim()
                currentSection = 'code'
              } else if (currentSection === 'code') {
                code += (code ? '\n' : '') + line
              } else if (currentSection === 'description') {
                description += (description ? ' ' : '') + line.trim()
              }
            }
            
            return (
              <InteractiveCodeExample
                key={index}
                code={code}
                title={title}
                description={description}
              />
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center mb-6">
          <div className="relative">
            <BookOpen className="h-12 w-12 text-blue-400 mr-4 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">✨
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">{title}</h1>
            <p className="text-xl text-gray-300 font-medium">{description}</p>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="bg-gray-700/50 rounded-full h-4 mb-4 border border-gray-600/50 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-300 font-bold">
            🎆 Progress: {Object.keys(sectionProgress).length} of {sections.length} sections completed
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Enhanced Section Navigation */}
      <div className="flex flex-wrap gap-4 mb-8">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg ${
              index === currentSection
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30'
                : sectionProgress[index]
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
            }`}
          >
            <div className="flex items-center">
              {sectionProgress[index] && <CheckCircle className="h-5 w-5 mr-2 animate-pulse" />}
              {section.type === 'content' && <BookOpen className="h-5 w-5 mr-2" />}
              {section.type === 'code' && <Code className="h-5 w-5 mr-2" />}
              {section.type === 'quiz' && <CheckCircle className="h-5 w-5 mr-2" />}
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Enhanced Section Content */}
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Vibrant Section Header */}
        <div className={`px-8 py-6 border-b border-purple-500/30 ${
          currentSectionData.type === 'content' ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50' :
          currentSectionData.type === 'code' ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50' :
          'bg-gradient-to-r from-purple-900/50 to-pink-900/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{currentSectionData.title}</h2>
              <div className="flex items-center text-lg">
                {currentSectionData.type === 'content' && (
                  <><BookOpen className="h-6 w-6 mr-2 text-blue-400 animate-pulse" /> 
                  <span className="text-blue-300 font-bold">📖 Reading & Learning</span></>
                )}
                {currentSectionData.type === 'code' && (
                  <><Code className="h-6 w-6 mr-2 text-green-400 animate-pulse" /> 
                  <span className="text-green-300 font-bold">💻 Hands-On Coding</span></>
                )}
                {currentSectionData.type === 'quiz' && (
                  <><CheckCircle className="h-6 w-6 mr-2 text-purple-400 animate-pulse" /> 
                  <span className="text-purple-300 font-bold">🧠 Knowledge Check</span></>
                )}
                <span className="ml-4 text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full text-sm font-medium">
                  Step {currentSection + 1} of {sections.length}
                </span>
              </div>
            </div>
            {sectionProgress[currentSection] && (
              <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full shadow-lg border border-green-300">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-white animate-bounce" />
                  <div className="text-white">
                    <div className="font-bold">🎉 Section Complete!</div>
                    <div className="text-xs text-green-100">🤖 "Awesome work! You're really getting it!"</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Body */}
        <div className="p-8">
          {/* Enhanced Content Section */}
          {currentSectionData.type === 'content' && (
            <div className="prose max-w-none">
              <div className="text-gray-200 leading-relaxed text-lg font-medium bg-gray-700/30 rounded-xl p-8 border border-gray-600/30">
                {renderContentWithInteractiveExamples(currentSectionData.content || '')}
              </div>
              
              {!sectionProgress[currentSection] && (
                <div className="mt-8 pt-6 border-t border-purple-500/30">
                  <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-4 border border-blue-500/30">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mr-4">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Your AI Teacher Says:</h4>
                        <p className="text-blue-200">"Great job reading through that section! Ready to move forward?"</p>
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm bg-gray-800/50 rounded-lg p-3 border-l-4 border-blue-400">
                      💡 <strong>Learning Tip:</strong> Take your time to understand each concept. There's no rush - I'm here to guide you every step of the way!
                    </div>
                  </div>
                  <button
                    onClick={() => markSectionComplete(currentSection)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-bold text-lg"
                  >
                    <CheckCircle className="h-6 w-6 mr-3 animate-pulse" />
                    🎉 I Understanding This - Let's Continue Learning!
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Code Challenge Section */}
          {currentSectionData.type === 'code' && currentSectionData.codeChallenge && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Challenge:</h3>
                <p className="text-blue-800">{currentSectionData.codeChallenge.description}</p>
              </div>
              
              <CodeEditor
                initialCode={currentSectionData.codeChallenge.startingCode}
                testCode={currentSectionData.codeChallenge.tests.join('\n')}
                solution={currentSectionData.codeChallenge.solution}
                hints={currentSectionData.codeChallenge.hints || []}
                onExecutionResult={(result) => {
                  if (result.success) {
                    handleCodeChallengeComplete()
                  }
                }}
                onCodeChange={(code) => {
                  // Auto-save code as user types (debounced)
                  if (lessonId) {
                    const timeoutId = setTimeout(() => {
                      setCodeAttempts(prev => ({ ...prev, [currentSection]: code }))
                      saveLessonProgress(lessonId, currentSection, sectionProgress[currentSection] || false, { codeAttempt: code })
                    }, 1000)
                    return () => clearTimeout(timeoutId)
                  }
                }}
              />
            </div>
          )}

          {/* Quiz Section */}
          {currentSectionData.type === 'quiz' && currentSectionData.quiz && (
            <div>
              {!sectionProgress[currentSection] ? (
                <QuizComponent
                  quizItems={currentSectionData.quiz}
                  onQuizComplete={handleQuizComplete}
                />
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Completed!</h3>
                  {quizResults[currentSection] && (
                    <p className="text-gray-600">
                      Score: {quizResults[currentSection].score} / {quizResults[currentSection].totalQuestions}
                      ({Math.round((quizResults[currentSection].score / quizResults[currentSection].totalQuestions) * 100)}%)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center mt-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <button
          onClick={previousSection}
          disabled={currentSection === 0}
          className="flex items-center px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          ← Previous Step
        </button>

        <div className="text-center">
          <div className="text-lg font-bold text-purple-300 mb-1">
            Step {currentSection + 1} of {sections.length}
          </div>
          <div className="text-sm text-gray-400">
            {currentSection === 0 ? '🤖 "Welcome to your first lesson! I\'m so excited to teach you!" 🚀' :
             currentSection === sections.length - 1 ? '🤖 "You\'re almost finished! I\'m so proud of your progress!" 🎯' :
             Math.floor(currentSection / sections.length * 100) < 30 ? '🤖 "Great start! You\'re building momentum!" ⚡' :
             Math.floor(currentSection / sections.length * 100) < 70 ? '🤖 "You\'re really getting the hang of this!" 💪' :
             '🤖 "Wow! You\'re crushing this lesson!" 🔥'}
          </div>
        </div>

        <button
          onClick={nextSection}
          disabled={currentSection === sections.length - 1}
          className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold"
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>

      {/* Enhanced Lesson Completion Celebration */}
      {Object.keys(sectionProgress).length === sections.length && (
        <div className="mt-8 p-8 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-2xl border-2 border-green-300 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              LESSON COMPLETE! 🎓
            </h2>
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-4 border border-blue-300">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-white">Your AI Teacher Says:</h3>
              </div>
              <p className="text-white text-lg italic text-center">
                "WOW! I am SO PROUD of you! You just completed an entire coding lesson! 
                You're officially a programmer now! Keep this momentum going - you're amazing! 🌟✨"
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">✅ All Concepts Learned</span>
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold">💻 Code Challenges Completed</span>
              <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold">🧠 Quizzes Aced</span>
            </div>
          </div>
          
          {/* Quiz Results Summary */}
          {Object.keys(quizResults).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-green-900 mb-2">Quiz Results:</h4>
              <div className="space-y-1">
                {Object.entries(quizResults).map(([sectionIndex, results]) => (
                  <div key={sectionIndex} className="text-sm text-green-800">
                    Section {parseInt(sectionIndex) + 1}: {results.score}/{results.totalQuestions} 
                    ({Math.round((results.score / results.totalQuestions) * 100)}%)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}