'use client'

import { useState } from 'react'
import Link from 'next/link'
import CoachNova from '@/components/CoachNova'
import { Shield, Users, Activity, Target, TrendingUp, AlertCircle } from 'lucide-react'

export default function NovaCommandCenter() {
  const [selectedAgent, setSelectedAgent] = useState('Agent Alpha')
  
  const activeAgents = [
    { 
      name: 'Agent Alpha', 
      lesson: 'Python Variables', 
      progress: 75, 
      status: 'active',
      novaInteractions: 3,
      difficulty: 'recruit'
    },
    { 
      name: 'Agent Bravo', 
      lesson: 'Magic 8-Ball Project', 
      progress: 45, 
      status: 'stuck',
      novaInteractions: 7,
      difficulty: 'operative' 
    },
    { 
      name: 'Agent Charlie', 
      lesson: 'Loop Structures', 
      progress: 90, 
      status: 'excelling',
      novaInteractions: 1,
      difficulty: 'agent'
    },
    { 
      name: 'Agent Delta', 
      lesson: 'Conditional Logic', 
      progress: 30, 
      status: 'struggling',
      novaInteractions: 12,
      difficulty: 'recruit'
    }
  ]

  const recentNovaAlerts = [
    {
      agent: 'Agent Bravo',
      alert: 'Multiple help requests detected - may need direct intervention',
      severity: 'high',
      timestamp: '2 mins ago'
    },
    {
      agent: 'Agent Delta', 
      alert: 'Extended session with Coach Nova - showing improvement',
      severity: 'low',
      timestamp: '5 mins ago'
    },
    {
      agent: 'Agent Echo',
      alert: 'Completed lesson with minimal Nova assistance - promote to next level',
      severity: 'success',
      timestamp: '8 mins ago'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-lg border-b border-green-500/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-green-400 hover:text-green-300 font-mono text-sm mb-2 block">
              ← Return to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white font-mono flex items-center">
              <Shield className="w-8 h-8 mr-3 text-green-400" />
              COACH NOVA COMMAND CENTER
            </h1>
            <p className="text-gray-300 font-mono text-sm mt-2">
              Real-time monitoring of AI tactical support across all agent training
            </p>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-mono font-bold text-xl">OPERATIONAL</div>
            <div className="text-gray-300 text-sm">All systems online</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* System Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black/60 border-2 border-green-400/30 p-4"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-2xl font-bold text-green-400 font-mono">24</span>
              </div>
              <div className="text-sm text-gray-300 font-mono">Active Agents</div>
              <div className="text-xs text-green-400 mt-1">↗ +3 today</div>
            </div>

            <div className="bg-black/60 border-2 border-blue-400/30 p-4"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400 font-mono">127</span>
              </div>
              <div className="text-sm text-gray-300 font-mono">Nova Interactions</div>
              <div className="text-xs text-blue-400 mt-1">Last hour</div>
            </div>

            <div className="bg-black/60 border-2 border-purple-400/30 p-4"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400 font-mono">89%</span>
              </div>
              <div className="text-sm text-gray-300 font-mono">Success Rate</div>
              <div className="text-xs text-purple-400 mt-1">With Nova aid</div>
            </div>

            <div className="bg-black/60 border-2 border-yellow-400/30 p-4"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400 font-mono">1.8s</span>
              </div>
              <div className="text-sm text-gray-300 font-mono">Avg Response</div>
              <div className="text-xs text-yellow-400 mt-1">Nova speed</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Active Agents List */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-green-400/40 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              
              <h2 className="text-xl font-bold text-green-400 font-mono mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                ACTIVE FIELD AGENTS
              </h2>
              
              <div className="space-y-3">
                {activeAgents.map((agent) => (
                  <div 
                    key={agent.name}
                    onClick={() => setSelectedAgent(agent.name)}
                    className={`p-3 border cursor-pointer transition-all ${
                      selectedAgent === agent.name 
                        ? 'border-green-400 bg-green-900/20' 
                        : 'border-gray-600 bg-black/20 hover:border-gray-500'
                    }`}
                    style={{clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'}}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-white font-bold">{agent.name}</span>
                      <div className={`px-2 py-1 text-xs font-mono rounded ${
                        agent.status === 'active' ? 'bg-green-600 text-white' :
                        agent.status === 'stuck' ? 'bg-red-600 text-white' :
                        agent.status === 'excelling' ? 'bg-blue-600 text-white' :
                        'bg-yellow-600 text-black'
                      }`}>
                        {agent.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300 font-mono mb-2">{agent.lesson}</div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-mono">Progress:</span>
                      <span className="text-xs text-white font-mono">{agent.progress}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-700 rounded mb-2">
                      <div 
                        className={`h-full rounded transition-all ${
                          agent.progress >= 80 ? 'bg-green-500' :
                          agent.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-mono">Nova assists: {agent.novaInteractions}</span>
                      <span className={`font-mono ${
                        agent.difficulty === 'recruit' ? 'text-green-400' :
                        agent.difficulty === 'operative' ? 'text-blue-400' :
                        agent.difficulty === 'agent' ? 'text-purple-400' : 'text-red-400'
                      }`}>
                        {agent.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Nova Analytics */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-blue-400/40 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              
              <h2 className="text-xl font-bold text-blue-400 font-mono mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                NOVA ANALYTICS
              </h2>

              <CoachNova 
                studentName="Command Overview"
                lessonTitle="System Analytics"
                showAnalytics={true}
                isCommanderView={false}
              />
            </div>

            {/* Recent Alerts */}
            <div className="bg-black/60 backdrop-blur-lg border-2 border-yellow-400/40 p-6"
                 style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
              
              <h2 className="text-xl font-bold text-yellow-400 font-mono mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                TACTICAL ALERTS
              </h2>
              
              <div className="space-y-4">
                {recentNovaAlerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`p-3 border-l-4 ${
                      alert.severity === 'high' ? 'border-red-400 bg-red-900/10' :
                      alert.severity === 'success' ? 'border-green-400 bg-green-900/10' :
                      'border-yellow-400 bg-yellow-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-white font-bold text-sm">{alert.agent}</span>
                      <span className="text-xs text-gray-400 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-mono">{alert.alert}</p>
                    <div className={`inline-block px-2 py-1 text-xs font-mono mt-2 rounded ${
                      alert.severity === 'high' ? 'bg-red-600 text-white' :
                      alert.severity === 'success' ? 'bg-green-600 text-white' :
                      'bg-yellow-600 text-black'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-mono text-sm py-2 px-4 transition-colors">
                View All Alerts →
              </button>
            </div>
          </div>

          {/* Selected Agent Chat */}
          <div className="bg-black/60 backdrop-blur-lg border-2 border-purple-400/40 p-6"
               style={{clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'}}>
            
            <h2 className="text-xl font-bold text-purple-400 font-mono mb-4">
              NOVA CONVERSATION LOG - {selectedAgent}
            </h2>
            
            <CoachNova 
              studentName={selectedAgent}
              lessonTitle="Python Variables Training"
              isCommanderView={true}
              lessonContext={{
                type: 'lesson',
                difficulty: 'recruit'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}