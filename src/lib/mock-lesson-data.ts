// Mock lesson data for teacher management

export interface MockLesson {
  id: string
  week: number
  title: string
  duration_minutes: number
  unlock_rule: string
  objectives: string[]
  standards: string[]
  learn_md: string
  starter_code: string
  tests_py: string
  patterns: Record<string, unknown>
  quiz_items: Array<{
    type: 'mcq' | 'short'
    q: string
    options?: string[]
    answer?: string
  }>
  checklist: string[]
  submit_prompt: string
  rubric: Record<string, unknown>
  badges_on_complete: string[]
  created_at: string
  updated_at: string
}

export const mockLessons: MockLesson[] = [
  {
    id: 'lesson-1',
    week: 1,
    title: 'Shadow Protocol: Binary Shores Academy',
    duration_minutes: 60,
    unlock_rule: 'available',
    objectives: [
      'Master variables and basic data types in first coding mission',
      'Learn to categorize intelligence like elite coders',
      'Practice storing and manipulating classified data',
      'Apply Shadow Protocol security principles'
    ],
    standards: [
      'SC.912.ET.2.2: Describe major branches of AI',
      'SC.912.ET.2.3: Evaluate the application of algorithms to AI',
      'SC.912.ET.2.5: Describe major applications of AI & ML across fields'
    ],
    learn_md: `# 🕯️ Welcome to Binary Shores Academy - Shadow Protocol Training

**CLASSIFIED TRANSMISSION - CLEARANCE LEVEL: RECRUIT**

Congratulations, Agent. You've been selected for the elite **Shadow Protocol** program at Binary Shores Academy. Your mission: master the fundamental building blocks of digital intelligence - **variables and data types**.

## 🧠 Mission Brief: Understanding Data Types

Agent, every piece of digital intelligence begins with one fundamental concept: **data types**. Just as a spy must categorize different types of intel (classified documents, intercepted communications, surveillance photos), programmers must understand how computers categorize and store different types of information.

## 🔐 Classified Intelligence Categories (Python Data Types)

\`\`\`python
# Agent codename (string data)
agent_codename = "Shadow_Seven"

# Security clearance level (integer data)  
clearance_level = 9

# Mission status (boolean data)
mission_active = True
\`\`\`

## 📋 Protocol Rules for Variables
1. Agent codenames (variables) can contain letters, numbers, and underscores
2. Never start with a number (compromises security)
3. Case-sensitive protocols (Shadow and shadow are different agents)
4. Use descriptive codenames that maintain operational security

## 🎯 Training Exercise
Create your own agent profile and secure data classification system!`,
    starter_code: `# 🕯️ SHADOW PROTOCOL - AGENT TRAINING MODULE
# CLASSIFICATION: SECRET - EYES ONLY

# Agent Profile Creation - Secure Intelligence System
# Your mission: Create classified agent variables

# Agent codename (keep identity secure)
agent_codename = "Enter_Your_Codename"

# Security clearance level (1-10 scale)
clearance_level = 5

# Print secure agent briefing
print("🔐 AGENT BRIEFING INITIATED")
print("Codename:", agent_codename)
print("Clearance Level:", clearance_level)
print("Status: TRAINING ACTIVE")

# 🎯 YOUR CLASSIFIED MISSIONS:
# Mission 1: Create a variable for your agent's specialty skill
# Mission 2: Create a variable for years of training experience  
# Mission 3: Create a boolean for whether you're ready for field ops
# Mission 4: Print a complete agent profile using all variables

# Remember: Operational security depends on proper variable naming!`,
    tests_py: `import unittest
import sys
from io import StringIO

class TestVariables(unittest.TestCase):
    def test_variables_exist(self):
        # Test if basic variables are defined
        self.assertTrue('my_name' in locals() or 'my_name' in globals())
        self.assertTrue('lucky_number' in locals() or 'lucky_number' in globals())

if __name__ == '__main__':
    unittest.main()`,
    patterns: {},
    quiz_items: [
      {
        type: 'mcq',
        q: 'Which agent codename follows proper Shadow Protocol security?',
        options: ['2agent', 'shadow_operative', 'agent-seven', 'spy codename'],
        answer: 'shadow_operative'
      },
      {
        type: 'short',
        q: 'What type of classified data would you store in a variable called "mission_status"?',
        answer: 'Boolean data like True/False for active/inactive status'
      },
      {
        type: 'mcq',
        q: 'In Shadow Protocol training, what happens when you reassign intelligence to an existing variable?',
        options: [
          'System triggers security alert',
          'Both old and new data are stored',
          'Previous intel is overwritten with new data',
          'Operation fails silently'
        ],
        answer: 'Previous intel is overwritten with new data'
      }
    ],
    checklist: [
      'Create your agent profile with classified variables',
      'Use proper Shadow Protocol naming conventions',
      'Execute secure intelligence briefing output',
      'Update classified data and verify changes',
      'Pass all security protocol tests without errors'
    ],
    submit_prompt: 'Excellent work, Agent! Your Shadow Protocol training is complete. Submit your classified intelligence system for final evaluation.',
    rubric: {
      'Agent Profile Creation': 'Student creates complete agent variables with proper security classifications',
      'Protocol Compliance': 'Code follows Shadow Protocol naming and security standards',
      'Intelligence Operations': 'Student demonstrates understanding of data categorization and manipulation'
    },
    badges_on_complete: ['Shadow Protocol Recruit', 'Intelligence Analyst', 'Variable Specialist'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'lesson-2',
    week: 2,
    title: 'Magic 8-Ball Project',
    duration_minutes: 60,
    unlock_rule: 'after_lesson_1',
    objectives: [
      'Apply variables in a real project',
      'Learn about random number generation',
      'Practice with lists and user input',
      'Create an interactive program'
    ],
    standards: [
      'CSTA K-12 CS Standards: 1A-AP-11',
      'Florida CPALMS: MA.912.AR.3.2'
    ],
    learn_md: `# Magic 8-Ball Project

## Project Overview
Create your own digital Magic 8-Ball that gives random responses to yes/no questions!

## What You'll Learn
- How to use Python's random module
- Working with lists of responses
- Getting user input
- Creating an interactive program loop

## Magic 8-Ball Responses
Traditional Magic 8-Ball responses include:
- "It is certain"
- "Reply hazy, try again"
- "Ask again later"
- "Better not tell you now"

Let's code this together!`,
    starter_code: `import random

# List of Magic 8-Ball responses
responses = [
    "It is certain",
    "Without a doubt", 
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Don't count on it",
    "My reply is no"
]

def magic_8_ball():
    """Returns a random Magic 8-Ball response"""
    # Your code here - pick a random response from the list
    pass

# Main program
print("🎱 Welcome to the Magic 8-Ball! 🎱")
print("Ask a yes/no question and I'll give you an answer!")

# Your turn: 
# 1. Complete the magic_8_ball function
# 2. Get a question from the user using input()
# 3. Call the function and print the response`,
    tests_py: `import unittest
from unittest.mock import patch
import random

class TestMagic8Ball(unittest.TestCase):
    def test_function_exists(self):
        # Test if magic_8_ball function exists
        self.assertTrue(callable(magic_8_ball))
    
    def test_returns_string(self):
        # Test if function returns a string
        result = magic_8_ball()
        self.assertIsInstance(result, str)
        
    def test_returns_valid_response(self):
        # Test if response is from the responses list
        result = magic_8_ball()
        self.assertIn(result, responses)

if __name__ == '__main__':
    unittest.main()`,
    patterns: {},
    quiz_items: [
      {
        type: 'mcq',
        q: 'What Python module do we use to generate random numbers?',
        options: ['math', 'random', 'time', 'os'],
        answer: 'random'
      },
      {
        type: 'short',
        q: 'How do you get a random item from a list in Python?',
        answer: 'random.choice(list_name)'
      },
      {
        type: 'mcq',
        q: 'What function gets input from the user in Python?',
        options: ['get()', 'input()', 'read()', 'scan()'],
        answer: 'input()'
      }
    ],
    checklist: [
      'Complete the magic_8_ball function to return a random response',
      'Get user input for the question',
      'Display the Magic 8-Ball response',
      'Test with multiple questions',
      'Add creative touches (emojis, colors, etc.)'
    ],
    submit_prompt: 'Excellent work on your Magic 8-Ball! This project shows you can combine variables, functions, and randomness.',
    rubric: {
      'Function Implementation': 'Student correctly implements random response selection',
      'User Interaction': 'Program successfully gets user input and responds',
      'Code Quality': 'Code is well-organized and runs without errors',
      'Creativity': 'Student adds personal touches to enhance the experience'
    },
    badges_on_complete: ['Project Builder', 'Random Generator', 'Interactive Programmer'],
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-02T00:00:00Z'
  },
  {
    id: 'lesson-3',
    week: 3,
    title: 'Python Loops: Repeat with Power',
    duration_minutes: 60,
    unlock_rule: 'after_lesson_2',
    objectives: [
      'Understand the concept of loops in programming',
      'Learn to use for loops and while loops',
      'Practice with range() function',
      'Apply loops to solve problems efficiently'
    ],
    standards: [
      'CSTA K-12 CS Standards: 1A-AP-10',
      'Florida CPALMS: MA.912.AR.2.8'
    ],
    learn_md: `# Python Loops: The Power of Repetition

## Why Do We Need Loops?
Imagine you need to print "Hello" 100 times. You could write 100 print statements... or you could use a loop! Loops let computers do repetitive tasks efficiently.

## For Loops
\`\`\`python
for i in range(5):
    print("Hello", i)
\`\`\`

## While Loops
\`\`\`python
count = 0
while count < 5:
    print("Count is", count)
    count += 1
\`\`\`

## Real-World Applications
- Processing lists of data
- Creating patterns and designs
- Game mechanics (like checking for wins)
- Automating repetitive tasks`,
    starter_code: `# Python Loops Practice

print("=== FOR LOOP EXAMPLES ===")

# Example 1: Basic for loop
for i in range(5):
    print("This is iteration", i)

print("\\n=== YOUR TURN ===")
# TODO: Create a for loop that counts from 1 to 10

print("\\n=== WHILE LOOP EXAMPLES ===")

# Example 2: Basic while loop
countdown = 5
while countdown > 0:
    print("Countdown:", countdown)
    countdown -= 1
print("Blast off! 🚀")

print("\\n=== YOUR CHALLENGES ===")
# Challenge 1: Use a for loop to print your name 5 times
# Challenge 2: Use a while loop to count from 10 down to 1
# Challenge 3: Create a loop that prints even numbers from 2 to 20`,
    tests_py: `import unittest
import sys
from io import StringIO

class TestLoops(unittest.TestCase):
    def test_basic_loop_knowledge(self):
        # Test basic loop understanding through execution
        output = StringIO()
        sys.stdout = output
        
        # Test for loop
        for i in range(3):
            print(i)
            
        result = output.getvalue()
        self.assertIn('0', result)
        self.assertIn('1', result)
        self.assertIn('2', result)
        
        sys.stdout = sys.__stdout__

if __name__ == '__main__':
    unittest.main()`,
    patterns: {},
    quiz_items: [
      {
        type: 'mcq',
        q: 'What does range(5) generate?',
        options: ['Numbers 1 to 5', 'Numbers 0 to 4', 'Numbers 0 to 5', 'Numbers 1 to 4'],
        answer: 'Numbers 0 to 4'
      },
      {
        type: 'short',
        q: 'What happens if you forget to update the counter variable in a while loop?',
        answer: 'Infinite loop or the loop never executes'
      },
      {
        type: 'mcq',
        q: 'Which loop is better when you know exactly how many times to repeat?',
        options: ['for loop', 'while loop', 'Both are equal', 'Neither'],
        answer: 'for loop'
      }
    ],
    checklist: [
      'Complete the for loop counting from 1 to 10',
      'Solve all three loop challenges',
      'Test your code to ensure loops work correctly',
      'Experiment with different range values',
      'Try creating nested loops (loop inside a loop)'
    ],
    submit_prompt: 'Fantastic! You\'ve mastered the art of loops. These are fundamental building blocks in programming.',
    rubric: {
      'Loop Implementation': 'Student correctly implements both for and while loops',
      'Problem Solving': 'Student completes challenges using appropriate loop types',
      'Code Execution': 'All loops run correctly without infinite loops or errors',
      'Understanding': 'Student demonstrates when to use each type of loop'
    },
    badges_on_complete: ['Loop Master', 'Automation Expert', 'Efficient Programmer'],
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z'
  }
]

export function getMockLessonData() {
  return {
    lessons: mockLessons,
    totalLessons: mockLessons.length,
    activeLessons: mockLessons.filter(l => l.unlock_rule === 'available').length,
    completedLessons: 0 // In a real app, this would come from progress data
  }
}