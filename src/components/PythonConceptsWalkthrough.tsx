'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Brain, Lightbulb, CheckCircle, Play, Zap, Star } from 'lucide-react'
import Confetti from 'react-confetti'

interface CodeLine {
  id: string
  code: string
  explanation?: string
  prediction?: {
    type: 'output' | 'error' | 'completion'
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    xpReward: number
  }
}

interface MiniActivity {
  id: string
  title: string
  question: string
  type: 'dropdown' | 'multiple-choice' | 'drag-drop'
  options: string[]
  correctAnswer: number | string
  explanation: string
  xpReward: number
}

interface TutorialSection {
  id: string
  title: string
  emoji: string
  introduction: string
  codeLines: CodeLine[]
  miniActivity: MiniActivity
  completion: {
    xpReward: number
    badgeName: string
    message: string
  }
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface PythonConceptsWalkthroughProps {
  onComplete?: () => void
}

export default function PythonConceptsWalkthrough({ onComplete }: PythonConceptsWalkthroughProps) {
  const [currentSectionIndex, setSectionIndex] = useState(0)
  const [currentLineIndex, setLineIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [sectionProgress, setSectionProgress] = useState<{[key: string]: number}>({})
  const [totalXP, setTotalXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [particleEffect, setParticleEffect] = useState<{show: boolean, type: string} | null>(null)
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null)
  const [showPredictionResult, setShowPredictionResult] = useState(false)
  const [predictionXP, setPredictionXP] = useState(0)
  const [showMiniActivity, setShowMiniActivity] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const tutorialSections: TutorialSection[] = [
    {
      id: 'welcome',
      title: 'Welcome to Python Programming',
      emoji: '👋',
      introduction: "Python is like having a conversation with your computer. Let's start with the simplest way to communicate:",
      codeLines: [
        {
          id: 'line1',
          code: 'print("Hello, future AI creator!")',
          explanation: 'The print() function tells Python to display text on the screen',
          prediction: {
            type: 'output',
            question: 'What will this code display?',
            options: [
              'print("Hello, future AI creator!")',
              'Hello, future AI creator!',
              'Error: invalid syntax',
              'Nothing - it just runs'
            ],
            correctAnswer: 1,
            explanation: 'print() displays the text inside the quotes, not the code itself!',
            xpReward: 15
          }
        },
        {
          id: 'line2',
          code: 'print("Welcome to your Python journey!")',
          prediction: {
            type: 'output',
            question: 'Now what will appear on the next line?',
            options: [
              'Welcome to your Python journey!',
              'Hello, future AI creator!',
              'Both messages together',
              'An error message'
            ],
            correctAnswer: 0,
            explanation: 'Each print() creates a new line of output. This will appear below the first message.',
            xpReward: 15
          }
        }
      ],
      miniActivity: {
        id: 'welcome-activity',
        title: 'Create Your Own Greeting',
        question: 'Complete this code to print your name: print("Hello, ___")',
        type: 'dropdown',
        options: ['my name', '"Alex"', 'Alex', 'name'],
        correctAnswer: '"Alex"',
        explanation: 'Text must be in quotes! print("Hello, "Alex"") would display: Hello, Alex',
        xpReward: 25
      },
      completion: {
        xpReward: 75,
        badgeName: 'First Steps 👋',
        message: 'Amazing! You just wrote your first Python code!'
      }
    },
    {
      id: 'variables',
      title: 'Storing Information with Variables',
      emoji: '📦',
      introduction: "Variables are like labeled containers. Let's see how to store and use information:",
      codeLines: [
        {
          id: 'var1',
          code: 'student_name = "Alex"',
          explanation: 'This creates a container called "student_name" and puts "Alex" inside it',
          prediction: {
            type: 'completion',
            question: 'What happens when we run this line?',
            options: [
              'It displays "Alex" on screen',
              'It stores "Alex" in memory for later use',
              'It creates an error',
              'Nothing visible happens'
            ],
            correctAnswer: 3,
            explanation: 'Variable assignment stores data in memory but doesn\'t display anything. We need print() to see output!',
            xpReward: 20
          }
        },
        {
          id: 'var2',
          code: 'favorite_subject = "Science"',
          prediction: {
            type: 'completion',
            question: 'Now we have two variables. What can we do with them?',
            options: [
              'Nothing until we print them',
              'They automatically display',
              'Python forgets the first one',
              'We can only use one at a time'
            ],
            correctAnswer: 0,
            explanation: 'Variables just store data silently. We can store many variables and use them whenever we want!',
            xpReward: 20
          }
        },
        {
          id: 'var3',
          code: 'print(f"Hi {student_name}! You love {favorite_subject}")',
          prediction: {
            type: 'output',
            question: 'What will this f-string display?',
            options: [
              'Hi {student_name}! You love {favorite_subject}',
              'Hi Alex! You love Science',
              'Hi student_name! You love favorite_subject',
              'Error: invalid syntax'
            ],
            correctAnswer: 1,
            explanation: 'f-strings replace {variable_name} with the actual stored value. {student_name} becomes "Alex"!',
            xpReward: 25
          }
        }
      ],
      miniActivity: {
        id: 'variables-challenge',
        title: 'Build Your Profile',
        question: 'Create a variable for your age: ___ = 15',
        type: 'dropdown',
        options: ['my_age', 'age', 'Age', 'student_age'],
        correctAnswer: 'my_age',
        explanation: 'Good variable names are descriptive and use underscores for spaces: my_age, student_name, favorite_color',
        xpReward: 30
      },
      completion: {
        xpReward: 85,
        badgeName: 'Data Master 📦',
        message: 'Excellent! You can now store and use information like a real programmer!'
      }
    },
    {
      id: 'user-input',
      title: 'Getting Information from Users',
      emoji: '💬',
      introduction: "Now let's make our programs interactive by asking users questions:",
      codeLines: [
        {
          id: 'input1',
          code: 'user_name = input("What\'s your name? ")',
          explanation: 'input() pauses the program and waits for the user to type something',
          prediction: {
            type: 'error',
            question: 'What happens when this line runs?',
            options: [
              'It immediately stores "What\'s your name?" in user_name',
              'It displays the question and waits for user input',
              'It causes a syntax error',
              'It skips to the next line'
            ],
            correctAnswer: 1,
            explanation: 'input() shows the question prompt and pauses until the user types something and presses Enter!',
            xpReward: 20
          }
        },
        {
          id: 'input2',
          code: 'print(f"Nice to meet you, {user_name}!")',
          prediction: {
            type: 'output',
            question: 'If the user typed "Sarah", what gets displayed?',
            options: [
              'Nice to meet you, user_name!',
              'Nice to meet you, {user_name}!',
              'Nice to meet you, Sarah!',
              'What\'s your name? Sarah'
            ],
            correctAnswer: 2,
            explanation: 'The f-string replaces {user_name} with whatever the user typed - "Sarah" in this case!',
            xpReward: 25
          }
        }
      ],
      miniActivity: {
        id: 'input-challenge',
        title: 'Create an Interactive Greeting',
        question: 'Which line asks for the user\'s favorite color?',
        type: 'multiple-choice',
        options: [
          'color = "blue"',
          'favorite_color = input("What\'s your favorite color? ")',
          'print("What\'s your favorite color?")',
          'input = favorite_color'
        ],
        correctAnswer: 1,
        explanation: 'input() with a question prompt is how we get information from users and store it in a variable!',
        xpReward: 30
      },
      completion: {
        xpReward: 80,
        badgeName: 'Conversation Pro 💬',
        message: 'Perfect! Your programs can now talk to users!'
      }
    },
    {
      id: 'conditionals',
      title: 'Making Smart Decisions with If Statements',
      emoji: '🤔',
      introduction: "Now let's teach our programs to make decisions! If statements are the brain of AI:",
      codeLines: [
        {
          id: 'if1',
          code: 'mood = "stressed"',
          explanation: 'We start by storing the user\'s mood (this could come from input())',
          prediction: {
            type: 'completion',
            question: 'What type of data is "stressed"?',
            options: [
              'A number',
              'A text string',
              'A boolean (True/False)',
              'A variable name'
            ],
            correctAnswer: 1,
            explanation: 'Text in quotes is called a "string" - it\'s how we store words and sentences in Python!',
            xpReward: 15
          }
        },
        {
          id: 'if2',
          code: 'if mood == "stressed":',
          explanation: 'This checks if the mood variable equals "stressed". Note the double equals (==) for comparison!',
          prediction: {
            type: 'error',
            question: 'What would happen if we used = instead of ==?',
            options: [
              'It would work the same way',
              'It would cause a syntax error',
              'It would assign "stressed" to mood again',
              'Python would ignore the line'
            ],
            correctAnswer: 1,
            explanation: 'Single = assigns values, double == compares values. Using = in an if statement causes a syntax error!',
            xpReward: 20
          }
        },
        {
          id: 'if3',
          code: '    print("Take a deep breath. You\'ve got this! 🧘")',
          explanation: 'This line is indented with 4 spaces - it only runs IF the condition above is True',
          prediction: {
            type: 'output',
            question: 'When will this message appear?',
            options: [
              'Always, every time the program runs',
              'Only when mood equals "stressed"',
              'Only when mood does NOT equal "stressed"',
              'Never - it\'s just a comment'
            ],
            correctAnswer: 1,
            explanation: 'Code inside an if block only runs when the condition is True. Perfect for giving specific advice!',
            xpReward: 25
          }
        },
        {
          id: 'if4',
          code: 'else:',
          explanation: 'else catches everything that didn\'t match the if condition',
          prediction: {
            type: 'completion',
            question: 'When does the else block run?',
            options: [
              'When mood equals "stressed"',
              'When mood does NOT equal "stressed"',
              'Always, after the if block',
              'Never - it\'s optional'
            ],
            correctAnswer: 1,
            explanation: 'else is like saying "in all other cases" - it runs when the if condition is False!',
            xpReward: 20
          }
        },
        {
          id: 'if5',
          code: '    print("Whatever you\'re feeling is valid! 💙")',
          prediction: {
            type: 'output',
            question: 'If mood = "happy", which message will show?',
            options: [
              'Take a deep breath. You\'ve got this! 🧘',
              'Whatever you\'re feeling is valid! 💙',
              'Both messages',
              'No message at all'
            ],
            correctAnswer: 1,
            explanation: 'Since "happy" ≠ "stressed", the if condition is False, so the else block runs instead!',
            xpReward: 25
          }
        }
      ],
      miniActivity: {
        id: 'conditionals-challenge',
        title: 'Create Smart AI Response',
        question: 'Complete this AI logic: if grade == "A": print("___")',
        type: 'dropdown',
        options: [
          'Amazing work! Keep it up! 🌟',
          'grade',
          'A',
          'if grade'
        ],
        correctAnswer: 'Amazing work! Keep it up! 🌟',
        explanation: 'AI advisors should give encouraging, specific responses! The message should celebrate the student\'s success.',
        xpReward: 35
      },
      completion: {
        xpReward: 90,
        badgeName: 'Decision Maker 🤔',
        message: 'Outstanding! Your AI can now make smart decisions!'
      }
    },
    {
      id: 'lists-advice',
      title: 'Creating Collections of Advice',
      emoji: '📝',
      introduction: "Lists let us store many pieces of advice. Perfect for AI advisors with lots to say:",
      codeLines: [
        {
          id: 'list1',
          code: 'study_tips = [',
          explanation: 'We start a list with an opening square bracket [',
          prediction: {
            type: 'completion',
            question: 'What comes after the opening bracket?',
            options: [
              'The variable name',
              'Items separated by commas',
              'A closing bracket immediately',
              'An equals sign'
            ],
            correctAnswer: 1,
            explanation: 'Lists contain items separated by commas. We can put many pieces of advice inside!',
            xpReward: 15
          }
        },
        {
          id: 'list2',
          code: '    "Take breaks every 25 minutes",',
          explanation: 'Each piece of advice goes in quotes, followed by a comma',
          prediction: {
            type: 'error',
            question: 'Why is there a comma at the end?',
            options: [
              'It\'s a typo',
              'To separate this item from the next one',
              'Python requires it',
              'It makes the code look pretty'
            ],
            correctAnswer: 1,
            explanation: 'Commas separate list items. Even if this is the last item we see, there might be more below!',
            xpReward: 20
          }
        },
        {
          id: 'list3',
          code: '    "Find a quiet study space",',
          prediction: {
            type: 'completion',
            question: 'How many study tips do we have so far?',
            options: ['1', '2', '3', '0'],
            correctAnswer: 1,
            explanation: 'We have 2 study tips: "Take breaks every 25 minutes" and "Find a quiet study space"',
            xpReward: 15
          }
        },
        {
          id: 'list4',
          code: '    "Use flashcards for memorization"',
          explanation: 'The last item doesn\'t need a comma after it',
          prediction: {
            type: 'error',
            question: 'What\'s different about this line?',
            options: [
              'It has a typo',
              'It\'s missing quotes',
              'No comma at the end',
              'It\'s indented wrong'
            ],
            correctAnswer: 2,
            explanation: 'The last item in a list doesn\'t need a comma. Python allows it, but it\'s cleaner without!',
            xpReward: 20
          }
        },
        {
          id: 'list5',
          code: ']',
          explanation: 'We close the list with a closing square bracket ]',
          prediction: {
            type: 'output',
            question: 'What does the complete list contain?',
            options: [
              '1 study tip',
              '2 study tips', 
              '3 study tips',
              'An error'
            ],
            correctAnswer: 2,
            explanation: 'Our study_tips list now contains 3 helpful pieces of advice that our AI can use!',
            xpReward: 20
          }
        }
      ],
      miniActivity: {
        id: 'lists-challenge',
        title: 'Build Your Advice Collection',
        question: 'Which creates a list of encouragement messages?',
        type: 'multiple-choice',
        options: [
          'encouragement = "You\'re awesome!"',
          'encouragement = ["You\'re awesome!", "Keep going!"]',
          'encouragement = ("You\'re awesome!", "Keep going!")',
          'encouragement = You\'re awesome!, Keep going!'
        ],
        correctAnswer: 1,
        explanation: 'Lists use square brackets [] with items in quotes, separated by commas. Perfect for storing multiple AI responses!',
        xpReward: 35
      },
      completion: {
        xpReward: 85,
        badgeName: 'List Master 📝',
        message: 'Fantastic! Your AI now has collections of advice to share!'
      }
    },
    {
      id: 'random-selection',
      title: 'Adding Variety and Surprise',
      emoji: '🎲',
      introduction: "Let's make our AI unpredictable and exciting with random selection:",
      codeLines: [
        {
          id: 'random1',
          code: 'import random',
          explanation: 'This gives us access to randomization tools - like rolling dice in our program!',
          prediction: {
            type: 'completion',
            question: 'What does "import" do?',
            options: [
              'Creates a new variable',
              'Brings in additional Python tools',
              'Prints something to screen',
              'Deletes old code'
            ],
            correctAnswer: 1,
            explanation: 'import brings in extra Python libraries with special functions we can use. Like adding apps to your phone!',
            xpReward: 20
          }
        },
        {
          id: 'random2',
          code: 'encouragement = ["You\'re amazing! 🌟", "Keep going! 💪", "You\'ve got this! ✨"]',
          prediction: {
            type: 'completion',
            question: 'How many encouragement messages are in this list?',
            options: ['1', '2', '3', '4'],
            correctAnswer: 2,
            explanation: 'Count the items between commas: "You\'re amazing! 🌟", "Keep going! 💪", "You\'ve got this! ✨" = 3 messages!',
            xpReward: 15
          }
        },
        {
          id: 'random3',
          code: 'random_message = random.choice(encouragement)',
          explanation: 'random.choice() picks ONE random item from our list - like drawing a name from a hat!',
          prediction: {
            type: 'output',
            question: 'What gets stored in random_message?',
            options: [
              'All 3 encouragement messages',
              'One randomly selected message',
              'The word "random"',
              'Nothing - it causes an error'
            ],
            correctAnswer: 1,
            explanation: 'random.choice() picks just ONE item randomly. Each time you run it, you might get a different message!',
            xpReward: 25
          }
        },
        {
          id: 'random4',
          code: 'print(f"Daily motivation: {random_message}")',
          prediction: {
            type: 'output',
            question: 'If random.choice picked "Keep going! 💪", what displays?',
            options: [
              'Daily motivation: random_message',
              'Daily motivation: Keep going! 💪',
              'Keep going! 💪',
              'random_message'
            ],
            correctAnswer: 1,
            explanation: 'The f-string replaces {random_message} with the actual chosen message. Perfect for surprising users!',
            xpReward: 25
          }
        }
      ],
      miniActivity: {
        id: 'random-challenge',
        title: 'Create Surprising AI Responses',
        question: 'Which line makes AI responses unpredictable?',
        type: 'multiple-choice',
        options: [
          'responses = ["Good job!", "Nice work!"]',
          'message = random.choice(responses)',
          'print(message)',
          'All of the above working together'
        ],
        correctAnswer: 3,
        explanation: 'All parts work together: store options in a list, use random.choice() to pick one, then print it. This creates engaging AI!',
        xpReward: 40
      },
      completion: {
        xpReward: 95,
        badgeName: 'Surprise Creator 🎲',
        message: 'Incredible! Your AI now has personality and variety!'
      }
    },
    {
      id: 'complete-advisor',
      title: 'Your Complete AI Advisor System',
      emoji: '🎉',
      introduction: "Time to combine everything into one incredible AI advisor! This is real artificial intelligence:",
      codeLines: [
        {
          id: 'advisor1',
          code: 'def understand_student(message):',
          explanation: 'We create a function - a reusable block of code that analyzes what students say',
          prediction: {
            type: 'completion',
            question: 'What does this function do?',
            options: [
              'Prints a message',
              'Creates a variable',
              'Defines a reusable code block',
              'Imports a library'
            ],
            correctAnswer: 2,
            explanation: 'Functions are like recipes - we define them once, then use them many times. This one will analyze student messages!',
            xpReward: 25
          }
        },
        {
          id: 'advisor2',
          code: '    message = message.lower()',
          explanation: 'Convert to lowercase so "STRESSED" and "stressed" both work',
          prediction: {
            type: 'output',
            question: 'If message = "I\'m STRESSED", what does message.lower() return?',
            options: [
              'I\'m STRESSED',
              'i\'m stressed',
              'IM STRESSED',
              'Error'
            ],
            correctAnswer: 1,
            explanation: '.lower() converts all letters to lowercase. This makes our AI understand "STRESSED", "stressed", and "Stressed" the same way!',
            xpReward: 20
          }
        },
        {
          id: 'advisor3',
          code: '    if "stressed" in message:',
          explanation: 'Check if the word "stressed" appears anywhere in their message',
          prediction: {
            type: 'completion',
            question: 'What does "in" check for?',
            options: [
              'If message equals exactly "stressed"',
              'If the word "stressed" appears anywhere in the message',
              'If message starts with "stressed"',
              'If message ends with "stressed"'
            ],
            correctAnswer: 1,
            explanation: '"in" checks if one piece of text appears inside another. "stressed" in "I\'m stressed about math" would be True!',
            xpReward: 25
          }
        },
        {
          id: 'advisor4',
          code: '        return "stress_relief"',
          explanation: 'return sends back an answer from our function - like the function\'s response',
          prediction: {
            type: 'completion',
            question: 'What happens after return runs?',
            options: [
              'The function continues to the next line',
              'The function stops and sends back "stress_relief"',
              'It prints "stress_relief"',
              'It creates an error'
            ],
            correctAnswer: 1,
            explanation: 'return immediately stops the function and sends the answer back to wherever the function was called!',
            xpReward: 25
          }
        }
      ],
      miniActivity: {
        id: 'advisor-challenge',
        title: 'Test Your AI Brain',
        question: 'If a student says "I need help with homework", what should the AI detect?',
        type: 'multiple-choice',
        options: [
          'stress_relief',
          'study_advice', 
          'positive_encouragement',
          'error_message'
        ],
        correctAnswer: 1,
        explanation: 'The keyword "homework" indicates they need study advice! Our AI brain should detect study-related requests.',
        xpReward: 45
      },
      completion: {
        xpReward: 100,
        badgeName: 'AI Developer 🎉',
        message: 'CONGRATULATIONS! You\'ve built a real AI advisor that can understand and respond to students!'
      }
    }
  ]

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What does the print() function do in Python?',
      options: [
        'Prints documents on paper',
        'Displays text on the screen',
        'Saves files to computer',
        'Deletes information'
      ],
      correctAnswer: 1,
      explanation: 'print() displays text on the screen - like sending a message that appears for users to see.'
    },
    {
      id: 'q2', 
      question: 'Which of these is the best variable name for storing a student\'s age?',
      options: [
        'x',
        'number', 
        'student_age',
        'data'
      ],
      correctAnswer: 2,
      explanation: 'student_age is descriptive and clear - anyone reading your code immediately knows what information it stores.'
    },
    {
      id: 'q3',
      question: 'What does input() do?',
      options: [
        'Displays text on screen',
        'Asks user a question and waits for their answer',
        'Creates random numbers', 
        'Stores information permanently'
      ],
      correctAnswer: 1,
      explanation: 'input() asks the user a question and pauses the program until they type an answer - essential for interactive AI.'
    },
    {
      id: 'q4',
      question: 'What does this code do? if mood == "happy":',
      options: [
        'Sets mood to happy',
        'Checks if mood equals happy and runs code if true',
        'Prints the word happy',
        'Creates a variable called mood'
      ],
      correctAnswer: 1,
      explanation: 'The == compares two values. If they match, the code inside the if block runs - this is how AI makes decisions.'
    },
    {
      id: 'q5',
      question: 'Why are lists important for AI advisors?',
      options: [
        'They make code look professional',
        'They store many advice options so AI can pick appropriate responses', 
        'They run code faster',
        'They prevent errors'
      ],
      correctAnswer: 1,
      explanation: 'Lists let AI store hundreds of responses and pick the perfect one for each situation - making AI helpful and varied.'
    },
    {
      id: 'q6',
      question: 'What does random.choice() do?',
      options: [
        'Deletes random items',
        'Creates random text',
        'Picks one random item from a list',
        'Sorts lists alphabetically'
      ],
      correctAnswer: 2,
      explanation: 'random.choice() picks one random item from a list - making AI responses surprising and engaging for users.'
    },
    {
      id: 'q7',
      question: 'What makes an AI advisor "intelligent"?',
      options: [
        'Using big words',
        'Analyzing user input, making decisions, and giving personalized responses',
        'Running very fast',
        'Having colorful displays'
      ],
      correctAnswer: 1,
      explanation: 'True AI intelligence comes from understanding what users need and responding appropriately - just like human counselors do.'
    },
    {
      id: 'q8',
      question: 'Which Python concept helps AI understand user emotions?',
      options: [
        'print() statements',
        'Variables for storing data',
        'if statements for checking keywords like "stressed" or "happy"',
        'Lists for organization'
      ],
      correctAnswer: 2,
      explanation: 'if statements analyze user messages for emotional keywords, allowing AI to detect feelings and respond with appropriate help.'
    }
  ]

  const currentSection = tutorialSections[currentSectionIndex]
  const currentLine = currentSection?.codeLines[currentLineIndex]
  const isLineRevealed = currentLineIndex < currentSection?.codeLines.length
  const isSectionComplete = completedSections.has(currentSection?.id)

  // Reset states when changing sections
  useEffect(() => {
    setSelectedPrediction(null)
    setShowPredictionResult(false)
    setPredictionXP(0)
    setShowMiniActivity(false)
  }, [currentSectionIndex])

  // Particle effect trigger
  const triggerParticles = (type: string) => {
    setParticleEffect({ show: true, type })
    setTimeout(() => setParticleEffect(null), 1000)
  }

  // Big celebration for section completion
  const triggerCelebration = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handlePredictionAnswer = (answerIndex: number, prediction: CodeLine['prediction']) => {
    if (!prediction) return
    
    setSelectedPrediction(answerIndex)
    setShowPredictionResult(true)
    
    const isCorrect = answerIndex === prediction.correctAnswer
    setPredictionXP(isCorrect ? prediction.xpReward : 0)
    
    if (isCorrect) {
      setTotalXP(prev => prev + prediction.xpReward)
      triggerParticles('success')

      // Auto-advance after showing correct result
      setTimeout(() => {
        setShowPredictionResult(false)
        setSelectedPrediction(null)
        
        if (currentLineIndex < currentSection.codeLines.length - 1) {
          setLineIndex(currentLineIndex + 1)
        } else {
          // Move to mini-activity
          setShowMiniActivity(true)
          setSectionProgress(prev => ({
            ...prev,
            [currentSection.id]: currentSection.codeLines.length
          }))
        }
      }, 2500)
    } else {
      triggerParticles('error')
      // Don't auto-advance on wrong answers - student must try again
    }
  }

  const handleTryAgain = () => {
    setShowPredictionResult(false)
    setSelectedPrediction(null)
    setPredictionXP(0)
  }

  const handleMiniActivityComplete = (answerIndex: number, activity: MiniActivity) => {
    const isCorrect = (activity.type === 'dropdown' ? 
      activity.options[answerIndex] === activity.correctAnswer :
      answerIndex === activity.correctAnswer)
    
    if (isCorrect) {
      setTotalXP(prev => prev + activity.xpReward + currentSection.completion.xpReward)
      
      // Mark section complete
      const newCompleted = new Set([...completedSections, currentSection.id])
      setCompletedSections(newCompleted)
      setEarnedBadges(prev => [...prev, currentSection.completion.badgeName])
      
      setSectionProgress(prev => ({
        ...prev,
        [currentSection.id]: currentSection.codeLines.length + 1
      }))
      
      triggerCelebration()
      setShowMiniActivity(false)
      
      // Auto-advance to next section after celebration
      setTimeout(() => {
        if (currentSectionIndex < tutorialSections.length - 1) {
          setSectionIndex(currentSectionIndex + 1)
          setLineIndex(0)
        } else {
          setShowQuiz(true)
        }
      }, 3000)
    } else {
      triggerParticles('error')
    }
  }

  // Level calculation
  useEffect(() => {
    const newLevel = Math.floor(totalXP / 200) + 1
    setLevel(newLevel)
  }, [totalXP])

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleQuizSubmit = () => {
    let correct = 0
    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    const score = Math.round((correct / quizQuestions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    
    // Big celebration for quiz completion
    triggerCelebration()
  }

  const handleQuizComplete = () => {
    onComplete?.()
  }

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Confetti for quiz celebration */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-3xl p-6 border-2 border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="text-6xl">🧠</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">Python Knowledge Quiz</h2>
              <p className="text-purple-200 text-lg">Test your AI programming mastery!</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <div className="text-yellow-400 font-bold text-xl flex items-center justify-end gap-2">
              <Star className="h-5 w-5" />
              Final Level: {level} • Total XP: {totalXP}
            </div>
          </div>
        </div>

        {!quizSubmitted ? (
          <div className="space-y-6">
            {/* Quiz Questions */}
            {quizQuestions.map((question, qIndex) => (
              <div key={question.id} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600">
                <h3 className="text-purple-300 font-bold text-lg mb-4">
                  Question {qIndex + 1}: {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => handleQuizAnswer(question.id, oIndex)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        quizAnswers[question.id] === oIndex
                          ? 'bg-purple-600/30 border-purple-400 text-white'
                          : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-purple-600/10 hover:border-purple-500'
                      }`}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + oIndex)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  Object.keys(quizAnswers).length === quizQuestions.length
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                📊 Submit Quiz & See Results
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Results */}
            <div className={`rounded-3xl p-8 border-2 text-center ${
              quizScore >= 80 
                ? 'bg-gradient-to-r from-green-800/30 to-emerald-800/30 border-green-500/30'
                : quizScore >= 60
                ? 'bg-gradient-to-r from-yellow-800/30 to-orange-800/30 border-yellow-500/30'
                : 'bg-gradient-to-r from-red-800/30 to-pink-800/30 border-red-500/30'
            }`}>
              <div className="text-8xl mb-4">
                {quizScore >= 80 ? '🎉' : quizScore >= 60 ? '👍' : '💪'}
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Quiz Complete!
              </h3>
              <div className="text-6xl font-bold text-white mb-4">
                {quizScore}%
              </div>
              <p className="text-lg mb-6">
                {quizScore >= 80 
                  ? 'Outstanding! You truly understand AI programming concepts!'
                  : quizScore >= 60
                  ? 'Good job! You have a solid foundation in AI concepts!'
                  : 'Keep learning! AI programming takes practice - you\'re on the right track!'
                }
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              {quizQuestions.map((question, index) => {
                const userAnswer = quizAnswers[question.id]
                const isCorrect = userAnswer === question.correctAnswer
                return (
                  <div key={question.id} className={`rounded-xl p-4 border ${
                    isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? '✅' : '❌'}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-2">
                          Question {index + 1}: {question.question}
                        </div>
                        <div className="text-sm space-y-1">
                          <div className={isCorrect ? 'text-green-200' : 'text-red-200'}>
                            Your answer: {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-200">
                              Correct answer: {question.options[question.correctAnswer]}
                            </div>
                          )}
                          <div className="text-gray-300 text-xs mt-2">
                            💡 {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Completion Button */}
            <div className="text-center">
              <button
                onClick={handleQuizComplete}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎓 Complete Python Laboratory & Return to Adventure Map
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Confetti for major celebrations */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Particle Effects */}
      {particleEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className={`text-4xl animate-bounce ${
            particleEffect.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {particleEffect.type === 'success' ? '✨⭐✨' : '💫🔸💫'}
          </div>
        </div>
      )}

      {/* XP and Level Header */}
      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-3xl p-6 border-2 border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-pulse">🐍</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">Python Concepts Walkthrough</h2>
              <p className="text-purple-200 text-lg">Master Programming Fundamentals Interactively</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold text-2xl flex items-center gap-2">
              <Star className="h-6 w-6" />
              Level {level} • {totalXP} XP
            </div>
            <div className="text-yellow-300 text-sm">
              {200 - (totalXP % 200)} XP to Level {level + 1}
            </div>
            <div className="mt-2 bg-yellow-900/50 rounded-full h-2 w-32">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${((totalXP % 200) / 200) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Progress */}
      <div className="flex justify-center gap-2 mb-6">
        {tutorialSections.map((section, index) => (
          <div
            key={section.id}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all $${
              completedSections.has(section.id)
                ? 'bg-green-600 border-green-400 text-white'
                : index === currentSectionIndex
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-500 text-gray-400'
            }`}
          >
            <span className="text-lg">{section.emoji}</span>
          </div>
        ))}
      </div>

      {/* Current Section */}
      <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/30 rounded-3xl p-8 border-2 border-blue-500/30">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-8xl animate-bounce">{currentSection.emoji}</div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{currentSection.title}</h3>
            <p className="text-blue-200 text-lg">{currentSection.introduction}</p>
          </div>
        </div>

        {/* Code Walkthrough Area */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Code Lines */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Play className="h-5 w-5 text-cyan-400" />
              <h4 className="text-xl font-bold text-cyan-300">Code Walkthrough:</h4>
            </div>

            {/* Revealed Code Lines */}
            <div className="bg-gray-900/80 rounded-xl border border-cyan-500/30 p-4 min-h-[200px]">
              {currentSection.codeLines.map((line, index) => (
                <div key={line.id} className={`transition-all duration-500 ${
                  index <= currentLineIndex ? 'opacity-100' : 'opacity-30'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-gray-500 text-sm mt-1">{index + 1}</span>
                    <code className="text-cyan-200 font-mono">{line.code}</code>
                  </div>
                  {index <= currentLineIndex && line.explanation && (
                    <div className="ml-6 text-cyan-300 text-sm mb-3 italic">
                      💡 {line.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Next Line Button - only show when no prediction is active */}
            {currentLineIndex < currentSection.codeLines.length && 
             !currentLine?.prediction && 
             !showPredictionResult && (
              <button
                onClick={() => setLineIndex(currentLineIndex + 1)}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <Play className="h-5 w-5" />
                  Reveal Next Line
                </div>
              </button>
            )}

            {/* Section Complete Message */}
            {completedSections.has(currentSection.id) && (
              <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-xl border border-green-500/30 p-6 text-center">
                <div className="text-6xl mb-4 animate-bounce">🎊</div>
                <h3 className="text-2xl font-bold text-green-300 mb-2">Section Complete!</h3>
                <p className="text-green-200 mb-4">{currentSection.completion.message}</p>
                <div className="bg-green-600/30 border border-green-500/50 rounded-full px-4 py-2 inline-block">
                  <span className="text-green-200 font-bold">{currentSection.completion.badgeName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Prediction/Activity Area */}
          <div className="space-y-4">
            {/* Current Line Prediction */}
            {currentLine?.prediction && !showPredictionResult && (
              <div className="bg-purple-900/30 rounded-xl border border-purple-500/30 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <h4 className="text-lg font-bold text-purple-300">
                    {currentLine.prediction.type === 'output' ? '🎯 Predict the Output' :
                     currentLine.prediction.type === 'error' ? '🐛 Spot the Issue' :
                     '🔧 Complete the Code'}
                  </h4>
                </div>
                
                <p className="text-purple-200 mb-4">{currentLine.prediction.question}</p>
                
                <div className="space-y-2">
                  {currentLine.prediction.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handlePredictionAnswer(index, currentLine.prediction)}
                      disabled={selectedPrediction !== null}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedPrediction === index
                          ? 'bg-purple-600/40 border-purple-400 text-white'
                          : 'bg-purple-800/20 border-purple-600/30 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400'
                      } disabled:cursor-not-allowed`}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 text-center text-purple-400 text-sm">
                  +{currentLine.prediction.xpReward} XP for correct answer
                </div>
              </div>
            )}

            {/* Prediction Result */}
            {showPredictionResult && currentLine?.prediction && (
              <div className={`rounded-xl border p-6 transition-all ${
                predictionXP > 0 
                  ? 'bg-green-900/30 border-green-500/30' 
                  : 'bg-red-900/30 border-red-500/30'
              }`}>
                <div className="text-center mb-4">
                  <div className={`text-4xl mb-2 ${predictionXP > 0 ? 'animate-bounce' : 'animate-pulse'}`}>
                    {predictionXP > 0 ? '🎉' : '💭'}
                  </div>
                  <h4 className={`text-lg font-bold ${
                    predictionXP > 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {predictionXP > 0 ? `Correct! +${predictionXP} XP` : 'Not quite, but good try!'}
                  </h4>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  predictionXP > 0 ? 'bg-green-800/30' : 'bg-orange-800/30'
                }`}>
                  <div className={`flex items-start gap-2 ${
                    predictionXP > 0 ? 'text-green-200' : 'text-orange-200'
                  }`}>
                    <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      {currentLine.prediction.explanation}
                    </p>
                  </div>
                </div>
                
                {predictionXP > 0 ? (
                  <div className="mt-4 text-center text-green-400 text-sm animate-pulse">
                    ✨ Moving to next line automatically...
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleTryAgain}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      🔄 Try Again
                    </button>
                    <p className="text-orange-300 text-sm mt-2">
                      💪 Learning happens through practice - give it another shot!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mini Activity */}
            {showMiniActivity && (
              <div className="bg-emerald-900/30 rounded-xl border border-emerald-500/30 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <h4 className="text-lg font-bold text-emerald-300">{currentSection.miniActivity.title}</h4>
                </div>
                
                <p className="text-emerald-200 mb-4">{currentSection.miniActivity.question}</p>
                
                <div className="space-y-2">
                  {currentSection.miniActivity.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleMiniActivityComplete(index, currentSection.miniActivity)}
                      className="w-full text-left p-3 rounded-lg border transition-all bg-emerald-800/20 border-emerald-600/30 text-emerald-200 hover:bg-emerald-600/20 hover:border-emerald-400"
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 text-center text-emerald-400 text-sm">
                  +{currentSection.miniActivity.xpReward + currentSection.completion.xpReward} XP for completion
                </div>
              </div>
            )}

            {/* Badges Display */}
            {earnedBadges.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-500/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                  <h4 className="text-yellow-300 font-bold">Badges Earned:</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.map((badge, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-600/30 border border-yellow-500/50 rounded-full text-yellow-200 text-sm">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            if (currentSectionIndex > 0) {
              setSectionIndex(currentSectionIndex - 1)
              setLineIndex(0)
            }
          }}
          disabled={currentSectionIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            currentSectionIndex === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous Section
        </button>

        <div className="text-center">
          <div className="text-white font-semibold text-lg">{currentSection.title}</div>
          <div className="text-blue-400 text-sm">
            Section {currentSectionIndex + 1} of {tutorialSections.length}
          </div>
        </div>

        <button
          onClick={() => {
            if (isSectionComplete && currentSectionIndex < tutorialSections.length - 1) {
              setSectionIndex(currentSectionIndex + 1)
              setLineIndex(0)
            }
          }}
          disabled={!isSectionComplete || currentSectionIndex === tutorialSections.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            !isSectionComplete || currentSectionIndex === tutorialSections.length - 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white transform hover:scale-105'
          }`}
        >
          Next Section
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}