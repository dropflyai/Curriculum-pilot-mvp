'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { GitBranch, Plus, Trash2, Edit3, Play, Save, Eye, Zap, MessageSquare, ArrowRight, Copy } from 'lucide-react'

interface ConversationNode {
  id: string
  type: 'trigger' | 'condition' | 'response' | 'action'
  title: string
  content: string
  position: { x: number, y: number }
  connections: string[]
  config: {
    keywords?: string[]
    sentiment?: 'positive' | 'negative' | 'neutral' | 'any'
    confidence?: number
    variables?: Record<string, string>
    actions?: string[]
  }
}

interface ConversationFlow {
  id: string
  name: string
  description: string
  nodes: ConversationNode[]
  variables: Record<string, any>
}

interface ConversationFlowDesignerProps {
  onFlowComplete?: (flow: ConversationFlow) => void
}

export default function ConversationFlowDesigner({ onFlowComplete }: ConversationFlowDesignerProps) {
  const [currentFlow, setCurrentFlow] = useState<ConversationFlow>({
    id: `flow-${Date.now()}`,
    name: 'My AI Conversation Flow',
    description: 'An intelligent conversation flow for student support',
    nodes: [],
    variables: { student_name: '', mood: '', topic: '' }
  })
  
  const [selectedNode, setSelectedNode] = useState<ConversationNode | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [simulationActive, setSimulationActive] = useState(false)
  const [simulationHistory, setSimulationHistory] = useState<any[]>([])
  const [currentInput, setCurrentInput] = useState('')
  
  // Pre-built conversation templates
  const conversationTemplates = {
    'study-stress': {
      name: 'Study Stress Handler',
      description: 'Helps students dealing with academic stress',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger' as const,
          title: 'Stress Keywords Detected',
          content: 'Student mentions stress, overwhelm, or anxiety',
          position: { x: 100, y: 100 },
          connections: ['condition-1'],
          config: {
            keywords: ['stressed', 'overwhelmed', 'anxious', 'panic', 'too much', 'can\'t handle']
          }
        },
        {
          id: 'condition-1',
          type: 'condition' as const,
          title: 'Check Stress Level',
          content: 'Determine if this is mild or severe stress',
          position: { x: 300, y: 100 },
          connections: ['response-1', 'response-2'],
          config: {
            sentiment: 'negative',
            confidence: 0.7
          }
        },
        {
          id: 'response-1',
          type: 'response' as const,
          title: 'Mild Stress Response',
          content: 'I hear that you\'re feeling stressed about {topic}. That\'s completely normal! Let\'s break this down into smaller, manageable pieces.',
          position: { x: 500, y: 50 },
          connections: ['action-1'],
          config: {
            variables: { topic: 'current_subject' }
          }
        },
        {
          id: 'response-2',
          type: 'response' as const,
          title: 'High Stress Response',
          content: '{student_name}, it sounds like you\'re really overwhelmed right now. Let\'s pause and take a deep breath together.',
          position: { x: 500, y: 150 },
          connections: ['action-2'],
          config: {
            variables: { student_name: 'user_name' }
          }
        },
        {
          id: 'action-1',
          type: 'action' as const,
          title: 'Provide Study Plan',
          content: 'Generate a personalized study schedule',
          position: { x: 700, y: 50 },
          connections: [],
          config: {
            actions: ['create_study_plan', 'set_reminders', 'suggest_breaks']
          }
        },
        {
          id: 'action-2',
          type: 'action' as const,
          title: 'Breathing Exercise',
          content: 'Guide through a 2-minute breathing exercise',
          position: { x: 700, y: 150 },
          connections: [],
          config: {
            actions: ['breathing_exercise', 'relaxation_tips', 'check_back_later']
          }
        }
      ],
      variables: { student_name: '', topic: 'school', stress_level: 'mild' }
    },
    'goal-setting': {
      name: 'Academic Goal Setting',
      description: 'Helps students set and achieve academic goals',
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger' as const,
          title: 'Goal Keywords',
          content: 'Student wants to improve or set goals',
          position: { x: 100, y: 100 },
          connections: ['condition-1'],
          config: {
            keywords: ['want to improve', 'goal', 'better grades', 'get better at', 'succeed']
          }
        },
        {
          id: 'condition-1',
          type: 'condition' as const,
          title: 'Goal Specificity Check',
          content: 'Is the goal specific or vague?',
          position: { x: 300, y: 100 },
          connections: ['response-1', 'response-2'],
          config: {
            sentiment: 'any'
          }
        },
        {
          id: 'response-1',
          type: 'response' as const,
          title: 'Vague Goal Response',
          content: 'I love that you want to improve! Let\'s make your goal more specific. What subject or skill would you like to focus on first?',
          position: { x: 500, y: 50 },
          connections: ['action-1'],
          config: {}
        },
        {
          id: 'response-2',
          type: 'response' as const,
          title: 'Specific Goal Response',
          content: 'Great specific goal! Let\'s create a step-by-step plan to help you achieve it. What\'s your current level and where do you want to be?',
          position: { x: 500, y: 150 },
          connections: ['action-2'],
          config: {}
        },
        {
          id: 'action-1',
          type: 'action' as const,
          title: 'Goal Clarification',
          content: 'Help student specify their goal',
          position: { x: 700, y: 50 },
          connections: [],
          config: {
            actions: ['ask_clarifying_questions', 'provide_examples', 'suggest_focus_areas']
          }
        },
        {
          id: 'action-2',
          type: 'action' as const,
          title: 'Create Action Plan',
          content: 'Generate SMART goal plan',
          position: { x: 700, y: 150 },
          connections: [],
          config: {
            actions: ['create_smart_goal', 'set_milestones', 'schedule_check_ins']
          }
        }
      ],
      variables: { current_subject: '', goal_type: '', timeline: '1 month' }
    }
  }

  const nodeTypes = {
    trigger: { color: 'bg-green-600', icon: Zap, label: 'Trigger' },
    condition: { color: 'bg-blue-600', icon: GitBranch, label: 'Condition' },
    response: { color: 'bg-purple-600', icon: MessageSquare, label: 'Response' },
    action: { color: 'bg-orange-600', icon: Play, label: 'Action' }
  }

  const addNode = (type: ConversationNode['type']) => {
    const newNode: ConversationNode = {
      id: `${type}-${Date.now()}`,
      type,
      title: `New ${type}`,
      content: '',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      connections: [],
      config: {}
    }
    
    setCurrentFlow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
  }

  const updateNode = (nodeId: string, updates: Partial<ConversationNode>) => {
    setCurrentFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }))
  }

  const deleteNode = (nodeId: string) => {
    setCurrentFlow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId)
    }))
  }

  const connectNodes = (fromId: string, toId: string) => {
    setCurrentFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === fromId 
          ? { ...node, connections: [...node.connections, toId] }
          : node
      )
    }))
  }

  const generatePythonCode = () => {
    let code = `# 🤖 Advanced AI Conversation Flow: ${currentFlow.name}
# ${currentFlow.description}

import re
import json
from datetime import datetime
from typing import Dict, List, Optional

class ConversationFlowEngine:
    def __init__(self):
        self.variables = ${JSON.stringify(currentFlow.variables, null, 8)}
        self.conversation_history = []
        self.current_node = None
        
    def analyze_message(self, message: str) -> Dict:
        """Analyze incoming message for keywords, sentiment, etc."""
        analysis = {
            'message': message,
            'keywords': [],
            'sentiment': 'neutral',
            'confidence': 0.0,
            'timestamp': datetime.now().isoformat()
        }
        
        # Simple keyword extraction
        message_lower = message.lower()
        
        # Sentiment analysis (basic)
        positive_words = ['good', 'great', 'happy', 'excited', 'love', 'awesome']
        negative_words = ['bad', 'sad', 'stressed', 'hate', 'terrible', 'awful', 'overwhelmed']
        
        pos_count = sum(1 for word in positive_words if word in message_lower)
        neg_count = sum(1 for word in negative_words if word in message_lower)
        
        if neg_count > pos_count:
            analysis['sentiment'] = 'negative'
            analysis['confidence'] = min(0.9, 0.6 + (neg_count * 0.1))
        elif pos_count > neg_count:
            analysis['sentiment'] = 'positive'
            analysis['confidence'] = min(0.9, 0.6 + (pos_count * 0.1))
        else:
            analysis['sentiment'] = 'neutral'
            analysis['confidence'] = 0.5
            
        return analysis
    
    def process_flow(self, message: str) -> Dict:
        """Process message through the conversation flow"""
        analysis = self.analyze_message(message)
        
        # Find matching trigger nodes
        triggered_nodes = self.find_triggered_nodes(analysis)
        
        if not triggered_nodes:
            return {
                'response': "I'm here to help! Can you tell me more about what's on your mind?",
                'node_type': 'fallback',
                'confidence': 0.3
            }
        
        # Process the first triggered node
        return self.execute_node_chain(triggered_nodes[0], analysis)
    
    def find_triggered_nodes(self, analysis: Dict) -> List[str]:
        """Find nodes that match the current message"""
        triggered = []
        
        # Check trigger nodes
${currentFlow.nodes
  .filter(node => node.type === 'trigger')
  .map(node => `        # ${node.title}
        keywords_${node.id} = ${JSON.stringify(node.config.keywords || [])}
        if any(keyword in analysis['message'].lower() for keyword in keywords_${node.id}):
            triggered.append('${node.id}')`)
  .join('\n')}
        
        return triggered
    
    def execute_node_chain(self, node_id: str, analysis: Dict) -> Dict:
        """Execute a chain of nodes starting from the given node"""
        
${currentFlow.nodes.map(node => {
  switch (node.type) {
    case 'trigger':
      return `        if node_id == '${node.id}':
            # ${node.title}: ${node.content}
            # Move to connected condition or response nodes
            connections = ${JSON.stringify(node.connections)}
            if connections:
                return self.execute_node_chain(connections[0], analysis)
            else:
                return {'response': 'Flow configuration error', 'node_type': 'error'}`
    
    case 'condition':
      return `        elif node_id == '${node.id}':
            # ${node.title}: ${node.content}
            confidence_threshold = ${node.config.confidence || 0.7}
            target_sentiment = '${node.config.sentiment || 'any'}'
            
            # Check conditions
            condition_met = True
            if target_sentiment != 'any' and analysis['sentiment'] != target_sentiment:
                condition_met = False
            if analysis['confidence'] < confidence_threshold:
                condition_met = False
            
            connections = ${JSON.stringify(node.connections)}
            if condition_met and len(connections) > 0:
                return self.execute_node_chain(connections[0], analysis)
            elif len(connections) > 1:
                return self.execute_node_chain(connections[1], analysis)
            else:
                return {'response': 'I understand. Let me think about how to help you.', 'node_type': 'fallback'}`
    
    case 'response':
      return `        elif node_id == '${node.id}':
            # ${node.title}: Generate response
            response_template = """${node.content}"""
            
            # Replace variables in template
            response = response_template
            for var_name, var_value in self.variables.items():
                if var_name in response:
                    response = response.replace('{' + var_name + '}', str(var_value))
            
            # Continue to action nodes if connected
            connections = ${JSON.stringify(node.connections)}
            if connections:
                action_result = self.execute_node_chain(connections[0], analysis)
                return {
                    'response': response,
                    'node_type': 'response',
                    'actions': action_result.get('actions', []),
                    'confidence': 0.85
                }
            
            return {
                'response': response,
                'node_type': 'response',
                'confidence': 0.85
            }`
    
    case 'action':
      return `        elif node_id == '${node.id}':
            # ${node.title}: Execute actions
            actions = ${JSON.stringify(node.config.actions || [])}
            
            # Execute each action (simplified for demo)
            action_results = []
            for action in actions:
                if action == 'create_study_plan':
                    action_results.append("📚 Created personalized study plan")
                elif action == 'breathing_exercise':
                    action_results.append("🧘 Initiated 2-minute breathing exercise")
                elif action == 'set_reminders':
                    action_results.append("⏰ Set study reminders")
                elif action == 'create_smart_goal':
                    action_results.append("🎯 Created SMART goal framework")
                else:
                    action_results.append(f"✅ Executed: {action}")
            
            return {
                'response': f"Taking action: {', '.join(action_results)}",
                'node_type': 'action',
                'actions': actions,
                'confidence': 0.9
            }`
    
    default:
      return ''
  }
}).join('\n\n')}
        
        # Fallback if node not found
        return {
            'response': 'I want to help, but I need a bit more information. Can you tell me what specific challenge you\'re facing?',
            'node_type': 'fallback',
            'confidence': 0.3
        }
    
    def chat_demo(self):
        """Interactive demo of the conversation flow"""
        print(f"🤖 {self.variables.get('bot_name', 'AI Advisor')}: Hi! I'm here to support you with your academic journey.")
        print("💬 Tell me what's on your mind, or type 'quit' to exit\\n")
        
        while True:
            user_input = input("You: ").strip()
            
            if user_input.lower() == 'quit':
                print("🤖 Take care! I'm here whenever you need support.")
                break
            elif not user_input:
                print("🤖 I'm listening whenever you're ready to share.")
                continue
            
            # Process the message through our flow
            result = self.process_flow(user_input)
            
            print(f"🤖 {result['response']}")
            if 'actions' in result and result['actions']:
                print(f"   ⚡ Actions: {', '.join(result['actions'])}")
            print(f"   📊 [Type: {result['node_type']}, Confidence: {result['confidence']:.1%}]\\n")
            
            # Store conversation
            self.conversation_history.append({
                'user': user_input,
                'bot': result['response'],
                'analysis': result,
                'timestamp': datetime.now().isoformat()
            })

# Create and test the conversation flow
if __name__ == "__main__":
    flow_engine = ConversationFlowEngine()
    
    # Test with sample messages
    test_messages = [
        "I'm so stressed about my upcoming exams",
        "I want to improve my grades this semester",
        "I feel overwhelmed with all my homework",
        "How can I get better at math?"
    ]
    
    print(f"🧪 Testing Conversation Flow: {flow_engine.variables.get('flow_name', 'Advanced AI Flow')}\\n")
    
    for i, message in enumerate(test_messages, 1):
        print(f"Test {i}: '{message}'")
        result = flow_engine.process_flow(message)
        print(f"Response: {result['response']}")
        if 'actions' in result:
            print(f"Actions: {result.get('actions', [])}")
        print(f"Node Type: {result['node_type']} | Confidence: {result['confidence']:.1%}\\n")
    
    print("🚀 Your Advanced AI Conversation Flow is ready!")
    print("💡 Run flow_engine.chat_demo() for an interactive experience!")`;

    return code
  }

  const simulateConversation = (input: string) => {
    // Simple simulation based on current flow
    const analysis = {
      message: input,
      sentiment: input.includes('stressed') || input.includes('overwhelmed') ? 'negative' : 
                 input.includes('good') || input.includes('great') ? 'positive' : 'neutral'
    }
    
    // Find matching trigger
    const matchedTrigger = currentFlow.nodes.find(node => 
      node.type === 'trigger' && 
      node.config.keywords?.some(keyword => input.toLowerCase().includes(keyword))
    )
    
    if (matchedTrigger) {
      // Follow the flow
      const connectedNodeId = matchedTrigger.connections[0]
      const connectedNode = currentFlow.nodes.find(n => n.id === connectedNodeId)
      
      if (connectedNode && connectedNode.type === 'response') {
        const response = connectedNode.content.replace(/{(\w+)}/g, (match, key) => {
          return currentFlow.variables[key] || `[${key}]`
        })
        
        setSimulationHistory(prev => [...prev, {
          type: 'input',
          text: input,
          timestamp: new Date()
        }, {
          type: 'response',
          text: response,
          node: connectedNode.title,
          timestamp: new Date()
        }])
      }
    } else {
      setSimulationHistory(prev => [...prev, {
        type: 'input',
        text: input,
        timestamp: new Date()
      }, {
        type: 'response',
        text: "I understand. Could you tell me more about what specific help you need?",
        node: 'Fallback Response',
        timestamp: new Date()
      }])
    }
  }

  const loadTemplate = (templateKey: keyof typeof conversationTemplates) => {
    const template = conversationTemplates[templateKey]
    setCurrentFlow({
      id: `flow-${Date.now()}`,
      name: template.name,
      description: template.description,
      nodes: template.nodes as ConversationNode[],
      variables: template.variables
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg p-6 border border-emerald-500/30">
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
          🌊 Conversation Flow Designer
        </h2>
        <p className="text-emerald-200 mb-4">
          Design sophisticated conversation flows that adapt to different student needs. Learn advanced programming concepts like conditional logic, state management, and natural language processing!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-emerald-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{currentFlow.nodes.length}</div>
            <div className="text-emerald-200 text-sm">Flow Nodes</div>
          </div>
          <div className="bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{currentFlow.nodes.filter(n => n.type === 'trigger').length}</div>
            <div className="text-blue-200 text-sm">Triggers</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{currentFlow.nodes.filter(n => n.type === 'response').length}</div>
            <div className="text-purple-200 text-sm">Responses</div>
          </div>
          <div className="bg-orange-900/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-lg">{Object.keys(currentFlow.variables).length}</div>
            <div className="text-orange-200 text-sm">Variables</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow Designer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Templates */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">🎨 Quick Start Templates</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(conversationTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => loadTemplate(key as keyof typeof conversationTemplates)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Node Palette */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">🧩 Add Flow Components</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(nodeTypes).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => addNode(type as ConversationNode['type'])}
                  className={`${config.color} hover:opacity-80 text-white p-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1`}
                >
                  <config.icon className="h-5 w-5" />
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flow Canvas */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 relative overflow-hidden" style={{ minHeight: '400px' }}>
            <div className="absolute inset-0 p-4">
              {/* Grid background */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              
              {/* Render Nodes */}
              {currentFlow.nodes.map(node => {
                const config = nodeTypes[node.type]
                return (
                  <div
                    key={node.id}
                    className={`absolute ${config.color} rounded-lg p-3 text-white shadow-lg cursor-pointer min-w-[160px] max-w-[200px]`}
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                      zIndex: selectedNode?.id === node.id ? 10 : 1
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <config.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{node.title}</span>
                    </div>
                    <p className="text-xs opacity-90 line-clamp-2">{node.content}</p>
                    
                    {/* Connection indicators */}
                    {node.connections.map((connId, i) => (
                      <div
                        key={connId}
                        className="absolute -right-1 bg-white rounded-full w-3 h-3 border-2 border-gray-700"
                        style={{ top: 20 + i * 15 }}
                      />
                    ))}
                  </div>
                )
              })}
              
              {/* Render Connections */}
              <svg className="absolute inset-0 pointer-events-none">
                {currentFlow.nodes.map(node =>
                  node.connections.map(connId => {
                    const targetNode = currentFlow.nodes.find(n => n.id === connId)
                    if (!targetNode) return null
                    
                    return (
                      <line
                        key={`${node.id}-${connId}`}
                        x1={node.position.x + 160}
                        y1={node.position.y + 30}
                        x2={targetNode.position.x}
                        y2={targetNode.position.y + 30}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    )
                  })
                )}
                {/* Arrow marker definition */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Flow Info */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">ℹ️ Flow Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm">Flow Name</label>
                <input
                  type="text"
                  value={currentFlow.name}
                  onChange={(e) => setCurrentFlow(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm">Description</label>
                <textarea
                  value={currentFlow.description}
                  onChange={(e) => setCurrentFlow(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm h-20"
                />
              </div>
            </div>
          </div>

          {/* Selected Node Editor */}
          {selectedNode && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  {React.createElement(nodeTypes[selectedNode.type].icon, { className: "h-4 w-4" })}
                  Edit {selectedNode.type}
                </h3>
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-gray-300 text-sm">Title</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Content</label>
                  <textarea
                    value={selectedNode.content}
                    onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm h-20"
                  />
                </div>
                
                {selectedNode.type === 'trigger' && (
                  <div>
                    <label className="text-gray-300 text-sm">Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedNode.config.keywords?.join(', ') || ''}
                      onChange={(e) => updateNode(selectedNode.id, { 
                        config: { 
                          ...selectedNode.config, 
                          keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm"
                      placeholder="stressed, overwhelmed, anxious"
                    />
                  </div>
                )}
                
                {selectedNode.type === 'condition' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-300 text-sm">Target Sentiment</label>
                      <select
                        value={selectedNode.config.sentiment || 'any'}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, sentiment: e.target.value as any }
                        })}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm"
                      >
                        <option value="any">Any</option>
                        <option value="positive">Positive</option>
                        <option value="negative">Negative</option>
                        <option value="neutral">Neutral</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Confidence Threshold</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedNode.config.confidence || 0.7}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, confidence: parseFloat(e.target.value) }
                        })}
                        className="w-full"
                      />
                      <span className="text-gray-400 text-xs">{Math.round((selectedNode.config.confidence || 0.7) * 100)}%</span>
                    </div>
                  </div>
                )}
                
                {selectedNode.type === 'action' && (
                  <div>
                    <label className="text-gray-300 text-sm">Actions (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedNode.config.actions?.join(', ') || ''}
                      onChange={(e) => updateNode(selectedNode.id, { 
                        config: { 
                          ...selectedNode.config, 
                          actions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm"
                      placeholder="create_study_plan, set_reminders"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test Simulation */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">🧪 Test Your Flow</h3>
            <div className="space-y-3">
              <div className="bg-gray-900 rounded p-3 h-32 overflow-y-auto text-sm">
                {simulationHistory.length === 0 ? (
                  <p className="text-gray-500 italic text-center">No conversation yet</p>
                ) : (
                  simulationHistory.map((msg, i) => (
                    <div key={i} className={`mb-2 ${msg.type === 'input' ? 'text-blue-300' : 'text-green-300'}`}>
                      <strong>{msg.type === 'input' ? 'Student' : 'AI'}:</strong> {msg.text}
                      {msg.node && <span className="text-gray-400 text-xs ml-2">[{msg.node}]</span>}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && currentInput && (simulateConversation(currentInput), setCurrentInput(''))}
                  placeholder="Test a student message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm"
                />
                <button
                  onClick={() => {
                    if (currentInput) {
                      simulateConversation(currentInput)
                      setCurrentInput('')
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setSimulationHistory([])}
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">🚀 Export & Share</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const code = generatePythonCode()
                  navigator.clipboard.writeText(code)
                  alert('Python code copied to clipboard!')
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy Python Code
              </button>
              <button
                onClick={() => {
                  if (onFlowComplete) {
                    onFlowComplete(currentFlow)
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}