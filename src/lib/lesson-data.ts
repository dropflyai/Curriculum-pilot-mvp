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

export interface Flashcard {
  id: string
  category: string
  front: string
  back: string
  emoji?: string
}

export interface LessonSlide {
  id: string
  title: string
  content: string
  emoji?: string
}

export interface LessonMode {
  type: 'main' | 'bonus'
  title: string
  dataset: string
  labels: string[]
  learn_md?: string // Keep for backward compatibility
  learn_slides?: LessonSlide[] // New slide-based content
  code: {
    starter: string
  }
  tests_ui: LessonTest[]
  quiz: {
    questions: QuizQuestion[]
  }
  checklist: string[]
  flashcards?: Flashcard[]
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
    title: 'AI Classifier',
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
            desc: "Improved the dataset by flagging 5+ problematic images, then retrained the AI to see if accuracy improved."
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
  },
  {
    id: 'week-02',
    title: 'Python: School-Positive Advisor',
    description: 'Build an AI-powered chatbot that provides encouraging, school-focused advice to help students stay motivated and positive.',
    difficulty: 'beginner',
    estimatedTime: '60 minutes in class + 60 minutes homework',
    standards: [
      'MA.K12.MTR.4.1: Engage in discussions that reflect on the mathematical thinking of self and others',
      'MA.K12.MTR.6.1: Assess the reasonableness of solutions',
      'SC.912.L.16.10: Evaluate the impact of biotechnology on the individual, society and environment'
    ],
    modes: [
      {
        type: 'main',
        title: 'School-Positive Advisor Bot',
        dataset: 'school-advice',
        labels: ['encouragement', 'study-tips', 'motivation', 'goal-setting'],
        learn_slides: [
          {
            id: 'slide-1',
            title: 'Building Your AI Study Buddy',
            emoji: '🎓',
            content: `## 🎓 Build Your Own School Success Advisor!

### What We're Building Today

Imagine having a friendly AI buddy who's always there when you need help with school. Whether you're stressed about a test, overwhelmed with homework, or just need some motivation - your AI advisor will know exactly what to say!

**Your Goal:** Create an AI that makes school life better for everyone by providing personalized encouragement, study tips, and motivation!

### 🎯 Your 7-Step Coding Mission

Here's your complete roadmap to building an amazing School Success Advisor. Check off each step as you complete it:

#### ✅ Step 1: Set Up the Advisor Framework
Create Python classes and methods that can store different types of responses. You'll build the foundation that makes everything else possible!

#### ✅ Step 2: Create Response Categories  
Build separate sections for encouragement, study tips, motivation, and goal setting. Each category will have specialized responses for different situations.

#### ✅ Step 3: Build a Message Classifier
Code an intelligent system that can read a student message and figure out what kind of help they need. This is where the "AI" magic happens!

#### ✅ Step 4: Design Response Templates
Write encouraging, helpful responses that actually work - not just generic "good luck!" messages. Make them specific and actionable.

#### ✅ Step 5: Add Personality Elements  
Make your AI sound like a supportive friend, not a robot. Add variety, humor, and warmth to the responses.

#### ✅ Step 6: Test with Realistic Scenarios
Try out your AI with real problems students face. Test edge cases and make sure it handles various situations well.

#### ✅ Step 7: Implement Safety Features
Add boundaries so your AI knows when to suggest talking to adults. This is crucial for responsible AI development!`
          },
          {
            id: 'slide-2',
            title: 'How AI Advisors Work',
            emoji: '🤖',
            content: `### 🤖 How AI Advisors Actually Work

Before we start coding, let's understand what makes a good AI advisor. It's like teaching a robot to be a really good friend!

**The 4 Types of Help Students Need:**

### 🎯 1. Encouragement - When You're Feeling Down About Grades

We've all been there - you get a bad grade and suddenly feel like you're not smart enough. Maybe you failed a test you studied hard for, or you're the only one who doesn't understand something in class. This is when students need encouragement the most.

**Example:**
- Student says: *"I got a D on my history test and feel stupid"*
- AI responds: *"Getting a tough grade doesn't mean you're stupid! Let's figure out what happened and make a study plan for next time."*

### 📚 2. Study Tips - When You Need Help Figuring Out HOW to Study

Sometimes the problem isn't motivation - it's that you literally don't know where to start. You have a huge science test tomorrow, five chapters to read, and your brain feels like it's going to explode. This is when practical study strategies save the day.

**Example:**
- Student says: *"I have a huge science test tomorrow and don't know where to start"*
- AI responds: *"Let's break this down! Try the 20-20-20 method: 20 minutes reviewing notes, 20 minutes practicing problems, 20 minutes explaining concepts out loud."*

### 🚀 3. Motivation - When You Just Don't Feel Like Doing the Work

**Example:**
- Student says: *"I have so much homework and just want to watch Netflix"*
- AI responds: *"That feeling is totally normal! Try the 15-minute rule: commit to just 15 minutes of homework. Often starting is the hardest part."*

### 🎯 4. Goal Setting - When You Want to Improve But Don't Know How

**Example:**
- Student says: *"I want to raise my GPA but don't know how"*
- AI responds: *"Great goal! Let's create a specific plan. What's your current GPA and target? We can set weekly goals for each class."*

### 🧠 Why Positive Thinking Actually Works (Real Science!)

Here's something that might blow your mind: scientists have proven that the way you talk to yourself literally changes your brain! This isn't some feel-good nonsense - it's real neuroscience.

When students practice positive self-talk, their test scores improve by an average of **23%**. That's like going from a C to a B just by changing how you think! Students who develop what psychologists call a "growth mindset" report **40% less stress** during finals week. Your brain actually creates new neural pathways when you practice positive thinking consistently.

**Here's how your AI will rewire students' thinking patterns:**

Instead of letting someone think *"I'm terrible at math,"* your AI will gently redirect them to *"You're still learning math concepts - everyone masters them at different speeds."*

When someone says *"I always fail tests,"* your AI reframes it as *"You haven't found the right test-taking strategy yet. Let's experiment with some new approaches."*

That thought *"This is too hard for me"* becomes *"This is challenging, which means your brain is growing! Let's break it into smaller pieces."*

### 🔧 The Programming Challenge

Now let's think like programmers! To build a helpful AI advisor, our Python code needs to understand 4 important concepts:

#### 1. Natural Language Processing (NLP)
- **What it is:** Teaching computers to understand human text
- **Real example:** When you text "I'm stressed about the test tomorrow," the AI knows you need encouragement AND study tips
- **Why it's cool:** It's like giving your computer the ability to read emotions!

#### 2. Sentiment Analysis
- **What it is:** Figuring out if someone is happy, sad, frustrated, or excited
- **Real example:** "I failed again" = sad, needs encouragement vs "I'm ready to try!" = motivated, needs a plan
- **Why it matters:** Your AI gives different help based on how someone is feeling

#### 3. Response Generation
- **What it is:** Creating helpful, specific responses (not just "good luck!")
- **Real example:** Instead of "study more," your AI says "try the 20-20-20 method I mentioned"
- **The trick:** Having templates for different situations but making them feel personal

#### 4. Ethical AI
- **What it is:** Making sure your AI is safe and helpful, not harmful
- **Real example:** Your AI says "talk to a counselor" for serious problems, not "just think positive"
- **Why it's important:** With great coding power comes great responsibility!

### 🌍 Real-World Impact - You're Building Something That Matters!

Apps like the one you're building are already helping millions of students around the world:

- **School counseling apps** help over 5 million students daily with 24/7 support
- **Study motivation platforms** help 78% of users improve their study habits  
- **Mental wellness tools** served 2.3 million teenagers last year
- **Academic coaching bots** are used by 340+ universities worldwide

That's the power of what you're learning to build today!

### 🚀 Ready to Start Coding?

You're about to create technology that could genuinely help students succeed in school. This isn't just a coding exercise - you're building a tool that understands real challenges and provides meaningful support.

**Remember the 7 Steps:**
1. ✅ Set up the advisor framework
2. ✅ Create response categories  
3. ✅ Build a message classifier
4. ✅ Design response templates
5. ✅ Add personality elements
6. ✅ Test with realistic scenarios
7. ✅ Implement safety features

**Your goal:** Create an AI that makes school life better for everyone!

**Let's start by looking at the starter code and building your first AI advisor function! Click the Code tab to begin! 🚀✨**`
          }
        ],
        code: {
          starter: `# 🎓 School Success Advisor - Build Your AI Study Buddy!
# Follow the 7 steps to create an AI that helps students succeed!

import random

# STEP 1: Set up the advisor framework
class SchoolAdvisor:
    def __init__(self):
        self.name = "StudyBuddy"
        
        # STEP 2: Create response categories
        self.responses = {
            'encouragement': [
                "Remember, every expert was once a beginner! You're growing your brain right now! 🧠",
                "Mistakes are proof that you're trying. That's actually awesome! 💪",
                "Your effort matters more than perfection. Keep going! 🌟"
            ],
            'study_tips': [
                "Try the Pomodoro Technique: 25 minutes focused study, 5 minute break! ⏰",
                "Teaching concepts out loud helps your brain remember better! 🗣️", 
                "Make flashcards or draw diagrams - visual learning rocks! 🎨"
            ],
            'motivation': [
                "You've overcome challenges before, and you can do it again! 🚀",
                "Every small step forward is progress. You've got this! 👟",
                "Think about your future self - they'll thank you for not giving up! ✨"
            ],
            'goal_setting': [
                "Let's break that big goal into smaller, manageable pieces! 🧩",
                "What's one thing you could do today to move closer to your goal? 🎯",
                "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound! 📊"
            ]
        }
    
    # STEP 3: Build a message classifier
    def analyze_message(self, message):
        """Determine what type of help the student needs"""
        message = message.lower()
        
        # Keywords for different categories
        encouragement_words = ['failed', 'stupid', 'can\\'t', 'hate', 'frustrated', 'give up']
        study_words = ['test', 'exam', 'homework', 'study', 'learn', 'remember']
        motivation_words = ['tired', 'lazy', 'procrastinating', 'netflix', 'don\\'t want']
        goal_words = ['want to', 'goal', 'plan', 'future', 'improve', 'better']
        
        # Count keyword matches
        scores = {
            'encouragement': sum(1 for word in encouragement_words if word in message),
            'study_tips': sum(1 for word in study_words if word in message),
            'motivation': sum(1 for word in motivation_words if word in message),
            'goal_setting': sum(1 for word in goal_words if word in message)
        }
        
        # Return category with highest score
        return max(scores, key=scores.get)
    
    # STEP 4 & 5: Design response templates with personality
    def get_response(self, message):
        """Generate an encouraging response based on the message"""
        category = self.analyze_message(message)
        response = random.choice(self.responses[category])
        
        # STEP 7: Implement safety features (check for serious issues)
        serious_keywords = ['depressed', 'suicide', 'hurt myself', 'abuse', 'violence']
        if any(word in message.lower() for word in serious_keywords):
            return "I notice you're going through something really serious. Please talk to a trusted adult, counselor, or call a helpline like 988 (Suicide & Crisis Lifeline). You deserve real support! 💙"
        
        return f"Hi! I'm {self.name}! 😊\\n\\n{response}\\n\\nWhat else can I help you with?"

# STEP 6: Test with realistic scenarios
advisor = SchoolAdvisor()

# Test these realistic student messages:
test_messages = [
    "I failed my math test and feel really stupid",
    "I have a huge science exam tomorrow and don't know how to study",
    "I keep procrastinating on my English essay",
    "I want to get better grades but don't know where to start"
]

print("🤖 Testing your School-Positive Advisor!")
print("=" * 50)

for message in test_messages:
    print(f"Student: {message}")
    print(f"Advisor: {advisor.get_response(message)}")
    print("-" * 30)

# 🚀 YOUR CODING CHALLENGES:
# Challenge 1: Add at least 3 more responses to each category
# Challenge 2: Create a new category (like 'test_anxiety' or 'time_management')
# Challenge 3: Improve the keyword detection to be more accurate
# Challenge 4: Add a conversation history feature
# Challenge 5: Make the responses more personalized
# Challenge 6: Add emoji reactions based on the sentiment
# Challenge 7: Create a "daily motivation" feature

print("\\n💡 Remember the 7 Steps:")
print("1. ✅ Set up the advisor framework")
print("2. ✅ Create response categories")
print("3. ✅ Build a message classifier")
print("4. ✅ Design response templates")
print("5. ✅ Add personality elements")
print("6. ✅ Test with realistic scenarios")
print("7. ✅ Implement safety features")
print("\\n🎯 Your goal: Create an AI that makes school life better for everyone!")`,
        },
        tests_ui: [
          {
            id: 'advisor_created',
            desc: "Created the SchoolAdvisor class and tested it with the provided messages."
          },
          {
            id: 'responses_added',
            desc: "Added at least 2 more response options to each category."
          },
          {
            id: 'new_category',
            desc: "Added a new help category (like 'time_management' or 'test_anxiety') with responses."
          },
          {
            id: 'keyword_improved',
            desc: "Enhanced the keyword detection system to be more accurate."
          },
          {
            id: 'personal_test',
            desc: "Tested the advisor with 3 original student messages and verified helpful responses."
          }
        ],
        quiz: {
          questions: [
            {
              prompt: "What is the main purpose of sentiment analysis in the School Advisor?",
              options: ["To count words", "To detect emotions and categorize student needs", "To translate languages", "To check spelling"],
              answer_index: 1
            },
            {
              prompt: "Why is it important for AI advisors to have boundaries?",
              options: ["To save computing power", "To ensure student safety and know when to refer to professionals", "To run faster", "To use less memory"],
              answer_index: 1
            },
            {
              prompt: "What makes a response 'school-positive'?",
              options: ["It's long and detailed", "It focuses on growth, effort, and actionable solutions", "It uses big words", "It's written in all caps"],
              answer_index: 1
            },
            {
              prompt: "How does keyword matching help classify messages?",
              options: ["It counts letters", "It identifies topic categories based on word patterns", "It fixes grammar", "It translates text"],
              answer_index: 1
            }
          ]
        },
        checklist: [
          "I completed the Knowledge Quest and learned Python & AI concepts.",
          "I mastered Python fundamentals through the interactive concepts walkthrough.",
          "I built my own AI advisor with knowledge base, brain function, and response system.",
          "I tested my AI advisor with real student scenarios and verified it works.",
          "I understand how AI can help students with personalized, ethical responses.",
          "I'm ready to claim my Python programming badge and advance to the next level!"
        ],
        flashcards: [
          // Category: The 4 Types of Help Students Need
          {
            id: 'help-1',
            category: '4 Types of Help',
            front: '🎯 What is ENCOURAGEMENT help?',
            back: 'When students feel down about grades or abilities. Example: "I got a D and feel stupid" → AI responds with understanding and creates a study plan.',
            emoji: '🎯'
          },
          {
            id: 'help-2',
            category: '4 Types of Help',
            front: '📚 What are STUDY TIPS for?',
            back: 'When students don\'t know HOW to study. Example: "Huge test tomorrow, don\'t know where to start" → AI suggests 20-20-20 method (20 min notes, 20 min practice, 20 min explain).',
            emoji: '📚'
          },
          {
            id: 'help-3',
            category: '4 Types of Help',
            front: '🚀 When do students need MOTIVATION?',
            back: 'When they know what to do but don\'t feel like doing it. Example: "So much homework, want Netflix" → AI suggests 15-minute rule to start small.',
            emoji: '🚀'
          },
          {
            id: 'help-4',
            category: '4 Types of Help',
            front: '🎯 What is GOAL SETTING help?',
            back: 'When students want to improve but need a plan. Example: "Want to raise GPA" → AI helps create specific weekly goals for each class.',
            emoji: '🎯'
          },
          
          // Category: The Science of Positive Thinking
          {
            id: 'science-1',
            category: 'Positive Thinking Science',
            front: '🧠 How much do test scores improve with positive self-talk?',
            back: '23% on average! That\'s like going from a C to a B just by changing how you think.',
            emoji: '🧠'
          },
          {
            id: 'science-2',
            category: 'Positive Thinking Science',
            front: '💭 What is Growth Mindset?',
            back: 'Believing abilities can improve with effort. Students with growth mindset have 40% less stress during finals!',
            emoji: '💭'
          },
          {
            id: 'science-3',
            category: 'Positive Thinking Science',
            front: '🔄 How does AI reframe negative thoughts?',
            back: '"I\'m terrible at math" → "You\'re still learning math concepts"\n"I always fail" → "You haven\'t found the right strategy yet"\n"Too hard" → "Challenging means your brain is growing!"',
            emoji: '🔄'
          },
          
          // Category: Programming Concepts
          {
            id: 'prog-1',
            category: 'Programming Concepts',
            front: '🔤 What is Natural Language Processing (NLP)?',
            back: 'Teaching computers to understand human text AND emotions. Example: "stressed about test tomorrow" → AI knows you need encouragement + study tips.',
            emoji: '🔤'
          },
          {
            id: 'prog-2',
            category: 'Programming Concepts',
            front: '😊 What is Sentiment Analysis?',
            back: 'Figuring out emotions from text. "I failed again..." (sad, needs encouragement) vs "I\'m ready to try!" (motivated, needs plan).',
            emoji: '😊'
          },
          {
            id: 'prog-3',
            category: 'Programming Concepts',
            front: '💬 What is Response Generation?',
            back: 'Creating helpful, specific responses. BAD: "Good luck!" GOOD: "Try the 20-20-20 study method I mentioned."',
            emoji: '💬'
          },
          {
            id: 'prog-4',
            category: 'Programming Concepts',
            front: '⚖️ What is Ethical AI?',
            back: 'Making AI safe and helpful. If someone mentions serious issues (depression, self-harm), AI says "talk to a counselor" not "think positive".',
            emoji: '⚖️'
          },
          
          // Category: Real-World Impact
          {
            id: 'impact-1',
            category: 'Real-World Impact',
            front: '🌍 How many students use AI counseling apps daily?',
            back: 'Over 5 million students get 24/7 support from AI counseling apps!',
            emoji: '🌍'
          },
          {
            id: 'impact-2',
            category: 'Real-World Impact',
            front: '📊 What % of users improve study habits with AI?',
            back: '78% of students improve their study habits within 3 weeks of using motivation apps!',
            emoji: '📊'
          },
          {
            id: 'impact-3',
            category: 'Real-World Impact',
            front: '🏫 How many universities use AI coaching bots?',
            back: '340+ universities worldwide! Students using them are 31% more likely to graduate.',
            emoji: '🏫'
          },
          
          // Category: The 7 Coding Steps
          {
            id: 'step-1',
            category: '7 Coding Steps',
            front: '1️⃣ Step 1: What is the advisor framework?',
            back: 'Create Python classes and methods to store different types of responses. Build the foundation!',
            emoji: '🏗️'
          },
          {
            id: 'step-2',
            category: '7 Coding Steps',
            front: '2️⃣ Step 2: What are response categories?',
            back: 'Separate sections for: Encouragement, Study Tips, Motivation, Goal Setting. Each has specialized responses.',
            emoji: '📂'
          },
          {
            id: 'step-3',
            category: '7 Coding Steps',
            front: '3️⃣ Step 3: What does the message classifier do?',
            back: 'Reads student messages and figures out what help they need. This is the AI magic - analyzing keywords and context!',
            emoji: '🔍'
          },
          {
            id: 'step-4',
            category: '7 Coding Steps',
            front: '4️⃣ Step 4: What makes good response templates?',
            back: 'Specific, actionable advice - not generic! Example: "Try 20-20-20 method" not just "study more".',
            emoji: '📝'
          },
          {
            id: 'step-5',
            category: '7 Coding Steps',
            front: '5️⃣ Step 5: How do you add personality?',
            back: 'Make AI sound like a supportive friend: add variety, appropriate humor, warmth. Use emojis and encouraging language!',
            emoji: '😊'
          },
          {
            id: 'step-6',
            category: '7 Coding Steps',
            front: '6️⃣ Step 6: What scenarios should you test?',
            back: 'Real student problems: failed tests, procrastination, test anxiety, goal setting. Test edge cases too!',
            emoji: '🧪'
          },
          {
            id: 'step-7',
            category: '7 Coding Steps',
            front: '7️⃣ Step 7: What safety features are needed?',
            back: 'Detect serious keywords (depression, self-harm). Immediately suggest talking to adults/counselors. Never try to handle serious issues alone!',
            emoji: '🛡️'
          }
        ],
        submit: {
          prompt: `**Project Showcase (15 min):** Enhance your School-Positive Advisor with one major improvement:
1) Add a new category (test anxiety, friendship issues, time management, etc.), or
2) Create a mood tracking feature that remembers conversation history, or
3) Build a safety feature that recognizes serious issues and suggests talking to adults.
**Turn in:** Working code + demo with 3 test messages + explanation of your enhancement.`,
          rubric: {
            exceeds: [
              "Enhancement demonstrates clear understanding of educational AI principles.",
              "Code includes thoughtful improvements to response quality or safety features.",
              "Demo shows advisor providing genuinely helpful, age-appropriate guidance."
            ],
            meets: [
              "Successfully added new functionality with working code.",
              "Advisor provides appropriate responses to test scenarios."
            ],
            approaching: [
              "Enhancement attempted but not fully functional or limited improvement."
            ],
            beginning: [
              "No significant enhancement or advisor doesn't provide helpful responses."
            ]
          },
          badges_on_complete: ["Python Helper", "AI Ethics Advocate"]
        }
      },
      {
        type: 'bonus',
        title: 'Classic Magic 8-Ball',
        dataset: 'fortune-responses',
        labels: ['positive', 'negative', 'neutral', 'mysterious'],
        learn_md: `## 🔐 Decode the Black Cipher's Fortune Protocol

**Agent**, you've infiltrated the mysterious Black Cipher network and discovered their ancient fortune-telling protocol. The organization once used mystical 8-Ball divination to make critical decisions, but their system holds secrets far deeper than simple yes/no answers.

### ⚫ The Black Cipher's Secret Arsenal

The Black Cipher didn't just predict the future - they **programmed** it. Their digital fortune protocol was a sophisticated information system disguised as a simple toy:

**🔴 Cipher Response Classifications**
- **POSITIVE INTEL** (10 encoded messages): "Mission confirmed", "Path is clear", "Proceed as planned"
- **NEGATIVE INTEL** (5 warning signals): "Abort mission", "Security breach detected", "Retreat immediately"
- **CLASSIFIED** (5 encrypted responses): "Intel pending", "Decode required", "Access level insufficient"

**🧠 Why These Categories Matter**
The original designers understood psychology! Most people asking questions *want* positive answers, so they weighted the responses accordingly. About 50% positive, 25% negative, 25% neutral - just enough uncertainty to keep it interesting!

### 🎮 Your Programming Challenge

You'll master these key concepts:

**📝 Lists and Random Selection**
- Store responses in Python lists and use random.choice() to select
- Example: positive_responses = ["Yes definitely!", "It is certain!"]

**🔄 While Loops and User Input**
- Create continuous interaction with while True loops
- Handle user input and exit conditions gracefully

**🎯 Conditional Logic**
- Use if/elif statements to categorize responses
- Provide different experiences based on response type

**🎨 String Formatting and User Experience**
- Use f-strings for dynamic message formatting
- Add emoji and styling for engaging interactions

### 🌟 Advanced Features to Explore

**🎭 Personality Modes**
- **Encouraging Mode**: Mostly positive responses for test anxiety
- **Realistic Mode**: Balanced responses for important decisions  
- **Mysterious Mode**: Cryptic, philosophical answers
- **Funny Mode**: Humorous, sarcastic responses

**📊 Statistics Tracking**
- Count how many positive vs negative responses you've given
- Track the most popular questions
- Display response distribution

**🕵️ Black Cipher Interface Protocol**
- Encrypted terminal animations with cipher symbols
- Decryption delay effects for authentic espionage feel
- Color-coded security levels (green=safe, red=danger, yellow=classified)

### 🔐 Cryptographic Science Behind Fortune Protocols

**Pseudorandom Cipher Generation**
The Black Cipher's fortune system uses cryptographic pseudorandom algorithms - mathematical formulas that generate unpredictable sequences essential for secure communications. Mastering randomness is critical for:
- **Covert operations** (mission outcome probability)
- **Encryption systems** (secure key generation)  
- **Intelligence analysis** (pattern recognition, data modeling)
- **Network security** (authentication protocols, secure communications)

**User Interface Design**
Even a simple command-line program requires thoughtful UX decisions:
- How do you make users feel engaged?
- What feedback confirms their input was received?
- How do you gracefully handle unexpected inputs?
- When should the program exit vs continue?

### 🎪 Creative Extensions

**🏆 Challenge Mode: Question Intelligence**
Can you make your 8-Ball respond differently based on question type?
- Yes/No questions get definitive answers
- "How" questions get process-focused responses
- "When" questions get time-related answers
- "Should I" questions get advice-style responses

**🎨 Artistic Flair**
- Add ASCII art animations
- Create "shaking" effect with delays and dots
- Use colorful emoji combinations
- Add sound effects (if running locally)

**📱 Modern Features**
- Save favorite responses to a file
- Load custom response sets from text files
- Create themed 8-Ball variations (sports, academic, career)
- Add response confidence levels

### 🌍 Real-World Applications

The programming patterns you're learning power:

**🎮 Game Development**
- Random loot drops in RPGs
- Procedural content generation
- NPC dialogue systems
- Matchmaking algorithms

**📊 Data Science**
- Statistical sampling
- Monte Carlo simulations
- A/B testing frameworks
- Random forest algorithms

**🔐 Cybersecurity**
- Cryptographic key generation
- Password creation systems
- Security testing tools
- Random audit sampling

### 🎯 Your Black Cipher Assignment

1. **Reverse-engineer the fortune protocol** with authentic cipher responses
2. **Implement security classifications** with appropriate access levels
3. **Create an encrypted interface** with covert prompts and cipher formatting
4. **Enable continuous intel gathering** with secure termination protocols
5. **Monitor and analyze response patterns** for intelligence purposes
6. **Add one advanced cipher feature** that demonstrates your hacking prowess

### 🕵️ The Cryptography of Predictability

Here's the Black Cipher's secret: Is their fortune system truly *random*? Like all digital systems, it follows deterministic algorithms. If an enemy agent knew the exact system state, they could predict every "random" response and compromise missions.

But cryptographically secure pseudorandomness is indistinguishable from true randomness. This principle is essential for:
- **Secure communications** (encrypted message keys)
- **Mission planning** (unpredictable operation timing)
- **Counter-intelligence** (randomized security protocols)

### 🔓 Ready to Crack the Cipher?

You're about to reverse-engineer a program that combines espionage, psychology, programming mastery, and covert operations. Whether agents ask tactical questions or strategic ones, your Black Cipher Fortune Protocol will provide that perfect mix of intelligence and mystery that has guided secret operations for generations.

**Time to infiltrate the digital shadows and unlock the cipher's secrets!** ⚫🔐`,
        code: {
          starter: `# 🎱 Magic 8-Ball - The Classic Fortune Teller!
# Let's recreate the nostalgic experience with Python magic!

import random
import time

class Magic8Ball:
    def __init__(self):
        # 🌟 Authentic Magic 8-Ball responses (just like the original!)
        self.positive_responses = [
            "It is certain",
            "It is decidedly so", 
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes"
        ]
        
        self.negative_responses = [
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful"
        ]
        
        self.neutral_responses = [
            "Reply hazy, try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again"
        ]
        
        # 📊 Track intelligence logs
        self.total_queries = 0
        self.intel_counts = {"positive": 0, "negative": 0, "classified": 0}
    
    def shake(self):
        """Simulate shaking the Magic 8-Ball"""
        print("🎱 *Shaking the Magic 8-Ball*")
        print("✨ . . . ✨")
        time.sleep(1)  # Add dramatic pause
        
        # Choose response category (weighted like original)
        # 50% positive, 25% negative, 25% neutral
        choice = random.randint(1, 20)
        
        if choice <= 10:  # 50% chance
            response = random.choice(self.positive_responses)
            category = "positive"
            emoji = "🌟"
        elif choice <= 15:  # 25% chance  
            response = random.choice(self.negative_responses)
            category = "negative"
            emoji = "⚠️"
        else:  # 25% chance
            response = random.choice(self.neutral_responses)
            category = "neutral"
            emoji = "🤔"
        
        # Update statistics
        self.total_questions += 1
        self.response_counts[category] += 1
        
        return response, emoji, category
    
    def show_stats(self):
        """Display usage statistics"""
        print("\\n📊 Magic 8-Ball Statistics:")
        print("=" * 30)
        print(f"Total questions asked: {self.total_questions}")
        
        if self.total_questions > 0:
            for category, count in self.response_counts.items():
                percentage = (count / self.total_questions) * 100
                print(f"{category.title()}: {count} ({percentage:.1f}%)")
    
    def display_welcome(self):
        """Show welcome message"""
        print("🎱" * 15)
        print("     MAGIC 8-BALL ORACLE     ")
        print("🎱" * 15)
        print("\\n🔮 Ask me any yes/no question!")
        print("✨ I'll reveal the answer from beyond...")
        print("💡 Type 'stats' to see response statistics")
        print("🚪 Type 'quit' when you're done")
        print()

# 🎮 Main game loop
def play_magic_8_ball():
    ball = Magic8Ball()
    ball.display_welcome()
    
    while True:
        # Get user question
        question = input("🔮 What do you want to know? ").strip()
        
        # Handle special commands
        if question.lower() == 'quit':
            print("\\n🎱 Thanks for consulting the Magic 8-Ball!")
            ball.show_stats()
            print("✨ May your future be bright! ✨")
            break
        elif question.lower() == 'stats':
            ball.show_stats()
            print()
            continue
        elif not question:
            print("🤨 The Magic 8-Ball needs a question to answer!")
            continue
        
        # Get mystical response
        response, emoji, category = ball.shake()
        
        # Display answer with style
        print(f"\\n{emoji} The Magic 8-Ball says:")
        print(f"✨ \\"{response}\\" ✨")
        print()

# 🚀 Run the Magic 8-Ball!
if __name__ == "__main__":
    play_magic_8_ball()

# 🎯 YOUR CHALLENGES:
# 1) Run the code and ask it some questions!
# 2) Add more personality with custom responses
# 3) Create different "modes" (encouraging, funny, mysterious)
# 4) Add ASCII art or animation effects
# 5) Make it respond differently to different question types
# 6) Save questions and answers to a file
    
print("\\n💡 Ready to enhance your Magic 8-Ball? The magic is in your hands!")`,
        },
        tests_ui: [
          {
            id: 'magic_8_ball_works',
            desc: "Ran the Magic 8-Ball and asked at least 5 different questions."
          },
          {
            id: 'statistics_checked',
            desc: "Used the 'stats' command to view response distribution."
          },
          {
            id: 'responses_enhanced',
            desc: "Added at least 3 new responses to any category or created a new response mode."
          },
          {
            id: 'user_experience_improved',
            desc: "Enhanced the user interface with better formatting, colors, or animations."
          },
          {
            id: 'creative_feature_added',
            desc: "Implemented one creative feature (question analysis, themed modes, file saving, etc.)."
          }
        ],
        quiz: {
          questions: [
            {
              prompt: "Why does the Magic 8-Ball use weighted randomness (50% positive, 25% negative, 25% neutral)?",
              options: ["To save memory", "Because people prefer optimistic responses", "To make it run faster", "To use fewer responses"],
              answer_index: 1
            },
            {
              prompt: "What is the difference between 'true random' and 'pseudorandom' numbers?",
              options: ["No difference", "Pseudorandom follows mathematical algorithms, true random is unpredictable", "True random is faster", "Pseudorandom uses more memory"],
              answer_index: 1
            },
            {
              prompt: "Which programming concept is most important for the Magic 8-Ball's core functionality?",
              options: ["File handling", "Random selection from lists", "Database connections", "Web requests"],
              answer_index: 1
            },
            {
              prompt: "How does tracking statistics enhance the user experience?",
              options: ["It makes the program bigger", "Users can see patterns in their question habits", "It uses more CPU", "It requires internet access"],
              answer_index: 1
            }
          ]
        },
        checklist: [
          "I understand how random.choice() selects items from lists.",
          "I can explain why the Magic 8-Ball uses weighted response categories.",
          "I successfully added new features to enhance user experience.",
          "I tested the program with various types of questions.",
          "I can identify real-world applications of random number generation."
        ],
        submit: {
          prompt: `**📝 Magic 8-Ball Portfolio Homework (60 minutes)**

**PART 1: Personal Enhancement Project (25 min)**
Transform your Magic 8-Ball with ONE major feature:

🎯 **Option A: Themed Magic 8-Balls**
- Create 3 specialized versions (Study Buddy Ball, Sports Oracle, Future Career Guide)
- Each with custom responses matching the theme
- Document why you chose these themes

🧠 **Option B: Smart Question Analysis** 
- Make responses adapt to question types ("Will I...?", "Should I...?", "What if...?")
- Add confidence levels to responses ("Very likely", "Probably not")
- Track and display question patterns

💾 **Option C: Data Persistence System**
- Save all questions and answers to a text file
- Load custom response sets from files
- Create a "My History" feature showing past predictions

🎨 **Option D: Interactive Experience**
- Add ASCII art animations and visual effects
- Include typing animations and suspense building
- Create themed user interfaces with colors and emojis

**PART 2: Portfolio Documentation (20 min)**
Create a digital portfolio entry including:
- 📸 **Screenshots** of your Magic 8-Ball in action
- 💻 **Code Explanation** highlighting your key additions
- 🎨 **Creative Choices** explaining your design decisions
- 📊 **Data Analysis** (if you chose persistence option)
- 🤔 **Reflection** on what you learned about randomness and programming

**PART 3: Peer Comparison Preparation (15 min)**
Prepare to share with classmates:
- 🏆 **Feature Demo** - Quick 2-minute demonstration
- 💡 **Inspiration Board** - What inspired your theme/approach?
- 🔍 **Technical Highlight** - One cool coding technique you're proud of
- 🎯 **Future Ideas** - How would you enhance it further?

**📤 PORTFOLIO SUBMISSION:**
Submit to your digital portfolio with hashtags: #MagicBall #Week2 #PythonProject
Include: Enhanced code, documentation, screenshots, and reflection essay.

**🤝 PEER INTERACTION:**
Next class: Gallery walk where students browse each other's portfolios, leave positive comments, and vote on "Most Creative Theme," "Best Code Innovation," and "Coolest Visual Design."`,
          rubric: {
            exceeds: [
              "Enhancement shows deep understanding of programming concepts and user experience design.",
              "Code demonstrates creative problem-solving and attention to detail.",
              "Feature adds genuine value and showcases technical skills learned."
            ],
            meets: [
              "Successfully implemented chosen enhancement with working functionality.",
              "Code is well-organized and demonstrates understanding of key concepts."
            ],
            approaching: [
              "Enhancement attempted but partially functional or limited in scope."
            ],
            beginning: [
              "Minimal changes made or enhancement doesn't work as intended."
            ]
          },
          badges_on_complete: ["Python Wizard", "Creative Coder"]
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