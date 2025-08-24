'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Brain, BookOpen, Search, Plus, 
  Edit3, Trash2, Save, X, Tag, Clock,
  Lightbulb, MessageSquare, Code, HelpCircle,
  FileText, Target, AlertCircle, CheckCircle
} from 'lucide-react'

interface KnowledgeEntry {
  id: string
  category: 'concept' | 'error' | 'hint' | 'example' | 'faq'
  title: string
  content: string
  tags: string[]
  relatedLessons: string[]
  usageCount: number
  lastUsed?: string
  createdAt: string
}

export default function AITutorKnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([
    {
      id: '1',
      category: 'concept',
      title: 'Variables in Python',
      content: 'Variables are like labeled boxes that store data. Think of them as containers with names that hold values you can use later in your program.',
      tags: ['python', 'basics', 'variables'],
      relatedLessons: ['Lesson 1: Python Basics'],
      usageCount: 47,
      lastUsed: '2 hours ago',
      createdAt: '2024-03-01'
    },
    {
      id: '2',
      category: 'error',
      title: 'NameError: name is not defined',
      content: 'This error occurs when you try to use a variable that hasn\'t been created yet. Make sure to define your variable with = before using it.',
      tags: ['error', 'debugging', 'variables'],
      relatedLessons: ['Lesson 1: Python Basics'],
      usageCount: 32,
      lastUsed: '5 hours ago',
      createdAt: '2024-03-02'
    },
    {
      id: '3',
      category: 'hint',
      title: 'Magic 8-Ball Random Responses',
      content: 'Use the random.choice() function to pick a random response from a list. Example: response = random.choice(responses)',
      tags: ['random', 'lists', 'magic-8-ball'],
      relatedLessons: ['Project: Magic 8-Ball'],
      usageCount: 28,
      lastUsed: '1 day ago',
      createdAt: '2024-03-05'
    },
    {
      id: '4',
      category: 'example',
      title: 'Input and Print Example',
      content: 'name = input("What is your name? ")\\nprint(f"Hello, {name}!")',
      tags: ['input', 'output', 'f-strings'],
      relatedLessons: ['Lesson 1: Python Basics'],
      usageCount: 41,
      lastUsed: '3 hours ago',
      createdAt: '2024-03-03'
    },
    {
      id: '5',
      category: 'faq',
      title: 'What is the difference between = and ==?',
      content: 'Single = is for assignment (giving a variable a value). Double == is for comparison (checking if two things are equal).',
      tags: ['operators', 'comparison', 'assignment'],
      relatedLessons: ['Lesson 2: Conditionals'],
      usageCount: 19,
      lastUsed: '2 days ago',
      createdAt: '2024-03-08'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | KnowledgeEntry['category']>('all')
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null)

  const getCategoryIcon = (category: KnowledgeEntry['category']) => {
    switch (category) {
      case 'concept': return <Brain className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      case 'hint': return <Lightbulb className="h-4 w-4" />
      case 'example': return <Code className="h-4 w-4" />
      case 'faq': return <HelpCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: KnowledgeEntry['category']) => {
    switch (category) {
      case 'concept': return 'bg-blue-600'
      case 'error': return 'bg-red-600'
      case 'hint': return 'bg-yellow-600'
      case 'example': return 'bg-green-600'
      case 'faq': return 'bg-purple-600'
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalEntries: entries.length,
    concepts: entries.filter(e => e.category === 'concept').length,
    errors: entries.filter(e => e.category === 'error').length,
    hints: entries.filter(e => e.category === 'hint').length,
    examples: entries.filter(e => e.category === 'example').length,
    faqs: entries.filter(e => e.category === 'faq').length,
    totalUsage: entries.reduce((sum, e) => sum + e.usageCount, 0)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link 
                href="/teacher"
                className="flex items-center text-gray-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-cyan-500 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-white">AI Tutor Knowledge Base</h1>
                  <p className="text-sm text-gray-400">Manage AI assistant responses and learning resources</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingEntry(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <BookOpen className="h-8 w-8 text-cyan-200" />
              <span className="text-2xl font-bold">{stats.totalEntries}</span>
            </div>
            <p className="text-cyan-100 text-sm mt-2">Total Entries</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">{stats.concepts}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Concepts</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <span className="text-xl font-bold text-white">{stats.errors}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Errors</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              <span className="text-xl font-bold text-white">{stats.hints}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Hints</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <Code className="h-6 w-6 text-green-400" />
              <span className="text-xl font-bold text-white">{stats.examples}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Examples</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <HelpCircle className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">{stats.faqs}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">FAQs</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <MessageSquare className="h-8 w-8 text-green-200" />
              <span className="text-2xl font-bold">{stats.totalUsage}</span>
            </div>
            <p className="text-green-100 text-sm mt-2">Total Uses</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({stats.totalEntries})
              </button>
              <button
                onClick={() => setSelectedCategory('concept')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'concept' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Brain className="h-4 w-4 inline mr-1" />
                Concepts
              </button>
              <button
                onClick={() => setSelectedCategory('error')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'error' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Errors
              </button>
              <button
                onClick={() => setSelectedCategory('hint')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'hint' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Lightbulb className="h-4 w-4 inline mr-1" />
                Hints
              </button>
              <button
                onClick={() => setSelectedCategory('example')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'example' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Code className="h-4 w-4 inline mr-1" />
                Examples
              </button>
              <button
                onClick={() => setSelectedCategory('faq')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'faq' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <HelpCircle className="h-4 w-4 inline mr-1" />
                FAQs
              </button>
            </div>
          </div>
        </div>

        {/* Knowledge Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(entry.category)}`}>
                    {getCategoryIcon(entry.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                    <p className="text-xs text-gray-400">
                      {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} • Used {entry.usageCount} times
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingEntry(entry)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{entry.content}</p>

              <div className="space-y-2">
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {entry.relatedLessons.length > 0 && (
                  <div className="text-xs text-gray-400">
                    Related: {entry.relatedLessons.join(', ')}
                  </div>
                )}

                {entry.lastUsed && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Last used {entry.lastUsed}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Entry Modal */}
        {(isAddingEntry || editingEntry) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {isAddingEntry ? 'Add Knowledge Entry' : 'Edit Knowledge Entry'}
                </h2>
                <button 
                  onClick={() => {
                    setIsAddingEntry(false)
                    setEditingEntry(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter title..."
                    defaultValue={editingEntry?.title}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500">
                    <option value="concept">Concept</option>
                    <option value="error">Error</option>
                    <option value="hint">Hint</option>
                    <option value="example">Example</option>
                    <option value="faq">FAQ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    rows={4}
                    placeholder="Enter content..."
                    defaultValue={editingEntry?.content}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="python, variables, basics"
                    defaultValue={editingEntry?.tags.join(', ')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Related Lessons</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                    placeholder="Lesson 1: Python Basics"
                    defaultValue={editingEntry?.relatedLessons.join(', ')}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => {
                    setIsAddingEntry(false)
                    setEditingEntry(null)
                  }}
                  className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}