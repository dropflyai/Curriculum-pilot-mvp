'use client';

import React, { useState } from 'react';
import { Monitor, Users, BookOpen, Code, ArrowRight } from 'lucide-react';
import MultiBrowserManager from '../../components/MultiBrowserManager';
import TeacherDashboard from '../../components/TeacherDashboard';

export default function MultiBrowserDemo() {
  const [currentView, setCurrentView] = useState<'overview' | 'ide' | 'teacher'>('overview');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  const handleStartDemo = (view: 'ide' | 'teacher', role: 'student' | 'teacher') => {
    setUserRole(role);
    setCurrentView(view);
  };

  if (currentView === 'ide') {
    return (
      <div className="h-screen bg-gray-900">
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setCurrentView('overview')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            ← Back to Overview
          </button>
          <div className="text-white font-medium">
            Agent Academy IDE - Multi-Browser System ({userRole} view)
          </div>
        </div>
        <MultiBrowserManager />
      </div>
    );
  }

  if (currentView === 'teacher') {
    return (
      <div className="h-screen bg-gray-900">
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setCurrentView('overview')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            ← Back to Overview
          </button>
          <div className="text-white font-medium">
            Agent Academy IDE - Teacher Dashboard
          </div>
        </div>
        <TeacherDashboard 
          classroomId="demo-classroom-123" 
          teacherId="teacher-demo" 
          onClose={() => setCurrentView('overview')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Monitor className="h-16 w-16 text-blue-400" />
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Multi-Browser IDE
              </h1>
              <p className="text-xl text-gray-300">
                Advanced Development Environment for Agent Academy
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              Experience a revolutionary educational IDE that supports multiple browser windows, 
              real-time collaboration, server management, and comprehensive classroom monitoring. 
              Perfect for web development education, full-stack projects, and collaborative learning.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleStartDemo('ide', 'student')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Code className="h-5 w-5" />
              Launch IDE Demo
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => handleStartDemo('teacher', 'teacher')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Teacher Dashboard
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Multi-Window Management */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Multi-Window Management</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• Multiple independent browser windows</li>
              <li>• Tabbed, tiled, and floating layouts</li>
              <li>• Individual kill/close functionality</li>
              <li>• Drag and resize capabilities</li>
              <li>• Port management and conflict resolution</li>
            </ul>
          </div>

          {/* Server Integration */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-8 w-8 text-green-400" />
              <h3 className="text-xl font-bold text-white">Development Servers</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• React, Next.js, Python servers</li>
              <li>• Static file servers</li>
              <li>• API development environments</li>
              <li>• Hot reload and live updates</li>
              <li>• Process monitoring and logs</li>
            </ul>
          </div>

          {/* Educational Features */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Educational Tools</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• Student progress tracking</li>
              <li>• Real-time collaboration</li>
              <li>• Performance monitoring</li>
              <li>• Error detection and guidance</li>
              <li>• Project sharing and portfolios</li>
            </ul>
          </div>

          {/* Teacher Dashboard */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Classroom Management</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• Monitor all student activities</li>
              <li>• Real-time performance metrics</li>
              <li>• Window sharing and assistance</li>
              <li>• Classroom announcements</li>
              <li>• Progress reports and analytics</li>
            </ul>
          </div>

          {/* Performance Monitoring */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="h-8 w-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Performance Monitoring</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• Memory and CPU usage tracking</li>
              <li>• Load time optimization</li>
              <li>• Error count and analysis</li>
              <li>• Network request monitoring</li>
              <li>• Performance recommendations</li>
            </ul>
          </div>

          {/* Advanced Features */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-8 w-8 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Advanced Features</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• Integrated DevTools access</li>
              <li>• Screenshot and sharing</li>
              <li>• Custom URL support</li>
              <li>• Template-based window creation</li>
              <li>• Export and import capabilities</li>
            </ul>
          </div>
        </div>

        {/* Kill Functionality Showcase */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Advanced Kill Functionality
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Soft Kill</h3>
              <p className="text-gray-300">
                Gracefully shutdown servers, save work, and clean up resources properly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hard Kill</h3>
              <p className="text-gray-300">
                Immediately terminate processes while maintaining system stability
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Force Kill</h3>
              <p className="text-gray-300">
                Emergency termination for unresponsive processes and system recovery
              </p>
            </div>
          </div>
        </div>

        {/* Educational Use Cases */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Educational Use Cases
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Web Development Learning</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Students create HTML/CSS projects with instant preview</li>
                <li>• JavaScript interactivity testing in real-time</li>
                <li>• Responsive design testing across multiple window sizes</li>
                <li>• CSS animation and transition practice</li>
                <li>• Browser compatibility testing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Full-Stack Development</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Frontend React/Vue in one window</li>
                <li>• Backend API server in another window</li>
                <li>• Database admin interface in third window</li>
                <li>• Live application testing and debugging</li>
                <li>• Multi-service architecture learning</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-4">Collaborative Projects</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Multiple team members share preview URLs</li>
                <li>• Real-time collaboration on web applications</li>
                <li>• Code review through live preview comparison</li>
                <li>• Group debugging and problem-solving</li>
                <li>• Peer learning and knowledge sharing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-orange-400 mb-4">Performance Education</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• A/B testing performance optimizations</li>
                <li>• Resource usage comparison between implementations</li>
                <li>• Load testing and monitoring education</li>
                <li>• Memory leak detection and prevention</li>
                <li>• Best practices enforcement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Technical Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Core Components</h3>
              <ul className="space-y-2 text-gray-300 font-mono text-sm">
                <li>• <strong>WindowManager</strong> - Central state management</li>
                <li>• <strong>PortManager</strong> - Port allocation and tracking</li>
                <li>• <strong>ServerProcessManager</strong> - Process lifecycle</li>
                <li>• <strong>PerformanceMonitor</strong> - Resource tracking</li>
                <li>• <strong>BrowserWindow</strong> - Individual window UI</li>
                <li>• <strong>TeacherDashboard</strong> - Classroom management</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Technologies Used</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Next.js 15</strong> - React framework</li>
                <li>• <strong>TypeScript</strong> - Type safety</li>
                <li>• <strong>Zustand</strong> - State management</li>
                <li>• <strong>Tailwind CSS</strong> - Styling</li>
                <li>• <strong>Lucide Icons</strong> - UI icons</li>
                <li>• <strong>iframe</strong> - Sandboxed browser windows</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gray-700/50 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Key Features Implementation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-bold text-white mb-2">Process Management</h4>
                <p className="text-gray-300">
                  Comprehensive server process tracking with graceful shutdown, 
                  resource cleanup, and automatic restart capabilities.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Educational Integration</h4>
                <p className="text-gray-300">
                  Built-in lesson tracking, student progress monitoring, 
                  and collaborative learning features for classroom environments.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Performance Optimization</h4>
                <p className="text-gray-300">
                  Real-time monitoring of memory usage, CPU performance, 
                  and network requests with intelligent recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}