'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  Terminal,
  User,
  Bot,
  Zap,
  Trophy,
  Star,
  Target,
  Shield,
  Code,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'
import { storyEngine } from '../lib/story-engine'
import { AI_MISSION_01, AI_MISSION_02, AI_MISSION_03, AI_MISSION_04, AI_MISSION_05, AI_MISSION_06, AI_MISSION_07, AI_MISSION_08 } from '../data/ai-missions'
import type { Mission, StoryBeat } from '../lib/story-engine'
import CinematicCutscene from './CinematicCutscene'
import { ALL_CUTSCENES } from '../data/cutscenes'
import { LESSON_CUTSCENES, getCutsceneForLesson } from '../data/lesson-cutscenes'

interface GameState {
  currentMission: Mission | null
  currentStoryBeat: StoryBeat | null
  code: string
  output: string
  missionProgress: number
  showCharacterDialogue: boolean
  showCutscene: boolean
  currentCutscene: string | null
}

export default function AgentAcademyGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentMission: null,
    currentStoryBeat: null,
    code: '',
    output: '',
    missionProgress: 0,
    showCharacterDialogue: false,
    showCutscene: false,
    currentCutscene: null
  })

  const [studentState, setStudentState] = useState(storyEngine.getStudentState())
  const [showMissionBriefing, setShowMissionBriefing] = useState(false)
  const [currentMissions] = useState([AI_MISSION_01, AI_MISSION_02, AI_MISSION_03, AI_MISSION_04, AI_MISSION_05, AI_MISSION_06, AI_MISSION_07, AI_MISSION_08])

  useEffect(() => {
    // Start with first AI mission briefing
    if (!gameState.currentMission) {
      startMission(AI_MISSION_01)
    }
  }, [])

  const startMission = (mission: Mission) => {
    // Get lesson number from mission ID  
    const lessonNumber = parseInt(mission.id.replace('ai_threat_', ''))
    const openingCutscene = getCutsceneForLesson(lessonNumber, 'lesson_start')

    if (openingCutscene) {
      // Show lesson opening cutscene first
      setGameState(prev => ({
        ...prev,
        showCutscene: true,
        currentCutscene: `lesson_${lessonNumber.toString().padStart(2, '0')}_opening`,
        currentMission: mission
      }))
    } else {
      // Start mission directly
      setGameState(prev => ({
        ...prev,
        currentMission: mission,
        currentStoryBeat: mission.storyBeats.opening,
        code: `# ${mission.title}
# ${mission.description}

# Your code here:
`,
        output: '',
        missionProgress: 0,
        showCharacterDialogue: true
      }))
      setShowMissionBriefing(true)
    }
  }

  const handleCutsceneComplete = () => {
    const mission = gameState.currentMission
    if (mission) {
      const currentCutsceneId = gameState.currentCutscene
      const lessonNumber = parseInt(mission.id.replace('ai_threat_', ''))
      let nextCutscene = null
      
      // Handle lesson cutscene progression
      if (currentCutsceneId?.endsWith('_opening')) {
        // After lesson opening, show concept intro
        nextCutscene = getCutsceneForLesson(lessonNumber, 'concept_intro')
      } else if (currentCutsceneId?.endsWith('_success')) {
        // After lesson success, show completion
        nextCutscene = getCutsceneForLesson(lessonNumber, 'lesson_complete')
      }
      
      if (nextCutscene) {
        // Show next lesson cutscene
        const nextCutsceneId = currentCutsceneId?.replace('_opening', '_concept').replace('_success', '_completion') || null
        setGameState(prev => ({
          ...prev,
          currentCutscene: nextCutsceneId
        }))
      } else {
        // End cutscene sequence - either start mission or finish it
        setGameState(prev => ({
          ...prev,
          showCutscene: false,
          currentCutscene: null,
          currentStoryBeat: mission.storyBeats.opening,
          code: gameState.missionProgress > 0 ? prev.code : `# ${mission.title}
# ${mission.description}

# Your code here:
`,
          output: gameState.missionProgress > 0 ? prev.output : '',
          missionProgress: gameState.missionProgress > 0 ? prev.missionProgress : 0,
          showCharacterDialogue: true
        }))
        if (gameState.missionProgress === 0) {
          setShowMissionBriefing(true)
        }
      }
    }
  }

  const executeCode = async () => {
    if (!gameState.currentMission) return

    // Simple code analysis (in real version, would execute Python)
    const codeAnalysis = storyEngine.analyzeCode(
      gameState.code, 
      gameState.currentMission.codeChallenge.expectedOutput
    )

    // Generate character response
    const character = storyEngine.getCharacter(gameState.currentStoryBeat?.character || 'nova')
    if (character) {
      const response = storyEngine.generateResponse(character, codeAnalysis, 'mission_execution')
      
      // Award XP and update state
      const xpResult = storyEngine.awardXP(codeAnalysis.quality === 'excellent' ? 150 : codeAnalysis.quality === 'good' ? 100 : 50)
      
      setStudentState(storyEngine.getStudentState())
      
      // Check for lesson success cutscene
      const lessonNumber = parseInt(gameState.currentMission?.id.replace('ai_threat_', '') || '0')
      const successCutscene = (codeAnalysis.quality === 'excellent' || codeAnalysis.quality === 'good') 
        ? getCutsceneForLesson(lessonNumber, 'success')
        : null

      if (successCutscene) {
        // Show lesson success cutscene, then completion cutscene
        setGameState(prev => ({
          ...prev,
          showCutscene: true,
          currentCutscene: `lesson_${lessonNumber.toString().padStart(2, '0')}_success`,
          missionProgress: 100,
          output: `🎯 OPERATION COMPLETE
          
Mission Assessment: ${codeAnalysis.quality.toUpperCase()}
${codeAnalysis.feedback.join('\n')}

🏆 XP AWARDED: +${codeAnalysis.quality === 'excellent' ? 150 : codeAnalysis.quality === 'good' ? 100 : 50}
${xpResult.newLevel ? `🎉 CLEARANCE LEVEL UP! You are now Level ${xpResult.level}` : ''}`
        }))
      } else {
        // Update game state with results
        setGameState(prev => ({
          ...prev,
          currentStoryBeat: response,
          output: `🎯 CODE EXECUTION COMPLETE
          
Quality Assessment: ${codeAnalysis.quality.toUpperCase()}
${codeAnalysis.feedback.join('\n')}

${response.content}

🏆 XP AWARDED: +${codeAnalysis.quality === 'excellent' ? 150 : codeAnalysis.quality === 'good' ? 100 : 50}
${xpResult.newLevel ? `🎉 LEVEL UP! You are now Level ${xpResult.level}` : ''}`,
          missionProgress: codeAnalysis.quality === 'poor' ? 50 : 100,
          showCharacterDialogue: true
        }))
      }
    }
  }

  const getCharacterAvatar = (characterId: string) => {
    switch (characterId) {
      case 'atlas': return '🎖️'
      case 'nova': return '🤖'
      case 'maya': return '👩‍🔬'
      case 'shadow': return '👤'
      default: return '🕵️'
    }
  }

  const getCharacterName = (characterId: string) => {
    const character = storyEngine.getCharacter(characterId)
    return character?.name || 'Agent'
  }

  return (
    <>
      {/* Cutscene Overlay */}
      {gameState.showCutscene && gameState.currentCutscene && (
        <>  
          {(() => {
            // Handle lesson cutscenes
            if (gameState.currentCutscene.startsWith('lesson_') && gameState.currentMission) {
              const lessonNumber = parseInt(gameState.currentMission.id.replace('ai_threat_', ''))
              let trigger = 'lesson_start'
              
              if (gameState.currentCutscene.endsWith('_concept')) trigger = 'concept_intro'
              else if (gameState.currentCutscene.endsWith('_success')) trigger = 'success'
              else if (gameState.currentCutscene.endsWith('_completion')) trigger = 'lesson_complete'
              
              const cutscene = getCutsceneForLesson(lessonNumber, trigger)
              
              if (cutscene) {
                return (
                  <CinematicCutscene
                    dialogues={cutscene.dialogues}
                    backgroundImage={cutscene.backgroundImage}
                    onComplete={handleCutsceneComplete}
                  />
                )
              }
            }
            
            // Handle original mission cutscenes
            const originalCutscene = ALL_CUTSCENES[gameState.currentCutscene as keyof typeof ALL_CUTSCENES]
            if (originalCutscene) {
              return (
                <CinematicCutscene
                  dialogues={originalCutscene.dialogues}
                  backgroundImage={originalCutscene.backgroundImage}
                  onComplete={handleCutsceneComplete}
                />
              )
            }
            
            return null
          })()}
        </>
      )}

      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Spy-Themed Header */}
      <div className="h-16 bg-black/50 backdrop-blur border-b border-green-500/30 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-400">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-300">AGENT ACADEMY</h1>
              <p className="text-xs text-green-500/70">CLASSIFIED TRAINING FACILITY</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Agent Stats */}
          <div className="flex items-center space-x-4 bg-slate-800/80 backdrop-blur rounded-lg px-4 py-2 border border-green-500/30">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Level {studentState.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">{studentState.xp} XP</span>
            </div>
          </div>
          
          {/* Mission Status */}
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">
                {gameState.currentMission ? gameState.currentMission.title : 'No Active Mission'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Mission Briefing / Character Dialogue Panel */}
        <div className="w-1/3 bg-slate-800/90 backdrop-blur border-r border-green-500/30 flex flex-col">
          {/* Character Display */}
          {gameState.currentStoryBeat && (
            <div className="flex-1 p-6">
              <div className="bg-slate-900/80 rounded-lg p-6 border border-green-500/30">
                {/* Character Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">
                    {getCharacterAvatar(gameState.currentStoryBeat.character)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-300">
                      {getCharacterName(gameState.currentStoryBeat.character)}
                    </h3>
                    <p className="text-sm text-green-500/70">
                      {storyEngine.getCharacter(gameState.currentStoryBeat.character)?.role}
                    </p>
                  </div>
                </div>
                
                {/* Character Dialogue */}
                <div className="bg-black/30 rounded p-4 border border-green-500/20">
                  <p className="text-green-200 whitespace-pre-line leading-relaxed">
                    {gameState.currentStoryBeat.content}
                  </p>
                </div>

                {/* Mission Progress */}
                {gameState.missionProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-green-400 mb-2">
                      <span>Mission Progress</span>
                      <span>{gameState.missionProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${gameState.missionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Mission Button */}
              {gameState.missionProgress >= 100 && (
                <div className="mt-4">
                  <button 
                    onClick={() => {
                      const nextMissionIndex = currentMissions.findIndex(m => m.id === gameState.currentMission?.id) + 1
                      if (nextMissionIndex < currentMissions.length) {
                        startMission(currentMissions[nextMissionIndex])
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                  >
                    <ChevronRight className="h-5 w-5" />
                    <span>Next Mission</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Code Editor and Execution Panel */}
        <div className="flex-1 flex flex-col">
          {/* Mission Brief Header */}
          {gameState.currentMission && (
            <div className="bg-slate-800/90 backdrop-blur border-b border-green-500/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-green-300">
                    🎯 {gameState.currentMission.title}
                  </h2>
                  <p className="text-sm text-green-500/70">
                    Classification Level: {gameState.currentMission.codeChallenge.difficulty <= 2 ? 'BEGINNER' : 'INTERMEDIATE'}
                  </p>
                </div>
                <button
                  onClick={executeCode}
                  disabled={!gameState.code.trim()}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>EXECUTE MISSION</span>
                </button>
              </div>
            </div>
          )}

          {/* Challenge Prompt */}
          {gameState.currentMission && (
            <div className="bg-slate-900/50 backdrop-blur border-b border-green-500/20 p-4">
              <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                {gameState.currentMission.codeChallenge.prompt}
              </pre>
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1 bg-black/50">
            <textarea
              value={gameState.code}
              onChange={(e) => setGameState(prev => ({ ...prev, code: e.target.value }))}
              className="w-full h-full bg-transparent text-green-300 font-mono p-4 resize-none border-none outline-none placeholder-green-500/50"
              placeholder="# Enter your Python code here..."
              style={{ fontSize: '14px', lineHeight: '1.5' }}
            />
          </div>

          {/* Output Terminal */}
          {gameState.output && (
            <div className="h-64 bg-black/80 backdrop-blur border-t border-green-500/30">
              <div className="h-8 bg-slate-800/50 border-b border-green-500/20 flex items-center px-4">
                <Terminal className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-300">Mission Output</span>
              </div>
              <div className="p-4 h-56 overflow-y-auto">
                <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                  {gameState.output}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}