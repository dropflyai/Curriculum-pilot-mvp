'use client'

import { useState, useEffect } from 'react'
import { Share2, Eye, Code, Star, Trophy, Calendar, Clock, Download, Heart, MessageCircle, Play } from 'lucide-react'

interface StudentProject {
  id: string
  name: string
  code: string
  output: string
  timestamp: Date
  screenshots?: string[]
  description: string
  tags: string[]
  studentName?: string
  likes: number
  views: number
  featured: boolean
  lessonId: string
  metrics?: {
    accuracy?: number
    lines: number
    functions: number
    variables: number
    comments: number
  }
}

interface ProjectGalleryProps {
  showMyProjects?: boolean
  lessonFilter?: string
  onSelectProject?: (project: StudentProject) => void
}

export default function StudentProjectGallery({ 
  showMyProjects = false, 
  lessonFilter = '',
  onSelectProject 
}: ProjectGalleryProps) {
  const [projects, setProjects] = useState<StudentProject[]>([])
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'featured'>('newest')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCode, setShowCode] = useState(false)

  // Load projects from localStorage and add some demo projects
  useEffect(() => {
    const savedProjects = localStorage.getItem('studentProjects')
    let userProjects: StudentProject[] = []
    
    if (savedProjects) {
      userProjects = JSON.parse(savedProjects).map((project: any) => ({
        ...project,
        likes: Math.floor(Math.random() * 15),
        views: Math.floor(Math.random() * 50) + 10,
        featured: Math.random() > 0.8,
        studentName: 'You'
      }))
    }

    // Add demo projects to showcase what's possible
    const demoProjects: StudentProject[] = [
      {
        id: 'demo-1',
        name: 'Smart Recycling Classifier',
        code: `# 🌍 Smart Recycling AI Classifier
import random

# AI Model Configuration
DATASET = "recycle-audit"
LABELS = ["plastic", "paper", "metal"]

def train_recycling_classifier():
    print("🤖 Training Smart Recycling AI...")
    print("📊 Processing 150 recycling images...")
    
    # Simulated training results
    accuracy = 92.5
    print(f"✅ Training Complete! Accuracy: {accuracy}%")
    return accuracy

def classify_item(item_photo):
    # Real-world classification simulation
    classifications = {
        "plastic_bottle": ("plastic", 0.94),
        "newspaper": ("paper", 0.89),
        "aluminum_can": ("metal", 0.96)
    }
    
    prediction, confidence = classifications.get(item_photo, ("unknown", 0.5))
    return prediction, confidence

# Train the model
accuracy = train_recycling_classifier()

# Test with sample items
test_items = ["plastic_bottle", "newspaper", "aluminum_can"]
print("\\n🧪 Testing AI Classifier:")

for item in test_items:
    prediction, confidence = classify_item(item)
    print(f"📸 {item}: {prediction} ({confidence*100:.1f}% confident)")

print("\\n🌟 This AI could help save the environment!")`,
        output: `🤖 Training Smart Recycling AI...
📊 Processing 150 recycling images...
✅ Training Complete! Accuracy: 92.5%

🧪 Testing AI Classifier:
📸 plastic_bottle: plastic (94.0% confident)
📸 newspaper: paper (89.0% confident)  
📸 aluminum_can: metal (96.0% confident)

🌟 This AI could help save the environment!`,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        description: "Built an AI that can identify recyclable materials to help reduce waste! This project uses real photos to train a classifier that could be deployed in smart recycling bins.",
        tags: ['week-01', 'ai-classifier', 'environmental', 'beginner'],
        studentName: 'Alex Chen',
        likes: 12,
        views: 34,
        featured: true,
        lessonId: 'week-01',
        metrics: {
          accuracy: 92.5,
          lines: 42,
          functions: 2,
          variables: 6,
          comments: 8
        }
      },
      {
        id: 'demo-2',
        name: 'Motivational Study 8-Ball',
        code: `# 🎱 Motivational Study Magic 8-Ball
import random
import time

class StudyMotivator8Ball:
    def __init__(self):
        self.positive_study_responses = [
            "Yes! You've got this! 💪",
            "Absolutely! Study time pays off! 📚",
            "For sure! Your future self will thank you! ⭐",
            "Definitely! Knowledge is power! 🧠",
            "Yes! Small steps lead to big results! 🚀"
        ]
        
        self.study_tips = [
            "Try the 25-minute Pomodoro technique! 🍅",
            "Take breaks every hour - your brain needs rest! 😴",
            "Teach someone else - it helps you remember! 👥",
            "Make flashcards for tough concepts! 📇",
            "Find your peak focus hours! ⏰"
        ]
        
        self.encouragement = [
            "You're building your future! 🏗️",
            "Every expert was once a beginner! 🌱",
            "Progress beats perfection! 📈",
            "Your effort matters more than grades! 💯",
            "Mistakes are learning opportunities! 🎯"
        ]
        
        self.question_count = 0
        
    def ask_question(self, question):
        self.question_count += 1
        print(f"\\n🎱 Question #{self.question_count}: {question}")
        print("🔮 *The Study 8-Ball is thinking...*")
        time.sleep(1)
        
        # Smart response based on question type
        if any(word in question.lower() for word in ["study", "test", "exam", "homework"]):
            response = random.choice(self.positive_study_responses)
            tip = random.choice(self.study_tips)
            print(f"✨ {response}")
            print(f"💡 Bonus tip: {tip}")
        elif any(word in question.lower() for word in ["can't", "hard", "difficult", "fail"]):
            response = random.choice(self.encouragement)
            print(f"💚 {response}")
        else:
            response = random.choice(self.positive_study_responses + self.encouragement)
            print(f"🌟 {response}")
            
        return response

# Create the motivational 8-ball
study_ball = StudyMotivator8Ball()

# Demo questions
demo_questions = [
    "Should I study for my math test tonight?",
    "Will I understand this difficult chapter?",
    "Can I improve my grades this semester?",
    "Is it worth spending extra time on homework?"
]

print("🎓 Welcome to the Study Motivation 8-Ball!")
print("Ask questions about your studies for encouragement!")

for question in demo_questions:
    study_ball.ask_question(question)

print(f"\\n📊 You asked {study_ball.question_count} questions!")
print("🎉 Keep that curiosity and motivation going!")`,
        output: `🎓 Welcome to the Study Motivation 8-Ball!
Ask questions about your studies for encouragement!

🎱 Question #1: Should I study for my math test tonight?
🔮 *The Study 8-Ball is thinking...*
✨ Yes! You've got this! 💪
💡 Bonus tip: Try the 25-minute Pomodoro technique! 🍅

🎱 Question #2: Will I understand this difficult chapter?
🔮 *The Study 8-Ball is thinking...*
💚 Every expert was once a beginner! 🌱

🎱 Question #3: Can I improve my grades this semester?
🔮 *The Study 8-Ball is thinking...*
✨ Definitely! Knowledge is power! 🧠
💡 Bonus tip: Take breaks every hour - your brain needs rest! 😴

🎱 Question #4: Is it worth spending extra time on homework?
🔮 *The Study 8-Ball is thinking...*
✨ For sure! Your future self will thank you! ⭐
💡 Bonus tip: Make flashcards for tough concepts! 📇

📊 You asked 4 questions!
🎉 Keep that curiosity and motivation going!`,
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        description: "Enhanced the classic Magic 8-Ball with study motivation and smart responses! This version gives encouraging advice and study tips based on the type of question asked.",
        tags: ['week-02', 'magic-8-ball', 'motivation', 'intermediate'],
        studentName: 'Maya Patel',
        likes: 18,
        views: 42,
        featured: true,
        lessonId: 'week-02',
        metrics: {
          lines: 67,
          functions: 2,
          variables: 5,
          comments: 12
        }
      },
      {
        id: 'demo-3',
        name: 'School Supply Scanner',
        code: `# 📱 School Supply Scanner App
import random

class SupplyScanner:
    def __init__(self):
        self.inventory = {
            "pencil": 0,
            "eraser": 0, 
            "marker": 0
        }
        
        # AI confidence thresholds
        self.confidence_threshold = 0.85
        
    def scan_item(self, photo_name):
        """Simulate scanning a school supply photo"""
        print(f"📸 Scanning: {photo_name}")
        print("🤖 AI Processing...")
        
        # Simulate AI classification
        if "pencil" in photo_name.lower():
            item_type = "pencil"
            confidence = random.uniform(0.87, 0.98)
        elif "eraser" in photo_name.lower():
            item_type = "eraser"
            confidence = random.uniform(0.82, 0.96)
        elif "marker" in photo_name.lower():
            item_type = "marker"
            confidence = random.uniform(0.79, 0.94)
        else:
            item_type = "unknown"
            confidence = random.uniform(0.3, 0.7)
            
        print(f"🎯 Detected: {item_type} ({confidence:.1%} confidence)")
        
        if confidence >= self.confidence_threshold:
            self.inventory[item_type] += 1
            print(f"✅ Added to inventory!")
            return True
        else:
            print(f"⚠️ Low confidence - please try again")
            return False
            
    def show_inventory(self):
        """Display current inventory"""
        print("\\n📦 Current Inventory:")
        print("=" * 25)
        total = 0
        for item, count in self.inventory.items():
            print(f"{item.capitalize()}: {count}")
            total += count
        print(f"\\nTotal items: {total}")
        return total

# Create scanner app
scanner = SupplyScanner()

# Simulate scanning different items
items_to_scan = [
    "yellow_pencil_001.jpg",
    "pink_eraser_003.jpg", 
    "blue_marker_002.jpg",
    "red_pencil_004.jpg",
    "white_eraser_001.jpg"
]

print("🏫 Welcome to School Supply Scanner!")
print("📱 Point your camera at school supplies to count them\\n")

successful_scans = 0
for item in items_to_scan:
    if scanner.scan_item(item):
        successful_scans += 1
    print()

# Show final results
total_items = scanner.show_inventory()
print(f"\\n📊 Scan Results:")
print(f"✅ Successful scans: {successful_scans}/{len(items_to_scan)}")
print(f"🎯 Success rate: {successful_scans/len(items_to_scan):.1%}")

if successful_scans >= 4:
    print("🌟 Excellent scanning! AI is working great!")
elif successful_scans >= 2:
    print("👍 Good job! AI needs more training data")
else:
    print("💪 Keep practicing! More photos will improve accuracy")`,
        output: `🏫 Welcome to School Supply Scanner!
📱 Point your camera at school supplies to count them

📸 Scanning: yellow_pencil_001.jpg
🤖 AI Processing...
🎯 Detected: pencil (94.2% confidence)
✅ Added to inventory!

📸 Scanning: pink_eraser_003.jpg
🤖 AI Processing...
🎯 Detected: eraser (88.7% confidence)
✅ Added to inventory!

📸 Scanning: blue_marker_002.jpg
🤖 AI Processing...
🎯 Detected: marker (91.3% confidence)
✅ Added to inventory!

📸 Scanning: red_pencil_004.jpg
🤖 AI Processing...
🎯 Detected: pencil (96.8% confidence)
✅ Added to inventory!

📸 Scanning: white_eraser_001.jpg
🤖 AI Processing...
🎯 Detected: eraser (93.1% confidence)
✅ Added to inventory!

📦 Current Inventory:
=========================
Pencil: 2
Eraser: 2
Marker: 1

Total items: 5

📊 Scan Results:
✅ Successful scans: 5/5
🎯 Success rate: 100.0%
🌟 Excellent scanning! AI is working great!`,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        description: "Built a practical school supply inventory app using AI classification! Could be used by teachers to quickly count classroom materials or by students to organize their supplies.",
        tags: ['week-01', 'practical', 'inventory', 'advanced'],
        studentName: 'Jordan Smith',
        likes: 9,
        views: 28,
        featured: false,
        lessonId: 'week-01',
        metrics: {
          accuracy: 89.3,
          lines: 85,
          functions: 3,
          variables: 8,
          comments: 15
        }
      }
    ]

    // Combine user projects with demo projects
    const allProjects = showMyProjects 
      ? userProjects 
      : [...userProjects, ...demoProjects]

    // Filter by lesson if specified
    const filteredProjects = lessonFilter
      ? allProjects.filter(p => p.lessonId === lessonFilter)
      : allProjects

    setProjects(filteredProjects)
  }, [showMyProjects, lessonFilter])

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.views) - (a.likes + a.views)
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'newest':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
  })

  // Get all available tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)))

  // Filter by tags
  const filteredProjects = filterTags.length > 0
    ? sortedProjects.filter(project => 
        filterTags.some(tag => project.tags.includes(tag))
      )
    : sortedProjects

  const handleLike = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, likes: project.likes + 1 }
        : project
    ))
  }

  const handleView = (project: StudentProject) => {
    setSelectedProject(project)
    setProjects(prev => prev.map(p => 
      p.id === project.id 
        ? { ...p, views: p.views + 1 }
        : p
    ))
    
    if (onSelectProject) {
      onSelectProject(project)
    }
  }

  const getProjectIcon = (lessonId: string) => {
    switch (lessonId) {
      case 'week-01': return '🤖'
      case 'week-02': return '🎱'
      default: return '💻'
    }
  }

  const getTagColor = (tag: string) => {
    const colors = {
      'week-01': 'bg-blue-600',
      'week-02': 'bg-purple-600',
      'beginner': 'bg-green-600',
      'intermediate': 'bg-yellow-600',
      'advanced': 'bg-red-600',
      'ai-classifier': 'bg-indigo-600',
      'magic-8-ball': 'bg-pink-600',
      'environmental': 'bg-teal-600',
      'motivation': 'bg-orange-600',
      'practical': 'bg-cyan-600',
      'inventory': 'bg-gray-600'
    }
    return colors[tag as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
          🏆 Student Project Gallery
        </h2>
        <p className="text-purple-200 mb-4">
          Discover amazing projects built by students! Get inspired, learn new techniques, and showcase your own creations.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{projects.length}</div>
            <div className="text-blue-200">Total Projects</div>
          </div>
          <div className="bg-green-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{projects.filter(p => p.featured).length}</div>
            <div className="text-green-200">Featured</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{showMyProjects ? projects.filter(p => p.studentName === 'You').length : allTags.length}</div>
            <div className="text-purple-200">{showMyProjects ? 'Your Projects' : 'Categories'}</div>
          </div>
          <div className="bg-orange-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{Math.round(projects.reduce((sum, p) => sum + p.likes, 0) / Math.max(projects.length, 1))}</div>
            <div className="text-orange-200">Avg. Likes</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* Sort Options */}
            <div className="flex gap-2">
              <label className="text-gray-300 text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 6).map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (filterTags.includes(tag)) {
                    setFilterTags(prev => prev.filter(t => t !== tag))
                  } else {
                    setFilterTags(prev => [...prev, tag])
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterTags.includes(tag)
                    ? `${getTagColor(tag)} text-white`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
            {filterTags.length > 0 && (
              <button
                onClick={() => setFilterTags([])}
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-400 mb-4">
            {showMyProjects 
              ? "You haven't saved any projects yet. Complete a lesson to create your first project!"
              : "Be the first to share a project! Complete a lesson and save your work to the gallery."
            }
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Start Building →
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className={`bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300 group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Project Header */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getProjectIcon(project.lessonId)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        by {project.studentName}
                      </p>
                    </div>
                  </div>
                  {project.featured && (
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      Featured
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Metrics */}
                {project.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">
                    {project.metrics.accuracy && (
                      <div className="bg-green-900/20 rounded p-2 text-center">
                        <div className="text-green-400 font-bold">{project.metrics.accuracy}%</div>
                        <div className="text-green-300">Accuracy</div>
                      </div>
                    )}
                    <div className="bg-blue-900/20 rounded p-2 text-center">
                      <div className="text-blue-400 font-bold">{project.metrics.lines}</div>
                      <div className="text-blue-300">Lines</div>
                    </div>
                    <div className="bg-purple-900/20 rounded p-2 text-center">
                      <div className="text-purple-400 font-bold">{project.metrics.functions}</div>
                      <div className="text-purple-300">Functions</div>
                    </div>
                    <div className="bg-orange-900/20 rounded p-2 text-center">
                      <div className="text-orange-400 font-bold">{project.metrics.comments}</div>
                      <div className="text-orange-300">Comments</div>
                    </div>
                  </div>
                )}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {project.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {project.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLike(project.id)}
                      className="text-gray-400 hover:text-red-400 p-2 rounded transition-colors"
                      title="Like project"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleView(project)}
                      className="text-gray-400 hover:text-blue-400 p-2 rounded transition-colors"
                      title="View project"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(project)
                        setShowCode(true)
                      }}
                      className="text-gray-400 hover:text-green-400 p-2 rounded transition-colors"
                      title="View code"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  {getProjectIcon(selectedProject.lessonId)} {selectedProject.name}
                </h3>
                <p className="text-gray-400">by {selectedProject.studentName}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Info */}
              <div>
                <h4 className="text-white font-semibold mb-3">About This Project</h4>
                <p className="text-gray-300 mb-4">{selectedProject.description}</p>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-medium mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map(tag => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProject.metrics && (
                    <div>
                      <h5 className="text-white font-medium mb-2">Project Metrics</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedProject.metrics.accuracy && (
                          <div className="bg-green-900/20 rounded p-3 text-center">
                            <div className="text-green-400 font-bold text-lg">{selectedProject.metrics.accuracy}%</div>
                            <div className="text-green-300">AI Accuracy</div>
                          </div>
                        )}
                        <div className="bg-blue-900/20 rounded p-3 text-center">
                          <div className="text-blue-400 font-bold text-lg">{selectedProject.metrics.lines}</div>
                          <div className="text-blue-300">Lines of Code</div>
                        </div>
                        <div className="bg-purple-900/20 rounded p-3 text-center">
                          <div className="text-purple-400 font-bold text-lg">{selectedProject.metrics.functions}</div>
                          <div className="text-purple-300">Functions</div>
                        </div>
                        <div className="bg-orange-900/20 rounded p-3 text-center">
                          <div className="text-orange-400 font-bold text-lg">{selectedProject.metrics.comments}</div>
                          <div className="text-orange-300">Comments</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Code/Output */}
              <div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowCode(false)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      !showCode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Play className="h-4 w-4 inline mr-2" />
                    Output
                  </button>
                  <button
                    onClick={() => setShowCode(true)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      showCode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Code className="h-4 w-4 inline mr-2" />
                    Code
                  </button>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
                  <pre className="text-sm text-green-400 whitespace-pre-wrap font-mono">
                    {showCode ? selectedProject.code : selectedProject.output}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {selectedProject.likes} likes
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedProject.views} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedProject.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleLike(selectedProject.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Like
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([selectedProject.code], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${selectedProject.name.toLowerCase().replace(/\s+/g, '-')}.py`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Code
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedProject.code)
                    alert('Code copied to clipboard!')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}