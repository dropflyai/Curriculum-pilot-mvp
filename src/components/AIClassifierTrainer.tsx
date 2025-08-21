'use client'

import { useState, useEffect, useRef } from 'react'

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

export default function AIClassifierTrainer({ 
  dataset, 
  labels, 
  onMetricsUpdate, 
  onTrainingComplete 
}: AIClassifierTrainerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [images, setImages] = useState<Record<string, string[]>>({})
  const [flaggedImages, setFlaggedImages] = useState<Set<string>>(new Set())
  const [currentMetrics, setCurrentMetrics] = useState<OverallMetrics | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [hasModels, setHasModels] = useState(false)
  const [useRealTF, setUseRealTF] = useState(false)
  
  const mobileNetRef = useRef<any>(null)
  const classifierRef = useRef<any>(null)

  // Mock initialization
  useEffect(() => {
    const initModels = async () => {
      setIsLoading(true)
      setLoadingStep('Loading TensorFlow.js models...')
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setLoadingStep('Loading images...')
      await loadImages()
      
      setHasModels(true)
      setIsLoading(false)
    }

    initModels()
  }, [dataset, labels])

  // Create visual school supply representations
  const getSchoolSupplyVisuals = (label: string, index: number) => {
    const schoolSupplies: Record<string, { emoji: string; colors: string[] }> = {
      pencil: { 
        emoji: '✏️', 
        colors: ['#FFD700', '#FFA500', '#FF6347', '#8B4513', '#228B22']
      },
      eraser: { 
        emoji: '🧽', 
        colors: ['#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C']
      },
      marker: { 
        emoji: '🖊️', 
        colors: ['#FF0000', '#0000FF', '#008000', '#800080', '#FF1493']
      },
      pen: { 
        emoji: '🖊️', 
        colors: ['#000080', '#4B0082', '#008B8B', '#B22222', '#2F4F4F']
      },
      crayon: { 
        emoji: '🖍️', 
        colors: ['#FF69B4', '#00CED1', '#FFD700', '#32CD32', '#FF4500']
      },
      ruler: { 
        emoji: '📏', 
        colors: ['#D3D3D3', '#A9A9A9', '#C0C0C0', '#808080', '#696969']
      },
      scissors: { 
        emoji: '✂️', 
        colors: ['#DC143C', '#FF6347', '#CD5C5C', '#8B0000', '#B22222']
      },
      glue: { 
        emoji: '🧴', 
        colors: ['#FFFACD', '#F0E68C', '#FFE4B5', '#FAFAD2', '#FFF8DC']
      }
    }

    const supply = schoolSupplies[label.toLowerCase()] || { 
      emoji: '📦', 
      colors: ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#DCDCDC'] 
    }
    
    const color = supply.colors[index % supply.colors.length]
    const rotation = (index * 15) % 360
    const size = 80 + (index % 3) * 20
    
    // Create a data URL for a colorful school supply image
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 128, 128)
      gradient.addColorStop(0, color + '33')
      gradient.addColorStop(1, color + '11')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
      
      // Draw circle background for the emoji
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(64, 64, 40, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw the emoji text
      ctx.font = `${size}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(supply.emoji, 64, 64)
      
      // Add decorative elements
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(64, 64, 50, 0, Math.PI * 2)
      ctx.stroke()
    }
    
    return canvas.toDataURL()
  }

  // Load images from API or create visual representations
  const loadImages = async () => {
    const imageData: Record<string, string[]> = {}
    
    for (const label of labels) {
      try {
        const response = await fetch(`/api/list?dataset=${dataset}&label=${label}`)
        if (response.ok) {
          const files = await response.json()
          // If we have real files, use them
          if (files && files.length > 0) {
            imageData[label] = files
          } else {
            // Create visual school supply representations
            imageData[label] = Array.from({ length: 12 }, (_, i) => 
              getSchoolSupplyVisuals(label, i)
            )
          }
        } else {
          // Create visual school supply representations
          imageData[label] = Array.from({ length: 12 }, (_, i) => 
            getSchoolSupplyVisuals(label, i)
          )
        }
      } catch (error) {
        console.error(`Failed to load images for ${label}:`, error)
        // Create visual school supply representations
        imageData[label] = Array.from({ length: 12 }, (_, i) => 
          getSchoolSupplyVisuals(label, i)
        )
      }
    }
    
    setImages(imageData)
  }

  // Initialize TensorFlow models for real training
  const initRealTFModels = async () => {
    if (!mobileNetRef.current && useRealTF) {
      setLoadingStep('Loading MobileNet model...')
      try {
        // Real TensorFlow.js implementation would go here
        // To enable: npm install @tensorflow/tfjs @tensorflow-models/mobilenet @tensorflow-models/knn-classifier
        // Then uncomment the code below:
        
        /*
        const [tf, mobilenet, knnClassifier] = await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/mobilenet'),
          import('@tensorflow-models/knn-classifier')
        ])
        
        mobileNetRef.current = await mobilenet.load()
        classifierRef.current = knnClassifier.create()
        */
        
        // For now, simulate real TensorFlow with enhanced mock
        await new Promise(resolve => setTimeout(resolve, 2000))
        mobileNetRef.current = { infer: () => ({ dispose: () => {} }) }
        classifierRef.current = { 
          clearAllClasses: () => {},
          addExample: () => {},
          predictClass: async () => ({ label: 'mock', confidences: {} })
        }
      } catch (error) {
        console.error('Failed to load TensorFlow models:', error)
        setUseRealTF(false) // Fall back to mock mode
      }
    }
  }

  // Real TensorFlow training function
  const trainRealClassifier = async () => {
    setIsTraining(true)
    setLoadingStep('Initializing TensorFlow models...')
    
    try {
      await initRealTFModels()
      
      if (!mobileNetRef.current || !classifierRef.current) {
        throw new Error('Models not loaded')
      }

      // Clear previous training
      classifierRef.current.clearAllClasses()
      
      let totalProcessed = 0
      const activeImages = getAllActiveImages()
      const totalImages = Object.values(activeImages).flat().length
      
      setLoadingStep(`Processing ${totalImages} images with MobileNet...`)
      
      // Train on each label's images
      for (const [label, imagePaths] of Object.entries(activeImages)) {
        const trainingImages = imagePaths.slice(0, -5) // Reserve last 5 for testing
        
        for (const imagePath of trainingImages) {
          try {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            
            await new Promise((resolve, reject) => {
              img.onload = resolve
              img.onerror = reject
              img.src = imagePath
            })
            
            // Get MobileNet activation
            const activation = mobileNetRef.current.infer(img)
            
            // Add to KNN classifier
            classifierRef.current.addExample(activation, label)
            
            totalProcessed++
            if (totalProcessed % 3 === 0) {
              setLoadingStep(`Processed ${totalProcessed}/${totalImages} images...`)
            }
            
            activation.dispose() // Clean up memory
          } catch (error) {
            console.warn(`Failed to process image ${imagePath}:`, error)
          }
        }
      }
      
      // Evaluate model
      setLoadingStep('Evaluating model performance...')
      const metrics = await evaluateRealModel(activeImages)
      
      setCurrentMetrics(metrics)
      onMetricsUpdate(metrics)
      onTrainingComplete(true)
      setLoadingStep('Training completed successfully!')
      
    } catch (error) {
      console.error('Real training failed:', error)
      setLoadingStep('Real training failed, using mock data...')
      // Fall back to mock training
      const metrics = generateMockMetrics()
      setCurrentMetrics(metrics)
      onMetricsUpdate(metrics)
      onTrainingComplete(true)
    } finally {
      setIsTraining(false)
    }
  }

  // Get active (non-flagged) images
  const getAllActiveImages = () => {
    const activeImages: Record<string, string[]> = {}
    for (const [label, imagePaths] of Object.entries(images)) {
      activeImages[label] = imagePaths.filter(img => !flaggedImages.has(img))
    }
    return activeImages
  }

  // Evaluate real TensorFlow model
  const evaluateRealModel = async (activeImages: Record<string, string[]>) => {
    const results: Record<string, { correct: number; total: number }> = {}
    const confusionMatrix: number[][] = labels.map(() => labels.map(() => 0))
    
    let totalCorrect = 0
    let totalTest = 0
    
    // Initialize results
    labels.forEach(label => {
      results[label] = { correct: 0, total: 0 }
    })
    
    // Test on reserved images
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i]
      const testImages = activeImages[label]?.slice(-5) || [] // Last 5 for testing
      
      for (const imagePath of testImages) {
        try {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = imagePath
          })
          
          const activation = mobileNetRef.current.infer(img)
          const prediction = await classifierRef.current.predictClass(activation)
          
          results[label].total++
          totalTest++
          
          const predictedIndex = labels.indexOf(prediction.label)
          if (predictedIndex !== -1) {
            confusionMatrix[i][predictedIndex]++
            
            if (prediction.label === label) {
              results[label].correct++
              totalCorrect++
            }
          }
          
          activation.dispose()
        } catch (error) {
          console.warn(`Failed to evaluate image ${imagePath}:`, error)
        }
      }
    }
    
    // Calculate metrics in the expected format
    const overallAccuracy = totalTest > 0 ? (totalCorrect / totalTest) * 100 : 0
    const perClassMetrics: Record<string, ClassMetrics> = {}
    
    labels.forEach(label => {
      const result = results[label]
      perClassMetrics[label] = {
        accuracy: result.total > 0 ? (result.correct / result.total) * 100 : 0,
        totalSamples: result.total,
        correctPredictions: result.correct
      }
    })
    
    return {
      accuracy: overallAccuracy,
      totalSamples: totalTest,
      correctPredictions: totalCorrect,
      perClassMetrics,
      confusionMatrix
    }
  }

  // Main training function that chooses real or mock
  const trainClassifier = async () => {
    if (useRealTF) {
      await trainRealClassifier()
    } else {
      // Original mock training
      setIsTraining(true)
      setLoadingStep('Training classifier...')

      await new Promise(resolve => setTimeout(resolve, 3000))

      const metrics = generateMockMetrics()
      setCurrentMetrics(metrics)
      onMetricsUpdate(metrics)
      onTrainingComplete(true)
      
      setIsTraining(false)
      setLoadingStep('')
    }
  }

  // Generate realistic mock metrics
  const generateMockMetrics = (): OverallMetrics => {
    const totalSamples = labels.length * 5 // 5 test images per class
    const correctPredictions = Math.floor(totalSamples * (0.7 + Math.random() * 0.25)) // 70-95% accuracy
    
    const perClassMetrics: Record<string, ClassMetrics> = {}
    const confusionMatrix: number[][] = Array(labels.length).fill(null).map(() => Array(labels.length).fill(0))
    
    labels.forEach((label, index) => {
      const classCorrect = Math.floor(5 * (0.6 + Math.random() * 0.35)) // 60-95% per class
      perClassMetrics[label] = {
        accuracy: (classCorrect / 5) * 100,
        totalSamples: 5,
        correctPredictions: classCorrect
      }
      
      // Fill confusion matrix with mock data
      for (let i = 0; i < labels.length; i++) {
        if (i === index) {
          confusionMatrix[index][i] = classCorrect
        } else {
          confusionMatrix[index][i] = Math.floor(Math.random() * (5 - classCorrect))
        }
      }
    })

    return {
      accuracy: (correctPredictions / totalSamples) * 100,
      totalSamples,
      correctPredictions,
      perClassMetrics,
      confusionMatrix
    }
  }

  // Toggle image flagged status
  const toggleImageFlag = (imagePath: string) => {
    const newFlagged = new Set(flaggedImages)
    if (newFlagged.has(imagePath)) {
      newFlagged.delete(imagePath)
    } else {
      newFlagged.add(imagePath)
    }
    setFlaggedImages(newFlagged)
  }

  // Retrain after flagging images
  const retrain = async () => {
    if (flaggedImages.size >= 5) {
      await trainClassifier()
    } else {
      alert('Please flag at least 5 images before retraining.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">{loadingStep}</p>
        <p className="text-gray-400 text-sm mt-2">
          (MVP Demo: Using mock data and simulated training)
        </p>
      </div>
    )
  }

  if (!hasModels) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">AI Models Not Available</h3>
          <p className="text-gray-400 mb-4">
            TensorFlow.js models would be loaded here in a production environment.
          </p>
          <button
            onClick={() => setHasModels(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Continue with Mock Demo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-blue-300 font-medium">🚀 AI Classifier Mode</h4>
          <div className="flex items-center gap-3">
            <span className="text-blue-200 text-sm">Mock Demo</span>
            <button
              onClick={() => setUseRealTF(!useRealTF)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useRealTF ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              disabled={isTraining}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useRealTF ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-blue-200 text-sm">Real TensorFlow.js</span>
          </div>
        </div>
        <p className="text-blue-200 text-sm">
          {useRealTF 
            ? "Using enhanced mock simulation (install TensorFlow.js dependencies to enable real ML training)."
            : "Using mock data for demonstration. Toggle to enable enhanced simulation."
          }
        </p>
      </div>

      {/* Training Controls */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">AI Classifier Training</h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={trainClassifier}
            disabled={isTraining}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isTraining ? 'Training...' : 'Train Model'}
          </button>
          <button
            onClick={retrain}
            disabled={isTraining || flaggedImages.size < 5}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retrain ({flaggedImages.size} flagged)
          </button>
        </div>
        {isTraining && (
          <div className="text-gray-400 text-sm">{loadingStep}</div>
        )}
      </div>

      {/* Dataset Overview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Dataset: {dataset}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labels.map(label => (
            <div key={label} className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2 capitalize">{label}</h4>
              <p className="text-gray-400 text-sm">
                {(images[label] || []).length} total images
              </p>
              <p className="text-gray-400 text-sm">
                {(images[label] || []).filter(img => !flaggedImages.has(img)).length} available for training
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Gallery with School Supplies */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🎨 School Supplies Gallery
        </h3>
        <p className="text-purple-200 text-sm mb-4">
          Click on supplies to mark them for review - help the AI learn better! 🤖
        </p>
        
        {labels.map(label => (
          <div key={label} className="mb-8">
            <h4 className="text-white font-medium mb-3 capitalize flex items-center gap-2">
              <span className="text-2xl">
                {label === 'pencil' && '✏️'}
                {label === 'eraser' && '🧽'}
                {label === 'marker' && '🖊️'}
                {label === 'pen' && '🖊️'}
                {label === 'crayon' && '🖍️'}
                {label === 'ruler' && '📏'}
                {label === 'scissors' && '✂️'}
                {label === 'glue' && '🧴'}
                {!['pencil', 'eraser', 'marker', 'pen', 'crayon', 'ruler', 'scissors', 'glue'].includes(label) && '📦'}
              </span>
              {label}s Collection
            </h4>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {(images[label] || []).slice(0, 12).map((imagePath, index) => (
                <div key={index} className="relative group">
                  <div className={`
                    relative rounded-xl overflow-hidden border-2 transition-all duration-300 bg-white
                    ${flaggedImages.has(imagePath) 
                      ? 'border-red-500 scale-95 opacity-50' 
                      : 'border-purple-500/30 hover:border-purple-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30'
                    }
                  `}>
                    <div 
                      className={`w-20 h-20 flex items-center justify-center cursor-pointer transition-all ${
                        flaggedImages.has(imagePath) 
                          ? 'opacity-50' 
                          : 'hover:opacity-80'
                      }`}
                      onClick={() => toggleImageFlag(imagePath)}
                      style={{
                        background: `url(${imagePath}) center/cover`,
                        imageRendering: 'crisp-edges'
                      }}
                    />
                    {flaggedImages.has(imagePath) && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                        <span className="text-white text-2xl font-bold">❌</span>
                      </div>
                    )}
                    {!flaggedImages.has(imagePath) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1">
                        <span className="text-white text-xs font-medium">{index + 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Display */}
      {currentMetrics && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Model Performance (Mock Results)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Metrics */}
            <div>
              <h4 className="text-white font-medium mb-3">Overall Performance</h4>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {currentMetrics.accuracy.toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">
                  {currentMetrics.correctPredictions} / {currentMetrics.totalSamples} correct
                </div>
              </div>
            </div>

            {/* Per-Class Metrics */}
            <div>
              <h4 className="text-white font-medium mb-3">Per-Class Accuracy</h4>
              <div className="space-y-2">
                {labels.map(label => (
                  <div key={label} className="flex justify-between items-center bg-gray-700 rounded px-3 py-2">
                    <span className="text-white capitalize">{label}</span>
                    <span className="text-white font-medium">
                      {currentMetrics.perClassMetrics[label]?.accuracy.toFixed(1) || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="mt-6">
            <h4 className="text-white font-medium mb-3">Confusion Matrix</h4>
            <div className="bg-gray-700 rounded-lg p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-gray-400 p-2"></th>
                    {labels.map(label => (
                      <th key={label} className="text-gray-400 p-2 text-center capitalize">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {labels.map((actualLabel, actualIndex) => (
                    <tr key={actualLabel}>
                      <th className="text-gray-400 p-2 capitalize">{actualLabel}</th>
                      {labels.map((predictedLabel, predictedIndex) => (
                        <td key={predictedLabel} className="text-white p-2 text-center">
                          {currentMetrics.confusionMatrix[actualIndex][predictedIndex]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}