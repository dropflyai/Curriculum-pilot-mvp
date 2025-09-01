'use client'

import Link from 'next/link'

// Embed the lesson data directly to avoid import issues
const testLessons = [
  {
    id: 'python-week-1',
    title: 'Welcome to CodeQuest',
    subtitle: 'Your First Interactive Program',
    emoji: '🚀',
    description: 'Begin your coding adventure! Learn Python basics by creating your very first interactive program.',
    week: 1,
    total_xp: 250,
    challenges: [
      { id: 'hello-world-plus', title: 'Hello World Plus+', xp_reward: 25 },
      { id: 'personality-quiz', title: 'Interactive Personality Quiz', xp_reward: 50 },
      { id: 'mad-libs', title: 'Mad Libs Story Generator', xp_reward: 75 }
    ]
  },
  {
    id: 'python-week-2', 
    title: 'Loops & Events',
    subtitle: 'Build an Epic Clicker Game',
    emoji: '🎯',
    description: 'Master the power of loops and events by building an addictive clicker game!',
    week: 2,
    total_xp: 300,
    challenges: [
      { id: 'countdown-timer', title: 'Epic Countdown Timer', xp_reward: 40 },
      { id: 'multiplication-master', title: 'Multiplication Table Master', xp_reward: 50 },
      { id: 'clicker-game', title: 'Cookie Clicker Style Game', xp_reward: 100 }
    ]
  }
]

export default function PythonTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl mb-8">Python Lessons Test</h1>
        
        <div className="space-y-6">
          {testLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{lesson.emoji}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                  <p className="text-purple-200">{lesson.subtitle}</p>
                </div>
              </div>
              
              <p className="text-purple-200 mb-4">{lesson.description}</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-600/20 rounded-lg p-4">
                  <div className="text-yellow-400 font-bold text-2xl">{lesson.total_xp}</div>
                  <div className="text-purple-200">Total XP</div>
                </div>
                <div className="bg-blue-600/20 rounded-lg p-4">
                  <div className="text-blue-400 font-bold text-2xl">{lesson.challenges.length}</div>
                  <div className="text-purple-200">Challenges</div>
                </div>
                <div className="bg-green-600/20 rounded-lg p-4">
                  <div className="text-green-400 font-bold text-2xl">Week {lesson.week}</div>
                  <div className="text-purple-200">Course Week</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-white font-bold">Challenges:</h3>
                {lesson.challenges.map((challenge) => (
                  <div key={challenge.id} className="flex justify-between items-center bg-black/20 rounded-lg p-3">
                    <span className="text-purple-200">{challenge.title}</span>
                    <span className="text-yellow-400 font-bold">+{challenge.xp_reward} XP</span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <Link
                  href={`/python-lesson-direct/${lesson.id}`}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Quest (Direct Route)
                </Link>
                <Link
                  href={`/python-lesson/${lesson.id}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Start Quest (Original Route)
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <span>← Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}