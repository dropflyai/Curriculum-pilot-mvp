'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Target, Shield, AlertTriangle, Activity, Users, CheckCircle,
  ChevronRight, Lock, Unlock, Clock, MapPin, Radio, Crosshair,
  AlertCircle, Zap, TrendingUp, Award, Navigation
} from 'lucide-react'

export default function BlackCipherMission() {
  const [missionStatus, setMissionStatus] = useState('CLASSIFIED')
  const [accessGranted, setAccessGranted] = useState(false)

  useEffect(() => {
    // Simulate access authorization
    setTimeout(() => {
      setAccessGranted(true)
      setMissionStatus('ACTIVE')
    }, 1500)
  }, [])

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-400 font-mono text-2xl mb-4 animate-pulse">
            AUTHENTICATING CLEARANCE...
          </div>
          <div className="flex justify-center space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{animationDelay: `${i * 0.2}s`}}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      
      {/* SECTION 1 - Mountain Base Hero */}
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/CodeFly Homepage.png")',
            filter: 'brightness(0.6) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        
        {/* Tactical HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-green-400 opacity-60"></div>
          <div className="absolute top-6 right-6 w-20 h-20 border-r-2 border-t-2 border-green-400 opacity-60"></div>
          <div className="absolute bottom-6 left-6 w-20 h-20 border-l-2 border-b-2 border-green-400 opacity-60"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-green-400 opacity-60"></div>
          
          {/* Scanning lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
            animation: 'scan 4s linear infinite'
          }}></div>
        </div>

        {/* Mission Briefing Header */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Status Bar */}
          <div className="bg-black/90 border border-red-600/50 rounded-lg p-3 mb-8 font-mono text-sm backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-red-400">MISSION ID: BC-7749</span>
                <span className="text-yellow-400">CLASSIFICATION: TOP SECRET</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">STATUS: {missionStatus}</span>
              </div>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-7xl md:text-9xl font-black mb-6 font-mono tracking-wider">
            <span className="bg-gradient-to-r from-red-500 via-amber-500 to-red-600 bg-clip-text text-transparent">
              BLACK CIPHER
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-red-300 mb-8 font-mono">
            🎯 OPERATION: DIGITAL FORTRESS
          </h2>
          
          {/* Mission Brief */}
          <div className="bg-black/80 border-2 border-amber-600/50 rounded-xl p-8 mb-8 text-left max-w-4xl mx-auto backdrop-blur-sm">
            <div className="text-amber-300 font-mono text-lg mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 animate-pulse" />
              PRIORITY ALPHA BRIEFING
            </div>
            <p className="text-xl text-gray-200 font-medium leading-relaxed mb-4">
              Intelligence has discovered a rogue AI system codenamed <span className="text-red-400 font-bold">"BLACK CIPHER"</span> 
              operating from a fortified mountain facility. Your mission: infiltrate the digital fortress, 
              decode encrypted Python protocols, and neutralize the threat.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">87%</div>
                <div className="text-green-300">SUCCESS PROBABILITY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">45 MIN</div>
                <div className="text-yellow-300">EST. DURATION</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">EXTREME</div>
                <div className="text-red-300">DIFFICULTY</div>
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl border-2 border-red-400/50 font-mono backdrop-blur-sm">
              <Crosshair className="h-8 w-8 mr-3" />
              ACCEPT MISSION
            </button>
            
            <Link href="/student/dashboard" className="bg-gradient-to-r from-gray-700 to-gray-900 border-2 border-gray-600/50 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-mono backdrop-blur-sm">
              <Shield className="h-8 w-8 mr-3" />
              ABORT MISSION
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2 - Mission Objectives */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/CodeFly Homepage 2.png")',
            filter: 'brightness(0.5) contrast(1.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          
          {/* Mission Objectives Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-blue-300 mb-4 font-mono tracking-wider">
              📋 MISSION OBJECTIVES
            </h2>
            <p className="text-xl text-gray-300 font-mono">
              Complete all objectives to successfully infiltrate BLACK CIPHER
            </p>
          </div>

          {/* Objectives Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            
            {/* Primary Objectives */}
            <div className="bg-black/80 border-2 border-green-600/50 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-green-300 font-mono">PRIMARY OBJECTIVES</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <div className="text-white font-semibold">Breach Outer Firewall</div>
                    <div className="text-gray-400 text-sm">Decode basic Python encryption algorithms</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-500 mt-1" />
                  <div>
                    <div className="text-white font-semibold">Access Core Systems</div>
                    <div className="text-gray-400 text-sm">Navigate complex data structures and loops</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-white font-semibold">Neutralize AI Threat</div>
                    <div className="text-gray-400 text-sm">Implement counter-algorithms using advanced Python</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-white font-semibold">Extract Intelligence</div>
                    <div className="text-gray-400 text-sm">Download and decrypt classified data files</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Objectives */}
            <div className="bg-black/80 border-2 border-blue-600/50 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-blue-300 font-mono">BONUS OBJECTIVES</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold">Speed Run</div>
                    <div className="text-gray-400 text-sm">Complete mission in under 30 minutes</div>
                    <div className="text-yellow-400 text-xs mt-1">+500 XP BONUS</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold">Perfect Stealth</div>
                    <div className="text-gray-400 text-sm">Complete without triggering any alarms</div>
                    <div className="text-yellow-400 text-xs mt-1">+750 XP BONUS</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold">100% Accuracy</div>
                    <div className="text-gray-400 text-sm">No errors in code execution</div>
                    <div className="text-yellow-400 text-xs mt-1">+1000 XP BONUS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Loadout */}
          <div className="bg-black/80 border-2 border-amber-600/50 rounded-xl p-8 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-amber-400 mr-3" />
              <h3 className="text-2xl font-bold text-amber-300 font-mono">EQUIPMENT LOADOUT</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💻</span>
                </div>
                <div className="text-white font-semibold">Python IDE</div>
                <div className="text-gray-400 text-xs">Advanced Editor</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="text-white font-semibold">AI Assistant</div>
                <div className="text-gray-400 text-xs">Tactical Support</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📡</span>
                </div>
                <div className="text-white font-semibold">Debug Scanner</div>
                <div className="text-gray-400 text-xs">Error Detection</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="text-white font-semibold">Firewall Bypass</div>
                <div className="text-gray-400 text-xs">Security Tools</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 - Mission Intel */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/CodeFly Homepage 3.png")',
            filter: 'brightness(0.4) contrast(1.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          
          {/* Intel Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-red-300 mb-4 font-mono tracking-wider">
              🔍 TACTICAL INTELLIGENCE
            </h2>
            <p className="text-xl text-gray-300 font-mono">
              Critical information for mission success
            </p>
          </div>

          {/* Intel Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            
            {/* Threat Assessment */}
            <div className="bg-black/80 border-2 border-red-600/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <h3 className="text-red-300 font-mono font-bold">THREAT LEVEL</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-black text-red-400 font-mono">EXTREME</div>
                <div className="text-red-300 text-sm font-mono">DEFCON 2</div>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1,2,3,4,5].map(level => (
                  <div key={level} className={`h-2 rounded-full ${level <= 4 ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-400 font-mono">
                <div>• Advanced encryption detected</div>
                <div>• Multiple security layers</div>
                <div>• AI countermeasures active</div>
              </div>
            </div>

            {/* Mission Parameters */}
            <div className="bg-black/80 border-2 border-yellow-600/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-yellow-400 mr-3" />
                <h3 className="text-yellow-300 font-mono font-bold">PARAMETERS</h3>
              </div>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-yellow-400">45-60 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-red-400">Expert</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Reward:</span>
                  <span className="text-green-400">2,500 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Badge:</span>
                  <span className="text-purple-400">Cipher Master</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Attempts:</span>
                  <span className="text-blue-400">Unlimited</span>
                </div>
              </div>
            </div>

            {/* Support Assets */}
            <div className="bg-black/80 border-2 border-green-600/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <Radio className="w-5 h-5 text-green-400 mr-3" />
                <h3 className="text-green-300 font-mono font-bold">SUPPORT</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">AI Tactical Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Real-time Hints</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Debug Console</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Solution Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">Emergency Extract</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final Launch Section */}
          <div className="bg-black/90 border-2 border-red-600/50 rounded-xl p-8 text-center backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-red-300 mb-4 font-mono">⚠️ FINAL AUTHORIZATION</h3>
            <p className="text-gray-300 mb-8 font-mono max-w-2xl mx-auto">
              This is an EXTREME difficulty mission requiring advanced Python skills. 
              Ensure you have completed prerequisite training before attempting infiltration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-12 py-5 rounded-xl text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl border-2 border-red-400/50 font-mono">
                <Unlock className="h-6 w-6 mr-3" />
                🚀 INITIATE BLACK CIPHER
              </button>
              
              <Link href="/student/dashboard" className="bg-black/80 border-2 border-gray-600/50 text-gray-400 px-12 py-5 rounded-xl text-xl font-semibold hover:bg-black/90 hover:text-white transition-all duration-300 flex items-center justify-center font-mono">
                <Navigation className="h-6 w-6 mr-3" />
                RETURN TO BASE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}