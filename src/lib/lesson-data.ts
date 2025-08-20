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
    hints?: string[]
  }
  quiz?: {
    type: 'mcq' | 'short'
    q: string
    options?: string[]
    answer?: string
    explanation?: string
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
    description: 'Master the fundamentals of Python programming by building interactive programs that store data, process user input, and create engaging conversations with users.',
    difficulty: 'beginner',
    estimatedTime: '60 minutes',
    sections: [
      {
        type: 'content',
        title: 'Building Interactive Programs',
        content: `🎉 Welcome, future coder! I'm your AI instructor, and I'm SO excited to teach you programming!

Think of me as your personal coding coach. I'll guide you step-by-step, give you hints when you're stuck, and celebrate with you when you succeed! 

Today's adventure: We're going to transform you from a complete beginner into someone who can build programs that actually TALK to users! 🗣️

🎯 **Your Mission (should you choose to accept it):** Build programs that can chat with users and give smart responses - just like the apps you use every day!

**Here's how I'll teach you:**
- 📖 I'll explain concepts with fun analogies you already know
- 💻 You'll practice with interactive code examples (try changing things!)
- 🧪 I'll give you challenges to test your skills
- 🎉 We'll celebrate every victory together!

Ready to begin this coding journey? Let's make some digital magic! ✨

---

📦 CONCEPT #1: Variables (Your Computer's Memory Boxes)

**🤖 Teacher Says:** "Alright, let's start with the most important concept in programming - variables! I promise this will click once you see my analogy."

**What are variables?**
Variables are like labeled storage boxes in your computer's memory. Just like you might have different boxes in your room - one for games, one for clothes, one for school supplies - variables are containers that hold different types of information.

**My favorite real-world analogy:**
🏠 Think of variables like your phone's contacts list! Each contact has:
- A name (the label) like "Mom" or "Best Friend" 
- Stored information like phone numbers, addresses, and photos
- You can update the information anytime

Variables work EXACTLY the same way! 📱✨

**🎯 Key insight:** Every app you use (Instagram, TikTok, Snapchat) uses millions of variables to remember your username, posts, friends, and preferences!

In Python, we create these "boxes" like this:
- user_name = "Alex" (stores text someone types)
- score = 95 (stores numbers for games or grades)  
- is_ready = True (stores yes/no decisions)

<interactive-example>
code: # Try creating your own variables!
user_name = "Alex"
score = 95
is_ready = True

print(f"Student: {user_name}")
print(f"Score: {score}")
print(f"Ready to learn: {is_ready}")
title: Variable Creation Example
description: Modify the values and see how variables work!
</interactive-example>

---

🎤 CONCEPT #2: Getting Input (Asking Questions)

**🤖 Teacher Says:** "Now let's make your programs INTERACTIVE! This is where the magic happens - your program will actually talk to users!"

**What is input?**
The input() function is like your program raising its hand and asking "What do you think?" It pauses everything and waits for the user to respond - just like when I ask you a question and wait for your answer! 

**Perfect real-world analogy:**
🚗 Think of input() like a drive-thru speaker at McDonald's:
1. Worker: "Welcome! What would you like to order?" (the question)
2. You: Think about what you want... then speak your order (user types)
3. Worker: Hears your order and processes it (program gets the input)

Your program does the EXACT same thing - it asks, waits, and listens! 🎧

**🎯 Cool fact:** Every time you search on Google, log into Instagram, or text a friend, you're using input() functions!

Examples:
- question = input("What's your favorite color? ")
- name = input("What should I call you? ")

<interactive-example>
code: # Try different input questions!
favorite_color = input("What's your favorite color? ")
age = input("How old are you? ")
print(f"Cool! {favorite_color} is a great color!")
print(f"And {age} is a perfect age to learn coding!")
title: Input Function Demo
description: See how input() captures what users type
</interactive-example>

---

📢 CONCEPT #3: Showing Output (Displaying Results)

What is output?
The print() function is how your program "speaks" back to the user. It's like your program's voice - it can share information, give responses, or show results.

Real-world analogy:
Think of print() like a text message you send to a friend. When they text you "What's up?", you text back "Just coding!" That's exactly what print() does - it sends a message to whoever is using your program.

Examples:
- print("Hello there!")
- print(f"Nice to meet you, {name}!")

<interactive-example>
code: # Try different print styles!
name = "CodeFly Student"
print("Hello there!")
print("Nice to meet you, " + name + "!")
print(f"Welcome to CodeFly, {name}!")
print("🚀 Ready to code? Let's go!")
title: Print Function Magic
description: Experiment with different ways to display text
</interactive-example>

---

✨ THE MAGIC FORMULA: How All Programs Work

Every interactive program follows this simple pattern:

1. ASK → Use input() to get information from the user
2. STORE → Put that information in a variable (memory box)
3. THINK → Your program processes the information 
4. RESPOND → Use print() to show the result

This is the secret recipe behind every app you use! Instagram asks for your photo (ASK), stores it on their servers (STORE), applies filters (THINK), and shows it to your friends (RESPOND).

Ready to build your first interactive program? Let's go! 🚀`
      },
      {
        type: 'code',
        title: 'Practice: Interactive Name Program',
        codeChallenge: {
          description: '🤖 **Your First Coding Challenge!** I\'m excited to see what you build! Create an interactive program that asks for someone\'s name and gives them a personalized greeting. Don\'t worry if you get errors - that\'s how we learn! Just follow my test → fix → retest approach and you\'ll get it working! 💪',
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
          ],
          hints: [
            "🤖 **Hint 1:** Start with input()! Use this pattern: variable = input('Your question here'). I believe in you!",
            "🤖 **Hint 2:** Give your variable a clear name like 'user_name' or 'name' - this makes your code easier to read!",
            "🤖 **Hint 3:** Now use print() to show a greeting! You can combine text with your variable using + or f-strings",
            "🤖 **Pro Tip:** Try f-strings - they're my favorite! print(f'Hello {user_name}!') looks so much cleaner than using +",
            "🤖 **Stuck?** Remember: ASK (input) → STORE (variable) → RESPOND (print). You've got this! 🚀"
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
            answer: 'input()',
            explanation: 'input() is Python\'s built-in function for getting user input. It pauses the program and waits for the user to type something, then returns what they typed as a string.'
          },
          {
            type: 'mcq',
            q: 'What function displays text on the screen for users to see?',
            options: ['show()', 'display()', 'print()', 'output()'],
            answer: 'print()',
            explanation: 'print() is Python\'s way of displaying text on the screen. It\'s like the computer\'s voice - whatever you put inside print() gets shown to the user.'
          },
          {
            type: 'mcq',
            q: 'In the test → fix → retest cycle, what should you do FIRST when your code has an error?',
            options: ['Rewrite everything', 'Read the error message carefully', 'Ask for help immediately', 'Give up'],
            answer: 'Read the error message carefully',
            explanation: 'Error messages are like clues from Python telling you exactly what went wrong. Reading them carefully helps you understand the problem and fix it faster than guessing or starting over.'
          },
          {
            type: 'short',
            q: 'Describe the 4-step process for building an interactive program (ASK → STORE → DO → SHOW).',
            answer: 'ASK the user for input using input(), STORE their response in a variable, DO something with the data (process it), and SHOW the result using print().',
            explanation: 'This is the fundamental pattern of interactive programming! Every app you use follows this cycle: Instagram asks for your photo (ASK), saves it (STORE), applies filters (DO), and shows it to friends (SHOW).'
          }
        ]
      },
      {
        type: 'content',
        title: 'Advanced Variable Techniques',
        content: `🚀 Level Up Your Variable Skills!

Now that you understand the basics, let's explore more powerful ways to use variables that will make your programs even more impressive!

---

📦 ADVANCED CONCEPT #1: Multiple Assignment

Python lets you assign multiple variables at once - it's like filling several boxes simultaneously!

Real-world analogy:
Imagine you're organizing a party and need to assign roles. Instead of doing it one by one, you can assign multiple people at once: "Sarah is DJ, Mike is photographer, Lisa is food coordinator."

Examples:
- name, age, grade = "Alex", 16, 10  # Assign three variables at once!
- x, y = 10, 20  # Perfect for coordinates
- first, last = "John", "Smith"  # Great for names

<interactive-example>
code: # Try multiple assignment!
name, age, favorite_subject = "Emma", 15, "Computer Science"
print(f"Hi! I'm {name}")
print(f"I'm {age} years old")
print(f"My favorite subject is {favorite_subject}")

# You can even swap variables!
a, b = 5, 10
print(f"Before swap: a={a}, b={b}")
a, b = b, a  # Swap them!
print(f"After swap: a={a}, b={b}")
title: Multiple Assignment Magic
description: Try swapping variables and assigning multiple values at once
</interactive-example>

---

🔄 ADVANCED CONCEPT #2: Variable Types and Conversion

Variables can hold different types of data, and sometimes we need to convert between them!

Types of data:
- Strings (text): "Hello", "Python", "123"
- Integers (whole numbers): 42, -5, 0
- Floats (decimal numbers): 3.14, -2.5, 0.0
- Booleans (True/False): True, False

<interactive-example>
code: # Explore variable types!
# Getting user input (always comes as string)
age_text = input("How old are you? ")
print(f"You typed: '{age_text}' (this is text)")

# Convert to number for math
age_number = int(age_text)
print(f"As a number: {age_number}")

# Now we can do math!
years_until_18 = 18 - age_number
print(f"Years until 18: {years_until_18}")

# Check types
print(f"Type of age_text: {type(age_text)}")
print(f"Type of age_number: {type(age_number)}")
title: Type Conversion Explorer
description: See how Python handles different types of data
</interactive-example>

---

✨ ADVANCED CONCEPT #3: String Formatting Mastery

Make your output look professional with advanced string formatting!

Different ways to format strings:
1. F-strings (modern and clean): f"Hello {name}!"
2. .format() method: "Hello {}!".format(name)
3. % formatting (older style): "Hello %s!" % name

<interactive-example>
code: # Master string formatting!
name = "CodeFly Student"
score = 95.7
level = 3

# F-strings with expressions
print(f"🎓 Welcome {name}!")
print(f"📊 Your score: {score:.1f}%")  # Round to 1 decimal
print(f"⭐ Level {level} - {level * 100} XP needed for next level")

# Format with conditions
status = "Excellent" if score >= 90 else "Good" if score >= 70 else "Needs work"
print(f"🏆 Performance: {status}")

# Multi-line f-strings
report = f"""
📋 STUDENT REPORT
Name: {name}
Score: {score:.1f}%
Level: {level}
Status: {status}
🚀 Keep up the great work!
"""
print(report)
title: Professional String Formatting
description: Create beautiful, formatted output like real applications
</interactive-example>`
      },
      {
        type: 'code',
        title: 'Practice: Personal Profile Creator',
        codeChallenge: {
          description: 'Build a comprehensive personal profile program that collects multiple pieces of information and creates a formatted profile card. Use advanced variable techniques!',
          startingCode: `# Personal Profile Creator - Advanced Challenge!
# Create a program that builds a complete student profile

print("🎓 Welcome to CodeFly Profile Creator!")
print("Let's build your awesome student profile!")
print("-" * 40)

# TODO: Collect student information
# Get name, age, grade, favorite subject, and hobby
# Use descriptive prompts and store in variables

# TODO: Calculate additional information
# Calculate birth year from age
# Determine if student is in high school (grades 9-12)
# Create a fun fact about their hobby

# TODO: Create a formatted profile card
# Use f-strings to create a professional-looking profile
# Include all collected information
# Add some emoji and formatting to make it look great!

print("\\n🌟 Profile creation complete!")`,
          solution: `# Personal Profile Creator - Complete Solution!
print("🎓 Welcome to CodeFly Profile Creator!")
print("Let's build your awesome student profile!")
print("-" * 40)

# Collect student information
name = input("What's your full name? ")
age = int(input("How old are you? "))
grade = int(input("What grade are you in? "))
favorite_subject = input("What's your favorite subject? ")
hobby = input("What's your favorite hobby? ")

# Calculate additional information
import datetime
current_year = datetime.datetime.now().year
birth_year = current_year - age
is_high_school = grade >= 9 and grade <= 12
school_level = "High School" if is_high_school else "Middle School" if grade >= 6 else "Elementary"

# Create formatted profile card
print("\\n" + "=" * 50)
print("🎓 CODEFLY STUDENT PROFILE")
print("=" * 50)
print(f"👤 Name: {name}")
print(f"🎂 Age: {age} years old (born in {birth_year})")
print(f"📚 Grade: {grade} ({school_level})")
print(f"⭐ Favorite Subject: {favorite_subject}")
print(f"🎯 Hobby: {hobby}")
print(f"🏫 School Level: {school_level}")
print("-" * 50)
print(f"🌟 Fun Fact: {name} loves {hobby} and excels in {favorite_subject}!")
if is_high_school:
    print("🚀 High school coder - you're on track for amazing things!")
print("=" * 50)
print("\\n🌟 Profile creation complete! Welcome to CodeFly! ✈️")`,
          tests: [
            'assert "input(" in code, "Must collect user information with input()"',
            'assert "print(" in code, "Must display the profile with print()"',
            'assert "name" in code.lower(), "Should have a name variable"',
            'assert "age" in code.lower(), "Should have an age variable"',
            'assert "int(" in code or "float(" in code, "Should convert string input to number"'
          ],
          hints: [
            "Start by collecting all the information with input() functions",
            "Remember to convert age and grade to integers using int()",
            "Use f-strings to create professional formatting: f'Name: {name}'",
            "Calculate birth year by subtracting age from current year (use 2024)",
            "Use conditional expressions to determine school level based on grade"
          ]
        }
      },
      {
        type: 'content',
        title: 'Debugging and Problem Solving',
        content: `🔍 Becoming a Debugging Detective!

Every programmer encounters errors - it's completely normal! The key is learning how to read error messages and fix problems systematically.

---

🐛 COMMON ERROR TYPES & SOLUTIONS:

**1. NameError - "Variable not defined"**
Problem: Using a variable before creating it
Solution: Make sure you assign the variable first!

Example:
❌ print(student_name)  # Error - student_name doesn't exist yet
✅ student_name = "Alex"  # Create it first
✅ print(student_name)   # Now it works!

**2. TypeError - "Wrong data type"**
Problem: Trying to do math with text
Solution: Convert strings to numbers first!

Example:
❌ age = input("Age: ")  # This is text!
❌ next_year = age + 1   # Error - can't add 1 to text
✅ age = int(input("Age: "))  # Convert to number
✅ next_year = age + 1        # Now it works!

**3. SyntaxError - "Code structure wrong"**
Problem: Missing quotes, parentheses, or colons
Solution: Check your punctuation carefully!

Example:
❌ print("Hello World)     # Missing closing quote
❌ name = input(What's your name?)  # Missing quotes around string
✅ print("Hello World")    # Correct!
✅ name = input("What's your name?")  # Correct!

---

🛠️ THE DEBUGGING PROCESS:

1. **READ** the error message carefully
2. **LOCATE** the line number where the error occurred
3. **IDENTIFY** the type of error
4. **FIX** the specific problem
5. **TEST** your code again

Remember: Error messages are your friends! They tell you exactly what's wrong and where to look.`
      },
      {
        type: 'code',
        title: 'Debug Challenge: Fix the Broken Code',
        codeChallenge: {
          description: 'There are several errors in this code. Use your debugging skills to find and fix all the problems!',
          startingCode: `# Debug Challenge - Fix all the errors!
# This program should create a simple calculator

print("🔢 Simple Calculator)
print("Let's do some math!")

# Get two numbers from user
first_number = input("Enter first number: ")
second_number = input("Enter second number: "

# Try to add them
result = first_number + second_number
print(f"The sum is: {result}")

# Calculate some more operations
difference = first_number - second_number
product = first_number * second_number
quotient = first_number / second_number

print(f"{first_number} + {second_number} = {result}")
print(f"{first_number} - {second_number} = {difference}")
print(f"{first_number} * {second_number} = {product}")
print(f"{first_number} / {second_number} = {quotient}")

print("Thanks for using the calculator!)`,
          solution: `# Debug Challenge - Fixed version!
# This program creates a simple calculator

print("🔢 Simple Calculator")  # Fixed: Added missing closing quote
print("Let's do some math!")

# Get two numbers from user
first_number = int(input("Enter first number: "))    # Fixed: Convert to int
second_number = int(input("Enter second number: "))  # Fixed: Added missing closing parenthesis and convert to int

# Add them (now works because they're numbers)
result = first_number + second_number
print(f"The sum is: {result}")

# Calculate more operations (now all work with numbers)
difference = first_number - second_number
product = first_number * second_number
quotient = first_number / second_number

print(f"{first_number} + {second_number} = {result}")
print(f"{first_number} - {second_number} = {difference}")
print(f"{first_number} * {second_number} = {product}")
print(f"{first_number} / {second_number} = {quotient:.2f}")  # Round division to 2 decimal places

print("Thanks for using the calculator!")  # Fixed: Added missing closing quote`,
          tests: [
            'assert "print(\\"🔢 Simple Calculator\\")" in code, "Fix the missing quote in the first print"',
            'assert "int(" in code, "Convert input strings to integers"',
            'assert "input(\\"Enter second number: \\"))" in code, "Fix the missing closing parenthesis"',
            'assert "print(\\"Thanks for using the calculator!\\")" in code, "Fix the missing quote in the last print"'
          ],
          hints: [
            "Look for missing quotes in print statements",
            "Check for missing closing parentheses in input() calls", 
            "Remember to convert input() results to numbers using int()",
            "The error messages will tell you exactly which line has problems!"
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Comprehensive Python Basics Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'What happens when you try to do math with a string in Python?',
            options: ['It works fine', 'You get a TypeError', 'Python automatically converts it', 'The program crashes'],
            answer: 'You get a TypeError',
            explanation: 'Python is strict about data types. You need to explicitly convert strings to numbers using int() or float() before doing math operations.'
          },
          {
            type: 'mcq',
            q: 'Which is the most modern and recommended way to format strings in Python?',
            options: ['f"Hello {name}"', '"Hello " + name', '"Hello %s" % name', '"Hello {}".format(name)'],
            answer: 'f"Hello {name}"',
            explanation: 'F-strings (formatted string literals) are the most modern, readable, and efficient way to format strings in Python. They were introduced in Python 3.6.'
          },
          {
            type: 'mcq',
            q: 'What does this code do: a, b = b, a ?',
            options: ['Creates an error', 'Swaps the values of a and b', 'Assigns the same value to both', 'Compares a and b'],
            answer: 'Swaps the values of a and b',
            explanation: 'This is Python\'s elegant way to swap variables. The right side creates a tuple (b, a), which is then unpacked into a, b on the left side.'
          },
          {
            type: 'short',
            q: 'Explain why input() always returns a string and how you would convert it to use in mathematical calculations.',
            answer: 'input() returns a string because users can type anything (letters, numbers, symbols). To use input for math, you must convert it using int() for whole numbers or float() for decimals: age = int(input("Your age: "))',
            explanation: 'Understanding data types is crucial for programming. input() treats everything as text to be safe, and explicit conversion prevents errors while making your intentions clear.'
          },
          {
            type: 'short',
            q: 'List three different types of errors you might encounter in Python and give a brief example of what causes each.',
            answer: 'NameError (using undefined variables), TypeError (wrong data type operations like "5" + 5), SyntaxError (missing quotes, parentheses, or incorrect Python syntax).',
            explanation: 'Recognizing error types helps you debug faster. Each error type has specific causes and solutions, making you a more efficient programmer.'
          }
        ]
      }
    ]
  },
  {
    id: 'python-magic-8-ball',
    title: 'Project: Magic 8-Ball Game',
    description: 'Build your first complete Python project - a digital Magic 8-Ball with advanced features, customization options, and real-world programming techniques.',
    difficulty: 'beginner',
    estimatedTime: '60 minutes',
    sections: [
      {
        type: 'content',
        title: 'Project Overview',
        content: `🎮 **OH MY GOSH, I'M SO EXCITED!** This is going to be your first COMPLETE Python project! 

🤖 **Teacher Says:** "We're about to build something absolutely AMAZING together - a digital Magic 8-Ball! By the end of this lesson, you'll have created a real program that your friends and family can actually use. How cool is that?!"

✨ Imagine having a wise digital friend who always gives you interesting answers to your questions. That's exactly what we're building today - your very own mystical fortune teller that lives inside your computer!

---

🎱 **What is a Magic 8-Ball?**

Real-world connection:
You know those black plastic balls you see in movies where someone asks a question, shakes it, and an answer appears in a little window? That's a Magic 8-Ball! People have been using them for decades to get "mystical" answers to their yes-or-no questions.

Now we're bringing this classic toy into the digital world using Python!

---

🎯 **What Our Digital Magic 8-Ball Will Do:**

Think of your program like a helpful robot assistant:

1. **LISTEN** → Ask the user to enter their question (just like asking Siri or Alexa)
2. **THINK** → Randomly pick an answer from our list of responses (like shuffling cards)
3. **RESPOND** → Display the mystical answer to the user (like getting a text back)
4. **REPEAT** → Let them ask another question (because one question is never enough!)

---

🧠 **What You'll Learn (These Skills Transfer Everywhere!):**

📝 **User Input** → Essential for apps, games, websites - everything interactive!
📋 **Lists** → The building blocks of data storage (like your phone's photo gallery)
🎲 **Random Selection** → Used in games, shuffling playlists, picking random posts on social media
🔄 **Loops** → How to make your program repeat tasks (like Instagram refreshing your feed)
🎭 **Interactive Programming** → The foundation of every app you use daily!

---

✨ **The Cool Part:**
By the end of this project, you'll have built something that actually works and is fun to use! You could show it to friends, family, or even use it yourself when you need to make a decision.

Ready to create some digital magic? Let's build! 🚀`
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
          ],
          hints: [
            "Don't forget to import the random module at the top: import random",
            "Use input() to ask the user for their question",
            "Use random.choice(responses) to pick a random answer from your list",
            "Make sure your while loop continues forever (while True:) so users can ask multiple questions"
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
      },
      {
        type: 'content',
        title: 'Advanced Magic 8-Ball Features',
        content: `🚀 Level Up Your Magic 8-Ball!

Now that you have a basic Magic 8-Ball working, let's add some amazing features that will make it feel like a real app!

---

⭐ ENHANCEMENT #1: Personalized Experience

Make your Magic 8-Ball remember the user and give personalized responses!

<interactive-example>
code: import random

# Get user's name for personalization
name = input("Welcome to the Magic 8-Ball! What's your name? ")
print(f"Nice to meet you, {name}! 🎱")

responses = [
    f"Yes, definitely {name}!",
    f"No way, {name}!",
    f"Maybe, {name}. Try again later.",
    f"Absolutely, {name}!",
    f"Don't count on it, {name}.",
    f"Ask again later, {name}.",
    f"Very likely, {name}!",
    f"Probably not, {name}.",
    f"Without a doubt, {name}!",
    f"Better not tell you now, {name}."
]

question = input(f"What's your question, {name}? ")
answer = random.choice(responses)
print(f"🎱 The Magic 8-Ball says: {answer}")
title: Personalized Magic 8-Ball
description: See how personalization makes programs more engaging!
</interactive-example>

---

🎨 ENHANCEMENT #2: Different Response Categories

Real Magic 8-Balls have different types of responses. Let's organize ours!

<interactive-example>
code: import random

# Organize responses by type
positive_responses = [
    "Yes, definitely!",
    "Absolutely!",
    "Without a doubt!",
    "Very likely!",
    "Signs point to yes!"
]

negative_responses = [
    "No way!",
    "Don't count on it!",
    "Probably not!",
    "Very doubtful!",
    "My sources say no!"
]

neutral_responses = [
    "Maybe, try again later",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again"
]

# Combine all responses
all_responses = positive_responses + negative_responses + neutral_responses

question = input("What's your question? ")
answer = random.choice(all_responses)

# Add some fun based on response type
if answer in positive_responses:
    print(f"🎱✨ {answer} ✨")
elif answer in negative_responses:
    print(f"🎱❌ {answer} ❌")
else:
    print(f"🎱❓ {answer} ❓")
title: Categorized Responses
description: Organize your code for better structure!
</interactive-example>

---

📊 ENHANCEMENT #3: Question Tracking

Let's make our Magic 8-Ball keep track of questions asked!

<interactive-example>
code: import random

responses = ["Yes!", "No!", "Maybe!", "Ask again!", "Very likely!"]
questions_asked = 0
questions_list = []

print("🎱 Welcome to the Smart Magic 8-Ball! 🎱")

while True:
    question = input("\\nWhat's your question? (or 'quit' to exit, 'stats' for statistics): ")
    
    if question.lower() == 'quit':
        print(f"\\nThanks for asking {questions_asked} questions!")
        break
    elif question.lower() == 'stats':
        print(f"\\n📊 You've asked {questions_asked} questions so far!")
        if questions_list:
            print("Your recent questions:")
            for i, q in enumerate(questions_list[-3:], 1):  # Show last 3
                print(f"  {i}. {q}")
        continue
    
    # Count and store the question
    questions_asked += 1
    questions_list.append(question)
    
    answer = random.choice(responses)
    print(f"🎱 Answer #{questions_asked}: {answer}")
title: Question Tracking System
description: Learn how to track data and provide statistics!
</interactive-example>`
      },
      {
        type: 'code',
        title: 'Project: Enhanced Magic 8-Ball Challenge',
        codeChallenge: {
          description: 'Build an advanced Magic 8-Ball with multiple features: user name, response categories, question tracking, and special commands!',
          startingCode: `# Advanced Magic 8-Ball Project
# Build a feature-rich Magic 8-Ball application!

import random

# TODO: Create different categories of responses
positive_responses = [
    # Add 5 positive responses here
]

negative_responses = [
    # Add 5 negative responses here  
]

neutral_responses = [
    # Add 5 neutral responses here
]

# TODO: Get user's name and greet them personally
print("🎱 Welcome to the Advanced Magic 8-Ball! 🎱")
# Get user name here

# TODO: Initialize tracking variables
questions_asked = 0
questions_list = []

print("Commands: ask questions, type 'stats' for statistics, 'quit' to exit")

# TODO: Create main game loop
while True:
    # Get user input
    
    # Handle 'quit' command
    
    # Handle 'stats' command - show question count and recent questions
    
    # Process regular questions
    # - Count the question
    # - Store the question  
    # - Pick random response from all categories
    # - Display with appropriate emoji based on category
    
print("Thanks for playing!")`,
          solution: `# Advanced Magic 8-Ball Project - Complete Solution!
import random

# Different categories of responses
positive_responses = [
    "Yes, definitely!",
    "Absolutely!",
    "Without a doubt!",
    "Very likely!",
    "Signs point to yes!"
]

negative_responses = [
    "No way!",
    "Don't count on it!",
    "Probably not!",
    "Very doubtful!",
    "My sources say no!"
]

neutral_responses = [
    "Maybe, try again later",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again"
]

# Get user's name and greet them
print("🎱 Welcome to the Advanced Magic 8-Ball! 🎱")
name = input("What's your name? ")
print(f"\\nNice to meet you, {name}! Ready for some mystical answers? ✨")

# Initialize tracking variables
questions_asked = 0
questions_list = []
all_responses = positive_responses + negative_responses + neutral_responses

print("\\nCommands: ask questions, type 'stats' for statistics, 'quit' to exit")

# Main game loop
while True:
    question = input(f"\\n{name}, what's your question? ")
    
    # Handle quit command
    if question.lower() == 'quit':
        print(f"\\nThanks for playing, {name}! You asked {questions_asked} great questions! 🎱✨")
        break
    
    # Handle stats command
    elif question.lower() == 'stats':
        print(f"\\n📊 {name}'s Magic 8-Ball Statistics:")
        print(f"   Total questions asked: {questions_asked}")
        if questions_list:
            print("   Your recent questions:")
            for i, q in enumerate(questions_list[-3:], 1):
                print(f"     {i}. {q}")
        else:
            print("   No questions asked yet!")
        continue
    
    # Process regular questions
    questions_asked += 1
    questions_list.append(question)
    
    # Pick response and determine category
    answer = random.choice(all_responses)
    
    # Display with appropriate emoji based on category
    if answer in positive_responses:
        print(f"\\n🎱✨ Answer #{questions_asked}: {answer} ✨")
    elif answer in negative_responses:
        print(f"\\n🎱❌ Answer #{questions_asked}: {answer} ❌")
    else:
        print(f"\\n🎱❓ Answer #{questions_asked}: {answer} ❓")`,
          tests: [
            'assert "import random" in code, "Must import random module"',
            'assert "positive_responses" in code, "Create positive responses list"',
            'assert "negative_responses" in code, "Create negative responses list"',
            'assert "neutral_responses" in code, "Create neutral responses list"',
            'assert "questions_asked" in code, "Track number of questions"',
            'assert "while True:" in code, "Use infinite loop for continuous play"',
            'assert "input(" in code, "Get user input for questions"'
          ],
          hints: [
            "Create three separate lists for different types of responses",
            "Use a counter variable to track how many questions have been asked",
            "Store questions in a list so you can show recent ones in stats",
            "Use if/elif/else to handle different commands (quit, stats, regular questions)",
            "Combine all response lists to pick from: all_responses = list1 + list2 + list3"
          ]
        }
      },
      {
        type: 'content',
        title: 'Programming Concepts in Action',
        content: `🧠 What You've Learned Through Building!

By creating your Magic 8-Ball, you've actually learned some fundamental programming concepts that are used in real software development!

---

🏗️ CORE PROGRAMMING CONCEPTS YOU'VE MASTERED:

**1. Data Structures (Lists)**
Your response lists are data structures - organized ways to store information. Real apps use these constantly:
- Spotify stores your playlists in lists
- Instagram stores your photos in lists  
- Games store high scores in lists

**2. Control Flow (Loops and Conditions)**
Your while loop and if statements control how your program flows:
- Apps use loops to keep running until you close them
- Games use conditions to check if you won or lost
- Websites use loops to display all your posts

**3. User Interaction (Input/Output)**
Getting input and showing output is how all programs communicate:
- Every app takes your clicks, taps, and typing as input
- Every screen you see is output from a program
- Your Magic 8-Ball does both!

**4. Randomness (Random Module)**
Random selection makes programs unpredictable and fun:
- Games use randomness for generating levels
- Social media shuffles your feed randomly
- Music apps shuffle your songs

**5. State Management (Variables)**
Keeping track of information while your program runs:
- Games remember your score and level
- Apps remember if you're logged in
- Your Magic 8-Ball remembers questions asked

---

🌟 REAL-WORLD APPLICATIONS:

Your Magic 8-Ball project contains the same building blocks as:
- **Gaming Apps**: Random events, user interaction, score tracking
- **Chat Bots**: Responding to user input with relevant messages  
- **Quiz Apps**: Asking questions, tracking responses, showing statistics
- **Social Media**: User input, data storage, personalized responses

---

🚀 NEXT STEPS IN YOUR CODING JOURNEY:

Now that you understand these concepts, you can build:
- **Number guessing games** (using random numbers and loops)
- **Quiz applications** (using lists of questions and score tracking)
- **Chat programs** (using input/output and response logic)
- **Simple calculators** (using functions and user input)

Every complex application starts with these same simple building blocks!`
      },
      {
        type: 'code',
        title: 'Final Challenge: Magic 8-Ball Variations',
        codeChallenge: {
          description: 'Choose one variation to implement: Magic 8-Ball for different topics (love, career, school) OR a Magic 8-Ball that gives advice instead of yes/no answers!',
          startingCode: `# Magic 8-Ball Variations Challenge
# Choose ONE of these variations to implement:

# OPTION 1: Topic-Specific Magic 8-Ball
# Create different sets of responses for different life areas
# Topics: Love, Career, School, Sports, etc.

# OPTION 2: Advice Magic 8-Ball  
# Instead of yes/no, give actual advice
# Examples: "Follow your heart", "Work harder", "Ask a friend"

import random

print("🎱 Welcome to the Specialized Magic 8-Ball! 🎱")

# TODO: Choose your variation and implement it!
# Include:
# - User name personalization
# - Multiple response categories
# - At least 15 different responses total
# - Question tracking
# - Special commands (stats, quit)

# Your creative implementation goes here!`,
          solution: `# Magic 8-Ball Variations - Topic-Specific Version
import random

# Topic-specific responses
love_responses = [
    "Your heart knows the answer!",
    "Love will find a way!",
    "Be patient, good things come to those who wait",
    "Follow your feelings!",
    "True love never fails!"
]

career_responses = [
    "Hard work always pays off!",
    "Believe in your abilities!",
    "Every expert was once a beginner",
    "Success comes to those who try!",
    "Your future is bright!"
]

school_responses = [
    "Study hard and you'll succeed!",
    "Knowledge is power!",
    "Every mistake is a learning opportunity!",
    "You've got this!",
    "Practice makes perfect!"
]

general_responses = [
    "Trust yourself!",
    "Everything happens for a reason",
    "Stay positive!",
    "Good things are coming!",
    "Believe in yourself!"
]

print("🎱 Welcome to the Life Coach Magic 8-Ball! 🎱")
name = input("What's your name? ")
print(f"\\nHi {name}! I give advice for different areas of life!")

questions_asked = 0
questions_by_topic = {"love": 0, "career": 0, "school": 0, "general": 0}

print("\\nTopics: love, career, school, general")
print("Commands: 'stats' for statistics, 'quit' to exit")

while True:
    user_input = input(f"\\n{name}, what topic is your question about? (or ask directly): ")
    
    if user_input.lower() == 'quit':
        print(f"\\nThanks {name}! You asked {questions_asked} questions across all topics! 🌟")
        break
    elif user_input.lower() == 'stats':
        print(f"\\n📊 {name}'s Question Statistics:")
        print(f"   Total questions: {questions_asked}")
        for topic, count in questions_by_topic.items():
            print(f"   {topic.title()}: {count} questions")
        continue
    
    # Determine topic and get question
    if user_input.lower() in ['love', 'career', 'school']:
        topic = user_input.lower()
        question = input(f"What's your {topic} question? ")
    else:
        topic = 'general'
        question = user_input
    
    # Track questions
    questions_asked += 1
    questions_by_topic[topic] += 1
    
    # Give appropriate advice
    if topic == 'love':
        advice = random.choice(love_responses)
        emoji = "💕"
    elif topic == 'career':
        advice = random.choice(career_responses)
        emoji = "💼"
    elif topic == 'school':
        advice = random.choice(school_responses)
        emoji = "📚"
    else:
        advice = random.choice(general_responses)
        emoji = "⭐"
    
    print(f"\\n🎱{emoji} Life Coach says: {advice} {emoji}")`,
          tests: [
            'assert "import random" in code, "Must import random module"',
            'assert "input(" in code, "Must get user input"',
            'assert "while True:" in code, "Must have main game loop"',
            'assert "random.choice" in code, "Must use random selection"'
          ],
          hints: [
            "Think about what topics interest you most - relationships, school, future career?",
            "Create separate lists of responses for each topic",
            "Use if/elif statements to determine which topic the user is asking about",
            "Track questions by topic using a dictionary: {'love': 0, 'career': 0}",
            "Make your responses encouraging and positive - this is meant to be fun!"
          ]
        }
      },
      {
        type: 'quiz',
        title: 'Advanced Programming Concepts Quiz',
        quiz: [
          {
            type: 'mcq',
            q: 'What programming concept allows you to repeat code until a condition is met?',
            options: ['Variables', 'Lists', 'Loops', 'Functions'],
            answer: 'Loops',
            explanation: 'Loops (like while True:) allow code to repeat continuously or until a specific condition is met. They\'re essential for interactive programs that need to keep running.'
          },
          {
            type: 'mcq',
            q: 'Which data structure is best for storing multiple related items in Python?',
            options: ['Variables', 'Lists', 'Strings', 'Numbers'],
            answer: 'Lists',
            explanation: 'Lists are perfect for storing collections of related items, like your Magic 8-Ball responses. They keep items organized and make it easy to work with multiple pieces of data.'
          },
          {
            type: 'mcq',
            q: 'What makes a program "interactive"?',
            options: ['Using loops', 'Using lists', 'Getting user input and responding', 'Using random numbers'],
            answer: 'Getting user input and responding',
            explanation: 'Interactive programs respond to user input. Your Magic 8-Ball is interactive because it asks for questions and gives personalized responses.'
          },
          {
            type: 'short',
            q: 'Explain how the Magic 8-Ball project demonstrates the "ASK → STORE → PROCESS → SHOW" pattern of interactive programming.',
            answer: 'ASK: Get user question with input(). STORE: Save question in variables/lists. PROCESS: Use random.choice() to select response and count questions. SHOW: Display answer with print() and formatting.',
            explanation: 'This pattern is fundamental to all interactive applications. Your Magic 8-Ball follows it perfectly, just like real apps do!'
          },
          {
            type: 'short',
            q: 'Name three ways you could enhance the Magic 8-Ball further and explain why each would be useful.',
            answer: 'Examples: Save questions to a file (persistence), add graphics (better user experience), connect to internet for real fortune telling (external data), add sound effects (multimedia), create categories like horoscopes (specialized functionality).',
            explanation: 'These enhancements introduce advanced programming concepts like file handling, user interfaces, networking, and multimedia - all building on the foundation you\'ve already learned!'
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
    estimatedTime: '60 minutes',
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