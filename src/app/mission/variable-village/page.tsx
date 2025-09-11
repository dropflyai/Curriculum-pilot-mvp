'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Target, Shield, AlertTriangle, Activity, Users, CheckCircle,
  ChevronRight, Lock, Unlock, Clock, MapPin, Radio, Crosshair,
  AlertCircle, Zap, TrendingUp, Award, Navigation, Database
} from 'lucide-react'

export default function VariableVillageMission() {
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
      
      {/* SECTION 1 - Variable Village Hero */}
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/CodeFly Homepage 2.png")',
            filter: 'brightness(0.6) contrast(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        
        {/* Tactical HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-blue-400 opacity-60"></div>
          <div className="absolute top-6 right-6 w-20 h-20 border-r-2 border-t-2 border-blue-400 opacity-60"></div>
          <div className="absolute bottom-6 left-6 w-20 h-20 border-l-2 border-b-2 border-blue-400 opacity-60"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-blue-400 opacity-60"></div>
          
          {/* Scanning lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,100,255,0.1) 2px, rgba(0,100,255,0.1) 4px)',
            animation: 'scan 4s linear infinite'
          }}></div>
        </div>

        {/* Mission Briefing Header */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Status Bar */}
          <div className="bg-black/90 border border-blue-600/50 rounded-lg p-3 mb-8 font-mono text-sm backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-blue-400">MISSION ID: VV-2024</span>
                <span className="text-cyan-400">CLASSIFICATION: CONFIDENTIAL</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">STATUS: {missionStatus}</span>
              </div>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-7xl md:text-9xl font-black mb-6 font-mono tracking-wider">
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              VARIABLE VILLAGE
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-300 mb-8 font-mono">
            <Database className="inline-block w-8 h-8 mr-3" />
            OPERATION: DATA TYPES & VARIABLES
          </h2>
          
          {/* Mission Brief Card - Matching Mission HQ Style */}
          <div className="relative h-96 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-blue-500/50 transition-all max-w-4xl mx-auto mb-8">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("/CodeFly Homepage 2.png")`,
                filter: 'brightness(0.5)'
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-blue-900/80 text-blue-300">
                    BEGINNER
                  </span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-cyan-300 font-mono text-sm">WEEK 3-4</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">DATA PROCESSING CENTER</h3>
                <p className="text-sm text-gray-400 font-mono">MISSION ID: VV-2024 | CLEARANCE: LEVEL 2</p>
              </div>
              
              {/* Mission Description */}
              <div className="flex-1 flex items-center">
                <p className="text-lg text-gray-200 leading-relaxed">
                  Welcome to Variable Village, Agent. Your mission: master data processing, JSON manipulation, 
                  and structured prompts. Learn to decode scrambled intelligence with operational security 
                  and implement error recovery protocols for mission-critical data.
                </p>
              </div>
              
              {/* Footer Stats */}
              <div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-black/60 rounded p-2 text-center">
                    <div className="text-xl font-bold text-cyan-400">2 WEEKS</div>
                    <div className="text-xs text-cyan-300 font-mono">DURATION</div>
                  </div>
                  <div className="bg-black/60 rounded p-2 text-center">
                    <div className="text-xl font-bold text-green-400">8 LESSONS</div>
                    <div className="text-xs text-green-300 font-mono">OPERATIONS</div>
                  </div>
                  <div className="bg-black/60 rounded p-2 text-center">
                    <div className="text-xl font-bold text-yellow-400">3000 XP</div>
                    <div className="text-xs text-yellow-300 font-mono">REWARD</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">PREREQUISITE: BINARY SHORES ACADEMY</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400">STATUS: READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/agent-academy-lesson-dashboard" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl border-2 border-blue-400/50 font-mono backdrop-blur-sm">
              <Crosshair className="h-8 w-8 mr-3" />
              BEGIN OPERATION
            </Link>
            
            <Link href="/mission-hq" className="bg-gradient-to-r from-gray-700 to-gray-900 border-2 border-gray-600/50 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-mono backdrop-blur-sm">
              <Shield className="h-8 w-8 mr-3" />
              RETURN TO HQ
            </Link>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  )
}