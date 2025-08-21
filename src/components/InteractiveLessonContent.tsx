'use client'

import { useState, useEffect } from 'react'
import InteractiveReveal from './InteractiveReveal'
import ConceptCheck from './ConceptCheck'
import HoverDefinition from './HoverDefinition'
import MiniDemo from './MiniDemo'
import LearningProgressTracker from './LearningProgressTracker'
import InteractiveSectionNavigator from './InteractiveSectionNavigator'
import CompactLearningSection from './CompactLearningSection'

interface InteractiveLessonContentProps {
  onSectionComplete?: (sectionIndex: number) => void
}

export default function InteractiveLessonContent({ onSectionComplete }: InteractiveLessonContentProps) {
  const [completedSections, setCompletedSections] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))

  const sections = [
    "What is ML?",
    "AI vs ML", 
    "Key Vocab",
    "Training & Accuracy",
    "Bias & Ethics",
    "Real Applications",
    "Your Mission"
  ]

  const sectionColors = ['blue', 'purple', 'green', 'orange', 'pink', 'yellow', 'red'] as const

  const toggleSectionExpansion = (sectionIndex: number) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(sectionIndex)) {
        newExpanded.delete(sectionIndex)
      } else {
        newExpanded.add(sectionIndex)
      }
      return newExpanded
    })
  }

  const handleSectionSelect = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
    setExpandedSections(new Set([sectionIndex]))
  }

  const markSectionComplete = (sectionIndex: number) => {
    if (sectionIndex === completedSections) {
      setCompletedSections(prev => prev + 1)
      onSectionComplete?.(sectionIndex)
    }
  }

  useEffect(() => {
    // Auto-expand first section
    setExpandedSections(new Set([0]))
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <InteractiveSectionNavigator
        sections={sections}
        currentSection={currentSection}
        completedSections={completedSections}
        onSectionSelect={handleSectionSelect}
      />

      <div className="space-y-4">
        {/* Section 1: What is Machine Learning? */}
        <CompactLearningSection
          title="What Exactly IS Machine Learning?"
          emoji="🧠"
          isExpanded={expandedSections.has(0)}
          onToggle={() => toggleSectionExpansion(0)}
          isCompleted={completedSections > 0}
          isActive={currentSection === 0}
          colorScheme={sectionColors[0]}
        >
          
          {/* Professional Definition */}
          <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/30 mb-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">📚 Professional Definition</h3>
            <p className="text-gray-200 leading-relaxed">
              <HoverDefinition 
                term="Machine Learning" 
                definition="A subset of artificial intelligence that enables computers to learn and improve performance on a specific task through experience, without being explicitly programmed for every scenario"
              >
                Machine Learning
              </HoverDefinition> is a method of data analysis that automates the building of analytical models. It uses algorithms that iteratively learn from data, allowing computers to find hidden insights and make predictions or decisions without being explicitly programmed for each specific scenario.
            </p>
          </div>

          {/* Real-World Context */}
          <p className="text-gray-200 text-lg leading-relaxed mb-4">
            You interact with machine learning every day: when your phone recognizes your face, when Netflix recommends shows, when your email filters spam, or when GPS finds the fastest route. All of these systems learned their abilities through training on massive amounts of data.
          </p>

          {/* Analogy Integration */}
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">🐕 Think of it This Way</h3>
            <p className="text-gray-200 mb-3">
              Imagine trying to teach your little cousin to recognize different dog breeds. You wouldn't sit down and write a complex list of rules like:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-blue-200 mb-3">
              <li>"If it's small and fluffy with a curled tail, it's probably a Pomeranian"</li>
              <li>"If it's large with droopy ears and wrinkled skin, it might be a Bloodhound"</li>
            </ul>
            <p className="text-gray-200 mb-3">
              Instead, you'd show them hundreds of pictures of different dogs and tell them the breed each time. Eventually, their brain would start recognizing patterns - the shape of ears, the size of the snout, the texture of fur, body proportions.
            </p>
            <p className="font-semibold text-cyan-300 bg-cyan-900/20 p-3 rounded border border-cyan-500/30">
              Machine Learning works exactly the same way! Instead of programming thousands of specific rules, we show computers tons of examples and let them discover the patterns on their own.
            </p>
          </div>

          <MiniDemo
            title="Try Pattern Recognition"
            description="Think like a machine learning system. Can you spot the pattern?"
            emoji="🎯"
            demoContent={
              <div className="space-y-4">
                <p className="text-white">Look at these sequences. What comes next?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="font-mono">2, 4, 6, 8, ?</p>
                    <p className="text-sm text-gray-400 mt-2">Pattern: Even numbers (Answer: 10)</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="font-mono">🐕, 🐱, 🐕, 🐱, ?</p>
                    <p className="text-sm text-gray-400 mt-2">Pattern: Alternating animals (Answer: 🐕)</p>
                  </div>
                </div>
                <p className="text-green-300 bg-green-900/20 p-3 rounded border border-green-500/30">
                  This is exactly how AI learns - by finding patterns in data! Your brain just did what machine learning algorithms do millions of times.
                </p>
              </div>
            }
          />

          <button
            onClick={() => markSectionComplete(0)}
            className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            ✓ Mark Section Complete
          </button>
        </CompactLearningSection>

        {/* Section 2: AI vs Machine Learning */}
        {completedSections >= 1 && (
          <section className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🆚</span>
              <h2 className="text-2xl font-bold text-purple-300">AI vs. Machine Learning: What's the Real Difference?</h2>
            </div>

            {/* Professional Definitions */}
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 mb-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">📚 Professional Definitions</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-purple-200 font-semibold mb-2">Artificial Intelligence (AI):</p>
                  <p className="text-gray-200">
                    <HoverDefinition 
                      term="Artificial Intelligence" 
                      definition="Computer systems that can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation"
                    >
                      Artificial Intelligence
                    </HoverDefinition> refers to computer systems that can perform tasks that typically require human intelligence - such as recognizing objects, understanding speech, making decisions, solving problems, or translating languages.
                  </p>
                </div>
                <div>
                  <p className="text-purple-200 font-semibold mb-2">Machine Learning (ML):</p>
                  <p className="text-gray-200">
                    Machine Learning is a specific subset of AI that focuses on creating systems that can automatically learn and improve from experience without being explicitly programmed for each task.
                  </p>
                </div>
              </div>
            </div>

            {/* Relationship Explanation */}
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              Think of AI as the big umbrella - it includes any computer system that acts "smart." Machine Learning is one powerful method for creating AI, but there are others like expert systems (rule-based AI) and symbolic reasoning.
            </p>

            {/* Basketball Analogy Integration */}
            <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-500/30 mb-6">
              <h3 className="text-lg font-semibold text-pink-300 mb-3">🏀 Think of it This Way</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">🏀</span>
                  <div>
                    <p className="font-semibold text-purple-300 mb-2">AI is like "being good at basketball"</p>
                    <p className="text-gray-200">It's the end goal - having the ability to play well, make good decisions, score points, and win games.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">🎯</span>
                  <div>
                    <p className="font-semibold text-purple-300 mb-2">Machine Learning is like "getting good through practice"</p>
                    <p className="text-gray-200">It's one way to achieve basketball skill - by shooting thousands of practice shots, learning from each miss and make, gradually improving through experience.</p>
                  </div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                  <p className="text-purple-200 font-semibold mb-2">Other ways to get good at basketball (other AI approaches):</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-200">
                    <li>Memorizing playbooks and strategies (rule-based systems)</li>
                    <li>Analyzing game statistics (symbolic reasoning)</li>
                    <li>Studying videos of great players (expert systems)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Real-World Examples */}
            <div className="bg-gradient-to-r from-purple-900/10 to-pink-900/10 p-4 rounded-lg border border-purple-500/20 mb-6">
              <h4 className="text-purple-300 font-semibold mb-3">🌍 Real-World Examples</h4>
              <ul className="space-y-2 text-gray-200">
                <li><strong className="text-pink-300">AI + ML:</strong> Your phone's camera recognizing faces (learned from millions of photos)</li>
                <li><strong className="text-pink-300">AI without ML:</strong> Chess programs that use pre-programmed strategies</li>
                <li><strong className="text-pink-300">AI + ML:</strong> Netflix recommendations (learned from viewing patterns)</li>
                <li><strong className="text-pink-300">AI without ML:</strong> GPS navigation using mathematical algorithms</li>
              </ul>
            </div>

            <ConceptCheck
              question="Which statement best describes the relationship between AI and Machine Learning?"
              options={[
                "AI and ML are the same thing",
                "ML is one way to create AI systems", 
                "AI is a subset of ML",
                "They are completely unrelated"
              ]}
              correctAnswer={1}
              explanation="Correct! Machine Learning is one specific approach to creating Artificial Intelligence. AI is the broader goal of creating 'smart' computer systems, while ML is a method of achieving that goal through learning from data."
              emoji="🤔"
            />

            <button
              onClick={() => markSectionComplete(1)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Mark Section Complete ✓
            </button>
          </section>
        )}

        {/* Section 3: Essential Vocabulary */}
        {completedSections >= 2 && (
          <section className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📚</span>
              <h2 className="text-2xl font-bold text-green-300">Essential Vocabulary: The Building Blocks of ML</h2>
            </div>

            <div className="space-y-6">
              {/* Labels */}
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold text-green-300 mb-3">🏷️ Labels: The Name Tags of AI</h3>
                
                {/* Professional Definition */}
                <div className="bg-green-900/30 p-3 rounded border border-green-500/30 mb-4">
                  <p className="text-green-200 font-semibold mb-2">Professional Definition:</p>
                  <p className="text-gray-200">
                    <HoverDefinition 
                      term="Labels" 
                      definition="Ground truth annotations that provide the correct classification or target output for training examples, enabling supervised learning algorithms to learn the relationship between input data and desired outputs"
                    >
                      Labels
                    </HoverDefinition> are the ground truth annotations that tell a machine learning algorithm the correct answer for each training example. In supervised learning, labels are the target outputs that the algorithm learns to predict.
                  </p>
                </div>

                {/* Analogy */}
                <div className="bg-emerald-900/20 p-3 rounded border border-emerald-500/30 mb-4">
                  <h4 className="text-emerald-300 font-semibold mb-2">📱 Think of it This Way</h4>
                  <p className="text-gray-200 mb-2">
                    When you organize photos on your phone into albums labeled "Family," "Vacation," or "School," you're creating labels! Each photo gets a category name that describes what it contains.
                  </p>
                  <p className="text-green-300 font-semibold">
                    In our AI project, we'll use three labels: "pencil," "eraser," and "marker" - telling our computer exactly what each school supply image shows.
                  </p>
                </div>

                {/* Real Examples */}
                <div className="text-sm text-gray-300 space-y-1">
                  <p><strong>Email:</strong> "spam" or "not spam"</p>
                  <p><strong>Medical:</strong> "healthy" or "disease present"</p> 
                  <p><strong>Our Project:</strong> "pencil," "eraser," or "marker"</p>
                </div>
              </div>

              {/* Datasets */}
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold text-green-300 mb-3">📁 Datasets: The AI's Learning Library</h3>
                
                {/* Professional Definition */}
                <div className="bg-green-900/30 p-3 rounded border border-green-500/30 mb-4">
                  <p className="text-green-200 font-semibold mb-2">Professional Definition:</p>
                  <p className="text-gray-200">
                    A <HoverDefinition 
                      term="Dataset" 
                      definition="A structured collection of data examples used to train, validate, and test machine learning models, typically consisting of input features and corresponding labels or target outputs"
                    >
                      dataset
                    </HoverDefinition> is a structured collection of examples used to train machine learning models. It contains input data (like images) paired with correct labels, allowing algorithms to learn patterns and make predictions on new, unseen data.
                  </p>
                </div>

                {/* Car Recognition Example */}
                <div className="bg-emerald-900/20 p-3 rounded border border-emerald-500/30 mb-4">
                  <h4 className="text-emerald-300 font-semibold mb-2">🚗 Think of it This Way</h4>
                  <p className="text-gray-200 mb-3">
                    If you wanted to become an expert at identifying car models, you'd study thousands of photos: different angles, lighting conditions, colors, old and new models, clean and dirty cars. The more variety you see, the better you'd recognize cars in any situation.
                  </p>
                  <p className="text-green-300 font-semibold">
                    Our dataset contains hundreds of school supply images, each labeled so our AI can learn what makes a pencil look different from an eraser or marker.
                  </p>
                </div>

                <MiniDemo
                  title="Dataset Quality Check"
                  description="What makes a dataset good or bad for training AI?"
                  emoji="🎯"
                  demoContent={
                    <div className="space-y-4">
                      <p className="text-white font-semibold">For a car recognition dataset:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-700/20 p-3 rounded border border-green-500/30">
                          <p className="font-semibold text-green-300 mb-2">✅ High-Quality Dataset:</p>
                          <ul className="text-sm space-y-1 text-gray-200">
                            <li>• Multiple angles (front, side, rear)</li>
                            <li>• Various lighting (sunny, cloudy, night)</li>
                            <li>• Different colors and conditions</li>
                            <li>• Equal examples of each car type</li>
                            <li>• Clear, focused images</li>
                          </ul>
                        </div>
                        <div className="bg-red-700/20 p-3 rounded border border-red-500/30">
                          <p className="font-semibold text-red-300 mb-2">❌ Poor-Quality Dataset:</p>
                          <ul className="text-sm space-y-1 text-gray-200">
                            <li>• Only one angle (front view only)</li>
                            <li>• Same lighting conditions</li>
                            <li>• Only red sports cars</li>
                            <li>• Unbalanced (1000 sedans, 5 trucks)</li>
                            <li>• Blurry or pixelated images</li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-yellow-700/20 p-3 rounded border border-yellow-500/30">
                        <p className="text-yellow-300 font-semibold">💡 Key Insight:</p>
                        <p className="text-gray-200">Quality beats quantity! 100 diverse, clear images are better than 1,000 similar, blurry ones.</p>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            <button
              onClick={() => markSectionComplete(2)}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Mark Section Complete ✓
            </button>
          </section>
        )}

        {/* Continue with remaining sections... */}
        {completedSections >= 3 && (
          <div className="text-center p-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">🚀 Great Progress!</h3>
            <p className="text-gray-200 mb-4">You've completed the core concepts. Ready for the remaining sections?</p>
            <button
              onClick={() => setCompletedSections(7)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Learning Journey →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}