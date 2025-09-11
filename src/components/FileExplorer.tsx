'use client'

import { useState, useEffect } from 'react'
import {
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  FileText,
  Image,
  Code,
  Database,
  Settings,
  Zap
} from 'lucide-react'

export interface FileSystemItem {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  parent?: string
  children?: FileSystemItem[]
  content?: string
  language?: string
  size?: number
  modified?: Date
  isExpanded?: boolean
}

interface FileExplorerProps {
  onFileSelect: (file: FileSystemItem) => void
  onFileCreate: (path: string, type: 'file' | 'folder') => void
  onFileDelete: (file: FileSystemItem) => void
  onFileRename: (file: FileSystemItem, newName: string) => void
  selectedFile?: string
  rootFiles: FileSystemItem[]
}

export default function FileExplorer({
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFile,
  rootFiles
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']))
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    item: FileSystemItem
  } | null>(null)
  const [renamingItem, setRenamingItem] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const getFileIcon = (file: FileSystemItem) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? (
        <FolderOpen className="h-4 w-4 text-blue-400" />
      ) : (
        <Folder className="h-4 w-4 text-blue-400" />
      )
    }

    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'py':
        return <Code className="h-4 w-4 text-yellow-400" />
      case 'js':
      case 'ts':
      case 'tsx':
      case 'jsx':
        return <Code className="h-4 w-4 text-blue-400" />
      case 'html':
      case 'css':
        return <Code className="h-4 w-4 text-orange-400" />
      case 'json':
        return <Database className="h-4 w-4 text-green-400" />
      case 'md':
        return <FileText className="h-4 w-4 text-gray-400" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="h-4 w-4 text-purple-400" />
      case 'env':
        return <Settings className="h-4 w-4 text-yellow-300" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    })
  }

  const handleRename = (item: FileSystemItem) => {
    setRenamingItem(item.id)
    setRenameValue(item.name)
    setContextMenu(null)
  }

  const handleRenameSubmit = (item: FileSystemItem) => {
    if (renameValue.trim() && renameValue !== item.name) {
      onFileRename(item, renameValue.trim())
    }
    setRenamingItem(null)
    setRenameValue('')
  }

  const renderFileTreeItem = (item: FileSystemItem, depth = 0) => {
    const isSelected = selectedFile === item.id
    const isExpanded = expandedFolders.has(item.id)
    const isRenaming = renamingItem === item.id

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center px-2 py-1 hover:bg-slate-700/50 cursor-pointer group relative ${
            isSelected ? 'bg-blue-600/30 border-l-2 border-blue-400' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id)
            } else {
              onFileSelect(item)
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {item.type === 'folder' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(item.id)
              }}
              className="p-0.5 hover:bg-slate-600 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-400" />
              )}
            </button>
          )}
          
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {getFileIcon(item)}
            {isRenaming ? (
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleRenameSubmit(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameSubmit(item)
                  } else if (e.key === 'Escape') {
                    setRenamingItem(null)
                  }
                }}
                className="bg-slate-700 text-green-300 px-1 py-0 text-sm border border-green-500/30 rounded flex-1 min-w-0"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-green-300 text-sm truncate">{item.name}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleContextMenu(e, item)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded"
          >
            <MoreVertical className="h-3 w-3 text-gray-400" />
          </button>
        </div>

        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map((child) => renderFileTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Click outside to close context menu
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null)
    }
    
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu])

  return (
    <div className="h-full bg-slate-800 border-r border-green-500/30 flex flex-col">
      {/* Explorer Header */}
      <div className="bg-slate-700 px-3 py-2 border-b border-green-500/30">
        <div className="flex items-center justify-between">
          <span className="text-green-300 text-sm font-medium">EXPLORER</span>
          <div className="flex space-x-1">
            <button
              onClick={() => onFileCreate('', 'file')}
              className="p-1 hover:bg-slate-600 rounded"
              title="New File"
            >
              <Plus className="h-3 w-3 text-green-400" />
            </button>
            <button
              onClick={() => onFileCreate('', 'folder')}
              className="p-1 hover:bg-slate-600 rounded"
              title="New Folder"
            >
              <Folder className="h-3 w-3 text-green-400" />
            </button>
          </div>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-1">
          {rootFiles.map((item) => renderFileTreeItem(item))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-slate-700 border border-green-500/30 rounded shadow-lg py-1 min-w-[120px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            onClick={() => {
              onFileCreate(contextMenu.item.path, 'file')
              setContextMenu(null)
            }}
            className="w-full text-left px-3 py-1 text-sm text-green-300 hover:bg-slate-600 flex items-center space-x-2"
          >
            <Plus className="h-3 w-3" />
            <span>New File</span>
          </button>
          
          {contextMenu.item.type === 'folder' && (
            <button
              onClick={() => {
                onFileCreate(contextMenu.item.path, 'folder')
                setContextMenu(null)
              }}
              className="w-full text-left px-3 py-1 text-sm text-green-300 hover:bg-slate-600 flex items-center space-x-2"
            >
              <Folder className="h-3 w-3" />
              <span>New Folder</span>
            </button>
          )}
          
          <hr className="border-green-500/30 my-1" />
          
          <button
            onClick={() => handleRename(contextMenu.item)}
            className="w-full text-left px-3 py-1 text-sm text-green-300 hover:bg-slate-600 flex items-center space-x-2"
          >
            <Edit className="h-3 w-3" />
            <span>Rename</span>
          </button>
          
          <button
            onClick={() => {
              // Copy path to clipboard
              navigator.clipboard.writeText(contextMenu.item.path)
              setContextMenu(null)
            }}
            className="w-full text-left px-3 py-1 text-sm text-green-300 hover:bg-slate-600 flex items-center space-x-2"
          >
            <Copy className="h-3 w-3" />
            <span>Copy Path</span>
          </button>
          
          <hr className="border-green-500/30 my-1" />
          
          <button
            onClick={() => {
              onFileDelete(contextMenu.item)
              setContextMenu(null)
            }}
            className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-slate-600 flex items-center space-x-2"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}