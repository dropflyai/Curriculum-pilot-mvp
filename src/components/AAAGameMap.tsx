'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QuestMapDemo from './QuestMapComponent'

// Enhanced interactive map with spy-themed overlays
export default function AAAGameMap() {
  const router = useRouter()
  const [mapMode, setMapMode] = useState<'tactical' | 'intel' | 'stealth'>('tactical')
  const [scanActive, setScanActive] = useState(false)
  const [threatLevel, setThreatLevel] = useState(2)
  const [missionAlerts, setMissionAlerts] = useState<Array<{id: string, message: string, priority: 'low' | 'medium' | 'high'}>>([])

  useEffect(() => {
    // Simulate intel updates
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const alerts = [
          { id: Date.now().toString(), message: 'New mission objective detected', priority: 'medium' as const },
          { id: Date.now().toString(), message: 'Security breach in Sector 7', priority: 'high' as const },
          { id: Date.now().toString(), message: 'Code pattern analysis complete', priority: 'low' as const }
        ]
        const newAlert = alerts[Math.floor(Math.random() * alerts.length)]
        setMissionAlerts(prev => [newAlert, ...prev.slice(0, 2)])
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          setMissionAlerts(prev => prev.filter(a => a.id !== newAlert.id))
        }, 5000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const handleRouteNavigation = (path: string) => {
    router.push(path)
  }

  const activateScan = () => {
    setScanActive(true)
    setTimeout(() => setScanActive(false), 3000)
  }

  return (
    <div className="w-full h-full relative">
      {/* Tactical HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Top HUD Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-green-400 font-mono text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>[MISSION HQ] BLACK CIPHER OPERATIONS</span>
              </div>
              <div className="text-xs">
                THREAT LEVEL: <span className={`font-bold ${threatLevel >= 3 ? 'text-red-400' : threatLevel >= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {threatLevel}/5
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs">GRID: 34°N 118°W</div>
              <div className="text-xs">SECURE LINK: ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Intel Alerts */}
        {missionAlerts.length > 0 && (
          <div className="absolute top-20 right-4 space-y-2 max-w-sm">
            {missionAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg backdrop-blur-lg border-2 animate-slide-in-right ${
                  alert.priority === 'high' ? 'bg-red-900/70 border-red-400/60' :
                  alert.priority === 'medium' ? 'bg-yellow-900/70 border-yellow-400/60' :
                  'bg-green-900/70 border-green-400/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`text-lg ${
                    alert.priority === 'high' ? 'text-red-400' :
                    alert.priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {alert.priority === 'high' ? '🚨' : alert.priority === 'medium' ? '⚠️' : '📡'}
                  </div>
                  <div>
                    <div className={`font-mono font-bold text-xs ${
                      alert.priority === 'high' ? 'text-red-400' :
                      alert.priority === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      [{alert.priority.toUpperCase()}] INTEL UPDATE
                    </div>
                    <div className="text-white font-mono text-xs">{alert.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scanning Animation Overlay */}
        {scanActive && (
          <div className="absolute inset-0 bg-green-500/10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent animate-pulse" 
                 style={{
                   backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,0,0.2) 3px, rgba(0,255,0,0.2) 6px)',
                   animation: 'scan-lines 1s infinite linear'
                 }}>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-green-400 font-mono text-xl animate-pulse">
                [SCANNING TACTICAL GRID...]
              </div>
            </div>
          </div>
        )}

        {/* Corner HUD Elements */}
        <div className="absolute top-4 left-4">
          <div className="w-16 h-16 border-2 border-green-400 bg-black/60 flex items-center justify-center">
            <div className="text-green-400 font-mono text-xs text-center">
              <div className="font-bold">BSA</div>
              <div>MAP</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="bg-black/80 border border-green-400/40 p-2 font-mono text-xs">
            <div className="text-green-400 mb-2">[LEGEND]</div>
            <div className="space-y-1 text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>Classified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tactical Controls */}
      <div className="absolute bottom-4 right-4 z-40 pointer-events-auto">
        <div className="space-y-2">
          {/* Scan Button */}
          <button
            onClick={activateScan}
            disabled={scanActive}
            className={`w-12 h-12 border-2 border-cyan-400 bg-black/80 text-cyan-400 font-mono text-xs transition-all duration-300 hover:bg-cyan-400/20 ${
              scanActive ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)'}}
          >
            {scanActive ? '...' : '📡'}
          </button>
          
          {/* Map Mode Selector */}
          <div className="flex flex-col space-y-1">
            {[
              { mode: 'tactical' as const, label: '🎯', color: 'green' },
              { mode: 'intel' as const, label: '📊', color: 'blue' },
              { mode: 'stealth' as const, label: '👤', color: 'purple' }
            ].map((modeBtn) => (
              <button
                key={modeBtn.mode}
                onClick={() => setMapMode(modeBtn.mode)}
                className={`w-10 h-10 border-2 text-xs font-mono transition-all duration-300 ${
                  mapMode === modeBtn.mode
                    ? `border-${modeBtn.color}-400 bg-${modeBtn.color}-400/20 text-${modeBtn.color}-400`
                    : 'border-gray-500 bg-black/60 text-gray-400 hover:border-gray-400'
                }`}
              >
                {modeBtn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Quest Map */}
      <div className={`w-full h-full transition-all duration-500 ${
        mapMode === 'intel' ? 'hue-rotate-180' :
        mapMode === 'stealth' ? 'saturate-50 brightness-75' :
        ''
      }`}>
        <QuestMapDemo
          backgroundImageUrl="/black cipher map 5.png"
          routeTo={handleRouteNavigation}
          userId="demo-student"
          courseId="python-basics-2025"
        />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scan-lines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}