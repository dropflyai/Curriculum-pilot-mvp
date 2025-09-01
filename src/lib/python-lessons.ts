// Week 1 & 2: Python Fundamentals - Interactive & Gamified Lessons
// Based on CodeFly Curriculum: Foundation Phase (Weeks 1-6)

export interface PythonChallenge {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp_reward: number
  badge_reward?: string
  starter_code: string
  solution_code: string
  test_cases: string[]
  hints: string[]
  fun_facts: string[]
}

export interface GameElement {
  type: 'xp_boost' | 'time_challenge' | 'code_battle' | 'debug_quest'
  title: string
  description: string
  bonus_xp: number
}

export interface PythonLesson {
  id: string
  week: number
  title: string
  subtitle: string
  emoji: string
  description: string
  learning_objectives: string[]
  total_xp: number
  estimated_time: string
  concepts: {
    name: string
    emoji: string
    explanation: string
    code_example: string
  }[]
  challenges: PythonChallenge[]
  game_elements: GameElement[]
  final_project: {
    title: string
    description: string
    requirements: string[]
    bonus_features: string[]
    xp_reward: number
    badge_reward: string
  }
}

export const pythonLessons: PythonLesson[] = [
  {
    id: 'python-week-1',
    week: 1,
    title: 'Welcome to CodeQuest',
    subtitle: 'Your First Interactive Program',
    emoji: '🚀',
    description: 'Begin your coding adventure! Learn Python basics by creating your very first interactive program. Experience the magic of making computers respond to you!',
    learning_objectives: [
      'Write your first Python program that talks back to you',
      'Master the print() function to display awesome messages',
      'Use input() to create interactive experiences', 
      'Understand variables and how they store information',
      'Create personalized programs that remember your name',
      'Debug common beginner mistakes like a pro'
    ],
    total_xp: 250,
    estimated_time: '60 minutes',
    concepts: [
      {
        name: 'The print() Function - Your Voice to the World',
        emoji: '📢',
        explanation: 'The print() function is like a megaphone for your program! It displays messages on the screen so humans can see what your code is thinking. Every Python programmer starts here!',
        code_example: `# Make your computer talk!
print("Hello, world! I'm alive! 🤖")
print("My name is Python, and I love to help!")
print("Today we're going to build something amazing!")`
      },
      {
        name: 'The input() Function - Listening to Users',
        emoji: '👂',
        explanation: 'The input() function is like giving your program ears! It waits for the user to type something and then remembers what they said. This makes your programs interactive and personal!',
        code_example: `# Get to know your user!
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")

favorite_color = input("What's your favorite color? ")
print(f"{favorite_color} is an awesome choice!")`
      },
      {
        name: 'Variables - Your Program\'s Memory',
        emoji: '🧠',
        explanation: 'Variables are like labeled boxes where your program stores information. Once you put something in a variable, your program can remember it and use it later!',
        code_example: `# Creating variables is like labeling boxes
player_name = "Alex"
player_level = 1
player_xp = 0
is_ready = True

print(f"Player: {player_name}")
print(f"Level: {player_level}")
print(f"XP: {player_xp}")
print(f"Ready to code: {is_ready}")`
      },
      {
        name: 'F-Strings - Mixing Text and Variables',
        emoji: '🎨',
        explanation: 'F-strings let you mix variables with text in a super clean way! Just put an f before your quote marks and use {variable_name} to insert values. It\'s like mad libs for programmers!',
        code_example: `# F-strings make text dynamic and fun!
name = "Sarah"
age = 15
favorite_subject = "Computer Science"

print(f"Hi! My name is {name}.")
print(f"I'm {age} years old.")
print(f"I love {favorite_subject}!")
print(f"In 5 years, I'll be {age + 5} and hopefully a coding master!")`
      }
    ],
    challenges: [
      {
        id: 'hello-world-plus',
        title: '🌟 Hello World Plus+',
        description: 'Create a greeting program that introduces you and shares 3 fun facts about yourself. Make it colorful with emojis!',
        difficulty: 'beginner',
        xp_reward: 25,
        starter_code: `# 🌟 Hello World Plus+ Challenge
# Create an awesome introduction program!

# TODO: Print a greeting with your name
# TODO: Share 3 fun facts about yourself  
# TODO: Add emojis to make it colorful
# TODO: Use at least 4 print statements

print("Challenge starter code - replace this with your introduction!")`,
        solution_code: `# 🌟 Hello World Plus+ Solution
print("🎉 Hello, CodeQuest adventurers!")
print("💫 My name is Alex, and I'm ready to code!")
print("")
print("🎮 Fun fact 1: I love playing video games")
print("🎨 Fun fact 2: I draw digital art in my free time") 
print("🚀 Fun fact 3: I want to build my own game someday")
print("")
print("✨ Let's code something amazing together!")`,
        test_cases: [
          'Program prints at least 4 lines of output',
          'Output includes your name',
          'Program shares 3 fun facts',
          'Uses emojis for visual appeal',
          'Code runs without errors'
        ],
        hints: [
          'Use print() statements to display text',
          'Add emojis by copying and pasting them: 🎉✨🚀',
          'Use empty print("") to create blank lines for spacing',
          'Make each fun fact on its own line for better readability'
        ],
        fun_facts: [
          'The first "Hello, World!" program was written in 1972!',
          'Every programmer writes their first Hello World - you\'re joining millions!',
          'Adding emojis makes your code more engaging and fun to read!'
        ]
      },
      {
        id: 'name-personality-quiz',
        title: '🎭 Interactive Personality Quiz',
        description: 'Build a mini personality quiz that asks the user questions and creates a fun profile based on their answers!',
        difficulty: 'beginner',
        xp_reward: 50,
        badge_reward: 'Input Master',
        starter_code: `# 🎭 Interactive Personality Quiz
# Create a quiz that gets to know your user!

# TODO: Ask for the user's name
# TODO: Ask 3 personality questions (favorite color, hobby, dream job, etc.)  
# TODO: Store answers in variables
# TODO: Create a fun summary using their answers
# TODO: Use f-strings to make it personal

print("🎭 Welcome to the Personality Quiz!")
# Your code here!`,
        solution_code: `# 🎭 Interactive Personality Quiz Solution
print("🎭 Welcome to the Ultimate Personality Quiz!")
print("Let's get to know the real you! ✨")
print()

# Get user information
name = input("What's your name? ")
favorite_color = input("What's your favorite color? ")  
dream_job = input("What's your dream job? ")
superpower = input("If you could have one superpower, what would it be? ")

print()
print("🎉 Quiz Results 🎉")
print("=" * 30)
print(f"Name: {name}")
print(f"Favorite Color: {favorite_color}")
print(f"Dream Job: {dream_job}")  
print(f"Desired Superpower: {superpower}")
print()
print(f"🌟 {name}, you sound like an amazing person!")
print(f"🎨 I bet you'd look great wearing {favorite_color}!")
print(f"💼 A future {dream_job} - how exciting!")
print(f"⚡ With {superpower} powers, you'd be unstoppable!")
print()
print("Thanks for taking the quiz! Keep being awesome! 🚀")`,
        test_cases: [
          'Program asks for user name and stores it',
          'Asks at least 3 different questions',
          'Stores all answers in variables',
          'Uses f-strings to personalize responses',
          'Creates a fun summary of the user',
          'Program is interactive and engaging'
        ],
        hints: [
          'Use input() to ask questions and store in variables',
          'Ask fun questions like favorite color, hobby, or dream job',
          'Use f-strings like f"Hi {name}!" to personalize responses',
          'Add empty print() statements to create nice spacing',
          'Make your final summary enthusiastic and positive!'
        ],
        fun_facts: [
          'Interactive programs feel like magic to users - you\'re the wizard!',
          'Personalization makes users 73% more engaged with programs',
          'Every app you use started with simple input/output like this!'
        ]
      },
      {
        id: 'mad-libs-generator',
        title: '📝 Mad Libs Story Generator', 
        description: 'Create a hilarious Mad Libs generator that asks for different types of words and creates a funny story!',
        difficulty: 'intermediate',
        xp_reward: 75,
        starter_code: `# 📝 Mad Libs Story Generator
# Create a story that users fill in with their own words!

print("🎪 Welcome to the Mad Libs Story Generator!")
print("I'll ask you for some words, then create a hilarious story!")
print()

# TODO: Ask for different types of words (nouns, verbs, adjectives, etc.)
# TODO: Store each word in a variable
# TODO: Create a funny story using all their words  
# TODO: Make the story entertaining and surprising!

# Your creative story here!`,
        solution_code: `# 📝 Mad Libs Story Generator Solution
print("🎪 Welcome to the Mad Libs Story Generator!")
print("I'll ask you for some words, then create a hilarious story!")
print()

# Collect words for the story
name = input("Enter a name: ")
adjective1 = input("Enter an adjective (like funny, scary, or weird): ")
noun1 = input("Enter a noun (person, place, or thing): ")
verb1 = input("Enter a verb (action word): ")
adjective2 = input("Enter another adjective: ")
noun2 = input("Enter another noun: ")
number = input("Enter a number: ")
color = input("Enter a color: ")
animal = input("Enter an animal: ")

print()
print("📖 Your Mad Libs Story!")
print("=" * 40)
print()
print(f"Once upon a time, there was a {adjective1} student named {name}.")
print(f"Every day, {name} would {verb1} to the {noun1} to practice coding.")
print(f"One day, {name} discovered a {adjective2} {noun2} that could teach Python!")
print(f"The {noun2} said, 'If you practice for {number} hours, I'll give you a {color} {animal} as a reward!'")
print(f"So {name} coded day and night, and sure enough, received the magical {color} {animal}!")
print(f"From that day forward, {name} became the most {adjective1} programmer in the land!")
print()
print("🎉 The End! Hope you enjoyed your silly story!")`,
        test_cases: [
          'Program asks for at least 8 different words',
          'Collects various word types (nouns, adjectives, verbs)',
          'Creates a complete story using all collected words',
          'Story is entertaining and makes sense',
          'Uses f-strings properly to insert words',
          'Has a clear beginning, middle, and end'
        ],
        hints: [
          'Ask for specific types of words: nouns, verbs, adjectives, colors',
          'Store each word in a clearly named variable',
          'Plan your story first, then add the variable placeholders',
          'Make the story silly and unexpected for maximum fun!',
          'Test your story with different words to make sure it works'
        ],
        fun_facts: [
          'Mad Libs were invented in 1953 and are still popular today!',
          'This challenge teaches string formatting - a key programming skill',
          'Many game developers started by creating simple text-based adventures!'
        ]
      }
    ],
    game_elements: [
      {
        type: 'xp_boost',
        title: '🚀 Speed Coder Bonus',
        description: 'Complete any challenge in under 10 minutes for double XP!',
        bonus_xp: 50
      },
      {
        type: 'code_battle',
        title: '⚔️ Print Statement Duel',
        description: 'Challenge a classmate: Who can create the most creative print statement in 2 minutes?',
        bonus_xp: 25
      },
      {
        type: 'debug_quest', 
        title: '🐛 Bug Hunter Mission',
        description: 'Find and fix 3 common beginner mistakes in provided broken code',
        bonus_xp: 40
      }
    ],
    final_project: {
      title: '🎮 Choose Your Own Adventure Game',
      description: 'Create an interactive text-based adventure where the user makes choices that affect the story outcome!',
      requirements: [
        'Welcome the user and get their name',
        'Present at least 3 different choices/scenarios',
        'Use variables to track user decisions',
        'Create at least 2 different story endings',
        'Make it engaging with descriptions and emojis',
        'Use proper variable names and f-strings'
      ],
      bonus_features: [
        'Add a scoring system or inventory',
        'Include ASCII art for different scenes',
        'Create more than 2 possible endings',
        'Add character stats (health, magic, etc.)',
        'Include sound effects with text descriptions'
      ],
      xp_reward: 100,
      badge_reward: 'Python Pioneer'
    }
  },
  {
    id: 'python-week-2', 
    week: 2,
    title: 'Loops & Events',
    subtitle: 'Build an Epic Clicker Game',
    emoji: '🎯',
    description: 'Master the power of loops and events by building an addictive clicker game! Learn how repetition makes programs powerful and interactive.',
    learning_objectives: [
      'Understand how loops make code repeat automatically',
      'Master while loops for continuous action',
      'Use for loops to repeat exact amounts',
      'Handle user events and input validation',
      'Create variables that change over time',
      'Build a complete interactive game with scoring'
    ],
    total_xp: 300,
    estimated_time: '90 minutes',
    concepts: [
      {
        name: 'While Loops - The Endless Cycle',
        emoji: '🔄',
        explanation: 'While loops keep running as long as a condition is True. They\'re perfect for games, menus, and any time you want your program to keep going until something specific happens!',
        code_example: `# While loop that counts down like a rocket launch!
countdown = 10

while countdown > 0:
    print(f"🚀 Launching in {countdown}...")
    countdown = countdown - 1
    
print("🌟 BLAST OFF! 🌟")

# Game loop example
playing = True
score = 0

while playing:
    action = input("Press 'c' to click, 'q' to quit: ")
    if action == 'c':
        score += 1
        print(f"💰 Score: {score}")
    elif action == 'q':
        playing = False
        
print(f"🎯 Final score: {score}!")`
      },
      {
        name: 'For Loops - Perfect Repetition',
        emoji: '🔢',
        explanation: 'For loops repeat a specific number of times. They\'re great when you know exactly how many times you want something to happen, like printing a pattern or processing a list!',
        code_example: `# Print a welcome pattern
for i in range(5):
    print("🌟" * (i + 1))
    
# Count from 1 to 10
for number in range(1, 11):
    print(f"Number: {number}")
    
# Create a progress bar
print("Loading your game...")
for i in range(10):
    print("█" * i + "░" * (10 - i) + f" {i * 10}%")
    
print("🎮 Game loaded! Ready to play!")`
      },
      {
        name: 'Loop Control - Break and Continue',
        emoji: '⏯️',
        explanation: 'Sometimes you need to escape a loop early (break) or skip to the next iteration (continue). These give you fine control over loop behavior!',
        code_example: `# Finding a special number
for number in range(1, 100):
    if number == 42:
        print(f"🎉 Found the special number: {number}!")
        break  # Exit the loop immediately
    elif number % 10 == 0:
        continue  # Skip the rest and go to next number
    print(f"Checking {number}...")

print("Loop finished!")

# User input with validation
while True:
    age = input("Enter your age (or 'quit' to exit): ")
    if age == 'quit':
        break
    if age.isdigit():
        print(f"Thanks! You are {age} years old.")
        break
    else:
        print("Please enter a valid number!")
        continue`
      },
      {
        name: 'Event Handling - Responding to User Actions',
        emoji: '⚡',
        explanation: 'Event handling means making your program respond to what users do - clicking, typing, pressing keys. It\'s what makes programs feel alive and interactive!',
        code_example: `# Simple menu system with event handling
def show_menu():
    print("🎮 Game Menu")
    print("1. ⚔️  Start Battle")
    print("2. 🎒 Check Inventory") 
    print("3. 💾 Save Game")
    print("4. ❌ Quit")

game_running = True

while game_running:
    show_menu()
    choice = input("Choose an option (1-4): ")
    
    if choice == '1':
        print("⚔️ Battle started! Choose your weapon!")
    elif choice == '2':
        print("🎒 Inventory: Sword, Shield, Health Potion")
    elif choice == '3':
        print("💾 Game saved successfully!")
    elif choice == '4':
        print("Thanks for playing! 👋")
        game_running = False
    else:
        print("Invalid choice! Please try again.")
        
print("🎯 Game over!")`
      }
    ],
    challenges: [
      {
        id: 'countdown-timer',
        title: '⏰ Epic Countdown Timer',
        description: 'Create a countdown timer that builds excitement for a rocket launch, birthday, or any special event!',
        difficulty: 'beginner',
        xp_reward: 40,
        starter_code: `# ⏰ Epic Countdown Timer Challenge
# Build a countdown that gets users excited!

import time  # This lets us add pauses between counts

# TODO: Ask the user what they're counting down to
# TODO: Ask how many seconds to count down from
# TODO: Use a while loop to count down
# TODO: Add exciting messages and emojis  
# TODO: Create a big finale when it reaches 0!

print("🎉 Welcome to the Epic Countdown Timer!")
# Your countdown code here!`,
        solution_code: `# ⏰ Epic Countdown Timer Solution
import time

print("🎉 Welcome to the Epic Countdown Timer!")
event = input("What are you counting down to? ")
seconds = int(input("How many seconds should we count down? "))

print(f"\\n🚀 Get ready! {event} is coming!")
print("Here we go...\\n")

while seconds > 0:
    if seconds <= 3:
        print(f"🔥 {seconds}! 🔥")
    elif seconds <= 10:
        print(f"⚡ {seconds} ⚡") 
    else:
        print(f"⏰ {seconds}")
    
    time.sleep(1)  # Wait 1 second
    seconds -= 1

print("\\n🎊✨🎉 TIME'S UP! 🎉✨🎊")
print(f"🌟 {event} is HERE! 🌟")
print("🎆 Hope it's everything you dreamed of! 🎆")`,
        test_cases: [
          'Program asks what user is counting down to',
          'Asks for number of seconds to count down',
          'Uses while loop to count down properly',
          'Displays countdown numbers clearly',
          'Has an exciting finale message',
          'Code runs without errors'
        ],
        hints: [
          'Use int() to convert input to a number: seconds = int(input("Seconds: "))',
          'In your while loop, use seconds > 0 as the condition',
          'Subtract 1 from seconds each time through the loop',
          'Add different messages for different countdown numbers',
          'time.sleep(1) pauses for 1 second (import time first)'
        ],
        fun_facts: [
          'NASA uses countdown timers for real rocket launches!',
          'The first countdown was used in a 1929 German sci-fi movie',
          'New Year\'s Eve countdowns happen worldwide at the same time!'
        ]
      },
      {
        id: 'multiplication-master',
        title: '🧮 Multiplication Table Master',
        description: 'Create a beautiful multiplication table generator that helps students learn math in a fun, colorful way!',
        difficulty: 'beginner', 
        xp_reward: 50,
        starter_code: `# 🧮 Multiplication Table Master
# Help students learn multiplication with style!

# TODO: Ask which multiplication table to create (like 7 for 7 times table)
# TODO: Ask how many rows to show (like 1-12 or 1-20)
# TODO: Use a for loop to generate each row
# TODO: Make it colorful with emojis and formatting
# TODO: Show both the equation and the answer

print("🧮 Welcome to Multiplication Table Master!")
# Your multiplication magic here!`,
        solution_code: `# 🧮 Multiplication Table Master Solution
print("🧮 Welcome to Multiplication Table Master!")
print("Let's make learning multiplication fun! ✨")
print()

table = int(input("Which multiplication table do you want? (1-12): "))
rows = int(input("How many rows should I show? (1-20): "))

print()
print(f"🌟 The {table} Times Table! 🌟")
print("=" * 25)

for i in range(1, rows + 1):
    result = table * i
    print(f"📊 {table} × {i:2} = {result:3} 📊")
    
print("=" * 25)
print("🎉 Great job learning multiplication! 🎉")
print(f"💡 Fun fact: {table} × {rows} = {table * rows}!")`,
        test_cases: [
          'Program asks for which table to create',
          'Asks how many rows to display', 
          'Uses for loop to generate multiplication rows',
          'Displays equations clearly with proper formatting',
          'Shows both multiplication and results',
          'Has engaging presentation with emojis'
        ],
        hints: [
          'Use int() to convert input to numbers',
          'Use for loop: for i in range(1, rows + 1)',
          'Calculate result inside loop: result = table * i',
          'Use f-strings for nice formatting: f"{table} × {i} = {result}"',
          'The :2 and :3 in f-strings help align numbers nicely'
        ],
        fun_facts: [
          'Multiplication tables were used in ancient Babylon 4000 years ago!',
          'Learning times tables improves mental math speed by 300%',
          'Many programming algorithms use multiplication patterns!'
        ]
      },
      {
        id: 'simple-clicker-game',
        title: '🎮 Cookie Clicker Style Game',
        description: 'Build an addictive clicker game where every click earns points and unlocks achievements!',
        difficulty: 'intermediate',
        xp_reward: 100,
        badge_reward: 'Game Developer',
        starter_code: `# 🎮 Cookie Clicker Style Game
# Build an addictive clicker game with achievements!

# TODO: Create variables for score, level, clicks per second
# TODO: Make a game loop that shows current stats
# TODO: Let users click to gain points
# TODO: Add achievements at certain point levels
# TODO: Add upgrades that increase points per click
# TODO: Make it fun with encouraging messages!

print("🍪 Welcome to Cookie Clicker Style Game!")
print("Click to earn points and unlock achievements!")
# Your game code here!`,
        solution_code: `# 🎮 Cookie Clicker Style Game Solution
import random

print("🍪 Welcome to Ultimate Clicker!")
print("Click 'c' to earn cookies and unlock achievements!")
print("Type 'help' for commands, 'quit' to exit")
print()

# Game variables
cookies = 0
click_power = 1
level = 1
achievements = []

# Achievement thresholds
achievements_list = [
    (10, "🌱 First Baker", "Earned your first 10 cookies!"),
    (50, "🍪 Cookie Enthusiast", "50 cookies! You're getting good!"),
    (100, "🏭 Cookie Factory", "100 cookies! Now we're cooking!"),
    (250, "👑 Cookie King", "250 cookies! You rule the bakery!"),
    (500, "🌟 Cookie Legend", "500 cookies! Legendary status!")
]

def show_stats():
    print(f"🍪 Cookies: {cookies}")
    print(f"⚡ Click Power: {click_power}")
    print(f"🏆 Level: {level}")
    print(f"🎖️  Achievements: {len(achievements)}")

def check_achievements():
    for threshold, name, desc in achievements_list:
        if cookies >= threshold and name not in achievements:
            achievements.append(name)
            print(f"\\n🎉 ACHIEVEMENT UNLOCKED! 🎉")
            print(f"{name}")
            print(f"{desc}")
            print()

def show_help():
    print("\\n📖 Commands:")
    print("'c' - Click to earn cookies")
    print("'u' - Upgrade click power (costs 25 cookies)")
    print("'a' - View achievements") 
    print("'quit' - Exit game")
    print()

# Main game loop
playing = True
while playing:
    show_stats()
    action = input("\\n🎯 What do you want to do? ").lower().strip()
    
    if action == 'c':
        cookies += click_power
        
        # Random bonus chance!
        if random.randint(1, 10) == 1:  # 10% chance
            bonus = random.randint(1, 5)
            cookies += bonus
            print(f"🎊 BONUS! +{bonus} extra cookies!")
        else:
            print(f"✨ *click* +{click_power} cookies!")
            
        check_achievements()
        
        # Level up system
        if cookies >= level * 50:
            level += 1
            print(f"🆙 LEVEL UP! You're now level {level}!")
            
    elif action == 'u':
        if cookies >= 25:
            cookies -= 25
            click_power += 1
            print(f"⬆️ Upgrade purchased! Click power is now {click_power}!")
        else:
            print("❌ You need 25 cookies to upgrade!")
            
    elif action == 'a':
        print(f"\\n🏆 Your Achievements ({len(achievements)}/{len(achievements_list)}):")
        for achievement in achievements:
            print(f"✅ {achievement}")
        if not achievements:
            print("None yet! Keep clicking!")
        print()
        
    elif action == 'help':
        show_help()
        
    elif action == 'quit':
        playing = False
        
    else:
        print("❓ Unknown command! Type 'help' for options.")

print(f"\\n🎯 Game Over! Final Score: {cookies} cookies!")
print(f"🏆 You reached level {level}!")
print("Thanks for playing Ultimate Clicker! 🍪")`,
        test_cases: [
          'Game has working click mechanism to earn points',
          'Tracks score and displays it clearly',
          'Includes achievement system with unlocks',
          'Has upgrade system to increase click power',
          'Uses while loop for continuous gameplay',
          'Handles user input and commands properly',
          'Has clear win/exit conditions'
        ],
        hints: [
          'Use while True loop for main game loop',
          'Track cookies, click_power, and achievements in variables',
          'Use if statements to check for achievement unlocks',
          'Import random for bonus chances: if random.randint(1, 10) == 1:',
          'Use input().lower().strip() to handle user commands cleanly',
          'Add engaging messages and emojis for every action'
        ],
        fun_facts: [
          'Cookie Clicker is one of the most addictive games ever made!',
          'Clicker games teach exponential growth and resource management',
          'Many successful mobile games use similar progression mechanics!'
        ]
      }
    ],
    game_elements: [
      {
        type: 'time_challenge',
        title: '⚡ Lightning Round',
        description: 'Complete the clicker game challenge in under 15 minutes for bonus XP!',
        bonus_xp: 75
      },
      {
        type: 'code_battle',
        title: '🏁 Loop Race', 
        description: 'Challenge classmates: Who can create the coolest loop pattern in 5 minutes?',
        bonus_xp: 50
      },
      {
        type: 'debug_quest',
        title: '🔧 Infinite Loop Rescue',
        description: 'Help debug broken loop code that never stops running!',
        bonus_xp: 60
      }
    ],
    final_project: {
      title: '🎲 Ultimate Game Collection',
      description: 'Create a menu-driven game collection with 3 different mini-games, each using different types of loops!',
      requirements: [
        'Create a main menu system using while loops',
        'Include at least 3 different mini-games',
        'Each game should use a different loop type (while, for, nested)',
        'Track high scores across all games',
        'Include proper error handling for user input',
        'Add engaging descriptions and instructions for each game'
      ],
      bonus_features: [
        'Add difficulty levels for each game',
        'Create a global leaderboard system',
        'Include save/load functionality for high scores',
        'Add ASCII art animations during gameplay',
        'Create tournament mode where games compete',
        'Include cheat codes or easter eggs'
      ],
      xp_reward: 150,
      badge_reward: 'Loop Master'
    }
  }
]

// Helper functions
export function getPythonLesson(id: string): PythonLesson | undefined {
  return pythonLessons.find(lesson => lesson.id === id)
}

export function getAllPythonLessons(): PythonLesson[] {
  return pythonLessons
}

export function getLessonsByWeek(week: number): PythonLesson[] {
  return pythonLessons.filter(lesson => lesson.week === week)
}

export default pythonLessons