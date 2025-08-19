'use client'

import { useState } from 'react'
import { BookOpen, Code, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import CodeEditor from './CodeEditor'
import QuizComponent, { QuizResults } from './QuizComponent'

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
  onLessonComplete?: (progress: number) => void
}

export default function LessonViewer({ title, description, sections, onLessonComplete }: LessonViewerProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionProgress, setSectionProgress] = useState<Record<number, boolean>>({})
  const [quizResults, setQuizResults] = useState<Record<number, QuizResults>>({})

  const currentSectionData = sections[currentSection]
  const progress = (Object.keys(sectionProgress).length / sections.length) * 100

  const markSectionComplete = (sectionIndex: number) => {
    setSectionProgress(prev => ({ ...prev, [sectionIndex]: true }))
    
    const newProgress = ((Object.keys(sectionProgress).length + 1) / sections.length) * 100
    if (onLessonComplete) {
      onLessonComplete(newProgress)
    }
  }

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(prev => ({ ...prev, [currentSection]: results }))
    markSectionComplete(currentSection)
  }

  const handleCodeChallengeComplete = () => {
    markSectionComplete(currentSection)
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600">
          {Object.keys(sectionProgress).length} of {sections.length} sections completed ({Math.round(progress)}%)
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              index === currentSection
                ? 'bg-blue-600 text-white'
                : sectionProgress[index]
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center">
              {sectionProgress[index] && <CheckCircle className="h-4 w-4 mr-1" />}
              {section.type === 'content' && <BookOpen className="h-4 w-4 mr-1" />}
              {section.type === 'code' && <Code className="h-4 w-4 mr-1" />}
              {section.type === 'quiz' && <CheckCircle className="h-4 w-4 mr-1" />}
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Current Section Content */}
      <div className="bg-white rounded-lg shadow-lg">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentSectionData.title}</h2>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                {currentSectionData.type === 'content' && <><BookOpen className="h-4 w-4 mr-1" /> Reading</>}
                {currentSectionData.type === 'code' && <><Code className="h-4 w-4 mr-1" /> Coding Challenge</>}
                {currentSectionData.type === 'quiz' && <><CheckCircle className="h-4 w-4 mr-1" /> Quiz</>}
                <span className="ml-2">Section {currentSection + 1} of {sections.length}</span>
              </div>
            </div>
            {sectionProgress[currentSection] && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Section Body */}
        <div className="p-6">
          {/* Content Section */}
          {currentSectionData.type === 'content' && (
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {currentSectionData.content}
              </div>
              
              {!sectionProgress[currentSection] && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => markSectionComplete(currentSection)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Mark as Complete
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
                onCodeChange={() => {}}
                onExecutionResult={(result) => {
                  if (result.success) {
                    handleCodeChallengeComplete()
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

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={previousSection}
          disabled={currentSection === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="text-sm text-gray-500">
          Section {currentSection + 1} of {sections.length}
        </div>

        <button
          onClick={nextSection}
          disabled={currentSection === sections.length - 1}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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