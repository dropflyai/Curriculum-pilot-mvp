'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  GitBranch, 
  Circle, 
  Square, 
  Triangle, 
  Diamond, 
  ArrowRight, 
  ArrowDown, 
  ArrowUpRight,
  Lightbulb,
  Brain,
  Code,
  Zap,
  Target,
  BookOpen,
  Maximize,
  Minimize,
  RotateCcw,
  Download
} from 'lucide-react'

interface ConceptNode {
  id: string
  title: string
  description: string
  type: 'concept' | 'skill' | 'tool' | 'example' | 'goal'
  level: 'fundamental' | 'intermediate' | 'advanced'
  position: { x: number; y: number }
  connections: string[] // IDs of connected nodes
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered'
  examples?: string[]
  codeSnippet?: string
  prerequisites?: string[]
}

interface ConceptMapsProps {
  lessonContext?: {
    id: string
    concepts: string[]
    difficulty: string
  }
  studentProgress?: Record<string, 'not-started' | 'in-progress' | 'completed' | 'mastered'>
  onNodeClick?: (node: ConceptNode) => void
}

export default function ConceptMaps({
  lessonContext,
  studentProgress,
  onNodeClick
}: ConceptMapsProps) {
  const [nodes, setNodes] = useState<ConceptNode[]>([])
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })

  // Initialize concept map based on lesson context
  useEffect(() => {
    const generateConceptMap = (): ConceptNode[] => {
      // Python Basics Concept Map
      const pythonBasicsMap: ConceptNode[] = [
        // Fundamental Level
        {
          id: 'variables',
          title: 'Variables',
          description: 'Store and manipulate data',
          type: 'concept',
          level: 'fundamental',
          position: { x: 100, y: 200 },
          connections: ['data-types', 'functions'],
          status: studentProgress?.variables || 'not-started',
          examples: ['name = "Alice"', 'age = 25', 'is_student = True'],
          codeSnippet: `# Creating variables
name = "Alice"
age = 25
score = 95.5`
        },
        {
          id: 'data-types',
          title: 'Data Types',
          description: 'Different kinds of data: strings, numbers, booleans',
          type: 'concept',
          level: 'fundamental',
          position: { x: 300, y: 150 },
          connections: ['variables', 'collections', 'type-conversion'],
          status: studentProgress?.['data-types'] || 'not-started',
          examples: ['str, int, float, bool'],
          codeSnippet: `# Data types
text = "Hello"      # str
number = 42         # int
decimal = 3.14      # float
flag = True         # bool`
        },
        {
          id: 'functions',
          title: 'Functions',
          description: 'Reusable blocks of code',
          type: 'concept',
          level: 'fundamental',
          position: { x: 100, y: 350 },
          connections: ['variables', 'control-flow', 'parameters'],
          status: studentProgress?.functions || 'not-started',
          codeSnippet: `def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")`
        },
        
        // Intermediate Level
        {
          id: 'collections',
          title: 'Collections',
          description: 'Lists, tuples, dictionaries, sets',
          type: 'concept',
          level: 'intermediate',
          position: { x: 500, y: 150 },
          connections: ['data-types', 'loops', 'list-comprehension'],
          status: studentProgress?.collections || 'not-started',
          examples: ['[1,2,3]', '{"key": "value"}', '{1,2,3}'],
          codeSnippet: `# Collections
my_list = [1, 2, 3]
my_dict = {"name": "Alice", "age": 25}
my_set = {1, 2, 3}`
        },
        {
          id: 'control-flow',
          title: 'Control Flow',
          description: 'if statements, loops, decision making',
          type: 'concept',
          level: 'intermediate',
          position: { x: 300, y: 350 },
          connections: ['functions', 'loops', 'error-handling'],
          status: studentProgress?.['control-flow'] || 'not-started',
          codeSnippet: `if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")`
        },
        {
          id: 'loops',
          title: 'Loops',
          description: 'Repeat code with for and while loops',
          type: 'concept',
          level: 'intermediate',
          position: { x: 500, y: 300 },
          connections: ['collections', 'control-flow', 'list-comprehension'],
          status: studentProgress?.loops || 'not-started',
          codeSnippet: `# For loop
for item in my_list:
    print(item)

# While loop
count = 0
while count < 5:
    count += 1`
        },
        
        // Advanced Level
        {
          id: 'classes',
          title: 'Classes & Objects',
          description: 'Object-oriented programming',
          type: 'concept',
          level: 'advanced',
          position: { x: 100, y: 500 },
          connections: ['functions', 'inheritance'],
          status: studentProgress?.classes || 'not-started',
          codeSnippet: `class Student:
    def __init__(self, name):
        self.name = name
    
    def study(self):
        return f"{self.name} is studying"`
        },
        {
          id: 'list-comprehension',
          title: 'List Comprehension',
          description: 'Elegant way to create lists',
          type: 'skill',
          level: 'advanced',
          position: { x: 700, y: 250 },
          connections: ['collections', 'loops'],
          status: studentProgress?.['list-comprehension'] || 'not-started',
          codeSnippet: `# List comprehension
squares = [x**2 for x in range(10)]

# Equivalent loop
squares = []
for x in range(10):
    squares.append(x**2)`
        },
        {
          id: 'error-handling',
          title: 'Error Handling',
          description: 'Handle errors gracefully with try-except',
          type: 'skill',
          level: 'advanced',
          position: { x: 500, y: 450 },
          connections: ['control-flow'],
          status: studentProgress?.['error-handling'] || 'not-started',
          codeSnippet: `try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("This always runs")`
        },
        
        // AI Concepts
        {
          id: 'ai-agent',
          title: 'AI Agent',
          description: 'Software that perceives and acts',
          type: 'concept',
          level: 'intermediate',
          position: { x: 800, y: 100 },
          connections: ['perception', 'decision-making'],
          status: studentProgress?.['ai-agent'] || 'not-started',
          codeSnippet: `class AIAgent:
    def __init__(self, name):
        self.name = name
        self.memory = {}
    
    def perceive(self, environment):
        # Process input
        pass
    
    def act(self, decision):
        # Take action
        pass`
        }
      ]

      // AI Concepts Map (if lesson is AI-focused)
      if (lessonContext?.concepts.includes('ai') || lessonContext?.concepts.includes('agents')) {
        pythonBasicsMap.push(
          {
            id: 'perception',
            title: 'Perception',
            description: 'How agents sense their environment',
            type: 'concept',
            level: 'intermediate',
            position: { x: 900, y: 200 },
            connections: ['ai-agent', 'sensors'],
            status: studentProgress?.perception || 'not-started'
          },
          {
            id: 'decision-making',
            title: 'Decision Making',
            description: 'How agents choose actions',
            type: 'concept',
            level: 'advanced',
            position: { x: 900, y: 300 },
            connections: ['ai-agent', 'algorithms'],
            status: studentProgress?.['decision-making'] || 'not-started'
          }
        )
      }

      return pythonBasicsMap
    }

    setNodes(generateConceptMap())
  }, [lessonContext, studentProgress])

  const getNodeColor = (node: ConceptNode) => {
    const statusColors = {
      'not-started': 'fill-gray-600 stroke-gray-400',
      'in-progress': 'fill-yellow-600 stroke-yellow-400',
      'completed': 'fill-blue-600 stroke-blue-400',
      'mastered': 'fill-green-600 stroke-green-400'
    }
    
    const typeColors = {
      'concept': 'stroke-2',
      'skill': 'stroke-2 stroke-dashed',
      'tool': 'stroke-2 stroke-dotted',
      'example': 'stroke-1',
      'goal': 'stroke-3'
    }
    
    return `${statusColors[node.status]} ${typeColors[node.type]}`
  }

  const getNodeIcon = (node: ConceptNode) => {
    switch (node.type) {
      case 'concept': return <Brain className="h-4 w-4" />
      case 'skill': return <Zap className="h-4 w-4" />
      case 'tool': return <Code className="h-4 w-4" />
      case 'example': return <Lightbulb className="h-4 w-4" />
      case 'goal': return <Target className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  const getNodeShape = (node: ConceptNode) => {
    const baseProps = {
      cx: node.position.x,
      cy: node.position.y,
      className: `cursor-pointer transition-all hover:scale-110 ${getNodeColor(node)}`,
      onClick: () => handleNodeClick(node)
    }

    switch (node.level) {
      case 'fundamental':
        return <circle {...baseProps} r="20" />
      case 'intermediate':
        return <rect 
          {...baseProps} 
          x={node.position.x - 20} 
          y={node.position.y - 20} 
          width="40" 
          height="40" 
          rx="4"
        />
      case 'advanced':
        return <polygon 
          {...baseProps}
          points={`${node.position.x},${node.position.y-20} ${node.position.x+17.3},${node.position.y+10} ${node.position.x-17.3},${node.position.y+10}`}
        />
      default:
        return <circle {...baseProps} r="15" />
    }
  }

  const handleNodeClick = (node: ConceptNode) => {
    setSelectedNode(node)
    onNodeClick?.(node)
  }

  const renderConnection = (fromNode: ConceptNode, toNodeId: string) => {
    const toNode = nodes.find(n => n.id === toNodeId)
    if (!toNode) return null

    const from = fromNode.position
    const to = toNode.position
    
    // Calculate arrow position
    const angle = Math.atan2(to.y - from.y, to.x - from.x)
    const distance = Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2)
    const arrowLength = Math.min(distance - 40, distance * 0.8)
    
    const endX = from.x + Math.cos(angle) * arrowLength
    const endY = from.y + Math.sin(angle) * arrowLength

    return (
      <g key={`${fromNode.id}-${toNodeId}`}>
        <line
          x1={from.x}
          y1={from.y}
          x2={endX}
          y2={endY}
          stroke="#10b981"
          strokeWidth="2"
          strokeOpacity="0.6"
          markerEnd="url(#arrowhead)"
        />
      </g>
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - lastMouse.x
    const deltaY = e.clientY - lastMouse.y
    
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))
    
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getProgressStats = () => {
    const total = nodes.length
    const completed = nodes.filter(n => n.status === 'completed' || n.status === 'mastered').length
    const inProgress = nodes.filter(n => n.status === 'in-progress').length
    const mastered = nodes.filter(n => n.status === 'mastered').length
    
    return { total, completed, inProgress, mastered }
  }

  const stats = getProgressStats()

  return (
    <div className={`bg-slate-900 border border-green-500/30 rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-500/30">
        <div className="flex items-center space-x-3">
          <GitBranch className="h-5 w-5 text-green-400" />
          <h3 className="text-green-300 font-medium">Concept Maps</h3>
          <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">
            {stats.completed}/{stats.total} concepts
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Progress indicators */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-green-400">{stats.mastered} mastered</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-blue-400">{stats.completed} completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              <span className="text-yellow-400">{stats.inProgress} in progress</span>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={resetView}
            className="p-1 text-green-400 hover:text-green-300 transition-colors"
            title="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-green-400 hover:text-green-300 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 1200 600"
            className="cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
            }}
          >
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#10b981"
                  opacity="0.6"
                />
              </marker>
            </defs>

            {/* Render connections */}
            {nodes.map(node =>
              node.connections.map(connectionId =>
                renderConnection(node, connectionId)
              )
            )}

            {/* Render nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                {getNodeShape(node)}
                
                {/* Node label */}
                <text
                  x={node.position.x}
                  y={node.position.y + 35}
                  textAnchor="middle"
                  className="text-xs fill-green-300 font-medium pointer-events-none"
                >
                  {node.title}
                </text>

                {/* Node level indicator */}
                <text
                  x={node.position.x}
                  y={node.position.y + 48}
                  textAnchor="middle"
                  className="text-xs fill-green-500/70 pointer-events-none"
                >
                  {node.level}
                </text>
              </g>
            ))}
          </svg>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
              className="bg-slate-800 border border-green-500/30 text-green-400 p-2 rounded hover:bg-slate-700 transition-colors"
            >
              +
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
              className="bg-slate-800 border border-green-500/30 text-green-400 p-2 rounded hover:bg-slate-700 transition-colors"
            >
              −
            </button>
          </div>
        </div>

        {/* Details Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-green-500/30 p-4 bg-slate-800">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-green-300 font-medium">{selectedNode.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedNode.status === 'mastered' ? 'bg-green-600/30 text-green-400' :
                    selectedNode.status === 'completed' ? 'bg-blue-600/30 text-blue-400' :
                    selectedNode.status === 'in-progress' ? 'bg-yellow-600/30 text-yellow-400' :
                    'bg-gray-600/30 text-gray-400'
                  }`}>
                    {selectedNode.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-green-500/70 text-sm">{selectedNode.description}</p>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <span className={`px-2 py-1 rounded ${
                  selectedNode.type === 'concept' ? 'bg-blue-500/20 text-blue-400' :
                  selectedNode.type === 'skill' ? 'bg-yellow-500/20 text-yellow-400' :
                  selectedNode.type === 'tool' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {getNodeIcon(selectedNode)}
                  <span className="ml-1">{selectedNode.type}</span>
                </span>
                <span className={`${
                  selectedNode.level === 'fundamental' ? 'text-green-400' :
                  selectedNode.level === 'intermediate' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {selectedNode.level}
                </span>
              </div>

              {selectedNode.examples && (
                <div>
                  <h5 className="text-green-300 font-medium text-sm mb-2">Examples:</h5>
                  <ul className="space-y-1">
                    {selectedNode.examples.map((example, index) => (
                      <li key={index} className="text-green-500/70 text-xs">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNode.codeSnippet && (
                <div>
                  <h5 className="text-green-300 font-medium text-sm mb-2">Code Example:</h5>
                  <div className="bg-black/50 rounded p-3">
                    <pre className="text-green-300 text-xs whitespace-pre-wrap">
                      {selectedNode.codeSnippet}
                    </pre>
                  </div>
                </div>
              )}

              {selectedNode.connections.length > 0 && (
                <div>
                  <h5 className="text-green-300 font-medium text-sm mb-2">Connected to:</h5>
                  <div className="space-y-1">
                    {selectedNode.connections.map(connId => {
                      const connNode = nodes.find(n => n.id === connId)
                      return connNode ? (
                        <button
                          key={connId}
                          onClick={() => setSelectedNode(connNode)}
                          className="block text-left text-green-400 hover:text-green-300 text-xs transition-colors"
                        >
                          → {connNode.title}
                        </button>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-green-500/30 p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-green-500/70">Shapes:</span>
            <div className="flex items-center space-x-1">
              <Circle className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Fundamental</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="h-3 w-3 text-yellow-400" />
              <span className="text-yellow-400">Intermediate</span>
            </div>
            <div className="flex items-center space-x-1">
              <Triangle className="h-3 w-3 text-red-400" />
              <span className="text-red-400">Advanced</span>
            </div>
          </div>
          <div className="text-green-500/50">
            Click nodes to explore • Drag to pan • Use zoom controls
          </div>
        </div>
      </div>
    </div>
  )
}