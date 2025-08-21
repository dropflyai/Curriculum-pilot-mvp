'use client'

import { useState, useEffect } from 'react'
import InteractiveReveal from './InteractiveReveal'
import ConceptCheck from './ConceptCheck'
import HoverDefinition from './HoverDefinition'
import MiniDemo from './MiniDemo'
import LearningProgressTracker from './LearningProgressTracker'

interface InteractiveLessonContentProps {
  onSectionComplete?: (sectionIndex: number) => void
}

export default function InteractiveLessonContent({ onSectionComplete }: InteractiveLessonContentProps) {
  const [completedSections, setCompletedSections] = useState(0)
  const [sectionVisibility, setSectionVisibility] = useState<boolean[]>(new Array(7).fill(false))

  const sections = [
    "What is ML?",
    "AI vs ML", 
    "Key Vocab",
    "Accuracy & Bias",
    "Real Applications",
    "Your Mission",
    "Ready to Code"
  ]

  const markSectionComplete = (sectionIndex: number) => {
    if (sectionIndex === completedSections) {
      setCompletedSections(prev => prev + 1)
      onSectionComplete?.(sectionIndex)
    }
  }

  const toggleSectionVisibility = (index: number) => {
    setSectionVisibility(prev => {
      const newVisibility = [...prev]
      newVisibility[index] = !newVisibility[index]
      if (!newVisibility[index] === false) { // If section was just revealed
        setTimeout(() => markSectionComplete(index), 3000) // Auto-complete after 3 seconds of viewing
      }
      return newVisibility
    })
  }

  useEffect(() => {
    // Auto-reveal first section
    setSectionVisibility(prev => {
      const newVisibility = [...prev]
      newVisibility[0] = true
      return newVisibility
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <LearningProgressTracker 
        sections={sections} 
        completedSections={completedSections} 
      />

      <div className="space-y-8">
        {/* Section 1: What is Machine Learning? */}
        <section className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🧠</span>
            <h2 className="text-2xl font-bold text-cyan-300">What Exactly IS Machine Learning?</h2>
          </div>
          
          <p className="text-gray-200 text-lg leading-relaxed mb-4">
            Have you ever wondered how your phone can recognize your face in photos? Or how Netflix knows which shows you might like? 
            All of these amazing abilities come from something called <HoverDefinition 
              term="Machine Learning" 
              definition="A method of teaching computers to learn patterns from data, rather than programming specific rules"
            >
              Machine Learning
            </HoverDefinition> - and today, you're going to discover exactly how it works!
          </p>

          <InteractiveReveal
            title="Dog Breed Teaching Analogy"
            buttonText="🐕 See the Dog Breed Analogy"
            emoji="🐕"
          >
            <div className="space-y-4">
              <p>Imagine trying to teach your little cousin to recognize different dog breeds. You wouldn't sit down and write a list of rules like:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-blue-200">
                <li>"If it's small and fluffy, it's a Pomeranian"</li>
                <li>"If it's big with droopy ears, it's a Bloodhound"</li>
              </ul>
              <p>Instead, you'd show them hundreds of pictures of different dogs and tell them the breed each time. Eventually, their brain would start recognizing patterns - the shape of ears, the size of the snout, the texture of fur.</p>
              <p className="font-semibold text-cyan-300">Machine Learning works exactly the same way! Instead of programming thousands of specific rules, we show computers tons of examples and let them discover patterns.</p>
            </div>
          </InteractiveReveal>

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
                    <p className="text-sm text-gray-400 mt-2">Pattern: Even numbers</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="font-mono">🐕, 🐱, 🐕, 🐱, ?</p>
                    <p className="text-sm text-gray-400 mt-2">Pattern: Alternating animals</p>
                  </div>
                </div>
                <p className="text-green-300">This is exactly how AI learns - by finding patterns in data!</p>
              </div>
            }
          />

          <button
            onClick={() => toggleSectionVisibility(0)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Mark Section Complete ✓
          </button>
        </section>

        {/* Section 2: AI vs Machine Learning */}
        {completedSections >= 1 && (
          <section className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🆚</span>
              <h2 className="text-2xl font-bold text-purple-300">AI vs. Machine Learning: What's the Real Difference?</h2>
            </div>

            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              Think of <HoverDefinition 
                term="Artificial Intelligence" 
                definition="Any computer system that can perform tasks that typically require human intelligence"
              >
                Artificial Intelligence (AI)
              </HoverDefinition> like the concept of "being smart." It's any computer system that can do things we normally think require human intelligence.
            </p>

            <InteractiveReveal
              title="Basketball Skill Analogy"
              buttonText="🏀 Explore the Basketball Analogy"
              emoji="🏀"
            >
              <div className="space-y-4">
                <p className="text-lg font-semibold text-purple-300">Here's a perfect analogy:</p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">🏀</span>
                    <span><strong className="text-purple-300">AI</strong> is like "being good at basketball"</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <span><strong className="text-purple-300">Machine Learning</strong> is like "getting good at basketball by practicing thousands of shots" instead of just memorizing a rulebook</span>
                  </li>
                </ul>
                <p className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                  So when you hear about AI recognizing images or recommending music, it's usually Machine Learning doing the heavy lifting behind the scenes!
                </p>
              </div>
            </InteractiveReveal>

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
                <p className="text-gray-200 mb-3">
                  <HoverDefinition 
                    term="Labels" 
                    definition="The correct answers we give to AI during training - like name tags that tell the computer what each image shows"
                  >
                    Labels
                  </HoverDefinition> are like digital name tags that tell the computer what each image shows.
                </p>

                <InteractiveReveal
                  title="Phone Photo Analogy"
                  buttonText="📱 See the Phone Photo Example"
                  emoji="📱"
                >
                  <p>When you organize photos on your phone into albums labeled "Family," "Vacation," or "School," you're creating labels! In our project, we'll use three labels: "pencil," "eraser," and "marker."</p>
                </InteractiveReveal>
              </div>

              {/* Datasets */}
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                <h3 className="text-xl font-semibold text-green-300 mb-3">📁 Datasets: The AI's Textbook Collection</h3>
                <p className="text-gray-200 mb-3">
                  A <HoverDefinition 
                    term="Dataset" 
                    definition="A collection of examples (like images) that the AI studies to learn patterns - similar to a textbook full of practice problems"
                  >
                    dataset
                  </HoverDefinition> is like a massive digital textbook filled with examples for AI to study.
                </p>

                <MiniDemo
                  title="Build Your Own Dataset"
                  description="Think about what makes a good dataset for recognizing cars"
                  emoji="🚗"
                  demoContent={
                    <div className="space-y-4">
                      <p className="text-white">A good car recognition dataset would include:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-semibold text-green-300">✅ Good Examples:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Different angles</li>
                            <li>• Various lighting</li>
                            <li>• Multiple colors</li>
                            <li>• Old and new cars</li>
                            <li>• Clean and dirty cars</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-red-300">❌ Poor Examples:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Only red cars</li>
                            <li>• Only one brand</li>
                            <li>• Only front view</li>
                            <li>• Only sunny weather</li>
                            <li>• Blurry images</li>
                          </ul>
                        </div>
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