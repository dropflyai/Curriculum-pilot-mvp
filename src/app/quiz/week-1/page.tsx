'use client'

import { useRouter } from 'next/navigation'
import WeekCompletionQuiz from '@/components/WeekCompletionQuiz'

export default function Week1Quiz() {
  const router = useRouter()

  const questions = [
    {
      id: 1,
      question: "Which of the following is the correct way to create a variable in Python?",
      options: [
        "variable mission_status = 'ACTIVE'",
        "mission_status = 'ACTIVE'",
        "let mission_status = 'ACTIVE'",
        "var mission_status = 'ACTIVE'"
      ],
      correctAnswer: 1,
      explanation: "In Python, you create variables by simply writing the name followed by = and the value. No special keywords like 'var' or 'let' are needed.",
      concept: "Variable Creation"
    },
    {
      id: 2,
      question: "What type of data is stored in the variable: agent_level = 7",
      options: [
        "String",
        "Boolean",
        "Integer",
        "Float"
      ],
      correctAnswer: 2,
      explanation: "The number 7 without quotes is an integer (whole number). Strings would have quotes, booleans are True/False, and floats have decimal points.",
      concept: "Data Types"
    },
    {
      id: 3,
      question: "Which variable assignment is correct for storing text?",
      options: [
        "agent_name = Commander Atlas",
        "agent_name = 'Commander Atlas'",
        "agent_name = (Commander Atlas)",
        "agent_name = Commander Atlas;"
      ],
      correctAnswer: 1,
      explanation: "Text (strings) in Python must be enclosed in quotes, either single or double quotes. Without quotes, Python thinks it's a variable name.",
      concept: "String Variables"
    },
    {
      id: 4,
      question: "What is the correct way to set a boolean variable to True?",
      options: [
        "is_active = true",
        "is_active = 'True'",
        "is_active = True",
        "is_active = TRUE"
      ],
      correctAnswer: 2,
      explanation: "In Python, boolean values must be capitalized: True and False. They are not strings (no quotes) and not lowercase.",
      concept: "Boolean Values"
    },
    {
      id: 5,
      question: "What happens when you run this code: print(mission_status)?",
      options: [
        "It prints the word 'mission_status'",
        "It prints the value stored in the mission_status variable",
        "It causes an error if mission_status doesn't exist",
        "Both B and C are correct"
      ],
      correctAnswer: 3,
      explanation: "The print() function displays the value of a variable. If the variable doesn't exist, Python will give a NameError.",
      concept: "Variable Usage"
    },
    {
      id: 6,
      question: "Which of these is NOT a valid Python variable name?",
      options: [
        "agent_007",
        "mission_status",
        "2nd_mission",
        "clearance_level"
      ],
      correctAnswer: 2,
      explanation: "Variable names cannot start with a number. They can contain numbers, but must start with a letter or underscore.",
      concept: "Variable Naming Rules"
    },
    {
      id: 7,
      question: "If you want to change the value of an existing variable, you:",
      options: [
        "Cannot change it once created",
        "Use the same syntax: variable_name = new_value",
        "Must delete it first with delete variable_name",
        "Need to use 'update variable_name = new_value'"
      ],
      correctAnswer: 1,
      explanation: "Variables in Python can be reassigned using the same syntax you use to create them. Just use = with the new value.",
      concept: "Variable Reassignment"
    },
    {
      id: 8,
      question: "What's the difference between '5' and 5 in Python?",
      options: [
        "There is no difference",
        "'5' is a string, 5 is a number",
        "'5' is a variable name, 5 is a value",
        "They are the same data type"
      ],
      correctAnswer: 1,
      explanation: "'5' with quotes is a string (text), while 5 without quotes is a number. You can do math with numbers but not with strings containing numbers.",
      concept: "Strings vs Numbers"
    }
  ]

  const handleQuizComplete = (score: number, xpEarned: number) => {
    // Navigate to achievements page or week summary
    router.push(`/achievements/week-1?quiz-score=${score}&quiz-xp=${xpEarned}`)
  }

  return (
    <WeekCompletionQuiz
      weekNumber={1}
      questions={questions}
      onComplete={handleQuizComplete}
    />
  )
}