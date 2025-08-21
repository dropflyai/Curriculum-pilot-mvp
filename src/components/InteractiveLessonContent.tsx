'use client'

import { useState, useEffect } from 'react'
import InteractiveReveal from './InteractiveReveal'
import ConceptCheck from './ConceptCheck'
import HoverDefinition from './HoverDefinition'
import MiniDemo from './MiniDemo'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { ReactElement } from 'react'

interface InteractiveLessonContentProps {
  onSectionComplete?: (sectionIndex: number) => void
  onReturnToMap?: () => void
}

interface LearningCard {
  id: number
  title: string
  emoji: string
  content: ReactElement
  colorScheme: string
}

export default function InteractiveLessonContent({ onSectionComplete, onReturnToMap }: InteractiveLessonContentProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set())
  const [showingAllCards, setShowingAllCards] = useState(false)

  const learningCards: LearningCard[] = [
    {
      id: 0,
      title: "What Exactly IS Machine Learning?",
      emoji: "🧠",
      colorScheme: "blue",
      content: (
        <div className="space-y-6">
          {/* Professional Definition */}
          <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/30">
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
          <p className="text-gray-200 text-lg leading-relaxed">
            You interact with machine learning every day: when your phone recognizes your face, when Netflix recommends shows, when your email filters spam, or when GPS finds the fastest route. All of these systems learned their abilities through training on massive amounts of data.
          </p>

          {/* Analogy Integration */}
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
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
        </div>
      )
    },
    {
      id: 1,
      title: "AI vs. Machine Learning: What's the Real Difference?",
      emoji: "🆚",
      colorScheme: "purple",
      content: (
        <div className="space-y-6">
          {/* Professional Definitions */}
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
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
          <p className="text-gray-200 text-lg leading-relaxed">
            Think of AI as the big umbrella - it includes any computer system that acts "smart." Machine Learning is one powerful method for creating AI, but there are others like expert systems (rule-based AI) and symbolic reasoning.
          </p>

          {/* Basketball Analogy Integration */}
          <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-500/30">
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
        </div>
      )
    },
    {
      id: 2,
      title: "Essential Vocabulary: The Building Blocks of ML",
      emoji: "📚",
      colorScheme: "green",
      content: (
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
            <div className="bg-emerald-900/20 p-3 rounded border border-emerald-500/30">
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
      )
    },
    {
      id: 3,
      title: "Training & Accuracy: How AI Gets Smart",
      emoji: "🎯",
      colorScheme: "orange",
      content: (
        <div className="space-y-6">
          <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
            <h3 className="text-lg font-semibold text-orange-300 mb-3">🏋️ Training: AI Goes to School</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              Training is when we show our AI thousands of examples so it can learn patterns. Just like you studying flashcards before a test, but the AI studies millions of examples to get really good at recognizing things.
            </p>
            <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
              <p className="text-orange-200 font-semibold mb-2">🚗 Think of it This Way:</p>
              <p className="text-gray-200">
                Learning to drive: You don't just read the manual once and become a perfect driver. You practice for months, make mistakes, learn from them, and gradually get better. AI training works the same way!
              </p>
            </div>
          </div>

          <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
            <h3 className="text-lg font-semibold text-orange-300 mb-3">📊 Accuracy: AI Report Cards</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              Accuracy tells us how often our AI gets the right answer. If it correctly identifies 85 out of 100 school supplies, that's 85% accuracy - pretty good, but there's room for improvement!
            </p>
            <div className="bg-yellow-900/20 p-3 rounded border border-yellow-500/30">
              <p className="text-yellow-300 font-semibold">💡 Real-World Accuracy Examples:</p>
              <ul className="text-gray-200 space-y-1 mt-2">
                <li>• Email spam detection: ~99% accuracy</li>
                <li>• Medical diagnosis: 95-98% accuracy</li>
                <li>• Weather prediction: ~85% accuracy</li>
                <li>• Our school supplies AI: We'll aim for 90%+!</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Bias & Ethics: Building Fair AI",
      emoji: "⚖️",
      colorScheme: "pink",
      content: (
        <div className="space-y-6">
          <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-500/30">
            <h3 className="text-lg font-semibold text-pink-300 mb-3">⚖️ AI Bias: When Computers Learn Bad Habits</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              AI can accidentally learn unfair patterns from biased data. If we only train our school supplies AI on expensive supplies, it might not recognize cheaper versions that many students actually use.
            </p>
            <div className="bg-pink-900/30 p-3 rounded border border-pink-500/30">
              <p className="text-pink-200 font-semibold mb-2">🎯 Real Example:</p>
              <p className="text-gray-200">
                If a hiring AI was trained mostly on resumes from one group of people, it might unfairly reject qualified candidates from other backgrounds. That's why we need diverse, representative data!
              </p>
            </div>
          </div>

          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">🛡️ Building Ethical AI</h3>
            <ul className="space-y-2 text-gray-200">
              <li>• Use diverse, representative datasets</li>
              <li>• Test AI with different groups of people</li>
              <li>• Be transparent about how AI makes decisions</li>
              <li>• Have humans review important AI decisions</li>
              <li>• Continuously monitor for unfair outcomes</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Real Applications: AI in Your Daily Life",
      emoji: "🌍",
      colorScheme: "yellow",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
              <h4 className="text-yellow-300 font-semibold mb-2">📱 Your Phone</h4>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• Face recognition unlock</li>
                <li>• Voice assistant (Siri/Google)</li>
                <li>• Camera scene detection</li>
                <li>• Autocorrect and predictions</li>
              </ul>
            </div>
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
              <h4 className="text-blue-300 font-semibold mb-2">🎮 Entertainment</h4>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• Netflix/Spotify recommendations</li>
                <li>• Video game AI opponents</li>
                <li>• TikTok algorithm</li>
                <li>• YouTube suggested videos</li>
              </ul>
            </div>
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
              <h4 className="text-green-300 font-semibold mb-2">🏠 Daily Life</h4>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• GPS navigation and traffic</li>
                <li>• Email spam filtering</li>
                <li>• Online shopping suggestions</li>
                <li>• Smart home devices</li>
              </ul>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold mb-2">🎓 School & Work</h4>
              <ul className="text-gray-200 space-y-1 text-sm">
                <li>• Language translation</li>
                <li>• Writing assistance tools</li>
                <li>• Online tutoring systems</li>
                <li>• Plagiarism detection</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-900/10 to-orange-900/10 p-4 rounded-lg border border-yellow-500/20">
            <p className="text-yellow-300 font-semibold mb-2">🚀 The Future is Now!</p>
            <p className="text-gray-200">
              AI isn't science fiction anymore - it's already everywhere, making our lives easier and more connected. And now you're learning to build it yourself!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Your Mission: Build an AI School Supply Classifier",
      emoji: "🚀",
      colorScheme: "red",
      content: (
        <div className="space-y-6">
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 text-center">
            <h3 className="text-2xl font-bold text-red-300 mb-4">🎯 Your AI Challenge</h3>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              You're going to build an AI that can look at pictures and correctly identify school supplies: pencils, erasers, and markers. Just like the pros!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/30">
                <div className="text-3xl mb-2">✏️</div>
                <h4 className="text-blue-300 font-semibold">Pencils</h4>
                <p className="text-gray-300 text-sm">Different colors, sizes, mechanical vs wooden</p>
              </div>
              <div className="bg-pink-800/30 p-4 rounded-lg border border-pink-500/30">
                <div className="text-3xl mb-2">🧹</div>
                <h4 className="text-pink-300 font-semibold">Erasers</h4>
                <p className="text-gray-300 text-sm">Pink, white, novelty shapes</p>
              </div>
              <div className="bg-green-800/30 p-4 rounded-lg border border-green-500/30">
                <div className="text-3xl mb-2">🖊️</div>
                <h4 className="text-green-300 font-semibold">Markers</h4>
                <p className="text-gray-300 text-sm">Permanent, whiteboard, colored</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-lg border border-purple-500/30">
            <h4 className="text-purple-300 font-semibold text-lg mb-3">🏆 What You'll Achieve:</h4>
            <ul className="space-y-2 text-gray-200">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Train a real AI model with actual machine learning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Test your AI's accuracy and improve its performance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Understand how bias affects AI and learn to build fair systems</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Use the same concepts that power Google, Tesla, and Netflix!</span>
              </li>
            </ul>
          </div>

          <div className="text-center bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-6 rounded-lg border border-cyan-500/30">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">Ready to Become an AI Engineer?</h3>
            <p className="text-cyan-200 mb-4">You've got the knowledge - now let's put it into action!</p>
          </div>
        </div>
      )
    }
  ]

  const goToNextCard = () => {
    if (currentCardIndex < learningCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
    }
  }

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
    }
  }

  const markCurrentCardComplete = () => {
    const newCompleted = new Set(completedCards)
    newCompleted.add(currentCardIndex)
    setCompletedCards(newCompleted)
    onSectionComplete?.(currentCardIndex)
    
    // Auto advance to next card if not the last one
    if (currentCardIndex < learningCards.length - 1) {
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1)
      }, 500)
    }
  }

  const currentCard = learningCards[currentCardIndex]
  const isCurrentCompleted = completedCards.has(currentCardIndex)
  const allCardsCompleted = completedCards.size === learningCards.length

  const getColorClasses = (colorScheme: string) => {
    const colorMap = {
      blue: 'from-blue-900/30 to-cyan-900/30 border-blue-500/30',
      purple: 'from-purple-900/30 to-pink-900/30 border-purple-500/30',
      green: 'from-green-900/30 to-emerald-900/30 border-green-500/30',
      orange: 'from-orange-900/30 to-red-900/30 border-orange-500/30',
      pink: 'from-pink-900/30 to-rose-900/30 border-pink-500/30',
      yellow: 'from-yellow-900/30 to-amber-900/30 border-yellow-500/30',
      red: 'from-red-900/30 to-orange-900/30 border-red-500/30'
    }
    return colorMap[colorScheme as keyof typeof colorMap] || colorMap.blue
  }

  if (showingAllCards) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with return button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">📚 Knowledge Quest Overview</h2>
          <button
            onClick={() => setShowingAllCards(false)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Flashcards
          </button>
        </div>

        {/* All cards overview */}
        <div className="grid gap-4">
          {learningCards.map((card, index) => (
            <div
              key={card.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                completedCards.has(index) 
                  ? 'bg-green-900/20 border-green-500/50 opacity-75' 
                  : `bg-gradient-to-r ${getColorClasses(card.colorScheme)}`
              }`}
              onClick={() => {
                setCurrentCardIndex(index)
                setShowingAllCards(false)
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{card.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="text-gray-300">Card {index + 1} of {learningCards.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  {completedCards.has(index) && (
                    <span className="text-green-400 text-lg">✓</span>
                  )}
                  {index === currentCardIndex && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Current</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowingAllCards(true)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-sm">View All Cards</span>
          </button>
          <div className="text-sm text-gray-400">
            Card {currentCardIndex + 1} of {learningCards.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onReturnToMap && (
            <button
              onClick={onReturnToMap}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Adventure Map
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{completedCards.size} / {learningCards.length} completed</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCards.size / learningCards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="relative">
        {/* Main Card */}
        <div 
          className={`min-h-[600px] bg-gradient-to-r ${getColorClasses(currentCard.colorScheme)} rounded-3xl p-8 border-2 transition-all duration-500 transform`}
        >
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{currentCard.emoji}</span>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{currentCard.title}</h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Card {currentCardIndex + 1} of {learningCards.length}</span>
                {isCurrentCompleted && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <span>✓</span> Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="mb-8">
            {currentCard.content}
          </div>

          {/* Card Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousCard}
              disabled={currentCardIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentCardIndex === 0
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>

            <div className="flex items-center gap-4">
              {!isCurrentCompleted && (
                <button
                  onClick={markCurrentCardComplete}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    currentCard.colorScheme === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                    currentCard.colorScheme === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                    currentCard.colorScheme === 'green' ? 'bg-green-600 hover:bg-green-700' :
                    currentCard.colorScheme === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                    currentCard.colorScheme === 'pink' ? 'bg-pink-600 hover:bg-pink-700' :
                    currentCard.colorScheme === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-red-600 hover:bg-red-700'
                  } text-white shadow-lg`}
                >
                  ✓ Mark as Mastered
                </button>
              )}
              
              {allCardsCompleted && (
                <button
                  onClick={onReturnToMap}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105 shadow-lg"
                >
                  🚀 Continue Adventure!
                </button>
              )}
            </div>

            <button
              onClick={goToNextCard}
              disabled={currentCardIndex === learningCards.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentCardIndex === learningCards.length - 1
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Card indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {learningCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentCardIndex
                  ? 'bg-white scale-125'
                  : completedCards.has(index)
                    ? 'bg-green-500'
                    : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}