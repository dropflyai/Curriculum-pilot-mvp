'use client'

import { useState, useEffect } from 'react'
import { 
  Book, Edit3, Plus, Save, Trash2, Search, 
  AlertTriangle, Lightbulb, MessageSquare, Settings,
  ChevronDown, ChevronRight, Download, Upload
} from 'lucide-react'

interface KnowledgeBaseEntry {
  id: string
  category: string
  subcategory: string
  title: string
  content: any
  lastUpdated: string
  version: string
}

type CategoryType = 'lessons' | 'errors' | 'interventions' | 'pedagogy' | 'platform'

export default function KnowledgeBasePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('lessons')
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeBaseEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const categories = {
    lessons: { icon: Book, label: 'Lesson Content', color: 'blue' },
    errors: { icon: AlertTriangle, label: 'Common Errors', color: 'red' },
    interventions: { icon: MessageSquare, label: 'Student Support', color: 'green' },
    pedagogy: { icon: Lightbulb, label: 'Teaching Methods', color: 'purple' },
    platform: { icon: Settings, label: 'Platform Features', color: 'gray' }
  }

  useEffect(() => {
    loadKnowledgeBase()
  }, [activeCategory])

  const loadKnowledgeBase = async () => {
    try {
      const response = await fetch(`/api/knowledge-base/${activeCategory}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error)
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSave = async () => {
    if (!selectedEntry) return

    try {
      const response = await fetch(`/api/knowledge-base/${activeCategory}/${selectedEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedEntry)
      })

      if (response.ok) {
        setIsEditing(false)
        loadKnowledgeBase()
        console.log('Knowledge base entry updated successfully')
      }
    } catch (error) {
      console.error('Failed to save entry:', error)
    }
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      const response = await fetch(`/api/knowledge-base/${activeCategory}/${entryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadKnowledgeBase()
        if (selectedEntry?.id === entryId) {
          setSelectedEntry(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const exportKnowledgeBase = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeCategory}-knowledge-base.json`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 AI Tutor Knowledge Base
          </h1>
          <p className="text-blue-200">
            Manage and update the AI tutor's knowledge for better student support
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Category Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
              
              <div className="space-y-2">
                {Object.entries(categories).map(([key, category]) => {
                  const Icon = category.icon
                  const isActive = activeCategory === key
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key as CategoryType)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Export/Import */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={exportKnowledgeBase}
                  className="w-full flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Category
                </button>
              </div>
            </div>
          </div>

          {/* Entry List */}
          <div className="col-span-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {categories[activeCategory].label}
                </h2>
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Entry List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedEntry?.id === entry.id
                        ? 'bg-blue-600/30 border border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <h3 className="font-medium text-white text-sm">{entry.title}</h3>
                    <p className="text-xs text-gray-300 mt-1">
                      Updated: {new Date(entry.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Entry Editor */}
          <div className="col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              {selectedEntry ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">
                      {selectedEntry.title}
                    </h2>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(selectedEntry.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Entry Details */}
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-gray-300 mb-2">
                        Category: {selectedEntry.category} | Version: {selectedEntry.version}
                      </div>
                      
                      {isEditing ? (
                        <textarea
                          value={JSON.stringify(selectedEntry.content, null, 2)}
                          onChange={(e) => {
                            try {
                              const newContent = JSON.parse(e.target.value)
                              setSelectedEntry({
                                ...selectedEntry,
                                content: newContent
                              })
                            } catch (error) {
                              // Invalid JSON, don't update
                            }
                          }}
                          className="w-full h-96 p-3 bg-gray-900 text-white font-mono text-sm rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="JSON content..."
                        />
                      ) : (
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                          {JSON.stringify(selectedEntry.content, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select an entry to view and edit</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-5 gap-4">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <category.icon className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-300">{category.label}</div>
                  <div className="text-lg font-semibold text-white">
                    {key === activeCategory ? entries.length : '...'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}