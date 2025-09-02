import Link from 'next/link'
import { ChevronRight, Star, Users, TrendingUp, Clock, Play, BookOpen, Trophy, Rocket, Sparkles, Shield, Award, Target, Code, Lightbulb, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Floating decorative elements */}
          <div className="absolute -top-10 left-1/4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"></div>
          <div className="absolute -top-5 right-1/4 w-16 h-16 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full opacity-20 animate-float-delay"></div>
          
          {/* Spinning sparkles around rocket */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 animate-spin-slow">
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-6 h-6 text-purple-400 animate-pulse" />
              <Sparkles className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-6 h-6 text-blue-400 animate-pulse" />
              <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-6 h-6 text-pink-400 animate-pulse" />
            </div>
            <div className="text-8xl animate-float">🚀</div>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
              CodeFly ✈️
            </span>
            <br />
            <span className="text-3xl sm:text-5xl text-gray-300">
              Where Coding Takes Flight!
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-300 mb-8">
            Transform your classroom with our gamified coding curriculum. Students embark on epic adventures through interactive lessons, 3D worlds, and AI-powered learning experiences.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-gray-400">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <Users className="w-4 h-4 text-blue-400" />
              <span>127+ Schools</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>94% Completion</span>
            </div>
            <div className="animate-bounce bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              #1 in K-12
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 font-medium text-white shadow-xl transition duration-300 ease-out hover:scale-105 hover:shadow-purple-500/25"
            >
              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
              <Play className="mr-2 h-5 w-5" />
              <span className="relative">Start Your Adventure 🎆</span>
            </Link>
            <Link
              href="/auth"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl border-2 border-white/20 px-8 font-medium text-white shadow-xl transition duration-300 ease-out hover:scale-105 hover:border-white/40 backdrop-blur-sm"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              <span className="relative">Try Demo Account ⚡</span>
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Proven Results That Speak Volumes</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Join thousands of educators who have transformed their classrooms with CodeFly</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:animate-pulse">94%</div>
              <div className="text-gray-300 font-medium mb-1">Completion Rate</div>
              <div className="text-sm text-gray-500">Students finish their coding journey</div>
              <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:shadow-lg group-hover:shadow-blue-500/50"></div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:animate-pulse">127+</div>
              <div className="text-gray-300 font-medium mb-1">Schools</div>
              <div className="text-sm text-gray-500">Trust CodeFly nationwide</div>
              <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:shadow-lg group-hover:shadow-green-500/50"></div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:animate-pulse">50K+</div>
              <div className="text-gray-300 font-medium mb-1">Students</div>
              <div className="text-sm text-gray-500">Learning to code with us</div>
              <div className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:shadow-lg group-hover:shadow-purple-500/50"></div>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="text-4xl font-bold text-orange-400 mb-2 group-hover:animate-pulse">10hrs</div>
              <div className="text-gray-300 font-medium mb-1">Time Saved</div>
              <div className="text-sm text-gray-500">Per week for teachers</div>
              <div className="mt-4 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full group-hover:shadow-lg group-hover:shadow-orange-500/50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Educators Are Saying</h2>
            <p className="text-gray-400">Real feedback from real classrooms</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">MS</div>
                <div className="ml-4">
                  <div className="font-medium text-white">Ms. Sarah</div>
                  <div className="text-sm text-gray-400">High School Teacher</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic">"My students are obsessed! The 3D adventure map makes coding feel like a video game. Engagement is through the roof!"</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">AK</div>
                <div className="ml-4">
                  <div className="font-medium text-white">Alex K.</div>
                  <div className="text-sm text-gray-400">9th Grade Student</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic">"I used to hate programming class, but now I actually look forward to it! The quests and XP system make me want to keep learning."</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">DR</div>
                <div className="ml-4">
                  <div className="font-medium text-white">Dr. Rodriguez</div>
                  <div className="text-sm text-gray-400">Principal</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic">"CodeFly transformed our CS program. Test scores up 40%, and parents are asking how their kids got so excited about coding!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How CodeFly Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get your classroom coding in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Setup</h3>
              <p className="text-gray-400">Sign up, create your classroom, and invite students. Takes less than 10 minutes to get started.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Students Explore</h3>
              <p className="text-gray-400">Students embark on coding quests through our 3D world, earning XP and unlocking new adventures.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Track Progress</h3>
              <p className="text-gray-400">Monitor student progress with real-time analytics and automated grading that saves you hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 lg:px-8 py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Classroom?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who've discovered the magic of gamified coding education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-10 font-medium text-white shadow-2xl transition duration-300 ease-out hover:scale-105 hover:shadow-purple-500/25"
            >
              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>
              <Rocket className="mr-3 h-6 w-6" />
              <span className="relative text-lg">Take Flight! 🚀</span>
            </Link>
            <Link
              href="/auth" 
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl border-2 border-white/20 px-10 font-medium text-white shadow-2xl transition duration-300 ease-out hover:scale-105 hover:border-white/40 backdrop-blur-sm"
            >
              <Trophy className="mr-3 h-6 w-6" />
              <span className="relative text-lg">Free Trial ✨</span>
            </Link>
          </div>
          
          <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>30-Day Trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Full Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}