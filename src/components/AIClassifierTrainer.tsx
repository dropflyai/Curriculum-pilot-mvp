'use client'

import { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff, RotateCcw, ZoomIn, Lightbulb, CheckSquare } from 'lucide-react'

interface ClassMetrics {
  accuracy: number
  totalSamples: number
  correctPredictions: number
}

interface OverallMetrics {
  accuracy: number
  totalSamples: number
  correctPredictions: number
  perClassMetrics: Record<string, ClassMetrics>
  confusionMatrix: number[][]
}

interface AIClassifierTrainerProps {
  dataset: string
  labels: string[]
  onMetricsUpdate: (metrics: OverallMetrics) => void
  onTrainingComplete: (success: boolean) => void
}

interface SchoolSupplyItem {
  id: string
  name: string
  category: string
  description: string
  visualFeatures: string[]
  image: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function AIClassifierTrainer({ 
  dataset, 
  labels, 
  onMetricsUpdate, 
  onTrainingComplete 
}: AIClassifierTrainerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [schoolSupplies, setSchoolSupplies] = useState<SchoolSupplyItem[]>([])
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set())
  const [currentMetrics, setCurrentMetrics] = useState<OverallMetrics | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [hasModels, setHasModels] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SchoolSupplyItem | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [gameMode, setGameMode] = useState<'learning' | 'classification' | 'training'>('learning')
  const [classificationScore, setClassificationScore] = useState(0)
  const [classificationAttempts, setClassificationAttempts] = useState(0)

  // Create detailed school supply items with realistic visual differences
  const createSchoolSupplies = (): SchoolSupplyItem[] => {
    const supplies: SchoolSupplyItem[] = []

    // Pencils - various types with clear differences
    const pencilTypes = [
      { name: "Yellow #2 Pencil", description: "Classic yellow wooden pencil with pink eraser", features: ["Yellow wooden body", "Pink eraser tip", "Silver ferrule"], difficulty: 'easy' as const },
      { name: "Mechanical Pencil", description: "Blue mechanical pencil with metal clip", features: ["Blue plastic body", "Metal tip", "Retractable lead"], difficulty: 'medium' as const },
      { name: "Black Pencil", description: "Black wooden pencil with white text", features: ["Black wooden body", "White brand text", "No eraser"], difficulty: 'medium' as const },
      { name: "Red Pencil", description: "Red wooden pencil for marking", features: ["Red wooden body", "Silver text", "Pointed tip"], difficulty: 'easy' as const },
    ]

    // Erasers - different shapes and colors  
    const eraserTypes = [
      { name: "Pink Block Eraser", description: "Traditional rectangular pink eraser", features: ["Rectangular shape", "Pink color", "Soft texture"], difficulty: 'easy' as const },
      { name: "White Eraser", description: "White rectangular eraser", features: ["White color", "Rectangular shape", "Clean edges"], difficulty: 'easy' as const },
      { name: "Kneaded Eraser", description: "Gray moldable eraser", features: ["Gray color", "Irregular shape", "Soft and moldable"], difficulty: 'hard' as const },
      { name: "Pencil Cap Eraser", description: "Small blue cap eraser", features: ["Blue color", "Round shape", "Fits on pencil"], difficulty: 'medium' as const },
    ]

    // Markers - different colors and types
    const markerTypes = [
      { name: "Red Marker", description: "Red permanent marker with black cap", features: ["Red ink", "Black cap", "Thick tip"], difficulty: 'easy' as const },
      { name: "Blue Marker", description: "Blue washable marker", features: ["Blue ink", "Blue cap", "Medium tip"], difficulty: 'easy' as const },
      { name: "Black Sharpie", description: "Black permanent marker", features: ["Black body", "Black cap", "Fine tip"], difficulty: 'medium' as const },
      { name: "Green Highlighter", description: "Yellow-green highlighter marker", features: ["Transparent body", "Green ink", "Chisel tip"], difficulty: 'medium' as const },
    ]

    // Generate items for each category
    pencilTypes.forEach((type, index) => {
      supplies.push({
        id: `pencil-${index}`,
        name: type.name,
        category: 'pencil',
        description: type.description,
        visualFeatures: type.features,
        image: createDetailedSupplyImage('pencil', type.name, index),
        difficulty: type.difficulty
      })
    })

    eraserTypes.forEach((type, index) => {
      supplies.push({
        id: `eraser-${index}`,
        name: type.name,
        category: 'eraser',
        description: type.description,
        visualFeatures: type.features,
        image: createDetailedSupplyImage('eraser', type.name, index),
        difficulty: type.difficulty
      })
    })

    markerTypes.forEach((type, index) => {
      supplies.push({
        id: `marker-${index}`,
        name: type.name,
        category: 'marker',
        description: type.description,
        visualFeatures: type.features,
        image: createDetailedSupplyImage('marker', type.name, index),
        difficulty: type.difficulty
      })
    })

    return supplies
  }

  // Create detailed, educational supply images
  const createDetailedSupplyImage = (category: string, name: string, index: number): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 160
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return ''

    // Clear background
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, 160, 160)

    // Add subtle grid pattern for realism
    ctx.strokeStyle = '#f1f5f9'
    ctx.lineWidth = 1
    for (let i = 0; i < 160; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 160)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(160, i)
      ctx.stroke()
    }

    // Draw based on category and type
    ctx.save()
    ctx.translate(80, 80) // Center the drawing

    if (category === 'pencil') {
      drawPencil(ctx, name, index)
    } else if (category === 'eraser') {
      drawEraser(ctx, name, index)
    } else if (category === 'marker') {
      drawMarker(ctx, name, index)
    }

    ctx.restore()

    // Add category label at bottom
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(name.split(' ').slice(0, 2).join(' '), 80, 145)

    return canvas.toDataURL()
  }

  const drawPencil = (ctx: CanvasRenderingContext2D, name: string, index: number) => {
    if (name.includes('Yellow')) {
      // Yellow #2 Pencil
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(-60, -8, 120, 16)
      // Pink eraser
      ctx.fillStyle = '#f472b6'
      ctx.fillRect(50, -6, 15, 12)
      // Silver ferrule
      ctx.fillStyle = '#9ca3af'
      ctx.fillRect(45, -7, 8, 14)
      // Text
      ctx.fillStyle = '#000'
      ctx.font = '8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('#2', 0, 3)
    } else if (name.includes('Mechanical')) {
      // Mechanical Pencil
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(-50, -6, 100, 12)
      // Metal tip
      ctx.fillStyle = '#6b7280'
      ctx.fillRect(-55, -3, 8, 6)
      // Clip
      ctx.fillStyle = '#374151'
      ctx.fillRect(45, -10, 3, 15)
    } else if (name.includes('Black')) {
      // Black Pencil
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(-60, -8, 120, 16)
      // White text
      ctx.fillStyle = '#fff'
      ctx.font = '6px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('PENCIL', 0, 3)
    } else if (name.includes('Red')) {
      // Red Pencil
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(-60, -8, 120, 16)
      // Silver text
      ctx.fillStyle = '#9ca3af'
      ctx.font = '6px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('RED', 0, 3)
    }
  }

  const drawEraser = (ctx: CanvasRenderingContext2D, name: string, index: number) => {
    if (name.includes('Pink Block')) {
      // Pink rectangular eraser
      ctx.fillStyle = '#f9a8d4'
      ctx.fillRect(-30, -15, 60, 30)
      // Shadow
      ctx.fillStyle = '#ec4899'
      ctx.fillRect(-28, -13, 56, 3)
    } else if (name.includes('White')) {
      // White eraser
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-30, -15, 60, 30)
      ctx.strokeStyle = '#e5e7eb'
      ctx.strokeRect(-30, -15, 60, 30)
    } else if (name.includes('Kneaded')) {
      // Gray kneaded eraser (irregular shape)
      ctx.fillStyle = '#6b7280'
      ctx.beginPath()
      ctx.moveTo(-25, -10)
      ctx.lineTo(20, -15)
      ctx.lineTo(30, 5)
      ctx.lineTo(15, 20)
      ctx.lineTo(-20, 15)
      ctx.lineTo(-30, -5)
      ctx.closePath()
      ctx.fill()
    } else if (name.includes('Cap')) {
      // Blue cap eraser
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(0, 0, 18, 0, Math.PI * 2)
      ctx.fill()
      // Hole
      ctx.fillStyle = '#1e40af'
      ctx.beginPath()
      ctx.arc(0, 0, 8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawMarker = (ctx: CanvasRenderingContext2D, name: string, index: number) => {
    if (name.includes('Red Marker')) {
      // Red marker body
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(-8, -40, 16, 80)
      // Black cap
      ctx.fillStyle = '#000'
      ctx.fillRect(-8, -50, 16, 15)
      // Tip
      ctx.fillStyle = '#991b1b'
      ctx.fillRect(-4, 35, 8, 10)
    } else if (name.includes('Blue Marker')) {
      // Blue marker
      ctx.fillStyle = '#2563eb'
      ctx.fillRect(-8, -40, 16, 80)
      // Blue cap
      ctx.fillStyle = '#1d4ed8'
      ctx.fillRect(-8, -50, 16, 15)
      // Tip
      ctx.fillStyle = '#1e40af'
      ctx.fillRect(-4, 35, 8, 10)
    } else if (name.includes('Sharpie')) {
      // Black Sharpie
      ctx.fillStyle = '#000'
      ctx.fillRect(-6, -40, 12, 80)
      // Cap
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(-6, -48, 12, 12)
      // White text
      ctx.fillStyle = '#fff'
      ctx.font = '6px Arial'
      ctx.textAlign = 'center'
      ctx.save()
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('SHARPIE', 0, 3)
      ctx.restore()
    } else if (name.includes('Highlighter')) {
      // Green highlighter
      ctx.fillStyle = '#84cc16'
      ctx.fillRect(-10, -35, 20, 70)
      // Transparent effect
      ctx.fillStyle = 'rgba(132, 204, 22, 0.3)'
      ctx.fillRect(-8, -33, 16, 66)
      // Chisel tip
      ctx.fillStyle = '#65a30d'
      ctx.fillRect(-6, 30, 12, 8)
    }
  }

  // Initialize school supplies
  useEffect(() => {
    const initModels = async () => {
      setIsLoading(true)
      setLoadingStep('Loading school supplies gallery...')
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const supplies = createSchoolSupplies()
      setSchoolSupplies(supplies)
      
      setHasModels(true)
      setIsLoading(false)
    }

    initModels()
  }, [dataset, labels])

  // Handle student classification attempt
  const handleClassificationAttempt = (supply: SchoolSupplyItem, guessedCategory: string) => {
    setClassificationAttempts(prev => prev + 1)
    
    if (guessedCategory === supply.category) {
      setClassificationScore(prev => prev + 1)
      return true
    }
    return false
  }

  // Training function
  const trainClassifier = async () => {
    setIsTraining(true)
    setLoadingStep('Analyzing school supply features...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoadingStep('Training neural network...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoadingStep('Validating model accuracy...')
    await new Promise(resolve => setTimeout(resolve, 1500))

    const metrics = generateRealisticMetrics()
    setCurrentMetrics(metrics)
    onMetricsUpdate(metrics)
    onTrainingComplete(true)
    
    setIsTraining(false)
    setLoadingStep('')
  }

  // Generate realistic metrics based on flagged items
  const generateRealisticMetrics = (): OverallMetrics => {
    const activeSuppies = schoolSupplies.filter(supply => !flaggedItems.has(supply.id))
    const totalSamples = activeSuppies.length
    
    // Better accuracy if fewer hard items are flagged
    const hardItems = activeSuppies.filter(s => s.difficulty === 'hard').length
    const baseAccuracy = 0.85 - (hardItems * 0.05) // Harder items reduce accuracy
    const finalAccuracy = Math.max(0.6, Math.min(0.95, baseAccuracy + (Math.random() * 0.1)))
    
    const correctPredictions = Math.floor(totalSamples * finalAccuracy)
    
    const perClassMetrics: Record<string, ClassMetrics> = {}
    const confusionMatrix: number[][] = Array(labels.length).fill(null).map(() => Array(labels.length).fill(0))
    
    labels.forEach((label, index) => {
      const classItems = activeSuppies.filter(s => s.category === label)
      const classCorrect = Math.floor(classItems.length * (0.7 + Math.random() * 0.25))
      
      perClassMetrics[label] = {
        accuracy: classItems.length > 0 ? (classCorrect / classItems.length) * 100 : 0,
        totalSamples: classItems.length,
        correctPredictions: classCorrect
      }
      
      // Fill confusion matrix
      for (let i = 0; i < labels.length; i++) {
        if (i === index) {
          confusionMatrix[index][i] = classCorrect
        } else {
          confusionMatrix[index][i] = Math.floor(Math.random() * (classItems.length - classCorrect) / (labels.length - 1))
        }
      }
    })

    return {
      accuracy: finalAccuracy * 100,
      totalSamples,
      correctPredictions,
      perClassMetrics,
      confusionMatrix
    }
  }

  const toggleItemFlag = (itemId: string) => {
    const newFlagged = new Set(flaggedItems)
    if (newFlagged.has(itemId)) {
      newFlagged.delete(itemId)
    } else {
      newFlagged.add(itemId)
    }
    setFlaggedItems(newFlagged)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">{loadingStep}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          🎯 AI School Supply Classifier
        </h3>
        <p className="text-blue-200 mb-4">
          Help train an AI to recognize different school supplies! Click on items to examine them closely, then mark any that seem confusing or mislabeled.
        </p>
        
        {/* Mode Selector */}
        <div className="flex gap-2 mb-4">
          {[
            { mode: 'learning', label: '📚 Learning', desc: 'Explore and examine supplies' },
            { mode: 'classification', label: '🎮 Practice', desc: 'Test your classification skills' },
            { mode: 'training', label: '🤖 AI Training', desc: 'Train the AI model' }
          ].map(({ mode, label, desc }) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                gameMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={desc}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats for classification mode */}
        {gameMode === 'classification' && classificationAttempts > 0 && (
          <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
            <p className="text-blue-200">
              Classification Score: <span className="font-bold text-white">{classificationScore}/{classificationAttempts}</span>
              {classificationAttempts >= 5 && (
                <span className="ml-2">
                  ({Math.round((classificationScore / classificationAttempts) * 100)}% accuracy! 
                  {classificationScore / classificationAttempts >= 0.8 ? " 🌟 Excellent!" : 
                   classificationScore / classificationAttempts >= 0.6 ? " 👍 Good job!" : " 💪 Keep practicing!"})
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Help Toggle */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <Lightbulb className="h-4 w-4" />
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>
        
        {gameMode === 'training' && (
          <div className="flex gap-2">
            <button
              onClick={trainClassifier}
              disabled={isTraining}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isTraining ? 'Training AI...' : '🚀 Train AI Model'}
            </button>
          </div>
        )}
      </div>

      {/* Hints Panel */}
      {showHints && (
        <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
          <h4 className="text-amber-300 font-bold mb-2">🔍 Classification Hints:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="text-yellow-300 font-semibold">✏️ Pencils</h5>
              <ul className="text-amber-200 space-y-1">
                <li>• Long cylindrical shape</li>
                <li>• Usually wooden or plastic</li>
                <li>• May have erasers attached</li>
                <li>• Often yellow, but can be any color</li>
              </ul>
            </div>
            <div>
              <h5 className="text-pink-300 font-semibold">🧽 Erasers</h5>
              <ul className="text-amber-200 space-y-1">
                <li>• Rectangular or rounded blocks</li>
                <li>• Pink, white, or gray colors</li>
                <li>• Soft, moldable texture</li>
                <li>• Some fit on pencil tips</li>
              </ul>
            </div>
            <div>
              <h5 className="text-blue-300 font-semibold">🖊️ Markers</h5>
              <ul className="text-amber-200 space-y-1">
                <li>• Cylindrical with caps</li>
                <li>• Various bright colors</li>
                <li>• Different tip shapes</li>
                <li>• May have transparent bodies</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* School Supplies Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {labels.map(category => {
          const categorySupplies = schoolSupplies.filter(supply => supply.category === category)
          const activeCategorySupplies = categorySupplies.filter(supply => !flaggedItems.has(supply.id))
          
          return (
            <div key={category} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-xl font-bold text-white mb-4 capitalize flex items-center gap-2">
                {category === 'pencil' && '✏️'}
                {category === 'eraser' && '🧽'}
                {category === 'marker' && '🖊️'}
                {category}s
                <span className="text-sm font-normal text-gray-400">
                  ({activeCategorySupplies.length}/{categorySupplies.length} active)
                </span>
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {categorySupplies.map(supply => (
                  <div
                    key={supply.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      flaggedItems.has(supply.id)
                        ? 'opacity-50 scale-95'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div 
                      className={`relative rounded-lg overflow-hidden border-2 ${
                        flaggedItems.has(supply.id)
                          ? 'border-red-500 bg-red-900/20'
                          : supply.difficulty === 'hard'
                            ? 'border-orange-500/50 bg-orange-900/20'
                            : supply.difficulty === 'medium'
                              ? 'border-yellow-500/50 bg-yellow-900/20'
                              : 'border-green-500/50 bg-green-900/20'
                      }`}
                      onClick={() => {
                        if (gameMode === 'learning') {
                          setSelectedItem(supply)
                        } else if (gameMode === 'training') {
                          toggleItemFlag(supply.id)
                        }
                      }}
                    >
                      <img 
                        src={supply.image}
                        alt={supply.name}
                        className="w-full h-32 object-cover"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                      
                      {/* Classification Mode Overlay */}
                      {gameMode === 'classification' && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-white text-sm mb-2">Classify this item:</p>
                            <div className="flex gap-1">
                              {labels.map(label => (
                                <button
                                  key={label}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const correct = handleClassificationAttempt(supply, label)
                                    if (correct) {
                                      alert(`Correct! This is a ${supply.category}.`)
                                    } else {
                                      alert(`Not quite. This is actually a ${supply.category}. Try to notice the ${supply.visualFeatures.join(', ')}.`)
                                    }
                                  }}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Difficulty badge */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                        supply.difficulty === 'hard'
                          ? 'bg-red-600 text-white'
                          : supply.difficulty === 'medium'
                            ? 'bg-yellow-600 text-black'
                            : 'bg-green-600 text-white'
                      }`}>
                        {supply.difficulty}
                      </div>

                      {/* Flagged overlay */}
                      {flaggedItems.has(supply.id) && (
                        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                          <EyeOff className="h-8 w-8 text-red-300" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <h5 className="text-white font-medium text-sm">{supply.name}</h5>
                      <p className="text-gray-400 text-xs">{supply.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <img 
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <p className="text-gray-300 mb-4">{selectedItem.description}</p>
            
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Visual Features:</h4>
              <ul className="space-y-1">
                {selectedItem.visualFeatures.map((feature, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
              {gameMode === 'training' && (
                <button
                  onClick={() => {
                    toggleItemFlag(selectedItem.id)
                    setSelectedItem(null)
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium ${
                    flaggedItems.has(selectedItem.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {flaggedItems.has(selectedItem.id) ? 'Unflag Item' : 'Flag as Problematic'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Training Progress */}
      {isTraining && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-white font-medium">{loadingStep}</span>
          </div>
        </div>
      )}

      {/* Metrics Display */}
      {currentMetrics && gameMode === 'training' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">🎉 AI Training Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Metrics */}
            <div>
              <h4 className="text-white font-medium mb-3">Overall Performance</h4>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {currentMetrics.accuracy.toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">
                  {currentMetrics.correctPredictions} / {currentMetrics.totalSamples} correct predictions
                </div>
                <div className="mt-2">
                  {currentMetrics.accuracy >= 85 ? (
                    <span className="text-green-400 text-sm">🌟 Excellent performance!</span>
                  ) : currentMetrics.accuracy >= 70 ? (
                    <span className="text-yellow-400 text-sm">👍 Good performance!</span>
                  ) : (
                    <span className="text-orange-400 text-sm">💪 Needs improvement</span>
                  )}
                </div>
              </div>
            </div>

            {/* Per-Class Metrics */}
            <div>
              <h4 className="text-white font-medium mb-3">Category Performance</h4>
              <div className="space-y-2">
                {labels.map(label => (
                  <div key={label} className="flex justify-between items-center bg-gray-700 rounded px-3 py-2">
                    <span className="text-white capitalize flex items-center gap-2">
                      {label === 'pencil' && '✏️'}
                      {label === 'eraser' && '🧽'}
                      {label === 'marker' && '🖊️'}
                      {label}
                    </span>
                    <span className="text-white font-medium">
                      {currentMetrics.perClassMetrics[label]?.accuracy.toFixed(1) || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-900/20 rounded-lg p-4 border border-green-500/30">
            <p className="text-green-300 font-medium">
              🎓 Great job! Your AI model has been trained and can now classify school supplies with {currentMetrics.accuracy.toFixed(1)}% accuracy.
            </p>
            <p className="text-green-200 text-sm mt-2">
              In real applications, this AI could help organize school supply inventories, assist students with learning, or power educational apps!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}