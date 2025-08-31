'use client'

import { useState, useEffect } from 'react'
import { Play, RotateCcw, CheckCircle, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react'

interface CodingStep {
  id: string
  title: string
  explanation: string
  starterCode: string
  expectedOutput: string
  hint: string
  solution: string
}

interface StepByStepCodingProps {
  lessonId: string
  onStepComplete?: (stepId: string) => void
  onAllStepsComplete?: () => void
}

export default function StepByStepCoding({ lessonId, onStepComplete, onAllStepsComplete }: StepByStepCodingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [stepCompleted, setStepCompleted] = useState<boolean[]>([])

  // AI Classifier coding steps
  const codingSteps: CodingStep[] = [
    {
      id: 'setup-data',
      title: '📊 Step 1: Set Up Your Training Data',
      explanation: 'First, let\'s create some sample training data that represents images and their labels. In real AI, this would be thousands of actual images, but we\'ll simulate it with a simple list.',
      starterCode: `# 🚀 AI Classifier - Step 1: Data Setup
# Let's create our training dataset!

training_data = [
    {"image": "pencil_001.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_001.jpg", "label": "eraser", "quality": "blurry"},
    {"image": "marker_001.jpg", "label": "marker", "quality": "good"},
    # TODO: Add 3 more training examples below
    # Use different image names and mix of good/blurry quality
]

print("📁 Training data loaded!")
print(f"Total images: {len(training_data)}")

# YOUR TASK: Add 3 more training examples to the list above`,
      expectedOutput: `📁 Training data loaded!
Total images: 6`,
      hint: 'Add dictionary entries like {"image": "pencil_002.jpg", "label": "pencil", "quality": "good"} to the list. Try adding one pencil, one eraser, and one marker.',
      solution: `training_data = [
    {"image": "pencil_001.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_001.jpg", "label": "eraser", "quality": "blurry"},
    {"image": "marker_001.jpg", "label": "marker", "quality": "good"},
    {"image": "pencil_002.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_002.jpg", "label": "eraser", "quality": "duplicate"},
    {"image": "marker_002.jpg", "label": "marker", "quality": "blurry"},
]`
    },
    {
      id: 'count-labels',
      title: '🧮 Step 2: Count Your Labels',
      explanation: 'Before training AI, we need to know how many examples we have for each category. Unbalanced data (100 pencils, 5 erasers) creates biased AI!',
      starterCode: `# 🧮 Step 2: Count Labels Function
# Write a function to count how many images we have for each label

def count_labels(data):
    """Count how many examples we have for each label"""
    counts = {}
    
    # TODO: Write a loop that goes through each item in data
    # For each item, get the label and count it
    # Hint: Use item["label"] to get the label
    
    return counts

# Test your function with our training data
training_data = [
    {"image": "pencil_001.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_001.jpg", "label": "eraser", "quality": "blurry"},
    {"image": "marker_001.jpg", "label": "marker", "quality": "good"},
    {"image": "pencil_002.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_002.jpg", "label": "eraser", "quality": "good"},
    {"image": "marker_002.jpg", "label": "marker", "quality": "duplicate"},
]

label_counts = count_labels(training_data)
print("📊 Label counts:", label_counts)`,
      expectedOutput: `📊 Label counts: {'pencil': 2, 'eraser': 2, 'marker': 2}`,
      hint: 'Use a for loop: "for item in data:" then check if the label exists in your counts dictionary. If it exists, add 1. If not, set it to 1.',
      solution: `def count_labels(data):
    counts = {}
    for item in data:
        label = item["label"]
        if label in counts:
            counts[label] += 1
        else:
            counts[label] = 1
    return counts`
    },
    {
      id: 'clean-data',
      title: '🧹 Step 3: Clean Your Dataset',
      explanation: 'AI learns from examples, so bad examples create bad AI! Let\'s remove blurry and duplicate images that would confuse our model.',
      starterCode: `# 🧹 Step 3: Clean Dataset Function
# Remove bad quality images that would hurt AI performance

def clean_dataset(data):
    """Remove blurry and duplicate images, keep only good ones"""
    clean_data = []
    
    # TODO: Write a loop that goes through each item
    # Only add items to clean_data if quality == "good"
    
    return clean_data

# Test your cleaning function
training_data = [
    {"image": "pencil_001.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_001.jpg", "label": "eraser", "quality": "blurry"},
    {"image": "marker_001.jpg", "label": "marker", "quality": "good"},
    {"image": "pencil_002.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_002.jpg", "label": "eraser", "quality": "good"},
    {"image": "marker_002.jpg", "label": "marker", "quality": "duplicate"},
]

clean_data = clean_dataset(training_data)
print(f"🧹 Cleaned dataset: {len(clean_data)} good images out of {len(training_data)} total")
print("✅ Kept these images:")
for item in clean_data:
    print(f"   {item['image']} ({item['label']})"),`,
      expectedOutput: `🧹 Cleaned dataset: 4 good images out of 6 total
✅ Kept these images:
   pencil_001.jpg (pencil)
   marker_001.jpg (marker)
   pencil_002.jpg (pencil)
   eraser_002.jpg (eraser)`,
      hint: 'Use an if statement: "if item["quality"] == "good":" then append the item to clean_data list.',
      solution: `def clean_dataset(data):
    clean_data = []
    for item in data:
        if item["quality"] == "good":
            clean_data.append(item)
    return clean_data`
    },
    {
      id: 'train-model',
      title: '🤖 Step 4: Train Your AI Model',
      explanation: 'Now for the magic moment! Let\'s simulate training an AI model. Real training takes hours/days, but our simulation shows the key concepts.',
      starterCode: `# 🤖 Step 4: AI Training Simulation
# Simulate the process of training a machine learning model

import time
import random

def train_ai_model(clean_data):
    """Simulate training an AI model and return accuracy"""
    print("🤖 Starting AI training...")
    
    # TODO: Add a loop that simulates 3 training epochs
    # Print progress for each epoch and add a small delay
    # Hint: Use range(3) and time.sleep(0.5)
    
    # Calculate accuracy based on data quality
    num_images = len(clean_data)
    base_accuracy = 65  # Start at 65%
    
    # TODO: Calculate final accuracy
    # Add 5% for each clean image (more data = better AI)
    # But cap it at 95% (AI is never perfect!)
    final_accuracy = # YOUR CALCULATION HERE
    
    print(f"🎯 Training complete! Final accuracy: {final_accuracy}%")
    return final_accuracy

# Use your cleaned data from the previous step
clean_data = [
    {"image": "pencil_001.jpg", "label": "pencil", "quality": "good"},
    {"image": "marker_001.jpg", "label": "marker", "quality": "good"},
    {"image": "pencil_002.jpg", "label": "pencil", "quality": "good"},
    {"image": "eraser_002.jpg", "label": "eraser", "quality": "good"},
]

accuracy = train_ai_model(clean_data)`,
      expectedOutput: `🤖 Starting AI training...
⚡ Epoch 1/3: Learning patterns...
⚡ Epoch 2/3: Improving accuracy...
⚡ Epoch 3/3: Fine-tuning model...
🎯 Training complete! Final accuracy: 85%`,
      hint: 'For the loop: "for i in range(3):" then print epoch info. For accuracy: base_accuracy + (num_images * 5), but use min(95, ...) to cap at 95%.',
      solution: `def train_ai_model(clean_data):
    print("🤖 Starting AI training...")
    
    for epoch in range(3):
        print(f"⚡ Epoch {epoch + 1}/3: Learning patterns...")
        time.sleep(0.5)
    
    num_images = len(clean_data)
    base_accuracy = 65
    final_accuracy = min(95, base_accuracy + (num_images * 5))
    
    print(f"🎯 Training complete! Final accuracy: {final_accuracy}%")
    return final_accuracy`
    },
    {
      id: 'test-predictions',
      title: '🔮 Step 5: Test AI Predictions',
      explanation: 'The real test: can your AI recognize new images it has never seen before? Let\'s create a prediction function and test it!',
      starterCode: `# 🔮 Step 5: AI Prediction Testing
# Test your trained AI on new, unseen images

def predict_image(image_name, trained_accuracy):
    """Simulate AI making a prediction on a new image"""
    
    # TODO: Create logic to make predictions
    # 1. Get a random number between 0-100
    # 2. If it's less than trained_accuracy, make correct prediction
    # 3. Otherwise, make a random wrong prediction
    
    # Image patterns (in real AI, this would be visual features)
    image_patterns = {
        "pencil": ["long", "thin", "pointed", "wooden"],
        "eraser": ["rectangular", "pink", "soft", "rubbery"], 
        "marker": ["cylindrical", "colorful", "cap", "ink"]
    }
    
    # TODO: Determine the correct label from the image name
    # Hint: If "pencil" is in image_name, correct_label = "pencil"
    
    # TODO: Make prediction based on accuracy
    # Use random.randint(1, 100) and compare to trained_accuracy
    
    return prediction, confidence

# Test your AI on new images
test_images = [
    "new_pencil_123.jpg",
    "mystery_eraser_456.jpg", 
    "unknown_marker_789.jpg"
]

print("🔮 Testing AI predictions on new images:")
for image in test_images:
    prediction, confidence = predict_image(image, 85)  # Use 85% accuracy
    print(f"📷 {image} → Predicted: {prediction} ({confidence}% confidence)")`,
      expectedOutput: `🔮 Testing AI predictions on new images:
📷 new_pencil_123.jpg → Predicted: pencil (87% confidence)
📷 mystery_eraser_456.jpg → Predicted: eraser (91% confidence)
📷 unknown_marker_789.jpg → Predicted: marker (83% confidence)`,
      hint: 'Extract the correct label using if statements or string contains. For prediction, generate random number and compare to accuracy. Add some randomness to confidence too!',
      solution: `def predict_image(image_name, trained_accuracy):
    labels = ["pencil", "eraser", "marker"]
    
    # Determine correct label from filename
    correct_label = None
    for label in labels:
        if label in image_name:
            correct_label = label
            break
    
    # Make prediction based on accuracy
    random_chance = random.randint(1, 100)
    if random_chance <= trained_accuracy and correct_label:
        prediction = correct_label
        confidence = random.randint(80, 95)
    else:
        wrong_labels = [l for l in labels if l != correct_label]
        prediction = random.choice(wrong_labels) if wrong_labels else random.choice(labels)
        confidence = random.randint(60, 80)
    
    return prediction, confidence`
    }
  ]

  useEffect(() => {
    if (codingSteps.length > 0) {
      setCode(codingSteps[currentStep].starterCode)
      setStepCompleted(new Array(codingSteps.length).fill(false))
    }
  }, [currentStep])

  const executeCode = async () => {
    setIsRunning(true)
    setOutput('')

    try {
      // Create a new function that captures print output
      const captureCode = `
import sys
from io import StringIO
import random
import time

# Capture print output
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()

try:
${code}
finally:
    sys.stdout = old_stdout

captured_output.getvalue()
`
      
      // Execute the code with Pyodide
      if (typeof window !== 'undefined' && (window as any).pyodide) {
        const result = await (window as any).pyodide.runPython(captureCode)
        setOutput(result || 'Code executed successfully!')
        
        // Check if step is completed based on output
        const step = codingSteps[currentStep]
        const isCorrect = result.includes(step.expectedOutput.split('\n')[0]) // Check first line
        
        if (isCorrect) {
          const newCompleted = [...stepCompleted]
          newCompleted[currentStep] = true
          setStepCompleted(newCompleted)
          
          // Add success message to output
          setOutput(result + '\n\n🎉 Excellent work! Your code is correct! Moving to next step...')
          
          if (onStepComplete) {
            onStepComplete(step.id)
          }
          
          // Auto-advance to next step after celebration delay
          setTimeout(() => {
            if (currentStep < codingSteps.length - 1) {
              setCurrentStep(currentStep + 1)
              setShowHint(false)
              setShowSolution(false)
              setOutput('') // Clear output for fresh start
            } else if (onAllStepsComplete) {
              onAllStepsComplete()
            }
          }, 2000) // 2 second delay to let them see the success
        }
      }
    } catch (error) {
      setOutput(`❌ Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const nextStep = () => {
    if (currentStep < codingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowHint(false)
      setShowSolution(false)
    } else if (onAllStepsComplete) {
      onAllStepsComplete()
    }
  }

  const resetCode = () => {
    setCode(codingSteps[currentStep].starterCode)
    setOutput('')
    setShowHint(false)
    setShowSolution(false)
  }

  const step = codingSteps[currentStep]
  if (!step) return null

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Step-by-Step AI Coding</h2>
        <div className="flex items-center gap-2">
          {codingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-blue-900/40 rounded-2xl p-6 border border-blue-500/30">
        <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
        <p className="text-blue-200 mb-6">{step.explanation}</p>
        
        {/* Code Editor */}
        <div className="bg-black/50 rounded-xl border border-gray-600 overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm font-medium">AI Classifier Code</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={executeCode}
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-black text-green-300 p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="Write your Python code here..."
          />
        </div>

        {/* Output */}
        {output && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-600 mt-4">
            <h4 className="text-white font-medium mb-2">Output:</h4>
            <pre className="text-green-300 text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {/* Help Section */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Need a Hint?'}
          </button>
          
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
          
          {stepCompleted[currentStep] && (
            <button
              onClick={nextStep}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ml-auto"
            >
              {currentStep < codingSteps.length - 1 ? 'Next Step' : 'Complete Lesson'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="text-yellow-300 font-medium mb-2">💡 Hint:</h4>
                <p className="text-yellow-200 text-sm">{step.hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 mt-4">
            <h4 className="text-purple-300 font-medium mb-2">✅ Solution:</h4>
            <pre className="text-purple-200 text-sm bg-black/30 p-3 rounded overflow-x-auto">
              {step.solution}
            </pre>
          </div>
        )}

        {/* Expected Output */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 mt-4">
          <h4 className="text-gray-300 font-medium mb-2">🎯 Expected Output:</h4>
          <pre className="text-gray-400 text-sm">{step.expectedOutput}</pre>
        </div>
      </div>
    </div>
  )
}