'use client'

import { Brain, Code, Globe, Palette, Rocket, Target, Calendar, Users, Award, BookOpen } from 'lucide-react'

export default function CourseOverviewOnePager() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CodeFly ✈️ - Intro to Coding, AI & Digital Media
          </h1>
          <p className="text-xl text-gray-600 mb-4">9th Grade • 18-Week Semester Course</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <p className="font-medium text-blue-800">18 Weeks</p>
              <p className="text-sm text-blue-600">Full Semester</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <p className="font-medium text-green-800">Grade 9</p>
              <p className="text-sm text-green-600">Ages 14-15</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Award className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <p className="font-medium text-purple-800">FL Standards</p>
              <p className="text-sm text-purple-600">CPALMS Aligned</p>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
            Course Description
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            An engaging introduction to programming, artificial intelligence, and digital media creation. Students learn Python fundamentals through hands-on projects including AI vocabulary tools, Magic 8-Ball apps, interactive games, and personal websites. The course emphasizes creative problem-solving, real-world applications, and preparing students to be confident technology creators in our digital world.
          </p>
        </div>

        {/* Learning Outcomes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Students Will Master</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Programming Skills */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Python Programming Skills
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Variables, data types, and user input/output</li>
                <li>• Conditional logic (if/else statements)</li>
                <li>• Loops and iteration patterns</li>
                <li>• Lists, randomness, and data structures</li>
                <li>• Functions and code organization</li>
                <li>• Problem-solving with algorithmic thinking</li>
              </ul>
            </div>

            {/* AI & Technology */}
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI & Machine Learning
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• How AI image classifiers work</li>
                <li>• API integration and data fetching</li>
                <li>• Pattern recognition principles</li>
                <li>• Machine learning vocabulary and concepts</li>
                <li>• Ethics in AI and responsible technology use</li>
                <li>• Emerging technology awareness</li>
              </ul>
            </div>

            {/* Web Development */}
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Web Development
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• HTML structure and semantic elements</li>
                <li>• CSS styling and responsive design</li>
                <li>• JavaScript basics and interactivity</li>
                <li>• Building personal websites and portfolios</li>
                <li>• API integration for dynamic content</li>
                <li>• Publishing and sharing projects online</li>
              </ul>
            </div>

            {/* Digital Media & Creative Skills */}
            <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
              <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Digital Media & Design
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Digital image editing and manipulation</li>
                <li>• Animation principles and creation</li>
                <li>• Visual design and user interface concepts</li>
                <li>• Creative problem-solving with technology</li>
                <li>• Combining AI tools with creative projects</li>
                <li>• Digital storytelling and presentation skills</li>
              </ul>
            </div>

            {/* Professional Skills */}
            <div className="bg-cyan-50 rounded-lg p-6 border-l-4 border-cyan-500">
              <h3 className="text-lg font-bold text-cyan-800 mb-3 flex items-center">
                <Rocket className="h-5 w-5 mr-2" />
                21st Century Skills
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Team collaboration and project management</li>
                <li>• Technical communication and presentation</li>
                <li>• Debugging and problem-solving strategies</li>
                <li>• Digital portfolio creation and curation</li>
                <li>• Critical thinking about technology's impact</li>
                <li>• Self-directed learning and growth mindset</li>
              </ul>
            </div>

            {/* Real-World Applications */}
            <div className="bg-violet-50 rounded-lg p-6 border-l-4 border-violet-500">
              <h3 className="text-lg font-bold text-violet-800 mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Real-World Projects
              </h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Interactive games and entertainment apps</li>
                <li>• AI-powered tools and applications</li>
                <li>• Personal websites and digital presence</li>
                <li>• Team-based mini-applications</li>
                <li>• Public project showcase and presentation</li>
                <li>• Future-ready skills for Grade 10 and beyond</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Structure */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">18-Week Course Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-800 mb-2">Weeks 1-6: Foundation</h3>
              <p className="text-sm text-gray-600">Python basics, AI concepts, interactive projects</p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-green-500">
              <h3 className="font-bold text-green-800 mb-2">Weeks 7-12: Web & Media</h3>
              <p className="text-sm text-gray-600">HTML/CSS/JS, digital media, creative design</p>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-800 mb-2">Weeks 13-18: Application</h3>
              <p className="text-sm text-gray-600">Team projects, presentations, portfolio showcase</p>
            </div>
          </div>
        </div>

        {/* Key Highlight */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Course Philosophy</h2>
          <p className="text-lg text-gray-700 text-center font-medium">
            <span className="text-blue-600 font-bold">Students become creators, not just consumers</span> of technology, developing the confidence and skills to continue learning and building in our digital world.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm border-t pt-4">
          <p>CodeFly Educational Platform • Florida CPALMS Standards Aligned • Interactive Learning Experience</p>
        </div>
      </div>
    </div>
  )
}