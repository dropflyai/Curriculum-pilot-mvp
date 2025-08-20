#!/usr/bin/env node

/**
 * Extract lesson data from lesson-data.ts and enhance the knowledge base
 */

const fs = require('fs').promises
const path = require('path')

async function extractLessonData() {
  try {
    console.log('🔍 Extracting lesson data from lesson-data.ts...')
    
    // Read the lesson data file
    const lessonDataPath = path.join(__dirname, '../../src/lib/lesson-data.ts')
    const lessonContent = await fs.readFile(lessonDataPath, 'utf-8')
    
    // Extract lesson objects (this is a simplified extraction)
    // In a real implementation, you'd want to use a proper TypeScript parser
    const lessons = extractLessonsFromContent(lessonContent)
    
    // Load existing knowledge base
    const kbPath = path.join(__dirname, '../curriculum/lessons.json')
    const existingKB = JSON.parse(await fs.readFile(kbPath, 'utf-8'))
    
    // Enhance with extracted data
    const enhancedLessons = enhanceLessonsWithExtractedData(existingKB.lessons, lessons)
    
    // Update knowledge base
    existingKB.lessons = enhancedLessons
    existingKB.metadata.lastUpdated = new Date().toISOString()
    existingKB.metadata.extractedFrom = 'lesson-data.ts'
    
    // Write back
    await fs.writeFile(kbPath, JSON.stringify(existingKB, null, 2))
    
    console.log('✅ Successfully extracted and enhanced lesson data!')
    console.log(`📊 Enhanced ${Object.keys(enhancedLessons).length} lessons`)
    
  } catch (error) {
    console.error('❌ Error extracting lesson data:', error)
  }
}

function extractLessonsFromContent(content) {
  const lessons = {}
  
  // Extract python-basics-variables lesson
  const variablesMatch = content.match(/id: 'python-basics-variables'[\s\S]*?(?=},\s*{|\])/g)
  if (variablesMatch) {
    lessons['python-basics-variables'] = {
      realWorldAnalogies: extractAnalogies(variablesMatch[0]),
      interactiveExamples: extractInteractiveExamples(variablesMatch[0]),
      commonErrors: extractCommonErrors(variablesMatch[0]),
      hints: extractHints(variablesMatch[0])
    }
  }
  
  // Extract magic-8-ball lesson
  const magic8Match = content.match(/id: 'python-magic-8-ball'[\s\S]*?(?=},\s*{|\])/g)
  if (magic8Match) {
    lessons['python-magic-8-ball'] = {
      projectStages: extractProjectStages(magic8Match[0]),
      enhancements: extractEnhancements(magic8Match[0]),
      realWorldConnections: extractRealWorldConnections(magic8Match[0])
    }
  }
  
  return lessons
}

function extractAnalogies(content) {
  const analogies = []
  
  // Extract phone contacts analogy
  if (content.includes('phone contacts')) {
    analogies.push({
      concept: 'variables',
      analogy: 'phone contacts',
      explanation: 'Variables are like phone contacts - each has a name (label) and stores information'
    })
  }
  
  // Extract drive-thru analogy
  if (content.includes('drive-thru')) {
    analogies.push({
      concept: 'input',
      analogy: 'drive-thru ordering',
      explanation: 'input() is like a drive-thru speaker - asks questions and waits for responses'
    })
  }
  
  return analogies
}

function extractInteractiveExamples(content) {
  const examples = []
  const exampleMatches = content.match(/<interactive-example>[\s\S]*?<\/interactive-example>/g) || []
  
  exampleMatches.forEach((match, index) => {
    const code = match.match(/code: ([\s\S]*?)title:/)?.[1]?.trim()
    const title = match.match(/title: (.*?)(?:description:|<\/interactive-example>)/)?.[1]?.trim()
    const description = match.match(/description: (.*?)<\/interactive-example>/)?.[1]?.trim()
    
    if (code && title) {
      examples.push({
        id: `example-${index + 1}`,
        title,
        description,
        code: code.replace(/^#\s*/gm, '').trim(),
        concept: inferConcept(code)
      })
    }
  })
  
  return examples
}

function extractCommonErrors(content) {
  const errors = []
  
  // Look for error patterns in hints and solutions
  const hintMatches = content.match(/hints.*?\[([\s\S]*?)\]/g) || []
  
  hintMatches.forEach(hintBlock => {
    if (hintBlock.includes('NameError') || hintBlock.includes('undefined')) {
      errors.push({
        type: 'NameError',
        context: 'variable usage',
        description: 'Using variables before defining them'
      })
    }
    
    if (hintBlock.includes('TypeError') || hintBlock.includes('string')) {
      errors.push({
        type: 'TypeError', 
        context: 'type conversion',
        description: 'Mixing strings and numbers without conversion'
      })
    }
  })
  
  return errors
}

function extractHints(content) {
  const hints = []
  const hintMatches = content.match(/hints.*?\[([\s\S]*?)\]/g) || []
  
  hintMatches.forEach(hintBlock => {
    const hintStrings = hintBlock.match(/"([^"]+)"/g) || []
    hintStrings.forEach((hint, index) => {
      hints.push({
        level: index + 1,
        text: hint.replace(/"/g, ''),
        progressive: true
      })
    })
  })
  
  return hints
}

function extractProjectStages(content) {
  const stages = []
  
  // Look for step-by-step patterns
  const stepMatches = content.match(/Step \d+:.*$/gm) || []
  stepMatches.forEach((step, index) => {
    stages.push({
      stage: index + 1,
      title: step.replace(/Step \d+:\s*/, ''),
      estimatedTime: '10-15 minutes'
    })
  })
  
  return stages
}

function extractEnhancements(content) {
  const enhancements = []
  
  if (content.includes('personalization') || content.includes('user name')) {
    enhancements.push({
      type: 'personalization',
      description: 'Add user name for personalized responses',
      difficulty: 'easy'
    })
  }
  
  if (content.includes('categories') || content.includes('positive')) {
    enhancements.push({
      type: 'categorization',
      description: 'Organize responses by type (positive, negative, neutral)',
      difficulty: 'medium'
    })
  }
  
  return enhancements
}

function extractRealWorldConnections(content) {
  const connections = []
  
  if (content.includes('Instagram')) {
    connections.push({
      app: 'Instagram',
      concept: 'data processing',
      description: 'ASK for photo, STORE it, apply filters, SHOW to friends'
    })
  }
  
  if (content.includes('Spotify')) {
    connections.push({
      app: 'Spotify',
      concept: 'random selection',
      description: 'Random selection used for shuffling playlists'
    })
  }
  
  return connections
}

function enhanceLessonsWithExtractedData(existingLessons, extractedData) {
  const enhanced = { ...existingLessons }
  
  Object.keys(extractedData).forEach(lessonId => {
    if (enhanced[lessonId]) {
      enhanced[lessonId] = {
        ...enhanced[lessonId],
        extractedContent: extractedData[lessonId],
        lastExtracted: new Date().toISOString()
      }
    }
  })
  
  return enhanced
}

function inferConcept(code) {
  if (code.includes('input(')) return 'input/output'
  if (code.includes('=') && !code.includes('==')) return 'variables'
  if (code.includes('random.choice')) return 'random selection'
  if (code.includes('f"') || code.includes('f\'')) return 'string formatting'
  return 'general programming'
}

// Run the extraction
if (require.main === module) {
  extractLessonData()
}

module.exports = { extractLessonData }