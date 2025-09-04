'use client'

import { useEffect, useRef, useState } from 'react'

// Web Audio API sound synthesis for CodeFly
class SoundSynthesizer {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        this.gainNode = this.audioContext.createGain()
        this.gainNode.connect(this.audioContext.destination)
        this.gainNode.gain.value = 0.3 // Default volume
      } catch (e) {
        console.warn('Web Audio API not supported')
      }
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine', duration: number = 0.2) {
    if (!this.audioContext || !this.gainNode) return

    const oscillator = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()
    
    oscillator.connect(envelope)
    envelope.connect(this.gainNode)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    // ADSR envelope
    const now = this.audioContext.currentTime
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(0.8, now + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration)
    
    oscillator.start(now)
    oscillator.stop(now + duration)
  }

  playSuccess() {
    // Happy chord progression
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.createOscillator(note, 'triangle', 0.3)
      }, i * 100)
    })
  }

  playXPGain() {
    // Rising arpeggio
    const notes = [440, 554.37, 659.25, 783.99] // A4, C#5, E5, G5
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.createOscillator(note, 'square', 0.15)
      }, i * 50)
    })
  }

  playAchievement() {
    // Fanfare-like sound
    const melody = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    melody.forEach((note, i) => {
      setTimeout(() => {
        this.createOscillator(note, 'sawtooth', 0.4)
        if (i === melody.length - 1) {
          // Final note with harmony
          setTimeout(() => this.createOscillator(note * 1.5, 'triangle', 0.6), 100)
        }
      }, i * 150)
    })
  }

  playHover() {
    this.createOscillator(800, 'sine', 0.1)
  }

  playClick() {
    // Quick percussive sound
    if (!this.audioContext || !this.gainNode) return
    
    const noise = this.audioContext.createBufferSource()
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate)
    const output = buffer.getChannelData(0)
    
    for (let i = 0; i < buffer.length; i++) {
      output[i] = Math.random() * 2 - 1
    }
    
    noise.buffer = buffer
    
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1000
    
    const envelope = this.audioContext.createGain()
    const now = this.audioContext.currentTime
    
    noise.connect(filter)
    filter.connect(envelope)
    envelope.connect(this.gainNode)
    
    envelope.gain.setValueAtTime(0.5, now)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    
    noise.start(now)
    noise.stop(now + 0.1)
  }

  playError() {
    // Dissonant chord
    const notes = [220, 233.08, 246.94] // A3, A#3, B3 (dissonant)
    notes.forEach((note) => {
      this.createOscillator(note, 'square', 0.5)
    })
  }

  playLevelUp() {
    // Epic level up sound
    const progression = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D major  
      [329.63, 415.30, 493.88], // E major
      [392.00, 493.88, 587.33]  // G major
    ]
    
    progression.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(note => {
          this.createOscillator(note, 'triangle', 0.6)
        })
      }, i * 200)
    })
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume))
    }
  }
}

interface SoundEffectsProps {
  enabled?: boolean
  volume?: number
  onSoundPlay?: (type: string) => void
}

let synthesizer: SoundSynthesizer | null = null

export default function SoundEffects({ enabled = true, volume = 0.3, onSoundPlay }: SoundEffectsProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !synthesizer) {
      synthesizer = new SoundSynthesizer()
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (synthesizer) {
      synthesizer.setVolume(enabled ? volume : 0)
    }
  }, [enabled, volume])

  // Expose sound methods globally for easy access
  useEffect(() => {
    if (!synthesizer || !enabled) return

    const soundMethods = {
      playSuccess: () => { synthesizer!.playSuccess(); onSoundPlay?.('success') },
      playXPGain: () => { synthesizer!.playXPGain(); onSoundPlay?.('xp-gain') },
      playAchievement: () => { synthesizer!.playAchievement(); onSoundPlay?.('achievement') },
      playHover: () => { synthesizer!.playHover(); onSoundPlay?.('hover') },
      playClick: () => { synthesizer!.playClick(); onSoundPlay?.('click') },
      playError: () => { synthesizer!.playError(); onSoundPlay?.('error') },
      playLevelUp: () => { synthesizer!.playLevelUp(); onSoundPlay?.('level-up') }
    }

    // Make sounds available globally
    ;(window as any).codeFlyAudio = soundMethods

    return () => {
      delete (window as any).codeFlyAudio
    }
  }, [enabled, onSoundPlay])

  return (
    <div className="fixed top-4 right-4 z-50 opacity-0 pointer-events-none">
      {/* Hidden component - just manages sound system */}
      {isInitialized && (
        <div className="text-xs text-green-400 bg-black/50 px-2 py-1 rounded font-mono">
          🔊 Audio System Ready
        </div>
      )}
    </div>
  )
}

// Utility hook for easy sound integration
export function useSound() {
  const playSound = (type: string) => {
    const audio = (window as any).codeFlyAudio
    if (audio && audio[`play${type.charAt(0).toUpperCase()}${type.slice(1)}`]) {
      audio[`play${type.charAt(0).toUpperCase()}${type.slice(1)}`]()
    }
  }

  return { playSound }
}