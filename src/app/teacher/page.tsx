'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Lesson, Progress } from '@/lib/supabase'
import { Users, BookOpen, CheckCircle, Clock, Download, Settings } from 'lucide-react'
import Link from 'next/link'

interface StudentProgress {
  user: User
  progress: Progress[]
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all students
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'student')

        if (usersError) throw usersError

        // Fetch all lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .order('week', { ascending: true })

        if (lessonsError) throw lessonsError

        // Fetch all progress
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')

        if (progressError) throw progressError

        // Combine data
        const studentsWithProgress = (usersData || []).map(user => ({
          user,
          progress: (progressData || []).filter(p => p.user_id === user.id)
        }))

        setStudents(studentsWithProgress)
        setLessons(lessonsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const getProgressStats = () => {
    const totalStudents = students.length
    const totalLessons = lessons.length
    const completedCount = students.reduce((acc, student) => 
      acc + student.progress.filter(p => p.status === 'completed').length, 0
    )
    const submittedCount = students.reduce((acc, student) => 
      acc + student.progress.filter(p => p.status === 'submitted').length, 0
    )

    return {
      totalStudents,
      totalLessons,
      completedCount,
      submittedCount,
      averageCompletion: totalStudents > 0 ? (completedCount / (totalStudents * totalLessons)) * 100 : 0
    }
  }

  const getStudentCompletionRate = (studentProgress: Progress[]) => {
    const completed = studentProgress.filter(p => p.status === 'completed').length
    return lessons.length > 0 ? (completed / lessons.length) * 100 : 0
  }

  const stats = getProgressStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">9th Grade Computer Science</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/teacher/manage"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Lessons
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageCompletion.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roster */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
            <p className="text-sm text-gray-600">Track individual student completion rates</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const completionRate = getStudentCompletionRate(student.progress)
                  const lastActivity = student.progress
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
                  
                  return (
                    <tr key={student.user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.user.full_name || 'Unknown Student'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{completionRate.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lastActivity 
                          ? new Date(lastActivity.updated_at).toLocaleDateString()
                          : 'No activity'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          completionRate >= 80 
                            ? 'bg-green-100 text-green-800'
                            : completionRate >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {completionRate >= 80 ? 'Excellent' : completionRate >= 50 ? 'Good' : 'Needs Help'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled</h3>
              <p className="text-gray-600">
                Students will appear here once they join your class.
              </p>
            </div>
          )}
        </div>

        {/* Lesson Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lesson Overview</h3>
            <p className="text-sm text-gray-600">Current curriculum and completion rates</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const lessonProgress = students.flatMap(s => s.progress)
                  .filter(p => p.lesson_id === lesson.id)
                const completedCount = lessonProgress.filter(p => p.status === 'completed').length
                const completionRate = students.length > 0 ? (completedCount / students.length) * 100 : 0
                
                return (
                  <div key={lesson.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Week {lesson.week}: {lesson.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Completed: {completedCount}/{students.length}</span>
                      <span>{completionRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}