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
        learn_md: `## 🤖 Do You Want to Know How a Computer Can Tell School Supplies Apart?

Have you ever wondered how your phone can recognize your face in photos? Or how Netflix knows which shows you might like? Or how self-driving cars can spot stop signs from a distance? All of these amazing abilities come from something called **Machine Learning** - and today, you're going to discover exactly how it works by building your own intelligent computer vision system!

### 🧠 What Exactly IS Machine Learning?

Imagine trying to teach your little cousin to recognize different dog breeds. You wouldn't sit down and write a list of rules like "if it's small and fluffy, it's a Pomeranian" or "if it's big with droopy ears, it's a Bloodhound." Instead, you'd show them hundreds of pictures of different dogs and tell them the breed each time. Eventually, their brain would start recognizing patterns - the shape of ears, the size of the snout, the texture of fur - and they'd be able to identify new dogs they'd never seen before.

**Machine Learning works exactly the same way!** Instead of programming a computer with thousands of specific rules, we show it tons of examples and let it discover the patterns on its own. It's like teaching a computer to learn from experience, just like humans do.

### 🆚 AI vs. Machine Learning: What's the Real Difference?

Think of **Artificial Intelligence (AI)** like the concept of "being smart." It's any computer system that can do things we normally think require human intelligence - like recognizing faces, understanding speech, or making decisions.

**Machine Learning (ML)** is one specific way to create AI. It's like teaching intelligence through practice and examples, rather than programming every single rule by hand.

**Here's a perfect analogy:** 
- **AI** is like "being good at basketball" 
- **Machine Learning** is like "getting good at basketball by practicing thousands of shots" instead of just memorizing a rulebook

So when you hear about AI recognizing images or recommending music, it's usually Machine Learning doing the heavy lifting behind the scenes!

### 📚 Essential Vocabulary: The Building Blocks of ML

Let's break down the key terms you'll be using like a pro by the end of today:

### 🏷️ Labels: The Name Tags of AI

**Labels** are like digital name tags that tell the computer what each image shows. Think of them as the "correct answers" we give the AI during learning.

**Real-world analogy:** When you organize your photos on your phone, you might put them in albums labeled "Family," "Vacation," or "School." Labels work the same way - they're categories that help organize and identify things.

In our project today, we'll use three labels: "pencil," "eraser," and "marker." Every image in our collection has one of these labels attached, so the AI knows what it's looking at during training.

### 📁 Datasets: The AI's Textbook Collection

A **dataset** is like a massive digital textbook filled with examples for the AI to study. Just like you need lots of practice problems to master algebra, AI needs lots of example images to learn patterns.

**Think of it this way:** If you wanted to become an expert at identifying different car models, you'd want to see thousands of photos of cars - different angles, different lighting, different colors, old ones, new ones, clean ones, muddy ones. The more variety you see, the better you'd get at recognizing cars in any situation.

Our dataset contains hundreds of images of school supplies, each one carefully labeled so our AI can learn what makes a pencil look like a pencil versus what makes an eraser look like an eraser.

### 🎓 Training: Teaching Through Repetition

**Training** is when the AI studies all the examples in the dataset and starts recognizing patterns. Imagine you're learning to identify different music genres - you'd listen to hundreds of rock songs, pop songs, and classical pieces until you could instantly recognize the style of a new song.

During training, our AI looks at thousands of images and notices things like:
- Pencils are usually long and thin with pointy ends
- Erasers are often rectangular or cylindrical with smooth surfaces  
- Markers have caps and are usually colorful

The computer doesn't think in words like we do - instead, it notices mathematical patterns in the pixels, colors, shapes, and textures.

### 🧪 Inference: The Final Exam

**Inference** (also called "testing") is when we show the AI new images it has never seen before and ask it to make predictions. This is like taking a final exam after studying all semester - can the AI apply what it learned to completely new situations?

**Here's the crucial part:** We NEVER let the AI see the test images during training. That would be like letting a student see the final exam questions while studying - it wouldn't prove they really learned the concepts!

### 📊 Accuracy: The AI's Report Card

**Accuracy** tells us what percentage of predictions the AI got correct. If our AI looks at 100 new images and correctly identifies 85 of them, that's 85% accuracy.

**But here's where it gets tricky...** Overall accuracy can be misleading!

**Imagine this scenario:** Your AI gets 90% accuracy overall, which sounds amazing! But when you look closer:
- Pencils: 95% correct ✅
- Markers: 95% correct ✅  
- Erasers: 80% correct ⚠️

Even with great overall accuracy, the AI is struggling with erasers. In real-world applications, this kind of imbalance could be a serious problem!

### 🤔 The Confusion Matrix: Where AI Gets Mixed Up

A **confusion matrix** is like a detailed report card that shows exactly which items the AI confuses with each other. It's called "confusion" because it reveals where the AI gets confused!

**Think of it like this:** Imagine you're a teacher grading tests, and you notice that students keep confusing "there," "their," and "they're." The confusion matrix would show you exactly which words get mixed up most often, helping you know what to focus on in your next lesson.

In our AI project, the confusion matrix might show that the AI sometimes thinks mechanical pencils are markers (because they're both colorful and cylindrical) or that pink erasers are markers (because they're both bright and colorful).

### ⚖️ Fairness and Representativeness: The Bias Problem

This is where AI ethics gets really important! **Representativeness** means making sure your dataset includes fair examples of everything you want the AI to recognize.

**Here's a powerful example:** Imagine training an AI to recognize "pencils" but only showing it fancy mechanical pencils from one brand. When students in different schools try to use it with regular wooden pencils, older pencils, or pencils from different countries, the AI might fail completely. That's not fair to those students!

**Real-world impact:** Early facial recognition systems were trained mostly on photos of light-skinned people, so they performed poorly on people with darker skin. This wasn't intentional, but it created real-world discrimination. AI systems used by police, hospitals, and schools can perpetuate unfair biases if we're not careful about representativeness.

**In our project today**, we need to ask: Do our school supply images represent the diversity of supplies that real students actually use? Are there different brands, colors, ages, and conditions represented?

### 🔍 Why This All Matters: Real-World Applications

The concepts you're learning today power incredible technologies:

**🏥 Medical AI** uses these same principles to help doctors spot diseases in X-rays and MRI scans
**🚗 Self-driving cars** use computer vision to identify pedestrians, road signs, and other vehicles
**📱 Your smartphone** uses it for face unlock, photo organization, and translation apps
**🛡️ Security systems** use it to monitor for suspicious activities
**🌱 Environmental protection** uses it to track wildlife populations and monitor deforestation

Understanding how these systems work - including their limitations and potential biases - makes you a more informed digital citizen who can help build a more fair and equitable technological future.

### 🎯 Your Mission Today

You're going to experience the entire machine learning pipeline:
1. **Explore** a real dataset of school supplies
2. **Train** an AI model to recognize patterns  
3. **Evaluate** its performance with accuracy metrics
4. **Investigate** where it gets confused using the confusion matrix
5. **Improve** the dataset by removing problematic images
6. **Retrain** and compare the results
7. **Reflect** on the ethical implications of your AI system

Remember: you're not just playing with cool technology - you're learning to think like a data scientist and AI engineer. These are the same skills that tech companies, research labs, and startups use to solve real-world problems!

### 🚀 Ready to Build Your AI?

Click on the **Code** tab to start your journey into machine learning. You're about to discover how computers learn to see the world - and maybe discover your own passion for artificial intelligence!

**Let's teach a computer to be smart! 🧠✨**`,
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