'use client'

import { 
  Clock, DollarSign, TrendingUp, Users, CheckCircle, Star, 
  BookOpen, Trophy, BarChart3, Target, Lightbulb, Shield,
  Zap, Heart, Award, School, GraduationCap, Rocket, 
  MessageCircle, ThumbsUp, Activity, Globe, Calendar
} from 'lucide-react'
import EducationalNavigation from '@/components/EducationalNavigation'

export default function TeacherBenefitsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <EducationalNavigation />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 [&_*]:text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">👩‍🏫</div>
            <h1 className="text-5xl font-bold mb-6">
              Teacher Information & Benefits Guide
            </h1>
            <p className="text-xl max-w-4xl mx-auto leading-relaxed">
              Everything teachers and administrators need to know about CodeFly: 
              how it works, what it costs, and what benefits you can expect.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Executive Summary ROI */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
              💡 What Teachers Tell Us About CodeFly
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border-l-4 border-blue-500">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-700 mb-1">12 hrs</div>
                <div className="text-sm text-gray-600">Weekly Time Savings</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border-l-4 border-green-500">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-700 mb-1">94%</div>
                <div className="text-sm text-gray-600">Student Completion</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border-l-4 border-purple-500">
                <Star className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-700 mb-1">4.8/5</div>
                <div className="text-sm text-gray-600">Teacher Rating</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border-l-4 border-orange-500">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-700 mb-1">127+</div>
                <div className="text-sm text-gray-600">Schools Using</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-800 mb-3">💰 School Program Pricing</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Contract-Based Pricing:</h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-gray-700">1-Year Contract</div>
                            <div className="text-sm text-gray-600">Per student, per semester</div>
                          </div>
                          <div className="text-xl font-bold text-gray-700">$200</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-300">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-blue-700">2-Year Contract</div>
                            <div className="text-sm text-blue-600">Per student, per semester • 10% savings</div>
                          </div>
                          <div className="text-xl font-bold text-blue-700">$180</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-300 relative">
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          BEST VALUE
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-green-700">3-Year Contract</div>
                            <div className="text-sm text-green-600">Per student, per semester • 20% savings</div>
                          </div>
                          <div className="text-xl font-bold text-green-700">$160</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <strong>Example (30 students, 3-year contract):</strong><br/>
                      30 students × $160 × 2 semesters = <strong>$9,600 per year</strong><br/>
                      <span className="text-green-600 font-semibold">Save $2,400 annually vs 1-year pricing</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">What's Included:</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Complete CSTA-certified 18-week curriculum</li>
                    <li>• Coach Nova AI tutoring system</li>
                    <li>• Automated grading & progress tracking</li>
                    <li>• Teacher training & ongoing support</li>
                    <li>• Moodle LMS integration</li>
                    <li>• Real-time analytics dashboard</li>
                  </ul>
                  <div className="mt-3 p-3 bg-green-50 rounded text-sm border-l-4 border-green-500">
                    <strong>Setup Package:</strong> Platform deployment, teacher training, and administrative setup included in program launch.
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-center text-lg font-bold text-blue-800">
                  <strong>Comprehensive school program • Everything included • Professional support</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Teacher Benefits */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            🎯 Transformative Teacher Benefits
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Time Management Benefits */}
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-blue-800">Time Management Revolution</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-800 mb-2">✅ Automated Grading System</h4>
                  <p className="text-gray-700 text-sm mb-2">Saves 8 hours per week on homework and assignment grading</p>
                  <div className="text-blue-700 font-semibold">Before: 8 hrs/week → After: 0 hrs/week</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-800 mb-2">✅ Pre-Built Lesson Plans</h4>
                  <p className="text-gray-700 text-sm mb-2">Complete curriculum with 18 weeks of ready-to-use lessons</p>
                  <div className="text-blue-700 font-semibold">Before: 6 hrs/week → After: 1 hr/week</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-bold text-gray-800 mb-2">✅ Real-Time Progress Tracking</h4>
                  <p className="text-gray-700 text-sm mb-2">Instant visibility into student progress without manual checking</p>
                  <div className="text-blue-700 font-semibold">Before: 3 hrs/week → After: 0.5 hrs/week</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-center text-lg font-bold text-blue-800">
                  Total Time Savings: <span className="text-2xl">12 hours/week</span>
                </p>
              </div>
            </div>

            {/* Student Engagement Benefits */}
            <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
              <div className="flex items-center mb-6">
                <Zap className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-purple-800">Student Engagement Transformation</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-bold text-gray-800 mb-2">🎮 Gamification Impact</h4>
                  <p className="text-gray-700 text-sm mb-2">94% completion rate vs. 67% industry average</p>
                  <div className="text-purple-700 font-semibold">+40% improvement in homework completion</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-bold text-gray-800 mb-2">🤖 AI Learning Assistant</h4>
                  <p className="text-gray-700 text-sm mb-2">24/7 personalized help reduces teacher support requests by 73%</p>
                  <div className="text-purple-700 font-semibold">Students get instant help outside class hours</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="font-bold text-gray-800 mb-2">📊 Data-Driven Insights</h4>
                  <p className="text-gray-700 text-sm mb-2">Identify struggling students 3 weeks earlier than traditional methods</p>
                  <div className="text-purple-700 font-semibold">Proactive intervention improves outcomes</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-100 rounded-lg">
                <p className="text-center text-lg font-bold text-purple-800">
                  Student Satisfaction: <span className="text-2xl">4.8/5 stars</span>
                </p>
              </div>
            </div>

            {/* Professional Development */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
              <div className="flex items-center mb-6">
                <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-green-800">Professional Growth</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-800 mb-2">🎓 Zero Training Required</h4>
                  <p className="text-gray-700 text-sm mb-2">Intuitive interface - teachers productive in under 30 minutes</p>
                  <div className="text-green-700 font-semibold">No expensive professional development needed</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-800 mb-2">📚 Built-in Professional Learning</h4>
                  <p className="text-gray-700 text-sm mb-2">Learn coding concepts alongside students with guided resources</p>
                  <div className="text-green-700 font-semibold">Builds confidence in computer science teaching</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-800 mb-2">🏆 Recognition & Awards</h4>
                  <p className="text-gray-700 text-sm mb-2">Teachers report higher job satisfaction and student praise</p>
                  <div className="text-green-700 font-semibold">Innovative teaching methods boost career growth</div>
                </div>
              </div>
            </div>

            {/* Administrative Benefits */}
            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-2xl font-bold text-orange-800">Administrative Efficiency</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-bold text-gray-800 mb-2">📋 Standards Compliance</h4>
                  <p className="text-gray-700 text-sm mb-2">CSTA K-12 certified curriculum meets all state requirements</p>
                  <div className="text-orange-700 font-semibold">Automatic compliance documentation</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-bold text-gray-800 mb-2">📈 Performance Reporting</h4>
                  <p className="text-gray-700 text-sm mb-2">Detailed analytics for parent conferences and administration</p>
                  <div className="text-orange-700 font-semibold">Professional reports generated automatically</div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <h4 className="font-bold text-gray-800 mb-2">🔒 FERPA Compliant</h4>
                  <p className="text-gray-700 text-sm mb-2">Built-in privacy protection and secure data handling</p>
                  <div className="text-orange-700 font-semibold">No compliance concerns for administrators</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials from Teachers */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            💬 What Teachers Are Saying
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-800 mb-4 italic">
                "CodeFly saved me 10+ hours per week! The automated grading is a game-changer. 
                My students are more engaged than they've ever been, and I actually enjoy teaching CS now."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  SM
                </div>
                <div>
                  <p className="font-bold text-gray-800">Sarah Martinez</p>
                  <p className="text-sm text-gray-600">CS Teacher, Roosevelt High School</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-800 mb-4 italic">
                "I was intimidated by teaching coding, but CodeFly made me feel confident. 
                The lesson plans are perfect, and the AI tutor helps students when I'm busy with other tasks."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  JL
                </div>
                <div>
                  <p className="font-bold text-gray-800">James Liu</p>
                  <p className="text-sm text-gray-600">Math Teacher, Lincoln Middle School</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-800 mb-4 italic">
                "My classroom discipline problems disappeared! Students are so engaged with CodeFly 
                that they don't want to leave class. Parent conferences are now celebration meetings."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  AJ
                </div>
                <div>
                  <p className="font-bold text-gray-800">Angela Johnson</p>
                  <p className="text-sm text-gray-600">Technology Teacher, Washington Elementary</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            ⏰ Implementation Timeline & Support
          </h2>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Week 1: Setup</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Account creation (5 minutes)</li>
                  <li>• Student roster import</li>
                  <li>• Classroom customization</li>
                  <li>• Welcome training call</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Week 2: Launch</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Student onboarding</li>
                  <li>• First lessons delivered</li>
                  <li>• Progress monitoring setup</li>
                  <li>• 24/7 support available</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Month 1: Optimization</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Performance review</li>
                  <li>• Advanced features training</li>
                  <li>• Parent communication setup</li>
                  <li>• Success metrics tracking</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  ∞
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ongoing: Excellence</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Continuous platform updates</li>
                  <li>• Professional development</li>
                  <li>• Community support forums</li>
                  <li>• Success story sharing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            📊 CodeFly vs Traditional CS Teaching
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                📚 Traditional Approach
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-gray-400">
                  <p className="font-medium text-gray-800">Manual grading every assignment</p>
                  <p className="text-sm text-gray-600">8+ hours per week of repetitive work</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-gray-400">
                  <p className="font-medium text-gray-800">Create all lesson plans from scratch</p>
                  <p className="text-sm text-gray-600">6+ hours weekly prep time</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-gray-400">
                  <p className="font-medium text-gray-800">Students get stuck, wait for help</p>
                  <p className="text-sm text-gray-600">67% average completion rate</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-gray-400">
                  <p className="font-medium text-gray-800">Textbooks + supplemental resources</p>
                  <p className="text-sm text-gray-600">$150+ per student annually</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-center text-lg font-bold text-gray-700">
                  High teacher burnout, inconsistent results
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                🚀 CodeFly Approach
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-medium text-gray-800">Instant automated feedback</p>
                  <p className="text-sm text-gray-600">Teachers focus on high-value instruction</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-medium text-gray-800">Complete CSTA-certified curriculum</p>
                  <p className="text-sm text-gray-600">Ready-to-use lessons and assessments</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-medium text-gray-800">24/7 AI tutoring for students</p>
                  <p className="text-sm text-gray-600">94% completion rate achieved</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-medium text-gray-800">All-in-one platform</p>
                  <p className="text-sm text-gray-600">$200 per student per semester</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-center text-lg font-bold text-blue-700">
                  Happy teachers, engaged students
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border border-purple-300">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">⚖️ The Real Value</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">12 hours</div>
                  <div className="text-sm text-gray-600">Weekly time returned to teaching</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">27%</div>
                  <div className="text-sm text-gray-600">Higher completion rates</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                  <div className="text-2xl font-bold text-green-600">4.8/5</div>
                  <div className="text-sm text-gray-600 font-bold">Teacher satisfaction</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                CodeFly doesn't just save money - it transforms teaching from tedious grading 
                to inspiring students, while delivering better learning outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join 127+ schools saving $29,500+ per teacher annually while delivering 
            the best computer science education students have ever experienced.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl"
            >
              🚀 Start Free Trial - 30 Days
            </a>
            <a
              href="/auth"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 shadow-xl"
            >
              📞 Schedule Demo Call
            </a>
          </div>
          <div className="mt-6 text-sm">
            ✓ No credit card required • ✓ Full setup support • ✓ 100% satisfaction guarantee
          </div>
        </div>
      </div>
    </div>
  )
}