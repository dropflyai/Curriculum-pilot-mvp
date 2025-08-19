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
    title: 'Python Basics: Variables and Input/Output',
    description: 'Use variables and input/output to build interactive programs that respond to users.',
    difficulty: 'beginner',
    estimatedTime: '45 minutes',
    sections: [
      {
        type: 'content',
        title: 'Building Interactive Programs',
        content: `Let's learn the building blocks of interactive programs! Every great app starts with these basics.

🎯 **Your Mission**: Build programs that talk to users and respond intelligently.

**Key Concept #1: Variables**
Variables are like labeled containers that hold information:
• user_name = "Alex" (stores what the user tells us)
• score = 95 (keeps track of numbers)
• is_ready = True (remembers yes/no answers)

**Key Concept #2: Getting Input**
Use input() to ask users questions:
• question = input("What's your question? ")
• name = input("Enter your name: ")

**Key Concept #3: Showing Output**  
Use print() to display responses:
• print("Hello there!")
• print(f"Hi {name}, nice to meet you!")

**The Magic Formula**:
1. ASK the user something → input()
2. STORE their answer → variable  
3. DO something with it → your code logic
4. SHOW the result → print()

This is how every interactive program works - from games to apps to websites!`
      },
      {
        type: 'code',
        title: 'Practice: Interactive Name Program',
        codeChallenge: {
          description: 'Build an interactive program that asks for the user\'s name and responds personally. Follow the test → fix → retest cycle to get it working!',
          startingCode: `# Interactive Name Program
# Step 1: Ask user for their name
# Step 2: Store it in a variable  
# Step 3: Print a personalized greeting

# TODO: Ask for user's name
user_name = input("What's your name? ")

# TODO: Print a greeting using their name
print("Hello " + user_name + "!")

# TEST IT: Run your code and see if it works!
# FIX IT: If there are errors, read them carefully and fix
# RETEST: Run again until it works perfectly`,
          solution: `# Interactive Name Program
user_name = input("What's your name? ")
print(f"Hello {user_name}! Welcome to CodeFly!")

# Bonus: Add more interaction
favorite_color = input("What's your favorite color? ")
print(f"Cool! {favorite_color} is a great color, {user_name}!")`,
          tests: [
            'assert "input(" in code, "Must use input() to get user name"',
            'assert "print(" in code, "Must use print() to show greeting"',
            'assert "user_name" in code or "name" in code, "Store the name in a variable"'
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Interactive Programming Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'What function do you use to ask a user for input in Python?',
            options: ['input()', 'ask()', 'get()', 'prompt()'],
            answer: 'input()'
          },
          {
            type: 'mcq',
            q: 'What function displays text on the screen for users to see?',
            options: ['show()', 'display()', 'print()', 'output()'],
            answer: 'print()'
          },
          {
            type: 'mcq',
            q: 'In the test → fix → retest cycle, what should you do FIRST when your code has an error?',
            options: ['Rewrite everything', 'Read the error message carefully', 'Ask for help immediately', 'Give up'],
            answer: 'Read the error message carefully'
          },
          {
            type: 'short',
            q: 'Describe the 4-step process for building an interactive program (ASK → STORE → DO → SHOW).',
            answer: 'ASK the user for input using input(), STORE their response in a variable, DO something with the data (process it), and SHOW the result using print().'
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
  },
  {
    id: 'python-functions',
    title: 'Functions and Parameters',
    description: 'Learn to create reusable code with functions, parameters, and return values.',
    difficulty: 'intermediate',
    estimatedTime: '45 minutes',
    sections: [
      {
        type: 'content',
        title: 'What are Functions?',
        content: `Functions are reusable blocks of code that perform specific tasks. Think of them as mini-programs within your program.

Why use functions?
• Avoid repeating code (DRY - Don't Repeat Yourself)
• Make code easier to read and understand
• Break complex problems into smaller pieces
• Test individual parts of your program

Basic function syntax:
def function_name(parameters):
    # code to execute
    return result  # optional

Example:
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Output: Hello, Alice!

Functions can have:
• No parameters: def say_hello():
• Multiple parameters: def add(x, y):
• Default parameters: def greet(name="World"):
• Return values or just perform actions`
      },
      {
        type: 'code',
        title: 'Practice: Create Your Own Functions',
        codeChallenge: {
          description: 'Create a function called calculate_grade that takes a score (0-100) and returns the letter grade (A, B, C, D, or F).',
          startingCode: `# Create a function to calculate letter grades
# A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: 0-59

def calculate_grade(score):
    # Your code here
    pass

# Test your function
print(calculate_grade(95))  # Should print A
print(calculate_grade(82))  # Should print B
print(calculate_grade(67))  # Should print D`,
          solution: `def calculate_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

# Test your function
print(calculate_grade(95))  # Should print A
print(calculate_grade(82))  # Should print B
print(calculate_grade(67))  # Should print D`,
          tests: [
            'assert calculate_grade(95) == "A", "Score 95 should return A"',
            'assert calculate_grade(82) == "B", "Score 82 should return B"',
            'assert calculate_grade(75) == "C", "Score 75 should return C"',
            'assert calculate_grade(67) == "D", "Score 67 should return D"',
            'assert calculate_grade(45) == "F", "Score 45 should return F"'
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Functions Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'What keyword is used to define a function in Python?',
            options: ['function', 'def', 'define', 'func'],
            answer: 'def'
          },
          {
            type: 'mcq',
            q: 'What does a function return if no return statement is specified?',
            options: ['None', '0', 'False', 'Empty string'],
            answer: 'None'
          },
          {
            type: 'short',
            q: 'Explain the benefits of using functions in programming.',
            answer: 'Functions make code reusable, easier to read and maintain, help organize complex programs into smaller pieces, and allow for easier testing and debugging.'
          }
        ]
      }
    ]
  },
  {
    id: 'python-lists-loops',
    title: 'Lists and Loops',
    description: 'Master Python lists and learn to automate repetitive tasks with loops.',
    difficulty: 'intermediate',
    estimatedTime: '50 minutes',
    sections: [
      {
        type: 'content',
        title: 'Working with Lists',
        content: `Lists are ordered collections that can store multiple items. They're one of the most useful data types in Python!

Creating lists:
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]

Accessing list items:
• fruits[0] → "apple" (first item)
• fruits[-1] → "orange" (last item)
• fruits[1:3] → ["banana", "orange"] (slice)

Common list methods:
• append() - add item to end
• insert() - add item at specific position
• remove() - remove specific item
• pop() - remove and return item
• len() - get number of items

For Loops:
For loops let you repeat code for each item in a list:

for fruit in fruits:
    print(f"I like {fruit}")

Range function for numbers:
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):  # 1, 2, 3, 4, 5
    print(i)`
      },
      {
        type: 'code',
        title: 'Practice: Shopping List Manager',
        codeChallenge: {
          description: 'Create a shopping list program that can add items, remove items, and display the list with numbers.',
          startingCode: `# Shopping List Manager
shopping_list = []

def add_item(item):
    # Add item to the shopping list
    pass

def remove_item(item):
    # Remove item from the shopping list if it exists
    pass

def display_list():
    # Print each item with a number (1, 2, 3...)
    pass

# Test your functions
add_item("milk")
add_item("bread")
add_item("eggs")
display_list()
remove_item("bread")
display_list()`,
          solution: `# Shopping List Manager
shopping_list = []

def add_item(item):
    shopping_list.append(item)
    print(f"Added '{item}' to shopping list")

def remove_item(item):
    if item in shopping_list:
        shopping_list.remove(item)
        print(f"Removed '{item}' from shopping list")
    else:
        print(f"'{item}' not found in shopping list")

def display_list():
    if shopping_list:
        print("Shopping List:")
        for i, item in enumerate(shopping_list, 1):
            print(f"{i}. {item}")
    else:
        print("Shopping list is empty")

# Test your functions
add_item("milk")
add_item("bread")
add_item("eggs")
display_list()
remove_item("bread")
display_list()`,
          tests: [
            'add_item("test_item")',
            'assert "test_item" in shopping_list, "Item should be added to list"',
            'remove_item("test_item")',
            'assert "test_item" not in shopping_list, "Item should be removed from list"'
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Lists and Loops Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'What is the index of the first item in a Python list?',
            options: ['1', '0', '-1', 'first'],
            answer: '0'
          },
          {
            type: 'mcq',
            q: 'Which method adds an item to the end of a list?',
            options: ['add()', 'append()', 'insert()', 'push()'],
            answer: 'append()'
          },
          {
            type: 'short',
            q: 'Write a for loop that prints numbers 1 through 5.',
            answer: 'for i in range(1, 6): print(i) or similar variations'
          }
        ]
      }
    ]
  },
  {
    id: 'python-file-handling',
    title: 'File Input and Output',
    description: 'Learn to read from and write to files, making your programs work with external data.',
    difficulty: 'intermediate',
    estimatedTime: '40 minutes',
    sections: [
      {
        type: 'content',
        title: 'Working with Files',
        content: `Files allow your programs to save and load data permanently. This is essential for creating useful applications!

Opening files:
file = open("filename.txt", "mode")

Common modes:
• "r" - read (default)
• "w" - write (overwrites existing file)
• "a" - append (adds to end of file)
• "r+" - read and write

Reading files:
# Read entire file
content = file.read()

# Read line by line
for line in file:
    print(line.strip())  # strip() removes newlines

# Read all lines into a list
lines = file.readlines()

Writing files:
file.write("Hello, World!")
file.write("\\n")  # Add newline

Best practice - use 'with' statement:
with open("data.txt", "r") as file:
    content = file.read()
# File automatically closes when done!

Common file operations:
• Save user data
• Load configuration settings
• Import/export data
• Create logs and reports`
      },
      {
        type: 'code',
        title: 'Practice: Simple Note-Taking App',
        codeChallenge: {
          description: 'Create functions to save notes to a file and read all saved notes.',
          startingCode: `# Simple Note-Taking App

def save_note(note):
    # Save a note to "notes.txt" file
    # Each note should be on a new line
    pass

def read_notes():
    # Read and return all notes from "notes.txt"
    # Return empty list if file doesn't exist
    pass

def display_notes():
    # Display all notes with numbers
    notes = read_notes()
    # Your code here
    pass

# Test your functions
save_note("Remember to buy groceries")
save_note("Call mom on Sunday")
save_note("Finish homework")
display_notes()`,
          solution: `# Simple Note-Taking App

def save_note(note):
    with open("notes.txt", "a") as file:
        file.write(note + "\\n")
    print(f"Note saved: {note}")

def read_notes():
    try:
        with open("notes.txt", "r") as file:
            return [line.strip() for line in file.readlines()]
    except FileNotFoundError:
        return []

def display_notes():
    notes = read_notes()
    if notes:
        print("Your Notes:")
        for i, note in enumerate(notes, 1):
            print(f"{i}. {note}")
    else:
        print("No notes found.")

# Test your functions
save_note("Remember to buy groceries")
save_note("Call mom on Sunday")
save_note("Finish homework")
display_notes()`,
          tests: [
            'save_note("test note")',
            'notes = read_notes()',
            'assert "test note" in notes, "Note should be saved and readable"'
          ]
        }
      },
      {
        type: 'quiz',
        title: 'File Handling Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'Which file mode is used to add content to the end of an existing file?',
            options: ['"r"', '"w"', '"a"', '"x"'],
            answer: '"a"'
          },
          {
            type: 'mcq',
            q: 'What is the advantage of using "with open()" instead of just "open()"?',
            options: ['Faster execution', 'Automatic file closing', 'Better error handling', 'All of the above'],
            answer: 'All of the above'
          },
          {
            type: 'short',
            q: 'Name three real-world applications where file handling would be useful.',
            answer: 'Examples include: saving game progress, storing user preferences, logging application events, importing data from spreadsheets, creating reports, backing up data, etc.'
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