// Week 1 — AI Classifier (School Supplies)
// Standards: SC.912.ET.2.2, SC.912.ET.2.3, SC.912.ET.2.5

export interface LessonTest {
  id: string
  desc: string
}

export interface QuizQuestion {
  prompt: string
  options: string[]
  answer_index: number
}

export interface LessonMode {
  type: 'main' | 'bonus'
  title: string
  dataset: string
  labels: string[]
  learn_md: string
  code: {
    starter: string
  }
  tests_ui: LessonTest[]
  quiz: {
    questions: QuizQuestion[]
  }
  checklist: string[]
  submit: {
    prompt: string
    rubric: {
      exceeds: string[]
      meets: string[]
      approaching: string[]
      beginning: string[]
    }
    badges_on_complete: string[]
  }
}

export interface AILesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  standards: string[]
  modes: LessonMode[]
}

export const aiLessons: AILesson[] = [
  {
    id: 'week-01',
    title: 'AI Classifier — School Supplies',
    description: 'Train your first image classifier using school supplies, learn about fairness and accuracy, and explore real-world applications.',
    difficulty: 'beginner',
    estimatedTime: '60 minutes in class + 60 minutes homework',
    standards: [
      'SC.912.ET.2.2: Describe major branches of AI',
      'SC.912.ET.2.3: Evaluate the application of algorithms to AI',
      'SC.912.ET.2.5: Describe major applications of AI & ML across fields'
    ],
    modes: [
      {
        type: 'main',
        title: 'School Supplies Classifier',
        dataset: 'school-supplies',
        labels: ['pencil', 'eraser', 'marker'],
        learn_md: `## 🤖 Welcome to the World of AI Vision!

Have you ever wondered how apps can recognize your face in photos, or how self-driving cars can spot stop signs? Today, you're going to build your very own AI that can see and recognize objects! 

### 🎯 Your Mission: Teach a Computer to See

Imagine you're teaching a toddler to recognize different school supplies. You'd show them lots of pencils and say "pencil" each time, right? That's exactly what we're going to do with a computer today!

**Your challenge:** Build an AI that can tell the difference between pencils ✏️, erasers 🧽, and markers 🖊️

### 🧠 AI vs Machine Learning: What's the Difference?

**Artificial Intelligence (AI)** is like giving a computer a brain that can make decisions. It's the big umbrella term for any computer that can do "smart" things.

**Machine Learning (ML)** is one way to create AI. Instead of programming every single rule (like "if it's long and thin, it's a pencil"), we let the computer learn patterns by itself from examples. It's like learning to ride a bike - you don't memorize every muscle movement, you practice until your brain figures it out!

### 📚 Key Concepts You'll Master Today

**🏷️ Labels** - Think of these as name tags for your images. When you show the AI a picture of a pencil, the label tells it "this is a pencil."

**📁 Dataset** - Your collection of example images. It's like a photo album where each photo has a label. The more diverse your album, the smarter your AI becomes!

**🎓 Training** - This is when your AI studies all the examples and learns patterns. Just like studying for a test, the AI looks for what makes pencils different from erasers.

**🧪 Testing (Inference)** - After training, we quiz the AI with new images it hasn't seen before. Can it correctly identify them? This is the real test!

**📊 Accuracy** - Your AI's report card! If it correctly identifies 8 out of 10 items, that's 80% accuracy. But here's the twist...

### ⚠️ The Accuracy Trap

Imagine your AI gets 90% accuracy - sounds great, right? But what if it's perfect at identifying pencils and markers, but completely fails at erasers? That's why we look at **per-class accuracy** - how well it does on EACH type of object.

### 🎭 The Fairness Factor

Here's something cool: AI can be biased, just like people! If you only show it fancy mechanical pencils but test it on regular wooden pencils, it might fail. That's why **representativeness** matters - your training data should include all kinds of examples.

**Think about it:** If you were training an AI to recognize dogs but only showed it poodles, what would happen when it sees a bulldog? 🤔

### 🔄 The Training Process: Your AI Journey

Here's how you'll build your AI today:

**Step 1: Choose Your Labels** 📝
You'll work with three categories: pencils, erasers, and markers. These are your labels!

**Step 2: Load Your Dataset** 📸
We've prepared a collection of images for each category. You'll see all kinds - different colors, sizes, and angles.

**Step 3: Train Your Model** 🎓
Hit the train button and watch as your AI learns! It will analyze each image and find patterns.

**Step 4: Check the Results** 📊
Look at your accuracy scores and confusion matrix (a fancy chart that shows which items your AI confuses with each other).

**Step 5: Improve Your Data** 🔧
Remove blurry or duplicate images that might confuse your AI. This is called "data cleaning"!

**Step 6: Retrain and Compare** 📈
Train again with your cleaned data and see if your accuracy improves!

### 💡 Pro Tips for Success

- **Quality over Quantity**: 20 clear, diverse images are better than 100 blurry duplicates
- **Balance is Key**: Having 50 pencil images but only 5 eraser images will make your AI biased
- **Variety Matters**: Include different types - wooden pencils, mechanical pencils, colored pencils

### 🌟 Ready to Begin?

Click on the **Code** tab when you're ready to start training your AI. Remember, you're not just playing with technology - you're learning the same concepts that power face filters, medical diagnosis AI, and even Mars rovers!

**Let's make your computer smart! 🚀**`,
        code: {
          starter: `# 🚀 Your AI Configuration
# This tells the AI what to learn!

DATASET = "school-supplies"  # The folder with all our training images
LABELS = ["pencil", "eraser", "marker"]  # What we're teaching the AI to recognize

# 🎮 Your Training Mission:
# 1) Click "Train Model" to start teaching your AI
# 2) Watch the metrics to see how smart it gets!
# 3) Find and remove at least 5 bad images (blurry/duplicates)
# 4) Train again and see if you improved it
# 5) Take a screenshot of your best results!

# 💡 Pro tip: Look for images that might confuse the AI
# Like a marker that looks like a pencil, or a blurry eraser`
        },
        tests_ui: [
          {
            id: 'dataset_loaded',
            desc: "Opened the 'school-supplies' dataset and viewed label counts."
          },
          {
            id: 'trained_once',
            desc: "Completed an initial training run and opened the metrics panel."
          },
          {
            id: 'metrics_compared',
            desc: "After removing ≥5 low-quality/duplicate images, retrained and compared accuracy + per-class accuracy."
          },
          {
            id: 'confusion_read',
            desc: "Answered the 3 short questions about the mini confusion matrix."
          },
          {
            id: 'ethics_note',
            desc: "Submitted a 3–4 sentence ethics note on representativeness and mitigation."
          }
        ],
        quiz: {
          questions: [
            {
              prompt: "What does *training* do?",
              options: ["Makes predictions", "Learns from labeled examples", "Compresses images", "Fixes blurry photos"],
              answer_index: 1
            },
            {
              prompt: "Why can accuracy be misleading?",
              options: ["It never changes", "It ignores per-class errors", "It is not a number", "It replaces labels"],
              answer_index: 1
            },
            {
              prompt: "A **label** is…",
              options: ["A file format", "The name of a category for an image", "A camera setting", "A model weight"],
              answer_index: 1
            },
            {
              prompt: "Which action improves fairness most?",
              options: ["Add music to slides", "Equalize label counts and remove duplicates", "Zoom into random pixels", "Lower the screen brightness"],
              answer_index: 1
            }
          ]
        },
        checklist: [
          "I can say how training and inference are different.",
          "I viewed overall accuracy and per-class accuracy.",
          "I improved the dataset (quality or balance) and retrained.",
          "I interpreted a tiny confusion matrix.",
          "I wrote an ethics/mitigation note."
        ],
        submit: {
          prompt: `**Mini-Project (10 min):** Make the model **clearer or fairer**.
Choose one path:
1) Rebalance labels (equal counts), or
2) Improve quality (remove blur/dupes), or
3) Add a small 4th label (10–20 images) and document impact.
**Turn in:** metrics before/after + 90-sec audio/video note + 3-bullet mitigation plan.`,
          rubric: {
            exceeds: [
              "Pre/post metrics show a justified improvement (not just luck).",
              "Confusion matrix insight is specific (names hardest class and plausible cause).",
              "Two or more concrete mitigations listed and tied to evidence."
            ],
            meets: [
              "Trained twice and compared metrics correctly.",
              "One limitation + one mitigation identified."
            ],
            approaching: [
              "Only one train run or unclear comparison; vague ethics note."
            ],
            beginning: [
              "No metrics evidence; no ethics note."
            ]
          },
          badges_on_complete: ["AI Classifier Novice"]
        }
      },
      {
        type: 'bonus',
        title: 'Recycle Ethics (Plastic/Paper/Metal)',
        dataset: 'recycle-audit',
        labels: ['plastic', 'paper', 'metal'],
        learn_md: `## 🌍 Bonus Mission: Save the Planet with AI!

Welcome to the real world, where AI decisions have real consequences! You're about to discover why accuracy isn't everything, and why AI ethics matter more than you might think.

### 🚨 The Recycling Crisis

Did you know that when recycling gets contaminated (wrong items in wrong bins), entire batches can end up in landfills? One plastic bottle in the paper recycling can ruin tons of recyclable paper! That's where AI comes in - but what happens when the AI makes mistakes?

### 🎯 Your New Challenge

You'll train an AI to sort recycling into three categories:
- **♻️ Plastic** - bottles, containers, packaging
- **📄 Paper** - newspapers, cardboard, documents  
- **🔧 Metal** - cans, foil, metal containers

Sounds easy? Here's the plot twist...

### 🤔 The Confusion Challenge

Look at these tricky cases:
- **Shiny metal can** vs **Glossy plastic bottle** - both are shiny!
- **Crumpled aluminum foil** vs **Crumpled paper** - both are wrinkled!
- **Metallic chip bag** - it looks like metal but it's actually plastic!

Your AI will struggle with these. And in the real world, these mistakes cost money and hurt the environment.

### 💰 The Real Cost of Being Wrong

When your AI makes a mistake, it's not just a number on a screen. Let's look at what happens:

**Scenario 1: Plastic in Paper Bin** 🚫
- **Cost:** Entire batch of paper becomes non-recyclable
- **Impact:** Thousands of pounds of paper go to landfill
- **Who pays:** Recycling facility loses money, cities raise taxes

**Scenario 2: Metal in Plastic Bin** ⚠️
- **Cost:** Can damage plastic recycling machinery
- **Impact:** Equipment downtime, worker safety risks
- **Who pays:** Facility repair costs, possible injuries

### 📊 Beyond Simple Accuracy

Remember when we talked about overall accuracy being misleading? Here it REALLY matters!

**Example:** Your AI has 90% accuracy
- ✅ Paper: 95% correct (great!)
- ✅ Metal: 95% correct (awesome!)
- ❌ Plastic: 80% correct (uh oh...)

That 20% error rate on plastic means 1 in 5 plastic items contaminate other bins. That's thousands of mistakes per day in a real recycling facility!

### 🎭 The Ethics of AI Deployment

Before putting an AI system into the real world, we need to ask:

1. **Who gets hurt when it fails?** 
   - Workers who have to manually sort contaminated batches
   - Environment when recyclables become trash
   - Communities paying higher waste management costs

2. **Is it fair to everyone?**
   - Does it work equally well on all types of materials?
   - Are some communities' recycling habits better represented?

3. **How do we make it better?**
   - More diverse training data
   - Clear documentation of limitations
   - Human oversight for uncertain cases

### 🔬 Your Investigation

As you train this recycling AI, you'll discover:
- Which materials are hardest to classify and why
- How data quality affects real-world performance
- Why "good enough" might not be good enough

### 💡 Real-World AI Design

Professional AI engineers use these strategies:

**Strategy 1: Confusion Zones** 🤷
When the AI isn't confident, it says "I don't know" instead of guessing. Better to ask a human than contaminate a batch!

**Strategy 2: Cost-Weighted Accuracy** 💰
Some mistakes are worse than others. Putting metal in plastic (dangerous) is worse than paper in plastic (just wasteful).

**Strategy 3: Continuous Learning** 📈
Real AIs keep learning from their mistakes. Every correction makes them smarter!

### 🌟 Your Ethics Challenge

After training your recycling AI:
1. Identify which misclassification would be most harmful
2. Propose two ways to reduce that specific error
3. Explain who benefits from your improvements

### 🚀 Ready for Real Impact?

This isn't just a school exercise - these are the exact same challenges faced by:
- Amazon's recycling robots
- Smart city waste management systems
- Environmental protection agencies

**Your AI decisions today could inspire the recycling solutions of tomorrow! Let's build AI that makes the world better, not just more automated.** 🌍✨`,
        code: {
          starter: `# 🌍 Save the Planet with AI!
# Your recycling classifier configuration

DATASET = "recycle-audit"  # Real recycling center images
LABELS = ["plastic", "paper", "metal"]  # Materials to sort

# 🚨 Your Mission:
# 1) Train your recycling AI and check the metrics
# 2) Find which material is hardest to classify (hint: confusion matrix!)
# 3) Remove confusing images (shiny plastics? crumpled paper?)
# 4) Retrain and see if you reduced contamination errors
# 5) Document which mistake would be most harmful

# 💡 Think about it: What happens when plastic ends up in paper recycling?
# Your AI's mistakes have real environmental impact!`
        },
        tests_ui: [
          {
            id: 'recycle_trained',
            desc: "Completed a training run on Plastic/Paper/Metal and opened metrics."
          },
          {
            id: 'hardest_class_identified',
            desc: "Identified the hardest class from the confusion matrix with a plausible reason."
          },
          {
            id: 'mitigation_proposed',
            desc: "Proposed ≥2 targeted mitigations (e.g., more matte plastic, varied paper textures)."
          },
          {
            id: 'cost_reasoned',
            desc: "Wrote 2–3 sentences on the *cost* of a misclassification and who is affected."
          }
        ],
        quiz: {
          questions: [
            {
              prompt: "A **false positive** for Metal when the item is Plastic most likely causes…",
              options: ["Better recycling revenue", "Contamination/extra sorting cost", "No effect", "Higher camera brightness"],
              answer_index: 1
            },
            {
              prompt: "Which dataset tweak helps most with glare?",
              options: ["Add more shiny examples of each class", "Delete the metal class", "Lower model size", "Randomly rotate images only"],
              answer_index: 0
            },
            {
              prompt: "Per-class accuracy matters because…",
              options: ["It equals overall accuracy", "It reveals which class is being mis-served", "It is easier to compute", "It removes bias automatically"],
              answer_index: 1
            },
            {
              prompt: "Which is an **ethical** mitigation?",
              options: ["Hide metrics from users", "Document limitations and collect more diverse samples", "Delete low-scoring classes silently", "Promise 100% accuracy"],
              answer_index: 1
            }
          ]
        },
        checklist: [
          "I trained and evaluated the recycle dataset.",
          "I identified the hardest class and a likely cause.",
          "I proposed at least two mitigations.",
          "I explained the real-world cost of one misclassification."
        ],
        submit: {
          prompt: `**Bonus Challenge (10–15 min):** Write a short **Ethics & Impact** memo (120–180 words).
Include 1 metric insight, 2 mitigations, and who is affected by errors (students, staff, city).
Attach a metrics screenshot.`,
          rubric: {
            exceeds: [
              "Memo includes metric insight + two specific mitigations + stakeholder impact.",
              "Mitigations are feasible and tied to the observed errors."
            ],
            meets: [
              "Memo includes metric insight + one mitigation + a named stakeholder."
            ],
            approaching: [
              "Memo lacks specifics or evidence."
            ],
            beginning: [
              "No memo or purely opinion without metrics."
            ]
          },
          badges_on_complete: ["Ethical AI — Starter"]
        }
      }
    ]
  }
]

// Legacy function to maintain compatibility with existing code
export function getAllLessons() {
  return aiLessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    estimatedTime: lesson.estimatedTime,
    sections: [] // Will be handled by new lesson viewer
  }))
}

// New function to get AI lesson by ID
export function getAILesson(id: string): AILesson | undefined {
  return aiLessons.find(lesson => lesson.id === id)
}

export default aiLessons

// Legacy types for backward compatibility
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