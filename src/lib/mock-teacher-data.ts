// Mock data for teacher dashboard when Supabase is not configured

export interface MockStudent {
  id: string
  email: string
  full_name: string
  status: 'active' | 'completed' | 'needs_help' | 'stuck'
  lastActivity: string
  currentLesson: string
  completedLessons: number
  averageScore: number
  timeSpent: number
  lastSeen: string
}

export interface MockLessonProgress {
  lessonId: string
  lessonTitle: string
  studentsStarted: number
  studentsCompleted: number
  averageScore: number
  averageTime: number
  strugglingStudents: string[]
}

export const mockStudents: MockStudent[] = [
  {
    id: 'student-1',
    email: 'alex.thompson@school.edu',
    full_name: 'Alex Thompson',
    status: 'active',
    lastActivity: 'Working on Python Basics',
    currentLesson: 'Python Basics: Variables',
    completedLessons: 2,
    averageScore: 85,
    timeSpent: 45,
    lastSeen: '2 minutes ago'
  },
  {
    id: 'student-2',
    email: 'maria.garcia@school.edu',
    full_name: 'Maria Garcia',
    status: 'completed',
    lastActivity: 'Completed Magic 8-Ball Project',
    currentLesson: 'Magic 8-Ball Project',
    completedLessons: 3,
    averageScore: 92,
    timeSpent: 38,
    lastSeen: '15 minutes ago'
  },
  {
    id: 'student-3',
    email: 'james.wilson@school.edu',
    full_name: 'James Wilson',
    status: 'needs_help',
    lastActivity: 'Stuck on variable assignment',
    currentLesson: 'Python Basics: Variables',
    completedLessons: 1,
    averageScore: 72,
    timeSpent: 65,
    lastSeen: '5 minutes ago'
  },
  {
    id: 'student-4',
    email: 'sarah.chen@school.edu',
    full_name: 'Sarah Chen',
    status: 'active',
    lastActivity: 'Working on quiz section',
    currentLesson: 'Python Basics: Variables',
    completedLessons: 2,
    averageScore: 88,
    timeSpent: 42,
    lastSeen: 'Just now'
  },
  {
    id: 'student-5',
    email: 'michael.brown@school.edu',
    full_name: 'Michael Brown',
    status: 'stuck',
    lastActivity: 'Error in code execution',
    currentLesson: 'Magic 8-Ball Project',
    completedLessons: 1,
    averageScore: 65,
    timeSpent: 78,
    lastSeen: '8 minutes ago'
  }
]

export const mockLessonProgress: MockLessonProgress[] = [
  {
    lessonId: 'lesson-1',
    lessonTitle: 'Python Basics: Variables',
    studentsStarted: 5,
    studentsCompleted: 2,
    averageScore: 82,
    averageTime: 45,
    strugglingStudents: ['James Wilson', 'Michael Brown']
  },
  {
    lessonId: 'lesson-2',
    lessonTitle: 'Magic 8-Ball Project',
    studentsStarted: 3,
    studentsCompleted: 1,
    averageScore: 88,
    averageTime: 55,
    strugglingStudents: ['Michael Brown']
  }
]

export const mockCommonErrors = [
  {
    error: 'NameError',
    count: 8,
    description: 'Using undefined variables',
    affectedStudents: 3
  },
  {
    error: 'SyntaxError',
    count: 5,
    description: 'Missing colons or parentheses',
    affectedStudents: 2
  },
  {
    error: 'IndentationError',
    count: 3,
    description: 'Incorrect Python indentation',
    affectedStudents: 1
  }
]

export const mockClassStats = {
  totalStudents: 5,
  activeNow: 3,
  completedToday: 1,
  needingHelp: 2,
  averageProgress: 65,
  averageScore: 80,
  totalLessonsCompleted: 9,
  totalTimeSpent: 268
}

export const mockRecentActivity = [
  {
    student: 'Sarah Chen',
    action: 'Started quiz',
    lesson: 'Python Basics',
    time: 'Just now',
    type: 'quiz' as const
  },
  {
    student: 'Alex Thompson',
    action: 'Submitted code',
    lesson: 'Python Basics',
    time: '2 minutes ago',
    type: 'code' as const
  },
  {
    student: 'James Wilson',
    action: 'Requested help',
    lesson: 'Python Basics',
    time: '5 minutes ago',
    type: 'help' as const
  },
  {
    student: 'Michael Brown',
    action: 'Encountered error',
    lesson: 'Magic 8-Ball',
    time: '8 minutes ago',
    type: 'error' as const
  },
  {
    student: 'Maria Garcia',
    action: 'Completed lesson',
    lesson: 'Magic 8-Ball',
    time: '15 minutes ago',
    type: 'complete' as const
  }
]

// Function to get mock data with simulated real-time updates
export function getMockTeacherData() {
  // Simulate some random changes to make it feel real-time
  const now = new Date()
  const updatedStudents = mockStudents.map(student => ({
    ...student,
    lastSeen: getRandomLastSeen(),
    timeSpent: student.timeSpent + Math.floor(Math.random() * 5)
  }))

  return {
    students: updatedStudents,
    lessonProgress: mockLessonProgress,
    commonErrors: mockCommonErrors,
    classStats: {
      ...mockClassStats,
      activeNow: Math.floor(Math.random() * 3) + 2, // Random between 2-4
    },
    recentActivity: mockRecentActivity
  }
}

function getRandomLastSeen() {
  const options = ['Just now', '1 minute ago', '2 minutes ago', '5 minutes ago', '10 minutes ago']
  return options[Math.floor(Math.random() * options.length)]
}