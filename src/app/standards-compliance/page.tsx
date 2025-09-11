'use client'

import { 
  Shield, CheckCircle, Award, BookOpen, GraduationCap, 
  Globe, Brain, Calculator, Microscope, Music, Palette,
  Users, Target, Star, Trophy, Zap, ArrowRight, Code2 as Code, Rocket
} from 'lucide-react'
import Link from 'next/link'
import EducationalNavigation from '@/components/EducationalNavigation'

export default function StandardsCompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-900">
      <EducationalNavigation />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <Shield className="h-24 w-24 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">
            CSTA Standards Alignment Documentation
          </h1>
          <p className="text-2xl mb-8 max-w-5xl mx-auto">
            CodeFly curriculum is designed to align with <strong>CSTA K-12 Computer Science Standards</strong> 
            with documented mapping showing how each lesson meets specific learning objectives.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">3A/3B</div>
              <div className="text-sm">CSTA Levels</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm">Standards Mapped</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">18</div>
              <div className="text-sm">Weeks Coverage</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">Grade 9</div>
              <div className="text-sm">Target Level</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* CSTA Standards Documentation */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            CSTA K-12 Computer Science Standards Alignment
          </h2>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">Important Note</h3>
                <p className="mt-2 text-sm text-yellow-700">
                  CodeFly curriculum is designed to align with CSTA standards. This documentation shows our intended alignment. 
                  Schools should verify compliance with their specific state and district requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Level 3A Standards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <Code className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-bold">CSTA Level 3A (Grades 9-10)</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-bold text-purple-800">3A-AP-13: Create prototypes</div>
                  <div className="text-gray-700 mt-1">Covered in: Cipher Decoder project (Week 1), Intelligence Quiz (Week 3)</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-bold text-purple-800">3A-AP-14: Use variables and data</div>
                  <div className="text-gray-700 mt-1">Covered in: String formatting (Week 2), Lists (Week 5)</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-bold text-purple-800">3A-AP-15: Control structures</div>
                  <div className="text-gray-700 mt-1">Covered in: Logic and conditionals (Week 3), Loops (Week 4)</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-bold text-purple-800">3A-AP-17: Decompose problems</div>
                  <div className="text-gray-700 mt-1">Covered in: Functions (Week 6), Web development projects (Weeks 7-9)</div>
                </div>
              </div>
            </div>

            {/* Level 3B Standards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold">CSTA Level 3B (Grades 9-12)</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-bold text-blue-800">3B-AP-08: Describe AI in software</div>
                  <div className="text-gray-700 mt-1">Covered in: AI vocabulary tool project, machine learning concepts</div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-bold text-blue-800">3B-AP-09: Implement AI algorithms</div>
                  <div className="text-gray-700 mt-1">Covered in: Simple recommendation systems, pattern recognition</div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-bold text-blue-800">3B-AP-14: Construct solutions</div>
                  <div className="text-gray-700 mt-1">Covered in: Team projects (Weeks 13-18), portfolio development</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Curriculum Mapping */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            18-Week Curriculum: Standards Mapping
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-4xl mx-auto">
            Each week of our curriculum is designed to address specific CSTA standards through 
            hands-on projects and interactive learning.
          </p>

          {/* Phase 1: Python Foundation */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mr-4">Weeks 1-6</span>
              Python Programming Foundation
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Week 1-2 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 1-2: Cipher Decoder & String Formatting</h4>
                  <p className="text-lg">First Python Programs</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students create their first interactive Python program using variables, 
                    user input, and random selection to build a cipher decoder application.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-blue-800 mb-2">CSTA Standards Addressed:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span><strong>3A-AP-13:</strong> Create prototypes that use algorithms</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span><strong>3A-AP-14:</strong> Use variables to store and modify data</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-bold text-green-800 mb-2">Learning Evidence:</h5>
                    <p className="text-sm text-gray-700">
                      Students demonstrate understanding by modifying program logic, 
                      customizing responses, and explaining variable usage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Week 3-4 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 3-4: Logic & Loops</h4>
                  <p className="text-lg">Decision Making & Repetition</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students learn conditional logic through quiz applications and master 
                    loops through interactive games and automated tasks.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-green-800 mb-2">CSTA Standards Addressed:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span><strong>3A-AP-15:</strong> Justify the selection of control structures</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span><strong>3A-AP-16:</strong> Design programs using iterative development</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-bold text-purple-800 mb-2">Assessment Evidence:</h5>
                    <p className="text-sm text-gray-700">
                      Students create flowcharts, debug logical errors, 
                      and optimize loop efficiency in their programs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Week 5-6 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 5-6: Lists & Functions</h4>
                  <p className="text-lg">Data Organization & Code Reusability</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students learn to organize data using lists and create reusable functions 
                    to solve complex problems efficiently.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-purple-800 mb-2">CSTA Standards Addressed:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span><strong>3A-AP-14:</strong> Use lists and other collections to store data</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span><strong>3A-AP-17:</strong> Decompose problems into smaller tasks</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-bold text-orange-800 mb-2">Project Examples:</h5>
                    <p className="text-sm text-gray-700">
                      Contact list manager, grade calculator, simple AI vocabulary tool 
                      demonstrating function parameters and return values.
                    </p>
                  </div>
                </div>
              </div>

              {/* Assessment & Documentation */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Phase 1 Assessment</h4>
                  <p className="text-lg">Standards Mastery Evidence</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students demonstrate mastery through portfolio projects, 
                    peer code review, and reflective programming journals.
                  </p>
                  <div className="bg-orange-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-orange-800 mb-2">Evidence Collection:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        <span>Working Python programs with documentation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        <span>Problem-solving process documentation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-bold text-blue-800 mb-2">Rubric Alignment:</h5>
                    <p className="text-sm text-gray-700">
                      Assessment rubrics map directly to CSTA standards, 
                      providing clear evidence of student progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Web Development */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg mr-4">Weeks 7-12</span>
              Web Development & Digital Media
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Web Fundamentals */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 7-9: HTML, CSS & JavaScript</h4>
                  <p className="text-lg">Web Development Foundations</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students learn web technologies by creating interactive websites, 
                    connecting front-end design with programming logic.
                  </p>
                  <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-indigo-800 mb-2">CSTA Standards Addressed:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span><strong>3B-AP-14:</strong> Construct solutions using components from multiple sources</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span><strong>3A-AP-17:</strong> Decompose problems into smaller, manageable tasks</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h5 className="font-bold text-yellow-800 mb-2">Project Outcomes:</h5>
                    <p className="text-sm text-gray-700">
                      Students create personal portfolio websites, demonstrating 
                      HTML structure, CSS styling, and JavaScript interactivity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital Media */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 10-12: Digital Media & Design</h4>
                  <p className="text-lg">Creative Technology Projects</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students integrate programming skills with digital media creation, 
                    building interactive multimedia projects.
                  </p>
                  <div className="bg-teal-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-teal-800 mb-2">CSTA Standards Addressed:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-teal-600 mr-2">•</span>
                        <span><strong>3B-AP-08:</strong> Describe how artificial intelligence drives applications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-teal-600 mr-2">•</span>
                        <span><strong>3A-AP-16:</strong> Design programs incorporating learned concepts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h5 className="font-bold text-red-800 mb-2">Creative Integration:</h5>
                    <p className="text-sm text-gray-700">
                      Students combine programming, design thinking, and digital creativity 
                      to solve real-world communication challenges.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Phase 3: Final Projects */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mr-4">Weeks 13-18</span>
              Capstone Projects & Portfolio Development
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Team Projects */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 13-16: Collaborative Projects</h4>
                  <p className="text-lg">Real-World Problem Solving</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students work in teams to create solutions for authentic problems, 
                    integrating all skills learned throughout the semester.
                  </p>
                  <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-red-800 mb-2">CSTA Standards Addressed:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>3B-AP-14:</strong> Construct solutions using multiple components</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span><strong>3B-AP-15:</strong> Analyze large-scale computational problems</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-bold text-orange-800 mb-2">Project Examples:</h5>
                    <p className="text-sm text-gray-700">
                      School website improvements, educational apps for younger students, 
                      community resource databases, environmental data visualization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio & Reflection */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
                  <h4 className="text-2xl font-bold mb-2">Weeks 17-18: Portfolio & Presentation</h4>
                  <p className="text-lg">Reflection & Future Planning</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Students compile their work into professional portfolios and 
                    reflect on their growth as technology creators.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-purple-800 mb-2">Standards Evidence:</h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>Complete project documentation showing iterative development</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>Reflection essays connecting learning to CSTA standards</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h5 className="font-bold text-indigo-800 mb-2">Assessment Portfolio:</h5>
                    <p className="text-sm text-gray-700">
                      Students present final projects to authentic audience, 
                      demonstrating mastery of computational thinking and programming skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How We Meet All States' Requirements */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            CSTA Standards Alignment for National Compatibility
          </h2>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <Globe className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Built on CSTA Standards Foundation</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Our Agent Academy curriculum is designed to align with CSTA K-12 Computer Science Standards, 
                which nearly all U.S. states have adopted or adapted for their computer science requirements.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-blue-800 mb-4">How States Use CSTA Standards</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Direct Adoption:</strong> Many states use CSTA standards verbatim</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>State Adaptations:</strong> States modify CSTA to fit local needs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Grade Band Flexibility:</strong> States adjust grade levels while keeping core concepts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Graduation Credit:</strong> Most states accept CSTA-aligned courses for credit</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-green-800 mb-4">CodeFly's Alignment Strategy</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Core CSTA Alignment:</strong> Curriculum maps to CSTA 3A and 3B standards</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Computational Thinking:</strong> Emphasis on problem decomposition and abstraction</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Programming Fundamentals:</strong> Python and web development skills</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span><strong>Portfolio Evidence:</strong> Student work demonstrates standards mastery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">State-by-State Compatibility Guide</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">Direct CSTA Adopters</h4>
                <p className="text-sm text-green-700 mb-3">States using CSTA standards directly</p>
                <div className="text-2xl font-bold text-green-600">Nearly All</div>
                <p className="text-xs text-green-600 mt-1">States with CSTA-based standards</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">CS Graduation Requirement</h4>
                <p className="text-sm text-blue-700 mb-3">States mandating CS for graduation</p>
                <div className="text-2xl font-bold text-blue-600">11 States</div>
                <p className="text-xs text-blue-600 mt-1">AL, AR, IN, LA, NE, NV, NC, ND, RI, SC, TN</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">High Schools Offer CS</h4>
                <p className="text-sm text-purple-700 mb-3">Schools with CS courses available</p>
                <div className="text-2xl font-bold text-purple-600">82% Nationwide</div>
                <p className="text-xs text-purple-600 mt-1">According to 2024 State of CS report</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-amber-800">School Implementation Guide</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p className="mb-3">
                      <strong>For administrators:</strong> We recommend confirming CodeFly's alignment 
                      with your specific state and district requirements. Our curriculum documentation 
                      includes:
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Detailed standards mapping for each lesson</li>
                      <li>• Assessment rubrics aligned to learning objectives</li>
                      <li>• Student portfolio requirements and examples</li>
                      <li>• Evidence of computational thinking development</li>
                      <li>• Documentation templates for state reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standards Documentation */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Detailed Standards Documentation
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">How We Document Standards Alignment</h3>
              <p className="text-blue-700 mb-3">
                Each lesson includes explicit mapping to CSTA standards with evidence of student learning. 
                Our documentation approach:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">•</span>
                  <span><strong>Learning Objective:</strong> Clear statement of what students will know and be able to do</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">•</span>
                  <span><strong>CSTA Standard:</strong> Specific standard code and description</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">•</span>
                  <span><strong>Assessment Evidence:</strong> How student mastery is demonstrated and measured</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">•</span>
                  <span><strong>Project Artifacts:</strong> Student work samples showing standards mastery</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-3">State Requirements</h3>
              <p className="text-amber-700">
                While our curriculum aligns with CSTA standards widely used across states, 
                <strong> schools should verify compliance with their specific state and local requirements</strong>. 
                We provide detailed documentation to help administrators demonstrate how our curriculum 
                meets their jurisdiction's computer science education standards.
              </p>
            </div>
          </div>
        </div>

        {/* Available Resources */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Supporting Documentation Available
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Curriculum Mapping</h3>
              <p className="text-gray-600 text-sm mb-4">
                Week-by-week breakdown showing intended CSTA standards alignment for each lesson.
              </p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                View Sample Mapping →
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Assessment Rubrics</h3>
              <p className="text-gray-600 text-sm mb-4">
                Rubrics aligned to standards help teachers assess student progress and mastery.
              </p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Download Rubrics →
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Learning Objectives</h3>
              <p className="text-gray-600 text-sm mb-4">
                Clear learning objectives for each week connected to computational thinking skills.
              </p>
              <button className="text-blue-600 font-medium hover:text-blue-800">
                View Objectives →
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-12">
          <Shield className="h-24 w-24 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Standards-Aligned Curriculum. Engaging Learning.
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            CodeFly curriculum is designed to align with CSTA K-12 Computer Science Standards 
            while keeping students engaged through hands-on projects and interactive learning.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/course-overview"
              className="inline-flex items-center space-x-2 bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="w-6 h-6" />
              <span>View Full Curriculum</span>
            </Link>
            <Link 
              href="/auth?role=teacher"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="w-6 h-6" />
              <span>Try CodeFly</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}