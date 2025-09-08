'use client'

import { Brain, Code, Globe, Palette, Rocket, Target, Calendar, Users, Award, BookOpen, ArrowLeft } from 'lucide-react'
import EducationalNavigation from '@/components/EducationalNavigation'
import Link from 'next/link'

export default function AgentAcademyCurriculum() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900">
      <EducationalNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <Link href="/course-overview" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Curriculum Overview
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-6">🕵️</div>
            <h1 className="text-5xl font-bold mb-6">
              Agent Academy: Computer Science Adventure
            </h1>
            <p className="text-2xl mb-8 max-w-5xl mx-auto">
              A comprehensive <strong>18-week coding journey</strong> designed for K-12 students, 
              progressing from Python fundamentals to web development through spy-themed missions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">18</div>
                <div className="text-sm">Weeks</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">K-12</div>
                <div className="text-sm">All Grades</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">4 Missions</div>
                <div className="text-sm">Learning Phases</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">CSTA</div>
                <div className="text-sm">Standards Aligned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Agent Academy Story */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              The Agent Academy Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Students become secret agents learning programming skills through engaging 
              spy-themed missions and coding challenges.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What Agents Create</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Cipher Decoder Tools:</strong> Interactive Python programs for decrypting agent messages and intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Reconnaissance Tools:</strong> Simple machine learning applications for intelligence gathering</span>
                  </li>
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Agent Websites:</strong> HTML, CSS, and JavaScript projects for covert operations</span>
                  </li>
                  <li className="flex items-start">
                    <Rocket className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Mission Portfolios:</strong> Professional showcase of all completed operations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Agent Skills Acquired</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Computational Thinking:</strong> Problem decomposition and algorithmic reasoning</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Python Programming:</strong> Variables, functions, loops, and data structures</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Web Development:</strong> Front-end technologies and responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Agent Confidence:</strong> Technology creation rather than passive consumption</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Four Mission Phases */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Four Mission Phases</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission 1: Binary Academy */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Mission 1: Binary Academy</h3>
                <p className="text-lg">Weeks 1-4: Infiltration Training</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  New agents master Python fundamentals through cipher decoding missions, 
                  intelligence analysis tools, and covert communication systems.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-blue-800 mb-2">Key Training:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Variables and data types for agent intel</li>
                    <li>• Conditional logic for decision making</li>
                    <li>• Loops and iteration for code breaking</li>
                    <li>• Functions and classified protocols</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">Agent Operations:</h4>
                  <p className="text-sm text-gray-700">
                    Cipher Decoders, Intelligence Analysis, Agent Contact Systems, AI Reconnaissance Tools
                  </p>
                </div>
              </div>
            </div>

            {/* Mission 2: Cipher Command */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Mission 2: Cipher Command</h3>
                <p className="text-lg">Weeks 5-8: Advanced Operations</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Agents advance to complex data operations, learning advanced Python concepts 
                  and team coordination protocols.
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-green-800 mb-2">Advanced Training:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Lists and data structures for intel storage</li>
                    <li>• Functions and modular agent protocols</li>
                    <li>• File operations for classified documents</li>
                    <li>• Error handling and mission recovery</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">Field Operations:</h4>
                  <p className="text-sm text-gray-700">
                    Database Infiltration, Advanced Ciphers, Team Communication Systems
                  </p>
                </div>
              </div>
            </div>

            {/* Mission 3: Digital Operations */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Mission 3: Digital Operations</h3>
                <p className="text-lg">Weeks 9-13: Web Operations</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Agents expand into web technologies, creating interactive websites for 
                  covert operations and digital media infiltration.
                </p>
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-purple-800 mb-2">Web Training:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• HTML structure for secure communications</li>
                    <li>• CSS styling for covert web presence</li>
                    <li>• JavaScript for interactive agent tools</li>
                    <li>• Responsive design for all devices</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-2">Digital Missions:</h4>
                  <p className="text-sm text-gray-700">
                    Agent Websites, Interactive Spy Operations, Digital Surveillance Projects
                  </p>
                </div>
              </div>
            </div>

            {/* Mission 4: Quantum Breach */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Mission 4: Quantum Breach</h3>
                <p className="text-lg">Weeks 14-18: Final Operation</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Elite agents collaborate on the final mission to neutralize BLACK CIPHER AI 
                  through advanced programming and professional portfolio development.
                </p>
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-orange-800 mb-2">Elite Training:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Team collaboration and version control</li>
                    <li>• Advanced AI and machine learning concepts</li>
                    <li>• User experience design for agent tools</li>
                    <li>• Professional mission presentations</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-2">Final Operations:</h4>
                  <p className="text-sm text-gray-700">
                    Team AI Applications, Agent Portfolios, BLACK CIPHER Neutralization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Philosophy */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-12 text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-4xl font-bold mb-6">
            Creating Elite Digital Agents
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our mission is simple: <strong>students become agents of change, not just consumers</strong> of technology. 
            Through hands-on spy missions and real-world applications, students develop the confidence 
            and skills to continue their agent training in our digital world.
          </p>
          <div className="bg-white/20 backdrop-blur rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Begin Agent Training?</h3>
            <Link 
              href="/standards-compliance" 
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              View Standards Compliance →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}