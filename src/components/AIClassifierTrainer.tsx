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

    // Pencils - enhanced visual variety with distinct features
    const pencilTypes = [
      { name: "Yellow #2 Pencil", description: "Bright yellow wooden pencil with wood grain, hot pink eraser, and bold #2 text", features: ["Bright yellow body", "Wood grain texture", "Hot pink eraser", "Silver ferrule", "Black #2 text"], difficulty: 'easy' as const },
      { name: "Mechanical Pencil", description: "Blue plastic mechanical pencil with metal tip, clip, and grip section", features: ["Bright blue body", "Metal tip", "Black clip", "Grip section", "MECH text"], difficulty: 'medium' as const },
      { name: "Black Pencil", description: "Deep black wooden pencil with white text and yellow stripe", features: ["Deep black body", "White PENCIL text", "Yellow stripe", "Wood tip"], difficulty: 'medium' as const },
      { name: "Red Pencil", description: "Bright red wooden pencil with 3D highlights and white text", features: ["Bright red body", "3D highlights", "White RED text", "Pointed tip"], difficulty: 'easy' as const },
    ]

    // Erasers - different shapes and colors with enhanced visual distinction
    const eraserTypes = [
      { name: "Pink Block Eraser", description: "Bright hot pink rectangular eraser with 'ERASER' text", features: ["Hot pink color", "Large rectangular shape", "White text label"], difficulty: 'easy' as const },
      { name: "White Eraser", description: "Clean white rectangular eraser with dark border", features: ["Pure white color", "Dark border outline", "Blue-tinted surface"], difficulty: 'easy' as const },
      { name: "Kneaded Eraser", description: "Textured gray moldable eraser with radial lines", features: ["Light gray color", "Irregular blob shape", "Visible texture lines"], difficulty: 'hard' as const },
      { name: "Pencil Cap Eraser", description: "Bright blue circular cap eraser with highlight", features: ["Vibrant blue color", "Perfect circle shape", "Central hole"], difficulty: 'medium' as const },
    ]

    // Markers - enhanced visual variety with distinct features
    const markerTypes = [
      { name: "Red Marker", description: "Bright red marker with 3D cylinder effect, black cap, and MARKER text", features: ["Bright red body", "3D highlights", "Black cap", "Thick tip", "White MARKER text"], difficulty: 'easy' as const },
      { name: "Blue Marker", description: "Vibrant blue marker with cylinder shading and blue cap", features: ["Bright blue body", "Cylinder shading", "Blue cap", "Medium tip", "White BLUE text"], difficulty: 'easy' as const },
      { name: "Black Sharpie", description: "Deep black Sharpie with ridge details and fine tip", features: ["Deep black body", "Cap ridges", "Fine tip", "White SHARPIE text"], difficulty: 'medium' as const },
      { name: "Green Highlighter", description: "Bright green highlighter with transparent body and chisel tip", features: ["Bright green body", "Transparent effect", "Chisel tip", "White HILITE text"], difficulty: 'medium' as const },
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
      // Yellow #2 Pencil - enhanced with 3D effects
      ctx.fillStyle = '#fde047'  // Brighter yellow
      ctx.fillRect(-65, -10, 130, 20)
      // Add wood grain effect
      ctx.fillStyle = '#facc15'
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(-63 + i * 25, -8, 2, 16)
      }
      // 3D highlight on top
      ctx.fillStyle = '#fef08a'
      ctx.fillRect(-63, -8, 126, 4)
      // Shadow on bottom
      ctx.fillStyle = '#ca8a04'
      ctx.fillRect(-63, 6, 126, 2)
      // Pink eraser - enhanced
      ctx.fillStyle = '#ff69b4'
      ctx.fillRect(52, -8, 18, 16)
      // Eraser highlight
      ctx.fillStyle = '#ffb3da'
      ctx.fillRect(54, -6, 14, 4)
      // Silver ferrule - enhanced
      ctx.fillStyle = '#e5e7eb'
      ctx.fillRect(46, -9, 10, 18)
      ctx.strokeStyle = '#9ca3af'
      ctx.lineWidth = 1
      ctx.strokeRect(46, -9, 10, 18)
      // Bold text
      ctx.fillStyle = '#000'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('#2', 0, 4)
      // Pencil tip
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.moveTo(-65, 0)
      ctx.lineTo(-75, -2)
      ctx.lineTo(-75, 2)
      ctx.closePath()
      ctx.fill()
    } else if (name.includes('Mechanical')) {
      // Mechanical Pencil - enhanced design
      ctx.fillStyle = '#2563eb'  // Brighter blue
      ctx.fillRect(-55, -8, 110, 16)
      // 3D highlight
      ctx.fillStyle = '#60a5fa'
      ctx.fillRect(-53, -6, 106, 4)
      // Shadow
      ctx.fillStyle = '#1d4ed8'
      ctx.fillRect(-53, 4, 106, 2)
      // Metal tip - enhanced
      ctx.fillStyle = '#d1d5db'
      ctx.fillRect(-62, -4, 12, 8)
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      ctx.strokeRect(-62, -4, 12, 8)
      // Clip - more prominent
      ctx.fillStyle = '#374151'
      ctx.fillRect(48, -12, 4, 20)
      // Grip section
      ctx.fillStyle = '#1e40af'
      ctx.fillRect(35, -6, 15, 12)
      // Text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('MECH', 0, 3)
    } else if (name.includes('Black')) {
      // Black Pencil - enhanced contrast
      ctx.fillStyle = '#111827'  // Deeper black
      ctx.fillRect(-65, -10, 130, 20)
      // Highlight edge
      ctx.fillStyle = '#374151'
      ctx.fillRect(-63, -8, 126, 3)
      // Wood tip
      ctx.fillStyle = '#f3f4f6'
      ctx.beginPath()
      ctx.moveTo(-65, 0)
      ctx.lineTo(-75, -3)
      ctx.lineTo(-75, 3)
      ctx.closePath()
      ctx.fill()
      // Bold white text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 9px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('PENCIL', 0, 4)
      // Brand stripe
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(-55, -2, 110, 1)
    } else if (name.includes('Red')) {
      // Red Pencil - enhanced vibrancy
      ctx.fillStyle = '#ef4444'  // Brighter red
      ctx.fillRect(-65, -10, 130, 20)
      // 3D highlight
      ctx.fillStyle = '#f87171'
      ctx.fillRect(-63, -8, 126, 4)
      // Shadow
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(-63, 6, 126, 2)
      // Wood tip
      ctx.fillStyle = '#fca5a5'
      ctx.beginPath()
      ctx.moveTo(-65, 0)
      ctx.lineTo(-75, -2)
      ctx.lineTo(-75, 2)
      ctx.closePath()
      ctx.fill()
      // Silver text - more visible
      ctx.fillStyle = '#f3f4f6'
      ctx.font = 'bold 9px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('RED', 0, 4)
    }
  }

  const drawEraser = (ctx: CanvasRenderingContext2D, name: string, index: number) => {
    if (name.includes('Pink Block')) {
      // Pink rectangular eraser - brighter and more distinct
      ctx.fillStyle = '#ff69b4'  // Hot pink for better visibility
      ctx.fillRect(-35, -18, 70, 36)
      // Draw rounded rectangle manually for better compatibility
      ctx.beginPath()
      ctx.moveTo(-27, -18)
      ctx.lineTo(27, -18)
      ctx.quadraticCurveTo(35, -18, 35, -10)
      ctx.lineTo(35, 10)
      ctx.quadraticCurveTo(35, 18, 27, 18)
      ctx.lineTo(-27, 18)
      ctx.quadraticCurveTo(-35, 18, -35, 10)
      ctx.lineTo(-35, -10)
      ctx.quadraticCurveTo(-35, -18, -27, -18)
      ctx.closePath()
      ctx.fill()
      // Highlight for 3D effect
      ctx.fillStyle = '#ffb3da'
      ctx.fillRect(-33, -16, 66, 8)
      // Shadow for depth
      ctx.fillStyle = '#d1477a'
      ctx.fillRect(-33, 10, 66, 6)
      // Brand text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('ERASER', 0, 3)
    } else if (name.includes('White')) {
      // White eraser - cleaner with better definition
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-32, -16, 64, 32)
      // Strong border for visibility
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.strokeRect(-32, -16, 64, 32)
      // Subtle blue tint for better contrast
      ctx.fillStyle = '#f8faff'
      ctx.fillRect(-30, -14, 60, 28)
      // Highlight
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-30, -14, 60, 6)
      // Text
      ctx.fillStyle = '#374151'
      ctx.font = 'bold 7px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('WHITE', 0, 3)
    } else if (name.includes('Kneaded')) {
      // Gray kneaded eraser - more defined and textured
      ctx.fillStyle = '#8b92a3'  // Lighter gray for better visibility
      ctx.beginPath()
      ctx.moveTo(-28, -12)
      ctx.lineTo(25, -16)
      ctx.lineTo(32, 8)
      ctx.lineTo(18, 22)
      ctx.lineTo(-22, 18)
      ctx.lineTo(-32, -8)
      ctx.closePath()
      ctx.fill()
      // Add texture lines for kneaded appearance
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const x1 = Math.cos(angle) * 10
        const y1 = Math.sin(angle) * 10
        const x2 = Math.cos(angle) * 20
        const y2 = Math.sin(angle) * 20
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    } else if (name.includes('Cap')) {
      // Blue cap eraser - more vibrant and defined
      ctx.fillStyle = '#4f9eff'  // Brighter blue
      ctx.beginPath()
      ctx.arc(0, 0, 20, 0, Math.PI * 2)
      ctx.fill()
      // Outer ring for definition
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 3
      ctx.stroke()
      // Inner hole with gradient effect
      ctx.fillStyle = '#1e40af'
      ctx.beginPath()
      ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fill()
      // Highlight on top
      ctx.fillStyle = '#93c5fd'
      ctx.beginPath()
      ctx.arc(-5, -5, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawMarker = (ctx: CanvasRenderingContext2D, name: string, index: number) => {
    if (name.includes('Red Marker')) {
      // Red marker body - enhanced with 3D effects
      ctx.fillStyle = '#ef4444'  // Brighter red
      ctx.fillRect(-10, -45, 20, 90)
      // 3D cylinder highlight
      ctx.fillStyle = '#f87171'
      ctx.fillRect(-8, -43, 6, 86)
      // Shadow side
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(2, -43, 6, 86)
      // Black cap - enhanced
      ctx.fillStyle = '#000'
      ctx.fillRect(-10, -55, 20, 18)
      // Cap highlight
      ctx.fillStyle = '#374151'
      ctx.fillRect(-8, -53, 16, 4)
      // Tip - more defined
      ctx.fillStyle = '#991b1b'
      ctx.fillRect(-6, 40, 12, 12)
      // Tip highlight
      ctx.fillStyle = '#b91c1c'
      ctx.fillRect(-4, 42, 8, 3)
      // Brand text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 7px Arial'
      ctx.textAlign = 'center'
      ctx.save()
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('MARKER', 0, 3)
      ctx.restore()
    } else if (name.includes('Blue Marker')) {
      // Blue marker - enhanced design
      ctx.fillStyle = '#3b82f6'  // Brighter blue
      ctx.fillRect(-10, -45, 20, 90)
      // 3D highlight
      ctx.fillStyle = '#60a5fa'
      ctx.fillRect(-8, -43, 6, 86)
      // Shadow
      ctx.fillStyle = '#2563eb'
      ctx.fillRect(2, -43, 6, 86)
      // Blue cap - enhanced
      ctx.fillStyle = '#1e40af'
      ctx.fillRect(-10, -55, 20, 18)
      // Cap highlight
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(-8, -53, 16, 4)
      // Tip
      ctx.fillStyle = '#1d4ed8'
      ctx.fillRect(-6, 40, 12, 12)
      // White text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 7px Arial'
      ctx.textAlign = 'center'
      ctx.save()
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('BLUE', 0, 3)
      ctx.restore()
    } else if (name.includes('Sharpie')) {
      // Black Sharpie - enhanced contrast
      ctx.fillStyle = '#111827'  // Deeper black
      ctx.fillRect(-8, -45, 16, 90)
      // Subtle highlight
      ctx.fillStyle = '#374151'
      ctx.fillRect(-6, -43, 4, 86)
      // Cap - more defined
      ctx.fillStyle = '#000'
      ctx.fillRect(-8, -55, 16, 15)
      // Cap ridge details
      ctx.strokeStyle = '#4b5563'
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(-6, -52 + i * 3)
        ctx.lineTo(6, -52 + i * 3)
        ctx.stroke()
      }
      // Fine tip
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(-3, 40, 6, 10)
      // Bold white text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 6px Arial'
      ctx.textAlign = 'center'
      ctx.save()
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('SHARPIE', 0, 2)
      ctx.restore()
    } else if (name.includes('Highlighter')) {
      // Green highlighter - enhanced transparency effect
      ctx.fillStyle = '#22c55e'  // Brighter green
      ctx.fillRect(-12, -40, 24, 80)
      // Transparent body effect
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)'
      ctx.fillRect(-10, -38, 20, 76)
      // 3D highlight
      ctx.fillStyle = '#4ade80'
      ctx.fillRect(-10, -38, 8, 76)
      // Cap
      ctx.fillStyle = '#15803d'
      ctx.fillRect(-12, -50, 24, 15)
      // Cap highlight
      ctx.fillStyle = '#22c55e'
      ctx.fillRect(-10, -48, 20, 4)
      // Chisel tip - more defined
      ctx.fillStyle = '#16a34a'
      ctx.fillRect(-8, 35, 16, 12)
      // Tip bevel
      ctx.fillStyle = '#15803d'
      ctx.beginPath()
      ctx.moveTo(-8, 47)
      ctx.lineTo(0, 50)
      ctx.lineTo(8, 47)
      ctx.closePath()
      ctx.fill()
      // Text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 6px Arial'
      ctx.textAlign = 'center'
      ctx.save()
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('HILITE', 0, 2)
      ctx.restore()
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