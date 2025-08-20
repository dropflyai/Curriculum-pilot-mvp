import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'ai-tutor-knowledge')

const categoryFiles = {
  lessons: 'curriculum/lessons.json',
  errors: 'student-support/common-errors.json',
  interventions: 'student-support/intervention-templates.json',
  pedagogy: 'pedagogy/age-appropriate-communication.json',
  platform: 'platform-integration/codefly-features.json'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category
    const fileName = categoryFiles[category as keyof typeof categoryFiles]
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const filePath = path.join(KNOWLEDGE_BASE_PATH, fileName)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    // Transform data into entries format for the UI
    const entries = convertToEntries(category, data)

    return NextResponse.json({
      category,
      entries,
      metadata: data.metadata || {}
    })
  } catch (error) {
    console.error('Error reading knowledge base:', error)
    return NextResponse.json(
      { error: 'Failed to read knowledge base' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category
    const fileName = categoryFiles[category as keyof typeof categoryFiles]
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const filePath = path.join(KNOWLEDGE_BASE_PATH, fileName)
    
    // Read existing data
    const existingContent = await fs.readFile(filePath, 'utf-8')
    const existingData = JSON.parse(existingContent)
    
    // Update metadata
    existingData.metadata = {
      ...existingData.metadata,
      lastUpdated: new Date().toISOString(),
      version: incrementVersion(existingData.metadata?.version || '1.0')
    }
    
    // Update the specific entry content
    const updatedData = updateCategoryData(category, existingData, body)
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating knowledge base:', error)
    return NextResponse.json(
      { error: 'Failed to update knowledge base' },
      { status: 500 }
    )
  }
}

function convertToEntries(category: string, data: any) {
  const entries: any[] = []
  
  switch (category) {
    case 'lessons':
      Object.entries(data.lessons || {}).forEach(([key, lesson]: [string, any]) => {
        entries.push({
          id: key,
          category: 'lessons',
          subcategory: lesson.difficulty,
          title: lesson.title,
          content: lesson,
          lastUpdated: data.metadata?.lastUpdated || new Date().toISOString(),
          version: data.metadata?.version || '1.0'
        })
      })
      break
      
    case 'errors':
      Object.entries(data.errorPatterns || {}).forEach(([key, error]: [string, any]) => {
        entries.push({
          id: key,
          category: 'errors',
          subcategory: error.severity,
          title: error.studentFriendlyName || key,
          content: error,
          lastUpdated: data.metadata?.lastUpdated || new Date().toISOString(),
          version: data.metadata?.version || '1.0'
        })
      })
      break
      
    case 'interventions':
      Object.entries(data.interventionTypes || {}).forEach(([key, intervention]: [string, any]) => {
        entries.push({
          id: key,
          category: 'interventions',
          subcategory: 'intervention',
          title: intervention.description || key,
          content: intervention,
          lastUpdated: data.metadata?.lastUpdated || new Date().toISOString(),
          version: data.metadata?.version || '1.0'
        })
      })
      break
      
    case 'pedagogy':
      entries.push({
        id: 'communication-guidelines',
        category: 'pedagogy',
        subcategory: 'communication',
        title: 'Age-Appropriate Communication Guidelines',
        content: data,
        lastUpdated: data.metadata?.lastUpdated || new Date().toISOString(),
        version: data.metadata?.version || '1.0'
      })
      break
      
    case 'platform':
      entries.push({
        id: 'platform-features',
        category: 'platform',
        subcategory: 'integration',
        title: 'CodeFly Platform Features',
        content: data,
        lastUpdated: data.metadata?.lastUpdated || new Date().toISOString(),
        version: data.metadata?.version || '1.0'
      })
      break
  }
  
  return entries
}

function updateCategoryData(category: string, existingData: any, updateBody: any) {
  // This function would handle updating specific entries within the knowledge base
  // For now, we'll implement a simple replacement strategy
  
  switch (category) {
    case 'lessons':
      if (existingData.lessons && updateBody.id) {
        existingData.lessons[updateBody.id] = updateBody.content
      }
      break
      
    case 'errors':
      if (existingData.errorPatterns && updateBody.id) {
        existingData.errorPatterns[updateBody.id] = updateBody.content
      }
      break
      
    case 'interventions':
      if (existingData.interventionTypes && updateBody.id) {
        existingData.interventionTypes[updateBody.id] = updateBody.content
      }
      break
      
    default:
      // For single-file categories, replace entire content
      return updateBody.content
  }
  
  return existingData
}

function incrementVersion(version: string): string {
  const parts = version.split('.')
  const patch = parseInt(parts[2] || '0') + 1
  return `${parts[0]}.${parts[1]}.${patch}`
}