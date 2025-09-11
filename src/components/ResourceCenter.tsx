'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Video, 
  Code, 
  FileText, 
  ExternalLink, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  User,
  Download,
  Play,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Lightbulb
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'tutorial' | 'documentation' | 'example' | 'video' | 'article' | 'cheatsheet'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'python-basics' | 'ai-concepts' | 'debugging' | 'best-practices' | 'algorithms' | 'web-development'
  content?: string
  codeExample?: string
  externalUrl?: string
  estimatedTime: number // minutes
  rating: number // 1-5
  tags: string[]
  author: string
  dateCreated: Date
  isBookmarked: boolean
  views: number
}

interface ResourceCenterProps {
  lessonContext?: {
    id: string
    concepts: string[]
    difficulty: string
  }
  onResourceView?: (resourceId: string) => void
}

export default function ResourceCenter({
  lessonContext,
  onResourceView
}: ResourceCenterProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'views' | 'recent'>('relevance')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  // Initialize resources
  useEffect(() => {
    const sampleResources: Resource[] = [
      // Python Basics
      {
        id: 'python-variables-guide',
        title: 'Python Variables: Complete Guide',
        description: 'Learn everything about Python variables, types, and naming conventions.',
        type: 'tutorial',
        difficulty: 'beginner',
        category: 'python-basics',
        content: `# Python Variables Guide

Variables in Python are containers that store data values. Unlike other languages, Python has no command for declaring a variable.

## Creating Variables
\`\`\`python
name = "Alice"        # String
age = 25             # Integer
height = 5.6         # Float
is_student = True    # Boolean
\`\`\`

## Variable Naming Rules
1. Must start with a letter or underscore
2. Cannot start with a number
3. Can only contain alphanumeric characters and underscores
4. Case-sensitive

## Best Practices
- Use descriptive names: \`student_age\` instead of \`a\`
- Use snake_case for variables: \`first_name\`
- Constants in UPPER_CASE: \`MAX_SIZE\``,
        codeExample: `# Good variable examples
student_name = "John Doe"
course_grade = 95.5
is_enrolled = True
student_courses = ["Math", "Science", "History"]

# Working with variables
print(f"Student: {student_name}")
print(f"Grade: {course_grade}%")
print(f"Enrolled: {is_enrolled}")`,
        estimatedTime: 15,
        rating: 4.8,
        tags: ['variables', 'types', 'naming', 'basics'],
        author: 'Dr. Maya Nexus',
        dateCreated: new Date('2024-01-15'),
        isBookmarked: false,
        views: 1234
      },
      {
        id: 'python-functions-deep-dive',
        title: 'Mastering Python Functions',
        description: 'From basic function definition to advanced concepts like decorators and lambda functions.',
        type: 'tutorial',
        difficulty: 'intermediate',
        category: 'python-basics',
        content: `# Python Functions Mastery

Functions are reusable blocks of code that perform specific tasks.

## Basic Function Syntax
\`\`\`python
def function_name(parameters):
    \"\"\"Function docstring\"\"\"
    # Function body
    return value
\`\`\`

## Function Parameters
- **Positional**: \`def greet(name, age)\`
- **Keyword**: \`def greet(name="Unknown", age=0)\`
- **Variable length**: \`def greet(*args, **kwargs)\`

## Advanced Topics
- Lambda functions: \`square = lambda x: x**2\`
- Decorators: \`@property\`, \`@staticmethod\`
- Generators: \`yield\` keyword`,
        codeExample: `# Basic function
def calculate_area(width, height):
    """Calculate rectangle area"""
    return width * height

# Function with default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Lambda function
multiply = lambda x, y: x * y

# Examples
area = calculate_area(10, 5)
message = greet("Alice")
result = multiply(4, 7)

print(f"Area: {area}")
print(message)
print(f"Product: {result}")`,
        estimatedTime: 25,
        rating: 4.9,
        tags: ['functions', 'parameters', 'lambda', 'decorators'],
        author: 'Agent Academy Team',
        dateCreated: new Date('2024-01-20'),
        isBookmarked: true,
        views: 2156
      },
      // AI Concepts
      {
        id: 'ai-agent-architecture',
        title: 'Building Your First AI Agent',
        description: 'Step-by-step guide to creating intelligent agents with Python.',
        type: 'tutorial',
        difficulty: 'intermediate',
        category: 'ai-concepts',
        content: `# Building AI Agents

An AI agent is a software entity that:
1. Perceives its environment
2. Makes decisions
3. Takes actions to achieve goals

## Basic Agent Architecture
\`\`\`
Environment -> Sensors -> Agent -> Actuators -> Environment
\`\`\`

## Types of Agents
- **Simple Reflex**: if-then rules
- **Model-based**: internal state
- **Goal-based**: planning
- **Utility-based**: optimization
- **Learning**: adaptation`,
        codeExample: `class SimpleAgent:
    def __init__(self, name):
        self.name = name
        self.memory = {}
        self.goals = []
    
    def perceive(self, environment):
        """Process environmental input"""
        self.memory['last_perception'] = environment
        return self.analyze_environment(environment)
    
    def think(self, perception):
        """Decision making process"""
        if perception['threat_level'] > 0.5:
            return 'defend'
        elif perception['opportunity'] > 0.7:
            return 'explore'
        else:
            return 'wait'
    
    def act(self, decision):
        """Execute action"""
        actions = {
            'defend': self.activate_shields,
            'explore': self.move_forward,
            'wait': self.observe
        }
        return actions.get(decision, self.observe)()

# Create and use agent
agent = SimpleAgent("NOVA")
perception = {'threat_level': 0.3, 'opportunity': 0.8}
decision = agent.think(perception)
result = agent.act(decision)`,
        estimatedTime: 35,
        rating: 4.7,
        tags: ['ai', 'agents', 'architecture', 'decision-making'],
        author: 'AI Research Lab',
        dateCreated: new Date('2024-02-01'),
        isBookmarked: false,
        views: 987
      },
      // Debugging
      {
        id: 'python-debugging-techniques',
        title: 'Python Debugging Masterclass',
        description: 'Professional debugging techniques from print statements to advanced tools.',
        type: 'tutorial',
        difficulty: 'intermediate',
        category: 'debugging',
        content: `# Python Debugging Techniques

## Level 1: Print Debugging
The simplest and most effective debugging method.

\`\`\`python
def debug_function(data):
    print(f"Input: {data}")  # See what comes in
    result = process_data(data)
    print(f"Processed: {result}")  # See intermediate results
    return result
\`\`\`

## Level 2: Logging
More sophisticated than print statements.

\`\`\`python
import logging
logging.basicConfig(level=logging.DEBUG)

def my_function():
    logging.debug("Starting function")
    logging.info("Processing data")
    logging.warning("This might be an issue")
    logging.error("Something went wrong")
\`\`\`

## Level 3: Python Debugger (pdb)
Interactive debugging with breakpoints.

\`\`\`python
import pdb

def problematic_function():
    pdb.set_trace()  # Breakpoint
    # Code execution will pause here
    result = complex_calculation()
    return result
\`\`\``,
        codeExample: `# Debugging example with multiple techniques
import logging
import pdb

def calculate_average(numbers):
    # Debug: Check input
    print(f"🔍 Input numbers: {numbers}")
    
    if not numbers:
        logging.error("Empty list provided!")
        return 0
    
    # Debug: Show calculation steps
    total = sum(numbers)
    print(f"🔍 Sum: {total}")
    
    count = len(numbers)
    print(f"🔍 Count: {count}")
    
    # Uncomment for interactive debugging
    # pdb.set_trace()
    
    average = total / count
    print(f"🔍 Average: {average}")
    
    return average

# Test the function
test_data = [10, 20, 30, 40, 50]
result = calculate_average(test_data)
print(f"Final result: {result}")`,
        estimatedTime: 20,
        rating: 4.6,
        tags: ['debugging', 'print', 'logging', 'pdb', 'troubleshooting'],
        author: 'Python Pro',
        dateCreated: new Date('2024-01-25'),
        isBookmarked: true,
        views: 1567
      },
      // Quick References
      {
        id: 'python-cheatsheet',
        title: 'Python Quick Reference',
        description: 'Essential Python syntax and functions in one place.',
        type: 'cheatsheet',
        difficulty: 'beginner',
        category: 'python-basics',
        content: `# Python Quick Reference

## Data Types
\`\`\`python
# Numbers
int_num = 42
float_num = 3.14
complex_num = 1 + 2j

# Strings
string = "Hello World"
multiline = """Multiple
lines"""

# Collections
list_data = [1, 2, 3]
tuple_data = (1, 2, 3)
dict_data = {'key': 'value'}
set_data = {1, 2, 3}
\`\`\`

## Control Flow
\`\`\`python
# If statement
if condition:
    pass
elif other_condition:
    pass
else:
    pass

# Loops
for item in iterable:
    pass

while condition:
    pass
\`\`\`

## Functions
\`\`\`python
def function_name(param1, param2=default):
    return value

lambda x: x * 2  # Anonymous function
\`\`\``,
        estimatedTime: 5,
        rating: 4.5,
        tags: ['reference', 'syntax', 'quick-guide'],
        author: 'Community',
        dateCreated: new Date('2024-01-10'),
        isBookmarked: false,
        views: 3421
      },
      // External Resources
      {
        id: 'python-official-docs',
        title: 'Python Official Documentation',
        description: 'The complete Python documentation from python.org',
        type: 'documentation',
        difficulty: 'intermediate',
        category: 'python-basics',
        externalUrl: 'https://docs.python.org/3/',
        estimatedTime: 0,
        rating: 5.0,
        tags: ['official', 'documentation', 'comprehensive'],
        author: 'Python Software Foundation',
        dateCreated: new Date('2024-01-01'),
        isBookmarked: false,
        views: 5678
      }
    ]

    // Sort by relevance to lesson context
    if (lessonContext) {
      sampleResources.sort((a, b) => {
        const aRelevance = calculateRelevance(a, lessonContext)
        const bRelevance = calculateRelevance(b, lessonContext)
        return bRelevance - aRelevance
      })
    }

    setResources(sampleResources)
    setFilteredResources(sampleResources)
  }, [lessonContext])

  const calculateRelevance = (resource: Resource, context: any): number => {
    let score = 0
    
    // Check if resource tags match lesson concepts
    context.concepts.forEach((concept: string) => {
      if (resource.tags.includes(concept.toLowerCase())) {
        score += 20
      }
      if (resource.category.includes(concept.toLowerCase())) {
        score += 15
      }
    })
    
    // Difficulty matching
    if (resource.difficulty === context.difficulty) {
      score += 10
    }
    
    // Boost popular resources
    score += Math.min(resource.rating * 2, 10)
    
    return score
  }

  // Filter and search functionality
  useEffect(() => {
    let filtered = resources

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'views':
          return b.views - a.views
        case 'recent':
          return b.dateCreated.getTime() - a.dateCreated.getTime()
        default:
          return calculateRelevance(b, lessonContext || {concepts: [], difficulty: 'beginner'}) - 
                 calculateRelevance(a, lessonContext || {concepts: [], difficulty: 'beginner'})
      }
    })

    setFilteredResources(filtered)
  }, [resources, searchTerm, selectedCategory, selectedType, selectedDifficulty, sortBy, lessonContext])

  const toggleBookmark = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId
        ? { ...resource, isBookmarked: !resource.isBookmarked }
        : resource
    ))
  }

  const viewResource = (resource: Resource) => {
    setSelectedResource(resource)
    onResourceView?.(resource.id)
    
    // Increment view count
    setResources(prev => prev.map(r =>
      r.id === resource.id ? { ...r, views: r.views + 1 } : r
    ))
  }

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'tutorial': return <BookOpen className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'example': return <Code className="h-4 w-4" />
      case 'documentation': return <FileText className="h-4 w-4" />
      case 'cheatsheet': return <Lightbulb className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'tutorial': return 'text-blue-400 bg-blue-500/10'
      case 'video': return 'text-red-400 bg-red-500/10'
      case 'example': return 'text-green-400 bg-green-500/10'
      case 'documentation': return 'text-purple-400 bg-purple-500/10'
      case 'cheatsheet': return 'text-yellow-400 bg-yellow-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (selectedResource) {
    return (
      <div className="bg-slate-900 border border-green-500/30 rounded-lg p-6">
        {/* Resource Viewer */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedResource(null)}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            ← Back to Resources
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleBookmark(selectedResource.id)}
              className={`p-2 rounded transition-colors ${
                selectedResource.isBookmarked 
                  ? 'text-yellow-400 bg-yellow-500/20' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              {selectedResource.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            
            {selectedResource.externalUrl && (
              <a
                href={selectedResource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-green-300 font-bold mb-2">{selectedResource.title}</h2>
            <p className="text-green-500/70 mb-4">{selectedResource.description}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className={`px-2 py-1 rounded ${getTypeColor(selectedResource.type)}`}>
                {getTypeIcon(selectedResource.type)}
                <span className="ml-1">{selectedResource.type}</span>
              </span>
              <span className={getDifficultyColor(selectedResource.difficulty)}>
                {selectedResource.difficulty}
              </span>
              <span className="text-green-500/70">
                <Clock className="h-3 w-3 inline mr-1" />
                {selectedResource.estimatedTime > 0 ? `${selectedResource.estimatedTime} min` : 'External'}
              </span>
              <span className="text-yellow-400">
                <Star className="h-3 w-3 inline mr-1" fill="currentColor" />
                {selectedResource.rating}
              </span>
            </div>
          </div>

          {selectedResource.content && (
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-green-100 font-mono text-sm">
                  {selectedResource.content}
                </pre>
              </div>
            </div>
          )}

          {selectedResource.codeExample && (
            <div className="bg-black/50 rounded-lg p-4">
              <h4 className="text-green-300 font-medium mb-2">Code Example:</h4>
              <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                {selectedResource.codeExample}
              </pre>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {selectedResource.tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-700 text-green-400 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-green-500/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-green-400" />
          <h3 className="text-green-300 font-medium">Resource Center</h3>
          <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">
            {filteredResources.length} resources
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-green-500" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-green-500/30 rounded-lg pl-10 pr-4 py-2 text-green-300 placeholder-green-500/50 focus:outline-none focus:border-green-400"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-green-500/30 rounded px-3 py-2 text-green-300 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="python-basics">Python Basics</option>
            <option value="ai-concepts">AI Concepts</option>
            <option value="debugging">Debugging</option>
            <option value="best-practices">Best Practices</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800 border border-green-500/30 rounded px-3 py-2 text-green-300 text-sm"
          >
            <option value="all">All Types</option>
            <option value="tutorial">Tutorials</option>
            <option value="example">Examples</option>
            <option value="documentation">Docs</option>
            <option value="cheatsheet">Cheatsheets</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-800 border border-green-500/30 rounded px-3 py-2 text-green-300 text-sm"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-green-500/30 rounded px-3 py-2 text-green-300 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="views">Popular</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-slate-800 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-colors cursor-pointer"
            onClick={() => viewResource(resource)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                    <span className="ml-1">{resource.type}</span>
                  </span>
                  <span className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                  {resource.estimatedTime > 0 && (
                    <span className="text-xs text-green-500/70">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {resource.estimatedTime}m
                    </span>
                  )}
                </div>
                
                <h4 className="text-green-300 font-medium mb-1">{resource.title}</h4>
                <p className="text-green-500/70 text-sm mb-2">{resource.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-green-500/50">
                  <span>
                    <Star className="h-3 w-3 inline mr-1" fill="currentColor" />
                    {resource.rating}
                  </span>
                  <span>
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {resource.views} views
                  </span>
                  <span>by {resource.author}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBookmark(resource.id)
                }}
                className={`p-2 rounded transition-colors ${
                  resource.isBookmarked 
                    ? 'text-yellow-400 bg-yellow-500/20' 
                    : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                {resource.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-xs bg-slate-700 text-green-400 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {resource.tags.length > 4 && (
                <span className="text-xs text-green-500/50">
                  +{resource.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-green-400 mx-auto mb-4 opacity-50" />
          <h4 className="text-green-300 text-lg mb-2">No Resources Found</h4>
          <p className="text-green-500/70">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}