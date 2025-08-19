// Quick test to insert lesson data directly
// Run this in browser console on the dashboard page

const insertTestLesson = async () => {
  // Get the Supabase client from the page
  const { createClient } = await import('./src/lib/supabase.js');
  const supabase = createClient();
  
  const testLesson = {
    week: 1,
    title: "Python Basics — Magic 8-Ball",
    duration_minutes: 60,
    unlock_rule: "sequential",
    objectives: [
      "Use variables and input/output to build an interactive program",
      "Run and test code in the browser",
      "Follow a test → fix → retest loop"
    ],
    standards: [
      "FL-CPALMS: SC.912.CS-CS.1.1 - Algorithm Development"
    ],
    learn_md: `## Welcome
You'll build a **Magic 8-Ball** app that answers your questions at random.

### Key ideas
- **Variable**: a named container for data.
- **Input / Output**: \`input()\` asks the user; \`print()\` shows a message.
- **Random choice**: pick 1 item from a list.`,
    starter_code: `import random

answers = ["Yes", "No", "Maybe", "Ask again later"]
question = input("Ask the Magic 8-Ball your question: ")
print(random.choice(answers))`,
    tests_py: "",
    patterns: {},
    quiz_items: [],
    checklist: [
      "I ran code without errors",
      "I used variables and input()",
      "I tested my program"
    ],
    submit_prompt: "Describe what you built (3–4 sentences).",
    rubric: {},
    badges_on_complete: ["First Run"]
  };

  const { data, error } = await supabase
    .from('lessons')
    .insert(testLesson)
    .select();

  console.log('Insert result:', { data, error });
  
  // Refresh the page to see the lesson
  window.location.reload();
};

// Call the function
insertTestLesson();