'use client'

import React, { useState } from 'react'
import { X, CheckCircle, BookOpen, Target, Clock } from 'lucide-react'

// ================ PLUG-AND-PLAY CONFIGURATION ================

export interface StandardMapping {
  standardCode: string
  standardTitle: string
  description: string
  gameLocation: string
  gameWeeks: string
  gameActivities: string[]
}

export interface StateStandards {
  stateName: string
  stateCode: string
  standardsBody: string
  website: string
  mappings: StandardMapping[]
}

export interface GameCurriculum {
  gameName: string
  gameDescription: string
  totalWeeks: number
  stateCompliance: StateStandards[]
}

// ================ AGENT ACADEMY CURRICULUM DATA ================

const AGENT_ACADEMY_CURRICULUM: GameCurriculum = {
  gameName: "Agent Academy",
  gameDescription: "Learn AI agent development and agentic workflows through spy-themed missions, building real business solutions with ethical AI practices",
  totalWeeks: 18,
  stateCompliance: [
    {
      stateName: "California",
      stateCode: "CA",
      standardsBody: "California Computer Science Standards (Based on CSTA K-12)",
      website: "https://www.cde.ca.gov/ci/cr/cf/",
      mappings: [
        {
          standardCode: "6-8.AP.10",
          standardTitle: "Algorithms and Programming - Variables",
          description: "Use variables to store and modify data",
          gameLocation: "Binary Shores Academy & Variable Village",
          gameWeeks: "Weeks 1-4",
          gameActivities: ["Python basics and setup", "Variable assignment and data types", "Intelligence data handling scenarios"]
        },
        {
          standardCode: "6-8.AP.13",
          standardTitle: "Algorithms and Programming - Conditionals", 
          description: "Create programs using control structures",
          gameLocation: "Logic Lake Outpost",
          gameWeeks: "Weeks 5-7",
          gameActivities: ["If-else statements for mission decisions", "Boolean logic in security systems", "Strategic decision-making code"]
        },
        {
          standardCode: "6-8.AP.14",
          standardTitle: "Algorithms and Programming - Iteration",
          description: "Create programs using control structures and iteration",
          gameLocation: "Loop Canyon Base", 
          gameWeeks: "Weeks 8-10",
          gameActivities: ["For loops in data analysis", "While loops for surveillance systems", "Automated data processing"]
        },
        {
          standardCode: "6-8.AP.15",
          standardTitle: "Algorithms and Programming - Functions",
          description: "Create programs using functions with parameters",
          gameLocation: "Function Forest Station",
          gameWeeks: "Weeks 11-13", 
          gameActivities: ["Modular agent tool creation", "Parameter passing for operations", "Reusable code libraries"]
        },
        {
          standardCode: "6-8.AP.16",
          standardTitle: "Algorithms and Programming - Data Structures",
          description: "Use lists to organize and manipulate data",
          gameLocation: "Array Mountains Facility",
          gameWeeks: "Weeks 14-15",
          gameActivities: ["Agent roster management", "Mission data organization", "List manipulation techniques"]
        },
        {
          standardCode: "6-8.AP.17",
          standardTitle: "Algorithms and Programming - Object-Oriented Programming",
          description: "Create programs using object-oriented concepts",
          gameLocation: "Object Oasis Complex & Database Depths",
          gameWeeks: "Weeks 16-18",
          gameActivities: ["Class-based agent modeling", "Object interaction systems", "Final project integration"]
        }
      ]
    },
    {
      stateName: "Texas",
      stateCode: "TX", 
      standardsBody: "Texas Essential Knowledge and Skills (TEKS) - Technology Applications",
      website: "https://www.teksresourcesystem.net/",
      mappings: [
        {
          standardCode: "126.32(c)(1)(A)",
          standardTitle: "Computational Thinking - Problem Solving",
          description: "Identify and define problems using computational thinking",
          gameLocation: "Binary Shores Academy & Variable Village",
          gameWeeks: "Weeks 1-4",
          gameActivities: ["Agent problem analysis techniques", "Breaking down coding challenges", "Systematic approach to programming tasks"]
        },
        {
          standardCode: "126.32(c)(2)(B)",
          standardTitle: "Computational Thinking - Programming",
          description: "Create programs using variables, data types, and operators",
          gameLocation: "Variable Village through Function Forest Station", 
          gameWeeks: "Weeks 3-13",
          gameActivities: ["Python fundamentals for agents", "Data manipulation in operations", "Progressive skill building across facilities"]
        },
        {
          standardCode: "126.32(c)(2)(C)",
          standardTitle: "Computational Thinking - Control Structures",
          description: "Create programs using sequence, selection, and iteration",
          gameLocation: "Logic Lake Outpost & Loop Canyon Base",
          gameWeeks: "Weeks 5-10",
          gameActivities: ["Strategic decision programming", "Automated surveillance systems", "Control flow in mission scenarios"]
        },
        {
          standardCode: "126.32(c)(3)(A)",
          standardTitle: "Creative Development - Advanced Programming",
          description: "Design and create programs using advanced concepts",
          gameLocation: "Array Mountains Facility through Database Depths",
          gameWeeks: "Weeks 14-18",
          gameActivities: ["Complex data management", "Object-oriented agent systems", "Capstone project development"]
        }
      ]
    },
    {
      stateName: "New York",
      stateCode: "NY",
      standardsBody: "New York State Computer Science and Digital Fluency Standards",
      website: "http://www.nysed.gov/curriculum-instruction/computer-science-and-digital-fluency-standards",
      mappings: [
        {
          standardCode: "4-6.CT.4",
          standardTitle: "Computational Thinking - Abstraction",
          description: "Identify and extract common features from a set of interrelated processes or complex phenomena",
          gameLocation: "Function Forest Station & Object Oasis Complex",
          gameWeeks: "Weeks 11-17",
          gameActivities: ["Modular agent tool abstraction", "Class-based system modeling", "Pattern identification across operations"]
        },
        {
          standardCode: "4-6.CT.8",
          standardTitle: "Computational Thinking - Programming", 
          description: "Develop programs using variables, operators, and expressions",
          gameLocation: "Binary Shores through Array Mountains Facility",
          gameWeeks: "Weeks 1-15",
          gameActivities: ["Progressive Python skill development", "Agent operation calculations", "Intelligence data processing"]
        },
        {
          standardCode: "4-6.CT.9",
          standardTitle: "Computational Thinking - Control Flow",
          description: "Develop programs using control structures and conditionals",
          gameLocation: "Logic Lake Outpost & Loop Canyon Base",
          gameWeeks: "Weeks 5-10", 
          gameActivities: ["Strategic decision programming", "Automated operation systems", "Mission control flow design"]
        },
        {
          standardCode: "4-6.CT.10",
          standardTitle: "Computational Thinking - Data Organization",
          description: "Organize data using appropriate structures and formats",
          gameLocation: "Array Mountains Facility & Database Depths",
          gameWeeks: "Weeks 14-18",
          gameActivities: ["Agent data management systems", "Intelligence database design", "Final project data integration"]
        }
      ]
    },
    {
      stateName: "Florida", 
      stateCode: "FL",
      standardsBody: "Florida Standards for Career and Technical Education - Information Technology",
      website: "https://www.fldoe.org/academics/career-adult-edu/career-tech-edu/",
      mappings: [
        {
          standardCode: "CTS.03.01",
          standardTitle: "Programming Fundamentals",
          description: "Demonstrate programming fundamentals including variables and data types",
          gameLocation: "Binary Shores Academy & Variable Village",
          gameWeeks: "Weeks 1-4",
          gameActivities: ["Python fundamentals for agent operations", "Data type mastery for intelligence work", "Variable management in tactical scenarios"]
        },
        {
          standardCode: "CTS.03.02", 
          standardTitle: "Control Structures",
          description: "Implement control structures including conditionals and loops",
          gameLocation: "Logic Lake Outpost & Loop Canyon Base",
          gameWeeks: "Weeks 5-10",
          gameActivities: ["Strategic decision programming", "Automated surveillance loops", "Complex operation control flows"]
        },
        {
          standardCode: "CTS.03.03",
          standardTitle: "Functions and Procedures",
          description: "Design and implement functions and procedures",
          gameLocation: "Function Forest Station",
          gameWeeks: "Weeks 11-13",
          gameActivities: ["Modular agent tool development", "Operation parameter management", "Reusable code systems"]
        },
        {
          standardCode: "CTS.03.04",
          standardTitle: "Data Structures and File Handling",
          description: "Utilize data structures and file operations effectively",
          gameLocation: "Array Mountains Facility & Database Depths",
          gameWeeks: "Weeks 14-18",
          gameActivities: ["Advanced data organization", "Intelligence file management", "Database integration projects"]
        }
      ]
    }
  ]
}

// ================ POPUP COMPONENT ================

interface StandardsCompliancePopupProps {
  curriculum?: GameCurriculum
  isOpen: boolean
  onClose: () => void
}

export default function StandardsCompliancePopup({ 
  curriculum = AGENT_ACADEMY_CURRICULUM, 
  isOpen, 
  onClose 
}: StandardsCompliancePopupProps) {
  const [selectedState, setSelectedState] = useState<string>('')
  
  if (!isOpen) return null

  const selectedStateData = curriculum.stateCompliance.find(state => state.stateCode === selectedState)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-2 border-blue-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Standards Compliance</h2>
                <p className="text-blue-100 text-sm">{curriculum.gameName} • {curriculum.totalWeeks} Week Curriculum</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* STATE SELECTOR */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Select Your State:</label>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose a state to see standards alignment...</option>
              {curriculum.stateCompliance.map(state => (
                <option key={state.stateCode} value={state.stateCode}>
                  {state.stateName}
                </option>
              ))}
            </select>
          </div>

          {/* GAME OVERVIEW */}
          <div className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-2">{curriculum.gameName} Overview</h3>
            <p className="text-slate-300 text-sm mb-3">{curriculum.gameDescription}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="w-4 h-4" />
                <span>{curriculum.totalWeeks} weeks total</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Target className="w-4 h-4" />
                <span>{curriculum.stateCompliance.length} states supported</span>
              </div>
            </div>
          </div>

          {/* STATE-SPECIFIC STANDARDS */}
          {selectedStateData ? (
            <div className="space-y-6">
              
              {/* STATE INFO */}
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-white font-bold">{selectedStateData.stateName} Standards</h3>
                    <p className="text-green-100 text-sm">{selectedStateData.standardsBody}</p>
                  </div>
                </div>
                <a 
                  href={selectedStateData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  View Official Standards Documentation →
                </a>
              </div>

              {/* STANDARDS MAPPINGS */}
              <div className="space-y-4">
                <h4 className="text-white font-bold text-lg">How {curriculum.gameName} Meets {selectedStateData.stateName} Standards:</h4>
                
                {selectedStateData.mappings.map((mapping, index) => (
                  <div key={index} className="bg-slate-800/70 rounded-lg border border-slate-600 overflow-hidden">
                    
                    {/* STANDARD HEADER */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 border-b border-slate-600">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-mono">
                              {mapping.standardCode}
                            </div>
                            <h5 className="text-white font-semibold">{mapping.standardTitle}</h5>
                          </div>
                          <p className="text-slate-300 text-sm">{mapping.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* GAME IMPLEMENTATION */}
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        
                        {/* LOCATION & TIMING */}
                        <div>
                          <h6 className="text-blue-400 font-semibold mb-2">Game Implementation</h6>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-slate-300"><strong>Location:</strong> {mapping.gameLocation}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-slate-300"><strong>Timeline:</strong> {mapping.gameWeeks}</span>
                            </div>
                          </div>
                        </div>

                        {/* ACTIVITIES */}
                        <div>
                          <h6 className="text-green-400 font-semibold mb-2">Learning Activities</h6>
                          <ul className="space-y-1">
                            {mapping.gameActivities.map((activity, actIndex) => (
                              <li key={actIndex} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* COMPLIANCE SUMMARY */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h4 className="text-white font-bold">Compliance Verified</h4>
                </div>
                <p className="text-green-100 text-sm">
                  {curriculum.gameName} meets <strong>{selectedStateData.mappings.length} key standards</strong> from 
                  {' '}{selectedStateData.stateName}'s {selectedStateData.standardsBody}. 
                  All learning objectives are integrated into engaging game activities that provide 
                  hands-on experience with programming concepts.
                </p>
              </div>
            </div>
          ) : (
            /* PLACEHOLDER CONTENT */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Select a State to View Standards</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Choose your state from the dropdown above to see exactly how {curriculum.gameName} 
                aligns with your local education standards and requirements.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-400">
              Need help with implementation? Contact our education team.
            </div>
            <button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}