'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Code, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import CodeEditor from './CodeEditor'
import QuizComponent, { QuizResults } from './QuizComponent'
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
        setQuizResults(savedProgress.quizResults || {})
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
              <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full shadow-lg">
                <CheckCircle className="h-6 w-6 mr-2 text-white animate-bounce" />
                <span className="text-white font-bold">✅ Completed!</span>
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
                <div 
                  className="content-with-highlights"
                  dangerouslySetInnerHTML={{
                    __html: currentSectionData.content
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
              </div>
              
              {!sectionProgress[currentSection] && (
                <div className="mt-8 pt-6 border-t border-purple-500/30">
                  <button
                    onClick={() => markSectionComplete(currentSection)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center font-bold text-lg"
                  >
                    <CheckCircle className="h-6 w-6 mr-3 animate-pulse" />
                    ✅ I&apos;ve Read This - Let&apos;s Continue!
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
                hints={currentSectionData.codeChallenge.hints}
                onCodeChange={() => {}}
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
            {currentSection === 0 ? 'Starting your journey! 🚀' :
             currentSection === sections.length - 1 ? 'Almost done! 🎯' :
             'Keep going! You&apos;re doing great! ⚡'}
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

      {/* Lesson Summary (if all sections completed) */}
      {Object.keys(sectionProgress).length === sections.length && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-green-900">Lesson Complete!</h3>
              <p className="text-green-700">Congratulations on completing this lesson.</p>
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