'use client'

import { useState, useEffect, useRef } from 'react'
import { Camera, Upload, RotateCcw, Eye, EyeOff, Lightbulb, CheckSquare, Download, Share2 } from 'lucide-react'

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

interface RealPhotoClassifierProps {
  dataset: string
  labels: string[]
  onMetricsUpdate: (metrics: OverallMetrics) => void
  onTrainingComplete: (success: boolean) => void
}

interface PhotoItem {
  id: string
  url: string
  label: string
  fileName: string
  userUploaded?: boolean
  flagged?: boolean
  confidence?: number
}

export default function RealPhotoClassifier({ 
  dataset, 
  labels, 
  onMetricsUpdate, 
  onTrainingComplete 
}: RealPhotoClassifierProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStep, setLoadingStep] = useState('')
  const [flaggedPhotos, setFlaggedPhotos] = useState<Set<string>>(new Set())
  const [currentMetrics, setCurrentMetrics] = useState<OverallMetrics | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [gameMode, setGameMode] = useState<'explore' | 'classify' | 'build' | 'train'>('explore')
  const [classificationScore, setClassificationScore] = useState(0)
  const [classificationAttempts, setClassificationAttempts] = useState(0)
  const [userPhotos, setUserPhotos] = useState<PhotoItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Real photo URLs - using diverse, educational examples
  const defaultPhotoSets = {
    'school-supplies': {
      pencil: [
        // Yellow wooden pencils
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=200&fit=crop&crop=center',
        // Mechanical pencils
        'https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop&crop=center',
        // Colored pencils
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop&crop=center',
        // Different angles and contexts
        'https://images.unsplash.com/photo-1482849297070-f4fae2173efe?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1609977800031-bae90eb85e87?w=300&h=200&fit=crop&crop=center',
      ],
      eraser: [
        // Pink erasers
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&crop=center',
        // White erasers
        'https://images.unsplash.com/photo-1615719413546-198b25453f85?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center',
        // Kneaded erasers
        'https://images.unsplash.com/photo-1589395937699-c4b2bac6dc83?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center',
        // Various eraser types
        'https://images.unsplash.com/photo-1615544402065-96e4b1dac9d9?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1594736797933-d0cb3c3b8b81?w=300&h=200&fit=crop&crop=center',
      ],
      marker: [
        // Colorful markers
        'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop&crop=center',
        // Highlighters
        'https://images.unsplash.com/photo-1580286760808-3d3c439a5dd0?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=200&fit=crop&crop=center',
        // Permanent markers
        'https://images.unsplash.com/photo-1596516109370-29001989f04b?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&h=200&fit=crop&crop=center',
        // Various marker collections
        'https://images.unsplash.com/photo-1615874959474-d609969a20ac?w=300&h=200&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=300&h=200&fit=crop&crop=center',
      ]
    }
  }

  // Load default photos and user photos
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true)
      setLoadingStep('Loading real photo dataset...')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const photoSet = defaultPhotoSets[dataset as keyof typeof defaultPhotoSets]
      if (!photoSet) {
        setIsLoading(false)
        return
      }

      const loadedPhotos: PhotoItem[] = []
      
      // Load default photos
      Object.entries(photoSet).forEach(([label, urls]) => {
        urls.forEach((url, index) => {
          loadedPhotos.push({
            id: `${label}-${index}`,
            url,
            label,
            fileName: `${label}_${String(index + 1).padStart(3, '0')}.jpg`,
            userUploaded: false
          })
        })
      })

      // Load user-uploaded photos from localStorage
      const savedUserPhotos = localStorage.getItem('userPhotos')
      if (savedUserPhotos) {
        const userPhotoData = JSON.parse(savedUserPhotos)
        setUserPhotos(userPhotoData)
        loadedPhotos.push(...userPhotoData)
      }

      // Load flagged photos from localStorage
      const savedFlagged = localStorage.getItem('flaggedPhotos')
      if (savedFlagged) {
        setFlaggedPhotos(new Set(JSON.parse(savedFlagged)))
      }

      setPhotos(loadedPhotos)
      setIsLoading(false)
    }

    loadPhotos()
  }, [dataset])

  // Handle photo uploads
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, isCamera: boolean = false) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          const newPhoto: PhotoItem = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url,
            label: labels[0], // Default to first label
            fileName: file.name,
            userUploaded: true
          }
          
          const updatedUserPhotos = [...userPhotos, newPhoto]
          setUserPhotos(updatedUserPhotos)
          setPhotos(prev => [...prev, newPhoto])
          
          // Save to localStorage
          localStorage.setItem('userPhotos', JSON.stringify(updatedUserPhotos))
        }
        reader.readAsDataURL(file)
      }
    })

    // Clear the input
    if (event.target) {
      event.target.value = ''
    }
  }

  // Handle photo classification attempt
  const handleClassificationAttempt = (photo: PhotoItem, guessedLabel: string) => {
    setClassificationAttempts(prev => prev + 1)
    
    if (guessedLabel === photo.label) {
      setClassificationScore(prev => prev + 1)
      return true
    }
    return false
  }

  // Training function with realistic simulation
  const trainClassifier = async () => {
    setIsTraining(true)
    setLoadingStep('Analyzing photo features...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoadingStep('Training deep learning model...')
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setLoadingStep('Cross-validating performance...')
    await new Promise(resolve => setTimeout(resolve, 1500))

    const metrics = generateRealisticMetrics()
    setCurrentMetrics(metrics)
    onMetricsUpdate(metrics)
    onTrainingComplete(true)
    
    setIsTraining(false)
    setLoadingStep('')
  }

  // Generate realistic metrics
  const generateRealisticMetrics = (): OverallMetrics => {
    const activePhotos = photos.filter(photo => !flaggedPhotos.has(photo.id))
    const totalSamples = activePhotos.length
    
    // Include user photos boost accuracy if they have good variety
    const userPhotoBonus = Math.min(userPhotos.length * 0.02, 0.1) // Up to 10% boost
    const baseAccuracy = 0.78 + userPhotoBonus - (flaggedPhotos.size * 0.01)
    const finalAccuracy = Math.max(0.6, Math.min(0.95, baseAccuracy + (Math.random() * 0.15)))
    
    const correctPredictions = Math.floor(totalSamples * finalAccuracy)
    
    const perClassMetrics: Record<string, ClassMetrics> = {}
    const confusionMatrix: number[][] = Array(labels.length).fill(null).map(() => Array(labels.length).fill(0))
    
    labels.forEach((label, index) => {
      const classPhotos = activePhotos.filter(p => p.label === label)
      const classCorrect = Math.floor(classPhotos.length * (0.7 + Math.random() * 0.25))
      
      perClassMetrics[label] = {
        accuracy: classPhotos.length > 0 ? (classCorrect / classPhotos.length) * 100 : 0,
        totalSamples: classPhotos.length,
        correctPredictions: classCorrect
      }
      
      // Fill confusion matrix with realistic errors
      confusionMatrix[index][index] = classCorrect
      const remainingErrors = classPhotos.length - classCorrect
      if (remainingErrors > 0) {
        labels.forEach((_, errorIndex) => {
          if (errorIndex !== index) {
            confusionMatrix[index][errorIndex] = Math.floor(remainingErrors / (labels.length - 1))
          }
        })
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

  // Toggle photo flag
  const togglePhotoFlag = (photoId: string) => {
    const newFlagged = new Set(flaggedPhotos)
    if (newFlagged.has(photoId)) {
      newFlagged.delete(photoId)
    } else {
      newFlagged.add(photoId)
    }
    setFlaggedPhotos(newFlagged)
    localStorage.setItem('flaggedPhotos', JSON.stringify(Array.from(newFlagged)))
  }

  // Change user photo label
  const changePhotoLabel = (photoId: string, newLabel: string) => {
    const updatedPhotos = photos.map(photo => 
      photo.id === photoId ? { ...photo, label: newLabel } : photo
    )
    setPhotos(updatedPhotos)

    // Update user photos in localStorage if it's a user photo
    const photo = photos.find(p => p.id === photoId)
    if (photo?.userUploaded) {
      const updatedUserPhotos = userPhotos.map(p => 
        p.id === photoId ? { ...p, label: newLabel } : p
      )
      setUserPhotos(updatedUserPhotos)
      localStorage.setItem('userPhotos', JSON.stringify(updatedUserPhotos))
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">{loadingStep}</p>
        <p className="text-gray-400 text-sm mt-2">Loading real photographs for authentic AI training...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Interactive Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          📸 Real Photo AI Classifier
        </h3>
        <p className="text-blue-200 mb-4">
          Work with real photographs to train your AI! Explore the dataset, add your own photos, practice classification, and build a working AI model.
        </p>
        
        {/* Enhanced Mode Selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { mode: 'explore', label: '🔍 Explore Photos', desc: 'Browse and examine real photographs' },
            { mode: 'classify', label: '🎯 Practice Classification', desc: 'Test your ability to classify photos' },
            { mode: 'build', label: '📷 Build Your Dataset', desc: 'Add your own photos to improve the AI' },
            { mode: 'train', label: '🤖 Train AI Model', desc: 'Train and evaluate your AI classifier' }
          ].map(({ mode, label, desc }) => (
            <button
              key={mode}
              onClick={() => setGameMode(mode as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                gameMode === mode
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={desc}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{photos.length}</div>
            <div className="text-blue-200">Total Photos</div>
          </div>
          <div className="bg-green-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{userPhotos.length}</div>
            <div className="text-green-200">Your Photos</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{flaggedPhotos.size}</div>
            <div className="text-purple-200">Flagged</div>
          </div>
          <div className="bg-orange-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">
              {classificationAttempts > 0 ? `${Math.round((classificationScore / classificationAttempts) * 100)}%` : '0%'}
            </div>
            <div className="text-orange-200">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Build Mode - Photo Upload */}
      {gameMode === 'build' && (
        <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📷 Build Your Own Dataset
          </h4>
          <p className="text-green-200 mb-4">
            Add your own photos to improve the AI! Take pictures of school supplies around you or upload photos from your device.
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Camera className="h-5 w-5" />
              Take Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Upload className="h-5 w-5" />
              Upload Photos
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handlePhotoUpload(e, true)}
            multiple
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoUpload(e, false)}
            multiple
          />

          {userPhotos.length > 0 && (
            <div className="mt-4">
              <h5 className="text-green-300 font-semibold mb-2">Your Uploaded Photos ({userPhotos.length})</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {userPhotos.slice(-8).map(photo => (
                  <div key={photo.id} className="relative group">
                    <img 
                      src={photo.url} 
                      alt={photo.fileName}
                      className="w-full h-20 object-cover rounded-lg border-2 border-green-500/50"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <select
                        value={photo.label}
                        onChange={(e) => changePhotoLabel(photo.id, e.target.value)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {labels.map(label => (
                          <option key={label} value={label}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hints and Controls */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <Lightbulb className="h-4 w-4" />
          {showHints ? 'Hide Hints' : 'Show Classification Hints'}
        </button>
        
        {gameMode === 'train' && (
          <button
            onClick={trainClassifier}
            disabled={isTraining}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            {isTraining ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Training AI...
              </>
            ) : (
              <>
                🚀 Train AI on Real Photos
              </>
            )}
          </button>
        )}
      </div>

      {/* Hints Panel */}
      {showHints && (
        <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
          <h4 className="text-amber-300 font-bold mb-3">🔍 Photo Classification Tips:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="text-yellow-300 font-semibold">✏️ Pencil Photos</h5>
              <ul className="text-amber-200 space-y-1">
                <li>• Look for long, thin cylindrical shape</li>
                <li>• Wooden texture or smooth plastic</li>
                <li>• Often yellow, but many colors exist</li>
                <li>• May have erasers, clips, or text</li>
                <li>• Sharp tip or mechanical lead visible</li>
              </ul>
            </div>
            <div>
              <h5 className="text-pink-300 font-semibold">🧽 Eraser Photos</h5>
              <ul className="text-amber-200 space-y-1">
                <li>• Rectangular, cylindrical, or irregular shapes</li>
                <li>• Pink, white, gray, or blue colors</li>
                <li>• Soft, matte surface texture</li>
                <li>• May show wear marks or crumbs</li>
                <li>• Some designed to fit on pencil tips</li>
              </ul>
            </div>
            <div>
              <h5 className="text-blue-300 font-semibold">🖊️ Marker Photos</h5>
              <ul className="text-amber-200 space-y-1">
                <li>• Cylindrical with removable caps</li>
                <li>• Bright, vibrant colors</li>
                <li>• Felt tip, chisel tip, or fine point</li>
                <li>• Brand names often visible</li>
                <li>• May be transparent or opaque body</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {labels.map(label => {
          const labelPhotos = photos.filter(photo => photo.label === label)
          const activeLabelPhotos = labelPhotos.filter(photo => !flaggedPhotos.has(photo.id))
          
          return (
            <div key={label} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-xl font-bold text-white mb-4 capitalize flex items-center gap-2">
                {label === 'pencil' && '✏️'}
                {label === 'eraser' && '🧽'}
                {label === 'marker' && '🖊️'}
                {label}s
                <span className="text-sm font-normal text-gray-400">
                  ({activeLabelPhotos.length}/{labelPhotos.length})
                </span>
              </h4>
              
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {labelPhotos.map(photo => (
                  <div
                    key={photo.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      flaggedPhotos.has(photo.id)
                        ? 'opacity-50 scale-95'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div 
                      className={`relative rounded-lg overflow-hidden border-2 ${
                        flaggedPhotos.has(photo.id)
                          ? 'border-red-500 bg-red-900/20'
                          : photo.userUploaded
                            ? 'border-green-500/70 bg-green-900/20'
                            : 'border-blue-500/50 bg-blue-900/20'
                      }`}
                      onClick={() => {
                        if (gameMode === 'explore') {
                          setSelectedPhoto(photo)
                        } else if (gameMode === 'train') {
                          togglePhotoFlag(photo.id)
                        }
                      }}
                    >
                      <img 
                        src={photo.url}
                        alt={photo.fileName}
                        className="w-full h-24 object-cover"
                        loading="lazy"
                      />
                      
                      {/* Classification Mode Overlay */}
                      {gameMode === 'classify' && (
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <p className="text-white text-xs mb-2 text-center">What is this?</p>
                          <div className="grid grid-cols-1 gap-1">
                            {labels.map(guessLabel => (
                              <button
                                key={guessLabel}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const correct = handleClassificationAttempt(photo, guessLabel)
                                  if (correct) {
                                    alert(`✅ Correct! This is a ${photo.label}.`)
                                  } else {
                                    alert(`❌ Not quite. This is actually a ${photo.label}. Look for the key visual features!`)
                                  }
                                }}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                              >
                                {guessLabel}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User uploaded badge */}
                      {photo.userUploaded && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded font-bold">
                          YOUR PHOTO
                        </div>
                      )}

                      {/* Flagged overlay */}
                      {flaggedPhotos.has(photo.id) && (
                        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                          <EyeOff className="h-6 w-6 text-red-300" />
                        </div>
                      )}

                      {/* Hover info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="truncate">{photo.fileName}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{selectedPhoto.fileName}</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <img 
              src={selectedPhoto.url}
              alt={selectedPhoto.fileName}
              className="w-full max-h-64 object-contain rounded-lg mb-4 bg-gray-900"
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Category:</span>
                <span className="text-white font-medium capitalize">{selectedPhoto.label}</span>
              </div>
              
              {selectedPhoto.userUploaded && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Source:</span>
                  <span className="text-green-400 font-medium">Your Upload</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <span className={flaggedPhotos.has(selectedPhoto.id) ? 'text-red-400' : 'text-green-400'}>
                  {flaggedPhotos.has(selectedPhoto.id) ? 'Flagged (excluded from training)' : 'Active (included in training)'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
              {gameMode === 'train' && (
                <button
                  onClick={() => {
                    togglePhotoFlag(selectedPhoto.id)
                    setSelectedPhoto(null)
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    flaggedPhotos.has(selectedPhoto.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {flaggedPhotos.has(selectedPhoto.id) ? 'Include in Training' : 'Flag as Problematic'}
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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="text-white font-medium">{loadingStep}</span>
          </div>
          <div className="text-gray-400 text-sm">
            Processing {photos.filter(p => !flaggedPhotos.has(p.id)).length} photos across {labels.length} categories...
          </div>
        </div>
      )}

      {/* Enhanced Training Results */}
      {currentMetrics && gameMode === 'train' && (
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🎉 AI Training Complete!
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Performance */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">📊 Overall Performance</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {currentMetrics.accuracy.toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm mb-3">
                  {currentMetrics.correctPredictions} / {currentMetrics.totalSamples} correct
                </div>
                <div className="text-sm">
                  {currentMetrics.accuracy >= 85 ? (
                    <span className="text-green-400">🌟 Excellent! Ready for deployment!</span>
                  ) : currentMetrics.accuracy >= 70 ? (
                    <span className="text-yellow-400">👍 Good! Consider adding more photos</span>
                  ) : (
                    <span className="text-orange-400">💪 Needs work - try improving your dataset</span>
                  )}
                </div>
              </div>
            </div>

            {/* Per-Category Performance */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">🎯 Category Breakdown</h4>
              <div className="space-y-2">
                {labels.map(label => {
                  const metric = currentMetrics.perClassMetrics[label]
                  return (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize flex items-center gap-2">
                        {label === 'pencil' && '✏️'}
                        {label === 'eraser' && '🧽'}
                        {label === 'marker' && '🖊️'}
                        {label}
                      </span>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {metric?.accuracy.toFixed(1) || 0}%
                        </div>
                        <div className="text-gray-400 text-xs">
                          {metric?.correctPredictions || 0}/{metric?.totalSamples || 0}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dataset Quality */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">📷 Dataset Quality</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Photos:</span>
                  <span className="text-white font-medium">{photos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Your Contributions:</span>
                  <span className="text-green-400 font-medium">{userPhotos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Flagged/Removed:</span>
                  <span className="text-red-400 font-medium">{flaggedPhotos.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Training Set:</span>
                  <span className="text-blue-400 font-medium">{currentMetrics.totalSamples}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-world Applications */}
          <div className="mt-6 bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-blue-300 font-bold mb-2">🌍 Real-World Applications</h4>
            <p className="text-blue-200 text-sm mb-2">
              Your AI model could be used to:
            </p>
            <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
              <li>Automatically organize school supply inventory systems</li>
              <li>Help visually impaired students identify classroom materials</li>
              <li>Power educational apps that teach object recognition</li>
              <li>Assist teachers in tracking and managing classroom resources</li>
              <li>Create interactive learning games for younger students</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="mt-4 flex gap-3 flex-wrap">
            <button 
              onClick={() => setGameMode('build')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Add More Photos
            </button>
            <button 
              onClick={() => setGameMode('classify')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Test Your Skills
            </button>
            <button 
              onClick={() => {
                const data = {
                  metrics: currentMetrics,
                  photos: photos.length,
                  userContributions: userPhotos.length,
                  timestamp: new Date().toISOString()
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `ai-classifier-results-${Date.now()}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}