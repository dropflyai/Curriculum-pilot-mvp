import fs from 'fs'

// Read the lesson data file and check structure
const data = fs.readFileSync('./src/lib/lesson-data.ts', 'utf8')

// Count aiLessons array entries
const aiLessonsStart = data.indexOf('export const aiLessons: AILesson[] = [')
const lines = data.split('\n')

console.log('Checking lesson data structure...')

// Find lines with lesson IDs
const lessonIdLines = lines.filter(line => line.includes("id: 'week-"))
console.log('Found lesson IDs:', lessonIdLines.map(line => line.trim()))

// Check if Week 2 exists
const hasWeek2 = data.includes("id: 'week-02'")
console.log('Week 2 exists:', hasWeek2)

// Check if the array structure is correct
const hasWeek1 = data.includes("id: 'week-01'")
console.log('Week 1 exists:', hasWeek1)