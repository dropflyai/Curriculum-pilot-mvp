-- Insert Week 1 Magic 8-Ball Lesson
INSERT INTO public.lessons (
    week,
    title,
    duration_minutes,
    unlock_rule,
    objectives,
    standards,
    learn_md,
    starter_code,
    tests_py,
    patterns,
    quiz_items,
    checklist,
    submit_prompt,
    rubric,
    badges_on_complete
) VALUES (
    1,
    'Python Basics — Magic 8-Ball',
    60,
    'sequential',
    ARRAY[
        'Use variables and input/output to build an interactive program',
        'Run and test code in the browser',
        'Follow a test → fix → retest loop'
    ],
    ARRAY[
        'FL-CPALMS: SC.912.CS-CS.1.1 - Algorithm Development',
        'FL-CPALMS: SC.912.CS-CS.2.1 - Programming Fundamentals'
    ],
    '## Welcome
You''ll build a **Magic 8-Ball** app that answers your questions at random.

### Key ideas
- **Variable**: a named container for data.
- **Input / Output**: `input()` asks the user; `print()` shows a message.
- **Random choice**: pick 1 item from a list.

### Quick example
```python
name = input("Your name: ")
print("Hi", name)
```

**Micro-check (10s):** What function shows text on screen? → `print()`

### Your Mission
1. Ask the user for a question
2. Pick a random answer from your list
3. Display the mystical response
4. Test your code by running it

### Pro Tips
- Use descriptive variable names
- Test early and often
- Read error messages carefully
- Ask for help when stuck!',
    'import random

answers = ["Yes", "No", "Maybe", "Ask again later"]
question = input("Ask the Magic 8-Ball your question (or type ''quit''): ")
print(random.choice(answers))',
    'import builtins, types, sys, io, ast, re, random
import contextlib

# Capture stdout
buf = io.StringIO()
failed_tests = []

def test_imports():
    """Test that required imports are present"""
    try:
        # Check if random is imported
        assert "random" in globals() or "import random" in user_code
        return True
    except:
        failed_tests.append("Missing import random")
        return False

def test_has_list():
    """Test that answers list exists with at least 4 items"""
    try:
        assert len(answers) >= 4
        return True
    except:
        failed_tests.append("Need answers list with at least 4 items")
        return False

def test_has_input():
    """Test that input() is used"""
    try:
        assert "input(" in user_code
        return True
    except:
        failed_tests.append("Must use input() to ask user question")
        return False

def test_has_random_choice():
    """Test that random.choice is used"""
    try:
        assert "random.choice" in user_code
        return True
    except:
        failed_tests.append("Must use random.choice() to pick answer")
        return False

# Run tests
test_imports()
test_has_list()
test_has_input() 
test_has_random_choice()

if failed_tests:
    print("❌ Tests failed:")
    for test in failed_tests:
        print(f"  • {test}")
else:
    print("✅ All tests passed! Great work!")',
    '{
        "requires_imports": ["random"],
        "min_list_length": 4,
        "must_use_calls": ["input", "print", "random.choice"]
    }'::jsonb,
    '[
        {
            "type": "mcq",
            "q": "What function do you use to get user input in Python?",
            "options": ["input()", "get()", "ask()", "prompt()"],
            "answer": "input()"
        },
        {
            "type": "mcq", 
            "q": "Which function picks a random item from a list?",
            "options": ["random.pick()", "random.choice()", "random.select()", "random.get()"],
            "answer": "random.choice()"
        },
        {
            "type": "short",
            "q": "What does the print() function do?"
        }
    ]'::jsonb,
    ARRAY[
        'I ran code without errors',
        'I used variables and input()',
        'I used random.choice() to pick answers',
        'I tested my program with different questions'
    ],
    'Describe what you built (3–4 sentences). What did you learn about variables and random choices?',
    '{
        "criteria": [
            {
                "name": "Functionality",
                "levels": ["no run", "errors", "runs", "runs + extras"],
                "points": [0, 1, 2, 3]
            },
            {
                "name": "Code Quality", 
                "levels": ["unclear", "some clarity", "clear", "clear + comments"],
                "points": [0, 1, 2, 3]
            }
        ]
    }'::jsonb,
    ARRAY['First Run', 'Ship It']
);

-- Insert test users
INSERT INTO public.users (id, email, full_name, role) VALUES 
(gen_random_uuid(), 'student@test.com', 'Test Student', 'student'),
(gen_random_uuid(), 'teacher@test.com', 'Test Teacher', 'teacher')
ON CONFLICT (email) DO NOTHING;