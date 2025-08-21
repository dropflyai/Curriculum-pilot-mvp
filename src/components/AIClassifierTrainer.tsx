'use client'

import { useState, useEffect } from 'react'

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

  // Load images from API
  const loadImages = async () => {
    const imageData: Record<string, string[]> = {}
    
    for (const label of labels) {
      try {
        const response = await fetch(`/api/list?dataset=${dataset}&label=${label}`)
        if (response.ok) {
          const files = await response.json()
          imageData[label] = files
        } else {
          // Mock data if API fails
          imageData[label] = Array.from({ length: 10 }, (_, i) => 
            `https://via.placeholder.com/128x128/666/fff?text=${label}_${i + 1}`
          )
        }
      } catch (error) {
        console.error(`Failed to load images for ${label}:`, error)
        // Mock data for demonstration
        imageData[label] = Array.from({ length: 10 }, (_, i) => 
          `https://via.placeholder.com/128x128/666/fff?text=${label}_${i + 1}`
        )
      }
    }
    
    setImages(imageData)
  }

  // Mock training function
  const trainClassifier = async () => {
    setIsTraining(true)
    setLoadingStep('Training classifier...')

    // Simulate training time
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generate mock metrics
    const metrics = generateMockMetrics()
    setCurrentMetrics(metrics)
    onMetricsUpdate(metrics)
    onTrainingComplete(true)
    
    setIsTraining(false)
    setLoadingStep('')
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
      {/* Demo Notice */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 font-medium mb-2">🚀 MVP Demo Mode</h4>
        <p className="text-blue-200 text-sm">
          This demonstrates the AI classifier interface with mock data. In production, this would use real TensorFlow.js models with MobileNet + KNN for image classification.
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

      {/* Image Gallery with Flagging */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Image Gallery (Mock Data)</h3>
        <p className="text-gray-400 text-sm mb-4">Click images to flag them as low-quality or duplicates</p>
        
        {labels.map(label => (
          <div key={label} className="mb-6">
            <h4 className="text-white font-medium mb-3 capitalize">{label}</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {(images[label] || []).slice(0, 16).map((imagePath, index) => (
                <div key={index} className="relative">
                  <img
                    src={imagePath}
                    alt={`${label} ${index}`}
                    className={`w-full h-16 object-cover rounded cursor-pointer transition-all ${
                      flaggedImages.has(imagePath) 
                        ? 'opacity-50 border-2 border-red-500' 
                        : 'hover:opacity-80 border border-gray-600'
                    }`}
                    onClick={() => toggleImageFlag(imagePath)}
                  />
                  {flaggedImages.has(imagePath) && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">X</span>
                    </div>
                  )}
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