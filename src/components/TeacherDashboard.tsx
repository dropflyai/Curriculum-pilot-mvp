'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Monitor,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Share2,
  Settings,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  Zap,
  TrendingUp,
  Award,
  MessageSquare,
  Activity
} from 'lucide-react';
import { BrowserWindow, WindowAnalytics, ClassroomReport, StudentWindowReport } from '../types/browser-window';
import { useWindowManager } from '../stores/window-manager';

interface Student {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastActivity: Date;
  windowCount: number;
  performanceScore: number;
  issuesCount: number;
}

interface TeacherDashboardProps {
  classroomId: string;
  teacherId: string;
  onClose?: () => void;
}

// Mock student data - in a real app this would come from your backend
const MOCK_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@school.edu',
    isOnline: true,
    lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    windowCount: 3,
    performanceScore: 92,
    issuesCount: 0
  },
  {
    id: 'student-2',
    name: 'Bob Smith',
    email: 'bob.smith@school.edu',
    isOnline: true,
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    windowCount: 2,
    performanceScore: 87,
    issuesCount: 1
  },
  {
    id: 'student-3',
    name: 'Carol Davis',
    email: 'carol.davis@school.edu',
    isOnline: false,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    windowCount: 0,
    performanceScore: 0,
    issuesCount: 3
  },
  {
    id: 'student-4',
    name: 'David Wilson',
    email: 'david.wilson@school.edu',
    isOnline: true,
    lastActivity: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    windowCount: 4,
    performanceScore: 95,
    issuesCount: 0
  },
  {
    id: 'student-5',
    name: 'Eva Martinez',
    email: 'eva.martinez@school.edu',
    isOnline: true,
    lastActivity: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    windowCount: 1,
    performanceScore: 78,
    issuesCount: 2
  }
];

export default function TeacherDashboard({ classroomId, teacherId, onClose }: TeacherDashboardProps) {
  const { windows, killAllWindows, refreshAllWindows } = useWindowManager();
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterOnlineOnly, setFilterOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'performance' | 'activity'>('name');
  const [isMonitoringAll, setIsMonitoringAll] = useState(false);
  const [classroomLocked, setClassroomLocked] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterOnlineOnly || student.isOnline;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'performance':
          return b.performanceScore - a.performanceScore;
        case 'activity':
          return b.lastActivity.getTime() - a.lastActivity.getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Calculate classroom statistics
  const classroomStats = {
    totalStudents: students.length,
    onlineStudents: students.filter(s => s.isOnline).length,
    averagePerformance: Math.round(
      students.reduce((sum, s) => sum + s.performanceScore, 0) / students.length
    ),
    totalWindows: students.reduce((sum, s) => sum + s.windowCount, 0),
    totalIssues: students.reduce((sum, s) => sum + s.issuesCount, 0),
    activeStudents: students.filter(s => 
      s.isOnline && (Date.now() - s.lastActivity.getTime()) < 5 * 60 * 1000
    ).length
  };

  // Mock functions for classroom management
  const handleShareWindowWithClass = useCallback((windowId: string) => {
    // In a real app, this would share the window URL with all students
    console.log('Sharing window with class:', windowId);
    alert('Window shared with all students!');
  }, []);

  const handleLockStudentWindows = useCallback((studentIds: string[]) => {
    // In a real app, this would lock/disable student windows
    console.log('Locking windows for students:', studentIds);
    alert(`Locked windows for ${studentIds.length} students`);
  }, []);

  const handleSendAnnouncement = useCallback(() => {
    if (!announcementText.trim()) return;
    
    // In a real app, this would send the announcement to all students
    console.log('Sending announcement:', announcementText);
    alert(`Announcement sent to ${classroomStats.onlineStudents} online students`);
    setAnnouncementText('');
    setShowAnnouncement(false);
  }, [announcementText, classroomStats.onlineStudents]);

  const handleMonitorStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    // In a real app, this would start monitoring the selected student
    console.log('Monitoring student:', student.name);
  }, []);

  const handleExportReport = useCallback(() => {
    // Generate and download classroom report
    const report = {
      classroomId,
      teacherId,
      timestamp: new Date().toISOString(),
      stats: classroomStats,
      students: filteredStudents.map(s => ({
        name: s.name,
        email: s.email,
        performanceScore: s.performanceScore,
        windowCount: s.windowCount,
        issuesCount: s.issuesCount,
        lastActivity: s.lastActivity.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classroom-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [classroomId, teacherId, classroomStats, filteredStudents]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(prevStudents => 
        prevStudents.map(student => ({
          ...student,
          performanceScore: Math.max(0, Math.min(100, 
            student.performanceScore + (Math.random() - 0.5) * 5
          )),
          lastActivity: student.isOnline ? new Date() : student.lastActivity
        }))
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-green-400" />
            <h1 className="text-white font-bold text-xl">Teacher Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-300">Classroom ID: {classroomId}</span>
            <div className="flex items-center gap-1 text-green-400">
              <Activity className="h-4 w-4" />
              <span>{classroomStats.onlineStudents} online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnnouncement(true)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Announce
          </button>
          <button
            onClick={handleExportReport}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Stats Overview */}
          <div className="grid grid-cols-6 gap-4 p-6 bg-gray-850">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{classroomStats.totalStudents}</div>
              <div className="text-gray-400 text-sm">Total Students</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{classroomStats.onlineStudents}</div>
              <div className="text-gray-400 text-sm">Online Now</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{classroomStats.activeStudents}</div>
              <div className="text-gray-400 text-sm">Active (5min)</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{classroomStats.averagePerformance}%</div>
              <div className="text-gray-400 text-sm">Avg Performance</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{classroomStats.totalWindows}</div>
              <div className="text-gray-400 text-sm">Total Windows</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{classroomStats.totalIssues}</div>
              <div className="text-gray-400 text-sm">Issues</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={filterOnlineOnly}
                    onChange={(e) => setFilterOnlineOnly(e.target.checked)}
                  />
                  Online only
                </label>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="performance">Sort by Performance</option>
                  <option value="activity">Sort by Activity</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMonitoringAll(!isMonitoringAll)}
                className={`px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                  isMonitoringAll
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {isMonitoringAll ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isMonitoringAll ? 'Stop Monitoring' : 'Monitor All'}
              </button>

              <button
                onClick={() => setClassroomLocked(!classroomLocked)}
                className={`px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                  classroomLocked
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {classroomLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {classroomLocked ? 'Unlock Class' : 'Lock Class'}
              </button>

              <button
                onClick={refreshAllWindows}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh All
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`bg-gray-800 rounded-lg p-4 border-2 transition-all cursor-pointer ${
                    selectedStudent?.id === student.id
                      ? 'border-blue-500 bg-blue-600/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => handleMonitorStudent(student)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        student.isOnline ? 'bg-green-400' : 'bg-gray-500'
                      }`} />
                      <span className="text-white font-medium">{student.name}</span>
                    </div>
                    {student.issuesCount > 0 && (
                      <div className="flex items-center gap-1 text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">{student.issuesCount}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Performance:</span>
                      <span className={`font-medium ${
                        student.performanceScore >= 90 ? 'text-green-400' :
                        student.performanceScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {student.performanceScore}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Windows:</span>
                      <span className="text-blue-400">{student.windowCount}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Last Activity:</span>
                      <span className="text-purple-400">
                        {Math.round((Date.now() - student.lastActivity.getTime()) / 60000)}m ago
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Mock function to view student screen
                        alert(`Viewing ${student.name}'s screen`);
                      }}
                      className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                    >
                      <Monitor className="h-3 w-3 inline mr-1" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Mock function to assist student
                        alert(`Assisting ${student.name}`);
                      }}
                      className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                    >
                      <Share2 className="h-3 w-3 inline mr-1" />
                      Assist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Detail Panel */}
        {selectedStudent && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  selectedStudent.isOnline ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                <h3 className="text-white font-medium">{selectedStudent.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Student Info */}
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Student Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-300">{selectedStudent.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={selectedStudent.isOnline ? 'text-green-400' : 'text-gray-400'}>
                      {selectedStudent.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Activity:</span>
                    <span className="text-purple-400">
                      {selectedStudent.lastActivity.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Performance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Overall Score</span>
                      <span className="text-white">{selectedStudent.performanceScore}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedStudent.performanceScore >= 90 ? 'bg-green-400' :
                          selectedStudent.performanceScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${selectedStudent.performanceScore}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{selectedStudent.windowCount}</div>
                      <div className="text-gray-400">Windows</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-400 font-bold">{selectedStudent.issuesCount}</div>
                      <div className="text-gray-400">Issues</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-700 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Screen
                  </button>
                  <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Resources
                  </button>
                  <button
                    onClick={() => handleLockStudentWindows([selectedStudent.id])}
                    className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Lock Windows
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Announcement Modal */}
      {showAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-bold text-lg">Send Announcement</h3>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Enter your announcement message..."
                className="w-full h-32 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              />
              
              <div className="text-sm text-gray-400 mt-2">
                Will be sent to {classroomStats.onlineStudents} online students
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowAnnouncement(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  disabled={!announcementText.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}