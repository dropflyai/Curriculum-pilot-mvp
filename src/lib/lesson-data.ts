// Sample lesson data structure for the curriculum platform

export interface LessonSection {
  type: 'content' | 'code' | 'quiz'
  title: string
  content?: string
  codeChallenge?: {
    description: string
    startingCode: string
    solution: string
    tests: string[]
  }
  quiz?: {
    type: 'mcq' | 'short'
    q: string
    options?: string[]
    answer?: string
  }[]
}

export interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  sections: LessonSection[]
}

export const sampleLessons: Lesson[] = [
  {
    id: 'python-basics-variables',
    title: 'Python Basics: Variables and Data Types',
    description: 'Learn how to create and use variables in Python, and understand different data types.',
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    sections: [
      {
        type: 'content',
        title: 'What are Variables?',
        content: `Variables in Python are like containers that store data values. Think of them as labeled boxes where you can put different types of information.

In Python, you create a variable by simply giving it a name and assigning a value to it using the equals sign (=).

Here are some examples:
• name = "Alice" (stores text/string)
• age = 15 (stores a number/integer)
• height = 5.6 (stores a decimal number/float)
• is_student = True (stores a True/False value/boolean)

Variable names should be descriptive and follow these rules:
• Start with a letter or underscore
• Can contain letters, numbers, and underscores
• Cannot contain spaces or special characters
• Cannot be Python keywords (like 'if', 'for', 'while', etc.)

Good variable names: student_name, total_score, is_complete
Bad variable names: x, data, temp, 123name`
      },
      {
        type: 'code',
        title: 'Practice: Creating Variables',
        codeChallenge: {
          description: 'Create variables to store information about yourself. Create a variable for your name, age, favorite subject, and whether you like programming.',
          startingCode: `# Create variables about yourself
# Hint: Use descriptive names and appropriate data types

# Your code here:`,
          solution: `# Create variables about yourself
my_name = "Student"
my_age = 15
favorite_subject = "Computer Science"
likes_programming = True

print(f"Name: {my_name}")
print(f"Age: {my_age}")
print(f"Favorite Subject: {favorite_subject}")
print(f"Likes Programming: {likes_programming}")`,
          tests: [
            'assert "my_name" in locals(), "Create a variable called my_name"',
            'assert isinstance(my_name, str), "my_name should be a string"',
            'assert "my_age" in locals(), "Create a variable called my_age"',
            'assert isinstance(my_age, int), "my_age should be an integer"',
            'assert "favorite_subject" in locals(), "Create a variable called favorite_subject"',
            'assert isinstance(favorite_subject, str), "favorite_subject should be a string"',
            'assert "likes_programming" in locals(), "Create a variable called likes_programming"',
            'assert isinstance(likes_programming, bool), "likes_programming should be a boolean"'
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Variables Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'Which of the following is a valid variable name in Python?',
            options: ['student_name', '2nd_place', 'class', 'student-name'],
            answer: 'student_name'
          },
          {
            type: 'mcq',
            q: 'What data type is the value True in Python?',
            options: ['string', 'integer', 'boolean', 'float'],
            answer: 'boolean'
          },
          {
            type: 'short',
            q: 'Explain in your own words what a variable is and why they are useful in programming.',
            answer: 'A variable is a container that stores data values with a descriptive name, making code more readable and allowing us to reuse and modify values easily.'
          }
        ]
      }
    ]
  },
  {
    id: 'python-magic-8-ball',
    title: 'Project: Magic 8-Ball Game',
    description: 'Build your first Python project - a digital Magic 8-Ball that gives random responses to questions.',
    difficulty: 'beginner',
    estimatedTime: '45 minutes',
    sections: [
      {
        type: 'content',
        title: 'Project Overview',
        content: `Welcome to your first Python project! We're going to build a digital Magic 8-Ball game.

A Magic 8-Ball is a toy that gives random answers to yes-or-no questions. When you shake it, a random response appears in a little window.

Our digital version will:
1. Ask the user to enter a question
2. Generate a random response from a list of possible answers
3. Display the answer to the user
4. Allow them to ask another question

This project will teach you:
• How to get input from users
• How to work with lists
• How to generate random choices
• How to use loops to repeat actions
• How to make your programs interactive

Let's start building!`
      },
      {
        type: 'code',
        title: 'Step 1: Create the Response List',
        codeChallenge: {
          description: 'Create a list called "responses" that contains at least 8 different Magic 8-Ball responses. Include positive, negative, and neutral answers.',
          startingCode: `# Create a list of Magic 8-Ball responses
# Include positive, negative, and neutral answers

responses = [
    # Add your responses here
]

# Print the list to test it
print(responses)
print(f"Number of responses: {len(responses)}")`,
          solution: `# Create a list of Magic 8-Ball responses
responses = [
    "Yes, definitely!",
    "No way!",
    "Maybe, try again later",
    "Absolutely!",
    "Don't count on it",
    "Ask again later",
    "Very likely",
    "Probably not",
    "Without a doubt",
    "Better not tell you now"
]

# Print the list to test it
print(responses)
print(f"Number of responses: {len(responses)}")`,
          tests: [
            'assert "responses" in locals(), "Create a list called responses"',
            'assert isinstance(responses, list), "responses should be a list"',
            'assert len(responses) >= 8, "Include at least 8 responses"',
            'assert all(isinstance(r, str) for r in responses), "All responses should be strings"'
          ]
        }
      },
      {
        type: 'code',
        title: 'Step 2: Complete the Magic 8-Ball',
        codeChallenge: {
          description: 'Complete the Magic 8-Ball program by adding the missing parts: import random, get user input, and select a random response.',
          startingCode: `# Import the random module
# Add your import here

responses = [
    "Yes, definitely!",
    "No way!",
    "Maybe, try again later",
    "Absolutely!",
    "Don't count on it",
    "Ask again later",
    "Very likely",
    "Probably not",
    "Without a doubt",
    "Better not tell you now"
]

print("🎱 Welcome to the Magic 8-Ball! 🎱")
print("Ask me any yes/no question and I'll give you an answer!")

while True:
    # Get a question from the user
    question = # Add your code here
    
    if question.lower() == 'quit':
        print("Thanks for playing!")
        break
    
    # Select a random response
    answer = # Add your code here
    
    print(f"🎱 The Magic 8-Ball says: {answer}")
    print()`,
          solution: `import random

responses = [
    "Yes, definitely!",
    "No way!",
    "Maybe, try again later",
    "Absolutely!",
    "Don't count on it",
    "Ask again later",
    "Very likely",
    "Probably not",
    "Without a doubt",
    "Better not tell you now"
]

print("🎱 Welcome to the Magic 8-Ball! 🎱")
print("Ask me any yes/no question and I'll give you an answer!")

while True:
    question = input("What's your question? (or type 'quit' to exit): ")
    
    if question.lower() == 'quit':
        print("Thanks for playing!")
        break
    
    answer = random.choice(responses)
    
    print(f"🎱 The Magic 8-Ball says: {answer}")
    print()`,
          tests: [
            'assert "import random" in code or "from random import" in code, "Import the random module"',
            'assert "input(" in code, "Use input() to get user question"',
            'assert "random.choice" in code or "choice(" in code, "Use random.choice to select response"'
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Magic 8-Ball Project Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'Which function do we use to select a random item from a list in Python?',
            options: ['random.select()', 'random.choice()', 'random.pick()', 'random.get()'],
            answer: 'random.choice()'
          },
          {
            type: 'mcq',
            q: 'What does the input() function return in Python?',
            options: ['A number', 'A string', 'A boolean', 'A list'],
            answer: 'A string'
          },
          {
            type: 'short',
            q: 'What would you add to make the Magic 8-Ball more interesting? Describe one enhancement you could make.',
            answer: 'Students might suggest adding more responses, asking for the user\'s name, adding colors, keeping track of questions asked, or adding different categories of responses.'
          }
        ]
      }
    ]
  }
]

export function getLessonById(id: string): Lesson | undefined {
  return sampleLessons.find(lesson => lesson.id === id)
}

export function getAllLessons(): Lesson[] {
  return sampleLessons
}